import MarginRail from "@/components/MarginRail";
import MobileFolioStrip from "@/components/MobileFolioStrip";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SkipLink from "@/components/SkipLink";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useI18n, type Lang } from "@/lib/i18n";
import { glossary } from "@/data/glossary";

export default function GlossaryPage() {
  const { lang } = useI18n();
  const L: Lang = lang === "pt" ? "pt" : "en";

  useDocumentMeta({
    title: L === "pt" ? "Glossário — THE OFFICE" : "Publishing glossary — THE OFFICE",
    description:
      L === "pt"
        ? "Termos de edição, posicionamento e sistemas, explicados em linguagem simples."
        : "Publishing, positioning and systems terms, explained in plain language.",
    path: "/glossary",
  });

  return (
    <div className="min-h-screen bg-paper text-charcoal flex flex-col">
      <SkipLink />
      <SiteHeader mode="page" />

      <main id="main" className="flex-1 py-14 sm:py-20" aria-labelledby="glossary-heading">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10">
            <MarginRail
              sectionNum="G"
              sectionLabel="GLOSSARY"
              folio="GLOSSARY"
              note={L === "pt" ? "Definições, não claims." : "Definitions, not claims."}
            />
            <div className="col-span-12 lg:col-span-10">
              <MobileFolioStrip sectionNum="G" sectionLabel="GLOSSARY" folio="GLOSSARY" />
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">GLOSSARY</div>
              <h1
                id="glossary-heading"
                className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[20ch] mb-10"
              >
                {L === "pt" ? "O vocabulário do ofício." : "The vocabulary of the trade."}
              </h1>

              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {glossary.map((term) => (
                  <div key={term.term.en} className="border-t border-black pt-4">
                    <dt className="font-display text-[20px] sm:text-[22px] tracking-display leading-tight mb-2">
                      {term.term[L]}
                    </dt>
                    <dd className="text-[14.5px] leading-[1.65] opacity-90 max-w-prose">{term.def[L]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter mode="page" />
    </div>
  );
}
