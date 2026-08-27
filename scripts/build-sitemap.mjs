/**
 * Regenerates public/sitemap.xml from the route table and the content files,
 * so the sitemap cannot drift away from what the site actually serves.
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
const SITE_URL = (process.env.SITE_URL ?? "https://the-office-test4.vercel.app").replace(/\/+$/, "");
const today = new Date().toISOString().slice(0, 10);

function slugsFrom(file, pattern) {
  const src = readFileSync(path.join(root, file), "utf8");
  return [...src.matchAll(pattern)].map((m) => m[1]);
}

const noteSlugs = slugsFrom("src/data/notes.ts", /slug:\s*"([^"]+)"/g);
const projectSlugs = slugsFrom("src/data/projects.ts", /slug:\s*"([^"]+)"/g);

/** @type {{loc: string, changefreq: string, priority: string}[]} */
const urls = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/notes", changefreq: "weekly", priority: "0.8" },
  ...noteSlugs.map((slug) => ({ loc: `/notes/${slug}`, changefreq: "monthly", priority: "0.6" })),
  ...projectSlugs.map((slug) => ({ loc: `/work/${slug}`, changefreq: "monthly", priority: "0.6" })),
  { loc: "/privacy", changefreq: "yearly", priority: "0.3" },
  { loc: "/terms", changefreq: "yearly", priority: "0.3" },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(path.join(root, "public/sitemap.xml"), xml);
console.log(`sitemap.xml written — ${urls.length} URLs for ${SITE_URL}`);
