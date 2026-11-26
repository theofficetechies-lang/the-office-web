import { useEffect } from "react";
import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useI18n } from "@/lib/i18n";
import { getIndustry, industries } from "@/data/industries";
import { resolveRelated } from "@/data/serviceDetailIndex";
import { getCatalogService } from "@/data/serviceCatalog";
import { divisions } from "@/data/divisions";

/**
 * Industry page — one sector, framed honestly.
 *
 * The page has no client logos, no case-study callouts and no sector statistics.
 * It describes the sector's characteristic pressures, where digital work tends
 * to move them, which services apply, and one or two scenarios labelled
 * illustrative. See the header note in src/data/industries.ts: no sector page may
 * ever be edited to imply a client engagement that does not exist.
 */
export default function IndustryPage({ slug }: { slug: string }) {
  const { t } = useI18n();
  const industry = getIndustry(slug);

  useDocumentMeta({
    title: industry
      ? `${industry.title} — Industries — THE OFFICE 360`
      : "Industry not found — THE OFFICE 360",
    description: industry?.summary ?? "That sector is not in the archive.",
    path: `/industries/${slug}`,
    noindex: !industry,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (!industry) {
    return (
      <div className="min-h-screen bg-paper text-charcoal flex flex-col">
        <SkipLink />
        <SiteHeader mode="page" />
        <main id="main" className="flex-1">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-20">
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-4">404 / INDUSTRY</div>
            <h1 className="display-xl text-[36px] sm:text-[56px] max-w-[18ch] mb-6">
              That sector is not in the archive.
            </h1>
            <a
              href="/industries"
              className="inline-block btn-primary"
            >
              ALL INDUSTRIES →
            </a>
          </div>
        </main>
        <SiteFooter mode="page" />
      </div>
    );
  }

  /*
   * Resolve the applied services through the same helper the service pages use,
   * so an industry link points at a real flagship page, a division-hub anchor, or
   * is dropped. Nothing here is hand-written, so the page cannot drift from the
   * catalogue.
   */
  const applied = industry.services
    .map((s) => resolveRelated(s))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const others = industries.filter((i) => i.slug !== industry.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1">
        <section className="rule-b">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-20">
              <MarginRail
                sectionNum="I"
                sectionLabel={industry.title.toUpperCase()}
                folio="INDUSTRIES"
                note={`${industry.services.length} services apply to this sector.`}
              />
              <div className="col-span-12 lg:col-span-10">
                <MobileFolioStrip
                  sectionNum="I"
                  sectionLabel={industry.title.toUpperCase()}
                  folio="INDUSTRIES"
                />

                <nav
                  aria-label="Breadcrumb"
                  className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-8 flex flex-wrap items-center gap-2"
                >
                  <a href="/industries" className="hover:opacity-100 underline-offset-2 hover:underline">
                    INDUSTRIES
                  </a>
                  <span aria-hidden="true">/</span>
                  <span aria-current="page" className="opacity-100">
                    {industry.title.toUpperCase()}
                  </span>
                </nav>

                <h1 className="display-xl text-[34px] sm:text-[52px] lg:text-[62px] max-w-[22ch] mb-5">
                  {industry.title}
                </h1>
                <p className="text-[17px] sm:text-[19px] leading-[1.6] max-w-prose opacity-90">
                  {industry.summary}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Characteristic pressures */}
        <section className="rule-b">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-16">
              <div className="col-span-12 lg:col-span-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute">THE PRESSURE</div>
                <p className="mt-2 text-[13px] leading-[1.55] opacity-70 max-w-[28ch]">
                  Conditions that are characteristic of this sector, not claims about named
                  organisations.
                </p>
              </div>
              <ul className="col-span-12 lg:col-span-9 mt-6 lg:mt-0">
                {industry.challenges.map((c, i) => (
                  <li key={c} className="flex gap-4 border-t border-ink/20 py-4">
                    <span className="text-[11px] font-medium text-faint shrink-0 pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15.5px] leading-[1.6]">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Where digital work changes it */}
        <section className="rule-b bg-paper-tint">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-16">
              <div className="col-span-12 lg:col-span-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute">WHERE IT MOVES</div>
                <p className="mt-2 text-[13px] leading-[1.55] opacity-70 max-w-[28ch]">
                  Typically. Not a promise about your organisation.
                </p>
              </div>
              <ul className="col-span-12 lg:col-span-9 mt-6 lg:mt-0">
                {industry.opportunities.map((o, i) => (
                  <li key={o} className="flex gap-4 border-t border-ink/20 py-4">
                    <span className="text-[11px] font-medium text-faint shrink-0 pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15.5px] leading-[1.6]">{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Scenario — explicitly illustrative */}
        {industry.scenarios.length > 0 && (
          <section className="rule-b">
            <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
              <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-16">
                <div className="col-span-12 lg:col-span-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute">ILLUSTRATIVE</div>
                  <p className="mt-2 text-[13px] leading-[1.55] opacity-70 max-w-[28ch]">
                    Illustrative, not client work. No organisation below is real.
                  </p>
                </div>
                <div className="col-span-12 lg:col-span-9 mt-6 lg:mt-0 space-y-6">
                  {industry.scenarios.map((s) => (
                    <div key={s} className="border border-ink p-5 bg-paper max-w-prose">
                      <div className="text-[10.5px] font-medium text-faint mb-2">
                        SCENARIO
                      </div>
                      <p className="text-[15px] leading-[1.65]">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Services that apply */}
        <section className="rule-b bg-paper-tint">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-16">
              <div className="col-span-12 lg:col-span-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute">WHAT APPLIES</div>
                <p className="mt-2 text-[13px] leading-[1.55] opacity-70 max-w-[28ch]">
                  {applied.length} services in this sector. Start with the problem, not the list.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-9 mt-6 lg:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {applied.map((s) => {
                  const division = divisions.find((d) => d.id === getCatalogService(s.slug)?.division);
                  return (
                    <a
                      key={s.slug}
                      href={s.href}
                      className="group flex flex-col gap-2 border border-ink bg-paper p-5 no-underline text-inherit transition-colors hover:bg-black hover:text-white"
                    >
                      {division && (
                        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute">
                          {division.n} / {division.title.toUpperCase()}
                        </span>
                      )}
                      <span className="font-display text-[18px] tracking-display leading-[1.2]">
                        {s.title}
                      </span>
                      <span className="text-[11px] font-medium text-mute mt-auto pt-3">
                        {t("common.readMore").toUpperCase()} →
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Other industries */}
        <section className="rule-b">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-12 sm:py-16">
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-mute mb-6">OTHER SECTORS</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {others.map((o) => (
                <a
                  key={o.slug}
                  href={`/industries/${o.slug}`}
                  className="group flex flex-col gap-2 border border-ink p-5 no-underline text-inherit transition-colors hover:bg-black hover:text-white"
                >
                  <span className="font-display text-[17px] tracking-display leading-tight">{o.title}</span>
                  <span className="text-[13px] leading-[1.5] opacity-80">{o.summary}</span>
                </a>
              ))}
            </div>
            <a
              href="/industries"
              className="inline-block mt-6 text-[13px] font-semibold border-b border-ink pb-0.5 hover:text-signal hover:border-signal transition-colors"
            >
              ALL {industries.length} INDUSTRIES →
            </a>
          </div>
        </section>

        <section className="bg-black text-white on-ink">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-16 sm:py-20">
            <h2 className="display-xl text-[30px] sm:text-[44px] max-w-[22ch] mb-5">
              Tell us where it <span className="italic">actually</span> breaks.
            </h2>
            <p className="text-[15.5px] leading-[1.7] max-w-prose opacity-85 mb-7">
              Sector specifics matter less than the specific process that is failing. Describe that
              and we can say something useful.
            </p>
            <a
              href="/#contact"
              className="inline-block btn-inverse"
            >
              {t("cta.requestAnalysis").toUpperCase()} →
            </a>
          </div>
        </section>
      </main>

      <SiteFooter mode="page" />
    </div>
  );
}
