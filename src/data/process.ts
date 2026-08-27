/**
 * Phase 5 — the methodology.
 * Six stages, in order, with the studio's actual caveat attached: the sequence
 * flexes to the engagement, and we say so rather than pretending otherwise.
 */
export interface ProcessStage {
  n: string;
  title: string;
  summary: string;
  /** What the client sees at the end of this stage. */
  artifact: string;
  /** Rough share of a full engagement. */
  weight: string;
}

export const processStages: ProcessStage[] = [
  {
    n: "01",
    title: "Understand",
    summary:
      "We read everything you send and ask the questions nobody has asked yet. This is where most engagements are actually won or lost, so we do not rush it.",
    artifact: "A written account of the problem, agreed by both sides.",
    weight: "Week 1",
  },
  {
    n: "02",
    title: "Research",
    summary:
      "Category, comps, competitors, primary sources. We come back with what is true about the market you are in, including the parts that are inconvenient.",
    artifact: "A research pack with sources and confidence notes.",
    weight: "Weeks 1–3",
  },
  {
    n: "03",
    title: "Define",
    summary:
      "The position, the scope, and the one thing the work has to be judged on. Anything we cannot measure here does not get built later.",
    artifact: "A positioning brief and a scoped plan.",
    weight: "Week 3",
  },
  {
    n: "04",
    title: "Design",
    summary:
      "Structure before surface: information architecture, argument, copy, then the visual system. Design is the last part of this stage, not the first.",
    artifact: "Architecture, copy and a design system you can extend.",
    weight: "Weeks 4–6",
  },
  {
    n: "05",
    title: "Build",
    summary:
      "Custom front-end, tools, integrations. Shipped in pieces you can see working, on infrastructure you own.",
    artifact: "A deployed, documented, working thing.",
    weight: "Weeks 5–12",
  },
  {
    n: "06",
    title: "Refine",
    summary:
      "Measured against the thing we agreed in Define. We fix what the numbers say, hand over the documentation, and leave.",
    artifact: "A review, a handover pack, and a decision about what is next.",
    weight: "Final weeks",
  },
];

export const processCaveat =
  "This is the shape, not a contract. A positioning sprint collapses stages 01–03 into two weeks; a research programme lives almost entirely in 02; an automation build spends longer in 05 than anywhere else. We adapt the sequence to the engagement and tell you which stages we are compressing, and why.";
