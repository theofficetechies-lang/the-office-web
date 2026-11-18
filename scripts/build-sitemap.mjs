/**
 * Regenerates public/sitemap.xml AND public/rss.xml from the route table and
 * the content files, so neither can drift from what the site actually serves.
 *
 *   npm run sitemap
 *
 * Override the origin with SITE_URL when the custom domain goes live:
 *   SITE_URL=https://theoffice.studio npm run sitemap
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const SITE_URL = (process.env.SITE_URL ?? "https://www.the-office360.com").replace(/\/+$/, "");
const today = new Date().toISOString().slice(0, 10);

function slugsFrom(file, pattern) {
  const src = readFileSync(path.join(root, file), "utf8");
  return [...src.matchAll(pattern)].map((m) => m[1]);
}

const noteSlugs = slugsFrom("src/data/notes.ts", /slug:\s*"([^"]+)"/g);
const projectSlugs = slugsFrom("src/data/projects.ts", /slug:\s*"([^"]+)"/g);
const serviceSlugs = slugsFrom("src/data/services.ts", /slug:\s*"([^"]+)"/g);
const productSlugs = slugsFrom("src/data/products.ts", /slug:\s*"([^"]+)"/g);
const industrySlugs = slugsFrom("src/data/industries.ts", /slug:\s*"([^"]+)"/g);
const divisionSlugs = slugsFrom("src/data/divisions.ts", /^\s*id:\s*"([^"]+)"/gm);

/*
 * The 40 flagship services are read from the catalogue. Catalogue-tier services
 * are deliberately absent: they are anchored entries on a division hub, not URLs,
 * and listing /services/<catalogue-slug> here would advertise 127 pages that are
 * served as 404. test-content.ts enforces the two lists stay in agreement.
 */
const flagshipSlugs = [...readFileSync(path.join(root, "src/data/serviceCatalog.ts"), "utf8").matchAll(
  /slug:\s*"([^"]+)"[^\n]*tier:\s*"flagship"/g
)].map((m) => m[1]);

/* ------------------------- sitemap ------------------------- */

const urls = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/notes", changefreq: "weekly", priority: "0.8" },
  ...noteSlugs.map((slug) => ({ loc: `/notes/${slug}`, changefreq: "monthly", priority: "0.6" })),
  ...projectSlugs.map((slug) => ({ loc: `/work/${slug}`, changefreq: "monthly", priority: "0.6" })),
  { loc: "/services", changefreq: "monthly", priority: "0.9" },
  ...divisionSlugs.map((slug) => ({ loc: `/services/${slug}`, changefreq: "monthly", priority: "0.8" })),
  ...flagshipSlugs.map((slug) => ({ loc: `/services/${slug}`, changefreq: "monthly", priority: "0.7" })),
  ...serviceSlugs.map((slug) => ({ loc: `/services/${slug}`, changefreq: "monthly", priority: "0.6" })),
  { loc: "/industries", changefreq: "monthly", priority: "0.8" },
  ...industrySlugs.map((slug) => ({ loc: `/industries/${slug}`, changefreq: "monthly", priority: "0.6" })),
  { loc: "/glossary", changefreq: "monthly", priority: "0.5" },
  { loc: "/methodology", changefreq: "monthly", priority: "0.6" },
  { loc: "/demos", changefreq: "monthly", priority: "0.7" },
  { loc: "/store", changefreq: "monthly", priority: "0.8" },
  ...productSlugs.map((slug) => ({ loc: `/store/${slug}`, changefreq: "monthly", priority: "0.5" })),
  { loc: "/press", changefreq: "yearly", priority: "0.4" },
  { loc: "/resources/backlist-audit-checklist", changefreq: "yearly", priority: "0.5" },
  { loc: "/privacy", changefreq: "yearly", priority: "0.3" },
  { loc: "/terms", changefreq: "yearly", priority: "0.3" },
];

/*
 * hreflang: only "en" is declared.
 *
 * This previously emitted a `pt` alternate pointing at the same URL for all 96
 * pages. The language toggle (src/lib/i18n.tsx) switches copy in place via
 * document.documentElement.lang — it does not produce a /pt URL — so the pt
 * alternate pointed at English content. Hreflang must name a URL whose content
 * is actually in that language, so the honest set is one language. If translated
 * routes are built later, emit both and add them here.
 */
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${u.loc}" />
  </url>`
  )
  .join("\n")}
</urlset>
`;
writeFileSync(path.join(root, "public/sitemap.xml"), xml);

/* ------------------------- rss ------------------------- */

const notesSrc = readFileSync(path.join(root, "src/data/notes.ts"), "utf8");
// Split into per-object chunks on `slug:` boundaries to pair fields safely.
const blocks = notesSrc.split(/\n\s*\{\n/).slice(1);
const notes = blocks.map((b) => {
  const get = (k) => {
    const m = b.match(new RegExp(`${k}:\\s*"([^"]*)"`));
    return m ? m[1] : "";
  };
  return { slug: get("slug"), title: get("title"), date: get("date"), excerpt: get("excerpt") };
}).filter((n) => n.slug);

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>THE OFFICE — Notes</title>
    <link>${SITE_URL}/notes</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Field notes on book strategy, digital craft, search systems, and the business of publishing.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${notes
  .map(
    (n) => `    <item>
      <title>${esc(n.title)}</title>
      <link>${SITE_URL}/notes/${n.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/notes/${n.slug}</guid>
      <description>${esc(n.excerpt)}</description>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>
`;
writeFileSync(path.join(root, "public/rss.xml"), rss);

console.log(`sitemap.xml written — ${urls.length} URLs; rss.xml written — ${notes.length} items; origin ${SITE_URL}`);
