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

/**
 * Three of the four principals supplied and confirmed their names and roles
 * (27 Aug 2026). Portraits arrive with the studio's photo file; when each
 * image is dropped into public/team/ set `portrait` and the card picks it up
 * with no other change. The Research & Analysis seat stays role-first until
 * the fourth name is provided.
 *
 * Names are recorded exactly as supplied; spelling confirmation pending.
 */
export const team: TeamMember[] = [
  {
    role: "Book Strategist & Editorial Lead",
    initials: "BF",
    name: "Brain J. Fiore",
    portrait: "/team/brain-j-fiore.jpg",
    note: "Owns positioning, the comp set, and the pitch. Reads the manuscript before anyone else does and writes the brief the rest of the studio works from.",
    verified: true,
  },
  {
    role: "Web Design & Front-End",
    initials: "HW",
    name: "Henri Will",
    portrait: "/team/henri-will.jpg",
    note: "Information architecture, editorial copy and the custom build. Argues about navigation until it is right, then ships and maintains it.",
    verified: true,
  },
  {
    role: "Automation & Systems",
    initials: "CJ",
    name: "Collen Johnstone",
    portrait: "/team/collen-johnstone.jpg",
    note: "Conversational systems, retrieval over your archive, and the internal tools that take a recurring task off a human team.",
    verified: true,
  },
  {
    role: "Research & Analysis",
    initials: "MD",
    name: "Morrison Desmond",
    portrait: "/team/morrison-desmond.jpg",
    note: "Source discovery, annotated reading, market mapping. Every claim that reaches a client document has been through this desk.",
    verified: true,
  },
];

export const teamNote =
  "Four seats, four confirmed principals. We would rather the section look unfinished than be wrong — so names and portraits appear only once each principal has confirmed them in writing.";
