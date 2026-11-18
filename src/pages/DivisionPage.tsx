import { useEffect } from "react";
import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useI18n } from "@/lib/i18n";
import { getDivision, divisions } from "@/data/divisions";
import { flagshipInDivision, catalogueInDivision } from "@/data/serviceCatalog";
import { resolveRelated } from "@/data/serviceDetailIndex";
import { industries } from "@/data/industries";
import { services as publishedServices } from "@/data/services";

/**
 * Division hub — the parent page for a group of services.
 *
 * This is where the two-tier catalogue resolves: flagship services link to their
 * own pages, and the remaining services in the division are anchored entries
 * here. Keeping the catalogue tier on the hub (rather than spinning up 127 thin
 * pages) is what stops the expansion becoming a set of doorway pages.
 */
export default function DivisionPage({ id }: { id: string }) {
  const { t } = useI18n();
  const division = getDivision(id);

  useDocumentMeta({
    title: division
      ? `${division.title} — Services — THE OFFICE 360`
      : "Division not found — THE OFFICE 360",
    description: division?.tagline ?? "That division is not in the archive.",
    path: `/services/${id}`,
    noindex: !division,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [id]);

  if (!division) {
    return (
      <div className="min-h-screen bg-paper text-charcoal flex flex-col">
        <SkipLink />
        <SiteHeader mode="page" />
        <main id="main" className="flex-1">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-20">
            <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">404 / DIVISION</div>
            <h1 className="font-display tracking-display text-[36px] sm:text-[56px] leading-[1] font-light max-w-[18ch] mb-6">
              That division is not in the archive.
            </h1>
            <a href="/services" className="inline-block bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors">
              ALL SERVICES →
            </a>
          </div>
        </main>
        <SiteFooter mode="page" />
      </div>
    );
  }

  const flagship = flagshipInDivision(division.id)
    .map((s) => resolveRelated(s.slug))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));
  const catalogue = catalogueInDivision(division.id);

  /*
   * The five published services belong to the publishing division. They are not
   * duplicated in the catalogue (their URLs are already live and ranked), so they
   * are surfaced here explicitly rather than silently missing from the hub.
   */
  const publishedInDivision =
    division.id === "publishing" ? publishedServices : [];

  // Which industries reference this division's services.
  const relevantIndustries = industries
    .filter((ind) =>
      ind.services.some((s) => flagship.some((f) => f.slug === s) || catalogue.some((c) => c.slug === s))
    )
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1">
        <section className="rule-b">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-20">
              <MarginRail
                sectionNum={division.n}
                sectionLabel={division.title.toUpperCase()}
                folio="SERVICES"
                note={`${flagship.length + catalogue.length + publishedInDivision.length} services in this division.`}
              />
              <div className="col-span-12 lg:col-span-10">
                <MobileFolioStrip sectionNum={division.n} sectionLabel={division.title.toUpperCase()} folio="SERVICES" />

                <nav aria-label="Breadcrumb" className="font-mono text-[11px] tracking-mono opacity-60 mb-8 flex flex-wrap items-center gap-2">
                  <a href="/services" className="hover:opacity-100 underline-offset-2 hover:underline">SERVICES</a>
                  <span aria-hidden="true">/</span>
                  <span aria-current="page" className="opacity-100">{division.title.toUpperCase()}</span>
                </nav>

                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                  {division.n} / DIVISION
                </div>
                <h1 className="font-display tracking-display text-[34px] sm:text-[52px] lg:text-[60px] leading-[1] font-light max-w-[24ch] mb-5">
                  {division.title}
                </h1>
                <p className="text-[17px] sm:text-[19px] leading-[1.6] max-w-prose opacity-90 mb-4">
                  {division.tagline}
                </p>
                <p className="text-[15.5px] leading-[1.7] max-w-prose opacity-85">{division.intro}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Flagship services — full pages */}
        <section className="rule-b">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-16">
              <div className="col-span-12 lg:col-span-3">
                <div className="font-mono text-[11px] tracking-mono opacity-60">FULL SERVICE PAGES</div>
              </div>
              <div className="col-span-12 lg:col-span-9 mt-6 lg:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {flagship.map((s) => (
                  <a key={s.slug} href={s.href} className="group flex flex-col gap-2 border border-black p-5 no-underline text-inherit transition-colors hover:bg-black hover:text-white">
                    <span className="font-display text-[19px] tracking-display leading-[1.2]">{s.title}</span>
                    <span className="font-mono text-[11px] tracking-mono opacity-70 mt-auto pt-3">
                      {t("common.readMore").toUpperCase()} →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Published services (publishing division only) */}
        {publishedInDivision.length > 0 && (
          <section className="rule-b bg-paper-tint">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
              <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-16">
                <div className="col-span-12 lg:col-span-3">
                  <div className="font-mono text-[11px] tracking-mono opacity-60">THE STUDIO'S CORE PRACTICE</div>
                  <p className="mt-2 text-[13px] leading-[1.55] opacity-70 max-w-[26ch]">
                    The five services the studio was built on.
                  </p>
                </div>
                <div className="col-span-12 lg:col-span-9 mt-6 lg:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {publishedInDivision.map((s) => (
                    <a key={s.slug} href={`/services/${s.slug}`} className="group flex flex-col gap-2 border border-black bg-paper p-5 no-underline text-inherit transition-colors hover:bg-black hover:text-white">
                      <span className="font-mono text-[10.5px] tracking-mono opacity-60">{s.n}</span>
                      <span className="font-display text-[19px] tracking-display leading-[1.2]">{s.title}</span>
                      <span className="text-[13px] leading-[1.5] opacity-80">{s.tagline}</span>
                      <span className="font-mono text-[11px] tracking-mono opacity-70 mt-auto pt-3">
                        {t("common.readMore").toUpperCase()} →
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Catalogue services — anchored entries on this hub */}
        {catalogue.length > 0 && (
          <section className="rule-b">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
              <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-16">
                <div className="col-span-12 lg:col-span-3">
                  <div className="font-mono text-[11px] tracking-mono opacity-60">ALSO IN THIS DIVISION</div>
                  <p className="mt-2 text-[13px] leading-[1.55] opacity-70 max-w-[28ch]">
                    {catalogue.length} services we scope within a wider engagement. Ask about any of them in a brief.
                  </p>
                </div>
                <ul className="col-span-12 lg:col-span-9 mt-6 lg:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  {catalogue.map((s) => (
                    <li key={s.slug} id={s.slug} className="border-t border-black/20 py-3 scroll-mt-24">
                      <span className="text-[15px] leading-[1.5]">{s.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Relevant industries */}
        {relevantIndustries.length > 0 && (
          <section className="rule-b bg-paper-tint">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-12 sm:py-16">
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-6">WHERE THIS APPLIES</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relevantIndustries.map((ind) => (
                  <a key={ind.slug} href={`/industries/${ind.slug}`} className="group flex flex-col gap-2 border border-black bg-paper p-5 no-underline text-inherit transition-colors hover:bg-black hover:text-white">
                    <span className="font-display text-[18px] tracking-display leading-tight">{ind.title}</span>
                    <span className="text-[13px] leading-[1.5] opacity-80">{ind.summary}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Other divisions */}
        <section className="rule-b">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-12 sm:py-16">
            <div className="font-mono text-[11px] tracking-mono opacity-60 mb-6">OTHER DIVISIONS</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {divisions
                .filter((d) => d.id !== division.id)
                .slice(0, 3)
                .map((d) => (
                  <a key={d.id} href={`/services/${d.id}`} className="group flex flex-col gap-2 border border-black p-5 no-underline text-inherit transition-colors hover:bg-black hover:text-white">
                    <span className="font-mono text-[10.5px] tracking-mono opacity-60">{d.n}</span>
                    <span className="font-display text-[18px] tracking-display leading-tight">{d.title}</span>
                  </a>
                ))}
            </div>
          </div>
        </section>

        <section className="bg-black text-white on-ink">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-16 sm:py-20">
            <h2 className="font-display tracking-display text-[30px] sm:text-[44px] leading-[1.02] font-light max-w-[22ch] mb-5">
              Not sure which of these you need? <span className="italic">That is normal.</span>
            </h2>
            <p className="text-[15.5px] leading-[1.7] max-w-prose opacity-85 mb-7">
              Describe the problem and we will tell you which service fits — or that none does.
            </p>
            <a href="/#contact" className="inline-block bg-white text-black px-5 py-3 font-mono text-[12px] tracking-mono font-semibold border border-white hover:bg-transparent hover:text-white transition-colors">
              {t("cta.requestAnalysis").toUpperCase()} →
            </a>
          </div>
        </section>
      </main>

      <SiteFooter mode="page" />
    </div>
  );
}
