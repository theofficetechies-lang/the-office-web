/**
 * Which slugs have a written detail page — without importing the copy.
 *
 * `serviceDetailIndex` re-exports 150 kB of page content. App.tsx needs exactly one
 * bit of information from it: whether a slug is a flagship page or one of the five
 * published ones. Importing the index to answer that pulled every service page's
 * prose into the entry bundle, so the split in App.tsx moved the *components* out
 * and left the *content* behind.
 *
 * This module imports only the catalogue, which is already needed for navigation.
 * It must stay in agreement with serviceDetailIndex, and the content test asserts
 * that: every slug listed here has a detail entry, and vice versa.
 */
import { serviceCatalog } from "./serviceCatalog.ts";

/** Slugs rendered by ServiceDetailPage rather than the original ServicePage. */
export const DETAIL_SLUGS: ReadonlySet<string> = new Set(
  serviceCatalog.filter((s) => s.tier === "flagship").map((s) => s.slug)
);

export function hasServiceDetail(slug: string): boolean {
  return DETAIL_SLUGS.has(slug);
}
