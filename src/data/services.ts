/**
 * Part 2 §3 — the five services, each with the fixed internal structure the
 * strategic plan requires: what it is, what we analyze, what actions are
 * performed, what you receive, and how it is measured. Fixed-scope pricing is
 * stated per service.
 */
export interface Service {
  n: string;
  slug: string;
  title: string;
  tagline: string;
  what: string;
  analyze: string[];
  actions: string[];
  receive: string[];
  measured: string;
  pricing: string;
}

export const services: Service[] = [
  {
    n: "01",
    slug: "book-positioning",
    title: "Strategic Book Positioning",
    tagline: "An honest placement, before any activity.",
    what:
      "A written positioning document derived from analysis of the category, the audience and the competitive field. Not a flattering headline — a placement the market can actually hold.",
    analyze: [
      "Category and subcategory assessment; pricing and format landscape",
      "Comparable-title identification and positioning benchmarks",
      "Defined reader segments, with evidence of where they discover books",
      "Gaps the book can legitimately occupy",
    ],
    actions: [
      "Position the book against the comp set with the reasoning attached",
      "Define the reader and the purchase occasion",
      "Stress-test the position against a real buyer objection",
      "Write the positioning document",
    ],
    receive: [
      "A written positioning document — an analyzable artifact you keep",
      "The comp set and the evidence behind it",
      "A recommendation on what not to claim",
    ],
    measured:
      "Clarity, not vanity: whether the book can be placed in one sentence a bookseller would repeat. Where possible, comp-set and category movement afterwards.",
    pricing: "Fixed scope, quoted in writing after Discovery.",
  },
  {
    n: "02",
    slug: "discoverability",
    title: "Discoverability Optimization",
    tagline: "Found at the moment a reader needs it.",
    what:
      "Search visibility, metadata and reader-pathway work so the book and author surface for the right queries — and the intended reader's path to the book stops breaking.",
    analyze: [
      "How the book and author currently surface for relevant queries",
      "Title/subtitle alignment, category and keyword selection",
      "Retailer-specific fields and description architecture",
      "The reader discovery paths that currently fail",
    ],
    actions: [
      "Audit search presence and prioritize corrections",
      "Rebuild metadata: categories, keywords, backend fields",
      "Repair the discovery path from query to purchase",
      "Track ranking and referral change over a defined period",
    ],
    receive: [
      "A prioritized, dated correction list",
      "Rebuilt metadata and category placement",
      "A before/after visibility read over the measurement window",
    ],
    measured:
      "Baseline established first; change reported as ranking and referral movement over a defined period — including what didn't change.",
    pricing: "Fixed scope with a stated measurement window.",
  },
  {
    n: "03",
    slug: "author-authority",
    title: "Author Authority Development",
    tagline: "The name and the book, compounding together.",
    what:
      "For authors with a professional reputation, the book and the name are one system. We align digital presence, review strategy and professional positioning so authority compounds across both.",
    analyze: [
      "Author website, profiles and consistency across owned properties",
      "Citation, reference and community standing",
      "How the professional identity and the writing identity relate",
    ],
    actions: [
      "Coordinate — not conflate — the professional and author identities",
      "Run review strategy to platform standards",
      "Build citation and reference presence for technical authors",
      "Align public identity with the book's subject",
    ],
    receive: [
      "A coherent, consistent author presence across properties",
      "A review and citation plan executed to platform standards",
      "Guidance on keeping the two identities distinct and mutually reinforcing",
    ],
    measured:
      "Presence and referral quality over time: how the author surfaces for their own name and subject, and from where.",
    pricing: "Scoped and quoted after the Discovery phase, fixed in writing.",
  },
  {
    n: "04",
    slug: "launch-strategy",
    title: "Launch Strategy",
    tagline: "Preparation early enough to matter.",
    what:
      "A launch built backward from the date: reader targeting, advance-review programs and channel selection justified per book, with budget ranges and expected outputs stated per channel.",
    analyze: [
      "The reader segments most likely to embrace the premise",
      "Genre positioning and the communities where readers discover titles",
      "Channel economics: what each channel costs and what it returns",
    ],
    actions: [
      "Sequence pre-release milestones backward from launch",
      "Run early-reader and advance-review programs",
      "Seed communities where genre-appropriate",
      "Name channels with budget ranges and expected outputs",
    ],
    receive: [
      "A dated launch plan with dependencies and owners",
      "A channel plan with budgets and expected outputs per channel",
      "An advance-review pipeline stood up before launch",
    ],
    measured:
      "Against the pre-launch baseline: awareness, advance reviews and first-week movement — reported conservatively, with timeframes.",
    pricing: "Fixed price for a fixed plan, agreed before launch work begins.",
  },
  {
    n: "05",
    slug: "analytics-reporting",
    title: "Analytics & Reporting",
    tagline: "Every reported change tied to a documented action.",
    what:
      "Measurement tied to actions taken, not outcomes claimed. A baseline before work begins, a defined tracking methodology, and scheduled written reviews with interpretation — not just dashboards.",
    analyze: [
      "What is tracked: search presence, category movement, referral sources, engagement quality",
      "At what cadence, and with what tooling",
      "Which reported changes trace to which documented actions",
    ],
    actions: [
      "Establish the baseline before any work begins",
      "Instrument tracking at the agreed cadence",
      "Produce scheduled written reports with interpretation",
      "Publish what a report contains — we share an anonymized sample",
    ],
    receive: [
      "A documented baseline",
      "Scheduled written reports with interpretation",
      "An anonymized sample report, so you know the standard before you buy",
    ],
    measured:
      "The reporting is the deliverable: cadence kept, every figure tied to an action, and the confidence to say what didn't change.",
    pricing: "Fixed cadence and scope, quoted in writing.",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
