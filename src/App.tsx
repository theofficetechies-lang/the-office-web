import { useState } from "react";
import MarginRail from "./components/MarginRail";
import MobileFolioStrip from "./components/MobileFolioStrip";
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
import { lazy, Suspense } from "react";

/*
 * Content-heavy pages are split out of the entry bundle.
 *
 * The 40 service pages, 6 division hubs, 20 industry pages and their data are
 * ~150 kB of the shipped JavaScript, and before splitting every visitor parsed all
 * of it to read the homepage. Each lazy page below is wrapped at its route (see
 * lazyRoute). The five published services (ServicePage) stay eager: they are the
 * original practice and the first thing a returning reader is likely to open.
 */
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage"));
const ServicesIndexPage = lazy(() => import("./pages/ServicesIndexPage"));
const DivisionPage = lazy(() => import("./pages/DivisionPage"));
const IndustriesIndexPage = lazy(() => import("./pages/IndustriesIndexPage"));
const IndustryPage = lazy(() => import("./pages/IndustryPage"));
import PressPage from "./pages/PressPage";
import GlossaryPage from "./pages/GlossaryPage";
import ChecklistPage from "./pages/ChecklistPage";
import MethodologyPage from "./pages/MethodologyPage";
import DemosPage from "./pages/DemosPage";
import StorePage from "./pages/StorePage";
import AdminPage from "./pages/AdminPage";
import AdminLeadsPage from "./pages/AdminLeadsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import InsightsPage from "./pages/InsightsPage";
import WorkIndexPage from "./pages/WorkIndexPage";
import { useI18n } from "./lib/i18n";
import { routeKey, useRoute } from "./lib/router";
import type { Route } from "./lib/router";
import { hasServiceDetail } from "./data/serviceSlugs";
import { getInquiryType, DEFAULT_INQUIRY_TYPE } from "./data/inquiryTypes";
import { divisions } from "./data/divisions";
import { TOTAL_SERVICES } from "./data/serviceCatalog";
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

  /*
   * The <Suspense> boundary lives inside renderRoute, around the lazy pages only.
   *
   * It was originally here, around the whole routed tree, and that looked harmless
   * and was not. During hydration React defers the contents of a served boundary to
   * a later task, so effects on the parent — useReveal — ran while the boundary's
   * DOM was still un-hydrated. Adding `is-visible` to those nodes first made React
   * compare a mismatched className and discard the server tree on every page, which
   * broke the reveal, the forms and the typewriter at once. One boundary per lazy
   * route keeps hydration synchronous with the rest of the document.
   */
  return renderRoute(route);
}

/**
 * Wrap a lazily-loaded page in the boundary it needs.
 *
 * No fallback text: the route is prerendered, so its markup is already painted and
 * a spinner would replace a finished page with a loading state on slow connections.
 * Eager routes do not pass through here at all — see the note in App().
 */
function lazyRoute(node: React.ReactNode) {
  return <Suspense fallback={null}>{node}</Suspense>;
}

function renderRoute(route: Route): React.ReactNode {
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
      /*
       * Two kinds of service URL share this route:
       *   • the five published services (book-positioning, discoverability, …)
       *     keep their original page — unchanged, ranking intact;
       *   • flagship catalogue services use the newer, content-rich template.
       * A slug with written detail takes the new page; everything else falls back
       * to the original ServicePage, which already 404s on an unknown slug.
       */
      return hasServiceDetail(route.slug) ? (
        lazyRoute(<ServiceDetailPage slug={route.slug} />)
      ) : (
        <ServicePage slug={route.slug} />
      );
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
    case "admin":
      return <AdminPage />;
    case "adminLeads":
      return <AdminLeadsPage />;

    /* Transformation-brief pages. */
    case "about":
      return <AboutPage />;
    case "contact":
      return <ContactPage />;
    case "insightsIndex":
      return <InsightsPage />;
    case "workIndex":
      return <WorkIndexPage />;
    /*
     * Phase 1 added these four route kinds to the router so the architecture is
     * in place, but their pages arrive in Phase 2. Until then they must resolve
     * to a real 404 rather than falling through to `default` — the switch's
     * default renders HomePage, which would serve the homepage at /services and
     * /industries: a soft 404, and exactly the doorway pattern the brief forbids.
     */
    case "servicesIndex":
      return lazyRoute(<ServicesIndexPage />);
    case "division":
      return lazyRoute(<DivisionPage id={route.id} />);
    case "industriesIndex":
      return lazyRoute(<IndustriesIndexPage />);
    case "industry":
      return lazyRoute(<IndustryPage slug={route.slug} />);
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
    <article className="group grid grid-cols-12 gap-x-6 gap-y-6 border-t border-faint py-10 sm:py-12">
      <div className="col-span-12 sm:col-span-3">
        <div className="flex items-baseline gap-2">
          <span className="display-lg text-[22px] leading-none tabular-nums text-signal">
            {s.n}
          </span>
          <span className="eyebrow">Service</span>
        </div>
        <h3 className="mt-3 text-[24px] font-semibold leading-[1.08] tracking-display">
          <a
            href={`/services/${s.slug}`}
            className="decoration-1 underline-offset-4 hover:underline"
          >
            {s.title}
          </a>
        </h3>
        <p className="mt-2 text-[12.5px] leading-[1.5] text-mute">{s.tagline}</p>
        <a
          href={`/services/${s.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink border-b border-ink pb-0.5 hover:text-signal hover:border-signal transition-colors"
        >
          {t("common.readMore")}
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="col-span-12 sm:col-span-5 space-y-5">
        <p className="text-[15.5px] leading-[1.62] text-charcoal/90">{s.what}</p>
        <div>
          <h4 className="eyebrow mb-2">{t("common.analyze")}</h4>
          <ul className="space-y-1.5 text-[14px] leading-[1.55] text-charcoal/85">
            {s.analyze.map((a) => (
              <li key={a} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-[9px] h-px w-2.5 shrink-0 bg-faint" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="col-span-12 sm:col-span-4">
        <h4 className="eyebrow mb-2">{t("common.receive")}</h4>
        <ul className="space-y-1.5 text-[13.5px] leading-[1.55] text-charcoal/85">
          {s.receive.map((d) => (
            <li key={d} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-[8px] h-px w-2.5 shrink-0 bg-faint" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-faint pt-3 text-[12.5px] leading-[1.5] text-mute">
          <span className="font-semibold text-ink">{t("common.pricing")}</span>
          {" — "}
          {s.pricing}
        </div>
        <div className="mt-3 text-[12.5px] leading-[1.5] text-mute">
          <span className="font-semibold text-ink">{t("common.measured")}</span>
          {" — "}
          {s.measured}
        </div>
      </div>

      <div className="col-span-12 border-t border-faint pt-5">
        <h4 className="eyebrow mb-3">{t("common.actions")}</h4>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-3">
          {s.actions.map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="mt-px text-[11px] font-semibold tabular-nums text-mute">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[13.5px] leading-[1.5] text-charcoal/85">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Work card                                                          */
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
        "border border-faint bg-paper",
        "transition-colors duration-200",
        "hover:border-ink hover:bg-paper-tint",
        "focus-visible:border-ink",
      ].join(" ")}
    >
      <header className="flex items-baseline justify-between mb-6">
        <span className="display-lg text-[15px] tabular-nums text-signal">{p.n}</span>
        <span className="text-[12px] tabular-nums text-mute">{p.year}</span>
      </header>

      <div className="eyebrow mb-3 group-hover:text-ink transition-colors">{p.sector}</div>

      <h3
        className={[
          "font-semibold tracking-display leading-[1.08] mb-4",
          large ? "text-[26px] sm:text-[32px]" : "text-[20px] sm:text-[23px]",
        ].join(" ")}
      >
        {p.title}
      </h3>

      <p className="text-[14px] leading-[1.6] mb-6 flex-1 text-charcoal/80">{p.summary}</p>

      <footer className="mt-auto pt-4 border-t border-faint flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-mute">
        {p.services.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
        <span className="ml-auto font-semibold text-ink group-hover:text-signal transition-colors">
          Read →
        </span>
      </footer>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Team seat — Phase 10                                                */
/* ------------------------------------------------------------------ */

function TeamMember({ member }: { member: (typeof team)[number] }) {
  return (
    <div className="px-5 py-5">
      <div className="flex items-center gap-3.5">
        {member.portrait ? (
          <img
            src={member.portrait}
            alt={member.name ? `${member.name}, ${member.role}` : member.role}
            className="h-11 w-11 rounded-full object-cover shrink-0"
            loading="lazy"
            width={44}
            height={44}
          />
        ) : (
          <div
            aria-hidden="true"
            className="h-11 w-11 rounded-full bg-ink text-white flex items-center justify-center text-[12px] font-semibold shrink-0"
          >
            {member.initials}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-[16px] font-semibold tracking-display leading-tight truncate">
            {member.name ?? member.role}
          </div>
          <div className="mt-0.5 text-[12px] text-mute">
            {member.role}
            {!member.name && " · Principal"}
          </div>
        </div>
      </div>
      <p className="mt-3.5 text-[13.5px] leading-[1.55] text-charcoal/80">{member.note}</p>
      {member.verified && member.link && (
        <a
          href={member.link}
          className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-semibold text-ink underline decoration-1 underline-offset-4 hover:text-signal transition-colors"
        >
          Profile
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

  /*
   * A pathway link (e.g. /#contact?type=website-audit) preselects the brief form's
   * division and shows the pathway's hint. Read once on mount: the hash is not a
   * router state, and re-reading it on every render would fight the user's own
   * selections. Unknown or absent ids fall back to the default pathway, so a
   * hand-edited URL cannot put the form into a state it cannot render.
   */
  const [inquiryType] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_INQUIRY_TYPE;
    const raw = (window.location?.href ?? "").split("?")[1]?.split("#")[0] ?? "";
    const id = new URLSearchParams(raw).get("type") ?? "";
    return getInquiryType(id) ? id : DEFAULT_INQUIRY_TYPE;
  });

  useDocumentMeta({
    title: "THE OFFICE 360 — Digital transformation, technology and growth",
    description:
      "A digital transformation studio for organisations that run on content and systems: publishing, web architecture, AI automation, growth, brand and technology consulting. Six divisions, one analytical method, and the same four principals on every engagement.",
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
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10">
              <MarginRail sectionNum="00" sectionLabel="Digital transformation, technology and growth" />

              <div className="col-span-12 lg:col-span-10 pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-20">
                <MobileFolioStrip sectionNum="00" sectionLabel="Digital transformation, technology and growth" />

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="eyebrow">
                    <span className="eyebrow-num">Est. 2021</span> · Six divisions
                  </span>
                  <span className="h-3 w-px bg-faint" aria-hidden="true" />
                  <span className="text-[11px] font-medium text-mute">
                    Four principals · No subcontractors
                  </span>
                </div>

                <h1
                  id="hero-heading"
                  className="display-xl mt-7 text-[46px] leading-[0.94] sm:text-[76px] lg:text-[104px] xl:text-[118px]"
                >
                  {t("hero.title1")}
                  <br />
                  {t("hero.title2")}
                  <br />
                  {t("hero.title3")}
                </h1>

                <div className="mt-10 sm:mt-14 grid grid-cols-12 gap-x-6 gap-y-10 rule-t pt-8 sm:pt-10">
                  <div className="col-span-12 lg:col-span-7">
                    <p className="text-[20px] leading-[1.42] tracking-[-0.015em] font-medium max-w-[42ch] text-ink">
                      {t("home.positioning")}
                    </p>
                    <p className="mt-5 text-[16px] leading-[1.62] max-w-[54ch] text-mute">
                      {t("hero.sub")}
                    </p>
                  </div>

                  <div className="col-span-12 lg:col-span-4 lg:col-start-9">
                    <div className="flex flex-col items-stretch gap-2.5">
                      {/*
                        Primary then secondary, per the transformation brief. Both
                        are real destinations: /contact is a page with a real form,
                        and /services is the index. The old primary CTA was an anchor
                        to a section on this page — fine for a one-page studio, wrong
                        for a site the visitor may have entered on a division page.
                      */}
                      <a href="/contact" className="btn-primary justify-between">
                        <span>Book a free consultation</span>
                        <span aria-hidden="true">→</span>
                      </a>
                      <a href="/services" className="btn-secondary justify-between">
                        <span>Explore our services</span>
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                    <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-faint pt-5 text-[12px]">
                      <div>
                        <dt className="text-mute">Reply window</dt>
                        <dd className="mt-0.5 font-semibold text-ink">2 working days</dd>
                      </div>
                      <div>
                        <dt className="text-mute">Engagements</dt>
                        <dd className="mt-0.5 font-semibold text-ink">4–14 weeks</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 00b / POSITIONING */}
        <section className="bg-paper-tint" aria-label="Who we work with and why we can be trusted">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
            <div className="grid grid-cols-12 gap-x-6 gap-y-9 py-12 sm:py-14">
              <div className="col-span-12 lg:col-span-4">
                <h2 className="eyebrow mb-3">{t("home.audience")}</h2>
                <p className="text-[15px] leading-[1.6] text-charcoal/85 max-w-[40ch]">
                  Nonfiction and technical authors, independent authors, and
                  small-to-mid publishers — plus the organisations that serve them.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <h2 className="eyebrow mb-3">{t("home.problem")}</h2>
                <p className="text-[15px] leading-[1.6] text-charcoal/85 max-w-[40ch]">
                  Books that are good but invisible. Marketing that is activity
                  without analysis. Vendors that report impressions instead of
                  outcomes.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <h2 className="eyebrow mb-3">Why trust us</h2>
                <ul className="space-y-2 text-[14px] text-charcoal/85">
                  <li className="flex gap-2.5">
                    <span className="text-faint font-semibold" aria-hidden="true">—</span>
                    Est. 2021 · four principals · six divisions
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-faint font-semibold" aria-hidden="true">—</span>
                    Six-stage named methodology
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-faint font-semibold" aria-hidden="true">—</span>
                    You keep the analysis
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-faint font-semibold" aria-hidden="true">—</span>
                    <a href="/#work" className="underline decoration-1 underline-offset-4 hover:text-signal transition-colors">
                      See the engagement patterns
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 01 / SERVICES */}
        <section id="services" className="rule-b" aria-labelledby="services-heading">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-16 sm:py-24">
              <MarginRail sectionNum="01" sectionLabel="The core practice. One studio." />

              <div className="col-span-12 lg:col-span-10">
                <MobileFolioStrip sectionNum="01" sectionLabel="The core practice. One studio." />

                <div className="mb-12 sm:mb-16">
                  <span className="eyebrow">
                    <span className="eyebrow-num">01</span> — {t("section.services")}
                  </span>
                  <h2
                    id="services-heading"
                    className="display-xl rule-accent mt-5 pb-6 text-[36px] sm:text-[54px] lg:text-[68px] max-w-[19ch]"
                  >
                    {t("section.servicesTitle")}
                  </h2>
                </div>

                {services.map((s) => (
                  <ServiceRow key={s.n} s={s} />
                ))}

                <p className="mt-12 text-[15px] leading-[1.65] max-w-[58ch] text-mute">
                  Engagements typically run 4–14 weeks. We work with a small
                  number of clients at a time and turn down more than we take.
                </p>

                {/*
                  The five above are the practice the studio was built on. The rest
                  of what it offers — six divisions, {TOTAL_SERVICES} services — lives
                  on the services index. Without this the homepage still read as a
                  one-division studio, which is what the expansion was for.
                */}
                <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-6 rule-t pt-8">
                  <p className="col-span-12 lg:col-span-7 text-[15px] leading-[1.65] max-w-[56ch] text-charcoal/85">
                    These five are the core practice. The same method runs across{" "}
                    {divisions.length} divisions and {TOTAL_SERVICES} services — web
                    and digital architecture, AI and automation, growth, brand,
                    publishing and technology consulting.
                  </p>
                  <div className="col-span-12 lg:col-span-5 lg:justify-self-end">
                    <a href="/services" className="btn-secondary">
                      All {TOTAL_SERVICES} services
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 / WORK */}
        <section id="work" className="rule-b bg-paper-tint" aria-labelledby="work-heading">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-16 sm:py-24">
              <MarginRail sectionNum="02" sectionLabel="Selected engagements, 2024–2025" />

              <div className="col-span-12 lg:col-span-10">
                <MobileFolioStrip sectionNum="02" sectionLabel="Selected engagements, 2024–2025" />
                <div className="mb-10 sm:mb-14">
                  <span className="eyebrow">
                    <span className="eyebrow-num">02</span> — {t("section.work")}
                  </span>
                  <h2
                    id="work-heading"
                    className="display-xl mt-5 text-[36px] sm:text-[54px] lg:text-[68px] max-w-[21ch]"
                  >
                    {t("section.workTitle")}
                  </h2>
                  <p className="mt-6 text-[15.5px] leading-[1.65] max-w-[60ch] text-mute">
                    {workNote}
                  </p>
                  <p className="mt-4 inline-flex items-center gap-2 border border-faint bg-paper px-3 py-1.5 text-[11.5px] font-medium text-mute">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
                    Engagement patterns · no client named · no result claimed
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {projects.map((p, i) => (
                    <ProjectCard key={p.slug} p={p} large={i === 0} />
                  ))}
                </div>

                {/* Verified sample deliverable — a real audit, published in full. */}
                <div className="mt-10 border border-ink bg-paper p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-faint">
                    <span className="eyebrow">Sample deliverable · published in full</span>
                    <span className="text-[11.5px] tabular-nums text-mute">P/050 · 2025</span>
                  </div>

                  <h3 className="display-lg mt-6 text-[26px] sm:text-[34px]">
                    Amazon SEO Performance Report
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.62] text-charcoal/80 max-w-[62ch]">
                    Two backlist titles. Eight weeks. Two grade tiers. This is
                    what an audit deliverable looks like: grade tracking,
                    visibility metrics, backlink analysis, and recommended next
                    steps.
                  </p>

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-px bg-faint border border-faint">
                    <div className="bg-paper p-5">
                      <div className="eyebrow">Grade movement</div>
                      <div className="display-lg mt-2 text-[30px] sm:text-[36px] text-signal">E → C</div>
                      <div className="mt-1 text-[11.5px] text-mute">and D → B</div>
                    </div>
                    <div className="bg-paper p-5">
                      <div className="eyebrow">Performance gain</div>
                      <div className="display-lg mt-2 text-[30px] sm:text-[36px] text-signal">+45 pts</div>
                      <div className="mt-1 text-[11.5px] text-mute">visibility +43 pts</div>
                    </div>
                    <div className="bg-paper p-5">
                      <div className="eyebrow">Backlinking</div>
                      <div className="display-lg mt-2 text-[30px] sm:text-[36px] text-signal">12 → 27</div>
                      <div className="mt-1 text-[11.5px] text-mute">more than doubled</div>
                    </div>
                  </div>

                  <a
                    href="/downloads/amazon-seo-sample-report.pdf"
                    download="Amazon-SEO-Sample-Report-The-Office.pdf"
                    className="btn-primary mt-7 !items-center"
                  >
                    <span aria-hidden="true">↓</span>
                    <span>Download the full report (PDF)</span>
                    <span className="text-[10.5px] font-medium text-white/55">13 pages · real audit</span>
                  </a>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-t border-faint pt-7">
                  <p className="text-[14.5px] leading-[1.65] max-w-[56ch] text-mute">
                    Verified case studies — with the client named and the
                    numbers attached — are shared under NDA on request.
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-1.5 self-start text-[13px] font-semibold text-ink border-b border-ink pb-0.5 hover:text-signal hover:border-signal transition-colors"
                  >
                    Request the full book
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 / APPROACH */}
        <section id="approach" className="rule-b" aria-labelledby="approach-heading">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-16 sm:py-24">
              <MarginRail sectionNum="03" sectionLabel="The method, in six stages" />

              <div className="col-span-12 lg:col-span-10">
                <MobileFolioStrip sectionNum="03" sectionLabel="The method, in six stages" />
                <div className="mb-10 sm:mb-14">
                  <span className="eyebrow">
                    <span className="eyebrow-num">03</span> — {t("section.approach")}
                  </span>
                  <h2
                    id="approach-heading"
                    className="display-xl rule-accent mt-5 pb-6 text-[36px] sm:text-[54px] lg:text-[68px] max-w-[18ch]"
                  >
                    {t("section.approachTitle")}
                  </h2>
                  <div
                    className="mt-7 flex flex-wrap items-center gap-1.5"
                    aria-label="Process"
                  >
                    {processStages.map((st, i) => (
                      <span key={st.n} className="flex items-center gap-1.5">
                        <span className="border border-faint bg-paper-tint px-2.5 py-1 text-[11.5px] font-medium text-charcoal/80">
                          <span className="mr-1.5 tabular-nums text-mute">{st.n}</span>
                          {st.title}
                        </span>
                        {i < processStages.length - 1 && (
                          <span aria-hidden="true" className="text-faint text-[11px]">→</span>
                        )}
                      </span>
                    ))}
                  </div>
                  <a
                    href="/methodology"
                    className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink border-b border-ink pb-0.5 hover:text-signal hover:border-signal transition-colors"
                  >
                    {t("section.methodology")}
                    <span aria-hidden="true">→</span>
                  </a>
                </div>

                <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-9">
                  {processStages.map((stage) => (
                    <li key={stage.n}>
                      <div className="flex items-baseline gap-3 border-t border-ink pt-4">
                        <span className="display-lg text-[20px] leading-none tabular-nums text-signal">
                          {stage.n}
                        </span>
                        <h3 className="text-[22px] font-semibold tracking-display leading-tight flex-1">
                          {stage.title}
                        </h3>
                        <span className="whitespace-nowrap text-[11px] font-medium text-mute">
                          {stage.weight}
                        </span>
                      </div>
                      <p className="mt-3 text-[14.5px] leading-[1.62] text-charcoal/85 max-w-[52ch]">
                        {stage.happens}
                      </p>
                      <p className="mt-3 border-t border-faint pt-3 text-[12.5px] leading-[1.5] text-mute">
                        <span className="font-semibold text-ink">{t("common.receive")}</span>
                        {" — "}
                        {stage.receive}
                      </p>
                    </li>
                  ))}
                </ol>

                <p className="mt-12 max-w-[62ch] border-l-2 border-signal pl-5 text-[14.5px] leading-[1.7] text-charcoal/85">
                  {processCaveat}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 04 / WHY */}
        <section id="why" className="rule-b bg-paper-tint" aria-labelledby="why-heading">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-16 sm:py-24">
              <MarginRail sectionNum="04" sectionLabel="Why this studio" />

              <div className="col-span-12 lg:col-span-10">
                <MobileFolioStrip sectionNum="04" sectionLabel="Why this studio" />
                <div className="mb-10 sm:mb-14">
                  <span className="eyebrow">
                    <span className="eyebrow-num">04</span> — {t("section.why")}
                  </span>
                  <h2
                    id="why-heading"
                    className="display-xl mt-5 text-[36px] sm:text-[54px] lg:text-[68px] max-w-[18ch]"
                  >
                    {t("section.whyTitle")}
                  </h2>
                </div>

                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  {whyThemes.map((theme) => (
                    <div key={theme.k} className="border-t border-ink pt-4">
                      <dt className="text-[20px] font-semibold tracking-display leading-tight mb-2">
                        {theme.k}
                      </dt>
                      <dd className="text-[14.5px] leading-[1.62] text-charcoal/85 max-w-[50ch]">
                        {theme.v}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-14 border border-ink bg-paper p-6 sm:p-8">
                  <h3 className="eyebrow mb-6">What we commit to, instead of testimonials</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                    {commitments.map((c) => (
                      <li key={c.k} className="flex gap-3">
                        <span className="mt-[3px] text-[13px] font-semibold text-ink" aria-hidden="true">✓</span>
                        <div>
                          <div className="text-[16px] font-semibold tracking-display leading-tight mb-1">
                            {c.k}
                          </div>
                          <div className="text-[13.5px] leading-[1.55] text-charcoal/80">{c.v}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-8 border-t border-faint pt-5 text-[13px] leading-[1.6] text-mute max-w-[62ch]">
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
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-16 sm:py-24">
              <MarginRail sectionNum="05" sectionLabel="Four principals. Six divisions." />

              <div className="col-span-12 lg:col-span-10">
                <MobileFolioStrip sectionNum="05" sectionLabel="Four principals. Six divisions." />
                <div className="mb-10 sm:mb-14">
                  <span className="eyebrow">
                    <span className="eyebrow-num">05</span> — {t("section.about")}
                  </span>
                  <h2
                    id="about-heading"
                    className="display-xl rule-accent mt-5 pb-6 text-[36px] sm:text-[54px] lg:text-[68px] max-w-[20ch]"
                  >
                    {t("section.aboutTitle")}
                  </h2>
                </div>

                <div className="grid grid-cols-12 gap-x-6 gap-y-10">
                  <div className="col-span-12 lg:col-span-7 space-y-6">
                    <p className="text-[19px] leading-[1.5] tracking-[-0.01em] font-medium text-ink max-w-[46ch]">
                      THE OFFICE 360 was started in 2021 by people who had spent the
                      previous decade working inside publishing houses, literary
                      agencies, and product teams.
                    </p>
                    <p className="text-[15.5px] leading-[1.68] text-charcoal/85 max-w-[60ch]">
                      We were tired of the same brief: <em>make it louder</em>. We
                      took a different bet — that the work in publishing and
                      adjacent fields is mostly a craft problem, not a marketing
                      one. Position the book correctly and the rest of the job
                      gets easier. Build the site like a piece of editorial
                      design and the conversion takes care of itself. Write the
                      automation to do the boring half of the job and the human
                      team gets their week back.
                    </p>
                    <p className="text-[15.5px] leading-[1.68] text-charcoal/85 max-w-[60ch]">
                      We are four. We do not subcontract, do not staff with
                      juniors, and do not put our name on work we did not do.
                      The person on the kickoff call is the person writing the
                      brief.
                    </p>
                    <a
                      href="/about"
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink border-b border-ink pb-0.5 hover:text-signal hover:border-signal transition-colors"
                    >
                      More about the studio
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>

                  <div className="col-span-12 lg:col-span-4 lg:col-start-9">
                    <div className="border border-ink bg-paper">
                      <div className="border-b border-faint px-5 py-3.5">
                        <span className="eyebrow">The four · by seat</span>
                      </div>
                      <div className="divide-y divide-faint">
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
          className="bg-night text-white on-ink"
          aria-labelledby="contact-heading"
        >
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-16 sm:py-24">
              <MarginRail sectionNum="06" sectionLabel="Start a brief" inverse />

              <div className="col-span-12 lg:col-span-10">
                <MobileFolioStrip sectionNum="06" sectionLabel="Start a brief" inverse />

                <div className="max-w-[46rem]">
                  <span className="eyebrow !text-white/45">
                    <span className="text-signal">06</span> — {t("section.contact")}
                  </span>
                  <h2
                    id="contact-heading"
                    className="display-xl mt-5 text-[40px] leading-[0.96] sm:text-[62px] lg:text-[76px]"
                  >
                    {t("section.contactTitle1")}{" "}
                    <span className="text-signal">{t("section.contactTitle2")}</span>{" "}
                    {t("section.contactTitle3")}
                  </h2>
                  <p className="mt-6 max-w-[56ch] text-[16px] leading-[1.62] text-white/70">
                    No form-filling if you would rather write. Email works too —
                    we read every line of it. The more specific you are about the
                    timeline and the shape of the work, the faster we can tell you
                    whether we are the right studio for it.
                  </p>
                </div>

                <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-12 border-t border-white/15 pt-10">
                  <div className="col-span-12 lg:col-span-4">
                    <span className="eyebrow !text-white/40">Direct</span>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="mt-3 block break-all text-[20px] sm:text-[24px] font-semibold tracking-display leading-tight border-b border-white/30 pb-2.5 hover:border-signal hover:text-signal transition-colors"
                    >
                      {CONTACT_EMAIL}
                    </a>

                    <dl className="mt-7 grid grid-cols-2 gap-4 text-[12.5px]">
                      <div>
                        <dt className="text-white/45">Reply window</dt>
                        <dd className="mt-0.5 font-semibold text-white/90">Mon–Thu</dd>
                        <dd className="text-white/60">within 2 working days</dd>
                      </div>
                      <div>
                        <dt className="text-white/45">Principals</dt>
                        <dd className="mt-0.5 font-semibold text-white/90">Four</dd>
                        <dd className="text-white/60">no subcontractors</dd>
                      </div>
                    </dl>

                    <div className="mt-8 border border-white/15 bg-night-soft p-5">
                      <h3 className="eyebrow !text-white/45 mb-4">What happens next</h3>
                      <ol className="space-y-3 text-[13.5px] leading-[1.55] text-white/75">
                        <li className="flex gap-3">
                          <span className="text-[11px] font-semibold tabular-nums text-white/45">01</span>
                          <span>A human reads it — not a triage bot.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-[11px] font-semibold tabular-nums text-white/45">02</span>
                          <span>
                            We reply with questions, or with a referral if we are
                            not the right fit.
                          </span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-[11px] font-semibold tabular-nums text-white/45">03</span>
                          <span>A 30-minute call, then a written scope with a price.</span>
                        </li>
                      </ol>
                    </div>
                  </div>

                  <BriefForm inquiryType={inquiryType} />
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
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 w-full">
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
              <h1 className="display-xl text-[42px] sm:text-[68px] lg:text-[88px] max-w-[16ch] mb-6">
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
