import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useI18n } from "@/lib/i18n";
import { processStages, processCaveat } from "@/data/process";

/**
 * Part 2 §5 — the canonical methodology page. Stage names here are the single
 * source of truth; the email, the homepage strip and this page all agree.
 */
export default function MethodologyPage() {
  const { lang } = useI18n();
  const P = lang === "pt";

  useDocumentMeta({
    title: P ? "Metodologia — THE OFFICE" : "Methodology — THE OFFICE",
    description: P
      ? "Seis etapas: Discovery, Analysis, Strategy, Implementation, Measurement, Optimization. O que acontece e o que recebe em cada uma."
      : "Six stages: Discovery, Analysis, Strategy, Implementation, Measurement, Optimization. What happens and what you receive at each.",
    path: "/methodology",
  });

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1 py-14 sm:py-20" aria-labelledby="methodology-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10">
            <MarginRail
              sectionNum="M"
              sectionLabel="METHODOLOGY"
              folio="METHOD"
              note={P ? "Evidência entra, estratégia sai." : "Evidence in, strategy out."}
            />
            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip sectionNum="M" sectionLabel="METHODOLOGY" folio="METHOD" />
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                {P ? "METODOLOGIA" : "METHODOLOGY"}
              </div>
              <h1
                id="methodology-heading"
                className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[20ch] mb-10"
              >
                {P ? "Seis etapas. Evidência entra, estratégia sai." : "Six stages. Evidence in, strategy out."}
              </h1>

              <div className="border-t border-black">
                {processStages.map((stage) => (
                  <div key={stage.n} className="grid grid-cols-12 gap-x-6 border-b border-black py-6">
                    <div className="col-span-2 sm:col-span-1 font-mono text-[12px] tracking-mono opacity-50 pt-1">
                      {stage.n}
                    </div>
                    <div className="col-span-10 sm:col-span-3">
                      <h2 className="font-display text-[22px] sm:text-[26px] tracking-display leading-tight">
                        {stage.title}
                      </h2>
                      <div className="font-mono text-[10.5px] tracking-mono opacity-60 mt-1">{stage.weight}</div>
                    </div>
                    <div className="col-span-12 sm:col-span-4 mt-3 sm:mt-0">
                      <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-1.5">
                        {P ? "O QUE ACONTECE" : "WHAT HAPPENS"}
                      </div>
                      <p className="text-[14.5px] leading-[1.65] opacity-90">{stage.happens}</p>
                    </div>
                    <div className="col-span-12 sm:col-span-4 mt-3 sm:mt-0">
                      <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-1.5">
                        {P ? "O QUE RECEBE" : "WHAT YOU RECEIVE"}
                      </div>
                      <p className="text-[14.5px] leading-[1.65] opacity-90">{stage.receive}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-12 border-l-2 border-black pl-5 text-[15px] leading-[1.7] max-w-prose opacity-90">
                {processCaveat}
              </p>

              <div className="mt-10">
                <a
                  href="/#contact"
                  className="inline-block bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors"
                >
                  {P ? "PEDIR UMA ANÁLISE →" : "REQUEST AN ANALYSIS →"}
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
