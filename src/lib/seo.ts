/**
 * Per-route <head> content for static prerendering.
 *
 * WHY THIS EXISTS
 * ---------------
 * The site deploys as a single-page app: vercel.json rewrites every path to
 * index.html. That means a crawler, a link unfurler or a visitor with slow JS
 * used to receive `index.html` — with the homepage's title, description and
 * canonical — for all 60+ routes. Every one of the new service and industry
 * pages existed to win search traffic while presenting the same head.
 *
 * React Router is not used, so there is no framework metadata API to reuse.
 * Instead this module mirrors `useDocumentMeta` (src/hooks/useDocumentMeta.ts)
 * and must be kept in agreement with it: the smoke suite asserts that the
 * prerendered head matches what the client writes after hydration, so the two
 * cannot drift silently.
 *
 * This runs in Node during `npm run build` (scripts/prerender.mjs). It must stay
 * free of browser APIs.
 */
import { matchRoute } from "./router";
import { SITE_URL, STUDIO_NAME } from "./site";
import { getServiceDetail } from "../data/serviceDetailIndex";
import { getDivision, divisions } from "../data/divisions";
import { getIndustry, industries } from "../data/industries";
import { serviceCatalog } from "../data/serviceCatalog";
import { services as publishedServices } from "../data/services";
import { notesData as notes } from "../data/notes";
import { projects } from "../data/projects";
import { products } from "../data/products";

export interface HeadMeta {
  title: string;
  description: string;
  /** Absolute canonical URL. */
  url: string;
  noindex: boolean;
  /** Schema.org nodes for this route, appended to the site-wide graph. */
  jsonLd: unknown[];
}

const DEFAULT_DESCRIPTION =
  "THE OFFICE 360 — a four-person studio for book strategy, book research, web design, and automation. Research, strategy, design and technology on one brief. No subcontractors, no juniors on your project.";

function truncate(text: string, max = 158): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 60 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]$/, "")}…`;
}

const breadcrumb = (name: string, path: string, trail: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    ...trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 2,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
    { "@type": "ListItem", position: trail.length + 2, name, item: `${SITE_URL}${path}` },
  ],
});

/**
 * Resolve the head for a path. Unknown paths deliberately return the 404 head
 * with noindex — never a fallback that advertises a page that does not exist.
 */
/*
 * NOTE ON DRIFT
 * -------------
 * Several pages own their title in useDocumentMeta and some of them are bilingual
 * (the Portuguese string differs). Those titles are copied here so the prerendered
 * head matches what mounts a moment later. The DOM suite mounts EVERY prerendered
 * route and fails if the mounted title differs from the served one, so this copy
 * cannot silently rot — it fails the build instead.
 *
 * Where a page's title is generated (services, industries, notes), it is resolved
 * from the same data here rather than copied.
 */
export function headFor(path: string): HeadMeta {
  const route = matchRoute(path);
  const notFound: HeadMeta = {
    title: "Document not found — THE OFFICE 360",
    description: "That page is not in the archive.",
    url: `${SITE_URL}${path}`,
    noindex: true,
    jsonLd: [],
  };

  switch (route.kind) {
    /* ---------------------------------------------------------- services */
    case "servicesIndex":
      return {
        title: "Services — web, AI & automation, growth, brand, publishing, consulting — THE OFFICE 360",
        description: truncate(
          "Six divisions: web development and digital architecture, AI and business automation, digital growth, branding and design, publishing and book discoverability, and technology consulting."
        ),
        url: `${SITE_URL}/services`,
        noindex: false,
        jsonLd: [
          breadcrumb("Services", "/services", []),
          {
            "@type": "CollectionPage",
            name: "Services",
            url: `${SITE_URL}/services`,
            description: "Six divisions. One analytical method.",
          },
        ],
      };

    case "division": {
      const division = getDivision(route.id);
      if (!division) return notFound;
      return {
        title: `${division.title} — Services — THE OFFICE 360`,
        description: truncate(division.tagline),
        url: `${SITE_URL}/services/${division.id}`,
        noindex: false,
        jsonLd: [
          breadcrumb(division.title, `/services/${division.id}`, [
            { name: "Services", path: "/services" },
          ]),
          {
            "@type": "CollectionPage",
            name: division.title,
            url: `${SITE_URL}/services/${division.id}`,
            description: division.tagline,
          },
        ],
      };
    }

    case "service": {
      const detail = getServiceDetail(route.slug);
      const entry = serviceCatalog.find((s) => s.slug === route.slug);
      const published = publishedServices.find((s) => s.slug === route.slug);

      // Phase-2 flagship page.
      if (detail) {
        const division = entry ? getDivision(entry.division) : undefined;
        return {
          title: `${entry?.title ?? route.slug} — Services — THE OFFICE 360`,
          description: truncate(detail.summary),
          url: `${SITE_URL}/services/${route.slug}`,
          noindex: false,
          jsonLd: [
            breadcrumb(entry?.title ?? route.slug, `/services/${route.slug}`, [
              { name: "Services", path: "/services" },
              ...(division ? [{ name: division.title, path: `/services/${division.id}` }] : []),
            ]),
            {
              "@type": "Service",
              name: entry?.title ?? route.slug,
              serviceType: entry?.title ?? route.slug,
              url: `${SITE_URL}/services/${route.slug}`,
              description: detail.summary,
              provider: { "@id": `${SITE_URL}/#organization` },
              ...(detail.faqs.length > 0
                ? {
                    "@type": ["Service", "FAQPage"],
                    mainEntity: detail.faqs.map((f) => ({
                      "@type": "Question",
                      name: f.q,
                      acceptedAnswer: { "@type": "Answer", text: f.a },
                    })),
                  }
                : {}),
            },
          ],
        };
      }

      // One of the five originally published services (kept as live URLs).
      if (published) {
        return {
          /*
           * ServicePage (the five pre-existing pages) titles itself with the name
           * only; the tagline is the h1. Matching it here avoids a rewrite on mount.
           */
          title: `${published.title} — THE OFFICE 360`,
          description: truncate(published.what ?? published.tagline),
          url: `${SITE_URL}/services/${route.slug}`,
          noindex: false,
          jsonLd: [
            breadcrumb(published.title, `/services/${route.slug}`, [
              { name: "Services", path: "/services" },
            ]),
            {
              "@type": "Service",
              name: published.title,
              url: `${SITE_URL}/services/${route.slug}`,
              description: published.tagline,
              provider: { "@id": `${SITE_URL}/#organization` },
            },
          ],
        };
      }

      /*
       * A catalogue-tier slug is an anchor on its division hub, not a URL. Serving
       * it as a page would be a doorway — the exact pattern the brief forbids —
       * so it 404s, noindexed.
       */
      return notFound;
    }

    /* -------------------------------------------------------- industries */
    case "industriesIndex":
      return {
        title: "Industries — where the method is applied — THE OFFICE 360",
        description: truncate(
          `Twenty sectors, described by the pressures that are characteristic of them and the services that apply — not by clients we cannot evidence.`
        ),
        url: `${SITE_URL}/industries`,
        noindex: false,
        jsonLd: [
          breadcrumb("Industries", "/industries", []),
          {
            "@type": "CollectionPage",
            name: "Industries",
            url: `${SITE_URL}/industries`,
            description: "Applied to your sector.",
          },
        ],
      };

    case "industry": {
      const industry = getIndustry(route.slug);
      if (!industry) return notFound;
      return {
        title: `${industry.title} — Industries — THE OFFICE 360`,
        description: truncate(industry.summary),
        url: `${SITE_URL}/industries/${industry.slug}`,
        noindex: false,
        jsonLd: [
          breadcrumb(industry.title, `/industries/${industry.slug}`, [
            { name: "Industries", path: "/industries" },
          ]),
        ],
      };
    }

    /* ------------------------------------------------------------ notes */
    case "notesIndex":
      return {
        title: "Notes — THE OFFICE 360",
        description: truncate(
          "Written analysis on book positioning, discoverability, author authority and the technology behind a literary business."
        ),
        url: `${SITE_URL}/notes`,
        noindex: false,
        jsonLd: [breadcrumb("Notes", "/notes", [])],
      };

    case "note": {
      const note = notes.find((n) => n.slug === route.slug);
      if (!note) return notFound;
      return {
        title: `${note.title} — Notes, THE OFFICE 360`,
        description: truncate(note.excerpt),
        url: `${SITE_URL}/notes/${note.slug}`,
        noindex: false,
        jsonLd: [
          breadcrumb(note.title, `/notes/${note.slug}`, [{ name: "Notes", path: "/notes" }]),
          {
            "@type": "Article",
            headline: note.title,
            url: `${SITE_URL}/notes/${note.slug}`,
            description: note.excerpt,
            ...(note.date ? { datePublished: note.date } : {}),
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
        ],
      };
    }

    /* ------------------------------------------------------------- work */
    case "work": {
      const project = projects.find((p) => p.slug === route.slug);
      if (!project) return notFound;
      /*
       * `Article`, not `CaseStudy`.
       *
       * Every entry in projects.ts is an unverified engagement *pattern* — the
       * file says so, no client is named and no result is claimed unless
       * `verified` is true, and all five are currently false. Typing these as
       * case studies would assert a client relationship to a machine reader that
       * the page itself refuses to assert to a human one.
       */
      return {
        title: `${project.title} — THE OFFICE 360`,
        description: truncate(project.summary ?? project.title),
        url: `${SITE_URL}/work/${project.slug}`,
        noindex: false,
        jsonLd: [
          breadcrumb(project.title, `/work/${project.slug}`, [
            { name: "Work", path: "/#work" },
          ]),
          {
            "@type": "Article",
            headline: project.title,
            url: `${SITE_URL}/work/${project.slug}`,
            description: project.summary,
            about: project.sector,
            ...(project.verified ? {} : { disambiguatingDescription: "Engagement pattern; no client identified and no result claimed." }),
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
        ],
      };
    }

    /* ------------------------------------------------------------ store */
    case "store":
      return {
        /* StorePage owns this title and uses the mixed-case studio name. */
        title: "Store — The Office 360",
        description: truncate(
          "Fixed-price diagnostic products and templates from THE OFFICE 360. Priced in USD, settled in NGN."
        ),
        url: `${SITE_URL}/store`,
        noindex: false,
        jsonLd: [],
      };

    case "storeProduct": {
      const product = products.find((p) => p.slug === route.slug);
      if (!product) return notFound;
      return {
        title: `${product.name.en} — The Office 360`,
        description: truncate(product.blurb.en),
        url: `${SITE_URL}/store/${product.slug}`,
        noindex: false,
        jsonLd: [],
      };
    }

    /* --------------------------------------------------------- editorial */
    case "methodology":
      return {
        title: "Methodology — THE OFFICE 360",
        description: truncate(
          "The six-stage method every engagement runs: what happens in each stage and what you receive at the end of it."
        ),
        url: `${SITE_URL}/methodology`,
        noindex: false,
        jsonLd: [breadcrumb("Methodology", "/methodology", [])],
      };

    case "glossary":
      return {
        title: "Publishing glossary — THE OFFICE 360",
        description: truncate(
          "The terms this studio uses precisely, and what they mean here: positioning, discoverability, authority, comp set, measurement window."
        ),
        url: `${SITE_URL}/glossary`,
        noindex: false,
        jsonLd: [breadcrumb("Glossary", "/glossary", [])],
      };

    case "press":
      return {
        title: "Press & media kit — THE OFFICE 360",
        description: truncate("Studio facts and a media kit. Boilerplate, team, and what we will and will not claim."),
        url: `${SITE_URL}/press`,
        noindex: false,
        jsonLd: [breadcrumb("Press", "/press", [])],
      };

    case "demos":
      return {
        title: "Proof — THE OFFICE 360",
        description: truncate(
          "Interactive demonstrations of the analysis: how we position a book, what a report contains, and the self-audit."
        ),
        url: `${SITE_URL}/demos`,
        noindex: false,
        jsonLd: [],
      };

    case "checklist":
      return {
        title: "Backlist audit checklist — THE OFFICE 360",
        description: truncate(
          "A printable checklist for auditing a backlist: metadata, categories, description architecture and the discovery paths that break."
        ),
        url: `${SITE_URL}/resources/backlist-audit-checklist`,
        noindex: false,
        jsonLd: [],
      };

    case "privacy":
      return {
        title: "Privacy notice — THE OFFICE 360",
        description: truncate("How this site handles your data, in plain language."),
        url: `${SITE_URL}/privacy`,
        noindex: false,
        jsonLd: [],
      };

    case "terms":
      return {
        title: "Terms of service — THE OFFICE 360",
        description: truncate("The terms under which this studio works."),
        url: `${SITE_URL}/terms`,
        noindex: false,
        jsonLd: [],
      };

    /* The admin panel is not a public page and must never be indexed. */
    case "admin":
      return {
        title: "Store admin — THE OFFICE 360",
        description: "Internal.",
        url: `${SITE_URL}/admin`,
        noindex: true,
        jsonLd: [],
      };

    case "home":
      return {
        title: "THE OFFICE 360 — Book strategy, web, automation, research",
        description: DEFAULT_DESCRIPTION,
        url: `${SITE_URL}/`,
        noindex: false,
        jsonLd: [],
      };

    case "notfound":
    default:
      return notFound;
  }
}

/**
 * Every path worth prerendering, in a stable order.
 *
 * Catalogue-tier service slugs are deliberately absent: they are anchored
 * entries on a division hub, not URLs. /admin is absent for the opposite reason —
 * it exists but must not be advertised.
 */
export function prerenderPaths(): string[] {
  const paths = [
    "/",
    "/services",
    ...divisions.map((d) => `/services/${d.id}`),
    ...serviceCatalog.filter((s) => s.tier === "flagship").map((s) => `/services/${s.slug}`),
    ...publishedServices.map((s) => `/services/${s.slug}`),
    "/industries",
    ...industries.map((i) => `/industries/${i.slug}`),
    "/notes",
    ...notes.map((n) => `/notes/${n.slug}`),
    ...projects.map((p) => `/work/${p.slug}`),
    "/store",
    ...products.map((p) => `/store/${p.slug}`),
    "/methodology",
    "/glossary",
    "/press",
    "/demos",
    "/resources/backlist-audit-checklist",
    "/privacy",
    "/terms",
  ];
  return [...new Set(paths)];
}

export { STUDIO_NAME };
