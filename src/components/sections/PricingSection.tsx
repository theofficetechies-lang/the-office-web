import MarginRail from "../MarginRail";
import MobileFolioStrip from "../MobileFolioStrip";
import { useI18n, type Lang } from "@/lib/i18n";
import { pricingTiers, pricingNote } from "@/data/pricing";

export default function PricingSection() {
  const { t, lang } = useI18n();
  const L: Lang = lang === "pt" ? "pt" : "en";

  return (
    <section id="pricing" className="rule-b" aria-labelledby="pricing-heading">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-16 sm:py-24">
          <MarginRail sectionNum="09" sectionLabel={t("section.pricing")} />
          <div className="col-span-12 lg:col-span-10">
            <MobileFolioStrip sectionNum="09" sectionLabel={t("section.pricing")} />
            <div className="mb-10 sm:mb-14">
              <span className="eyebrow">
                <span className="eyebrow-num">09</span> — {t("section.pricing")}
              </span>
              <h2
                id="pricing-heading"
                className="display-xl mt-5 text-[36px] sm:text-[54px] lg:text-[68px] max-w-[18ch]"
              >
                {t("section.pricingTitle")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-faint border border-faint">
              {pricingTiers.map((tier) => (
                <div key={tier.key} className="flex flex-col bg-paper p-6 sm:p-7">
                  <span className="eyebrow mb-3">{tier.cadence[L]}</span>
                  <h3 className="text-[22px] font-semibold tracking-display leading-tight mb-3">
                    {tier.name[L]}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-charcoal/80 mb-5">{tier.blurb[L]}</p>
                  <ul className="mt-auto space-y-2 text-[13.5px] leading-[1.55] text-charcoal/85">
                    {tier.includes[L].map((inc) => (
                      <li key={inc} className="flex gap-2.5">
                        <span aria-hidden="true" className="mt-[8px] h-px w-2.5 shrink-0 bg-faint" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="mt-8 max-w-[62ch] border-l-2 border-signal pl-5 text-[14.5px] leading-[1.7] text-charcoal/85">
              {pricingNote[L]}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
