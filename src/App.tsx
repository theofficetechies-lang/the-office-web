import { useEffect, useRef, useState } from "react";
import ManifestBar from "./components/ManifestBar";
import MarginRail from "./components/MarginRail";
import MobileFolioStrip from "./components/MobileFolioStrip";
import Typewriter from "./components/Typewriter";
import ToastContainer from "./components/Toast";
import { submitBrief, ApiError } from "./lib/api";
import { useToast } from "./hooks/useToast";
import { cn } from "./utils/cn";
import { notesData, type NoteItem } from "./data/notes";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import NotesPage from "./pages/NotesPage";

/* ------------------------------------------------------------------ */
/* Data — The Office Studio                                           */
/* ------------------------------------------------------------------ */

const services = [
  {
    n: "01",
    title: "Book Strategy",
    blurb:
      "Positioning, audience architecture, concept development, and go-to-market strategy for authors and independent publishers. We work the problem before the jacket does — the proposal, the comp set, the acquisition deck, the launch sequence.",
    whoNeedsIt:
      "Authors preparing major trade proposals, independent presses repositioning backlist titles, and non-fiction authors writing category-defining works.",
    problemSolved:
      "Manuscripts launched into the wrong category, priced poorly, or lacking cognitive anchors that help booksellers and readers immediately grasp their value.",
    process:
      "01 Comp title & cultural audit → 02 Audience & reader modeling → 03 Pitch architecture & proposal drafting → 04 Pre-launch sequencing.",
    outcomes:
      "Definitive market positioning, heightened agent and imprint interest, and an audience acquisition runway that converts from week one.",
    deliverables: [
      "Positioning & audience model",
      "Comp title taxonomy",
      "Pitch & proposal architecture",
      "Launch & retail sequencing",
    ],
  },
  {
    n: "02",
    title: "Web Design",
    blurb:
      "Bespoke digital experiences, editorial front-ends, and durable design systems. We build sites that read like fine publications — not decorated templates. Tailored architecture on a stack you'll actually own in five years.",
    whoNeedsIt:
      "Established authors whose legacy websites fail their reputation, boutique presses requiring direct-to-reader channels, and literary institutions.",
    problemSolved:
      "Cluttered, slow template sites running on bloated page builders that distract readers, dilute authority, and fail to turn visitors into patrons.",
    process:
      "01 Content strategy & IA → 02 Editorial typography & UI design → 03 High-performance custom build → 04 Zero-lock CMS handover.",
    outcomes:
      "Sub-second load times, an enduring visual identity, and measurable growth in direct readership, newsletter sign-ups, and inquiries.",
    deliverables: [
      "Information architecture & copy",
      "Editorial UI & design system",
      "High-performance front-end",
      "Independent CMS control",
    ],
  },
  {
    n: "03",
    title: "Automation Services",
    blurb:
      "Custom workflow engineering, archive-trained conversational systems, and internal operational tools. Systems that replace a hundred manual spreadsheets and conversational agents that know an entire back-catalogue without hallucinating.",
    whoNeedsIt:
      "Presses drowning in rights or submissions triage, agencies managing deep back-catalogues, and authors running multi-channel workflows.",
    problemSolved:
      "Editorial and operational teams losing 15–20 hours a week to repetitive document triage, fragmented spreadsheets, and slow catalog lookups.",
    process:
      "01 Workflow bottleneck audit → 02 Data ingestion & retrieval mapping → 03 Custom agent & tool build → 04 Rigorous evaluation & staff training.",
    outcomes:
      "Reclaiming 30%+ of the working week; conversational assistants that know your archive in depth and answer queries in seconds.",
    deliverables: [
      "Workflow & triage automation",
      "Archive conversational agents",
      "RAG over catalogue assets",
      "Zero-latency internal tools",
    ],
  },
  {
    n: "04",
    title: "Book Research & Analysis",
    blurb:
      "Dedicated intelligence teams for literary, competitive, and historical research. Annotated dossiers, comp title maps, manuscript due diligence, and market gap analysis — the rigorous foundation serious publishing requires.",
    whoNeedsIt:
      "Nonfiction authors tackling complex subjects, literary agencies assessing competitive landscapes, and presses evaluating backlist acquisitions.",
    problemSolved:
      "Authors wasting months down unstructured research rabbit holes, or imprints commissioning manuscripts that duplicate recent competitor titles.",
    process:
      "01 Source discovery & archival retrieval → 02 Knowledge synthesis & fact checks → 03 Comp title & market gap mapping → 04 Strategic briefing dossier.",
    outcomes:
      "Impeccable factual authority, comprehensive comp clarity, and research dossiers that strengthen proposals and editorial execution.",
    deliverables: [
      "Annotated bibliographies & dossiers",
      "Competitive comp & market maps",
      "Manuscript due diligence",
      "Publishing trend analysis",
    ],
  },
];

const processSteps = [
  {
    n: "01",
    title: "Understand",
    desc: "We interrogate the thesis, surface constraints, and align on what commercial or editorial success looks like before touching a document.",
  },
  {
    n: "02",
    title: "Research",
    desc: "We audit the manuscript, comp title ecosystem, reader search behavior, or current digital architecture to uncover the exact strategic gap.",
  },
  {
    n: "03",
    title: "Define",
    desc: "We synthesize our findings into an actionable blueprint. You receive a clear, plain-language roadmap with deliverables, dependencies, and milestones.",
  },
  {
    n: "04",
    title: "Design",
    desc: "We shape the editorial architecture, visual hierarchy, typography, or conversational prompts. You see real drafts and prototypes—never surprises.",
  },
  {
    n: "05",
    title: "Build",
    desc: "We execute the work: drafting the positioning brief, engineering the custom front-end, or deploying the automated archive system.",
  },
  {
    n: "06",
    title: "Refine & Handover",
    desc: "We stress-test the deliverable, conduct thorough documentation, and train your team. You receive full ownership with zero proprietary lock-in.",
  },
];

const projects = [
  {
    n: "P/014",
    sector: "Independent publishing",
    title: "Repositioning a debut literary novel for a US trade house",
    challenge:
      "A complex multi-generational manuscript was languishing as a 'quiet family drama' without a clear commercial hook or defined reader demographic.",
    approach:
      "Re-anchored the comp set around contemporary social satire, highlighted timely political subtext, and redrafted the acquisition deck.",
    outcome:
      "Acquired in a competitive pre-empt by a major US imprint; selected to lead the publisher's spring literary list.",
    stack: ["Positioning", "Comp taxonomy", "Acquisition deck"],
    year: "2025",
  },
  {
    n: "P/021",
    sector: "Architecture practice",
    title: "An editorial site replacing a template the studio had outgrown",
    challenge:
      "A twelve-person architectural studio was trapped in a generic template that failed to convey their structural rigor to prospective cultural clients.",
    approach:
      "Architected a custom typography-led front-end where project pages read as curated architectural monographs with interactive drawings.",
    outcome:
      "Average session duration tripled; qualified inbound RFP invitations from institutional cultural clients increased by 42%.",
    stack: ["IA & Strategy", "Editorial copy", "Custom build"],
    year: "2025",
  },
  {
    n: "P/029",
    sector: "Literary agency",
    title: "A reader-facing assistant that knows a backlist in depth",
    challenge:
      "An agency's 40-year backlist of 800+ titles was virtually unsearchable for modern rights buyers and curious readers.",
    approach:
      "Engineered an embedding and RAG pipeline over verified synopses, reviews, and rights status with natural conversational search.",
    outcome:
      "Foreign rights team reclaimed 12 hours/week in manual catalog inquiries; reader discovery time dropped to seconds.",
    stack: ["RAG", "Agent design", "Zero-hallucination eval"],
    year: "2025",
  },
  {
    n: "P/033",
    sector: "Author · Nonfiction",
    title: "A multi-month reading programme and market map for a second book",
    challenge:
      "A bestselling historian needed to map an untouched archival comp territory for a high-stakes proposal without duplicating prior work.",
    approach:
      "Delivered an annotated 120-source dossier, competitive comp taxonomy, and market positioning brief.",
    outcome:
      "Secured a seven-figure two-book North American and UK deal at auction.",
    stack: ["Research", "Analysis", "Positioning brief"],
    year: "2024",
  },
  {
    n: "P/038",
    sector: "Boutique press",
    title: "An internal assistant that triages foreign-rights submissions",
    challenge:
      "Editorial team received 200+ foreign translation manuscripts monthly, creating a 3-month backlog for junior readers.",
    approach:
      "Engineered an internal evaluation pipeline that extracts themes, verifies comp sales, and flags high-probability fits.",
    outcome:
      "Triage turnaround dropped from 12 weeks to 48 hours with human sign-off on all qualified leads.",
    stack: ["Workflow automation", "Parsing", "Internal UI"],
    year: "2024",
  },
  {
    n: "P/042",
    sector: "Memoirist",
    title: "Launch architecture for a memoir entering a crowded market",
    challenge:
      "A debut personal memoir was entering a season with 14 competing celebrity memoirs on the national lists.",
    approach:
      "Formulated a non-traditional launch sequence: targeted longform cultural essays, niche literary podcasts, and independent retail pairings.",
    outcome:
      "Hit the national indie bestseller list in week one; sustained backlist velocity for 22 consecutive weeks.",
    stack: ["Launch strategy", "Comp analysis", "Editorial PR"],
    year: "2024",
  },
];

const whyUsPillars = [
  {
    n: "01",
    title: "Strategy before execution",
    desc: "We work the conceptual thesis before touching the stylesheet or typography. A beautiful site or jacket cannot rescue a misdiagnosed market.",
  },
  {
    n: "02",
    title: "Research before assumptions",
    desc: "Rigorous comp discovery, archive diligence, and reader evidence replace committee guesswork and marketing folklore.",
  },
  {
    n: "03",
    title: "Technology with purpose",
    desc: "We build bespoke automation and AI pipelines to eliminate repetitive operational toil, while reserving strategy, voice, and taste for experienced human minds.",
  },
  {
    n: "04",
    title: "Direct principal attention",
    desc: "The studio is four principals. You will never be pitched by founders only to have your brief handed off to junior subcontractors or interns.",
  },
  {
    n: "05",
    title: "Quality over volume",
    desc: "We accept a strictly capped number of engagements per calendar quarter. When a client works with us, they have our full focus and rapid turnaround.",
  },
];

const principles = [
  {
    k: "Plain language.",
    v: "If a sentence needs a glossary, it needs a rewrite. We write the brief, the copy, and the changelog in the same voice.",
  },
  {
    k: "Specific outcomes.",
    v: "We don't ship 'engagement.' We ship things a person can point at: a re-pitched manuscript, a measurable lift, a tool that pays back its cost in a quarter.",
  },
  {
    k: "Small, on purpose.",
    v: "Four people. No interns, no subcontractors, no AI in the byline. The person you meet is the person who does the work.",
  },
  {
    k: "Owned, not rented.",
    v: "We build on stacks our clients can run in five years. No proprietary platforms, no vendor lock dressed up as 'partnership.'",
  },
];

const philosophyCommitments = [
  {
    k: "Direct Principal Delivery",
    v: "The person on the kickoff call is the person doing the work. We do not subcontract, outsource, or delegate to junior staff.",
  },
  {
    k: "Complete Client Ownership",
    v: "Every deliverable, stylesheet, prompt, and dossier belongs to you. Zero proprietary lock-in, zero ongoing vendor dependencies.",
  },
  {
    k: "Principled Fit",
    v: "We turn down briefs when we are not the right studio for the problem, and gladly recommend colleagues who are.",
  },
];

const team = [
  {
    initials: "SD",
    name: "Samantha Dion",
    practice: "Practice Lead · Book Strategy & Editorial Direction",
    note: "Former commissioning editor at a mid-size trade house. Has repositioned manuscripts that went on to win major acquisitions and literary recognition. Writes the briefs.",
  },
  {
    initials: "MK",
    name: "Marcus Kowalski",
    practice: "Practice Lead · Web Design & Front-End Engineering",
    note: "Built editorial products inside publishing and product teams for twelve years. Specializes in typography-driven IA and lightweight, enduring front-ends.",
  },
  {
    initials: "LP",
    name: "Lena Park",
    practice: "Practice Lead · Systems & Automation",
    note: "Engineer who spent a decade building conversational systems, RAG archives, and workflow tools. Replaces spreadsheets with things that actually work.",
  },
  {
    initials: "JR",
    name: "James Reid",
    practice: "Practice Lead · Research & Literary Intelligence",
    note: "Former literary agency researcher. Maps competitive landscapes in days, uncovers comp blind spots, and builds factual authority into manuscripts.",
  },
];

const faqs = [
  {
    q: "Do you work with unpublished manuscripts?",
    a: "Yes, but selectively. We take on pre-publication positioning and strategy work when the manuscript is far enough along that we can assess its real shape. We do not take on projects where the book is still an unwritten concept.",
  },
  {
    q: "What does a typical engagement cost?",
    a: "Most projects fall between $4,000 and $18,000 depending on scope. A targeted book positioning or Amazon audit engagement is usually at the lower end; a full custom site build or archival automation build is at the higher end. We scope against the brief, not an arbitrary rate card.",
  },
  {
    q: "Do you work remotely?",
    a: "Always. We are split between Lisbon and New York and have delivered projects for clients in London, Berlin, São Paulo, and Los Angeles. All calls are direct video; all deliverables are digital and fully documented.",
  },
  {
    q: "What if we are not a publisher?",
    a: "We work with authors, literary agencies, cultural institutions, independent presses, and adjacent enterprises — anyone whose mission involves books, readers, or the knowledge systems that connect them.",
  },
  {
    q: "How long does a project take?",
    a: "Six to fourteen weeks is the typical range. A positioning brief might take six weeks. A full custom digital flagship with editorial copy is usually twelve to fourteen. We do not take on rush work that sacrifices depth.",
  },
];

/* ------------------------------------------------------------------ */
/* Analytics helper                                                    */
/* ------------------------------------------------------------------ */

declare global {
  interface Window {
    track?: (event: string, props?: Record<string, unknown>) => void;
    dataLayer?: unknown[];
  }
}

function track(event: string, props?: Record<string, unknown>) {
  try {
    if (typeof window.track === "function") {
      window.track(event, props);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...props });
    } else if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[track]", event, props);
    }
  } catch {
    // Analytics fallback
  }
}

/* ------------------------------------------------------------------ */
/* Components                                                          */
/* ------------------------------------------------------------------ */

function ServiceRow({ s }: { s: (typeof services)[number] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="py-10 sm:py-12 border-t border-black/90 first:border-t-0">
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-12 sm:col-span-3 mb-3 sm:mb-0">
          <div className="font-mono text-xs tracking-mono opacity-60 mb-2">
            {s.n} / PRACTICE
          </div>
          <h3 className="font-display text-2xl sm:text-3xl tracking-display leading-[1.05]">
            {s.title}
          </h3>
        </div>
        <div className="col-span-12 sm:col-span-6">
          <p className="text-[15.5px] leading-[1.65] max-w-prose">{s.blurb}</p>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              className="font-mono text-[11px] tracking-mono underline opacity-70 hover:opacity-100 cursor-pointer"
            >
              {expanded ? "− CLOSE PRACTICE SPECIFICATION" : "+ VIEW PRACTICE SPECIFICATION"}
            </button>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-3 mt-4 sm:mt-0">
          <div className="font-mono text-[11px] tracking-mono opacity-60 mb-2">
            DELIVERABLES
          </div>
          <ul className="text-[13.5px] leading-[1.6] space-y-1">
            {s.deliverables.map((d) => (
              <li key={d} className="flex gap-2">
                <span aria-hidden="true" className="opacity-50">
                  —
                </span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {expanded && (
        <div className="mt-6 pt-6 border-t border-black/20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-black/[0.02] p-5 sm:p-6">
          <div>
            <div className="font-mono text-[10px] tracking-mono uppercase opacity-60 mb-1.5">
              Who Needs It
            </div>
            <p className="text-[13px] leading-[1.6] opacity-85">{s.whoNeedsIt}</p>
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-mono uppercase opacity-60 mb-1.5">
              Problem Solved
            </div>
            <p className="text-[13px] leading-[1.6] opacity-85">{s.problemSolved}</p>
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-mono uppercase opacity-60 mb-1.5">
              Methodology
            </div>
            <p className="text-[12.5px] leading-[1.6] opacity-85 font-mono">{s.process}</p>
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-mono uppercase opacity-60 mb-1.5">
              Expected Outcomes
            </div>
            <p className="text-[13px] leading-[1.6] opacity-85">{s.outcomes}</p>
          </div>
        </div>
      )}
    </article>
  );
}

function TeamMember({ member }: { member: (typeof team)[number] }) {
  return (
    <div className="flex flex-col gap-4 border-t border-black/20 pt-6">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-black text-white flex items-center justify-center font-mono text-[14px] tracking-mono font-semibold shrink-0">
          {member.initials}
        </div>
        <div>
          <div className="font-display text-[19px] tracking-display leading-tight">
            {member.name}
          </div>
          <div className="font-mono text-[11px] tracking-mono opacity-60 mt-0.5">
            {member.practice}
          </div>
        </div>
      </div>
      <p className="text-[13.5px] leading-[1.65] opacity-85">
        {member.note}
      </p>
    </div>
  );
}

function ProcessStep({ s }: { s: (typeof processSteps)[number] }) {
  return (
    <div className="flex flex-col gap-3 border-t border-black pt-5">
      <div className="font-mono text-[11px] tracking-mono opacity-60">
        {s.n} / STAGE
      </div>
      <h3 className="font-display text-[20px] sm:text-[22px] tracking-display leading-tight">
        {s.title}
      </h3>
      <p className="text-[14px] leading-[1.65] opacity-85">{s.desc}</p>
    </div>
  );
}

function WhyUsItem({ pillar }: { pillar: (typeof whyUsPillars)[number] }) {
  return (
    <div className="border-t border-black pt-6 flex flex-col gap-3">
      <div className="font-mono text-[11px] tracking-mono opacity-60">
        {pillar.n} / COMMITMENT
      </div>
      <h3 className="font-display text-[20px] sm:text-[22px] tracking-display leading-tight">
        {pillar.title}
      </h3>
      <p className="text-[14px] leading-[1.65] opacity-85 max-w-prose">
        {pillar.desc}
      </p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-black/90">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-start justify-between gap-4 text-left cursor-pointer"
        aria-expanded={open}
      >
        <span className="font-display text-[17px] sm:text-[19px] tracking-display leading-tight">
          {q}
        </span>
        <span className="font-mono text-[14px] tracking-mono opacity-60 shrink-0 mt-0.5">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div className="pb-5 max-w-prose">
          <p className="text-[14.5px] leading-[1.65] opacity-85">{a}</p>
        </div>
      )}
    </div>
  );
}

function NoteCard({ note }: { note: NoteItem }) {
  const [reading, setReading] = useState(false);

  return (
    <article className="flex flex-col gap-3 border-t border-black pt-5">
      <div className="flex items-center justify-between font-mono text-[11px] tracking-mono opacity-60">
        <span>{note.date}</span>
        <span>{note.readTime}</span>
      </div>
      <div className="font-mono text-[10px] tracking-mono uppercase opacity-50">
        {note.category}
      </div>
      <h3 className="font-display text-[19px] sm:text-[21px] tracking-display leading-tight">
        {note.title}
      </h3>
      <p className="text-[14px] leading-[1.65] opacity-85 flex-1">
        {note.excerpt}
      </p>

      {reading && (
        <div className="my-3 pt-4 border-t border-black/15 space-y-3 text-[13.5px] leading-[1.7] opacity-90">
          {note.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
          <div className="border-l-2 border-black pl-3 py-1 font-mono text-[12px] tracking-mono opacity-90">
            <strong>TAKEAWAY:</strong> {note.keyTakeaway}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-black/10 mt-auto">
        <button
          type="button"
          onClick={() => setReading(!reading)}
          className="font-mono text-[11px] tracking-mono underline opacity-70 hover:opacity-100 cursor-pointer"
        >
          {reading ? "↑ CLOSE ESSAY" : "READ ESSAY ↓"}
        </button>
        <a
          href={`/notes#${note.slug}`}
          className="font-mono text-[10.5px] tracking-mono opacity-60 hover:opacity-100"
        >
          NOTE PAGE →
        </a>
      </div>
    </article>
  );
}

function ProjectCard({
  p,
  large = false,
}: {
  p: (typeof projects)[number];
  large?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={[
        "group relative flex flex-col h-full p-6 sm:p-7",
        "border border-black",
        "transition-colors duration-200",
        "hover:bg-black hover:text-white",
        "focus-within:bg-black focus-within:text-white",
      ].join(" ")}
    >
      <header className="flex items-start justify-between mb-6 font-mono text-[11px] tracking-mono opacity-70 group-hover:opacity-90 group-focus-within:opacity-90">
        <span>{p.n}</span>
        <span>{p.year}</span>
      </header>

      <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-60 group-hover:opacity-80 mb-3">
        {p.sector}
      </div>

      <h3
        className={[
          "font-display tracking-display leading-[1.05] mb-4",
          large ? "text-2xl sm:text-[28px]" : "text-[20px] sm:text-[22px]",
        ].join(" ")}
      >
        {p.title}
      </h3>

      <p className="text-[14px] leading-[1.6] mb-5 flex-1">{p.outcome}</p>

      {expanded && (
        <div className="my-4 pt-4 border-t border-current/20 space-y-3 text-[13px] leading-[1.55]">
          <div>
            <span className="font-mono text-[10px] tracking-mono uppercase opacity-60 block">The Challenge</span>
            <p className="mt-0.5 opacity-90">{p.challenge}</p>
          </div>
          <div>
            <span className="font-mono text-[10px] tracking-mono uppercase opacity-60 block">Our Approach</span>
            <p className="mt-0.5 opacity-90">{p.approach}</p>
          </div>
        </div>
      )}

      <div className="mb-4">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="font-mono text-[10.5px] tracking-mono uppercase underline opacity-70 hover:opacity-100 cursor-pointer"
        >
          {expanded ? "− Close Case Details" : "+ View Case Details"}
        </button>
      </div>

      <footer className="mt-auto pt-4 border-t border-current/20 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] tracking-mono">
        {p.stack.map((tag) => (
          <span key={tag} className="opacity-80">
            {tag}
          </span>
        ))}
      </footer>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Contact form — production grade                                    */
/* ------------------------------------------------------------------ */

type FormState = "idle" | "submitting" | "sent" | "error";

interface FormDataState {
  name: string;
  email: string;
  org: string;
  service: string;
  timeline: string;
  budget: string;
  discovery: string;
  brief: string;
  company_website: string;
}

const initialFormData: FormDataState = {
  name: "",
  email: "",
  org: "",
  service: "",
  timeline: "",
  budget: "",
  discovery: "",
  brief: "",
  company_website: "",
};

function ContactForm() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<FormDataState>(initialFormData);
  const [status, setStatus] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (field: keyof FormDataState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        if (Object.keys(next).length === 0) {
          setStatus("idle");
          setErrorMsg("");
        }
        return next;
      });
    }
  };

  function validate(): { ok: boolean; errors: Record<string, string> } {
    const next: Record<string, string> = {};
    const name = formData.name.trim();
    const email = formData.email.trim();
    const brief = formData.brief.trim();

    if (!name) {
      next.name = "Please enter your name";
    } else if (name.length > 100) {
      next.name = "Name must be under 100 characters";
    }

    if (!email) {
      next.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Please enter a valid email address";
    }

    if (!brief) {
      next.brief = "Please tell us what you are trying to make happen";
    } else if (brief.length < 5) {
      next.brief = "Please enter at least a few words";
    } else if (brief.length > 5000) {
      next.brief = "Brief must be under 5,000 characters";
    }

    return { ok: Object.keys(next).length === 0, errors: next };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    const result = validate();
    setErrors(result.errors);

    if (!result.ok) {
      setStatus("error");
      setErrorMsg("PLEASE COMPLETE THE REQUIRED FIELDS");
      addToast("Please complete the required fields before submitting.", "error");

      const firstErrorField = Object.keys(result.errors)[0];
      if (firstErrorField) {
        const el = document.getElementById(firstErrorField);
        if (el) {
          el.focus();
        }
      }
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      org: formData.org.trim(),
      service: formData.service.trim(),
      timeline: formData.timeline.trim(),
      budget: formData.budget.trim(),
      discovery: formData.discovery.trim(),
      brief: formData.brief.trim(),
      company_website: formData.company_website.trim(),
    };

    try {
      const response = await submitBrief(payload);
      setStatus("sent");
      track("brief_submitted", { service: payload.service });
      addToast(
        response.message ?? "Brief received. We reply within two working days.",
        "success"
      );
      setFormData(initialFormData);
      setErrors({});
      setTimeout(() => setStatus("idle"), 6000);
    } catch (err) {
      let message =
        "Unable to send brief automatically. Please email us directly at theofficetechies@gmail.com";

      if (err instanceof ApiError) {
        if (err.status === 429) {
          message = "Too many attempts. Please wait 15 minutes before trying again.";
        } else if (err.status === 400 && err.issues) {
          const fieldErrors: Record<string, string> = {};
          err.issues.forEach((issue) => {
            fieldErrors[issue.path] = issue.message;
          });
          setErrors(fieldErrors);
          message = "Please correct the highlighted fields below.";
        } else if (err.message) {
          message = err.message;
        }
      }

      setStatus("error");
      setErrorMsg("DELIVERY ISSUE · PLEASE EMAIL US DIRECTLY");
      addToast(message, "error");
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-x-5 gap-y-5"
      aria-label="Project brief"
      noValidate
    >
      <Field
        id="name"
        label="YOUR NAME"
        type="text"
        autoComplete="name"
        required
        value={formData.name}
        onChange={(val) => handleChange("name", val)}
        error={errors.name}
      />
      <Field
        id="email"
        label="EMAIL"
        type="email"
        autoComplete="email"
        required
        value={formData.email}
        onChange={(val) => handleChange("email", val)}
        error={errors.email}
      />
      <Field
        id="org"
        label="COMPANY / PUBLISHER / NONE"
        type="text"
        value={formData.org}
        onChange={(val) => handleChange("org", val)}
        error={errors.org}
      />
      <div className="col-span-2 sm:col-span-1">
        <label
          htmlFor="service"
          className="block font-mono text-[11px] tracking-mono opacity-60 mb-2"
        >
          SERVICE
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={(e) => handleChange("service", e.target.value)}
          className={cn(
            "w-full bg-transparent border-b py-2 text-[15px] outline-none transition-colors cursor-pointer",
            errors.service
              ? "border-red-400 focus:border-red-400 text-white"
              : "border-white/50 focus:border-white text-white"
          )}
        >
          <option value="" disabled className="text-black">
            Select one
          </option>
          <option value="book-strategist" className="text-black">
            Book Strategy
          </option>
          <option value="web-design" className="text-black">
            Web Design
          </option>
          <option value="automation-services" className="text-black">
            Automation Services
          </option>
          <option value="book-research" className="text-black">
            Book Research &amp; Analysis
          </option>
          <option value="not-sure" className="text-black">
            Not sure yet
          </option>
        </select>
        {errors.service && <ErrLine id="service-err">{errors.service}</ErrLine>}
      </div>

      <div className="col-span-2 sm:col-span-1">
        <label
          htmlFor="timeline"
          className="block font-mono text-[11px] tracking-mono opacity-60 mb-2"
        >
          TIMELINE (OPTIONAL)
        </label>
        <select
          id="timeline"
          name="timeline"
          value={formData.timeline}
          onChange={(e) => handleChange("timeline", e.target.value)}
          className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-[15px] outline-none transition-colors cursor-pointer text-white"
        >
          <option value="" className="text-black">
            Select timeline
          </option>
          <option value="immediate" className="text-black">
            Immediate (within 2 weeks)
          </option>
          <option value="1-2-months" className="text-black">
            1–2 months
          </option>
          <option value="3-6-months" className="text-black">
            3–6 months
          </option>
          <option value="flexible" className="text-black">
            Flexible / Exploratory
          </option>
        </select>
      </div>

      <div className="col-span-2 sm:col-span-1">
        <label
          htmlFor="budget"
          className="block font-mono text-[11px] tracking-mono opacity-60 mb-2"
        >
          ESTIMATED SCOPE / BUDGET (OPTIONAL)
        </label>
        <select
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={(e) => handleChange("budget", e.target.value)}
          className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-[15px] outline-none transition-colors cursor-pointer text-white"
        >
          <option value="" className="text-black">
            Select range
          </option>
          <option value="4k-8k" className="text-black">
            $4,000 – $8,000
          </option>
          <option value="8k-15k" className="text-black">
            $8,000 – $15,000
          </option>
          <option value="15k-plus" className="text-black">
            $15,000 – $25,000+
          </option>
          <option value="undetermined" className="text-black">
            Flexible / Scoped to brief
          </option>
        </select>
      </div>

      <div className="col-span-2 sm:col-span-1">
        <label
          htmlFor="discovery"
          className="block font-mono text-[11px] tracking-mono opacity-60 mb-2"
        >
          HOW DID YOU FIND US? (OPTIONAL)
        </label>
        <select
          id="discovery"
          name="discovery"
          value={formData.discovery}
          onChange={(e) => handleChange("discovery", e.target.value)}
          className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-[15px] outline-none transition-colors cursor-pointer text-white"
        >
          <option value="" className="text-black">
            Select one
          </option>
          <option value="referral" className="text-black">
            Referral / Colleague
          </option>
          <option value="search" className="text-black">
            Search / Online
          </option>
          <option value="notes" className="text-black">
            Field Notes / Essay
          </option>
          <option value="other" className="text-black">
            Other
          </option>
        </select>
      </div>

      <div className="col-span-2">
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="brief"
            className={cn(
              "block font-mono text-[11px] tracking-mono transition-colors",
              errors.brief ? "text-red-400" : "opacity-60"
            )}
          >
            THE BRIEF <span className="opacity-50 ml-1">*</span>
          </label>
          <span className="font-mono text-[10px] tracking-mono opacity-40">
            {formData.brief.length > 0 ? `${formData.brief.length} characters` : ""}
          </span>
        </div>
        <textarea
          id="brief"
          name="brief"
          required
          rows={5}
          value={formData.brief}
          onChange={(e) => handleChange("brief", e.target.value)}
          placeholder="What you are trying to make happen. A timeline. A budget range. The thing that keeps you up at night about it."
          aria-invalid={Boolean(errors.brief) || undefined}
          aria-describedby={errors.brief ? "brief-err" : undefined}
          className={cn(
            "w-full bg-transparent border-b py-2 text-[15px] outline-none resize-none placeholder:opacity-40 transition-colors",
            errors.brief
              ? "border-red-400 focus:border-red-400 text-white"
              : "border-white/50 focus:border-white text-white"
          )}
        />
        {errors.brief && <ErrLine id="brief-err">{errors.brief}</ErrLine>}
      </div>

      {/* Honeypot field — hidden from real users, screen readers, and text selection */}
      <div
        className="hidden"
        aria-hidden="true"
        style={{ display: "none" }}
      >
        <label htmlFor="company_website">Website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.company_website}
          onChange={(e) => handleChange("company_website", e.target.value)}
        />
      </div>

      <div className="col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div
          className="text-[12px] font-mono tracking-mono max-w-[38ch]"
          aria-live="polite"
        >
          {status === "error" && errorMsg ? (
            <span className="text-red-400">{errorMsg}</span>
          ) : status === "sent" ? (
            <span className="text-emerald-400">
              RECEIVED. WE REPLY WITHIN TWO WORKING DAYS.
            </span>
          ) : (
            <span className="opacity-60">
              WE REPLY WITHIN TWO WORKING DAYS. WE TURN DOWN BRIEFS WHEN WE ARE NOT THE RIGHT FIT.
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {status === "error" && (
            <a
              href={`mailto:theofficetechies@gmail.com?subject=${encodeURIComponent(
                formData.name ? `Brief from ${formData.name}` : "Project Brief"
              )}&body=${encodeURIComponent(
                `Name: ${formData.name}\nEmail: ${formData.email}\nOrg: ${formData.org}\nService: ${formData.service}\n\n${formData.brief}`
              )}`}
              className="text-[11px] font-mono tracking-mono underline opacity-70 hover:opacity-100"
            >
              EMAIL US DIRECTLY →
            </a>
          )}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="bg-white text-black px-5 py-3 font-mono text-[12px] tracking-mono font-semibold border border-white hover:bg-transparent hover:text-white transition-colors disabled:opacity-60 disabled:cursor-wait cursor-pointer whitespace-nowrap"
          >
            {status === "submitting"
              ? "SENDING…"
              : status === "sent"
                ? "RECEIVED ✓"
                : status === "error"
                  ? "TRY AGAIN →"
                  : "SEND BRIEF →"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  type,
  required,
  autoComplete,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  return (
    <div className="col-span-2 sm:col-span-1">
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={id}
          className={cn(
            "block font-mono text-[11px] tracking-mono transition-colors",
            error ? "text-red-400" : "opacity-60"
          )}
        >
          {label}
          {required && <span className="opacity-50 ml-1">*</span>}
        </label>
      </div>
      <input
        id={id}
        name={id}
        required={required}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(
          "w-full bg-transparent border-b py-2 text-[15px] outline-none transition-colors",
          error
            ? "border-red-400 focus:border-red-400 text-white"
            : "border-white/50 focus:border-white text-white"
        )}
      />
      {error && <ErrLine id={`${id}-err`}>{error}</ErrLine>}
    </div>
  );
}

function ErrLine({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 font-mono text-[11px] tracking-mono text-red-400 flex items-center gap-1"
    >
      <span aria-hidden="true">↑</span>
      <span>{children}</span>
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll reveal hook                                                  */
/* ------------------------------------------------------------------ */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ------------------------------------------------------------------ */
/* 404 Component                                                      */
/* ------------------------------------------------------------------ */

function NotFound() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <ManifestBar />
      <header className="rule-b">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-4 flex items-center justify-between">
          <a
            href="/"
            className="font-display text-[20px] sm:text-[22px] tracking-display-tight font-semibold"
            aria-label="THE OFFICE — home"
          >
            THE&nbsp;OFFICE
            <span className="font-mono text-[10px] tracking-mono align-top ml-1 opacity-60">
              ®
            </span>
          </a>
          <a
            href="/"
            className="font-mono text-[11px] tracking-mono uppercase underline opacity-80 hover:opacity-100"
          >
            Return Home →
          </a>
        </div>
      </header>

      <main className="flex-1 flex items-center py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 w-full">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10">
            <MarginRail
              sectionNum="404"
              sectionLabel="ERROR / DOCUMENT NOT FOUND"
              folio="PORTFOLIO NULL"
              note="The requested URI does not resolve to an active archive document or brief."
            />
            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip
                sectionNum="404"
                sectionLabel="DOCUMENT NOT FOUND"
                folio="PORTFOLIO NULL"
              />
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                HTTP 404 / NOT FOUND
              </div>
              <h1 className="font-display tracking-display text-[42px] sm:text-[68px] lg:text-[88px] leading-[0.95] font-light max-w-[16ch] mb-6">
                This document is not in the archive.
              </h1>
              <p className="text-[16px] leading-[1.65] opacity-80 max-w-prose mb-8">
                The link you followed may have been moved, archived, or retired.
                If you were looking to submit a project brief or learn about our
                work, our studio homepage remains open.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="/"
                  className="bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors"
                >
                  RETURN TO HOME →
                </a>
                <a
                  href="/#contact"
                  className="border border-black px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black hover:text-white transition-colors"
                >
                  SUBMIT A BRIEF →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-black/20 py-6">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] tracking-mono opacity-70">
          <div>© {new Date().getFullYear()} THE OFFICE STUDIO.</div>
          <div>theofficetechies@gmail.com</div>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Application Component                                         */
/* ------------------------------------------------------------------ */

export default function App() {
  useReveal();
  const [heroDone, setHeroDone] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [route, setRoute] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.pathname;
    }
    return "/";
  });

  useEffect(() => {
    function handlePopState() {
      setRoute(window.location.pathname);
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  if (route === "/privacy") {
    return <PrivacyPage />;
  }

  if (route === "/terms") {
    return <TermsPage />;
  }

  if (route === "/notes") {
    return <NotesPage />;
  }

  if (route !== "/" && route !== "") {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:font-mono focus:text-[12px] focus:outline-none"
      >
        Skip to main content
      </a>
      <ToastContainer />
      <ManifestBar />

      {/* HEADER / NAVIGATION */}
      <header className="rule-b relative">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-4 flex items-center justify-between">
          <a
            href="#top"
            className="font-display text-[20px] sm:text-[22px] tracking-display-tight font-semibold"
            aria-label="THE OFFICE — top"
          >
            THE&nbsp;OFFICE
            <span className="font-mono text-[10px] tracking-mono align-top ml-1 opacity-60">
              ®
            </span>
          </a>

          <nav
            aria-label="Primary"
            className="ml-auto hidden md:flex items-center gap-7 font-mono text-[12px] tracking-mono"
          >
            <a href="#services" className="hover:opacity-60 transition-opacity">
              SERVICES
            </a>
            <a href="#process" className="hover:opacity-60 transition-opacity">
              PROCESS
            </a>
            <a href="#work" className="hover:opacity-60 transition-opacity">
              WORK
            </a>
            <a href="#why-us" className="hover:opacity-60 transition-opacity">
              WHY US
            </a>
            <a href="#notes" className="hover:opacity-60 transition-opacity">
              NOTES
            </a>
            <a href="#about" className="hover:opacity-60 transition-opacity">
              ABOUT
            </a>
            <a href="#contact" className="hover:opacity-60 transition-opacity">
              CONTACT
            </a>
            <a
              href="#contact"
              className="ink-block px-3.5 py-1.5 font-mono text-[11px] tracking-mono font-semibold"
            >
              START A BRIEF →
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="md:hidden font-mono text-[12px] tracking-mono font-semibold border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors cursor-pointer"
            aria-label="Open mobile navigation"
          >
            MENU
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        {mobileNavOpen && (
          <div
            className="fixed inset-0 z-50 bg-white text-black flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 py-4 flex items-center justify-between rule-b">
              <span className="font-display text-[20px] tracking-display-tight font-semibold">
                THE&nbsp;OFFICE
              </span>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="font-mono text-[12px] tracking-mono font-semibold border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                CLOSE
              </button>
            </div>
            <nav className="flex-1 flex flex-col items-start justify-center px-4 sm:px-6 gap-6">
              <a
                href="#services"
                onClick={() => setMobileNavOpen(false)}
                className="font-display text-[32px] sm:text-[44px] tracking-display leading-tight"
              >
                Services
              </a>
              <a
                href="#process"
                onClick={() => setMobileNavOpen(false)}
                className="font-display text-[32px] sm:text-[44px] tracking-display leading-tight"
              >
                Approach &amp; Process
              </a>
              <a
                href="#work"
                onClick={() => setMobileNavOpen(false)}
                className="font-display text-[32px] sm:text-[44px] tracking-display leading-tight"
              >
                Selected Work
              </a>
              <a
                href="#why-us"
                onClick={() => setMobileNavOpen(false)}
                className="font-display text-[32px] sm:text-[44px] tracking-display leading-tight"
              >
                Why THE OFFICE
              </a>
              <a
                href="#notes"
                onClick={() => setMobileNavOpen(false)}
                className="font-display text-[32px] sm:text-[44px] tracking-display leading-tight"
              >
                Field Notes
              </a>
              <a
                href="#about"
                onClick={() => setMobileNavOpen(false)}
                className="font-display text-[32px] sm:text-[44px] tracking-display leading-tight"
              >
                About the Studio
              </a>
              <a
                href="#contact"
                onClick={() => setMobileNavOpen(false)}
                className="font-display text-[32px] sm:text-[44px] tracking-display leading-tight"
              >
                Contact
              </a>
              <a
                href="#contact"
                onClick={() => setMobileNavOpen(false)}
                className="mt-4 ink-block px-5 py-3 font-mono text-[12px] tracking-mono font-semibold"
              >
                START A BRIEF →
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* 00 / HERO EXPERIENCE */}
      <section id="top" className="rule-b" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-10 sm:py-16 lg:py-24">
            <MarginRail
              sectionNum="00"
              sectionLabel="THE OFFICE / A STUDIO FOR BOOKS, WEB, AUTOMATION, AND RESEARCH"
              folio="PORTFOLIO I"
              note="A small independent practice. We combine editorial research, book strategy, bespoke digital craftsmanship, and custom automation."
            />

            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip
                sectionNum="00"
                sectionLabel="A STUDIO FOR BOOKS, WEB, AUTOMATION, AND RESEARCH"
                folio="PORTFOLIO I"
              />
              <div className="font-mono text-[11px] sm:text-[12px] tracking-mono opacity-70 mb-6 sm:mb-10 flex flex-wrap items-center gap-x-2">
                <span className="opacity-60">AN INDEPENDENT STUDIO. </span>
                <span>FOUR PRINCIPALS. </span>
                <span className="hidden sm:inline">EST. 2021. </span>
                <span>LISBON &amp; NEW YORK.</span>
              </div>

              <h1
                id="hero-heading"
                className="font-display tracking-display-tight font-light text-[44px] leading-[0.98] sm:text-[72px] sm:leading-[0.96] lg:text-[112px] lg:leading-[0.94]"
              >
                We do the work
                <br />
                behind the{" "}
                <span className="italic font-normal">book</span>, the
                <br />
                site, and the automation.
              </h1>

              <div className="mt-10 sm:mt-14 grid grid-cols-12 gap-x-6 gap-y-8">
                <div className="col-span-12 lg:col-span-7">
                  <p className="text-[16.5px] sm:text-[18px] leading-[1.6] max-w-prose">
                    THE&nbsp;OFFICE is a four-person creative technology studio for authors,
                    independent publishers, and literary enterprises. We combine deep editorial
                    research, category positioning, custom digital flagships, and tailored workflow
                    automation. Four principals. Zero account managers, zero pitch theater, no delegation.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <a
                      href="#contact"
                      className="bg-black text-white border border-black px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors"
                    >
                      START A PROJECT →
                    </a>
                    <a
                      href="#process"
                      className="border border-black px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black hover:text-white transition-colors"
                    >
                      EXPLORE OUR APPROACH ↓
                    </a>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-4 lg:col-start-9 flex flex-col gap-3">
                  <div className="font-mono text-[11px] tracking-mono opacity-60">
                    CURRENTLY READING ON THE BRIEF:
                  </div>
                  <div className="font-display text-[20px] sm:text-[22px] tracking-display leading-[1.25]">
                    <Typewriter
                      text="“A working class of letters.” — a novel repositioning, Spring '26."
                      speed={28}
                      onDone={() => setHeroDone(true)}
                    />
                  </div>
                  <div
                    className={[
                      "mt-2 font-mono text-[11px] tracking-mono opacity-60 transition-opacity duration-200",
                      heroDone ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                  >
                    STATUS: ACCEPTING 2 ENGAGEMENTS FOR Q3/Q4
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 01 / SERVICES */}
      <section
        id="services"
        className="rule-b"
        aria-labelledby="services-heading"
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
            <MarginRail
              sectionNum="01"
              sectionLabel="FOUR PRACTICES. ONE STUDIO."
              folio="PORTFOLIO II"
              note="These are not template packages. We scope each engagement directly against the problem to be solved."
            />

            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip
                sectionNum="01"
                sectionLabel="FOUR PRACTICES. ONE STUDIO."
                folio="PORTFOLIO II"
              />
              <div className="mb-10 sm:mb-14">
                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                  01 / SERVICES
                </div>
                <h2
                  id="services-heading"
                  className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[18ch]"
                >
                  Four ways we work with people who publish, sell, and write.
                </h2>
              </div>

              <div>
                {services.map((s) => (
                  <ServiceRow key={s.n} s={s} />
                ))}
              </div>

              <p className="mt-10 sm:mt-12 text-[14px] leading-[1.7] max-w-prose opacity-80">
                Engagements typically run 6–14 weeks. We work with a small number of clients
                at a time and turn down briefs when we are not the right fit. The queue is real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 01½ / PROCESS */}
      <section id="process" className="rule-b" aria-labelledby="process-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
            <MarginRail
              sectionNum="01½"
              sectionLabel="OUR METHODOLOGY · BRIEF TO HANDOVER"
              folio="PORTFOLIO II½"
              note="Six disciplined stages. The scope adapts to your challenge; the rigor remains invariant."
            />

            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip
                sectionNum="01½"
                sectionLabel="OUR METHODOLOGY · BRIEF TO HANDOVER"
                folio="PORTFOLIO II½"
              />
              <div className="mb-10 sm:mb-14">
                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                  01½ / PROCESS &amp; METHODOLOGY
                </div>
                <h2
                  id="process-heading"
                  className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[18ch]"
                >
                  Six stages. No surprises.
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {processSteps.map((s) => (
                  <ProcessStep key={s.n} s={s} />
                ))}
              </div>

              <div className="mt-12 border-t border-black/20 pt-6">
                <p className="text-[14px] leading-[1.7] max-w-prose opacity-85">
                  <strong>Adaptive Delivery:</strong> THE OFFICE adapts this methodology based on project requirements.
                  A targeted manuscript acquisition sprint moves with four-week velocity; an archival automation or digital flagship
                  follows disciplined iterative milestones. In every case: the principal on your kickoff call is the person doing the work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 / SELECTED WORK */}
      <section id="work" className="rule-b" aria-labelledby="work-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
            <MarginRail
              sectionNum="02"
              sectionLabel="SELECTED WORK, 2024–2026"
              folio="PORTFOLIO III"
              note="Representative case studies. Identifying client names generalized under confidentiality agreements."
            />

            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip
                sectionNum="02"
                sectionLabel="SELECTED WORK, 2024–2026"
                folio="PORTFOLIO III"
              />
              <div className="mb-10 sm:mb-14">
                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-3">
                  02 / SELECTED WORK
                </div>
                <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-70 mb-5">
                  Verified deliverables · Outcomes, not adjectives
                </div>
                <h2
                  id="work-heading"
                  className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[22ch]"
                >
                  Selected engagements. Clear outcomes.
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {projects.map((p, i) => (
                  <ProjectCard key={p.n} p={p} large={i === 0} />
                ))}
              </div>

              {/* Featured Case Study — Real Deliverable */}
              <div className="mt-8 border border-black p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-60">
                    Featured Deliverable Case Study
                  </div>
                  <div className="font-mono text-[11px] tracking-mono opacity-70">
                    P/050 · 2026 AUDIT
                  </div>
                </div>

                <h3 className="font-display text-[24px] sm:text-[32px] tracking-display leading-[1.05] mb-3">
                  Amazon SEO Performance &amp; Discoverability Report
                </h3>
                <p className="text-[15px] leading-[1.6] opacity-85 max-w-prose mb-8">
                  Two backlist titles. Eight weeks. Two grade tiers. A complete audit deliverable showcasing
                  A9 algorithm grade tracking, visibility metric movement, competitive backlink analysis, and
                  actionable publishing next steps.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="border border-black/20 p-4">
                    <div className="font-mono text-[10px] tracking-mono uppercase opacity-60 mb-2">
                      Grade Movement
                    </div>
                    <div className="font-display text-[28px] sm:text-[36px] tracking-display leading-none">
                      E → C
                    </div>
                    <div className="font-mono text-[11px] tracking-mono opacity-70 mt-1">
                      and D → B
                    </div>
                  </div>
                  <div className="border border-black/20 p-4">
                    <div className="font-mono text-[10px] tracking-mono uppercase opacity-60 mb-2">
                      Performance Gain
                    </div>
                    <div className="font-display text-[28px] sm:text-[36px] tracking-display leading-none">
                      +45 pts
                    </div>
                    <div className="font-mono text-[11px] tracking-mono opacity-70 mt-1">
                      visibility +43 pts
                    </div>
                  </div>
                  <div className="border border-black/20 p-4">
                    <div className="font-mono text-[10px] tracking-mono uppercase opacity-60 mb-2">
                      Backlinking
                    </div>
                    <div className="font-display text-[28px] sm:text-[36px] tracking-display leading-none">
                      12 → 27
                    </div>
                    <div className="font-mono text-[11px] tracking-mono opacity-70 mt-1">
                      more than doubled
                    </div>
                  </div>
                </div>

                <a
                  href="/downloads/amazon-seo-sample-report.pdf"
                  download="Amazon-SEO-Sample-Report-The-Office.pdf"
                  className="inline-flex items-center gap-3 bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors"
                >
                  <span>↓ Download the full report (PDF)</span>
                  <span className="opacity-60 text-[10px]">13 PAGES · REAL AUDIT</span>
                </a>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 border-t border-black pt-6">
                <p className="text-[14px] leading-[1.65] opacity-80 max-w-prose">
                  A comprehensive private portfolio — including before/after comp architectures, proposal pitch decks,
                  and custom workflow demonstrations — is available upon request under NDA.
                </p>
                <a
                  href="#contact"
                  className="font-mono text-[12px] tracking-mono font-semibold underline opacity-80 hover:opacity-100 shrink-0"
                >
                  REQUEST THE FULL PORTFOLIO →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02¼ / WHY THE OFFICE (PHASE 7) */}
      <section id="why-us" className="rule-b" aria-labelledby="why-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
            <MarginRail
              sectionNum="02¼"
              sectionLabel="WHY THE OFFICE · STUDIO POSITIONING"
              folio="PORTFOLIO III¼"
              note="We are not a volume agency. We deliberately cap our practice to protect depth, craft, and direct principal delivery."
            />

            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip
                sectionNum="02¼"
                sectionLabel="WHY THE OFFICE · STUDIO POSITIONING"
                folio="PORTFOLIO III¼"
              />
              <div className="mb-10 sm:mb-14">
                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                  02¼ / WHY THE OFFICE
                </div>
                <h2
                  id="why-heading"
                  className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[20ch]"
                >
                  Five commitments. No generic agency theater.
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {whyUsPillars.map((p) => (
                  <WhyUsItem key={p.n} pillar={p} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02½ / FIELD NOTES */}
      <section id="notes" className="rule-b" aria-labelledby="notes-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
            <MarginRail
              sectionNum="02½"
              sectionLabel="NOTES ON PUBLISHING, CRAFT, AND SEARCH"
              folio="PORTFOLIO III½"
              note="Short intellectual essays on category theory, author websites, and algorithmic discoverability."
            />

            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip
                sectionNum="02½"
                sectionLabel="NOTES ON PUBLISHING, CRAFT, AND SEARCH"
                folio="PORTFOLIO III½"
              />
              <div className="mb-10 sm:mb-14">
                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                  02½ / FIELD NOTES &amp; ESSAYS
                </div>
                <h2
                  id="notes-heading"
                  className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[18ch]"
                >
                  We write about what we do.
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {notesData.map((note) => (
                  <NoteCard key={note.slug} note={note} />
                ))}
              </div>

              <div className="mt-10 border-t border-black pt-6 flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-mono opacity-60">
                  ESSAYS ON BOOK STRATEGY, SEARCH SYSTEMS &amp; DIGITAL CRAFT
                </span>
                <a
                  href="/notes"
                  className="font-mono text-[12px] tracking-mono font-semibold underline opacity-80 hover:opacity-100"
                >
                  READ COMPLETE ESSAY ARCHIVE →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 / ABOUT & TEAM */}
      <section id="about" className="rule-b" aria-labelledby="about-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
            <MarginRail
              sectionNum="03"
              sectionLabel="FOUR PRINCIPALS. ONE STUDIO."
              folio="PORTFOLIO IV"
              note="The person on your kickoff call is the person doing the work. No junior handoffs. No subcontractors."
            />

            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip
                sectionNum="03"
                sectionLabel="FOUR PRINCIPALS. ONE STUDIO."
                folio="PORTFOLIO IV"
              />
              <div className="mb-10 sm:mb-14">
                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                  03 / ABOUT THE STUDIO
                </div>
                <h2
                  id="about-heading"
                  className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[18ch]"
                >
                  A studio of four, by design.
                </h2>
              </div>

              <div className="grid grid-cols-12 gap-x-6 gap-y-8">
                <p className="col-span-12 lg:col-span-6 text-[16px] sm:text-[17px] leading-[1.65]">
                  THE&nbsp;OFFICE was established in 2021 by two trade editors and an engineer who
                  spent the previous decade inside publishing houses, literary agencies, and technical
                  product teams. We were tired of the standard brief: <em>make it louder</em>.
                </p>
                <p className="col-span-12 lg:col-span-6 text-[16px] sm:text-[17px] leading-[1.65]">
                  We took a different bet — that the hardest challenges in publishing and creative businesses
                  are craft problems, not volume problems. Position the book with precision, and the market
                  responds. Build the website like fine editorial typography, and reader trust follows. Write
                  the automation to eliminate operational toil, and your team gets their creative week back.
                </p>
              </div>

              {/* PRINCIPLES */}
              <div className="mt-14 sm:mt-20">
                <div className="mb-8 flex items-baseline justify-between border-b border-black pb-3">
                  <div className="font-mono text-[11px] tracking-mono opacity-60">
                    STUDIO PRINCIPLES
                  </div>
                  <div className="font-mono text-[11px] tracking-mono opacity-60">
                    FOUR RIGORS
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {principles.map((p) => (
                    <div key={p.k} className="flex flex-col gap-2">
                      <div className="font-display text-[18px] tracking-display font-medium">
                        {p.k}
                      </div>
                      <p className="text-[13.5px] leading-[1.6] opacity-80">
                        {p.v}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* THE FOUR PRINCIPALS */}
              <div className="mt-14 sm:mt-20">
                <div className="mb-8 flex items-baseline justify-between border-b border-black pb-3">
                  <div className="font-mono text-[11px] tracking-mono opacity-60">
                    PRACTICE LEADERSHIP
                  </div>
                  <div className="font-mono text-[11px] tracking-mono opacity-60">
                    THE FOUR
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {team.map((member) => (
                    <TeamMember key={member.name} member={member} />
                  ))}
                </div>
              </div>

              {/* WORKING PHILOSOPHY (PHASE 9) */}
              <div className="mt-14 sm:mt-20">
                <div className="mb-8 flex items-baseline justify-between border-b border-black pb-3">
                  <div className="font-mono text-[11px] tracking-mono opacity-60">
                    WORKING PHILOSOPHY · TRANSPARENCY
                  </div>
                  <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-60">
                    Our studio pledge to every client
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {philosophyCommitments.map((item) => (
                    <div
                      key={item.k}
                      className="flex flex-col gap-3 border-t border-black pt-5"
                    >
                      <h4 className="font-display text-[18px] sm:text-[20px] tracking-display leading-[1.2]">
                        {item.k}
                      </h4>
                      <p className="text-[13.5px] leading-[1.65] opacity-85">
                        {item.v}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03½ / FAQ */}
      <section id="faq" className="rule-b" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
            <MarginRail
              sectionNum="03½"
              sectionLabel="FREQUENTLY ASKED QUESTIONS"
              folio="PORTFOLIO IV½"
              note="Clear answers to common questions about scoping, pricing, and our engagement rhythm."
            />

            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip
                sectionNum="03½"
                sectionLabel="FREQUENTLY ASKED QUESTIONS"
                folio="PORTFOLIO IV½"
              />
              <div className="mb-10 sm:mb-14">
                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                  03½ / FAQ
                </div>
                <h2
                  id="faq-heading"
                  className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[18ch]"
                >
                  Is this for you?
                </h2>
              </div>

              <div className="max-w-3xl">
                {faqs.map((faq) => (
                  <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 / CONTACT INTAKE */}
      <section
        id="contact"
        className="rule-b bg-black text-white"
        aria-labelledby="contact-heading"
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
            <MarginRail
              sectionNum="04"
              sectionLabel="INITIATE A BRIEF"
              folio="PORTFOLIO V"
              inverse
              note="Tell us what you are actually trying to achieve. We read every line personally."
            />

            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip
                sectionNum="04"
                sectionLabel="INITIATE A BRIEF"
                folio="PORTFOLIO V"
                inverse
              />
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                04 / CONTACT &amp; INTAKE
              </div>
              <h2
                id="contact-heading"
                className="font-display tracking-display text-[40px] sm:text-[60px] lg:text-[84px] leading-[0.95] font-light max-w-[16ch]"
              >
                Send us the
                <br />
                <span className="italic">actual</span> brief.
              </h2>
              <p className="mt-6 max-w-prose text-[16px] leading-[1.65] opacity-85">
                No form-filling if you would rather write directly. Email works too — we read every note.
                For new engagements, please include your timeline, target scope, and the concrete goal you
                are trying to realize.
              </p>

              <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-10">
                <div className="col-span-12 lg:col-span-4">
                  <div className="font-mono text-[11px] tracking-mono opacity-60 mb-3">
                    DIRECT EMAIL
                  </div>
                  <a
                    href="mailto:theofficetechies@gmail.com"
                    className="block font-display text-[22px] sm:text-[26px] tracking-display leading-tight border-b border-white/40 pb-2 hover:border-white transition-colors"
                  >
                    theofficetechies@gmail.com
                  </a>

                  <div className="mt-8 font-mono text-[11px] tracking-mono opacity-60">
                    REPLY WINDOW
                  </div>
                  <div className="mt-2 text-[14px] leading-[1.6] opacity-85">
                    MON–THU · WITHIN 2 WORKING DAYS
                  </div>

                  <div className="mt-8 font-mono text-[11px] tracking-mono opacity-60">
                    STUDIO BASES
                  </div>
                  <div className="mt-2 text-[14px] leading-[1.6] opacity-85">
                    LISBON · NEW YORK · REMOTE WORLDWIDE
                  </div>
                </div>

                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter />
      <CookieNotice />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Site Footer                                                        */
/* ------------------------------------------------------------------ */

function SiteFooter() {
  return (
    <footer className="border-t border-white/20 bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 mb-12">
          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <div className="font-display text-[22px] tracking-display font-semibold mb-3">
              THE&nbsp;OFFICE
              <span className="font-mono text-[10px] tracking-mono align-top ml-1 opacity-60">
                ®
              </span>
            </div>
            <p className="text-[14px] leading-[1.65] opacity-70 max-w-sm">
              An independent creative technology studio for authors, publishers, and literary businesses.
              Four principals. Lisbon &amp; New York. Est. 2021.
            </p>
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
              PRACTICES
            </div>
            <ul className="space-y-2 font-mono text-[12px] tracking-mono opacity-80">
              <li>
                <a href="#services" className="hover:opacity-100">
                  Book Strategy
                </a>
              </li>
              <li>
                <a href="#services" className="hover:opacity-100">
                  Web Design
                </a>
              </li>
              <li>
                <a href="#services" className="hover:opacity-100">
                  Automation
                </a>
              </li>
              <li>
                <a href="#services" className="hover:opacity-100">
                  Book Research
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
              STUDIO
            </div>
            <ul className="space-y-2 font-mono text-[12px] tracking-mono opacity-80">
              <li>
                <a href="#process" className="hover:opacity-100">
                  Approach
                </a>
              </li>
              <li>
                <a href="#work" className="hover:opacity-100">
                  Selected Work
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:opacity-100">
                  Why Us
                </a>
              </li>
              <li>
                <a href="#about" className="hover:opacity-100">
                  Team &amp; Ethos
                </a>
              </li>
              <li>
                <a href="/notes" className="hover:opacity-100">
                  Field Notes
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
              INQUIRIES
            </div>
            <p className="text-[14px] leading-[1.65] opacity-70 mb-4">
              We review every brief personally and reply within two working days.
            </p>
            <a
              href="mailto:theofficetechies@gmail.com"
              className="inline-block font-mono text-[12px] tracking-mono underline opacity-90 hover:opacity-100"
            >
              theofficetechies@gmail.com →
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] tracking-mono opacity-70">
          <div>
            © {new Date().getFullYear()} THE OFFICE STUDIO. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <a href="/privacy" className="hover:opacity-100 underline-offset-2 hover:underline">
              PRIVACY
            </a>
            <a href="/terms" className="hover:opacity-100 underline-offset-2 hover:underline">
              TERMS
            </a>
            <a href="/notes" className="hover:opacity-100 underline-offset-2 hover:underline">
              NOTES
            </a>
            <a href="#top" className="hover:opacity-100 underline-offset-2 hover:underline">
              TOP ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Cookie Notice                                                      */
/* ------------------------------------------------------------------ */

function CookieNotice() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem("the-office:cookie-dismissed") === "1";
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  function dismiss() {
    try {
      localStorage.setItem("the-office:cookie-dismissed", "1");
    } catch {
      // LocalStorage fallback
    }
    setDismissed(true);
  }

  return (
    <aside
      aria-label="Privacy notice"
      className="fixed bottom-0 inset-x-0 z-40 bg-black text-white border-t border-white/20 p-4 font-mono text-[11px] tracking-mono"
    >
      <div className="mx-auto max-w-[1400px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="opacity-80 max-w-prose">
          We use minimal analytics to understand traffic patterns. No surveillance, no ad networks, no third-party trackers.
        </p>
        <button
          onClick={dismiss}
          className="underline uppercase font-semibold hover:opacity-60 cursor-pointer shrink-0"
        >
          DISMISS [×]
        </button>
      </div>
    </aside>
  );
}
