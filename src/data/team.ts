/**
 * Phase 10 — the team framework.
 *
 * The brief is explicit: only use verified names, photos, roles, bios and
 * links, and if they are unavailable, build a flexible component structure
 * instead of inventing identities. Nothing here is verified, so the cards
 * render role-first and the identity fields stay empty.
 *
 * To publish identities, fill in `name` / `portrait` / `link` and set
 * `verified: true`. The card component picks them up automatically and
 * nothing else needs to change.
 */
export interface TeamMember {
  /** Always shown — the role is not personal data. */
  role: string;
  /** Short initials used for the placeholder mark. */
  initials: string;
  /** What this seat does on an engagement. */
  note: string;
  /** Optional, verified-only fields. */
  name?: string;
  portrait?: string;
  link?: string;
  verified: boolean;
}

export const team: TeamMember[] = [
  {
    role: "Book Strategist & Editorial Lead",
    initials: "BS",
    note: "Owns positioning, the comp set, and the pitch. Reads the manuscript before anyone else does and writes the brief the rest of the studio works from.",
    verified: false,
  },
  {
    role: "Web Design & Front-End",
    initials: "WD",
    note: "Information architecture, editorial copy and the custom build. Argues about navigation until it is right, then ships and maintains it.",
    verified: false,
  },
  {
    role: "Automation & Systems",
    initials: "AS",
    note: "Conversational systems, retrieval over your archive, and the internal tools that take a recurring task off a human team.",
    verified: false,
  },
  {
    role: "Research & Analysis",
    initials: "RA",
    note: "Source discovery, annotated reading, market mapping. Every claim that reaches a client document has been through this desk.",
    verified: false,
  },
];

export const teamNote =
  "Four seats, listed by what each one does rather than by name. Individual names, portraits and links are published on this page once each principal has confirmed them in writing — we would rather the section look unfinished than be wrong.";
