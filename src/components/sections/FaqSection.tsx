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
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-16 sm:py-24">
          <MarginRail sectionNum="08" sectionLabel={t("section.faq")} />
          <div className="col-span-12 lg:col-span-10">
            <MobileFolioStrip sectionNum="08" sectionLabel={t("section.faq")} />
            <div className="mb-10 sm:mb-14">
              <span className="eyebrow">
                <span className="eyebrow-num">08</span> — {t("section.faq")}
              </span>
              <h2
                id="faq-heading"
                className="display-xl rule-accent mt-5 pb-6 text-[36px] sm:text-[54px] lg:text-[68px] max-w-[18ch]"
              >
                {t("section.faqTitle")}
              </h2>
            </div>

            <div className="max-w-[64rem] border-t border-ink">
              {faq.map((item, i) => {
                const open = openIdx === i;
                return (
                  <div key={item.q.en} className={["border-b border-faint", open ? "bg-paper" : ""].join(" ")}>
                    <button
                      type="button"
                      onClick={() => setOpenIdx(open ? null : i)}
                      aria-expanded={open}
                      aria-controls={`faq-panel-${i}`}
                      className="group w-full flex items-baseline justify-between gap-6 px-1 py-5 text-left cursor-pointer"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="text-[11px] font-semibold tabular-nums text-mute">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[19px] sm:text-[22px] font-semibold tracking-display leading-tight group-hover:text-signal transition-colors">
                          {item.q[L]}
                        </span>
                      </span>
                      <span
                        className="shrink-0 text-[18px] leading-none text-mute transition-transform duration-200"
                        style={{ transform: open ? "rotate(45deg)" : "none" }}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </button>
                    {open && (
                      <div id={`faq-panel-${i}`} className="pb-6 pl-[calc(1rem+2ch)] pr-1">
                        <p className="text-[15px] leading-[1.68] max-w-[62ch] text-charcoal/80">{item.a[L]}</p>
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
