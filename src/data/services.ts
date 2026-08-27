/**
 * Phase 4 — the service system.
 * Every service states what it is, who needs it, the problem it solves,
 * how it runs, and what the client ends up holding.
 */
export interface Service {
  n: string;
  slug: string;
  title: string;
  /** What the service actually is, in one paragraph. */
  what: string;
  /** Who it is for. */
  who: string;
  /** The problem it solves. */
  problem: string;
  /** How it runs, in order. */
  process: string[];
  /** What the client is left holding. */
  outcomes: string[];
  /** Typical duration. */
  duration: string;
}

export const services: Service[] = [
  {
    n: "01",
    slug: "book-strategy",
    title: "Book Strategy",
    what:
      "Positioning, audience and go-to-market for authors and independent publishers. We work the problem before the cover does — the category the book sits in, the comp set that proves it, the proposal, the pitch deck and the launch sequence.",
    who:
      "Authors with a finished or nearly finished manuscript, agents preparing a submission, and small presses deciding how to spend a season's marketing budget.",
    problem:
      "Most books do not fail on quality. They fail because nobody can say, in one sentence, which shelf they belong on and why a buyer already browsing that shelf would stop. Everything downstream — the jacket, the pitch, the ads — inherits that blur.",
    process: [
      "Read the manuscript and the author's own account of it, and note where the two disagree.",
      "Build the category map: the shelf, the comps, the adjacent titles, the gaps.",
      "Write the positioning line and stress-test it against a real acquisitions objection.",
      "Turn it into the artefacts — proposal, pitch deck, one-sheet, launch plan.",
    ],
    outcomes: [
      "A positioning document that states the shelf, the reader and the comp set",
      "A comp title analysis with the reasoning attached, not just a list",
      "Pitch and proposal copy written to survive an acquisitions meeting",
      "A launch architecture with dates, channels and owners",
    ],
    duration: "Typically 4–8 weeks",
  },
  {
    n: "02",
    slug: "book-research",
    title: "Book Research & Analysis",
    what:
      "Research teams for literary, competitive and market intelligence. Annotated reading lists, market maps, manuscript due diligence, and trend reporting — the work a publisher used to keep an entire assistant doing.",
    who:
      "Nonfiction authors building an argument, editors assessing a category before they buy into it, and agencies that need to know what else is coming.",
    problem:
      "Serious research is slow and unglamorous, so it gets skipped, and then a book is written against a market picture that was a guess. Or it gets done badly, in a spreadsheet nobody can read.",
    process: [
      "Scope the question. A research brief that cannot be answered is a wish.",
      "Source discovery across databases, archives, trade press and primary material.",
      "Read and annotate — every claim carries its source and a confidence note.",
      "Synthesise into a document that argues something, not a pile of links.",
    ],
    outcomes: [
      "Annotated bibliographies with sources graded for reliability",
      "Market and competitor maps",
      "Manuscript due diligence: what is claimable, what is not",
      "Trend reports with a clear 'so what' for the book in front of you",
    ],
    duration: "Typically 3–10 weeks",
  },
  {
    n: "03",
    slug: "web-design",
    title: "Web Design",
    what:
      "We build sites. Not decorate templates. Strategy, information architecture, editorial copywriting and a custom front-end — usually on a stack the client will still be able to run in five years.",
    who:
      "Authors, presses, agencies and small practices whose current site was built by someone who has since left, and who would rather own the thing than rent it.",
    problem:
      "The typical site in this world is a digital CV: bio, headshot, jacket covers, an abandoned blog. It assumes the visitor already knows who you are. Most visitors do not, and they leave without doing the one thing the site existed for.",
    process: [
      "Establish intent: what is this page for, and what should the reader do next.",
      "Information architecture and a content model before a single pixel.",
      "Editorial copy and typographic design treated as one job, not two.",
      "Build, measure, refine — shipped, not handed over as a design file.",
    ],
    outcomes: [
      "A documented IA and content model",
      "A custom front-end built and deployed, with the source you own",
      "A CMS or editing workflow your team can actually use",
      "Performance and accessibility baselines you can hold the site to",
    ],
    duration: "Typically 6–14 weeks",
  },
  {
    n: "04",
    slug: "automation",
    title: "Automation",
    what:
      "Custom automation and conversational systems. Internal tools that replace a hundred spreadsheets, reader-facing assistants that know a backlist in depth, and agents that take the boring half of the week off a human team.",
    who:
      "Small teams with a repetitive, high-judgement task in the middle of their week — submissions triage, rights queries, catalogue questions, reporting.",
    problem:
      "Off-the-shelf tools solve the generic 80% and leave the specific 20% — the part that is actually your business — to be done by hand, forever, by the most senior person in the room.",
    process: [
      "Sit with the task. We automate the real workflow, not the one in the job description.",
      "Prototype against real data and evaluate before promising anything.",
      "Build it into the tools the team already opens — Slack, email, the CMS.",
      "Instrument it, then keep evaluating as the model and the workload change.",
    ],
    outcomes: [
      "A working tool running inside your existing workflow",
      "An evaluation set, so changes are measured rather than felt",
      "Documentation a new hire can follow",
      "A handover, not a dependency — you can run it without us",
    ],
    duration: "Typically 4–12 weeks",
  },
];
