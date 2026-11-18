/**
 * The content model for a flagship service page.
 *
 * Mirrors the 14-part structure the expansion brief specifies (§9), because that
 * structure earns its length: it forces every page to answer *who this is for*
 * and *what happens*, rather than restating a tagline more slowly.
 *
 * Editorial rules for anyone adding an entry:
 *   • Prose is English-only, like the notes and engagement write-ups. UI chrome
 *     is translated; the long-form body is not, and the site says so.
 *   • No invented metrics, client names, awards or credentials. If a claim needs
 *     evidence we do not have, it does not go on the page.
 *   • `pricing` stays "Request a quote" unless the owner has approved a figure.
 */
export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServiceDetail {
  /** Must match a flagship slug in src/data/serviceCatalog.ts */
  slug: string;
  /** One line under the H1. Concrete, no adjectives. */
  tagline: string;
  /** 2–3 sentences: what this engagement actually is. */
  summary: string;
  /** The business problem, stated from the client's side. */
  problem: string;
  /** How we approach it. 2–4 short paragraphs. */
  approach: string[];
  /** Outcomes, not features. */
  benefits: string[];
  /** What is included inside the engagement. */
  scope: string[];
  /** What the client receives at the end. */
  deliverables: string[];
  /** Who this is genuinely for — and, where useful, who it is not for. */
  idealFor: string[];
  /** Catalog or published slugs this service connects to. */
  related: string[];
  faqs: ServiceFaq[];
  /** Optional illustrative scenarios, labelled as such in the UI. */
  examples?: string[];
  /** Never a fabricated number. */
  pricing: string;
  /** Typical shape. Omit if it varies too much to be honest. */
  duration?: string;
}
