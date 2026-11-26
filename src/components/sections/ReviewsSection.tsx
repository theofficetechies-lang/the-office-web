import MarginRail from "../MarginRail";
import MobileFolioStrip from "../MobileFolioStrip";
import { useI18n, type Lang } from "@/lib/i18n";
import { reviews, reviewSources, reviewsStatement, communicationStandards, linkedinProfiles, businessAddress } from "@/data/reviews";
import { CONTACT_EMAIL } from "@/lib/site";

/**
 * Verified-only reviews. With none on file, renders the honest statement and a
 * references-on-request route instead of inventing testimonials.
 */
export default function ReviewsSection() {
  const { t, lang } = useI18n();
  const L: Lang = lang === "pt" ? "pt" : "en";
  const verified = reviews.filter((r) => r.verified);

  return (
    <section id="reviews" className="rule-b" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-16 sm:py-24">
          <MarginRail sectionNum="07" sectionLabel={t("section.reviews")} />
          <div className="col-span-12 lg:col-span-10">
            <MobileFolioStrip sectionNum="07" sectionLabel={t("section.reviews")} />
            <div className="mb-10 sm:mb-14">
              <span className="eyebrow">
                <span className="eyebrow-num">07</span> — {t("section.reviews")}
              </span>
              <h2
                id="reviews-heading"
                className="display-xl mt-5 text-[36px] sm:text-[54px] lg:text-[68px] max-w-[18ch]"
              >
                {t("section.reviewsTitle")}
              </h2>
            </div>

            {verified.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {verified.map((r) => (
                  <figure key={r.name} className="flex flex-col gap-4 border-t border-ink pt-5">
                    <blockquote className="text-[19px] sm:text-[20px] font-medium tracking-display leading-[1.4]">
                      “{r.quote}”
                    </blockquote>
                    <figcaption className="text-[12px] text-mute mt-auto">
                      — {r.name}, {r.role}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="border border-ink bg-paper-tint p-6 sm:p-8">
                <p className="text-[15.5px] leading-[1.7] max-w-prose">{reviewsStatement[L]}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                      lang === "pt" ? "Pedido de referências" : "Request for references"
                    )}`}
                    className="btn-primary"
                  >
                    {lang === "pt" ? "Pedir referências" : "Ask for references"}
                    <span aria-hidden="true">→</span>
                  </a>
                  {reviewSources.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      className="text-[13px] font-semibold border-b border-ink pb-0.5 hover:text-signal hover:border-signal transition-colors"
                    >
                      {s.label} →
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="border border-faint bg-paper p-6">
                <h3 className="eyebrow mb-4">
                  {lang === "pt" ? "Padrões de comunicação" : "Communication standards"}
                </h3>
                <ul className="space-y-2.5 text-[14px] leading-[1.6] text-charcoal/85">
                  {communicationStandards[L].map((c) => (
                    <li key={c} className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-[9px] h-px w-2.5 shrink-0 bg-faint" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-faint bg-paper p-6">
                <h3 className="eyebrow mb-4">
                  {lang === "pt" ? "Verificação" : "Verification"}
                </h3>
                {linkedinProfiles.length > 0 ? (
                  <ul className="space-y-2 text-[14px]">
                    {linkedinProfiles.map((l) => (
                      <li key={l.href}>
                        <a href={l.href} className="underline">{l.name} — LinkedIn</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[14px] leading-[1.6] text-charcoal/80">
                    {lang === "pt"
                      ? "Perfis de LinkedIn e morada publicados assim que fornecidos. Referências falam em privado, a pedido sério."
                      : "LinkedIn profiles and a business address appear here as soon as they are supplied. References speak privately, upon serious inquiry."}
                  </p>
                )}
                {businessAddress && (
                  <p className="mt-3 text-[12px] text-mute">{businessAddress}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
