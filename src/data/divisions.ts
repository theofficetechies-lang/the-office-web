/**
 * Service divisions — the six top-level groups the catalogue is organised into.
 *
 * The catalogue in `src/data/serviceCatalog.ts` holds 167 services; a division
 * hub is where the *catalogue*-tier ones live (as anchored entries) so that a
 * small studio can offer breadth without publishing thin standalone pages.
 *
 * `flagshipSlugs` is the subset that earns a dedicated page. Keep the ordering
 * deliberate: the first flagship is the one the hub links to most prominently.
 *
 * Every slug here is new — none collides with the five published service URLs
 * (book-positioning, discoverability, author-authority, launch-strategy,
 * analytics-reporting), so existing rankings are untouched.
 */
export interface Division {
  /** Stable id used in URLs and by services. */
  id: string;
  /** Display number, e.g. "D1". Used by MarginRail. */
  n: string;
  title: string;
  /** One sentence: what this division is for. */
  tagline: string;
  /** Two or three sentences for the hub intro. Plain, specific, no adjectives. */
  intro: string;
  /** The five published services attach to publishing; do not duplicate here. */
  flagshipSlugs: string[];
}

export const divisions: Division[] = [
  {
    id: "web",
    n: "D1",
    title: "Web Development & Digital Architecture",
    tagline: "Sites and platforms that are structured before they are styled.",
    intro:
      "We build the thing a business actually runs on: an information architecture that survives its second year, a front end the client can maintain, and integrations that do not need a specialist to explain. Every engagement starts with what the site has to do, not what it should look like.",
    flagshipSlugs: [
      "corporate-website-development",
      "e-commerce-development",
      "web-application-development",
      "custom-portal-development",
      "headless-cms-development",
      "website-performance-optimization",
      "website-security-audits",
      "website-accessibility-improvement",
    ],
  },
  {
    id: "ai",
    n: "D2",
    title: "AI, Automation & Intelligent Business Systems",
    tagline: "Take the recurring work off the human team.",
    intro:
      "Most automation is not AI, and most AI projects fail because nobody separated the two. We assess the workflow first, then implement the cheapest thing that removes the work — a script, an integration, a retrieval system over your own documents, or an agent only where a deterministic rule genuinely cannot do the job.",
    flagshipSlugs: [
      "ai-business-automation",
      "automation-opportunity-assessment",
      "crm-automation",
      "document-processing-automation",
      "ai-powered-knowledge-bases",
      "whatsapp-business-automation",
      "ai-chatbot-development",
      "custom-ai-agent-development",
    ],
  },
  {
    id: "growth",
    n: "D3",
    title: "Digital Marketing & Business Growth",
    tagline: "Acquisition measured against a baseline, not against adjectives.",
    intro:
      "We do the measurement work that makes marketing decisions reversible: find where demand already exists, establish a baseline, then change one thing at a time and report what moved. Search first, because it compounds; paid second, because it stops when you stop paying.",
    flagshipSlugs: [
      "search-engine-optimization-seo",
      "technical-seo",
      "local-seo",
      "conversion-rate-optimization",
      "content-strategy",
      "ai-search-optimization",
      "generative-engine-optimization-geo",
      "digital-marketing-audits",
    ],
  },
  {
    id: "brand",
    n: "D4",
    title: "Branding, Design & Creative Services",
    tagline: "Identity that survives being applied by someone else.",
    intro:
      "A brand is a system other people have to use without you in the room. We build the small number of decisions — type, palette, tone, layout rules — that make a hundred future pieces look like they came from one place, and we write the guidelines that make it repeatable.",
    flagshipSlugs: [
      "brand-identity-design",
      "brand-strategy",
      "ui-ux-design",
      "brand-guidelines",
      "motion-graphics",
    ],
  },
  {
    id: "publishing",
    n: "D5",
    title: "Publishing, Book Discoverability & Author Solutions",
    tagline: "The work behind the book — where this studio started.",
    intro:
      "The studio's original discipline and its deepest bench. Positioning, metadata, discoverability, author authority and launch sequencing for independent authors, publishers and literary organisations — the analytical method the other five divisions now apply to business problems.",
    flagshipSlugs: [
      "book-discoverability-strategy",
      "book-seo",
      "author-website-development",
      "author-branding",
      "book-launch-campaigns",
      "publishing-automation",
    ],
  },
  {
    id: "intelligence",
    n: "D6",
    title: "Business Intelligence & Technology Consulting",
    tagline: "Decide what to build before paying to build it.",
    intro:
      "Advisory engagements for businesses that suspect their systems are the constraint but cannot yet say where. We audit the stack and the process, quantify the cost of the current arrangement, and produce a sequenced plan with the unglamorous parts — ownership, migration order, what to switch off first — written down.",
    flagshipSlugs: [
      "digital-transformation-consulting",
      "business-technology-audits",
      "technology-stack-assessment",
      "business-intelligence-dashboards",
      "digital-growth-roadmaps",
    ],
  },
];

export function getDivision(id: string): Division | undefined {
  return divisions.find((d) => d.id === id);
}

export const divisionIds = divisions.map((d) => d.id);
