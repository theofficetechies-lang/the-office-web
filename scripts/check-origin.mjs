/**
 * Guard: no deployment may ship a canonical origin that is not the live
 * production domain.
 *
 * Why this exists — the site shipped for months with a Vercel *preview* host in
 * every canonical tag, hreflang alternate, og:url, JSON-LD @id, the sitemap and
 * robots.txt (101 occurrences). Search engines were being told, on the live
 * custom domain, that the real page was a preview deployment. That is a silent
 * SEO failure: nothing breaks visually, so nothing gets noticed.
 *
 * Runs as `prebuild`, so a `vite build` (and therefore a Vercel deploy) fails
 * loudly instead of publishing.
 *
 *   npm run check:origin
 *
 * Escape hatch: set ALLOW_PREVIEW_ORIGIN=1 for a deliberate preview deploy.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const CANONICAL_ORIGIN = "https://www.the-office360.com";

/** Hosts that must never appear in a canonical/SEO surface. */
const FORBIDDEN = [
  /the-office-test\d+\.vercel\.app/g,
  /theoffice\.studio/g,
  /localhost/g,
  /127\.0\.0\.1/g,
];

/**
 * Files whose contents reach crawlers. Generated artefacts (sitemap, rss) are
 * checked too — regenerating them is exactly when a stale origin reappears.
 */
const FILES = [
  "index.html",
  "public/robots.txt",
  "public/sitemap.xml",
  "public/rss.xml",
  "src/lib/site.ts",
];

const problems = [];

for (const rel of FILES) {
  const abs = path.join(root, rel);
  if (!existsSync(abs)) {
    problems.push(`${rel}: missing`);
    continue;
  }
  const text = readFileSync(abs, "utf8");

  for (const re of FORBIDDEN) {
    re.lastIndex = 0;
    const hits = text.match(re);
    if (hits) problems.push(`${rel}: ${hits.length}× ${re.source}`);
  }

  // robots.txt and sitemap.xml must actually point at the canonical origin.
  if (rel.endsWith("robots.txt") || rel.endsWith("sitemap.xml") || rel.endsWith("rss.xml")) {
    if (!text.includes(CANONICAL_ORIGIN)) {
      problems.push(`${rel}: does not contain ${CANONICAL_ORIGIN}`);
    }
  }
}

// The value the app uses at runtime must match too, or per-route canonicals
// written by useDocumentMeta will disagree with the static ones.
const siteTs = readFileSync(path.join(root, "src/lib/site.ts"), "utf8");
if (!siteTs.includes(CANONICAL_ORIGIN)) {
  problems.push(`src/lib/site.ts: SITE_URL fallback is not ${CANONICAL_ORIGIN}`);
}

if (problems.length > 0) {
  const preview = process.env.ALLOW_PREVIEW_ORIGIN === "1";
  const label = preview ? "WARNING" : "FAIL";
  console.error(`\n[check:origin] ${label} — SEO origin is not production:`);
  for (const p of problems) console.error(`  • ${p}`);
  console.error(
    `\nExpected origin: ${CANONICAL_ORIGIN}\n` +
      `Fix src/lib/site.ts + index.html, then: npm run sitemap\n` +
      `(Set ALLOW_PREVIEW_ORIGIN=1 only for a deliberate preview deploy.)\n`
  );
  if (!preview) process.exit(1);
}

console.log(`[check:origin] ok — all SEO surfaces point at ${CANONICAL_ORIGIN}`);
