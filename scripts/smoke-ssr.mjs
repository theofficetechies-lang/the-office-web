/**
 * Smoke test: renders every route through the real App tree in Node and
 * asserts the things that matter — that each route resolves, that the Phase
 * sections exist, and that the fabricated content removed in this pass stays
 * removed.
 *
 *   npm run smoke
 */
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { JSDOM, VirtualConsole } from "jsdom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

/* axe-core ships as a browser bundle; read it once and eval it into each jsdom. */
let axeSrc = null;
try {
  axeSrc = readFileSync(path.join(root, "node_modules/axe-core/axe.min.js"), "utf8");
} catch {
  console.warn("! axe-core not installed - skipping the rule-engine accessibility pass");
}

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

/*
 * The same head resolver the prerenderer uses. Imported rather than reimplemented
 * so a change to one cannot drift from a change to the other.
 */
const seoPath = path.join(root, "dist/dist-ssr/seo.js");
const hasSeo = existsSync(seoPath);
const seoGlobal = hasSeo ? await import(seoPath) : {};

const cases = [
  {
    route: "/",
    must: [
      "Transform your business",
      "Five services. One analytical method.",
      "What the work looks like when it is done properly.",
      "Six stages. Then we bend them to fit the brief.",
      "Eight things that are true about how we work.",
      "A studio of four, by design.",
      "Send us the",
      "SHAPE OF THE WORK",
      "BUDGET RANGE (OPTIONAL)",
      "HOW DID YOU FIND US?",
      "Amazon SEO Performance Report",
      "skip-link",
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
  {
    route: "/admin",
    /*
     * Unconfigured is the shipped default (VITE_ADMIN_PASSCODE is empty in the
     * build), so the panel must state that it is not configured rather than render
     * a login form. The old assertion required the word "Passcode", which was
     * satisfied by a form no visitor could use as a real gate.
     */
    must: ["Store admin is not configured", "not a login"],
    mustNot: ["admin123", "Default preview passcode"],
  },
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
    html = await render();
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
/* Deterministic render ↔ shipped document                             */
/* ------------------------------------------------------------------ */
/*
 * The strongest hydration check available without a browser.
 *
 * React hydration compares the client's render to the markup in the document. If
 * a component's server render is not deterministic — a timestamp, Math.random, a
 * locale-dependent number format, anything read from the clock at render time —
 * the two disagree and React silently throws the markup away and re-renders.
 * That failure is invisible in the "route mounts" checks, because the page still
 * works; it just stops being a prerendered page.
 *
 * So: render every route again, right now, and compare byte-for-byte with what
 * the build wrote. 96 routes also means every component in every state the build
 * visits is covered, rather than the handful in the fixed case list.
 */
if (!hasSeo) {
  /*
   * A skipped check is not a passing check. The first version of this silently did
   * nothing because prerender deletes its intermediate bundles, which is the same
   * class of mistake as the smoke suite that "passed" for several releases.
   * Build seo.js here if it is absent so the check always runs.
   */
  execSync("npx vite build --ssr src/lib/seo.ts --outDir dist-ssr --logLevel warn", {
    cwd: root,
    stdio: "inherit",
  });
  const built = await import(path.join(root, "dist-ssr/seo.js"));
  Object.assign(seoGlobal, built);
}

if (typeof seoGlobal.prerenderPaths === "function" && typeof render === "function") {
  const failuresBefore = failures;
  const routes = seoGlobal.prerenderPaths();
  const drifted = [];
  const missing = [];

  const sentinel = "<div id=\"root\">";
  for (const route of routes) {
    const file = route === "/" ? path.join(root, "dist/index.html") : path.join(root, "dist", route, "index.html");
    if (!existsSync(file)) {
      missing.push(route);
      continue;
    }
    globalThis.window.location.pathname = route;
    globalThis.window.location.href = `https://www.the-office360.com${route}`;

    let fresh = "";
    try {
      fresh = await render();
    } catch (err) {
      drifted.push(`${route}: render threw ${err.message}`);
      continue;
    }

    const shipped = readFileSync(file, "utf8");
    /*
     * The mount node's content runs from <div id="root"> to </body>.
     *
     * Both "first script tag" and "last script tag" are wrong here: Vite hoists
     * modulepreload AND the module script above #root in this build, so either
     * marker produced an empty slice and 96 false "drifted" reports. </body> is the
     * only boundary that is downstream of the markup.
     */
    const startAt = shipped.indexOf(sentinel) + sentinel.length;
    const endAt = shipped.indexOf("</body>");
    /*
     * Strip the mount node's own closing </div>, which sits just before </body>
     * when the renderer's output ends in an element root.
     */
    const shippedRoot = shipped.slice(startAt, endAt).replace(/\s*<\/div>\s*$/, "");

    /* The root content ends at the script tag; trim the closing div it leaves. */
    if (shippedRoot.trim() !== fresh.trim()) {
      /*
       * Report where they first differ — a byte count alone sends you hunting.
       */
      let i = 0;
      while (i < Math.min(shippedRoot.length, fresh.length) && shippedRoot[i] === fresh[i]) i++;
      drifted.push(
        `${route}: differs at ${i} — shipped …"${shippedRoot.slice(Math.max(0, i - 20), i + 40)}" vs fresh …"${fresh.slice(Math.max(0, i - 20), i + 40)}" (shipped ${shippedRoot.length}B, fresh ${fresh.length}B)`
      );
    }

    /* The head the prerenderer would write must match the head that shipped. */
    try {
      const expected = seoGlobal.headFor(route);
      const escaped = expected.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const shippedTitle = shipped.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
      if (shippedTitle !== escaped) {
        drifted.push(`${route}: title "${shippedTitle}" vs resolver "${escaped}"`);
      }
      const shippedCanonical = shipped.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
      if (shippedCanonical !== expected.url) {
        drifted.push(`${route}: canonical "${shippedCanonical}" vs resolver "${expected.url}"`);
      }
    } catch (err) {
      drifted.push(`${route}: headFor threw ${err.message}`);
    }
  }

  if (missing.length > 0) {
    failures++;
    console.error(`✗ ${missing.length} prerendered route(s) missing from dist`);
    missing.slice(0, 6).forEach((m) => console.error(`    ${m}`));
  }
  if (drifted.length > 0) {
    failures++;
    console.error(`✗ every route re-renders identically (${drifted.length} drifted)`);
    drifted.slice(0, 6).forEach((d) => console.error(`    ${d}`));
  }
  if (failures === failuresBefore) {
    console.log(`✓ ${routes.length} routes re-render byte-identically to what shipped, head included`);
  }
}

/* ------------------------------------------------------------------ */
/* Accessibility of the shipped markup                                 */
/* ------------------------------------------------------------------ */
/*
 * These are the checks that can be made from the HTML alone. They are not a
 * substitute for a screen reader or a keyboard, neither of which exists in this
 * sandbox — but they catch the failures that matter most and recur most:
 * controls with no accessible name, images with no alt, a missing landmark, and a
 * clickable div that no keyboard can reach.
 *
 * Real findings when added: the store checkout inputs relied on placeholder text
 * for their names, so the name and email fields on the PAYMENT step had no
 * accessible name. Tickets fixed; this keeps them fixed.
 */
{
  const issues = [];
  const files = [];
  const collect = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry === "assets" || entry === "dist-ssr") continue;
        collect(full);
      } else if (entry === "index.html") files.push(full);
    }
  };
  collect(path.join(root, "dist"));

  for (const file of files) {
    const route = "/" + path.relative(path.join(root, "dist"), path.dirname(file)).replace(/\\/g, "/");
    const html = readFileSync(file, "utf8");
    const body = html.slice(html.indexOf('<div id="root">'));

    if (!body.includes('id="main"')) issues.push(`${route}: no #main landmark`);
    if ((body.match(/id="main"/g) ?? []).length > 1) issues.push(`${route}: more than one #main`);

    /* A control must have a name from aria, an id, or an enclosing <label>. */
    const insideLabel = (pos) => {
      const before = body.slice(0, pos);
      const opens = (before.match(/<label\b/g) ?? []).length;
      const closes = (before.match(/<\/label>/g) ?? []).length;
      return opens > closes;
    };
    for (const m of body.matchAll(/<input\b([^>]*)>/g)) {
      const attrs = m[1];
      if (attrs.includes('type="hidden"')) continue;
      const named =
        attrs.includes("aria-label") ||
        attrs.includes("aria-labelledby") ||
        /\bid="/.test(attrs) ||
        insideLabel(m.index);
      if (!named) issues.push(`${route}: input with no accessible name`);
    }

    for (const m of body.matchAll(/<img\b([^>]*)>/g)) {
      if (!/\balt=/.test(m[1])) issues.push(`${route}: img without alt`);
    }

    for (const m of body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
      const text = m[2].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
      const attrs = m[1];
      if (!text && !attrs.includes("aria-label") && !attrs.includes("aria-labelledby")) {
        issues.push(`${route}: link with no accessible name`);
      }
    }

    if (/<div[^>]*onclick=/i.test(body)) issues.push(`${route}: clickable div (unreachable by keyboard)`);
  }

  if (issues.length === 0) {
    console.log(`✓ ${files.length} pages pass the static accessibility checks`);
  } else {
    failures++;
    console.error(`✗ ${issues.length} accessibility issue(s)`);
    [...new Set(issues)].slice(0, 8).forEach((i) => console.error(`    ${i}`));
  }
}

/* ------------------------------------------------------------------ */
/* Hero headline shape                                                 */
/* ------------------------------------------------------------------ */
/*
 * The h1 renders in 112px display type at the largest breakpoint. A line that
 * grows by a clause is not a copy change only: at that size a long line wraps,
 * pushes the fold down, and breaks the three-line rhythm the hero is built on.
 * The headline was replaced wholesale by the transformation brief, so this pins
 * both the shape and the two required clauses rather than letting a future edit
 * quietly revert to a literary one-liner or overflow the fold.
 *
 * Measured without a layout engine, so it is a character budget, not a pixel
 * measurement; it is a tripwire for a wholesale rewrite, not a typesetter.
 */
{
  const home = readFileSync(path.join(root, "dist/index.html"), "utf8");
  const h1 = home.match(/<h1[^>]*id="hero-heading"[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "";
  const lines = h1
    .split(/<br\s*\/?>/i)
    .map((l) => l.replace(/<[^>]+>/g, "").replace(/&#x27;/g, "'").replace(/&amp;/g, "&").trim())
    .filter(Boolean);
  const problems = [];
  if (lines.length !== 3) problems.push(`expected 3 lines, found ${lines.length}`);
  for (const [i, line] of lines.entries()) {
    if (line.length > 42) problems.push(`line ${i + 1} is ${line.length} chars: "${line}"`);
  }
  const headline = lines.join(" ").toLowerCase();
  if (!headline.includes("transform your business")) problems.push("missing the transformation clause");
  if (!headline.includes("digital future")) problems.push("missing the digital-future clause");
  if (problems.length === 0) {
    console.log("✓ the hero headline holds its three-line shape and both required clauses");
  } else {
    failures++;
    console.error(`✗ hero headline — ${problems.join(" | ")}`);
  }
}

/* ------------------------------------------------------------------ */
/* Real accessibility rules (axe-core)                                 */
/* ------------------------------------------------------------------ */
/*
 * The static checks above are regexes, and regexes cannot see ARIA semantics. Two
 * genuine defects survived them on this site: an aria-label on a role-less <span>
 * (prohibited, so silently ignored - the typewriter had no accessible name at all)
 * and two <nav> landmarks sharing the label "Services". Both are invisible to a
 * pattern match and immediate to a rule engine.
 *
 * axe-core runs happily against jsdom, so this costs no browser and no new
 * dependency. It is not a substitute for axe in a real browser - jsdom has no
 * layout, so contrast and target-size checks report "incomplete" rather than
 * passing or failing - and it is treated that way here: violations fail, and the
 * checks that need layout are namespaced out rather than counted as clean.
 */
if (typeof axeSrc === "string") {
  const layoutOnly = new Set(["color-contrast", "target-size", "scrollable-region-focusable"]);
  const axeIssues = [];

  const axeRoutes = [];
  const gather = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry === "assets" || entry === "dist-ssr") continue;
        gather(full);
      } else if (entry === "index.html") {
        const rel = path.relative(path.join(root, "dist"), path.dirname(full)).replace(/\\/g, "/");
        axeRoutes.push(rel === "" ? "/" : `/${rel}`);
      }
    }
  };
  gather(path.join(root, "dist"));

  for (const route of axeRoutes) {
    const file = route === "/" ? path.join(root, "dist", "index.html") : path.join(root, "dist", route.slice(1), "index.html");
    const dom = new JSDOM(readFileSync(file, "utf8"), {
      url: `https://www.the-office360.com${route}`,
      runScripts: "outside-only",
      pretendToBeVisual: true,
      virtualConsole: new VirtualConsole(),
    });
    const win = dom.window;
    try {
      win.eval(axeSrc);
      const result = await win.axe.run(win.document, { resultTypes: ["violations"] });
      for (const v of result.violations) {
        if (layoutOnly.has(v.id)) continue;
        axeIssues.push(`${route}: ${v.id} (${v.impact}) - ${v.nodes[0]?.html?.slice(0, 90) ?? ""}`);
      }
    } finally {
      win.close();
    }
  }

  if (axeIssues.length === 0) {
    console.log(`✓ all ${axeRoutes.length} pages pass axe-core (WCAG A/AA rules that do not need layout)`);
  } else {
    failures++;
    console.error(`✗ ${axeIssues.length} axe-core violation(s)`);
    [...new Set(axeIssues)].slice(0, 8).forEach((i) => console.error(`    ${i}`));
  }
}

/* ------------------------------------------------------------------ */
/* Structured data validity                                            */
/* ------------------------------------------------------------------ */
/*
 * D12 was "no breadcrumb/Service/FAQ schema". Schema now exists on every page, but
 * emitting it unvalidated is barely better than not emitting it: a typo in a
 * required property is silently ignored by crawlers, and breadcrumb positions that
 * do not run 1..n are a common way to have a valid-looking graph rejected.
 *
 * This checks what a validator checks — parseable JSON, required properties per
 * type, breadcrumb position and absolute URLs, FAQ answers that exist — against
 * the shipped files, so it covers every route rather than a sample.
 */
{
  const REQUIRED = {
    BreadcrumbList: ["itemListElement"],
    ListItem: ["position", "name"],
    Service: ["name"],
    FAQPage: ["mainEntity"],
    Question: ["name", "acceptedAnswer"],
    Answer: ["text"],
    Article: ["headline"],
    CollectionPage: ["name"],
    ProfessionalService: ["name"],
    WebSite: ["url"],
  };

  const problems = [];
  const seen = new Map();
  let blocks = 0;

  const files = [];
  const collect = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry === "assets" || entry === "dist-ssr") continue;
        collect(full);
      } else if (entry === "index.html") files.push(full);
    }
  };
  collect(path.join(root, "dist"));

  for (const file of files) {
    const route = "/" + path.relative(path.join(root, "dist"), path.dirname(file)).replace(/\\/g, "/");
    const html = readFileSync(file, "utf8");
    const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    let m;
    while ((m = re.exec(html))) {
      blocks++;
      let data;
      try {
        data = JSON.parse(m[1]);
      } catch (err) {
        problems.push(`${route}: unparseable JSON-LD (${err.message.slice(0, 60)})`);
        continue;
      }
      if (!data["@context"]) problems.push(`${route}: JSON-LD without @context`);
      const graph = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
      for (const node of graph) {
        const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
        for (const t of types) {
          seen.set(t, (seen.get(t) ?? 0) + 1);
          for (const req of REQUIRED[t] ?? []) {
            const v = node[req];
            if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) {
              problems.push(`${route}: ${t} missing ${req}`);
            }
          }
        }
        if (types.includes("BreadcrumbList")) {
          const els = node.itemListElement ?? [];
          if (els.length < 2) problems.push(`${route}: breadcrumb has ${els.length} item(s)`);
          els.forEach((el, i) => {
            if (el.position !== i + 1) {
              problems.push(`${route}: breadcrumb position ${el.position} at index ${i + 1}`);
            }
            if (typeof el.item === "string" && !el.item.startsWith("https://")) {
              problems.push(`${route}: breadcrumb item not absolute (${el.item})`);
            }
          });
        }
        if (types.includes("FAQPage")) {
          for (const q of node.mainEntity ?? []) {
            if (!q?.acceptedAnswer?.text) problems.push(`${route}: FAQ question with no answer text`);
          }
        }
      }
    }
  }

  if (problems.length === 0) {
    const summary = [...seen.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([t, n]) => `${t}×${n}`)
      .join(" ");
    console.log(`✓ ${blocks} JSON-LD blocks valid across ${files.length} pages (${summary})`);
  } else {
    failures++;
    console.error(`✗ ${problems.length} structured-data problem(s)`);
    problems.slice(0, 8).forEach((p) => console.error(`    ${p}`));
  }
}

/* ------------------------------------------------------------------ */
/* Crawlability: every page reachable from the homepage                */
/* ------------------------------------------------------------------ */
/*
 * Prerendering 96 pages with a sitemap is not the same as making them findable.
 * This site previously had "Services" in the navigation pointing at /#services —
 * the homepage section — so /services, the six division hubs, the 40 flagship
 * pages and the 20 industry pages had no inbound link from the site chrome at all.
 * 68 of 96 pages were orphaned while being listed in the sitemap, which is the
 * shape of a site that is technically published and practically invisible.
 */
{
  const dist = path.join(root, "dist");
  const pages = new Map();
  const collect = (dir, prefix = "") => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry === "assets" || entry === "dist-ssr") continue;
        collect(full, `${prefix}/${entry}`);
      } else if (entry === "index.html" && prefix !== "") {
        pages.set(prefix, full);
      }
    }
  };
  pages.set("/", path.join(dist, "index.html"));
  collect(dist);

  const links = new Map();
  for (const [route, file] of pages) {
    const html = readFileSync(file, "utf8");
    const body = html.slice(html.indexOf('<div id="root">'));
    const targets = new Set();
    for (const m of body.matchAll(/href="(\/[^"#?]*)"/g)) {
      const t = m[1].replace(/\/$/, "") || "/";
      if (pages.has(t)) targets.add(t);
    }
    links.set(route, targets);
  }

  const depth = new Map([["/", 0]]);
  const queue = ["/"];
  while (queue.length) {
    const route = queue.shift();
    for (const target of links.get(route) ?? []) {
      if (!depth.has(target)) {
        depth.set(target, depth.get(route) + 1);
        queue.push(target);
      }
    }
  }

  const unreachable = [...pages.keys()].filter((r) => !depth.has(r)).sort();
  if (unreachable.length === 0) {
    const maxDepth = Math.max(...depth.values());
    console.log(`✓ all ${pages.size} pages reachable from / (max depth ${maxDepth})`);
    if (maxDepth > 4) {
      failures++;
      console.error("✗ pages are more than 4 clicks from the homepage");
    }
  } else {
    failures++;
    console.error(`✗ ${unreachable.length} page(s) unreachable from /`);
    unreachable.slice(0, 8).forEach((u) => console.error(`    ${u}`));
  }
}

/* ------------------------------------------------------------------ */
/* Structural validity of every shipped document                       */
/* ------------------------------------------------------------------ */
/*
 * Browsers recover from malformed HTML, and that recovery is what hid a dropped
 * </div> in all 96 documents: the page rendered correctly, so nothing complained.
 * A stack-based checker is not a full HTML5 parser, but it catches the class of
 * error a string-splicing prerenderer actually produces — unbalanced tags and
 * stray closers — and it runs over everything that ships.
 */
{
  const VOID = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
  const OPTIONAL = new Set(["p","li","td","th","tr","option","dt","dd"]);

  function checkBalance(html) {
    const stack = [];
    const errors = [];
    const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(\/?)>/g;
    /* Skip the contents of <script> and comments, which contain angle brackets. */
    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, "<script></script>")
      .replace(/<!--[\s\S]*?-->/g, "");
    let m;
    while ((m = tagRe.exec(cleaned))) {
      const [, closing, rawTag, , selfClose] = m;
      const tag = rawTag.toLowerCase();
      if (VOID.has(tag) || selfClose) continue;
      if (!closing) {
        stack.push(tag);
      } else if (stack.length === 0) {
        errors.push(`stray </${tag}>`);
      } else if (stack[stack.length - 1] === tag) {
        stack.pop();
      } else if (OPTIONAL.has(tag) && stack.includes(tag)) {
        while (stack.length && stack[stack.length - 1] !== tag) stack.pop();
        stack.pop();
      } else {
        errors.push(`</${tag}> closes <${stack[stack.length - 1]}>`);
      }
    }
    const leftover = stack.filter((t) => t !== "html" && t !== "body");
    if (leftover.length) errors.push(`unclosed ${leftover.slice(0, 3).join(", ")}`);
    return errors;
  }

  const docs = [];
  const collect = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry === "assets" || entry === "dist-ssr") continue;
        collect(full);
      } else if (entry === "index.html" || entry === "404.html") {
        docs.push(full);
      }
    }
  };
  collect(path.join(root, "dist"));

  const broken = [];
  for (const file of docs) {
    const errs = checkBalance(readFileSync(file, "utf8"));
    if (errs.length) broken.push(`${path.relative(path.join(root, "dist"), file)}: ${errs[0]}`);
  }

  if (broken.length === 0) {
    console.log(`✓ ${docs.length} shipped documents are structurally balanced`);
  } else {
    failures++;
    console.error(`✗ ${broken.length} malformed document(s)`);
    broken.slice(0, 6).forEach((b) => console.error(`    ${b}`));
  }
}

/* ------------------------------------------------------------------ */
/* No shipped default credentials                                      */
/* ------------------------------------------------------------------ */
/*
 * This literal shipped in the public bundle and was printed on the admin screen.
 * A build-time passcode cannot be secret, so the only safe default is none.
 */
{
  const bundles = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry.endsWith(".js")) bundles.push(full);
    }
  };
  walk(path.join(root, "dist/assets"));
  const offenders = bundles.filter((f) => readFileSync(f, "utf8").includes("admin123"));
  if (offenders.length === 0) {
    console.log(`✓ no default credential in ${bundles.length} shipped bundles`);
  } else {
    failures++;
    console.error("✗ a default credential ships in the client bundle");
    offenders.forEach((f) => console.error(`    ${path.relative(root, f)}`));
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
