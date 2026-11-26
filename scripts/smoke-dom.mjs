/**
 * DOM smoke test: bundles the real client entry (src/main.tsx) and mounts it
 * in jsdom for every route, then drives the interactions the brief's final
 * checklist calls for.
 *
 *   npm run smoke:dom
 *
 * What this proves: the shipped client code mounts without a console error,
 * per-route metadata is written, there is exactly one h1 and a #main landmark,
 * no internal link is broken, the mobile menu and the brief form behave, and
 * the Phase 11 fields reach the network payload.
 *
 * What this cannot prove: jsdom has no layout engine, so horizontal overflow,
 * computed contrast and real focus rings are not measured here. No browser is
 * installable in this sandbox (browser download hosts are network-blocked), so
 * those remain visually unverified.
 */
import { build } from "esbuild";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { JSDOM, VirtualConsole } from "jsdom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

if (!existsSync(path.join(root, "dist/index.html"))) {
  console.error("dist/index.html not found — run `npm run build` first.");
  process.exit(1);
}

await build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2022",
  outfile: "dist-test/app.js",
  loader: { ".css": "empty" },
  define: {
    "import.meta.env.DEV": "false",
    "import.meta.env.PROD": "true",
    "import.meta.env.VITE_API_URL": '""',
    "import.meta.env.VITE_SITE_URL": '"https://www.the-office360.com"',
    "import.meta.env.VITE_WEB3FORMS_KEY": '""',
    "import.meta.env.VITE_NGN_PER_USD": '""',
    "import.meta.env.VITE_ADMIN_PASSCODE": '""',
    "import.meta.env.VITE_PAYSTACK_PUBLIC_KEY": '""',
  },
  absWorkingDir: root,
  logLevel: "warning",
});

const bundle = readFileSync(path.join(root, "dist-test/app.js"), "utf8");
const fallbackShell = readFileSync(path.join(root, "dist/index.html"), "utf8");

/**
 * The document a static host would serve for `route`.
 *
 * Production is prerendered (scripts/prerender.mjs), so each known route has its
 * own `dist<route>/index.html` with route-specific head and markup; everything
 * else falls back to the root index.html, exactly as vercel.json's rewrite does.
 * Mounting each route against its own document is what makes hydration tested
 * rather than assumed — bundling main.tsx against the homepage shell used to
 * throw on every route the moment hydration was introduced.
 */
function shellFor(route) {
  const clean = route.split("#")[0].split("?")[0];
  if (clean === "/" || clean === "") return fallbackShell;
  const file = path.join(root, "dist", clean.replace(/^\//, ""), "index.html");
  if (existsSync(file)) return readFileSync(file, "utf8");
  /* Unmatched paths are routed to 404.html by vercel.json, not to index.html. */
  const notFound = path.join(root, "dist/404.html");
  return existsSync(notFound) ? readFileSync(notFound, "utf8") : fallbackShell;
}

const ORIGIN = "https://www.the-office360.com";
/**
 * Known routes, derived from the same data modules the app renders from.
 *
 * These lists used to be hand-maintained and drifted: four service slugs that
 * had been renamed were still listed, and /demos, /store and /admin were missing,
 * so 57 perfectly valid links were reported as broken. Adding a service or a note
 * must never require editing this test.
 */
function slugsFrom(file, re = /slug:\s*"([^"]+)"/g) {
  const src = readFileSync(path.join(root, file), "utf8");
  return [...src.matchAll(re)].map((m) => m[1]);
}

/**
 * The 40 flagship services, read from the catalogue rather than from
 * divisions.ts (whose flagshipSlugs are bare array strings). Every catalogue
 * entry is one line, so the tier and the slug are matched together.
 */
function flagshipSlugs() {
  const src = readFileSync(path.join(root, "src/data/serviceCatalog.ts"), "utf8");
  return [...src.matchAll(/slug:\s*"([^"]+)"[^\n]*tier:\s*"flagship"/g)].map((m) => m[1]);
}

/** The six division ids, read from divisions.ts. */
function divisionIds() {
  const src = readFileSync(path.join(root, "src/data/divisions.ts"), "utf8");
  return [...src.matchAll(/^\s*id:\s*"([^"]+)"/gm)].map((m) => m[1]);
}

const KNOWN = [
  "/",
  /* Transformation-brief pages. Listed here so the link sweep resolves them. */
  "/about",
  "/contact",
  "/insights",
  "/work",
  "/notes",
  "/privacy",
  "/terms",
  "/methodology",
  "/press",
  "/glossary",
  "/demos",
  "/store",
  "/admin",
  "/services",
  "/industries",
  "/services/web",
  "/services/ai",
  "/resources/backlist-audit-checklist",
  ...slugsFrom("src/data/industries.ts").map((s) => `/industries/${s}`),
  /*
   * Division hubs and the 40 flagship service pages. Both are derived from
   * src/data/divisions.ts rather than hand-listed: flagshipSlugs is exactly the
   * set the app serves from ServiceDetailPage, and adding a flagship must not
   * require editing this test.
   */
  ...divisionIds().map((s) => `/services/${s}`),
  ...flagshipSlugs().map((s) => `/services/${s}`),
  ...slugsFrom("src/data/notes.ts").map((s) => `/notes/${s}`),
  ...slugsFrom("src/data/projects.ts").map((s) => `/work/${s}`),
  ...slugsFrom("src/data/services.ts").map((s) => `/services/${s}`),
  ...slugsFrom("src/data/products.ts").map((s) => `/store/${s}`),
];

/** Every path served from public/, so the link check can verify assets exist. */
function listPublic(dir, prefix = "") {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const route = `${prefix}/${entry}`;
    if (statSync(full).isDirectory()) out.push(...listPublic(full, route));
    else out.push(route);
  }
  return out;
}
const STATIC_ASSETS = new Set(listPublic(path.join(root, "public")));

let failures = 0;
function check(label, ok, detail = "") {
  if (ok) {
    console.log(`  ✓ ${label}`);
  } else {
    failures++;
    console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const tick = () => new Promise((r) => setTimeout(r, 30));

async function mount(route, { reducedMotion = false, presetLang } = {}) {
  const errors = [];
  const vc = new VirtualConsole();
  /*
   * jsdom implements no document navigation. The mobile-menu test clicks the first
   * panel link, which used to be a same-page anchor (/#services) and is now a real
   * route (/services), so the click asks for a navigation jsdom cannot perform and
   * reports "Not implemented". That is a harness gap, not an app fault, and mixing
   * it into `errors` would make a genuine console error on the same route
   * indistinguishable from this noise.
   */
  vc.on("jsdomError", (e) => {
    if (/Not implemented: navigation/i.test(e.message)) return;
    errors.push(`jsdomError: ${e.message}`);
  });
  vc.on("error", (...a) => errors.push(`console.error: ${a.join(" ")}`));

  const dom = new JSDOM(shellFor(route), {
    url: `${ORIGIN}${route}`,
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole: vc,
  });
  const { window } = dom;

  // jsdom gaps that are not app bugs: no layout-driven scroll, no matchMedia.
  // The stub records change listeners so a viewport change can be simulated.
  window.scrollTo = () => {};

  const media = { desktop: false, listeners: new Set() };
  window.matchMedia = (query) => ({
    get matches() {
      if (query.includes("prefers-reduced-motion")) return reducedMotion;
      if (query.includes("min-width: 1024px")) return media.desktop;
      return false;
    },
    media: query,
    addEventListener: (type, fn) => {
      if (type === "change") media.listeners.add(fn);
    },
    removeEventListener: (type, fn) => {
      if (type === "change") media.listeners.delete(fn);
    },
    addListener: () => {},
    removeListener: () => {},
  });

  /** Flip the stubbed viewport to >=1024px and notify listeners. */
  const resizeToDesktop = async () => {
    media.desktop = true;
    for (const fn of [...media.listeners]) fn({ matches: true, media: "(min-width: 1024px)" });
    await tick();
  };

  if (presetLang) {
    try { window.localStorage.setItem("the-office:lang", presetLang); } catch { /* storage unavailable */ }
  }

  const calls = [];
  window.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input.url;
    calls.push({ url, body: init?.body ? JSON.parse(init.body) : null });
    return {
      ok: true,
      status: 200,
      json: async () => ({ success: true, message: "Brief received." }),
    };
  };

  window.eval(bundle);

  /*
   * Wait for the page, not for a stopwatch.
   *
   * Two different things can happen after the bundle runs, and a fixed sleep got
   * both wrong:
   *
   *  • The document is stamped `data-prerendered="<route>"`, so src/main.tsx
   *    hydrates it in place. The markup was already there before eval, which is the
   *    point of prerendering — two ticks is all hydration needs.
   *  • Any other pairing (an unknown URL, or the shared 404 document) makes
   *    src/main.tsx *create* the tree. createRoot then throws the served markup
   *    away and renders asynchronously, and a lazy route page (src/App.tsx) only
   *    resolves once its chunk loads — measured at ~360 ms here. The root looked
   *    non-empty the whole time because the discarded markup was still in it, so
   *    the wait has to watch for the *replacement*, not for emptiness.
   */
  const rootEl = window.document.getElementById("root");
  const stampedFor = window.document.documentElement.getAttribute("data-prerendered");
  const normalise = (p) => (p.replace(/\/+$/, "") === "" ? "/" : p.replace(/\/+$/, ""));
  const hydrating = stampedFor !== null && normalise(stampedFor) === normalise(route);
  const markupBeforeEval = rootEl.innerHTML;
  const servedTitle = shellFor(route).match(/<title>([^<]*)<\/title>/)?.[1] ?? "";

  if (!hydrating) {
    const startedAt = Date.now();
    while (Date.now() - startedAt < 8000) {
      const replaced =
        rootEl.childElementCount > 0 && rootEl.innerHTML !== markupBeforeEval;
      const retitled = window.document.title !== servedTitle;
      if (replaced || retitled) break;
      await new Promise((r) => setTimeout(r, 20));
    }
  }
  /* Then let the page's own effects (title, canonical) settle against the new tree. */
  await new Promise((r) => setTimeout(r, 80));

  return { window, document: window.document, errors, calls, resizeToDesktop };
}

function setValue(window, el, value) {
  const proto =
    el.tagName === "TEXTAREA"
      ? window.HTMLTextAreaElement.prototype
      : el.tagName === "SELECT"
        ? window.HTMLSelectElement.prototype
        : window.HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
  el.dispatchEvent(
    new window.Event(el.tagName === "SELECT" ? "change" : "input", { bubbles: true })
  );
}


/* ------------------------------------------------------------------ */
/* 1. Every route mounts clean                                         */
/* ------------------------------------------------------------------ */

const expectations = {
  "/": { title: "THE OFFICE 360 — Digital transformation, technology and growth", h1: "Transform your business" },
  "/notes": { title: "Notes — THE OFFICE 360", h1: "Notes on the work." },
  "/notes/why-most-author-websites-fail": {
    title: "Why most author websites fail — Notes, THE OFFICE 360",
    h1: "Why most author websites fail",
  },
  "/work/debut-novel-repositioning": {
    title: "Repositioning a debut literary novel for a US trade house — THE OFFICE 360",
    h1: "Repositioning a debut literary novel for a US trade house",
  },
  "/privacy": { title: "Privacy notice — THE OFFICE 360", h1: "Privacy notice." },
  "/terms": { title: "Terms of service — THE OFFICE 360", h1: "Terms of service." },
  "/work/does-not-exist": { title: "Case study not found — THE OFFICE 360", servedTitle: "Document not found — THE OFFICE 360", h1: null },
  /*
   * Phase 1 added servicesIndex / division / industriesIndex / industry to the
   * router; their pages land in Phase 2. Until then they must render the 404 and
   * NOT fall through to the switch's HomePage default, which would serve the
   * homepage at /services — a soft 404 and the doorway pattern the brief forbids.
   * These assertions start failing the moment Phase 2 renders real pages, at
   * which point they should be updated to the real titles.
   */
  "/services/corporate-website-development": {
    title: "Corporate Website Development — Services — THE OFFICE 360",
    h1: "A site that answers the questions that lose you the deal.",
  },
  "/services": {
    title: "Services — web, AI & automation, growth, brand, publishing, consulting — THE OFFICE 360",
    h1: "Six divisions. One analytical method.",
  },
  "/services/web": {
    title: "Web Development & Digital Architecture — Services — THE OFFICE 360",
    h1: "Web Development & Digital Architecture",
  },
  "/industries": {
    title: "Industries — where the method is applied — THE OFFICE 360",
    h1: "Applied to your sector.",
  },
  "/industries/real-estate": {
    title: "Real Estate — Industries — THE OFFICE 360",
    h1: "Real Estate",
  },
  /*
   * Unknown URLs are served dist/404.html by vercel.json's filesystem-then-404
   * routes, so the fallback document itself must carry an error head rather than
   * the homepage's — otherwise a missing page answers as the homepage.
   */
  "/industries/does-not-exist": { title: "Industry not found — THE OFFICE 360", servedTitle: "Document not found — THE OFFICE 360", h1: "That sector is not in the archive." },
  "/nowhere": { title: "Document not found — THE OFFICE 360", h1: null },
};

console.log("Routes:");
for (const [route, exp] of Object.entries(expectations)) {
  const { document, errors } = await mount(route);
  const h1s = document.querySelectorAll("h1");
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  const robots = document.querySelector('meta[name="robots"]')?.content;

  check(`${route} mounts with no console error`, errors.length === 0, errors.join(" | "));

  /*
   * Prerender correctness, checked on the document the host actually serves.
   *
   * The client also writes a title in an effect, so asserting `document.title`
   * after mounting passed even when every route shipped the homepage's head and
   * an empty mount node — a crawler or a link unfurler sees the served document,
   * not the driven one. This reads the raw file.
   */
  const servedHead = shellFor(route);
  const servedTitle = servedHead.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  const unescape = (t) =>
    t.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  /*
   * `servedTitle` overrides the expectation for error routes: the shared 404
   * document says "Document not found", and the page component refines it to
   * "Industry not found" etc. after hydration. Both are correct; the served one is
   * what a crawler sees, so it is asserted explicitly rather than assumed equal.
   */
  const expectedServed = exp.servedTitle ?? exp.title;
  check(
    `${route} is prerendered with ${exp.servedTitle ? "its own" : "the right"} title`,
    unescape(servedTitle) === expectedServed,
    `served "${unescape(servedTitle) || "(none)"}"`
  );
  /*
   * Error routes share the single 404 document, so a per-route canonical and a
   * hydration stamp do not apply: it must be noindex, and it must carry no stamp
   * (src/main.tsx creates rather than hydrates when the stamp is absent).
   */
  const isErrorRoute = servedHead === (existsSync(path.join(root, "dist/404.html"))
    ? readFileSync(path.join(root, "dist/404.html"), "utf8")
    : "");

  if (isErrorRoute) {
    check(
      `${route} serves the noindex 404 document`,
      /name="robots" content="noindex/.test(servedHead),
      "404 document is indexable"
    );
  } else {
    const servedCanonical = servedHead.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
    check(
      `${route} is prerendered with its own canonical`,
      servedCanonical === `${ORIGIN}${route}`,
      `served ${servedCanonical || "(none)"}`
    );
    const stamp = servedHead.match(/data-prerendered="([^"]*)"/)?.[1] ?? "";
    check(
      `${route} document is stamped for hydration`,
      stamp === route,
      `stamp "${stamp}"`
    );
  }

  /*
   * Exactly one <h1> in the SERVED document, not just after mounting. The former
   * <noscript> fallback contained its own <h1>, so every page shipped two and a
   * crawler without JS saw "JavaScript is off." as the heading.
   */
  const servedH1s = servedHead.slice(servedHead.indexOf('<div id="root">')).match(/<h1[\s>]/g) ?? [];
  check(
    `${route} ships exactly one h1 in its HTML`,
    servedH1s.length === 1,
    `found ${servedH1s.length}`
  );

  check(
    `${route} sets its own title`,
    document.title === exp.title,
    `got "${document.title}"`
  );

  /*
   * The served title and the post-mount title must be the same string.
   *
   * Two modules write titles: src/lib/seo.ts (build time) and useDocumentMeta (on
   * mount). They are deliberately separate — one runs in Node, one in the browser —
   * so they can drift, and the symptom would be invisible: the browser tab would
   * silently change a moment after paint. This is the assertion that keeps the two
   * in agreement without merging them.
   */
  if (!isErrorRoute) {
    check(
      `${route} does not rewrite its title after mount`,
      unescape(servedTitle) === document.title,
      `served "${unescape(servedTitle)}" → mounted "${document.title}"`
    );
  }
  check(
    `${route} sets its own canonical`,
    canonical === `${ORIGIN}${route}`,
    `got ${canonical}`
  );
  check(`${route} sets robots meta`, Boolean(robots), "missing");
  check(
    `${route} has exactly one h1`,
    h1s.length === 1,
    `found ${h1s.length}`
  );
  if (exp.h1) {
    check(
      `${route} h1 text`,
      h1s[0]?.textContent.includes(exp.h1),
      `got "${h1s[0]?.textContent?.slice(0, 40)}"`
    );
  }
  check(`${route} exposes #main landmark`, Boolean(document.getElementById("main")));
}

/* ------------------------------------------------------------------ */
/* 2. No broken internal links, no unlabelled images                   */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Prerender sweep — every shipped document                            */
/* ------------------------------------------------------------------ */
/*
 * The per-route assertions above cover a chosen 15 routes. The expansion ships
 * 96 prerendered documents plus a 404, and a route can regress without being in
 * that list — /services/intelligence did exactly that: it was silently missing
 * from the expectations, so its head was never checked.
 *
 * This walks what is actually in dist/, derives nothing from app code, and
 * asserts the properties that make prerendering worth doing at all.
 */
console.log("\nPrerender sweep (every shipped document):");
{
  const titles = new Map();
  const problems = [];

  const walk = (dir, prefix = "") => {
    const out = [];
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry === "assets" || entry.startsWith("dist-ssr")) continue;
        out.push(...walk(full, `${prefix}/${entry}`));
      } else if (entry === "index.html") {
        out.push(prefix === "" ? "/" : prefix);
      }
    }
    return out;
  };

  const pages = walk(path.join(root, "dist"));
  check("build produced prerendered documents", pages.length > 90, `found ${pages.length}`);

  for (const route of pages) {
    const file = route === "/" ? path.join(root, "dist/index.html") : path.join(root, "dist", route, "index.html");
    const html = readFileSync(file, "utf8");
    const body = html.slice(html.indexOf('<div id="root">'));

    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
    const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "";
    const h1s = body.match(/<h1[\s>]/g) ?? [];
    const textWords = body.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

    if (!title) problems.push(`${route}: no title`);
    if (h1s.length !== 1) problems.push(`${route}: ${h1s.length} h1 elements`);
    if (textWords < 40) problems.push(`${route}: only ${textWords} words of real markup`);
    if (!robots.includes("index")) problems.push(`${route}: not indexable (${robots || "no robots"})`);
    if (canonical !== `${ORIGIN}${route}`) problems.push(`${route}: canonical ${canonical || "(none)"}`);

    if (titles.has(title)) problems.push(`${route}: same title as ${titles.get(title)}`);
    else titles.set(title, route);
  }

  check("every prerendered page is complete and self-describing", problems.length === 0, problems.slice(0, 8).join(" | "));

  /*
   * Two modules write titles — src/lib/seo.ts at build time, useDocumentMeta on
   * mount — and they are deliberately separate (one is Node, one is the browser).
   * If they disagree the browser tab changes a moment after paint, which is
   * invisible unless something compares the two. This mounts EVERY prerendered
   * route and requires the mounted title to equal the served one.
   *
   * The per-route checks above cover 11 routes; /industries/real-estate was not
   * among them, which is how a deliberately broken client title went undetected.
   */
  const titleDrift = [];
  for (const route of pages) {
    const file = route === "/" ? path.join(root, "dist/index.html") : path.join(root, "dist", route, "index.html");
    const served = readFileSync(file, "utf8").match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    const unescapeHtml = (t) =>
      t.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    const { document } = await mount(route);
    const mounted = document.title;
    if (mounted !== unescapeHtml(served)) {
      titleDrift.push(`${route}: served "${unescapeHtml(served)}" → mounted "${mounted}"`);
    }
  }
  check(
    "no page rewrites its title after mount",
    titleDrift.length === 0,
    titleDrift.slice(0, 4).join(" | ")
  );

  /*
   * The 404 document is the one page that must NOT be indexable: every unmatched
   * URL is routed to it, so indexing it would put an error page in the index.
   */
  const notFoundPath = path.join(root, "dist/404.html");
  const nf = existsSync(notFoundPath) ? readFileSync(notFoundPath, "utf8") : "";
  check("a 404 document exists", nf.length > 0);
  check(
    "the 404 document is noindex",
    /name="robots" content="noindex/.test(nf),
    "the 404 fallback is indexable"
  );
  check("the 404 document is not stamped for hydration", !/data-prerendered=/.test(nf));

  /*
   * Static link integrity across what is actually shipped.
   *
   * The link check further down walks a mounted DOM for a fixed set of routes and
   * skips fragments and query strings. This walks every shipped file instead, so a
   * link to a route that was never prerendered is caught even when that page is
   * not in the mounted set — which is how /services/intelligence slipped through.
   */
  const servable = new Set(pages.map((r) => r.replace(/\/$/, "") || "/"));
  for (const entry of listPublic(path.join(root, "dist"))) servable.add(entry);

  const dead = [];
  for (const route of pages) {
    const file = route === "/" ? path.join(root, "dist/index.html") : path.join(root, "dist", route, "index.html");
    const html = readFileSync(file, "utf8");
    for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      const href = m[1];
      if (href.startsWith("//") || href === "/") continue;
      const target = href.replace(/\/$/, "");
      if (servable.has(target) || servable.has(href)) continue;
      /* file paths (assets, images, pdfs) are served as-is; routes need a document */
      if (/\.[a-z0-9]{2,5}$/i.test(target) && STATIC_ASSETS.has(target)) continue;
      dead.push(`${route} → ${href}`);
    }
  }
  check(
    "no shipped page links to a route that was never built",
    dead.length === 0,
    [...new Set(dead)].slice(0, 6).join(", ")
  );
}

console.log("\nLink and image hygiene:");
{
  const broken = new Set();
  const noAlt = [];
  for (const route of KNOWN) {
    const { document } = await mount(route);
    for (const a of document.querySelectorAll("a[href]")) {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("mailto:") || href.startsWith("#")) continue;
      if (/^https?:/.test(href) && !href.startsWith(ORIGIN)) continue;
      const clean = href.replace(ORIGIN, "").split("#")[0] || "/";
      if (KNOWN.includes(clean) || STATIC_ASSETS.has(clean)) continue;
      broken.add(`${route} → ${href}`);
    }
    for (const img of document.querySelectorAll("img")) {
      if (!img.hasAttribute("alt")) noAlt.push(`${route}: ${img.getAttribute("src")}`);
    }
  }
  check("every internal link resolves to a real route", broken.size === 0, [...broken].join(", "));
  check(
    "no admin page is linked from public pages",
    ![...broken].length || ![...broken].some((b) => b.includes("/admin")),
    "a public page links to /admin"
  );
  check("every image has alt text", noAlt.length === 0, noAlt.join(", "));
}

/* ------------------------------------------------------------------ */
/* 3. Home page interactions                                           */
/* ------------------------------------------------------------------ */

console.log("\nHome interactions:");
{
  const { window, document, errors, resizeToDesktop } = await mount("/");

  // Skip link is the first thing a keyboard user reaches.
  const firstFocusable = document.querySelector("a[href], button");
  check("skip link is the first focusable element", firstFocusable?.classList.contains("skip-link"));
  check("skip link targets #main", firstFocusable?.getAttribute("href") === "#main");

  // Mobile menu.
  const menuButton = [...document.querySelectorAll("button")].find((b) =>
    b.textContent.includes("MENU")
  );
  check("mobile menu button exists", Boolean(menuButton));
  check("mobile menu starts collapsed", menuButton?.getAttribute("aria-expanded") === "false");
  menuButton?.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await tick();
  check(
    "menu opens with aria-expanded=true",
    document.querySelector("[aria-controls='mobile-menu']")?.getAttribute("aria-expanded") === "true"
  );
  check("menu panel is in the DOM", Boolean(document.getElementById("mobile-menu")));
  // Closing with the same toggle must work: mousedown fires before click, and
  // the button sits outside the panel, so a naive click-away handler closes the
  // menu and the click immediately reopens it.
  const toggle = document.querySelector("[aria-controls='mobile-menu']");
  toggle?.dispatchEvent(new window.MouseEvent("mousedown", { bubbles: true }));
  toggle?.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await tick();
  check(
    "clicking the toggle again closes the menu",
    document.querySelector("[aria-controls='mobile-menu']")?.getAttribute("aria-expanded") === "false",
    `aria-expanded="${document.querySelector("[aria-controls='mobile-menu']")?.getAttribute("aria-expanded")}"`
  );
  check(
    "menu panel is removed from the DOM",
    document.getElementById("mobile-menu") === null
  );
  check(
    "toggle label reverts to MENU",
    document.querySelector("[aria-controls='mobile-menu']")?.textContent.includes("MENU")
  );

  // Reopen, then close via Escape.
  document
    .querySelector("[aria-controls='mobile-menu']")
    ?.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await tick();
  check(
    "menu reopens after being closed",
    document.querySelector("[aria-controls='mobile-menu']")?.getAttribute("aria-expanded") === "true"
  );
  document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await tick();
  check(
    "Escape closes the menu",
    document.querySelector("[aria-controls='mobile-menu']")?.getAttribute("aria-expanded") === "false"
  );

  // Reopen, then click outside the menu (not the toggle).
  document
    .querySelector("[aria-controls='mobile-menu']")
    ?.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await tick();
  document
    .querySelector("h1")
    ?.dispatchEvent(new window.MouseEvent("mousedown", { bubbles: true }));
  await tick();
  check(
    "clicking outside the menu closes it",
    document.querySelector("[aria-controls='mobile-menu']")?.getAttribute("aria-expanded") === "false"
  );
  check(
    "body scroll is restored after close",
    window.document.body.style.overflow === ""
  );

  // A link inside the panel closes it once, not twice.
  document
    .querySelector("[aria-controls='mobile-menu']")
    ?.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await tick();
  const panelLink = document.querySelector("#mobile-menu a");
  panelLink?.dispatchEvent(new window.MouseEvent("mousedown", { bubbles: true }));
  panelLink?.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await tick();
  check(
    "choosing a menu item closes the menu once",
    document.querySelector("[aria-controls='mobile-menu']")?.getAttribute("aria-expanded") === "false",
    `aria-expanded="${document.querySelector("[aria-controls='mobile-menu']")?.getAttribute("aria-expanded")}"`
  );

  // Growing past the desktop breakpoint while open must release the scroll lock.
  document
    .querySelector("[aria-controls='mobile-menu']")
    ?.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await tick();
  check("menu is open again before the resize check", window.document.body.style.overflow === "hidden");
  await resizeToDesktop();
  check(
    "growing to desktop width closes the menu",
    document.querySelector("[aria-controls='mobile-menu']")?.getAttribute("aria-expanded") === "false"
  );
  check(
    "scroll lock is released on resize",
    window.document.body.style.overflow === ""
  );

  // Empty submission must be blocked with per-field errors.
  const form = document.querySelector("form[aria-label='Project brief']");
  check("brief form present", Boolean(form));
  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  await tick();
  const alerts = document.querySelectorAll("[role='alert']");
  check("empty submit produces field errors", alerts.length >= 3, `found ${alerts.length}`);
  check(
    "name is marked aria-invalid",
    document.getElementById("name")?.getAttribute("aria-invalid") === "true"
  );
  check(
    "email is marked aria-invalid",
    document.getElementById("email")?.getAttribute("aria-invalid") === "true"
  );
  check(
    "services group reports an error",
    [...alerts].some((a) => a.textContent.includes("Select at least one service"))
  );
  check("no network call on invalid submit", errors.length === 0, errors.join(" | "));

  // Storage notice.
  const dismiss = [...document.querySelectorAll("button")].find((b) =>
    b.textContent.includes("DISMISS")
  );
  dismiss?.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
  await tick();
  check(
    "dismissing the notice persists the preference",
    window.localStorage.getItem("the-office:notice-dismissed") === "1"
  );
}

/* ------------------------------------------------------------------ */
/* 4. A complete brief reaches the network payload                     */
/* ------------------------------------------------------------------ */

console.log("\nBrief payload wiring:");
{
  const { window, document, calls } = await mount("/");

  setValue(window, document.getElementById("name"), "Ada Lovelace");
  setValue(window, document.getElementById("email"), "ada@example.com");
  setValue(window, document.getElementById("org"), "Analytical Press");
  setValue(
    window,
    document.getElementById("brief"),
    "We need a backlist title repositioned before the spring list is locked."
  );
  setValue(window, document.getElementById("timeline"), "1-3-months");
  setValue(window, document.getElementById("scope"), "full-engagement");
  setValue(window, document.getElementById("budget"), "15k-40k");
  setValue(window, document.getElementById("discovery"), "referral");

  /**
   * Expectations come from src/lib/site.ts, not a copy of it. The previous
   * hardcoded "five choices" and the literal label string silently went stale
   * when a sixth ("Not sure yet") option and renamed services shipped.
   */
  const siteSrc = readFileSync(path.join(root, "src/lib/site.ts"), "utf8");
  const choiceBlock = siteSrc.split("SERVICE_CHOICES")[1]?.split("] as const")[0] ?? "";
  const choices = [...choiceBlock.matchAll(/label:\s*"([^"]+)"/g)].map((m) => m[1]);
  const serviceBoxes = choices.filter((c) => c.toLowerCase() !== "not sure yet");

  const boxes = [...document.querySelectorAll("input[name='services']")];
  check(
    "service choices match SERVICE_CHOICES",
    boxes.length === choices.length,
    `form has ${boxes.length}, site.ts declares ${choices.length}`
  );
  boxes[0].click();
  boxes[2].click();
  await tick();

  const form = document.querySelector("form[aria-label='Project brief']");
  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  await new Promise((r) => setTimeout(r, 120));

  const w3 = calls.find((c) => c.url === "https://api.web3forms.com/submit");
  check("posts to Web3Forms", Boolean(w3));
  check("carries an access key", Boolean(w3?.body?.access_key));
  check(
    "service list is comma-joined labels",
    w3?.body?.service === `${serviceBoxes[0]}, ${serviceBoxes[2]}`,
    `expected "${serviceBoxes[0]}, ${serviceBoxes[2]}" — got "${w3?.body?.service}"`
  );
  check("timeline is a human label", w3?.body?.timeline === "1–3 months", `got "${w3?.body?.timeline}"`);
  check(
    "scope is a human label",
    w3?.body?.scope === "Full engagement — strategy through build",
    `got "${w3?.body?.scope}"`
  );
  check("budget is a human label", w3?.body?.budget === "$15k – $40k", `got "${w3?.body?.budget}"`);
  check(
    "discovery is a human label",
    w3?.body?.discovery === "Referral from a client or colleague",
    `got "${w3?.body?.discovery}"`
  );
  check(
    "honeypot travels empty",
    w3?.body?.company_website === undefined || w3.body.company_website === ""
  );
  /*
   * The default pathway is "project-brief". A lead with no pathway tag is fine,
   * but a lead tagged with a pathway the data file does not define means the form
   * read an id it should not have accepted.
   */
  check(
    "default pathway sends a known tag",
    w3?.body?.interest === "brief",
    `got "${w3?.body?.interest}"`
  );
  check(
    "backend mirror is also called",
    calls.some((c) => c.url === "/api/brief")
  );
  check(
    "success state is shown",
    document.body.textContent.includes("RECEIVED")
  );
}

/* ------------------------------------------------------------------ */
/* 4b. Pathway deep link                                               */
/* ------------------------------------------------------------------ */

console.log("\nInquiry pathway deep link:");
{
  /*
   * A pathway link (/...?type=ai-automation) must preselect the division box and
   * show the pathway's hint, and the tag must reach the payload. This is the only
   * thing that makes the 10 pathways in src/data/inquiryTypes.ts observable: if
   * the preselect silently stops working, leads quietly lose their routing tag
   * and nothing else in the suite would notice.
   */
  const { document, window, calls } = await mount("/?type=ai-automation");
  await tick();

  /*
   * Match the hint sentence, not the pathway label: the label is rendered
   * uppercase and also appears as a service checkbox, so it cannot distinguish
   * "the hint rendered" from "a checkbox rendered". Read the expected string from
   * the data file so a reworded hint does not break this test.
   */
  const inquirySrc = readFileSync(path.join(root, "src/data/inquiryTypes.ts"), "utf8");
  const aiHint = inquirySrc.split('id: "ai-automation"')[1]?.match(/hint:\s*"([^"]+)"/)?.[1] ?? "";
  check(
    "pathway hint is shown on the form",
    Boolean(aiHint) && document.body.textContent.includes(aiHint),
    "hint text not found on the form"
  );

  const checked = [...document.querySelectorAll("input[name='services']")].filter((b) => b.checked);
  check(
    "pathway preselects exactly one division box",
    checked.length === 1 && checked[0].value === "ai-automation",
    `checked: ${checked.map((b) => b.value).join(", ") || "none"}`
  );

  setValue(window, document.getElementById("name"), "Pathway Tester");
  setValue(window, document.getElementById("email"), "pathway@example.com");
  setValue(window, document.getElementById("brief"), "We want to automate invoice entry.");
  setValue(window, document.getElementById("timeline"), "immediately");
  setValue(window, document.getElementById("scope"), "advisory");

  const form = document.querySelector("form[aria-label='Project brief']");
  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  await new Promise((r) => setTimeout(r, 120));

  const w3 = calls.find(
    (c) => c.url === "https://api.web3forms.com/submit" && c.body?.email === "pathway@example.com"
  );
  check("pathway submission is delivered", Boolean(w3));
  check(
    "pathway tag reaches the payload",
    w3?.body?.interest === "ai",
    `got "${w3?.body?.interest}"`
  );

  /*
   * An id that is not in inquiryTypes must fall back rather than leave the form
   * in an unknown state. `getInquiryType` is the guard; this proves it is used.
   */
  const bogus = await mount("/?type=not-a-real-pathway");
  await bogus.tick?.();
  const bogusChecked = [...bogus.document.querySelectorAll("input[name='services']")].filter(
    (b) => b.checked
  );
  check(
    "an unknown pathway id preselects nothing",
    bogusChecked.length === 0,
    `checked: ${bogusChecked.map((b) => b.value).join(", ")}`
  );
}

/* ------------------------------------------------------------------ */
/* 5. Reduced motion                                                   */
/* ------------------------------------------------------------------ */

console.log("\nTyping animation:");
{
  const { document } = await mount("/");
  /*
   * The line is located by its own text, not by an attribute.
   *
   * The component used to expose the finished sentence through aria-label on a
   * role-less <span>; axe flags that as prohibited (the attribute is ignored, so
   * the line had no accessible name) and it now ships a visually-hidden copy
   * instead. These assertions follow that change: find the element by content, read
   * the *animated* span for progress, and require the accessible text to be complete
   * from the first paint regardless of how far the animation has run.
   */
  const TW_TEXT = "A working class of letters";
  const line = () => {
    const tw = [...document.querySelectorAll("span")].find(
      (el) => el.querySelector(".sr-only")?.textContent.includes(TW_TEXT)
    );
    const animated = tw?.querySelector('[aria-hidden="true"]');
    const spoken = tw?.querySelector(".sr-only")?.textContent ?? "";
    return {
      el: tw,
      typed: animated ? animated.textContent.length : -1,
      caret: document.querySelectorAll(".caret").length,
      spoken,
    };
  };
  /**
   * The hero CTA label comes from i18n (cta.requestAnalysis) and reads
   * "REQUEST AN ANALYSIS →" in English. Matching the old literal "SEND A BRIEF"
   * matched nothing, so `className` was undefined and two assertions failed with
   * class="undefined" — which looked like a styling bug in the app and was not.
   */
  const cta = [...document.querySelectorAll('a[href="/contact"]')].find((a) =>
    a.textContent.trim().toUpperCase().startsWith("BOOK A FREE CONSULTATION")
  );

  check(
    "hero CTA found",
    Boolean(cta),
    "no /contact link labelled BOOK A FREE CONSULTATION in the hero"
  );
  /*
   * The hero typewriter was removed with the transformation-brief hero, which now
   * carries two CTAs instead of a reading widget. Asserting the component is gone
   * is worth keeping: a stale import left the homepage 45 KB heavier before, and
   * "the removal actually happened" is a checkable fact.
   */
  check(
    "the retired typewriter is no longer rendered on the homepage",
    !document.querySelector(".caret") && line().typed === -1,
    "a .caret element or typewriter wrapper is still present"
  );
  check("FAQ section renders", document.body.textContent.includes("Questions we actually get."));
  check("Pricing section renders", document.body.textContent.includes("Three shapes of engagement."));
  check("Reviews honesty block renders", document.body.textContent.includes("ASK FOR REFERENCES"));
  {
    const firstService = slugsFrom("src/data/services.ts")[0];
    check(
      "service page links present",
      Boolean(document.querySelector(`a[href="/services/${firstService}"]`)),
      `no link to /services/${firstService}`
    );
  }
  check("footer exposes press + glossary", Boolean(document.querySelector('a[href="/press"]')) && Boolean(document.querySelector('a[href="/glossary"]')));
  check(
    "hero CTA is never invisible-but-clickable",
    !cta?.className.includes("pointer-events-none"),
    `class="${cta?.className}"`
  );
  check(
    "hero CTA keeps its hover colour transition",
    cta?.className.includes("transition-colors") && cta?.className.includes("hover:bg-black/85"),
    `class="${cta?.className}"`
  );

  /*
   * The old assertions here re-read the typewriter after 1.2s and 3.4s to watch it
   * type, and checked a CTA label that no longer exists. Both went with the
   * component; what remains worth asserting is that the replacement hero's primary
   * CTA is present and stable — no timed reveal, nothing that appears late.
   */
  await new Promise((r) => setTimeout(r, 1200));
  const laterCta = [...document.querySelectorAll('a[href="/contact"]')].find((a) =>
    a.textContent.trim().toUpperCase().startsWith("BOOK A FREE CONSULTATION")
  );
  check(
    "the hero CTA is present and unchanged after 1.2s",
    Boolean(laterCta) && !laterCta.className.includes("opacity-0"),
    laterCta ? `class="${laterCta.className}"` : "CTA disappeared"
  );
}

console.log("\nReduced motion:");
{
  const { document } = await mount("/", { reducedMotion: true });
  /*
   * The typewriter is retired (see the typing block above), so reduced-motion is
   * asserted on what replaced it: nothing on the hero animates, and the global
   * reduced-motion rule still ships.
   */
  check(
    "the hero carries no animation to disable",
    document.querySelectorAll(".caret").length === 0,
    "a .caret element is still rendered"
  );
  check(
    "no blinking caret is rendered",
    document.querySelectorAll(".caret").length === 0
  );
  const cta = [...document.querySelectorAll('a[href="#contact"]')].find((a) =>
    a.textContent.trim().toUpperCase().startsWith("REQUEST AN ANALYSIS")
  );
  check(
    "hero CTA is visible",
    !cta?.className.includes("opacity-0"),
    `class="${cta?.className}"`
  );
}

/* ------------------------------------------------------------------ */
/* 6. Shipped CSS carries the a11y rules                               */
/* ------------------------------------------------------------------ */

console.log("\nPortuguese:");
{
  const { document, errors } = await mount("/", { presetLang: "pt" });
  await new Promise((r) => setTimeout(r, 80));
  /*
   * The prerendered document is English. A visitor who previously chose Portuguese
   * therefore hydrates English markup with Portuguese content, which is exactly the
   * shape of a hydration mismatch — and the assertions below would all still pass,
   * because they check what is on screen, not what React did to get there.
   */
  check(
    "a returning Portuguese visitor mounts without a hydration mismatch",
    errors.length === 0,
    errors.join(" | ").slice(0, 1200)
  );
  /*
   * Prove the mechanism, not just the outcome. The document declares English, so a
   * Portuguese visitor must take the create path; if hydration started succeeding
   * here it would mean the guard had silently stopped applying.
   */
  const stampedLang = document.documentElement.getAttribute("data-prerendered-lang");
  check(
    "the prerendered document declares the language it shipped in",
    stampedLang === "en",
    `stamp ${stampedLang || "(none)"}`
  );
  check("html lang switches to pt", document.documentElement.lang === "pt", `lang=${document.documentElement.lang}`);
  check("hero sub is Portuguese", document.body.textContent.includes("ajuda organizações ambiciosas"));
  check("nav Services is Serviços", document.body.textContent.includes("SERVIÇOS"));
  check("form services prompt translated", document.body.textContent.includes("DE QUE PRECISA DE NÓS?"));
  check("FAQ heading translated", document.body.textContent.includes("Perguntas que realmente recebemos."));
  check("language note present", document.body.textContent.includes("publicados em inglês"));
}

console.log("\nDemos interaction:");
{
  const { document } = await mount("/demos");
  const boxes = [...document.querySelectorAll("input[type='checkbox']")];
  check("self-audit renders 10 checks", boxes.length === 10, `found ${boxes.length}`);
  const score = () => document.body.textContent.match(/SCORE: (\d+)\/10/)?.[1];
  check("score starts at 0", score() === "0", `score=${score()}`);
  // answer 8 yes, leave 2 no -> gaps for the services of those two
  boxes[0].click(); boxes[1].click();
  await tick();
  check("score updates on interaction", score() === "2", `score=${score()}`);
  check(
    "gaps map to the right services",
    document.body.textContent.includes("Discoverability Optimization")
  );
}

console.log("\nShipped CSS:");
{
  const cssFile = readdirSync(path.join(root, "dist/assets")).find((f) => f.endsWith(".css"));
  const css = readFileSync(path.join(root, "dist/assets", cssFile), "utf8");
  check("reveal is scoped behind .js", css.includes(".js .reveal"));
  check("reveal visible state targets is-visible", css.includes(".is-visible"));
  check("inverse sections get their own focus ring", css.includes(".on-ink"));
  check("skip link reveals on focus", css.includes(".skip-link:focus"));
  check("reduced-motion media query shipped", css.includes("prefers-reduced-motion"));
  check("charcoal type token shipped", css.includes("#141414"));
  // The minifier may collapse ::after to :after, so accept either.
  const caretRule = css.match(/\.caret:{1,2}after\{[^}]*\}/)?.[0] ?? "";
  check("typewriter caret is pure black", caretRule.includes("background:#000"), caretRule || "rule missing");
  check("warm paper token shipped", css.includes("#f4f3ef"));
  /*
   * The brief lists "no horizontal overflow" as a release condition. Nothing in the
   * layout should overflow -- it is built on max-width containers -- but one long
   * unbroken string in editorial copy is enough to scroll a narrow viewport
   * sideways, and that swipes every fixed element with it. The guard is global, so
   * assert it is present rather than trusting the prose above it.
   */
  check(
    "horizontal overflow is clipped globally",
    /overflow-x:\s*clip/.test(css),
    "body has no overflow-x guard"
  );
}

if (failures > 0) {
  console.error(`\n${failures} DOM check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll DOM checks passed (${STATIC_ASSETS.size} static assets on disk).`);
process.exit(0);
