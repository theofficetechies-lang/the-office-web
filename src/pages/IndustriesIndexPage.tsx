import { useEffect } from "react";
import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useI18n } from "@/lib/i18n";
import { industries } from "@/data/industries";

/**
 * Industries index — the 20 sectors, as routes rather than as a list of claims.
 *
 * Deliberately does NOT say "we have worked with X clients in this sector". The
 * studio has not published named clients in these sectors, and that fact is
 * stated on the page rather than quietly omitted, because a sector grid that
 * looks like a client list is a fabricated credential even when no name is given.
 */
export default function IndustriesIndexPage() {
  const { t } = useI18n();

  useDocumentMeta({
    title: "Industries — where the method is applied — THE OFFICE 360",
    description:
      "Twenty sectors, described by the pressures that are characteristic of them and the services that apply — not by clients we cannot evidence.",
    path: "/industries",
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
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-12 sm:py-20">
              <MarginRail
                sectionNum="I"
                sectionLabel="TWENTY SECTORS"
                folio="INDUSTRIES"
                note="Described by the pressure, not by a logo wall."
              />
              <div className="col-span-12 lg:col-span-10">
                <MobileFolioStrip sectionNum="I" sectionLabel="TWENTY SECTORS" folio="INDUSTRIES" />

                <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">INDUSTRIES</div>
                <h1 className="font-display tracking-display text-[36px] sm:text-[56px] lg:text-[68px] leading-[0.98] font-light max-w-[20ch] mb-5">
                  Applied to <span className="italic">your sector.</span>
                </h1>
                <p className="text-[17px] sm:text-[19px] leading-[1.6] max-w-prose opacity-90">
                  Each sector below is described by the operational pressures that are characteristic
                  of it, and by where digital work typically changes them. That is a different thing
                  from a client list, and it is the honest version of the same page.
                </p>

                <div className="mt-8 border border-black p-5 sm:p-6 max-w-prose">
                  <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-2">
                    A NOTE ON WHAT IS NOT HERE
                  </div>
                  <p className="text-[14px] leading-[1.65] opacity-85">
                    We have not attached client names, project counts, awards or results to these
                    sectors, because we cannot evidence them. What follows is an account of how these
                    businesses tend to work and which of our services apply. Every scenario is
                    labelled illustrative.
                  </p>
                </div>

                <div className="mt-6 font-mono text-[11px] tracking-mono opacity-60">
                  {industries.length} INDUSTRIES
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rule-b">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
            {industries.map((ind, i) => (
              <article
                key={ind.slug}
                className={i === 0 ? "py-8 sm:py-10" : "py-8 sm:py-10 border-t border-black"}
              >
                <div className="grid grid-cols-12 gap-x-6 gap-y-3">
                  <div className="col-span-12 sm:col-span-4">
                    <div className="font-mono text-[10.5px] tracking-mono opacity-50 mb-2">
                      {String(i + 1).padStart(2, "0")} / SECTOR
                    </div>
                    <h2 className="font-display text-2xl sm:text-[26px] tracking-display leading-[1.1]">
                      <a href={`/industries/${ind.slug}`} className="no-underline text-inherit hover:opacity-60">
                        {ind.title}
                      </a>
                    </h2>
                  </div>
                  <div className="col-span-12 sm:col-span-6">
                    <p className="text-[15px] leading-[1.6] max-w-prose">{ind.summary}</p>
                    <div className="mt-2 font-mono text-[10.5px] tracking-mono opacity-50">
                      {ind.services.length} SERVICES APPLY
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-2 sm:text-right">
                    <a
                      href={`/industries/${ind.slug}`}
                      className="inline-block border border-black px-3 py-2 font-mono text-[10.5px] tracking-mono font-semibold hover:bg-black hover:text-white transition-colors"
                    >
                      VIEW →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-black text-white on-ink">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-16 sm:py-20">
            <h2 className="font-display tracking-display text-[30px] sm:text-[44px] leading-[1.02] font-light max-w-[20ch] mb-5">
              Your sector is not on the list? <span className="italic">Say so.</span>
            </h2>
            <p className="text-[15.5px] leading-[1.7] max-w-prose opacity-85 mb-7">
              These twenty cover most of what we are asked about, not the limit of what we will look
              at. The method is the same; only the specifics change.
            </p>
            <a
              href="/#contact"
              className="inline-block bg-white text-black px-5 py-3 font-mono text-[12px] tracking-mono font-semibold border border-white hover:bg-transparent hover:text-white transition-colors"
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
