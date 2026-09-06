import { useState } from "react";
import MarginRail from "./components/MarginRail";
import MobileFolioStrip from "./components/MobileFolioStrip";
import Typewriter from "./components/Typewriter";
import ToastContainer from "./components/Toast";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import SkipLink from "./components/SkipLink";
import BriefForm from "./components/BriefForm";
import FaqSection from "./components/sections/FaqSection";
import PricingSection from "./components/sections/PricingSection";
import ReviewsSection from "./components/sections/ReviewsSection";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import NotesPage from "./pages/NotesPage";
import NotePage from "./pages/NotePage";
import CaseStudyPage from "./pages/CaseStudyPage";
import ServicePage from "./pages/ServicePage";
import PressPage from "./pages/PressPage";
import GlossaryPage from "./pages/GlossaryPage";
import ChecklistPage from "./pages/ChecklistPage";
import MethodologyPage from "./pages/MethodologyPage";
import DemosPage from "./pages/DemosPage";
import StorePage from "./pages/StorePage";
import { useI18n } from "./lib/i18n";
import { routeKey, useRoute } from "./lib/router";
import { useDocumentMeta } from "./hooks/useDocumentMeta";
import { useReveal } from "./hooks/useReveal";
import { CONTACT_EMAIL } from "./lib/site";
import { services } from "./data/services";
import { projects, workNote } from "./data/projects";
import { processStages, processCaveat } from "./data/process";
import { whyThemes, commitments } from "./data/why";
import { team } from "./data/team";

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */

export default function App() {
  const route = useRoute();
  const key = routeKey(route);
  useReveal(key);

  switch (route.kind) {
    case "privacy":
      return <PrivacyPage />;
    case "terms":
      return <TermsPage />;
    case "notesIndex":
      return <NotesPage />;
    case "note":
      return <NotePage slug={route.slug} />;
    case "work":
      return <CaseStudyPage slug={route.slug} />;
    case "service":
      return <ServicePage slug={route.slug} />;
    case "press":
      return <PressPage />;
    case "glossary":
      return <GlossaryPage />;
    case "checklist":
      return <ChecklistPage />;
    case "methodology":
      return <MethodologyPage />;
    case "demos":
      return <DemosPage />;
    case "store":
      return <StorePage />;
    case "storeProduct":
      return <StorePage slug={route.slug} />;
    case "notfound":
      return <NotFound path={route.path} />;
    case "home":
    default:
      return <HomePage />;
  }
}

/* ------------------------------------------------------------------ */
/* Service row — Phase 4                                               */
/* ------------------------------------------------------------------ */

function ServiceRow({ s }: { s: (typeof services)[number] }) {
  const { t } = useI18n();
  return (
    <article className="grid grid-cols-12 gap-x-6 py-10 sm:py-12 border-t border-black/90 first:border-t-0">
      <div className="col-span-12 sm:col-span-3 mb-4 sm:mb-0">
        <div className="font-mono text-xs tracking-mono opacity-60 mb-2">{s.n} / SERVICE</div>
        <h3 className="font-display text-2xl sm:text-3xl tracking-display leading-[1.05]">
          <a href={`/services/${s.slug}`} className="no-underline text-inherit hover:underline decoration-1 underline-offset-4">
            {s.title}
          </a>
        </h3>
        <div className="font-mono text-[10.5px] tracking-mono opacity-60 mt-2">{s.tagline}</div>
        <a href={`/services/${s.slug}`} className="mt-3 inline-block font-mono text-[11px] tracking-mono font-semibold border-b border-black">
          {t("common.readMore").toUpperCase()} →
        </a>
      </div>

      <div className="col-span-12 sm:col-span-6 space-y-5">
        <p className="text-[15.5px] leading-[1.65] max-w-prose">{s.what}</p>
        <div>
          <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-1.5">{t("common.analyze").toUpperCase()}</div>
          <ul className="text-[14px] leading-[1.6] opacity-90 space-y-1.5">
            {s.analyze.map((a) => (
              <li key={a} className="flex gap-2">
                <span aria-hidden="true" className="opacity-50">—</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="col-span-12 sm:col-span-3 mt-5 sm:mt-0">
        <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-2">{t("common.receive").toUpperCase()}</div>
        <ul className="text-[13.5px] leading-[1.6] space-y-1.5">
          {s.receive.map((d) => (
            <li key={d} className="flex gap-2">
              <span aria-hidden="true" className="opacity-50">—</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-3 border-t border-black/15 font-mono text-[10.5px] tracking-mono opacity-70 leading-[1.6]">
          {t("common.pricing").toUpperCase()}: {s.pricing}
        </div>
      </div>

      <div className="col-span-12 mt-7">
        <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-3">{t("common.actions").toUpperCase()}</div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          {s.actions.map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="font-mono text-[10.5px] tracking-mono opacity-50 pt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[13.5px] leading-[1.55] opacity-90">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 font-mono text-[11px] tracking-mono opacity-70 max-w-prose leading-[1.6]">
          {t("common.measured").toUpperCase()}: {s.measured}
        </p>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Work card — Phase 6                                                 */
/* ------------------------------------------------------------------ */

function ProjectCard({
  p,
  large = false,
}: {
  p: (typeof projects)[number];
  large?: boolean;
}) {
  return (
    <a
      href={`/work/${p.slug}`}
      className={[
        "group relative flex flex-col h-full p-6 sm:p-7",
        "border border-black no-underline text-inherit",
        "transition-colors duration-200",
        "hover:bg-black hover:text-white",
        "focus-visible:bg-black focus-visible:text-white",
      ].join(" ")}
    >
      <header className="flex items-start justify-between mb-6 font-mono text-[11px] tracking-mono opacity-70 group-hover:opacity-90">
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

      <p className="text-[14px] leading-[1.6] mb-6 flex-1 opacity-90">{p.summary}</p>

      <footer className="mt-auto pt-4 border-t border-current/20 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-mono">
        {p.services.map((tag) => (
          <span key={tag} className="opacity-80">
            {tag}
          </span>
        ))}
        <span className="ml-auto opacity-70 group-hover:opacity-100">READ →</span>
      </footer>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Team seat — Phase 10                                                */
/* ------------------------------------------------------------------ */

function TeamMember({ member }: { member: (typeof team)[number] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {member.portrait ? (
          <img
            src={member.portrait}
            alt={member.name ? `${member.name}, ${member.role}` : member.role}
            className="h-14 w-14 rounded-full object-cover shrink-0"
            loading="lazy"
            width={56}
            height={56}
          />
        ) : (
          <div
            aria-hidden="true"
            className="h-14 w-14 rounded-full bg-black text-white flex items-center justify-center font-mono text-[13px] tracking-mono font-semibold shrink-0"
          >
            {member.initials}
          </div>
        )}
        <div>
          <div className="font-display text-[17px] sm:text-[18px] tracking-display leading-tight">
            {member.name ?? member.role}
          </div>
          {member.name && (
            <div className="font-mono text-[11px] tracking-mono opacity-60 mt-0.5">{member.role}</div>
          )}
          {!member.name && (
            <div className="font-mono text-[11px] tracking-mono opacity-60 mt-0.5">PRINCIPAL</div>
          )}
        </div>
      </div>
      <p className="text-[13.5px] leading-[1.6] opacity-85">{member.note}</p>
      {member.verified && member.link && (
        <a
          href={member.link}
          className="font-mono text-[11px] tracking-mono underline opacity-70 hover:opacity-100 self-start"
        >
          PROFILE →
        </a>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Home page                                                           */
/* ------------------------------------------------------------------ */

function HomePage() {
  const { t } = useI18n();

  useDocumentMeta({
    title: "THE OFFICE 360 — Book strategy, web, automation, research",
    description:
      "A four-person studio for authors, publishers, and the people who run literary businesses. Book strategy, book research, custom web design, and automation — research, strategy, design and technology on one brief.",
    path: "/",
  });

  return (
    <div className="min-h-screen bg-paper text-charcoal font-sans selection:bg-black selection:text-white">
      <SkipLink />
      <ToastContainer />
      <SiteHeader mode="home" />

      <main id="main">
        {/* 00 / HERO */}
        <section id="top" className="rule-b" aria-labelledby="hero-heading">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-10 sm:py-16 lg:py-24">
              <MarginRail
                sectionNum="00"
                sectionLabel="THE OFFICE 360 / A STUDIO FOR BOOKS, WEB, AUTOMATION, AND RESEARCH"
                folio="PORTFOLIO I"
                note="If you are reading this, the manifest bar above is real time. It is also the only animation on this page."
              />

              <div className="col-span-12 lg:col-span-10">
                <MobileFolioStrip
                  sectionNum="00"
                  sectionLabel="A STUDIO FOR BOOKS, WEB, AUTOMATION, AND RESEARCH"
                  folio="PORTFOLIO I"
                />
                <div className="font-mono text-[11px] sm:text-[12px] tracking-mono opacity-70 mb-6 sm:mb-10">
                  <span className="opacity-60">{t("hero.kicker1").toUpperCase()} </span>
                  <span>{t("hero.kicker2").toUpperCase()} </span>
                  <span className="hidden sm:inline">{t("hero.kicker3").toUpperCase()} </span>
                  <span>{t("hero.kicker4").toUpperCase()}</span>
                </div>

                <h1
                  id="hero-heading"
                  className="font-display tracking-display-tight font-light text-[44px] leading-[0.98] sm:text-[72px] sm:leading-[0.96] lg:text-[112px] lg:leading-[0.94]"
                >
                  {t("hero.title1")}
                  <br />
                  {t("hero.title2")}
                  <br />
                  {t("hero.title3")}
                </h1>

                <div className="mt-10 sm:mt-14 grid grid-cols-12 gap-x-6 gap-y-8">
                  <div className="col-span-12 lg:col-span-7">
                    <p className="font-display text-[20px] sm:text-[24px] tracking-display leading-[1.3] max-w-prose mb-5">
                      {t("home.positioning")}
                    </p>
                    <p className="text-[16.5px] sm:text-[18px] leading-[1.6] max-w-prose opacity-90">
                      {t("hero.sub")}
                    </p>
                  </div>

                  <div className="col-span-12 lg:col-span-4 lg:col-start-9 flex flex-col gap-3">
                    <div className="font-mono text-[11px] tracking-mono opacity-60">
                      {t("hero.reading").toUpperCase()}
                    </div>
                    <div className="font-display text-[20px] sm:text-[22px] tracking-display leading-[1.25]">
                      <Typewriter
                        text="“A working class of letters.” — a novel repositioning, Spring '26."
                        speed={28}
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
                        // Visible from the first paint. Gating the primary CTA on
                        // the typewriter left it invisible-but-clickable for the
                        // ~2.5s the animation runs; the animation is decoration.
                      ].join(" ")}
                    >
                      {t("cta.requestAnalysis").toUpperCase()} →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* 00b / POSITIONING + TRUST (Part 2 §1) */}
        <section className="rule-b bg-paper-tint" aria-label="Positioning">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-10 sm:py-14">
              <div className="col-span-12 lg:col-span-4">
                <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-3">{t("home.audience").toUpperCase()}</div>
                <p className="text-[15px] leading-[1.65] max-w-prose">
                  Nonfiction and technical authors, independent authors, and small-to-mid publishers.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-4 mt-6 lg:mt-0">
                <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-3">{t("home.problem").toUpperCase()}</div>
                <p className="text-[15px] leading-[1.65] max-w-prose">
                  Books that are good but invisible. Marketing that is activity without analysis. Vendors that report impressions instead of outcomes.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-4 mt-6 lg:mt-0">
                <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-3">WHY TRUST US</div>
                <ul className="font-mono text-[11.5px] tracking-mono leading-[1.9] opacity-80">
                  <li>EST. 2021 · FOUR PEOPLE · NO SUBCONTRACTORS</li>
                  <li>SIX-STAGE NAMED METHODOLOGY</li>
                  <li>YOU KEEP THE ANALYSIS</li>
                  <li><a href="/#work" className="underline">CASE STUDIES →</a></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 01 / SERVICES */}
        <section id="services" className="rule-b" aria-labelledby="services-heading">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
              <MarginRail
                sectionNum="01"
                sectionLabel="FOUR SERVICES. ONE STUDIO."
                folio="PORTFOLIO II"
                note="These are not packages. We scope each engagement against the brief."
              />

              <div className="col-span-12 lg:col-span-10 reveal">
                <MobileFolioStrip
                  sectionNum="01"
                  sectionLabel="FOUR SERVICES. ONE STUDIO."
                  folio="PORTFOLIO II"
                />
                <nav className="mb-8 border-t border-black" aria-label={t("section.services")}>
                  {services.map((svc) => (
                    <a
                      key={svc.slug}
                      href={`/services/${svc.slug}`}
                      className="flex items-baseline justify-between gap-6 border-b border-black py-2.5 no-underline text-inherit hover:bg-black hover:text-white transition-colors"
                    >
                      <span className="font-display text-[17px] sm:text-[19px] tracking-display">{svc.title}</span>
                      <span className="font-mono text-[11px] tracking-mono opacity-60 truncate">{svc.tagline}</span>
                    </a>
                  ))}
                </nav>

                <div className="mb-10 sm:mb-14">
                  <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                    01 / {t("section.services").toUpperCase()}
                  </div>
                  <h2
                    id="services-heading"
                    className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[18ch]"
                  >
                    {t("section.servicesTitle")}
                  </h2>
                </div>

                {services.map((s) => (
                  <ServiceRow key={s.n} s={s} />
                ))}

                <p className="mt-10 sm:mt-12 text-[14px] leading-[1.7] max-w-prose opacity-80">
                  Engagements typically run 4–14 weeks. We work with a small
                  number of clients at a time and turn down more than we take.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 02 / WORK */}
        <section id="work" className="rule-b" aria-labelledby="work-heading">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
              <MarginRail
                sectionNum="02"
                sectionLabel="SELECTED ENGAGEMENTS, 2024–2025"
                folio="PORTFOLIO III"
                note="Engagement patterns. No client is named and no result is claimed. Verified case studies are shared under NDA."
              />

              <div className="col-span-12 lg:col-span-10 reveal">
                <MobileFolioStrip
                  sectionNum="02"
                  sectionLabel="SELECTED ENGAGEMENTS, 2024–2025"
                  folio="PORTFOLIO III"
                />
                <div className="mb-10 sm:mb-14">
                  <div className="font-mono text-[11px] tracking-mono opacity-60 mb-3">
                    02 / {t("section.work").toUpperCase()}
                  </div>
                  <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-70 mb-5">
                    Engagement patterns · No client named · No result claimed
                  </div>
                  <h2
                    id="work-heading"
                    className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[22ch]"
                  >
                    {t("section.workTitle")}
                  </h2>
                  <p className="mt-6 text-[15px] leading-[1.7] max-w-prose opacity-80">
                    {workNote}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {projects.map((p, i) => (
                    <ProjectCard key={p.slug} p={p} large={i === 0} />
                  ))}
                </div>

                {/* Verified sample deliverable — a real audit, published in full. */}
                <div className="mt-8 border border-black p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-60">
                      Sample deliverable · published in full
                    </div>
                    <div className="font-mono text-[11px] tracking-mono opacity-70">
                      P/050 · 2025
                    </div>
                  </div>

                  <h3 className="font-display text-[24px] sm:text-[32px] tracking-display leading-[1.05] mb-3">
                    Amazon SEO Performance Report
                  </h3>
                  <p className="text-[15px] leading-[1.6] opacity-85 max-w-prose mb-8">
                    Two backlist titles. Eight weeks. Two grade tiers. This is
                    what an audit deliverable looks like: grade tracking,
                    visibility metrics, backlink analysis, and recommended next
                    steps.
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

                <div className="mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <p className="text-[14px] leading-[1.7] max-w-prose opacity-80">
                    Verified case studies — with the client named and the
                    numbers attached — are shared under NDA on request.
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

        {/* 03 / APPROACH — Phase 5 */}
        <section
          id="approach"
          className="rule-b bg-paper-tint"
          aria-labelledby="approach-heading"
        >
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
              <MarginRail
                sectionNum="03"
                sectionLabel="THE METHOD, IN SIX STAGES"
                folio="PORTFOLIO IV"
                note="Stage 01 is where engagements are won or lost. We do not rush it."
              />

              <div className="col-span-12 lg:col-span-10 reveal">
                <MobileFolioStrip
                  sectionNum="03"
                  sectionLabel="THE METHOD, IN SIX STAGES"
                  folio="PORTFOLIO IV"
                />
                <div className="mb-10 sm:mb-14">
                  <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                    03 / {t("section.approach").toUpperCase()}
                  </div>
                  <h2
                    id="approach-heading"
                    className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[18ch]"
                  >
                    {t("section.approachTitle")}
                  </h2>
                  <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] sm:text-[12px] tracking-mono" aria-label="Process">
                    {processStages.map((st, i) => (
                      <span key={st.n} className="flex items-center gap-3">
                        <span className="border border-black px-2.5 py-1">{st.title.toUpperCase()}</span>
                        {i < processStages.length - 1 && <span aria-hidden="true" className="opacity-50">→</span>}
                      </span>
                    ))}
                  </div>
                  <a href="/methodology" className="mt-5 inline-block font-mono text-[12px] tracking-mono font-semibold border-b border-black">
                    {t("section.methodology").toUpperCase()} →
                  </a>
                </div>

                <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                  {processStages.map((stage) => (
                    <li key={stage.n} className="flex gap-5">
                      <div className="font-mono text-[11px] tracking-mono opacity-50 pt-1 shrink-0 w-8">
                        {stage.n}
                      </div>
                      <div className="flex-1 border-t border-black pt-4">
                        <div className="flex items-baseline justify-between gap-4 mb-2">
                          <h3 className="font-display text-[22px] sm:text-[26px] tracking-display leading-tight">
                            {stage.title}
                          </h3>
                          <span className="font-mono text-[10.5px] tracking-mono opacity-60 whitespace-nowrap">
                            {stage.weight}
                          </span>
                        </div>
                        <p className="text-[14.5px] leading-[1.65] opacity-90 max-w-prose">
                          {stage.happens}
                        </p>
                        <p className="mt-3 font-mono text-[11px] tracking-mono opacity-70">
                          <span className="opacity-60">{t("common.receive").toUpperCase()}: </span>
                          {stage.receive}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <p className="mt-12 border-l-2 border-black pl-5 text-[14.5px] leading-[1.7] max-w-prose opacity-90">
                  {processCaveat}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 04 / WHY — Phase 7 + Phase 9 */}
        <section id="why" className="rule-b" aria-labelledby="why-heading">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
              <MarginRail
                sectionNum="04"
                sectionLabel="WHY THIS STUDIO"
                folio="PORTFOLIO V"
                note="No client logos, no invented statistics. What follows is what we commit to, not what we claim."
              />

              <div className="col-span-12 lg:col-span-10 reveal">
                <MobileFolioStrip
                  sectionNum="04"
                  sectionLabel="WHY THIS STUDIO"
                  folio="PORTFOLIO V"
                />
                <div className="mb-10 sm:mb-14">
                  <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                    04 / {t("section.why").toUpperCase()}
                  </div>
                  <h2
                    id="why-heading"
                    className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[18ch]"
                  >
                    {t("section.whyTitle")}
                  </h2>
                </div>

                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  {whyThemes.map((theme) => (
                    <div key={theme.k} className="border-t border-black pt-4">
                      <dt className="font-display text-[20px] sm:text-[22px] tracking-display leading-tight mb-2">
                        {theme.k}
                      </dt>
                      <dd className="text-[14.5px] leading-[1.65] opacity-90 max-w-prose">
                        {theme.v}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-14 border border-black p-6 sm:p-8">
                  <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-60 mb-5">
                    What we commit to, instead of testimonials
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                    {commitments.map((c) => (
                      <li key={c.k}>
                        <div className="font-display text-[17px] sm:text-[18px] tracking-display leading-tight mb-1.5">
                          {c.k}
                        </div>
                        <div className="text-[13.5px] leading-[1.6] opacity-85">{c.v}</div>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-7 pt-5 border-t border-black/15 text-[13px] leading-[1.65] opacity-75 max-w-prose">
                    This section used to carry testimonials. We would rather you
                    read the sample deliverable in section 02 and the notes we
                    publish, and ask us for references directly — we will give
                    you the names of people we have worked with, on request.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 05 / ABOUT */}
        <section id="about" className="rule-b" aria-labelledby="about-heading">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
              <MarginRail
                sectionNum="05"
                sectionLabel="FOUR PEOPLE. ONE STUDIO."
                folio="PORTFOLIO VI"
                note="The person on the kickoff call is the person who does the work."
              />

              <div className="col-span-12 lg:col-span-10 reveal">
                <MobileFolioStrip
                  sectionNum="05"
                  sectionLabel="FOUR PEOPLE. ONE STUDIO."
                  folio="PORTFOLIO VI"
                />
                <div className="mb-10 sm:mb-14">
                  <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                    05 / {t("section.about").toUpperCase()}
                  </div>
                  <h2
                    id="about-heading"
                    className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[20ch]"
                  >
                    {t("section.aboutTitle")}
                  </h2>
                </div>

                <div className="grid grid-cols-12 gap-x-6 gap-y-8">
                  <div className="col-span-12 lg:col-span-7 space-y-6 text-[16.5px] leading-[1.7]">
                    <p>
                      THE OFFICE 360 was started in 2021 by people who had spent the
                      previous decade working inside publishing houses, literary
                      agencies, and product teams. We were tired of the same
                      brief: <em>make it louder</em>.
                    </p>
                    <p>
                      We took a different bet — that the work in publishing and
                      adjacent fields is mostly a craft problem, not a marketing
                      one. Position the book correctly and the rest of the job
                      gets easier. Build the site like a piece of editorial
                      design and the conversion takes care of itself. Write the
                      automation to do the boring half of the job and the human
                      team gets their week back.
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
                        THE FOUR / BY SEAT
                      </div>
                      <div className="space-y-6">
                        {team.map((member) => (
                          <TeamMember key={member.role} member={member} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ReviewsSection />

        <FaqSection />

        <PricingSection />

        {/* 06 / CONTACT */}
        <section
          id="contact"
          className="bg-black text-white on-ink"
          aria-labelledby="contact-heading"
        >
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-16 sm:py-24">
              <MarginRail
                sectionNum="06"
                sectionLabel="START A BRIEF"
                folio="PORTFOLIO VII"
                inverse
                note="We reply to every brief within two working days. If we are not the right studio, we will say so and point you to someone who is."
              />

              <div className="col-span-12 lg:col-span-10 reveal">
                <MobileFolioStrip
                  sectionNum="06"
                  sectionLabel="START A BRIEF"
                  folio="PORTFOLIO VII"
                  inverse
                />
                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                  06 / {t("section.contact").toUpperCase()}
                </div>
                <h2
                  id="contact-heading"
                  className="font-display tracking-display text-[40px] sm:text-[60px] lg:text-[84px] leading-[0.95] font-light max-w-[16ch]"
                >
                  {t("section.contactTitle1")}
                  <br />
                  <span className="italic">{t("section.contactTitle2")}</span>{" "}
                  {t("section.contactTitle3")}
                </h2>
                <p className="mt-6 max-w-prose text-[16px] leading-[1.65] opacity-85">
                  No form-filling if you would rather write. Email works too —
                  we read every line of it. The more specific you are about the
                  timeline and the shape of the work, the faster we can tell you
                  whether we are the right studio for it.
                </p>

                <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-10">
                  <div className="col-span-12 lg:col-span-4">
                    <div className="font-mono text-[11px] tracking-mono opacity-60 mb-3">
                      DIRECT
                    </div>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="block font-display text-[22px] sm:text-[26px] tracking-display leading-tight border-b border-white/40 pb-2 hover:border-white transition-colors"
                    >
                      {CONTACT_EMAIL}
                    </a>

                    <div className="mt-6 font-mono text-[11px] tracking-mono opacity-70 leading-[1.7]">
                      REPLY WINDOW
                      <br />
                      MON–THU · WITHIN 2 WORKING DAYS
                    </div>

                    <div className="mt-8 border border-white/25 p-5">
                      <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-60 mb-3">
                        What happens next
                      </div>
                      <ol className="space-y-2.5 text-[13px] leading-[1.6] opacity-85">
                        <li className="flex gap-3">
                          <span className="font-mono opacity-60">01</span>
                          <span>A human reads it — not a triage bot.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-mono opacity-60">02</span>
                          <span>
                            We reply with questions, or with a referral if we
                            are not the right fit.
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="font-mono opacity-60">03</span>
                          <span>
                            A 30-minute call, then a written scope with a price.
                          </span>
                        </li>
                      </ol>
                    </div>
                  </div>

                  <BriefForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter mode="home" />
      <CookieNotice />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 404                                                                 */
/* ------------------------------------------------------------------ */

function NotFound({ path }: { path: string }) {
  useDocumentMeta({
    title: "Document not found — THE OFFICE 360",
    description:
      "The requested page is not in the archive. Return to the studio homepage or send us a brief.",
    path,
    noindex: true,
  });

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1 flex items-center py-20">
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
              <p className="font-mono text-[11px] tracking-mono opacity-60 mb-6 break-all">
                {`REQUESTED: ${path}`}
              </p>
              <p className="text-[16px] leading-[1.65] opacity-80 max-w-prose mb-8">
                The link you followed may have been moved, archived, or retired.
                If you were looking to submit a project brief or learn about our
                work, the studio homepage remains open.
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
                <a
                  href="/notes"
                  className="font-mono text-[12px] tracking-mono font-semibold border-b border-black"
                >
                  READ THE NOTES →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter mode="page" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Storage notice                                                      */
/* ------------------------------------------------------------------ */

function CookieNotice() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem("the-office:notice-dismissed") === "1";
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  function dismiss() {
    try {
      window.localStorage.setItem("the-office:notice-dismissed", "1");
    } catch {
      // Private browsing or storage disabled — the notice simply returns.
    }
    setDismissed(true);
  }

  return (
    <aside
      aria-label="Storage notice"
      className="fixed bottom-0 inset-x-0 z-40 bg-black text-white on-ink border-t border-white/20 p-4 font-mono text-[11px] tracking-mono"
    >
      <div className="mx-auto max-w-[1400px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="opacity-80 max-w-prose">
          This site uses no trackers and no ad networks. The only thing stored in
          your browser is your dismissal of this notice.{" "}
          <a href="/privacy" className="underline opacity-80 hover:opacity-100">
            PRIVACY NOTICE
          </a>
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
