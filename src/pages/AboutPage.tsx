import SkipLink from "../components/SkipLink";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import MarginRail from "../components/MarginRail";
import MobileFolioStrip from "../components/MobileFolioStrip";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { team } from "../data/team";
import { pillars, differences } from "../data/positioning";
import { divisions } from "../data/divisions";
import { TOTAL_SERVICES } from "../data/serviceCatalog";
import { industries } from "../data/industries";

/**
 * /about — the identity page the transformation brief asks for.
 *
 * The hard part is honesty about scale. The brief wants an international
 * consultancy; the studio is four verified principals. The page therefore states
 * both plainly and explains how four people cover six divisions — through a shared
 * method and named specialists engaged per engagement — rather than inflating
 * headcount to match the ambition. Inflating it is the one thing that would make
 * this page worthless.
 */
export default function AboutPage() {
  useDocumentMeta({
    title: "About — THE OFFICE 360",
    description:
      "THE OFFICE 360 is a digital transformation studio: six divisions covering web architecture, AI and automation, growth, brand, publishing and technology consulting, delivered by four principals and a shared analytical method.",
    path: "/about",
  });

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1">
        {/* HERO */}
        <section className="rule-b" aria-labelledby="about-heading">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-10 sm:py-16 lg:py-24">
              <MarginRail
                sectionNum="01"
                sectionLabel="THE OFFICE 360 / ABOUT THE STUDIO"
                folio="FOLIO II"
                note="Four principals. Six divisions. One method. Stated here rather than implied, because the alternative is a headcount claim nobody can check."
              />
              <div className="col-span-12 lg:col-span-10">
                <MobileFolioStrip
                  sectionNum="01"
                  sectionLabel="ABOUT THE STUDIO"
                  folio="FOLIO II"
                />
                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-6">
                  ABOUT / THE STUDIO
                </div>
                <h1
                  id="about-heading"
                  className="font-display tracking-display-tight font-light text-[40px] leading-[1.0] sm:text-[64px] sm:leading-[0.98] lg:text-[92px] lg:leading-[0.96] max-w-[18ch]"
                >
                  Six divisions.
                  <br />
                  One method.
                  <br />
                  Four principals.
                </h1>

                <div className="mt-10 sm:mt-14 grid grid-cols-12 gap-x-6 gap-y-8">
                  <div className="col-span-12 lg:col-span-7">
                    <p className="font-display text-[20px] sm:text-[24px] leading-[1.35] max-w-prose mb-5">
                      We architect, build and automate the digital infrastructure that helps
                      ambitious organisations operate smarter, grow faster and compete
                      internationally.
                    </p>
                    <p className="text-[16.5px] leading-[1.7] max-w-prose opacity-90">
                      THE OFFICE 360 began as a publishing studio — book positioning, author
                      platforms, discoverability — and grew into the technology around it. That
                      origin still shapes how we work: we treat a website as an argument to be
                      made precisely, and an automation as a process to be understood before it
                      is written down. The six divisions are not a menu bolted onto a design
                      agency. They are the capabilities a publisher, an author, or a business that
                      runs on content actually needs, in the order they tend to need them.
                    </p>
                  </div>
                  <div className="col-span-12 lg:col-span-4 lg:col-start-9">
                    <dl className="border-t border-black">
                      {[
                        ["DIVISIONS", String(divisions.length)],
                        ["SERVICES", String(TOTAL_SERVICES)],
                        ["INDUSTRIES", String(industries.length)],
                        ["PRINCIPALS", String(team.length)],
                        ["ESTABLISHED", "2021"],
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          className="flex items-baseline justify-between border-b border-black/20 py-2.5"
                        >
                          <dt className="font-mono text-[10.5px] tracking-mono opacity-60">{k}</dt>
                          <dd className="font-display text-[22px] leading-none">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="rule-b" aria-labelledby="philosophy-heading">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-14 sm:py-20">
            <div className="grid grid-cols-12 gap-x-6 gap-y-10">
              <div className="col-span-12 lg:col-span-4">
                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-3">
                  02 / PHILOSOPHY
                </div>
                <h2
                  id="philosophy-heading"
                  className="font-display tracking-display text-[32px] sm:text-[42px] leading-[1.02] font-light"
                >
                  What we believe about this work.
                </h2>
              </div>
              <div className="col-span-12 lg:col-span-7 lg:col-start-6 space-y-6">
                <p className="text-[16.5px] leading-[1.75] max-w-prose">
                  <span className="font-semibold">Technology is a business decision.</span> Every
                  recommendation we make is written down with its cost, its owner and a way to
                  tell whether it worked. If we cannot justify a piece of work in those terms, we
                  do not recommend it — however interesting it is to build.
                </p>
                <p className="text-[16.5px] leading-[1.75] max-w-prose">
                  <span className="font-semibold">Restraint is a feature.</span> Most sites and
                  most systems carry things nobody uses: pages, integrations, dashboards. We would
                  rather ship less and be able to explain all of it than ship a catalogue of
                  half-finished ideas.
                </p>
                <p className="text-[16.5px] leading-[1.75] max-w-prose">
                  <span className="font-semibold">Honesty about scale.</span> We are four
                  principals, not a global network with offices in nine cities. We cover six
                  divisions through a shared method and named specialists engaged for specific
                  work — and we say so, because a client who discovers the discrepancy later
                  stops trusting everything else on the site.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE DO */}
        <section className="rule-b" aria-labelledby="pillars-heading">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-14 sm:py-20">
            <div className="font-mono text-[11px] tracking-mono opacity-60 mb-3">
              03 / CAPABILITIES
            </div>
            <h2
              id="pillars-heading"
              className="font-display tracking-display text-[32px] sm:text-[46px] leading-[1.02] font-light max-w-[24ch] mb-10"
            >
              Six divisions, each with a real page behind it.
            </h2>
            <div className="grid grid-cols-12 gap-x-6 gap-y-8">
              {pillars.map((p) => (
                <article key={p.division} className="col-span-12 sm:col-span-6 lg:col-span-4">
                  <div className="border-t border-black pt-4">
                    <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-2">
                      {p.number}
                    </div>
                    <h3 className="font-display text-[21px] leading-[1.2] mb-2">
                      {p.title}
                    </h3>
                    <p className="text-[14.5px] leading-[1.65] opacity-85 mb-3">{p.summary}</p>
                    <a
                      href={`/services/${p.division}`}
                      className="font-mono text-[11px] tracking-mono font-semibold border-b border-black"
                    >
                      EXPLORE DIVISION →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* DIFFERENCES */}
        <section className="rule-b" aria-labelledby="why-heading">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-14 sm:py-20">
            <div className="font-mono text-[11px] tracking-mono opacity-60 mb-3">04 / WHY US</div>
            <h2
              id="why-heading"
              className="font-display tracking-display text-[32px] sm:text-[46px] leading-[1.02] font-light max-w-[22ch] mb-10"
            >
              Six claims you can check.
            </h2>
            {/*
              A <dl> may only contain <dt>/<dd> (or a <div> wrapping them, in HTML5).
              The numbered eyebrow was a sibling of dt/dd inside that div, which is
              what axe flagged as `definition-list`/`dlitem`. It now lives inside the
              dt, so the grouping is still valid.
            */}
            <dl className="grid grid-cols-12 gap-x-6 gap-y-8">
              {differences.map((d, i) => (
                <div key={d.title} className="col-span-12 sm:col-span-6">
                  <dt className="border-t border-black pt-4 font-display text-[20px] leading-[1.2] mb-2">
                    <span className="block font-mono text-[10.5px] tracking-mono opacity-60 mb-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {d.title}
                  </dt>
                  <dd className="text-[14.5px] leading-[1.65] opacity-85">{d.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* TEAM */}
        <section className="rule-b" aria-labelledby="team-heading">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-14 sm:py-20">
            <div className="font-mono text-[11px] tracking-mono opacity-60 mb-3">05 / THE TEAM</div>
            <h2
              id="team-heading"
              className="font-display tracking-display text-[32px] sm:text-[46px] leading-[1.02] font-light max-w-[22ch] mb-4"
            >
              Who does the work.
            </h2>
            <p className="text-[15.5px] leading-[1.7] max-w-prose opacity-85 mb-10">
              Names and roles below are supplied and confirmed by the studio. Portraits require
              written consent before publication; the card shows a monogram until then rather than
              using a stock photograph of somebody else.
            </p>
            <div className="grid grid-cols-12 gap-x-6 gap-y-10">
              {team.map((m) => (
                <article key={m.role} className="col-span-12 sm:col-span-6 lg:col-span-3">
                  <div className="border-t border-black pt-4">
                    <div
                      className="w-14 h-14 rounded-full border border-black/30 flex items-center justify-center font-mono text-[13px] tracking-mono mb-4 overflow-hidden"
                      aria-hidden="true"
                    >
                      {m.portrait ? (
                        <img
                          src={m.portrait}
                          alt=""
                          width={56}
                          height={56}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        m.initials
                      )}
                    </div>
                    <h3 className="font-display text-[19px] leading-[1.2]">
                      {m.name ?? m.role}
                    </h3>
                    <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-2">
                      {m.name ? m.role.toUpperCase() : "PRINCIPAL"}
                    </div>
                    <p className="text-[13.5px] leading-[1.6] opacity-85">{m.note}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section aria-labelledby="about-cta">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-14 sm:py-20">
            <h2
              id="about-cta"
              className="font-display tracking-display text-[32px] sm:text-[52px] leading-[1.0] font-light max-w-[20ch] mb-8"
            >
              Ready to build a smarter digital business?
            </h2>
            <div className="flex flex-wrap gap-3">
              <a
                href="/contact"
                className="bg-black text-white px-6 py-3.5 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors"
              >
                START YOUR PROJECT →
              </a>
              <a
                href="/services"
                className="border border-black px-6 py-3.5 font-mono text-[12px] tracking-mono font-semibold hover:bg-black hover:text-white transition-colors"
              >
                EXPLORE OUR SERVICES
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter mode="page" />
    </div>
  );
}
