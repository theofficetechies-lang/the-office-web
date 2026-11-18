/**
 * Inquiry pathways — the ten ways a visitor can start a conversation.
 *
 * Each pathway carries its own `interest` value, which travels with the lead so
 * an enquiry can be routed and reported on without parsing free text. The value
 * is stable and must not change once leads reference it.
 *
 * `service` pre-selects the matching box(es) in the brief form; `division` is the
 * catalogue division the pathway belongs to (optional).
 */
export interface InquiryType {
  id: string;
  /** What the visitor sees on the form heading. */
  label: string;
  /** One line under the heading explaining what to include. */
  hint: string;
  /** Pre-selected service label(s) in the form's services checkboxes. */
  services?: string[];
  /** How the internal notification should be tagged. */
  tag: string;
}

export const inquiryTypes: InquiryType[] = [
  {
    id: "general",
    label: "General enquiry",
    hint: "Anything that does not fit the pathways below. A human reads it.",
    tag: "general",
  },
  {
    id: "website-development",
    label: "Website development",
    hint: "What the site has to do, and what it currently does instead. Include any deadline that is fixed.",
    services: ["Corporate Website Development"],
    tag: "web",
  },
  {
    id: "ai-automation",
    label: "AI & automation",
    hint: "The workflow you would like to stop doing by hand, and how often it recurs.",
    services: ["AI Business Automation"],
    tag: "ai",
  },
  {
    id: "seo-consultation",
    label: "SEO consultation",
    hint: "The site or titles involved, and whether any measurement baseline already exists.",
    services: ["Search Engine Optimization (SEO)"],
    tag: "growth",
  },
  {
    id: "branding",
    label: "Branding & design",
    hint: "What exists already — name, mark, any guidelines — and what has triggered the review.",
    services: ["Brand Identity Design"],
    tag: "brand",
  },
  {
    id: "publishing",
    label: "Publishing services",
    hint: "The book(s), the format, the publication timeline, and what has already been tried.",
    services: ["Strategic Book Positioning"],
    tag: "publishing",
  },
  {
    id: "technology-consultation",
    label: "Business technology consultation",
    hint: "The systems involved and the decision you are trying to make. Advisory engagements can be short.",
    services: ["Digital Transformation Consulting"],
    tag: "intelligence",
  },
  {
    id: "request-proposal",
    label: "Request a proposal",
    hint: "Scope, timeline and decision process. We reply with a written scope and a fixed price, not a brochure.",
    tag: "proposal",
  },
  {
    id: "website-audit",
    label: "Request a website audit",
    hint: "The URL. An audit covers performance, accessibility, search and security, with prioritised findings.",
    services: ["Technical SEO", "Website Performance Optimization"],
    tag: "audit",
  },
  {
    id: "project-brief",
    label: "Submit a project brief",
    hint: "The most useful option if you already know what you need. More detail means a more useful reply.",
    tag: "brief",
  },
];

export function getInquiryType(id: string): InquiryType | undefined {
  return inquiryTypes.find((t) => t.id === id);
}

export const DEFAULT_INQUIRY_TYPE = "project-brief";
