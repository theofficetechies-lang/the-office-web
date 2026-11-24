/**
 * Lead persistence (Phase 4, D4).
 *
 * Before this, a brief was emailed and then forgotten: it could not be counted,
 * filtered, followed up, or exported. The pipeline in §9 of the brief needs rows in
 * a table, so this is that table.
 *
 * Storage is Postgres (Neon) — the client's decision in audit §4c.2 — over HTTP,
 * not a socket: the `postgres` driver does not suit serverless cold starts and
 * Vercel's edge/Hobby posture, and a query string leaves no connection to leak.
 *
 * ---------------------------------------------------------------------------
 * The rule this module exists to enforce
 * ---------------------------------------------------------------------------
 * If `DATABASE_URL` is not configured, a brief must NOT be reported as saved. The
 * standing project rule is that nothing may look like it stores data until it does.
 * So `persistLead` returns a result that distinguishes "stored" from "no database",
 * and the brief handler passes that distinction to the client, which continues to
 * say "we have your brief" only when it is true.
 */
import { sanitizeText } from "./validate.js";

/** Pipeline stages from brief §9. A new lead always starts here. */
export const LEAD_STAGES = [
  "new_inquiry",
  "lead_received",
  "initial_review",
  "qualified",
  "consultation_scheduled",
  "proposal_sent",
  "negotiation",
  "approved",
  "in_progress",
  "completed",
  "follow_up",
  "closed",
] as const;

export type LeadStage = (typeof LEAD_STAGES)[number];

export interface LeadRow {
  name: string;
  email: string;
  org: string | null;
  /** Division or service the visitor asked about. */
  interest: string | null;
  /** Human-labelled services, comma joined. */
  services: string | null;
  timeline: string | null;
  scope: string | null;
  budget: string | null;
  discovery: string | null;
  brief: string;
  /** Where the request came from, for attribution. */
  source: string | null;
}

export type PersistResult =
  | { status: "stored"; id: string }
  | { status: "not_configured" }
  | { status: "failed"; reason: string };

/**
 * Minimal surface the rest of the code needs. Kept as an interface so the handler
 * can be tested against an in-memory store — a test that needs a real database is
 * a test that does not run in CI.
 */
export interface LeadStore {
  insert(lead: LeadRow): Promise<{ id: string }>;
  list(options?: { limit?: number; stage?: LeadStage }): Promise<StoredLead[]>;
  count(): Promise<number>;
}

export interface StoredLead extends LeadRow {
  id: string;
  stage: LeadStage;
  created_at: string;
}

/**
 * Neon HTTP endpoint, derived from the standard connection string.
 *
 * `postgres://user:pass@host/db` → `https://host/sql`. The password is not sent:
 * Neon's HTTP driver authenticates with the connection string as a parameter, so
 * the same secret stays in one place and never appears in a URL that could be
 * logged.
 */
function neonEndpoint(databaseUrl: string): string | null {
  try {
    const url = new URL(databaseUrl);
    const host = url.hostname;
    if (!host) return null;
    return `https://${host}/sql`;
  } catch {
    return null;
  }
}

/**
 * Execute one parameterised statement over Neon's HTTP interface.
 *
 * Values are passed as `$1..$n`, never interpolated. Every field has already been
 * length-capped and sanitised by the caller, and parameterisation means a brief
 * containing quotes or `; DROP TABLE` is just text.
 */
async function query<T>(
  databaseUrl: string,
  sql: string,
  params: unknown[]
): Promise<T[]> {
  const endpoint = neonEndpoint(databaseUrl);
  if (!endpoint) throw new Error("DATABASE_URL is not a usable connection string");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Neon-Connection-String": databaseUrl,
    },
    body: JSON.stringify({ query: sql, params }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`database rejected the query (${response.status}): ${detail.slice(0, 200)}`);
  }

  const body = (await response.json()) as { rows?: T[] };
  return body.rows ?? [];
}

/** Migrations run by `npm run db:migrate`; this is the table they create. */
export const LEADS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  name        text NOT NULL,
  email       text NOT NULL,
  org         text,
  interest    text,
  services    text,
  timeline    text,
  scope       text,
  budget      text,
  discovery   text,
  brief       text NOT NULL,
  source      text,
  stage       text NOT NULL DEFAULT 'new_inquiry'
);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_stage_idx ON leads (stage);
`;

export function createPostgresLeadStore(databaseUrl: string): LeadStore {
  return {
    async insert(lead) {
      const rows = await query<{ id: string }>(
        databaseUrl,
        `INSERT INTO leads (name, email, org, interest, services, timeline, scope, budget, discovery, brief, source)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         RETURNING id`,
        [
          lead.name,
          lead.email,
          lead.org,
          lead.interest,
          lead.services,
          lead.timeline,
          lead.scope,
          lead.budget,
          lead.discovery,
          lead.brief,
          lead.source,
        ]
      );
      if (!rows[0]?.id) throw new Error("insert returned no id");
      return { id: rows[0].id };
    },

    async list({ limit = 100, stage } = {}) {
      const capped = Math.min(Math.max(limit, 1), 500);
      return stage
        ? await query<StoredLead>(
            databaseUrl,
            `SELECT * FROM leads WHERE stage = $1 ORDER BY created_at DESC LIMIT $2`,
            [stage, capped]
          )
        : await query<StoredLead>(
            databaseUrl,
            `SELECT * FROM leads ORDER BY created_at DESC LIMIT $1`,
            [capped]
          );
    },

    async count() {
      const rows = await query<{ n: string }>(databaseUrl, `SELECT count(*)::text AS n FROM leads`, []);
      return Number(rows[0]?.n ?? 0);
    },
  };
}

/* ------------------------------------------------------------------ */
/* In-memory store — for tests and for local work without a database   */
/* ------------------------------------------------------------------ */

/**
 * Not used in production. It exists so the API suite can prove the handler stores,
 * lists and counts correctly without a database in CI, and so a developer without
 * `DATABASE_URL` can exercise the admin list locally — with the crucial difference
 * that production refuses to claim a lead was stored when it was not.
 */
export function createMemoryLeadStore(): LeadStore & { reset(): void } {
  let rows: StoredLead[] = [];
  let seq = 0;
  return {
    async insert(lead) {
      seq += 1;
      const id = `mem-${seq}`;
      rows.unshift({
        ...lead,
        id,
        stage: "new_inquiry",
        created_at: new Date().toISOString(),
      });
      return { id };
    },
    async list({ limit = 100, stage } = {}) {
      const capped = Math.min(Math.max(limit, 1), 500);
      return rows
        .filter((r) => (stage ? r.stage === stage : true))
        .slice(0, capped);
    },
    async count() {
      return rows.length;
    },
    reset() {
      rows = [];
      seq = 0;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Resolution + normalisation                                          */
/* ------------------------------------------------------------------ */

/**
 * Pick a store from the environment.
 *
 * Returns null when there is no database configured — deliberately distinct from a
 * store that exists and fails. "Not configured" is an expected deployment state with
 * its own honest message; "failed" is an incident that must be loud.
 */
/**
 * The memory store is a module singleton on purpose.
 *
 * A fresh store per call would mean the brief handler writes to one Map and the
 * admin endpoint reads from another — rows silently vanishing between two calls
 * that both "succeeded". This was caught by the API suite, which wrote three leads
 * and then read back zero.
 */
let memoryStore: (LeadStore & { reset(): void }) | null = null;

export function resolveLeadStore(env: NodeJS.ProcessEnv = process.env): LeadStore | null {
  if (env.LEAD_STORE === "memory") {
    /*
     * Hung off globalThis, not a module variable.
     *
     * The API is bundled one file per endpoint, so brief.js and leads.js each get
     * their own copy of this module — a module-level Map would be two Maps, and an
     * admin read would find nothing that the brief handler had just written. A
     * module singleton passed its own tests and failed the integration between two
     * endpoints, which is exactly why both are driven in the same suite.
     *
     * This is test/local scaffolding only; Postgres is unaffected.
     */
    const g = globalThis as { __leadMemoryStore?: LeadStore & { reset(): void } };
    g.__leadMemoryStore ??= createMemoryLeadStore();
    memoryStore = g.__leadMemoryStore;
    return memoryStore;
  }
  const url = env.DATABASE_URL;
  if (!url || !url.trim()) return null;
  return createPostgresLeadStore(url);
}

/**
 * Turn a validated brief into a row.
 *
 * Every value is length-capped and stripped of markup again here rather than
 * trusting the schema alone: the schema protects this handler, but a row could also
 * be written by a future caller, and a stored XSS is permanent.
 */
export function toLeadRow(input: {
  name: string;
  email: string;
  org?: string;
  service?: string;
  interest?: string;
  timeline?: string;
  scope?: string;
  budget?: string;
  discovery?: string;
  brief: string;
}, source?: string): LeadRow {
  const clean = (v: string | undefined, max: number): string | null => {
    if (!v) return null;
    const s = sanitizeText(v).trim().slice(0, max);
    return s.length ? s : null;
  };

  return {
    name: sanitizeText(input.name).trim().slice(0, 100),
    email: input.email.trim().toLowerCase().slice(0, 254),
    org: clean(input.org, 200),
    interest: clean(input.interest, 60),
    services: clean(input.service, 200),
    timeline: clean(input.timeline, 80),
    scope: clean(input.scope, 120),
    budget: clean(input.budget, 50),
    discovery: clean(input.discovery, 100),
    brief: sanitizeText(input.brief).trim().slice(0, 5000),
    source: clean(source, 120),
  };
}

/** Store a lead, never throwing: the caller decides what a failure means. */
export async function persistLead(
  store: LeadStore | null,
  lead: LeadRow
): Promise<PersistResult> {
  if (!store) return { status: "not_configured" };
  try {
    const { id } = await store.insert(lead);
    return { status: "stored", id };
  } catch (err) {
    return { status: "failed", reason: (err as Error).message };
  }
}
