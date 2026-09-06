import { products as defaults, type Product } from "@/data/products";

/**
 * Admin-editable catalog.
 *
 * The published defaults live in src/data/products.ts. The admin panel saves an
 * override to localStorage, which this module prefers when present. A small
 * event lets open pages refresh when the catalog changes.
 *
 * Note: localStorage is per-browser. To publish catalog edits to every visitor
 * you need a shared store (e.g. Vercel KV/Postgres) — this module is the single
 * place to swap that in.
 */
const KEY = "the-office360:catalog";
export const CATALOG_EVENT = "catalogchange";

export function getCatalog(): Product[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const list = JSON.parse(raw) as Product[];
      if (Array.isArray(list) && list.length) return list;
    }
  } catch {
    // fall through to defaults
  }
  return defaults;
}

export function saveCatalog(list: Product[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(CATALOG_EVENT));
  } catch {
    // storage unavailable
  }
}

export function resetCatalog() {
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(CATALOG_EVENT));
  } catch {
    // storage unavailable
  }
}

export function blankProduct(): Product {
  return {
    slug: `product-${Date.now().toString(36)}`,
    name: { en: "New product", pt: "Novo produto" },
    blurb: { en: "", pt: "" },
    priceUsd: 0,
    kind: "digital",
    image: "/products/backlist-audit-pack.jpg",
    format: { en: "PDF", pt: "PDF" },
    includes: { en: [], pt: [] },
    delivery: { en: "Instant download after payment.", pt: "Download imediato após o pagamento." },
  };
}
