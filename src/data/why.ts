/**
 * Phase 7 — positioning. Why THE OFFICE 360, argued specifically rather than
 * boastfully. Each theme is a claim about how the studio works, not a
 * superlative about the studio.
 */
export interface WhyTheme {
  k: string;
  v: string;
}

export const whyThemes: WhyTheme[] = [
  {
    k: "Strategy before execution.",
    v: "We will not build the thing until we can say why it should exist. If the positioning is wrong, a faster site and a prettier jacket make the mistake more expensive.",
  },
  {
    k: "Research before assumptions.",
    v: "Every recommendation carries its source. When we do not know, we say so and go and find out, which is slower than guessing and considerably cheaper than being wrong.",
  },
  {
    k: "Technology where it is useful.",
    v: "We build automation and conversational systems because some work should not need a person. We do not add AI to a brief because it sounds current.",
  },
  {
    k: "Human judgment where it is essential.",
    v: "Taste, argument, and knowing when a sentence is lying are not automatable. That is what the four of us are actually for.",
  },
  {
    k: "Small, deliberately.",
    v: "Four people, no subcontractors, no juniors learning on your budget. The person on the kickoff call is the person doing the work.",
  },
  {
    k: "Cross-disciplinary, on one brief.",
    v: "Editorial, research, design and engineering sit in the same conversation from day one instead of being handed off to each other in sequence.",
  },
  {
    k: "Quality over volume.",
    v: "We take a small number of engagements each quarter and turn down more than we accept. The waiting list exists because that is what the constraint produces.",
  },
  {
    k: "Yours, afterwards.",
    v: "Source you own, documentation a new hire can follow, and a handover rather than a dependency. You should be able to run this without us.",
  },
];

/**
 * Phase 9 — trust without fabrication.
 * These replace invented testimonials and client logos. Every line here is a
 * commitment the studio can be held to, not a claim about someone else.
 */
export interface Commitment {
  k: string;
  v: string;
}

export const commitments: Commitment[] = [
  {
    k: "We reply within two working days.",
    v: "To every brief, including the ones we decline. You will get an answer, not silence.",
  },
  {
    k: "We say no when we are not the right studio.",
    v: "And we name someone who is. Referring work away costs us nothing and saves you a quarter.",
  },
  {
    k: "We publish our process.",
    v: "Six stages, what you get at the end of each, and where we expect to deviate from it.",
  },
  {
    k: "We do not invent credentials on this site.",
    v: "No fabricated clients, testimonials, awards or statistics. Case studies with named outcomes are shared under NDA, on request.",
  },
  {
    k: "We show the work.",
    v: "A real audit deliverable is published on this site as a PDF. Judge the standard from that, not from adjectives.",
  },
  {
    k: "You keep what we make.",
    v: "Source, documents, evaluation sets and documentation are yours. There is no proprietary platform underneath.",
  },
];
