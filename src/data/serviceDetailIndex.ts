import type { ServiceDetail } from "./serviceDetailTypes.ts";
import { webServiceDetails } from "./serviceDetails/web.ts";
import { aiServiceDetails } from "./serviceDetails/ai.ts";
import { growthServiceDetails } from "./serviceDetails/growth.ts";
import { brandServiceDetails } from "./serviceDetails/brand.ts";
import { publishingServiceDetails } from "./serviceDetails/publishing.ts";
import { intelligenceServiceDetails } from "./serviceDetails/intelligence.ts";
import { getCatalogService } from "./serviceCatalog.ts";
import { services as publishedServices } from "./services.ts";

/**
 * Written detail for every flagship service.
 *
 * Detail lives in per-division modules under `src/data/serviceDetails/`, so
 * adding a division is a new file rather than a longer one. A flagship service
 * with no entry here is a bug: `scripts/test-content.ts` fails the build rather
 * than letting a half-written page ship.
 */
export const serviceDetails: ServiceDetail[] = [...webServiceDetails, ...aiServiceDetails, ...growthServiceDetails, ...brandServiceDetails, ...publishingServiceDetails, ...intelligenceServiceDetails];

const bySlug = new Map(serviceDetails.map((d) => [d.slug, d]));

export function getServiceDetail(slug: string): ServiceDetail | undefined {
  return bySlug.get(slug);
}

/** A link target for a related service, resolving catalogue and published slugs. */
export interface RelatedLink {
  slug: string;
  title: string;
  href: string;
}

/**
 * Resolve a related-service slug to something linkable. Returns undefined for an
 * unknown slug so callers omit it rather than render a dead link; the content
 * test asserts that none of them are undefined.
 */
export function resolveRelated(slug: string): RelatedLink | undefined {
  const detail = bySlug.get(slug);
  const catalog = getCatalogService(slug);
  const published = publishedServices.find((p) => p.slug === slug);

  if (detail) {
    return {
      slug,
      title: catalog?.title ?? published?.title ?? slug,
      href: `/services/${slug}`,
    };
  }

  // Catalogue-tier services are anchored entries on their division hub.
  if (catalog) {
    return { slug, title: catalog.title, href: `/services/${catalog.division}#${catalog.slug}` };
  }

  if (published) return { slug, title: published.title, href: `/services/${slug}` };

  return undefined;
}
