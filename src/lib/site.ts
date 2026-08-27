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

/**
 * Single source of truth for site-wide constants.
 *
 * SITE_URL is the canonical origin used by index.html, the sitemap, robots.txt
 * and every per-route <link rel="canonical"> written by useDocumentMeta.
 * Override at build time with VITE_SITE_URL when the custom domain goes live.
 */
export const SITE_URL = orFallback(
  envSiteUrl,
  "https://the-office-test4.vercel.app"
).replace(/\/+$/, "");

export const STUDIO_NAME = "THE OFFICE";
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
  /** Anchor target on the home page. */
  anchor: string;
  /** Absolute target from any other page. */
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Services", anchor: "#services", href: "/#services" },
  { label: "Work", anchor: "#work", href: "/#work" },
  { label: "Approach", anchor: "#approach", href: "/#approach" },
  { label: "Why", anchor: "#why", href: "/#why" },
  { label: "About", anchor: "#about", href: "/#about" },
  { label: "Notes", anchor: "/notes", href: "/notes" },
  { label: "Contact", anchor: "#contact", href: "/#contact" },
];

/** Service choices offered in the brief form, keyed to src/data/services.ts. */
export const SERVICE_CHOICES = [
  { value: "book-strategy", label: "Book Strategy" },
  { value: "book-research", label: "Book Research & Analysis" },
  { value: "web-design", label: "Web Design" },
  { value: "automation", label: "Automation" },
  { value: "not-sure", label: "Not sure yet" },
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
