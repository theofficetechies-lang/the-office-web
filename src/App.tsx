import { useEffect, useRef, useState } from "react";
import ManifestBar from "./components/ManifestBar";
import MarginRail from "./components/MarginRail";
import MobileFolioStrip from "./components/MobileFolioStrip";
import Typewriter from "./components/Typewriter";
import ToastContainer from "./components/Toast";
import { submitBrief, ApiError } from "./lib/api";
import { useToast } from "./hooks/useToast";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const services = [
  {
    n: "01",
    title: "Book Strategist",
    blurb:
      "Positioning, audience, and go-to-market for authors and independent publishers. We work the problem before the cover does — the proposal, the comp set, the pitch deck, the launch sequence.",
    deliverables: [
      "Positioning & audience model",
      "Comp title analysis",
      "Pitch & proposal writing",
      "Launch architecture",
    ],
  },
  {
    n: "02",
    title: "Web Design",
    blurb:
      "We build sites. Not decorate templates. Strategy, information architecture, copy, and a custom front-end — usually on a stack you'll actually own in five years.",
    deliverables: [
      "Strategy & IA",
      "Editorial copywriting",
      "Custom front-end build",
      "CMS you control",
    ],
  },
  {
    n: "03",
    title: "Bot Making",
    blurb:
      "Custom automation and conversational systems. Internal tools that replace a hundred spreadsheets, reader-facing assistants that know a back-catalogue, agents that do the boring half of your week.",
    deliverables: [
      "Workflow automation",
      "Conversational agents",
      "RAG over your archive",
      "Integrations & glue",
    ],
  },
  {
    n: "04",
    title: "Book Research & Analysis",
    blurb:
      "Research teams for literary, competitive, and market intelligence. Annotated reading lists, market maps, manuscript due diligence, the kind of work a publisher used to keep an entire assistant doing.",
    deliverables: [
      "Annotated bibliographies",
      "Market maps",
      "Manuscript due diligence",
      "Trend reports",
    ],
  },
];

const projects = [
  {
    n: "P/014",
    sector: "Independent publishing",
    title: "Repositioning a debut literary novel for a US trade house",
    outcome:
      "Re-pitched from a quiet register to a contemporary social novel. Acquired quickly; led the publisher's spring list.",
    stack: ["Positioning", "Comp set", "Pitch deck"],
    year: "2025",
  },
  {
    n: "P/021",
    sector: "Architecture practice",
    title: "An editorial site replacing a template the studio had outgrown",
    outcome:
      "Custom front-end build. Project pages read as case studies. Longer time-on-site; more qualified inbound enquiries.",
    stack: ["IA", "Editorial copy", "Custom build"],
    year: "2025",
  },
  {
    n: "P/029",
    sector: "Literary agency",
    title: "A reader-facing assistant that knows a backlist in depth",
    outcome:
      "Conversational system over the agency's catalogue. Submissions team reclaims hours each week; readers get a concierge, not a search box.",
    stack: ["RAG", "Agent design", "Eval"],
    year: "2025",
  },
  {
    n: "P/033",
    sector: "Author · nonfiction",
    title: "A multi-month reading programme and market map for a second book",
    outcome:
      "An annotated bibliography, several competitor maps, and a positioning brief the author took to her agent.",
    stack: ["Research", "Analysis", "Brief"],
    year: "2024",
  },
  {
    n: "P/038",
    sector: "Boutique press",
    title: "An internal assistant that triages foreign-rights submissions",
    outcome:
      "Replaces a multi-hour weekly triage. Now minutes of human review on flagged items only.",
    stack: ["Automation", "LLM eval", "Slack"],
    year: "2024",
  },
  {
    n: "P/042",
    sector: "Memoirist",
    title: "Launch architecture for a memoir entering a crowded market",
    outcome:
      "A six-week pre-publication plan: op-ed placement, podcast shortlist, an unusual retail partnership. Hit a national advice list week one.",
    stack: ["Strategy", "PR", "Partnerships"],
    year: "2024",
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

const testimonials = [
  {
    quote:
      "They re-pitched a book that had been told it was 'not commercial' and the publisher acquired it inside two weeks. We are still a little annoyed we did not hire them sooner.",
    role: "Author, two-time longlist nominee",
  },
  {
    quote:
      "It is the only studio we have worked with that has ever argued with us and been right. The site is the second-best thing they did for us.",
    role: "Director, independent press",
  },
  {
    quote:
      "Their research team replaced a process we had been paying two assistants to do badly. We now pay one team to do it well.",
    role: "Literary agent",
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
    // Never let analytics break the page.
  }
}

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */

function ServiceRow({ s }: { s: (typeof services)[number] }) {
  return (
    <article className="grid grid-cols-12 gap-x-6 py-10 sm:py-12 border-t border-black/90 first:border-t-0">
      <div className="col-span-12 sm:col-span-3 mb-3 sm:mb-0">
        <div className="font-mono text-xs tracking-mono opacity-60 mb-2">
          {s.n} / SERVICE
        </div>
        <h3 className="font-display text-2xl sm:text-3xl tracking-display leading-[1.05]">
          {s.title}
        </h3>
      </div>
      <div className="col-span-12 sm:col-span-6">
        <p className="text-[15.5px] leading-[1.65] max-w-prose">{s.blurb}</p>
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
          "font-display tracking-display leading-[1.05] mb-5",
          large ? "text-2xl sm:text-[28px]" : "text-[20px] sm:text-[22px]",
        ].join(" ")}
      >
        {p.title}
      </h3>

      <p className="text-[14px] leading-[1.6] mb-6 flex-1">{p.outcome}</p>

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
/* Contact form — production grade (A2 + B5)                           */
/* ------------------------------------------------------------------ */

type FormState = "idle" | "submitting" | "sent" | "error";

function ContactForm() {
  const { addToast } = useToast();
  const [status, setStatus] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const next: Record<string, string> = {};
    const name = (data.get("name") as string)?.trim() ?? "";
    const email = (data.get("email") as string)?.trim() ?? "";
    const brief = (data.get("brief") as string)?.trim() ?? "";
    const hp = (data.get("company_website") as string)?.trim() ?? "";

    if (hp) {
      return { ok: false, honeypot: true, errors: next };
    }
    if (!name) next.name = "REQUIRED FIELD";
    if (!email) next.email = "REQUIRED FIELD";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "NOT A VALID EMAIL";
    if (!brief) next.brief = "REQUIRED FIELD";
    else if (brief.length < 20) next.brief = "A FEW MORE LINES, PLEASE";
    return { ok: Object.keys(next).length === 0, honeypot: false, errors: next };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    const form = e.currentTarget as HTMLFormElement;
    const result = validate(form);
    setErrors(result.errors);
    if (!result.ok) {
      if (!result.honeypot) {
        setStatus("error");
        setErrorMsg("FIX THE FIELDS MARKED BELOW");
        addToast("Please fix the form errors before submitting.", "error");
      }
      return;
    }
    setStatus("submitting");
    setErrorMsg("");

    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      org: String(data.get("org") ?? ""),
      service: String(data.get("service") ?? ""),
      brief: String(data.get("brief") ?? ""),
      company_website: String(data.get("company_website") ?? ""),
    };

    try {
      const response = await submitBrief(payload);
      setStatus("sent");
      track("brief_submitted", { service: payload.service });
      addToast(response.message ?? "Brief received. We reply within two working days.", "success");
      form.reset();
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      let message = "Something went wrong. Please try again or email us directly.";

      if (err instanceof ApiError) {
        if (err.status === 429) {
          message = "Too many attempts. Please wait 15 minutes before trying again.";
        } else if (err.status === 400 && err.issues) {
          const fieldErrors: Record<string, string> = {};
          err.issues.forEach((issue) => {
            fieldErrors[issue.path] = issue.message.toUpperCase();
          });
          setErrors(fieldErrors);
          message = "Please correct the fields marked below.";
        } else if (err.status === 502) {
          message = err.message;
        } else {
          message = err.message;
        }
      }

      setStatus("error");
      setErrorMsg(message.toUpperCase());
      addToast(message, "error");

      // Ultimate fallback: if the network is completely down, open mailto
      if (err instanceof ApiError && err.status >= 500) {
        const subject = encodeURIComponent(
          `Brief from ${payload.name} — ${payload.service || "THE OFFICE"}`
        );
        const body = encodeURIComponent(
          `Name: ${payload.name}\nEmail: ${payload.email}\nOrg: ${payload.org}\nService: ${payload.service}\n\n—\n\n${payload.brief}\n\n—\n(Form delivery failed; this email is a fallback. Please reply to confirm receipt.)`
        );
        window.location.href = `mailto:hello@theoffice.studio?subject=${subject}&body=${body}`;
      }
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
        error={errors.name}
      />
      <Field
        id="email"
        label="EMAIL"
        type="email"
        autoComplete="email"
        required
        error={errors.email}
      />
      <Field
        id="org"
        label="COMPANY / PUBLISHER / NONE"
        type="text"
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
          defaultValue=""
          className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-[15px] outline-none"
        >
          <option value="" disabled className="text-black">
            Select one
          </option>
          <option value="book-strategist" className="text-black">
            Book Strategist
          </option>
          <option value="web-design" className="text-black">
            Web Design
          </option>
          <option value="bot-making" className="text-black">
            Bot Making
          </option>
          <option value="book-research" className="text-black">
            Book Research &amp; Analysis
          </option>
          <option value="not-sure" className="text-black">
            Not sure yet
          </option>
        </select>
        {errors.service && <ErrLine>{errors.service}</ErrLine>}
      </div>
      <div className="col-span-2">
        <label
          htmlFor="brief"
          className="block font-mono text-[11px] tracking-mono opacity-60 mb-2"
        >
          THE BRIEF
        </label>
        <textarea
          id="brief"
          name="brief"
          required
          rows={5}
          placeholder="What you are trying to make happen. A timeline. A budget range. The thing that keeps you up at night about it."
          className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-[15px] outline-none resize-none placeholder:opacity-40"
        />
        {errors.brief && <ErrLine>{errors.brief}</ErrLine>}
      </div>

      {/* B5 honeypot */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label htmlFor="company_website">Company website (leave blank)</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <p
          className="text-[12px] opacity-60 font-mono tracking-mono max-w-[36ch]"
          aria-live="polite"
        >
          {status === "error" && errorMsg
            ? errorMsg
            : status === "sent"
              ? "RECEIVED. WE REPLY WITHIN TWO WORKING DAYS."
              : "WE REPLY WITHIN TWO WORKING DAYS. WE TURN DOWN BRIEFS WHEN WE ARE NOT THE RIGHT FIT."}
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-white text-black px-5 py-3 font-mono text-[12px] tracking-mono font-semibold border border-white hover:bg-transparent hover:text-white transition-colors disabled:opacity-60 disabled:cursor-wait"
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
    </form>
  );
}

function Field({
  id,
  label,
  type,
  required,
  autoComplete,
  error,
}: {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div className="col-span-2 sm:col-span-1">
      <label
        htmlFor={id}
        className="block font-mono text-[11px] tracking-mono opacity-60 mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        required={required}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className="w-full bg-transparent border-b border-white/50 focus:border-white py-2 text-[15px] outline-none"
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
      className="mt-1.5 font-mono text-[10.5px] tracking-mono text-white"
    >
      ↑ {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll-reveal hook                                                  */
/* ------------------------------------------------------------------ */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ------------------------------------------------------------------ */
/* 404 page                                                            */
/* ------------------------------------------------------------------ */

function NotFound() {
  return (
    <main
      id="top"
      className="min-h-[70vh] flex items-center"
      aria-labelledby="nf-heading"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 w-full py-20">
        <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10">
          <MarginRail
            sectionNum="∅"
            sectionLabel="THIS FOLIO IS NOT IN THE ARCHIVE"
            folio="FOLIO NULL"
            note="The page you asked for has been moved, renamed, or never existed."
          />
          <div className="col-span-12 lg:col-span-10">
            <MobileFolioStrip
              sectionNum="∅"
              sectionLabel="FOLIO NOT FOUND"
              folio="—"
            />
            <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
              ERR / 404
            </div>
            <h1
              id="nf-heading"
              className="font-display tracking-display-tight text-[56px] sm:text-[88px] lg:text-[128px] leading-[0.95] font-light"
            >
              FOLIO not found.
            </h1>
            <p className="mt-8 max-w-prose text-[16px] leading-[1.6]">
              The page you tried to reach is not in the archive. It may have
              been moved, or the link may be misprinted. The shortest way
              back is the front door, or a direct note to the studio.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#top"
                className="border border-black px-4 py-2.5 font-mono text-[12px] tracking-mono font-semibold hover:bg-black hover:text-white transition-colors"
              >
                ← FRONT DOOR
              </a>
              <a
                href="mailto:hello@theoffice.studio?subject=Broken%20link%20on%20theoffice.studio"
                className="font-mono text-[12px] tracking-mono font-semibold border-b border-black self-center"
              >
                REPORT A BROKEN LINK →
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  useReveal();
  const [heroDone, setHeroDone] = useState(false);

  const [route, setRoute] = useState<string>(() =>
    typeof window === "undefined" ? "/" : window.location.pathname || "/"
  );
  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname || "/");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  if (route !== "/" && route !== "") {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col">
        <ManifestBar />
        <NotFound />
        <SiteFooter />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <ManifestBar />

      {/* HEADER / NAV */}
      <header className="rule-b">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-4 flex items-center gap-6">
          <a
            href="#top"
            className="font-display text-[20px] sm:text-[22px] tracking-display-tight font-semibold"
            aria-label="THE OFFICE — home"
          >
            THE&nbsp;OFFICE
            <span className="font-mono text-[10px] tracking-mono align-top ml-1 opacity-60">
              ®
            </span>
          </a>

          <nav
            className="ml-auto hidden md:flex items-center gap-7 font-mono text-[12px] tracking-mono"
            aria-label="Primary"
          >
            <a href="#services" className="hover:opacity-60">SERVICES</a>
            <a href="#work" className="hover:opacity-60">WORK</a>
            <a href="#about" className="hover:opacity-60">ABOUT</a>
            <a href="#contact" className="hover:opacity-60">CONTACT</a>
            <a
              href="#contact"
              className="ink-block px-3 py-1.5 font-semibold"
            >
              START A BRIEF →
            </a>
          </nav>

          <a
            href="#contact"
            className="md:hidden ml-auto ink-block px-3 py-1.5 font-mono text-[11px] tracking-mono font-semibold"
          >
            BRIEF →
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="rule-b" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-10 sm:py-16 lg:py-24">
            <MarginRail
              sectionNum="00"
              sectionLabel="THE OFFICE / A STUDIO FOR BOOKS, WEB, BOTS, AND RESEARCH"
              folio="FOLIO I"
              note="If you are reading this, the manifest bar above is real time. It is also the only animation on this page."
            />

            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip
                sectionNum="00"
                sectionLabel="A STUDIO FOR BOOKS, WEB, BOTS, AND RESEARCH"
                folio="FOLIO I"
              />
              <div className="font-mono text-[11px] sm:text-[12px] tracking-mono opacity-70 mb-6 sm:mb-10">
                <span className="opacity-60">A SMALL STUDIO. </span>
                <span>FOUR PEOPLE. </span>
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
                site, and the bot.
              </h1>

              <div className="mt-10 sm:mt-14 grid grid-cols-12 gap-x-6 gap-y-8">
                <p className="col-span-12 lg:col-span-7 text-[16.5px] sm:text-[18px] leading-[1.6] max-w-prose">
                  THE&nbsp;OFFICE is a four-person studio for authors,
                  publishers, and the people who run literary businesses. We
                  write the positioning, build the site, ship the automation,
                  and run the research. We do not pitch, decorate, or staff
                  your project with juniors.
                </p>

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
                  <a
                    href="#contact"
                    className={[
                      "mt-2 inline-flex items-center gap-2 self-start",
                      "border border-black px-4 py-2.5",
                      "font-mono text-[12px] tracking-mono font-semibold",
                      "transition-colors duration-200",
                      "hover:bg-black hover:text-white",
                      "focus-visible:bg-black focus-visible:text-white",
                      heroDone ? "opacity-100" : "opacity-0 pointer-events-none",
                    ].join(" ")}
                  >
                    SEND A BRIEF →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="rule-b"
        aria-labelledby="services-heading"
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
            <MarginRail
              sectionNum="01"
              sectionLabel="FOUR SERVICES. ONE STUDIO."
              folio="FOLIO II"
              note="These are not packages. We scope each engagement against the brief."
            />

            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip
                sectionNum="01"
                sectionLabel="FOUR SERVICES. ONE STUDIO."
                folio="FOLIO II"
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
                Engagements typically run 6–14 weeks. We work with a small
                number of clients at a time and turn down more than we take.
                The waiting list is real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="rule-b" aria-labelledby="work-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
            <MarginRail
              sectionNum="02"
              sectionLabel="SELECTED WORK, 2024–2025"
              folio="FOLIO III"
              note="A3 / B7: details altered or generalised to protect client confidentiality. Real case studies available on request under NDA."
            />

            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip
                sectionNum="02"
                sectionLabel="SELECTED WORK, 2024–2025"
                folio="FOLIO III"
              />
              <div className="mb-10 sm:mb-14">
                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-3">
                  02 / WORK
                </div>
                <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-70 mb-5">
                  Illustrative · Names &amp; specifics generalised
                </div>
                <h2
                  id="work-heading"
                  className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[22ch]"
                >
                  Selected work. Outcomes, not adjectives.
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {projects.map((p, i) => (
                  <ProjectCard key={p.n} p={p} large={i === 0} />
                ))}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <p className="text-[14px] leading-[1.7] max-w-prose opacity-80">
                  A longer portfolio — including before/after comps and
                  launch decks — is available on request under NDA.
                </p>
                <a
                  href="#contact"
                  className="font-mono text-[12px] tracking-mono font-semibold border-b border-black self-start sm:self-auto"
                >
                  REQUEST THE FULL BOOK →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="rule-b" aria-labelledby="about-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
            <MarginRail
              sectionNum="03"
              sectionLabel="FOUR PEOPLE. ONE STUDIO."
              folio="FOLIO IV"
              note="No headshots. No founding myth. Just the work and a way to reach us."
            />

            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip
                sectionNum="03"
                sectionLabel="FOUR PEOPLE. ONE STUDIO."
                folio="FOLIO IV"
              />
              <div className="mb-10 sm:mb-14">
                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                  03 / ABOUT
                </div>
                <h2
                  id="about-heading"
                  className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[20ch]"
                >
                  A studio of four, by design.
                </h2>
              </div>

              <div className="grid grid-cols-12 gap-x-6 gap-y-8">
                <div className="col-span-12 lg:col-span-7 space-y-6 text-[16.5px] leading-[1.7]">
                  <p>
                    THE OFFICE was started in 2021 by two editors and an
                    engineer who had spent the previous decade working inside
                    publishing houses, literary agencies, and product teams.
                    We were tired of the same brief: <em>make it louder</em>.
                  </p>
                  <p>
                    We took a different bet — that the work in publishing and
                    adjacent fields is mostly a craft problem, not a
                    marketing one. Position the book correctly and the rest
                    of the job gets easier. Build the site like a piece of
                    editorial design and the conversion takes care of
                    itself. Write the bot to do the boring half of the job
                    and the human team gets their week back.
                  </p>
                  <p>
                    We are four. We do not subcontract, do not staff with
                    juniors, and do not put our name on work we did not do.
                    The person on the kickoff call is the person writing the
                    brief.
                  </p>
                </div>

                <div className="col-span-12 lg:col-span-4 lg:col-start-9">
                  <div className="border border-black p-6">
                    <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                      PRINCIPLES / 4
                    </div>
                    <dl className="space-y-5">
                      {principles.map((p) => (
                        <div key={p.k}>
                          <dt className="font-display text-[18px] tracking-display leading-tight mb-1">
                            {p.k}
                          </dt>
                          <dd className="text-[13.5px] leading-[1.55] opacity-85">
                            {p.v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>

              <div className="mt-16 sm:mt-20">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3 mb-6">
                  <div className="font-mono text-[11px] tracking-mono opacity-60">
                    ON THE RECORD
                  </div>
                  <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-60">
                    Illustrative · composite from past engagements
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {testimonials.map((t) => (
                    <figure
                      key={t.role}
                      className="flex flex-col gap-4 border-t border-black pt-5"
                    >
                      <blockquote className="font-display text-[19px] sm:text-[20px] tracking-display leading-[1.35]">
                        “{t.quote}”
                      </blockquote>
                      <figcaption className="font-mono text-[11px] tracking-mono opacity-70 mt-auto">
                        — {t.role}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="bg-black text-white"
        aria-labelledby="contact-heading"
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-16 sm:py-24">
            <aside
              className="hidden lg:flex flex-col text-[11px] font-mono tracking-mono opacity-70"
              aria-hidden="true"
            >
              <div className="sticky top-20 pt-2">
                <div className="rule-t border-white pt-3 mb-4">
                  <div>SEC.</div>
                  <div className="text-base font-semibold">04</div>
                </div>
                <div className="mb-6">
                  <div className="opacity-60 mb-1">FOLIO</div>
                  <div>FOLIO V</div>
                </div>
                <div className="mb-6">
                  <div className="opacity-60 mb-1">RUNNING HEAD</div>
                  <div className="leading-snug">START A BRIEF</div>
                </div>
                <div className="mb-6">
                  <div className="opacity-60 mb-1">MARGINALIA</div>
                  <div className="leading-snug">
                    We reply to every brief within two working days. If we
                    are not the right studio, we will say so and point you to
                    someone who is.
                  </div>
                </div>
              </div>
            </aside>

            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip
                sectionNum="04"
                sectionLabel="START A BRIEF"
                folio="FOLIO V"
                inverse
              />
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                04 / CONTACT
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
                No form-filling if you would rather write. Email works too —
                we read every line of it. For new engagements, please include
                a timeline, a budget range, and the thing you are actually
                trying to make happen.
              </p>

              <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-10">
                <div className="col-span-12 lg:col-span-4">
                  <div className="font-mono text-[11px] tracking-mono opacity-60 mb-3">
                    DIRECT
                  </div>
                  <a
                    href="mailto:hello@theoffice.studio"
                    className="block font-display text-[22px] sm:text-[26px] tracking-display leading-tight border-b border-white/40 pb-2 hover:border-white"
                  >
                    hello@theoffice.studio
                  </a>

                  <div className="mt-6 font-mono text-[11px] tracking-mono opacity-70 leading-[1.7]">
                    REPLY WINDOW
                    <br />
                    MON–THU · WITHIN 2 WORKING DAYS
                    <br />
                    <span className="opacity-60">
                      Detailed address withheld from this draft.
                    </span>
                  </div>
                </div>

                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
      <ToastContainer />
    </div>
  );
}

/* Shared footer */
function SiteFooter() {
  return (
    <footer className="border-t border-white/20 bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6 flex flex-col gap-3 font-mono text-[11px] tracking-mono opacity-80 sm:flex-row sm:items-center">
        <div>© {new Date().getFullYear()} THE OFFICE STUDIO.</div>
        <div className="hidden sm:block opacity-50">/</div>
        <nav aria-label="Legal" className="flex items-center gap-4">
          <a href="/privacy" className="hover:opacity-100 opacity-80 underline-offset-2 hover:underline">
            PRIVACY
          </a>
          <a href="/terms" className="hover:opacity-100 opacity-80 underline-offset-2 hover:underline">
            TERMS
          </a>
        </nav>
        <div className="sm:ml-auto flex flex-wrap items-center gap-3 sm:gap-5">
          <a href="#top" className="hover:opacity-100 opacity-80">
            BACK TO TOP ↑
          </a>
          <span className="opacity-40">SET IN FRAUNCES &amp; INTER TIGHT</span>
        </div>
      </div>
      <CookieNotice />
    </footer>
  );
}

function CookieNotice() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const flag = (window as unknown as { analyticsSetsCookies?: boolean })
      .analyticsSetsCookies;
    const dismissed =
      typeof localStorage !== "undefined" &&
      localStorage.getItem("to_cookie_dismissed") === "1";
    if (flag && !dismissed) setShow(true);
  }, []);
  if (!show) return null;
  function dismiss() {
    try {
      localStorage.setItem("to_cookie_dismissed", "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  }
  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="border-t border-white/20 bg-black text-white"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3 text-[11px] font-mono tracking-mono">
        <p className="opacity-90">
          This site sets analytics cookies. See the{" "}
          <a href="/privacy" className="underline">
            privacy notice
          </a>
          .
        </p>
        <button
          onClick={dismiss}
          className="sm:ml-auto border border-white px-3 py-1.5 font-semibold"
        >
          DISMISS
        </button>
      </div>
    </div>
  );
}
