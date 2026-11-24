/**
 * Create the leads table (Phase 4).
 *
 *   DATABASE_URL=postgres://… npm run db:migrate
 *
 * Idempotent: `CREATE TABLE IF NOT EXISTS` plus `CREATE INDEX IF NOT EXISTS`, so it
 * is safe to run on every deploy and safe to re-run after a partial failure. It does
 * not drop anything, ever — a migration that can destroy a lead store has no place
 * in a studio's deploy script.
 */
/*
 * The DDL is duplicated from api/_lib/leads.ts on purpose.
 *
 * That module imports `./validate.js`, which is correct for the bundled API but not
 * resolvable by Node's `--experimental-strip-types`, which does not rewrite `.js` to
 * `.ts`. Importing it here would make the migration depend on the bundler's module
 * resolution. A drift check in scripts/test-content.ts asserts the two copies match,
 * so the duplication cannot rot.
 */
const LEADS_TABLE_SQL = `
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

const url = process.env.DATABASE_URL;

if (!url || !url.trim()) {
  console.error(
    [
      "DATABASE_URL is not set.",
      "",
      "Set it to the Neon connection string (Project → Connection Details → the",
      "`postgres://…` URI), then run again:",
      "",
      "    DATABASE_URL='postgres://…' npm run db:migrate",
    ].join("\n")
  );
  process.exit(1);
}

let endpoint: string;
try {
  const parsed = new URL(url);
  endpoint = `https://${parsed.hostname}/sql`;
} catch {
  console.error("DATABASE_URL is not a valid URL.");
  process.exit(1);
}

/*
 * One statement per request: Neon's HTTP endpoint runs a single query per call, so
 * the DDL is split rather than sent as a batch. Splitting on ";" at the top level is
 * safe here because the only SQL in this file is the constant above, which contains
 * no semicolons inside literals.
 */
const statements = LEADS_TABLE_SQL.split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

/** Network failures should read as a diagnosis, not a stack trace. */
async function send(query: string): Promise<Response> {
  try {
    return await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Neon-Connection-String": url as string,
      },
      body: JSON.stringify({ query, params: [] }),
    });
  } catch (err) {
    console.error(`✗ could not reach the database host: ${(err as Error).message}`);
    console.error("  Check DATABASE_URL, and that this machine can reach the host.");
    process.exit(1);
  }
}

let applied = 0;
for (const query of statements) {
  const response = await send(query);

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error(`✗ migration failed (${response.status}): ${detail.slice(0, 300)}`);
    console.error(`  statement: ${query.slice(0, 120)}…`);
    process.exit(1);
  }
  applied += 1;
}

/* Verify the table is real rather than trusting the statements' exit codes. */
const verify = await send(
  "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'leads' ORDER BY ordinal_position"
);

if (!verify.ok) {
  console.error(`✗ could not verify the table (${verify.status})`);
  process.exit(1);
}

const { rows } = (await verify.json()) as {
  rows?: { column_name: string; data_type: string }[];
};

if (!rows || rows.length === 0) {
  console.error("✗ the leads table does not exist after migration");
  process.exit(1);
}

console.log(`✓ ${applied} statement(s) applied`);
console.log(`✓ leads table has ${rows.length} columns:`);
for (const row of rows) console.log(`    ${row.column_name.padEnd(14)} ${row.data_type}`);
console.log("\nSet DATABASE_URL and ADMIN_PASSCODE on the deployment to activate the pipeline.");
