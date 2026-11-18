/**
 * Smoke test: renders every route through the real App tree in Node and
 * asserts the things that matter — that each route resolves, that the Phase
 * sections exist, and that the fabricated content removed in this pass stays
 * removed.
 *
 *   npm run smoke
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

execSync("npx vite build --ssr src/entry-ssr.tsx --outDir dist-ssr --logLevel warn", {
  cwd: root,
  stdio: "inherit",
});

const store = new Map();
globalThis.window = {
  location: { pathname: "/" },
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, v),
  },
  matchMedia: () => ({ matches: false }),
  addEventListener: () => {},
  removeEventListener: () => {},
  scrollTo: () => {},
};

const { render } = await import(path.join(root, "dist-ssr/entry-ssr.js"));

const cases = [
  {
    route: "/",
    must: [
      "We do the work",
      "Five services. One analytical method.",
      "What the work looks like when it is done properly.",
      "Six stages. Then we bend them to fit the brief.",
      "Eight things that are true about how we work.",
      "A studio of four, by design.",
      "Send us the",
      "WHAT DO YOU NEED FROM US?",
      "SHAPE OF THE WORK",
      "BUDGET RANGE (OPTIONAL)",
      "HOW DID YOU FIND US?",
      "Amazon SEO Performance Report",
      "skip-link",
      "col-span-10 reveal",
      "aria-label=\"Project brief\"",
      "Six stages. Then we bend them to fit the brief.",
      "Eight things that are true about how we work.",
      // Three confirmed principals (names as supplied 27 Aug 2026).
      "Brain J. Fiore",
      "Henri Will",
      "Collen Johnstone",
      "/team/brain-j-fiore.jpg",
      "/team/henri-will.jpg",
      "/team/collen-johnstone.jpg",
      "Morrison Desmond",
      "/team/morrison-desmond.jpg",
    ],
    mustNot: [
      "Samantha Dion",
      "Marcus Kowalski",
      "Lena Park",
      "James Reid",
      "ACTIVE&nbsp;142",
      "ACTIVE 142",
      "Illustrative · composite",
      "minimal analytics",
      "theoffice.studio",
    ],
  },
  {
    route: "/notes",
    must: [
      "Notes on the work.",
      "/notes/what-book-positioning-actually-means",
      "/notes/why-most-author-websites-fail",
      "/notes/how-to-audit-your-own-amazon-listing",
    ],
    mustNot: ["Read Full Essay"],
  },
  {
    route: "/notes/how-to-audit-your-own-amazon-listing",
    must: ["How to audit your own Amazon listing", "Key takeaway", "ALL NOTES"],
    mustNot: [],
  },
  {
    route: "/work/debut-novel-repositioning",
    must: [
      "Repositioning a debut literary novel for a US trade house",
      "1 / PROBLEM",
      "2 / STRATEGY",
      "3 / EXECUTION",
      "4 / MEASUREMENT",
      "5 / LEARNING",
      "Engagement pattern",
    ],
    mustNot: ["led the publisher", "Acquired quickly"],
  },
  { route: "/privacy", must: ["Privacy notice.", "Web3Forms"], mustNot: ["theoffice.studio"] },
  { route: "/terms", must: ["Terms of service.", "this website"], mustNot: ["theoffice.studio (the"] },
  {
    route: "/work/not-a-real-engagement",
    must: ["That case study is not in the archive."],
    mustNot: [],
  },
  {
    route: "/this-does-not-exist",
    must: ["This document is not in the archive.", "REQUESTED: /this-does-not-exist"],
    mustNot: [],
  },
  { route: "/services/book-positioning", must: ["Strategic Book Positioning", "WHAT WE ANALYZE", "WHAT YOU RECEIVE"], mustNot: [] },
  { route: "/press", must: ["media kit.", "STUDIO FACTS"], mustNot: [] },
  { route: "/glossary", must: ["The vocabulary of the trade.", "Positioning"], mustNot: [] },
  { route: "/demos", must: ["See the work, not the promises.", "Start here", "How we position a book", "What a report contains"], mustNot: [] },
  { route: "/store", must: ["The store.", "The Backlist Audit Pack", "$49"], mustNot: [] },
  { route: "/store/the-diagnostic", must: ["The Diagnostic (fixed-price analysis)", "$950", "DELIVERY"], mustNot: [] },
  { route: "/admin", must: ["Store admin", "Passcode"], mustNot: [] },
  { route: "/resources/backlist-audit-checklist", must: ["The backlist audit checklist.", "PRINT / SAVE AS PDF"], mustNot: [] },
  { route: "/services", must: ["Six divisions.", "One analytical method."], mustNot: ["Document not found"] },
  {
    // SSR output escapes ampersands, so assert around them rather than through.
    route: "/services/web",
    must: ["Web Development", "Digital Architecture"],
    mustNot: ["Document not found"],
  },
  {
    route: "/services/intelligence",
    must: ["Business Intelligence", "Technology Consulting"],
    mustNot: ["Document not found"],
  },
  {
    route: "/services/digital-transformation-consulting",
    must: ["Decide what to change, in what order", "Request a quote"],
    mustNot: ["Document not found"],
  },
  { route: "/industries", must: ["Applied to", "your sector.", "A NOTE ON WHAT IS NOT HERE"], mustNot: ["Document not found"] },
  { route: "/industries/real-estate", must: ["Real Estate", "ILLUSTRATIVE", "Illustrative, not client work"], mustNot: ["Document not found"] },
];

let failures = 0;

for (const c of cases) {
  globalThis.window.location.pathname = c.route;
  let html = "";
  try {
    html = render();
  } catch (err) {
    console.error(`✗ ${c.route} — render threw: ${err.message}`);
    failures++;
    continue;
  }

  const missing = c.must.filter((s) => !html.includes(s));
  const forbidden = c.mustNot.filter((s) => html.includes(s));

  if (missing.length === 0 && forbidden.length === 0) {
    console.log(`✓ ${c.route} — ${html.length} bytes, ${c.must.length} assertions`);
  } else {
    failures++;
    console.error(`✗ ${c.route}`);
    missing.forEach((m) => console.error(`    missing:  ${m}`));
    forbidden.forEach((f) => console.error(`    present:  ${f}`));
  }
}

/* ------------------------------------------------------------------ */
/* Sitemap integrity                                                   */
/* ------------------------------------------------------------------ */
/*
 * The sitemap is generated, so these are guards on the generator rather than on
 * hand-written XML. The hreflang check exists because the sitemap used to declare
 * a Portuguese alternate on every URL while the language toggle only swaps copy
 * in place: the alternate pointed at an English page, which is a false signal.
 */
{
  const sitemap = readFileSync(path.join(root, "public/sitemap.xml"), "utf8");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const unique = new Set(locs);
  const dupes = locs.filter((l, i) => locs.indexOf(l) !== i);

  const problems = [];
  if (locs.length === 0) problems.push("no URLs");
  if (dupes.length > 0) problems.push(`duplicate URLs: ${[...new Set(dupes)].join(", ")}`);
  if (unique.size !== locs.length) problems.push("duplicate loc entries");

  const badHreflang = [...sitemap.matchAll(/hreflang="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((l) => l !== "en");
  if (badHreflang.length > 0)
    problems.push(`non-English hreflang without a translated URL: ${[...new Set(badHreflang)].join(", ")}`);

  /* The new tiers must be discoverable, not merely served. */
  for (const required of ["/services", "/industries"]) {
    if (!locs.some((l) => l.endsWith(required))) problems.push(`missing ${required}`);
  }

  if (problems.length === 0) {
    console.log(`✓ sitemap — ${locs.length} URLs, no duplicates, hreflang consistent`);
  } else {
    failures++;
    console.error("✗ sitemap");
    problems.forEach((p) => console.error(`    ${p}`));
  }
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${cases.length} routes rendered and asserted.`);
