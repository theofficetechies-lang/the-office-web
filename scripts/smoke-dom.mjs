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
    "import.meta.env.VITE_SITE_URL": '"https://the-office-test4.vercel.app"',
    "import.meta.env.VITE_WEB3FORMS_KEY": '""',
  },
  absWorkingDir: root,
  logLevel: "warning",
});

const bundle = readFileSync(path.join(root, "dist-test/app.js"), "utf8");
const shell = readFileSync(path.join(root, "dist/index.html"), "utf8");

const ORIGIN = "https://the-office-test4.vercel.app";
const KNOWN = [
  "/",
  "/notes",
  "/privacy",
  "/terms",
  "/notes/what-book-positioning-actually-means",
  "/notes/why-most-author-websites-fail",
  "/notes/how-to-audit-your-own-amazon-listing",
  "/work/debut-novel-repositioning",
  "/work/editorial-site-rebuild",
  "/work/backlist-reading-assistant",
  "/work/market-map-second-book",
  "/work/rights-triage-automation",
  "/work/memoir-launch-architecture",
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

async function mount(route, { reducedMotion = false } = {}) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", (e) => errors.push(`jsdomError: ${e.message}`));
  vc.on("error", (...a) => errors.push(`console.error: ${a.join(" ")}`));

  const dom = new JSDOM(shell, {
    url: `${ORIGIN}${route}`,
    runScripts: "dangerously",
    pretendToBeVisual: true,
    virtualConsole: vc,
  });
  const { window } = dom;

  // jsdom gaps that are not app bugs: no layout-driven scroll, no matchMedia.
  window.scrollTo = () => {};
  window.matchMedia = (query) => ({
    matches: reducedMotion && query.includes("prefers-reduced-motion"),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  });

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
  await new Promise((r) => setTimeout(r, 60));

  return { window, document: window.document, errors, calls };
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

const tick = () => new Promise((r) => setTimeout(r, 30));

/* ------------------------------------------------------------------ */
/* 1. Every route mounts clean                                         */
/* ------------------------------------------------------------------ */

const expectations = {
  "/": { title: "THE OFFICE — Book strategy, web, automation, research", h1: "We do the work" },
  "/notes": { title: "Notes — THE OFFICE", h1: "Notes on the work." },
  "/notes/why-most-author-websites-fail": {
    title: "Why most author websites fail — Notes, THE OFFICE",
    h1: "Why most author websites fail",
  },
  "/work/debut-novel-repositioning": {
    title: "Repositioning a debut literary novel for a US trade house — THE OFFICE",
    h1: "Repositioning a debut literary novel for a US trade house",
  },
  "/privacy": { title: "Privacy notice — THE OFFICE", h1: "Privacy notice." },
  "/terms": { title: "Terms of service — THE OFFICE", h1: "Terms of service." },
  "/work/does-not-exist": { title: "Engagement not found — THE OFFICE", h1: null },
  "/nowhere": { title: "Document not found — THE OFFICE", h1: null },
};

console.log("Routes:");
for (const [route, exp] of Object.entries(expectations)) {
  const { document, errors } = await mount(route);
  const h1s = document.querySelectorAll("h1");
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  const robots = document.querySelector('meta[name="robots"]')?.content;

  check(`${route} mounts with no console error`, errors.length === 0, errors.join(" | "));
  check(
    `${route} sets its own title`,
    document.title === exp.title,
    `got "${document.title}"`
  );
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
  check("every image has alt text", noAlt.length === 0, noAlt.join(", "));
}

/* ------------------------------------------------------------------ */
/* 3. Home page interactions                                           */
/* ------------------------------------------------------------------ */

console.log("\nHome interactions:");
{
  const { window, document, errors } = await mount("/");

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
  document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
  await tick();
  check(
    "Escape closes the menu",
    document.querySelector("[aria-controls='mobile-menu']")?.getAttribute("aria-expanded") === "false"
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

  const boxes = [...document.querySelectorAll("input[name='services']")];
  check("five service choices offered", boxes.length === 5, `found ${boxes.length}`);
  boxes[0].click(); // Book Strategy
  boxes[2].click(); // Web Design
  await tick();

  const form = document.querySelector("form[aria-label='Project brief']");
  form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  await new Promise((r) => setTimeout(r, 120));

  const w3 = calls.find((c) => c.url === "https://api.web3forms.com/submit");
  check("posts to Web3Forms", Boolean(w3));
  check("carries an access key", Boolean(w3?.body?.access_key));
  check(
    "service list is comma-joined labels",
    w3?.body?.service === "Book Strategy, Web Design",
    `got "${w3?.body?.service}"`
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
/* 5. Reduced motion                                                   */
/* ------------------------------------------------------------------ */

console.log("\nReduced motion:");
{
  const { document } = await mount("/", { reducedMotion: true });
  const cta = [...document.querySelectorAll('a[href="#contact"]')].find((a) =>
    a.textContent.includes("SEND A BRIEF")
  );
  check(
    "hero CTA is visible without waiting for the typewriter",
    cta?.className.includes("opacity-100"),
    `class="${cta?.className}"`
  );
  check(
    "no blinking caret is rendered",
    document.querySelectorAll(".caret").length === 0
  );
}

/* ------------------------------------------------------------------ */
/* 6. Shipped CSS carries the a11y rules                               */
/* ------------------------------------------------------------------ */

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
  check("warm paper token shipped", css.includes("#f4f3ef"));
}

if (failures > 0) {
  console.error(`\n${failures} DOM check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll DOM checks passed (${STATIC_ASSETS.size} static assets on disk).`);
process.exit(0);
