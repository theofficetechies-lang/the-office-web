/**
 * Part 2 §5 — the canonical six-stage methodology. This is the single source
 * of truth for stage names site-wide; the email, the homepage strip and the
 * methodology page all use these exact names so nothing contradicts anything.
 *
 * Payment gates follow stages: Discovery and Analysis produce a deliverable the
 * client keeps, which bounds their risk to a defined, recoverable amount.
 */
export interface ProcessStage {
  n: string;
  title: string;
  happens: string;
  receive: string;
  weight: string;
}

export const processStages: ProcessStage[] = [
  {
    n: "01",
    title: "Discovery",
    happens: "Intake: goals, history, existing assets, constraints. A go/no-go before any spend.",
    receive: "Discovery summary; go/no-go decision before any spend.",
    weight: "Week 1",
  },
  {
    n: "02",
    title: "Analysis",
    happens: "Market, audience, competitive, search and asset audits.",
    receive: "Written findings document — yours to keep.",
    weight: "Weeks 1–3",
  },
  {
    n: "03",
    title: "Strategy",
    happens: "Recommendations derived from findings; channels selected and justified; scope, timeline and cost fixed in writing.",
    receive: "Proposal with fixed scope and named deliverables.",
    weight: "Week 3",
  },
  {
    n: "04",
    title: "Implementation",
    happens: "Executed actions, logged and dated.",
    receive: "An action log, not just summaries.",
    weight: "Weeks 4–10",
  },
  {
    n: "05",
    title: "Measurement",
    happens: "Results compared against baseline at defined intervals.",
    receive: "Scheduled written reports with interpretation.",
    weight: "Ongoing, on cadence",
  },
  {
    n: "06",
    title: "Optimization",
    happens: "Findings fed back into execution; scope adjusted by agreement.",
    receive: "A revised plan where the evidence warrants it.",
    weight: "Final weeks",
  },
];

export const processCaveat =
  "Strategy follows from analysis — never the other way round. And the payment gates follow the stages: Discovery and Analysis produce a deliverable you keep whether or not we proceed, so your risk is bounded to a defined, recoverable amount. That is the mechanism behind \"you keep the analysis.\"";
