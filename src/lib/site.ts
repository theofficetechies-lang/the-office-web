/**
 * Empty-string-safe environment read.
 *
 * `import.meta.env.X ?? fallback` is not enough: a `.env` line like `X=` gives
 * an empty string, which is not nullish, so the fallback would never apply and
 * the form would silently post without an access key.
 *
 * The member accesses below stay literal on purpose — both Vite and esbuild
 * replace `import.meta.env.VITE_*` statically, so a dynamic
 * `import.meta.env[name]` lookup would survive unbundled and break at runtime.
 */
function orFallback(value: string | undefined, fallback: string): string {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed.length > 0 ? trimmed : fallback;
}

const envSiteUrl = import.meta.env.VITE_SITE_URL;
const envWeb3FormsKey = import.meta.env.VITE_WEB3FORMS_KEY;
const envNgnPerUsd = import.meta.env.VITE_NGN_PER_USD;

/**
 * Single source of truth for site-wide constants.
 *
 * SITE_URL is the canonical origin used by index.html, the sitemap, robots.txt
 * and every per-route <link rel="canonical"> written by useDocumentMeta.
 * Override at build time with VITE_SITE_URL. The fallback is the live custom
 * domain: every canonical, hreflang, OG url and sitemap entry is derived from
 * this value, so a stale fallback silently tells search engines the production
 * domain is a duplicate of a preview deployment.
 */
export const SITE_URL = orFallback(
  envSiteUrl,
  "https://www.the-office360.com"
).replace(/\/+$/, "");

/**
 * NGN per USD, as shown to the customer at checkout.
 *
 * Mirrors the server's `NGN_PER_USD` (read in api/paystack.ts). The server is the
 * authority for the amount actually charged; this value only drives the
 * "US$49 — charged as ₦75,950" line, so a mismatch degrades a display, never a
 * payment. Set both, or neither.
 */
export const NGN_PER_USD = parseRate(envNgnPerUsd);

function parseRate(value: string | undefined): number {
  const raw = typeof value === "string" ? value.trim() : "";
  const parsed = Number(raw);
  if (!raw || !Number.isFinite(parsed) || parsed < 100 || parsed > 10_000) return 1550;
  return parsed;
}

export const STUDIO_NAME = "THE OFFICE 360";
export const CONTACT_EMAIL = "theofficetechies@gmail.com";

/**
 * Web3Forms access key. This key is, by design, visible in the browser bundle —
 * that is how Web3Forms works. It is kept in exactly one place so it can be
 * rotated from one file, and it can be overridden with VITE_WEB3FORMS_KEY.
 */
export const WEB3FORMS_KEY = orFallback(
  envWeb3FormsKey,
  "9c3fe5d9-088e-4c8c-80b9-5a2d3702d395"
);

/** Primary navigation, in the order the brief specifies. */
export interface NavItem {
  label: string;
  /** i18n key for the translated label. */
  tkey: string;
  /** Anchor target on the home page. */
  anchor: string;
  /** Absolute target from any other page. */
  href: string;
}

/**
 * Primary navigation.
 *
 * "Services" points at the /services index, not the homepage's #services section.
 * It used to anchor to the homepage, which meant the six divisions, the 40
 * flagship pages and the 20 industry pages had no inbound link from anywhere in
 * the site chrome — they were reachable only by typing a URL, so 68 of 96 pages
 * were orphaned despite being in the sitemap.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "Services", tkey: "nav.services", anchor: "/services", href: "/services" },
  { label: "Work", tkey: "nav.work", anchor: "#work", href: "/#work" },
  { label: "Approach", tkey: "nav.approach", anchor: "#approach", href: "/#approach" },
  { label: "Why", tkey: "nav.why", anchor: "#why", href: "/#why" },
  { label: "About", tkey: "nav.about", anchor: "#about", href: "/#about" },
  { label: "Industries", tkey: "nav.industries", anchor: "/industries", href: "/industries" },
  { label: "Notes", tkey: "nav.notes", anchor: "/notes", href: "/notes" },
  { label: "Contact", tkey: "nav.contact", anchor: "#contact", href: "/#contact" },
];

/**
 * Service choices offered in the brief form, grouped by the six divisions.
 *
 * These were the five published publishing services plus "Not sure yet" — the
 * form was still selling the old one-division site. A visitor who wanted a
 * website, an automation or an audit had no honest box to tick, and would tick
 * the nearest publishing service instead, which mis-tagged the lead on arrival.
 *
 * `value` is the stable lead tag. Do not change an existing one: leads already
 * reference them. `service` in the payload is the human label, so the inbox stays
 * readable without a lookup.
 */
export const SERVICE_CHOICES = [
  { value: "web", label: "Websites & platforms", division: "web" },
  { value: "ai-automation", label: "AI & automation", division: "ai" },
  { value: "growth", label: "SEO & digital growth", division: "growth" },
  { value: "brand", label: "Branding & design", division: "brand" },
  { value: "publishing", label: "Publishing & author services", division: "publishing" },
  { value: "consulting", label: "Technology consulting", division: "intelligence" },
  { value: "not-sure", label: "Not sure yet", division: "" },
] as const;

export const TIMELINE_CHOICES = [
  { value: "immediately", label: "As soon as possible" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "6-months-plus", label: "6 months or more" },
  { value: "exploring", label: "Just exploring right now" },
] as const;

export const SCOPE_CHOICES = [
  { value: "advisory", label: "Advisory — a few days of senior time" },
  { value: "single-deliverable", label: "One deliverable — a document, a site, a tool" },
  { value: "full-engagement", label: "Full engagement — strategy through build" },
  { value: "ongoing", label: "Ongoing / retainer" },
] as const;

export const BUDGET_CHOICES = [
  { value: "under-5k", label: "Under $5k" },
  { value: "5k-15k", label: "$5k – $15k" },
  { value: "15k-40k", label: "$15k – $40k" },
  { value: "40k-plus", label: "$40k+" },
  { value: "not-set", label: "Not set yet" },
] as const;

export const DISCOVERY_CHOICES = [
  { value: "search", label: "Search" },
  { value: "referral", label: "Referral from a client or colleague" },
  { value: "notes", label: "Our notes / writing" },
  { value: "social", label: "Social" },
  { value: "other", label: "Somewhere else" },
] as const;
