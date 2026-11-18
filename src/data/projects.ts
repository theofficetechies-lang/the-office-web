/**
 * Part 2 §4 — case studies in the five-part structure: Problem, Strategy,
 * Execution, Measurement, Learning.
 *
 * Honesty constraint is preserved: no client is identified and no result is
 * claimed unless `verified` is true. For unverified patterns, `measurement`
 * states the baseline and the method rather than an invented number, and
 * `learning` admits a lesson — Part 2's own guidance is that flawless reads as
 * fabricated to an analytical reader.
 */
export interface ProjectPattern {
  slug: string;
  n: string;
  sector: string;
  title: string;
  summary: string;
  problem: string;
  strategy: string;
  approach: string[];
  measurement: string;
  learning: string;
  deliverables: string[];
  services: string[];
  duration: string;
  year: string;
  verified: boolean;
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
      "A debut read as quiet literary fiction, re-framed as a contemporary social novel — positioning, comp set and a pitch deck built to survive an acquisitions meeting.",
    problem:
      "The manuscript was strong and the pitch was not. Every reader described it differently, and two rejections cited the same phrase: hard to place.",
    strategy:
      "The rejections were a positioning failure, not a quality failure. The comp map showed an unoccupied gap between quiet literary fiction and the contemporary social novel, so the pitch was rebuilt to claim that shelf specifically.",
    approach: [
      "Read the manuscript against the author's own synopsis and mapped where they disagreed",
      "Built the category map: 14 comps, the shelf, adjacent titles, the gap",
      "Wrote one positioning line and stress-tested it against the two rejection letters",
      "Rebuilt the pitch deck around that line with comp evidence attached",
    ],
    measurement:
      "Baseline was the two rejections and the existing pitch. Success was defined as a pitch that answers those objections; no sales figures are claimed for this pattern.",
    learning:
      "A pitch that names its shelf survives an acquisitions meeting. One that aspires to every shelf survives none.",
    deliverables: [
      "Positioning and audience document",
      "Comp title analysis with reasoning",
      "Acquisitions-ready pitch deck",
      "A one-page Q&A pack for the agent",
    ],
    services: ["Strategic Book Positioning"],
    duration: "6 weeks",
    year: "2025",
    verified: false,
  },
  {
    slug: "discoverability-backlist-audit",
    n: "P/021",
    sector: "Author · backlist",
    title: "A discoverability audit that moved two backlist titles out of obscurity",
    summary:
      "Search, metadata and category work for two backlist titles — the same discipline published in our sample report.",
    problem:
      "Two solid titles were algorithmically invisible: overstuffed backend keywords, a crowded top-level category, and a description that buried the hook.",
    strategy:
      "Treat the retailer as a search engine. Rebuild metadata around latent intent, and move the titles into granular categories where a top-10 rank was contestable.",
    approach: [
      "Audited search presence and the seven backend fields",
      "Rebuilt keywords to capture comp authors and reader queries, not repeats of the title",
      "Re-mapped category placement to granular nodes",
      "Tracked grade and visibility weekly against the baseline",
    ],
    measurement:
      "This is the one pattern we publish in full: grade movement E to C and D to B, visibility +43 points, backlinks 12 to 27 over eight weeks. The anonymized report is downloadable on this site.",
    learning:
      "Metadata discipline compounds; a single re-category can do more than a month of promotion.",
    deliverables: [
      "Prioritized, dated correction list",
      "Rebuilt metadata and category placement",
      "The eight-week before/after visibility report",
    ],
    services: ["Discoverability Optimization", "Analytics & Reporting"],
    duration: "8 weeks",
    year: "2025",
    verified: false,
  },
  {
    slug: "author-authority-technical",
    n: "P/029",
    sector: "Technical author",
    title: "Coordinating a professional reputation with a first book",
    summary:
      "Authority development for an author whose day job carries weight — aligning the name and the book so each reinforces the other.",
    problem:
      "The author had strong professional standing and a book nobody in that community knew about. The two identities were separate and neither fed the other.",
    strategy:
      "For a technical author, the book and the name are one system. Align digital presence, review strategy and citation presence so authority compounds across both — coordinated, not conflated.",
    approach: [
      "Audited the author's owned properties for consistency",
      "Aligned the public identity with the book's subject",
      "Ran review strategy to platform standards",
      "Built citation and reference presence in the professional community",
    ],
    measurement:
      "Presence and referral quality over time: how the author surfaces for their own name and subject, and from where. Reported on a quarterly cadence.",
    learning:
      "The professional audience is the launch audience for a technical book; start there, not with ads.",
    deliverables: [
      "A coherent author presence across properties",
      "Review and citation plan executed to platform standards",
      "Quarterly presence reports",
    ],
    services: ["Author Authority Development"],
    duration: "12 weeks",
    year: "2024",
    verified: false,
  },
  {
    slug: "launch-strategy-thriller",
    n: "P/033",
    sector: "Fiction · thriller",
    title: "A launch built backward for a technology thriller",
    summary:
      "Pre-release planning for a genre title that had to build an audience rather than inherit one.",
    problem:
      "A thriller does not inherit readership from a professional reputation — it has to build one, and the preparation had to happen early enough to matter.",
    strategy:
      "Identify the reader segments most likely to embrace the premise, position within the genre, and create awareness in the communities where techno-thriller readers discover titles — sequenced and costed before any of it begins.",
    approach: [
      "Built the timeline backward from the launch date",
      "Stood up an advance-review and early-reader program",
      "Seeded the communities where the genre is discovered",
      "Named channels with budget ranges and expected outputs",
    ],
    measurement:
      "Against the pre-launch baseline: advance reviews stood up, community awareness, and first-week movement — reported conservatively with timeframes.",
    learning:
      "Audience development is preparation done early, not promotion after the fact.",
    deliverables: [
      "A dated launch plan with dependencies and owners",
      "A channel plan with budgets and expected outputs",
      "An advance-review pipeline stood up pre-launch",
    ],
    services: ["Launch Strategy"],
    duration: "10 weeks",
    year: "2024",
    verified: false,
  },
  {
    slug: "analytics-reporting-press",
    n: "P/038",
    sector: "Boutique press",
    title: "A reporting cadence a small press could actually act on",
    summary:
      "Baseline-first measurement and scheduled written reviews for a press that had dashboards but no interpretation.",
    problem:
      "The press had dashboards and no answers: numbers moved and nobody could say which action caused what, so every decision re-litigated the same guesses.",
    strategy:
      "Establish a baseline before work begins, tie every reported change to a documented action, and replace ad-hoc dashboard-reading with scheduled written reviews that interpret.",
    approach: [
      "Established the baseline across search, category, referral and engagement",
      "Instrumented tracking at an agreed cadence",
      "Produced scheduled written reports with interpretation",
      "Published the report structure so the standard was visible",
    ],
    measurement:
      "The reporting is the deliverable: cadence kept, every figure tied to an action, and the confidence to say what didn't change.",
    learning:
      "A report that admits what didn't change is believed; one that doesn't is ignored.",
    deliverables: [
      "A documented baseline",
      "Scheduled written reports with interpretation",
      "An anonymized sample report",
    ],
    services: ["Analytics & Reporting"],
    duration: "Ongoing, quarterly",
    year: "2024",
    verified: false,
  },
];

export function getProject(slug: string): ProjectPattern | undefined {
  return projects.find((p) => p.slug === slug);
}

export const workNote =
  "Engagement patterns, not showcases. No client is identified and no result is claimed unless marked verified; where a result is published in full, it is downloadable as the anonymized report. Verified case studies with named outcomes are shared under NDA on request.";

export const attributionPolicy =
  "Many clients in this space require confidentiality. We name where permitted and describe by genre and profile where not — and we say why a client is anonymized, because stating the reason is itself trustworthy.";

export const referencesLine =
  "References speak privately. Upon serious inquiry we will put you in direct contact with people we have worked with — the same confidence we would extend to you.";
