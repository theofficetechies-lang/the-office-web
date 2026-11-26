/**
 * Positioning copy for the transformation brief.
 *
 * Everything here is a claim about *method*, not about outcomes or clients. There
 * is no "we increased revenue 40%" anywhere, because no engagement has been
 * independently substantiated — the same rule the rest of the site follows.
 *
 * The pillars mirror the brief's six divisions and the consultancy's stated
 * pillars, so a reader can walk from the homepage to a division page without the
 * vocabulary changing underneath them.
 */

export interface Pillar {
  /** Division id this pillar maps to, so the link is real. */
  division: string;
  number: string;
  title: string;
  /** What the client actually gets, in business language. */
  summary: string;
}

export const pillars: Pillar[] = [
  {
    division: "web",
    number: "01",
    title: "Digital experience & web architecture",
    summary:
      "Sites and platforms built as infrastructure rather than brochures: fast, accessible, and structured so the next five years of change do not require a rebuild.",
  },
  {
    division: "ai",
    number: "02",
    title: "AI & business automation",
    summary:
      "The recurring work that consumes a team's week — intake, triage, reporting, follow-up — moved to systems that run reliably and can be inspected when they do not.",
  },
  {
    division: "growth",
    number: "03",
    title: "Digital marketing & growth",
    summary:
      "Search, content and paid work measured against qualified enquiries rather than impressions, with the tracking built in before the campaigns start.",
  },
  {
    division: "brand",
    number: "04",
    title: "Creative design & brand development",
    summary:
      "Identity, interface and collateral that hold together across every surface, documented well enough that the next designer can work without guessing.",
  },
  {
    division: "publishing",
    number: "05",
    title: "Publishing & digital discoverability",
    summary:
      "Book positioning, author platforms and metadata that make titles findable on retail and in AI search — the practice this studio started from.",
  },
  {
    division: "intelligence",
    number: "06",
    title: "Business intelligence & technology consulting",
    summary:
      "Audits, roadmaps and dashboards that tell you what your systems actually do today, what they should do, and in what order to change them.",
  },
];

export interface MethodStage {
  number: string;
  title: string;
  summary: string;
  /** The artefact that proves the stage happened. */
  deliverable: string;
}

/**
 * Six stages from the brief. Each names a deliverable, because a method that only
 * names phases is a slide, not a process.
 */
export const method: MethodStage[] = [
  {
    number: "01",
    title: "Discover",
    summary:
      "Understand the business before proposing anything to it: who decides, what the numbers are, what has already been tried and why it stopped.",
    deliverable: "A written brief of record, agreed before work starts.",
  },
  {
    number: "02",
    title: "Audit",
    summary:
      "Inspect what exists — code, content, analytics, infrastructure, positioning — and separate what is broken from what is merely dated.",
    deliverable: "A prioritised findings register with severity and evidence.",
  },
  {
    number: "03",
    title: "Strategise",
    summary:
      "Choose what to do and, more importantly, what not to do. Every recommendation carries a cost, an owner and a way to tell whether it worked.",
    deliverable: "A sequenced roadmap with scope boundaries stated.",
  },
  {
    number: "04",
    title: "Design",
    summary:
      "Design the system, not just the screens: components, states, error paths and the rules that keep the next feature consistent.",
    deliverable: "A design system and annotated interface specifications.",
  },
  {
    number: "05",
    title: "Build",
    summary:
      "Implement in reviewable increments against the same standards the audit measured, with automated checks that fail loudly.",
    deliverable: "Working software, with the test suite that proves it.",
  },
  {
    number: "06",
    title: "Optimise",
    summary:
      "Measure after launch against the baseline from stage two, and fix what the measurements reveal rather than what was assumed.",
    deliverable: "A performance report against the original baseline.",
  },
];

export interface Difference {
  title: string;
  body: string;
}

/**
 * "Why choose us" — every line is something a reader could check by talking to us
 * or reading the contract. No superlatives, no invented scale.
 */
export const differences: Difference[] = [
  {
    title: "Integrated, not assembled",
    body: "Strategy, build, brand and automation sit in one studio, so a decision about the architecture happens in the same conversation as the decision about the copy. No relay race between three suppliers.",
  },
  {
    title: "Business-focused technology",
    body: "Every technical recommendation is written down with its business cost and its business benefit. If we cannot justify it in those terms, we do not recommend it.",
  },
  {
    title: "Transparent scope",
    body: "Scope, assumptions and exclusions are written into the proposal before work begins. Changes are priced and agreed, never discovered on an invoice.",
  },
  {
    title: "You own the deliverables",
    body: "Code, designs, documentation and vendor accounts are yours. There is no proprietary platform you must keep paying us to use.",
  },
  {
    title: "Built to be maintained",
    body: "If the work cannot be handed over and understood by another competent developer, it is not finished. Documentation ships with the code.",
  },
  {
    title: "The same people throughout",
    body: "The four principals who scope the engagement are the four who deliver it. No juniors learning on your budget, and no subcontracting.",
  },
];

/** Five questions the site must answer, per the brief, with where they are answered. */
export const customerQuestions: { question: string; answer: string; where: string }[] = [
  {
    question: "What does THE OFFICE 360 do?",
    answer:
      "Six professional divisions — web and digital architecture, AI and automation, growth marketing, brand and creative, publishing, and technology consulting — delivered by one studio.",
    where: "/services",
  },
  {
    question: "Which service solves my problem?",
    answer:
      "The services index is organised by division and by industry, and every division page names the problems its work addresses.",
    where: "/services",
  },
  {
    question: "Why choose you?",
    answer:
      "One team from strategy to build, scope written down before work starts, and deliverables you own outright.",
    where: "/about",
  },
  {
    question: "What will the engagement involve?",
    answer:
      "Six stages: discover, audit, strategise, design, build, optimise — each with a named artefact you receive.",
    where: "/methodology",
  },
  {
    question: "How do I start?",
    answer:
      "Send a brief or book a free consultation. Both reach the same people, and we reply within two working days.",
    where: "/contact",
  },
];
