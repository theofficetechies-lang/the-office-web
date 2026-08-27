/**
 * Phase 6 — the selected-work system.
 *
 * Honesty constraint from the brief: never fabricate clients, results, revenue,
 * awards, testimonials or partnerships. Nothing below is verified against a
 * named client, so these are written as ENGAGEMENT PATTERNS — descriptions of
 * the shape of work we take on and what a client receives — not as claimed
 * outcomes for identified companies.
 *
 * To publish a real case study, set `verified: true`, name the client, and put
 * the measured outcome in `result`. CaseStudyPage renders those fields only
 * when the flag is on, so an unverified entry cannot accidentally claim one.
 */
export interface ProjectPattern {
  slug: string;
  n: string;
  sector: string;
  title: string;
  /** One-line description of the engagement. No claimed result. */
  summary: string;
  /** The situation the work started from. */
  problem: string;
  /** How it ran, in order. */
  approach: string[];
  /** What the client was left holding. */
  deliverables: string[];
  services: string[];
  duration: string;
  year: string;
  verified: boolean;
  /** Verified only. Shown when `verified` is true. */
  client?: string;
  result?: string;
}

export const projects: ProjectPattern[] = [
  {
    slug: "debut-novel-repositioning",
    n: "P/014",
    sector: "Independent publishing",
    title: "Repositioning a debut literary novel for a US trade house",
    summary:
      "A debut that had been read as quiet literary fiction, re-framed as a contemporary social novel — positioning, comp set, and a pitch deck built to survive an acquisitions meeting.",
    problem:
      "The manuscript was strong and the pitch was not. Every reader described it differently, which in trade publishing is the same as nobody being able to describe it. Two rejections cited 'hard to place'.",
    approach: [
      "Read the manuscript against the author's own synopsis and mapped where the two disagreed.",
      "Built the category map: 14 comps, the shelf, the adjacent titles, and the gap the book actually fills.",
      "Wrote a single positioning line and stress-tested it against the objections from the two rejection letters.",
      "Rebuilt the pitch deck around that line, with the comp evidence attached to each claim.",
    ],
    deliverables: [
      "Positioning and audience document",
      "Comp title analysis with reasoning",
      "Acquisitions-ready pitch deck",
      "A one-page Q&A pack for the agent",
    ],
    services: ["Book Strategy"],
    duration: "6 weeks",
    year: "2025",
    verified: false,
  },
  {
    slug: "editorial-site-rebuild",
    n: "P/021",
    sector: "Architecture practice",
    title: "An editorial site replacing a template the practice had outgrown",
    summary:
      "A project-led site rebuilt from the information architecture up, so each project reads as a case study rather than a thumbnail in a grid.",
    problem:
      "Twenty years of work sat inside a theme chosen in 2016. Projects were images with captions, the writing was buried, and the firm had no way to add work without a developer.",
    approach: [
      "Audited every page for what a prospective client was actually trying to find out.",
      "Rebuilt the content model around projects, thinking and people, with fields the practice fills in itself.",
      "Designed the typographic system and the project page as one piece of editorial design.",
      "Built a custom front-end and an editing workflow, then trained two people to run it.",
    ],
    deliverables: [
      "Documented IA and content model",
      "Custom front-end, deployed, source owned by the practice",
      "An editing workflow usable without a developer",
      "Performance and accessibility baselines",
    ],
    services: ["Web Design"],
    duration: "11 weeks",
    year: "2025",
    verified: false,
  },
  {
    slug: "backlist-reading-assistant",
    n: "P/029",
    sector: "Literary agency",
    title: "A reader-facing assistant that knows a backlist in depth",
    summary:
      "A conversational system over an agency's catalogue, so a reader asking 'what should I read next' gets a recommendation with a reason, not a search results page.",
    problem:
      "The catalogue was searchable by title and author only. Readers arriving from a review or a podcast had no way in, and the submissions team was answering the same questions by email.",
    approach: [
      "Sat with the submissions team for a week and logged the questions they actually answer.",
      "Built retrieval over the catalogue plus jacket copy, rights history and reader notes.",
      "Wrote an evaluation set from real enquiries and tuned until answers held up under it.",
      "Shipped it inside the existing site, with a handover pack and the eval set included.",
    ],
    deliverables: [
      "A working conversational assistant",
      "An evaluation set the agency re-runs on every change",
      "Retrieval pipeline over their own data",
      "Documentation and a handover",
    ],
    services: ["Automation"],
    duration: "9 weeks",
    year: "2025",
    verified: false,
  },
  {
    slug: "market-map-second-book",
    n: "P/033",
    sector: "Author · nonfiction",
    title: "A reading programme and market map for a difficult second book",
    summary:
      "Months of structured research and synthesis for an author writing against a crowded, fast-moving field — ending in a positioning brief she could take to her agent.",
    problem:
      "The first book had done well and the second had no clear territory. Half the obvious ground was already occupied, and the author needed to know which half was left before writing another 90,000 words.",
    approach: [
      "Scoped the question down to three answerable sub-questions.",
      "Built an annotated bibliography across trade, academic and primary sources, grading each for reliability.",
      "Mapped the competitors: argument, audience, reception, and where each had left a gap.",
      "Synthesised it into a positioning brief with two viable territories and the trade-offs of each.",
    ],
    deliverables: [
      "Annotated bibliography with graded sources",
      "Competitor and category maps",
      "A positioning brief with two costed territories",
      "A research log the author can extend",
    ],
    services: ["Book Research & Analysis", "Book Strategy"],
    duration: "14 weeks",
    year: "2024",
    verified: false,
  },
  {
    slug: "rights-triage-automation",
    n: "P/038",
    sector: "Boutique press",
    title: "An internal tool that triages foreign-rights submissions",
    summary:
      "Automation over a weekly, high-judgement task — reading, sorting and summarising inbound rights enquiries — with a human reviewing only what the tool flags.",
    problem:
      "A multi-hour weekly triage done by the most senior person in the building, most of which was matching an enquiry to a territory, a title and a prior decision.",
    approach: [
      "Mapped the real workflow, including the exceptions that never made it into the process document.",
      "Built the classifier and summariser against twelve months of past enquiries.",
      "Set an evaluation threshold: anything uncertain goes to a human, with the reasoning attached.",
      "Wired it into Slack and added a weekly report so drift is visible.",
    ],
    deliverables: [
      "A triage tool running in Slack",
      "An evaluation set and a drift report",
      "An exceptions path a human owns",
      "Runbook and handover documentation",
    ],
    services: ["Automation"],
    duration: "7 weeks",
    year: "2024",
    verified: false,
  },
  {
    slug: "memoir-launch-architecture",
    n: "P/042",
    sector: "Memoirist",
    title: "Launch architecture for a memoir entering a crowded market",
    summary:
      "A pre-publication plan assembled from research rather than habit: which outlets actually cover this territory, which partnerships are worth the effort, and in what order.",
    problem:
      "The standard launch playbook — a few author events, a newsletter, hope — had already been tried by comparable titles in the category without moving anything.",
    approach: [
      "Researched what had worked for comparable titles in the last three seasons, and what had not.",
      "Built a target list of outlets, podcasts and communities from that evidence.",
      "Designed a six-week sequence with dependencies and owners rather than a list of ideas.",
      "Identified one unusual retail partnership worth pursuing and wrote the approach for it.",
    ],
    deliverables: [
      "A six-week pre-publication plan",
      "An evidenced outlet and podcast target list",
      "A partnership approach with the pitch written",
      "A post-launch review framework",
    ],
    services: ["Book Strategy", "Book Research & Analysis"],
    duration: "8 weeks",
    year: "2024",
    verified: false,
  },
];

export function getProject(slug: string): ProjectPattern | undefined {
  return projects.find((p) => p.slug === slug);
}

export const workNote =
  "Engagement patterns, not case studies. No client is identified and no result is claimed on this page — each entry describes the shape of the work and what a client receives. Verified case studies with named outcomes are shared under NDA on request.";
