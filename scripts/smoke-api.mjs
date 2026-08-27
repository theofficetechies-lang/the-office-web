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
  entryPoints: ["api/brief.ts", "api/health.ts"],
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
    end() {
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
  await brief(req({ method: "OPTIONS", origin: "https://the-office-test4.vercel.app" }), res);
  check("OPTIONS → 204 with CORS header", res.statusCode === 204 && res.headers["access-control-allow-origin"] === "https://the-office-test4.vercel.app", `status=${res.statusCode} acao=${res.headers["access-control-allow-origin"]}`);
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

if (failures > 0) {
  console.error(`\n${failures} API check(s) failed.`);
  process.exit(1);
}
console.log("\nAll API handler checks passed.");
