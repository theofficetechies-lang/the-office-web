/**
 * Smoke test for the serverless handlers. Bundles api/*.ts with esbuild and
 * drives the real handlers with mock req/res objects — no network, no Vercel.
 *
 *   npm run smoke:api
 *
 * Covers: method handling, the CORS allowlist, the honeypot short-circuit, Zod
 * validation (including the new `scope` and multi-service fields), IP rate
 * limiting, and the "no provider configured" path that must fail loudly rather
 * than pretend a brief was delivered.
 */
import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

await build({
  entryPoints: ["api/brief.ts", "api/health.ts", "api/paystack.ts", "api/leads.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outdir: "dist-ssr-api",
  external: ["resend"],
  absWorkingDir: root,
  logLevel: "warning",
});

const brief = (await import(path.join(root, "dist-ssr-api/brief.js"))).default;
const health = (await import(path.join(root, "dist-ssr-api/health.js"))).default;
const paystack = (await import(path.join(root, "dist-ssr-api/paystack.js"))).default;
const leadsEndpoint = (await import(path.join(root, "dist-ssr-api/leads.js"))).default;

function mockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(k, v) {
      this.headers[k.toLowerCase()] = v;
      return this;
    },
    status(c) {
      this.statusCode = c;
      return this;
    },
    json(o) {
      this.body = o;
      return this;
    },
    end(x) {
      if (typeof x === "string") {
        try { this.body = JSON.parse(x); } catch { this.body = x; }
      }
      return this;
    },
  };
}

let ipCounter = 0;
const req = ({ method = "POST", body = {}, origin, ip } = {}) => ({
  method,
  body,
  headers: {
    ...(origin ? { origin } : {}),
    "x-forwarded-for": ip ?? `10.0.0.${++ipCounter}`,
  },
});

const validBrief = {
  name: "Test Person",
  email: "test@example.com",
  org: "Example Press",
  service: "Book Strategy, Automation",
  timeline: "1–3 months",
  scope: "Full engagement — strategy through build",
  budget: "$15k – $40k",
  discovery: "Search",
  brief: "We need help repositioning a backlist title before the spring list is locked.",
  company_website: "",
};

let failures = 0;
function check(label, condition, detail = "") {
  if (condition) {
    console.log(`✓ ${label}`);
  } else {
    failures++;
    console.error(`✗ ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

// 1. Preflight
{
  const res = mockRes();
  await brief(req({ method: "OPTIONS", origin: "https://www.the-office360.com" }), res);
  check("OPTIONS → 204 with CORS header", res.statusCode === 204 && res.headers["access-control-allow-origin"] === "https://www.the-office360.com", `status=${res.statusCode} acao=${res.headers["access-control-allow-origin"]}`);
}

// 2. Disallowed origin
{
  const res = mockRes();
  await brief(req({ body: validBrief, origin: "https://not-allowed.example" }), res);
  check("Disallowed origin → 403", res.statusCode === 403, `status=${res.statusCode}`);
  check("Disallowed origin sets no ACAO header", !res.headers["access-control-allow-origin"]);
}

// 3. Wrong method
{
  const res = mockRes();
  await brief(req({ method: "GET" }), res);
  check("GET /api/brief → 405", res.statusCode === 405, `status=${res.statusCode}`);
}

// 4. Honeypot
{
  const res = mockRes();
  await brief(req({ body: { ...validBrief, company_website: "http://spam.example" } }), res);
  check("Honeypot filled → silent 200", res.statusCode === 200 && res.body.success === true, `status=${res.statusCode}`);
}

// 5. Validation failure
{
  const res = mockRes();
  await brief(req({ body: { ...validBrief, name: "", email: "not-an-email" } }), res);
  const paths = (res.body.issues ?? []).map((i) => i.path).sort().join(",");
  check("Invalid body → 400 with issues", res.statusCode === 400, `status=${res.statusCode}`);
  check("Issues name the offending fields", paths === "email,name", `paths=${paths}`);
}

// 6. Valid body with the new fields, no provider configured → 503, not a fake 200
{
  const res = mockRes();
  await brief(req({ body: validBrief }), res);
  check(
    "Valid brief, no provider → 503 (never a false success)",
    res.statusCode === 503 && res.body.success === false,
    `status=${res.statusCode} body=${JSON.stringify(res.body)}`
  );
  check("Rate-limit headers present", res.headers["x-ratelimit-limit"] === "5", `limit=${res.headers["x-ratelimit-limit"]}`);
}

// 7. Rate limiting
{
  const ip = "203.0.113.9";
  const codes = [];
  for (let i = 0; i < 6; i++) {
    const res = mockRes();
    await brief(req({ body: validBrief, ip }), res);
    codes.push(res.statusCode);
  }
  check(
    "6th request from one IP → 429",
    codes.slice(0, 5).every((c) => c === 503) && codes[5] === 429,
    `codes=${codes.join(",")}`
  );
}

// 8. Health reflects the configured delivery path
{
  const degraded = mockRes();
  await health({ method: "GET", headers: {} }, degraded);
  check("Health without providers → 503 degraded", degraded.statusCode === 503 && degraded.body.status === "degraded", `status=${degraded.statusCode}`);

  process.env.WEB3FORMS_KEY = "test-key";
  process.env.TO_EMAIL = "theofficetechies@gmail.com";
  const ok = mockRes();
  await health({ method: "GET", headers: {} }, ok);
  check("Health with Web3Forms + TO_EMAIL → 200 ok", ok.statusCode === 200 && ok.body.status === "ok", `status=${ok.statusCode} body=${JSON.stringify(ok.body)}`);

  const badMethod = mockRes();
  await health({ method: "POST", headers: {} }, badMethod);
  check("Health POST → 405", badMethod.statusCode === 405, `status=${badMethod.statusCode}`);
}

// Paystack verify: unconfigured -> 503 {configured:false}; wrong method -> 405
{
  const un = mockRes();
  await paystack({ method: "POST", body: { reference: "x" }, headers: {} }, un);
  check("paystack verify without secret -> 503 configured:false", un.statusCode === 503 && un.body.configured === false, `status=${un.statusCode}`);
  const diag = mockRes();
  await paystack({ method: "GET", body: {}, headers: {} }, diag);
  check("paystack GET -> diagnostics", diag.statusCode === 200 && diag.body.ok === true, `status=${diag.statusCode}`);

  // initialize path with a fake secret + mocked fetch must not crash
  process.env.PAYSTACK_SECRET_KEY = "sk_test_fake";
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    json: async () => ({ data: { authorization_url: "https://checkout.paystack.com/xyz" } }),
  });
  const init = mockRes();
  await paystack({ method: "POST", body: { slug: "working-session", email: "a@b.com" }, headers: {} }, init);
  globalThis.fetch = realFetch;
  delete process.env.PAYSTACK_SECRET_KEY;
  check("paystack initialize returns checkout url (no crash)", init.statusCode === 200 && init.body.url?.includes("checkout.paystack.com"), `status=${init.statusCode}`);
}


/* ------------------------------------------------------------------ */
/* Lead persistence (Phase 4, D4)                                      */
/* ------------------------------------------------------------------ */
/*
 * The rule under test throughout: a brief may never be reported as saved unless it
 * actually was. "Not configured" and "stored" must be distinguishable to the caller,
 * because conflating them is how a studio ends up believing it has a pipeline when
 * it has an inbox.
 */
{
  const body = {
    name: "Ada Lovelace",
    email: "ADA@Example.COM",
    org: "Analytical Engines",
    service: "Websites & platforms",
    interest: "website-development",
    timeline: "Q1",
    scope: "New build",
    budget: "$25k–$50k",
    discovery: "Search",
    brief: "We need a corporate site that <script>alert(1)</script> converts.",
    company_website: "",
  };

  // 1. No database, no provider -> the brief was NOT kept, so say so.
  delete process.env.DATABASE_URL;
  delete process.env.LEAD_STORE;
  delete process.env.WEB3FORMS_KEY;
  const unconfigured = mockRes();
  await brief({ method: "POST", body, headers: { "x-forwarded-for": "10.0.0.1" } }, unconfigured);
  check(
    "brief with no storage and no provider → 503, not a false success",
    unconfigured.statusCode === 503 && unconfigured.body?.success === false,
    `status=${unconfigured.statusCode} body=${JSON.stringify(unconfigured.body)}`
  );
  /*
   * The negative that matters: with no database the response must not carry
   * `stored: true`. Asserting only that the *stored* case says true lets a handler
   * that always claims success pass, which is the exact lie this phase exists to
   * prevent. Both directions are asserted.
   */
  check(
    "brief with no storage never claims stored:true",
    unconfigured.body?.stored !== true,
    `stored=${JSON.stringify(unconfigured.body?.stored)}`
  );
  const noStoreProvider = mockRes();
  await brief({ method: "POST", body, headers: { "x-forwarded-for": "10.0.0.2" } }, noStoreProvider);
  check(
    "a delivered-but-unstored brief reports stored:false",
    noStoreProvider.statusCode === 503 && noStoreProvider.body?.stored !== true,
    `status=${noStoreProvider.statusCode} stored=${JSON.stringify(noStoreProvider.body?.stored)}`
  );

  // 2. Storage configured, provider not -> stored, and the response says stored:true.
  process.env.LEAD_STORE = "memory";
  const stored = mockRes();
  await brief({ method: "POST", body, headers: { "x-forwarded-for": "10.0.0.3" } }, stored);
  check(
    "brief with storage but no provider → 200 stored:true",
    stored.statusCode === 200 && stored.body?.success === true && stored.body?.stored === true,
    `status=${stored.statusCode} body=${JSON.stringify(stored.body)}`
  );
  check(
    "a stored brief is given a lead id",
    typeof stored.body?.leadId === "string" && stored.body.leadId.length > 0,
    `leadId=${stored.body?.leadId}`
  );

  // 3. With a provider, a stored brief still reports stored:true.
  process.env.WEB3FORMS_KEY = "test-key";
  const realFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({ success: true }) });
  const delivered = mockRes();
  await brief({ method: "POST", body, headers: { "x-forwarded-for": "10.0.0.4" } }, delivered);
  check(
    "brief delivered AND stored reports both",
    delivered.statusCode === 200 && delivered.body?.stored === true && delivered.body?.success === true,
    `status=${delivered.statusCode} body=${JSON.stringify(delivered.body)}`
  );

  // 4. Provider fails but the row is safe -> success, not "please start over".
  globalThis.fetch = async () => ({ ok: false, status: 500, json: async () => ({ success: false }) });
  const mailFailed = mockRes();
  await brief({ method: "POST", body, headers: { "x-forwarded-for": "10.0.0.5" } }, mailFailed);
  globalThis.fetch = realFetch;
  delete process.env.WEB3FORMS_KEY;
  check(
    "email failure after a successful store → 200 (the lead is not lost)",
    mailFailed.statusCode === 200 && mailFailed.body?.stored === true,
    `status=${mailFailed.statusCode} body=${JSON.stringify(mailFailed.body)}`
  );

  /*
   * 4b. Provider succeeds, no database.
   *
   * This is the one path where a handler could claim `stored: true` while nothing
   * was kept, and it was uncovered: the earlier "no storage" case returned 503
   * before reaching the stored flag, so a deliberately broken handler passed the
   * whole suite. Delivery still works here, so the answer is a success -- but with
   * stored:false, because the email is not a record.
   */
  delete process.env.LEAD_STORE;
  delete process.env.DATABASE_URL;
  process.env.WEB3FORMS_KEY = "test-key";
  globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({ success: true }) });
  const deliveredNoStore = mockRes();
  await brief({ method: "POST", body, headers: { "x-forwarded-for": "10.0.0.6" } }, deliveredNoStore);
  globalThis.fetch = realFetch;
  delete process.env.WEB3FORMS_KEY;
  check(
    "a delivered brief with no database reports stored:false",
    deliveredNoStore.statusCode === 200 &&
      deliveredNoStore.body?.success === true &&
      deliveredNoStore.body?.stored === false,
    `status=${deliveredNoStore.statusCode} body=${JSON.stringify(deliveredNoStore.body)}`
  );
  process.env.LEAD_STORE = "memory";

  // 5. The stored row is sanitised and normalised, not raw.
  const listUnauthed = mockRes();
  await leadsEndpoint({ method: "GET", headers: {}, query: {} }, listUnauthed);
  check(
    "lead list refuses to serve without a configured passcode",
    listUnauthed.statusCode === 503 && listUnauthed.body?.code === "admin_not_configured",
    `status=${listUnauthed.statusCode} body=${JSON.stringify(listUnauthed.body)}`
  );

  process.env.ADMIN_PASSCODE = "correct horse";
  const wrong = mockRes();
  await leadsEndpoint({ method: "GET", headers: { "x-admin-passcode": "wrong" }, query: {} }, wrong);
  check(
    "lead list rejects a wrong passcode with 401",
    wrong.statusCode === 401,
    `status=${wrong.statusCode}`
  );

  const right = mockRes();
  await leadsEndpoint({ method: "GET", headers: { "x-admin-passcode": "correct horse" }, query: {} }, right);
  check(
    "lead list serves leads with the right passcode",
    right.statusCode === 200 && Array.isArray(right.body?.leads) && right.body.total >= 3,
    `status=${right.statusCode} total=${right.body?.total}`
  );

  const row = right.body?.leads?.find((l) => l.email === "ada@example.com");
  check(
    "stored lead is lowercased and its brief is stripped of markup",
    Boolean(row) && row.brief.includes("converts") && !row.brief.includes("<script"),
    `row=${JSON.stringify(row && { email: row.email, brief: row.brief })}`
  );
  check(
    "stored lead keeps its pathway for attribution",
    row?.interest === "website-development",
    `interest=${row?.interest}`
  );
  check(
    "stored lead starts at the first pipeline stage",
    row?.stage === "new_inquiry",
    `stage=${row?.stage}`
  );

  const badStage = mockRes();
  await leadsEndpoint(
    { method: "GET", headers: { "x-admin-passcode": "correct horse" }, query: { stage: "nonsense" } },
    badStage
  );
  check(
    "lead list rejects an unknown pipeline stage",
    badStage.statusCode === 400,
    `status=${badStage.statusCode}`
  );

  delete process.env.ADMIN_PASSCODE;
  delete process.env.LEAD_STORE;
}

if (failures > 0) {
  console.error(`\n${failures} API check(s) failed.`);
  process.exit(1);
}
console.log("\nAll API handler checks passed.");
