import { useState } from "react";
import MarginRail from "../MarginRail";
import MobileFolioStrip from "../MobileFolioStrip";
import { useI18n, type Lang } from "@/lib/i18n";
import { faq } from "@/data/faq";

export default function FaqSection() {
  const { t, lang } = useI18n();
  const L: Lang = lang === "pt" ? "pt" : "en";
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="rule-b bg-paper-tint" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
          <MarginRail
            sectionNum="07"
            sectionLabel={t("section.faq").toUpperCase()}
            folio="PORTFOLIO VIII"
            note={lang === "pt" ? "Sem rodeios." : "No fluff."}
          />
          <div className="col-span-12 lg:col-span-10 reveal">
            <MobileFolioStrip
              sectionNum="07"
              sectionLabel={t("section.faq").toUpperCase()}
              folio="PORTFOLIO VIII"
            />
            <div className="mb-10 sm:mb-14">
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                07 / {t("section.faq").toUpperCase()}
              </div>
              <h2
                id="faq-heading"
                className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[18ch]"
              >
                {t("section.faqTitle")}
              </h2>
            </div>

            <div className="border-t border-black">
              {faq.map((item, i) => {
                const open = openIdx === i;
                return (
                  <div key={item.q.en} className="border-b border-black">
                    <button
                      type="button"
                      onClick={() => setOpenIdx(open ? null : i)}
                      aria-expanded={open}
                      aria-controls={`faq-panel-${i}`}
                      className="w-full flex items-baseline justify-between gap-6 py-5 text-left cursor-pointer"
                    >
                      <span className="font-display text-[20px] sm:text-[24px] tracking-display leading-tight">
                        {item.q[L]}
                      </span>
                      <span className="font-mono text-[14px] tracking-mono opacity-60 shrink-0">
                        {open ? "−" : "+"}
                      </span>
                    </button>
                    {open && (
                      <div id={`faq-panel-${i}`} className="pb-6">
                        <p className="text-[15px] leading-[1.7] max-w-prose opacity-90">{item.a[L]}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
