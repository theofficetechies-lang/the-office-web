import MarginRail from "../MarginRail";
import MobileFolioStrip from "../MobileFolioStrip";
import { useI18n, type Lang } from "@/lib/i18n";
import { pricingTiers, pricingNote } from "@/data/pricing";

export default function PricingSection() {
  const { t, lang } = useI18n();
  const L: Lang = lang === "pt" ? "pt" : "en";

  return (
    <section id="pricing" className="rule-b" aria-labelledby="pricing-heading">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
          <MarginRail
            sectionNum="08"
            sectionLabel={t("section.pricing").toUpperCase()}
            folio="PORTFOLIO IX"
            note={lang === "pt" ? "Preço fixo, âmbito fixo." : "Fixed price, fixed scope."}
          />
          <div className="col-span-12 lg:col-span-10 reveal">
            <MobileFolioStrip
              sectionNum="08"
              sectionLabel={t("section.pricing").toUpperCase()}
              folio="PORTFOLIO IX"
            />
            <div className="mb-10 sm:mb-14">
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                08 / {t("section.pricing").toUpperCase()}
              </div>
              <h2
                id="pricing-heading"
                className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[18ch]"
              >
                {t("section.pricingTitle")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {pricingTiers.map((tier) => (
                <div key={tier.key} className="flex flex-col border border-black p-6">
                  <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-60 mb-3">
                    {tier.cadence[L]}
                  </div>
                  <h3 className="font-display text-[24px] tracking-display leading-tight mb-3">
                    {tier.name[L]}
                  </h3>
                  <p className="text-[14px] leading-[1.6] opacity-90 mb-5">{tier.blurb[L]}</p>
                  <ul className="space-y-2 text-[13.5px] leading-[1.55] mt-auto">
                    {tier.includes[L].map((inc) => (
                      <li key={inc} className="flex gap-2">
                        <span aria-hidden="true" className="opacity-50">
                          —
                        </span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="mt-8 border-l-2 border-black pl-5 text-[14.5px] leading-[1.7] max-w-prose opacity-90">
              {pricingNote[L]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
