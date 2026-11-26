import { useEffect } from "react";
import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useI18n } from "@/lib/i18n";
import { divisions } from "@/data/divisions";
import { flagshipInDivision, catalogueInDivision, TOTAL_SERVICES } from "@/data/serviceCatalog";
import { services as publishedServices } from "@/data/services";
import { industries } from "@/data/industries";

/**
 * Services index — the entry point to the whole architecture.
 *
 * Shows the six divisions, what the studio was built on (the five published
 * services), and the industry routes. The numbers shown are counted from data,
 * so they cannot drift out of date the way a hand-written "167 services" claim
 * would.
 */
export default function ServicesIndexPage() {
  const { t } = useI18n();

  useDocumentMeta({
    title: "Services — web, AI & automation, growth, brand, publishing, consulting — THE OFFICE 360",
    description:
      "Six divisions: web development and digital architecture, AI and business automation, digital growth, branding and design, publishing and book discoverability, and technology consulting.",
    path: "/services",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1">
        <section className="rule-b">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-20">
              <MarginRail
                sectionNum="S"
                sectionLabel="SIX DIVISIONS, ONE METHOD"
                folio="SERVICES"
                note="Every engagement runs the same six stages. Only what happens inside them changes."
              />
              <div className="col-span-12 lg:col-span-10">
                <MobileFolioStrip sectionNum="S" sectionLabel="SIX DIVISIONS, ONE METHOD" folio="SERVICES" />

                <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-4">SERVICES</div>
                <h1 className="display-xl text-[36px] sm:text-[56px] lg:text-[68px] max-w-[20ch] mb-5">
                  Six divisions. <span className="italic">One analytical method.</span>
                </h1>
                <p className="text-[17px] sm:text-[19px] leading-[1.6] max-w-prose opacity-90">
                  We started as a publishing studio and the method has not changed: understand the
                  situation before recommending anything, state what you will get, then measure whether
                  it worked. The six divisions below are that method applied to six kinds of problem.
                </p>
                <div className="mt-6 text-[11px] font-semibold uppercase tracking-[0.06em] text-mute">
                  {TOTAL_SERVICES} SERVICES · {divisions.length} DIVISIONS · {industries.length} INDUSTRIES
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Divisions */}
        <section className="rule-b">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
            {divisions.map((d, i) => {
              const flagship = flagshipInDivision(d.id).length;
              const catalogue = catalogueInDivision(d.id).length;
              const published = d.id === "publishing" ? publishedServices.length : 0;
              return (
                <article key={d.id} className={i === 0 ? "py-10 sm:py-12" : "py-10 sm:py-12 border-t border-ink"}>
                  <div className="grid grid-cols-12 gap-x-6">
                    <div className="col-span-12 sm:col-span-3 mb-3 sm:mb-0">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-2">{d.n} / DIVISION</div>
                      <h2 className="font-display text-2xl sm:text-[28px] tracking-display leading-[1.1]">
                        {d.title}
                      </h2>
                      <div className="text-[10.5px] font-medium text-faint mt-2">
                        {flagship + catalogue + published} services
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <p className="text-[15.5px] leading-[1.65] max-w-prose">{d.tagline}</p>
                      <p className="mt-3 text-[14px] leading-[1.65] max-w-prose opacity-80">{d.intro}</p>
                    </div>
                    <div className="col-span-12 sm:col-span-3 mt-4 sm:mt-0">
                      <a
                        href={`/services/${d.id}`}
                        className="inline-block btn-secondary !py-2.5 !px-4 !text-[11.5px]"
                      >
                        VIEW DIVISION →
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* The core practice */}
        <section className="rule-b bg-paper-tint">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-12 sm:py-16">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10">
              <div className="col-span-12 lg:col-span-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-2">THE CORE PRACTICE</div>
                <p className="text-[13px] leading-[1.55] opacity-70 max-w-[28ch]">
                  The five services the studio was built on, each with a full page.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-9 mt-6 lg:mt-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {publishedServices.map((s) => (
                  <a key={s.slug} href={`/services/${s.slug}`} className="group flex flex-col gap-2 border border-ink bg-paper p-5 no-underline text-inherit transition-colors hover:bg-black hover:text-white">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute">{s.n}</span>
                    <span className="font-display text-[18px] tracking-display leading-[1.2]">{s.title}</span>
                    <span className="text-[13px] leading-[1.5] opacity-80">{s.tagline}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="rule-b">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-12 sm:py-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-2">INDUSTRIES</div>
                <h2 className="display-lg text-[28px] sm:text-[40px] max-w-[20ch]">
                  Applied to your sector.
                </h2>
              </div>
              <a href="/industries" className="text-[13px] font-semibold border-b border-ink pb-0.5 hover:text-signal hover:border-signal transition-colors self-start sm:self-auto">
                ALL {industries.length} INDUSTRIES →
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-1">
              {industries.map((ind) => (
                <a key={ind.slug} href={`/industries/${ind.slug}`} className="py-2 border-t border-ink/15 text-[14px] hover:opacity-60">
                  {ind.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black text-white on-ink">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-16 sm:py-20">
            <h2 className="display-xl text-[30px] sm:text-[44px] max-w-[20ch] mb-5">
              Send us the <span className="italic">actual</span> brief.
            </h2>
            <p className="text-[15.5px] leading-[1.7] max-w-prose opacity-85 mb-7">
              The more specific you are about the problem, the faster we can tell you whether we are
              the right studio for it.
            </p>
            <a href="/#contact" className="inline-block btn-inverse">
              {t("cta.requestAnalysis").toUpperCase()} →
            </a>
          </div>
        </section>
      </main>

      <SiteFooter mode="page" />
    </div>
  );
}
