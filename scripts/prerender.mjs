/**
 * Static prerender.
 *
 * THE PROBLEM
 * -----------
 * The site deploys as a single-page app. vercel.json rewrites every path to
 * index.html, so a crawler, a link unfurler (Slack, LinkedIn, iMessage) or a
 * visitor on a slow connection received identical HTML — the homepage's title,
 * description and canonical — for every route. Once the expansion added 40
 * flagship service pages and 20 industry pages, every one of those routes was
 * intended to earn search traffic while presenting the homepage's head and an
 * empty <div id="root">.
 *
 * WHAT THIS DOES
 * --------------
 * Replaces the empty mount node with server-rendered markup, and rewrites the
 * head for each route: title, description, canonical, OG/Twitter pair, robots and
 * a route-specific schema.org graph. It writes `<route>/index.html` so a static
 * host serves each page its own document without a server.
 *
 * WHAT IT IS NOT
 * --------------
 * Not a client-side renderer relying on a crawler executing JS, and not a
 * different code path from the browser: it renders the real App through the real
 * provider stack, so anything that breaks in Node breaks the build here.
 *
 * HYDRATION
 * ---------
 * See src/main.tsx — it hydrates when the root has markup and creates when it
 * does not, so local `vite` dev (empty root) and prerendered production (full
 * root) both work without a mismatch.
 *
 *   npm run prerender        (runs inside `npm run build`)
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

if (!existsSync(path.join(dist, "index.html"))) {
  console.error("[prerender] dist/index.html not found — run `vite build` first.");
  process.exit(1);
}

const shell = readFileSync(path.join(dist, "index.html"), "utf8");

/* ------------------------------------------------------------------ */
/* Node environment shims                                              */
/* ------------------------------------------------------------------ */
/*
 * The App reads a handful of browser globals at render time. The SSR smoke test
 * has always shimmed these, which means an unshimmed global would only appear as
 * a render crash in production prerendering — so this mirrors that list exactly
 * and fails loudly if the App starts needing something new.
 */
const store = new Map();
globalThis.window = {
  location: { pathname: "/", href: "https://www.the-office360.com/" },
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, v),
    removeItem: (k) => store.delete(k),
  },
  matchMedia: () => ({
    matches: false,
    media: "",
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }),
  addEventListener: () => {},
  removeEventListener: () => {},
  scrollTo: () => {},
  requestAnimationFrame: (fn) => setTimeout(fn, 0),
  cancelAnimationFrame: (id) => clearTimeout(id),
};

const { render } = await import(path.join(dist, "dist-ssr/entry-ssr.js"));
const { headFor, prerenderPaths } = await import(path.join(dist, "dist-ssr/seo.js"));

/* ------------------------------------------------------------------ */
/* Head rewriting                                                      */
/* ------------------------------------------------------------------ */

/**
 * Rewrite the document head for one route using the DOM, not string surgery:
 * the shell's head contains a multi-line JSON-LD block and nested quotes, and a
 * regex over that is how head tags end up duplicated or half-replaced.
 */
function withHead(document, meta) {
  document.title = meta.title;

  const setMeta = (attr, key, value) => {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", value);
  };

  setMeta("name", "description", meta.description);
  setMeta("name", "robots", meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large");
  setMeta("property", "og:title", meta.title);
  setMeta("property", "og:description", meta.description);
  setMeta("property", "og:url", meta.url);
  setMeta("property", "og:type", meta.url === "https://www.the-office360.com/" ? "website" : "article");
  setMeta("name", "twitter:title", meta.title);
  setMeta("name", "twitter:description", meta.description);

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", meta.url);

  /*
   * hreflang: the site has one language. index.html used to declare `pt` and
   * `x-default` alternates that all pointed at the English URL; both were removed
   * for the same reason as the sitemap's pt alternate (see build-sitemap.mjs).
   * Prerendered pages carry `en` only, matching the sitemap.
   */
  document.head
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .forEach((el) => el.remove());
  const en = document.createElement("link");
  en.setAttribute("rel", "alternate");
  en.setAttribute("hreflang", "en");
  en.setAttribute("href", meta.url);
  document.head.appendChild(en);

  /* Route-specific schema, merged into the site-wide @graph. */
  const siteGraph = document.head.querySelector('script[type="application/ld+json"]');
  if (siteGraph) {
    try {
      const data = JSON.parse(siteGraph.textContent ?? "{}");
      const graph = Array.isArray(data["@graph"]) ? data["@graph"] : [];
      data["@graph"] = [...graph.filter((n) => n["@type"] !== "BreadcrumbList" && n["@type"] !== "Service" && n["@type"] !== "FAQPage" && n["@type"] !== "CollectionPage" && n["@type"] !== "Article"), ...meta.jsonLd];
      siteGraph.textContent = JSON.stringify(data, null, 2);
    } catch {
      /* Leave the site graph untouched rather than emit broken JSON-LD. */
    }
  }
}

/* ------------------------------------------------------------------ */
/* Build                                                               */
/* ------------------------------------------------------------------ */

const paths = prerenderPaths();
if (paths.length === 0) {
  console.error("[prerender] no paths returned — refusing to ship an unprerendered site.");
  process.exit(1);
}

let written = 0;
const failures = [];

for (const route of paths) {
  globalThis.window.location.pathname = route;
  globalThis.window.location.href = `https://www.the-office360.com${route}`;

  let html;
  try {
    html = render();
  } catch (err) {
    failures.push(`${route}: ${err.message}`);
    continue;
  }

  if (!html || html.length < 200) {
    failures.push(`${route}: rendered ${html?.length ?? 0} bytes — treating an empty page as a failure`);
    continue;
  }

  const dom = new JSDOM(shell);
  const document = dom.window.document;

  const rootEl = document.getElementById("root");
  if (!rootEl) {
    failures.push("shell has no #root");
    break;
  }
  rootEl.innerHTML = html;
  withHead(document, headFor(route));

  /*
   * Stamp which route this document belongs to. src/main.tsx hydrates only when
   * the stamp matches the URL it is running on; anything else (a 404 URL served
   * this fallback document, a stale deploy, a hand-edited path) is created fresh
   * instead of hydrated, which avoids a guaranteed React mismatch on markup that
   * describes a different page.
   */
  document.documentElement.setAttribute("data-prerendered", route);

  /* Inline the single entry script's modulepreload/preload stays as built. */
  const out = dom.serialize();

  const dir = route === "/" ? dist : path.join(dist, route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, "index.html"), out);
  written++;
}

if (failures.length > 0) {
  console.error(`[prerender] ${failures.length} route(s) failed:`);
  failures.forEach((f) => console.error(`  ✗ ${f}`));
  console.error(
    "\nA route that fails to prerender would ship as an empty shell, so this is fatal."
  );
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* The 404 fallback                                                     */
/* ------------------------------------------------------------------ */
/*
 * Every unmatched URL is rewritten to index.html by vercel.json. Before this,
 * that meant a missing page answered with the homepage's title, description and
 * `index, follow` canonical — a soft 404 that invites a crawler to index the
 * error page as the homepage. The fallback now renders the real NotFound
 * component with a noindex head.
 */
{
  const probe = "/surely-not-a-real-page";
  globalThis.window.location.pathname = probe;
  globalThis.window.location.href = `https://www.the-office360.com${probe}`;
  try {
    const notFoundHtml = render();
    const dom = new JSDOM(shell);
    const document = dom.window.document;
    document.getElementById("root").innerHTML = notFoundHtml;
    const notFoundHead = headFor(probe);
    /* A 404 has no canonical of its own; point it at the site root. */
    withHead(document, { ...notFoundHead, url: "https://www.the-office360.com/404.html" });
    /*
     * No data-prerendered stamp: the document deliberately does not claim to be
     * any route, so src/main.tsx creates rather than hydrates on a real 404 and
     * the router can resolve whatever URL the visitor actually asked for.
     */
    /*
     * Written to 404.html, NOT over dist/index.html — index.html is the real
     * homepage (already prerendered above). vercel.json routes unmatched paths to
     * 404.html so an unknown URL gets a noindex error page instead of a
     * 200-status copy of the homepage.
     */
    writeFileSync(path.join(dist, "404.html"), dom.serialize());
    console.log("[prerender] 404 fallback written to dist/404.html");
  } catch (err) {
    failures.push(`404 fallback: ${err.message}`);
  }
}

/* The intermediate SSR bundles are build artefacts, not deploy output. */
rmSync(path.join(dist, "dist-ssr"), { recursive: true, force: true });

console.log(`[prerender] ${written} routes prerendered with route-specific head and markup.`);
