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
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="grid grid-cols-12 gap-x-6 sm:gap-x-10 py-14 sm:py-20">
          <MarginRail
            sectionNum="09"
            sectionLabel={t("section.reviews").toUpperCase()}
            folio="PORTFOLIO X"
            note={lang === "pt" ? "Nada inventado." : "Nothing invented."}
          />
          <div className="col-span-12 lg:col-span-10 reveal">
            <MobileFolioStrip
              sectionNum="09"
              sectionLabel={t("section.reviews").toUpperCase()}
              folio="PORTFOLIO X"
            />
            <div className="mb-10 sm:mb-14">
              <div className="font-mono text-[11px] tracking-mono opacity-60 mb-4">
                09 / {t("section.reviews").toUpperCase()}
              </div>
              <h2
                id="reviews-heading"
                className="font-display tracking-display text-[36px] sm:text-[52px] lg:text-[68px] leading-[0.98] font-light max-w-[18ch]"
              >
                {t("section.reviewsTitle")}
              </h2>
            </div>

            {verified.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {verified.map((r) => (
                  <figure key={r.name} className="flex flex-col gap-4 border-t border-black pt-5">
                    <blockquote className="font-display text-[19px] sm:text-[20px] tracking-display leading-[1.35]">
                      “{r.quote}”
                    </blockquote>
                    <figcaption className="font-mono text-[11px] tracking-mono opacity-70 mt-auto">
                      — {r.name}, {r.role}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="border border-black bg-paper-tint p-6 sm:p-8">
                <p className="text-[15.5px] leading-[1.7] max-w-prose">{reviewsStatement[L]}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                      lang === "pt" ? "Pedido de referências" : "Request for references"
                    )}`}
                    className="bg-black text-white px-5 py-3 font-mono text-[12px] tracking-mono font-semibold hover:bg-black/85 transition-colors"
                  >
                    {lang === "pt" ? "PEDIR REFERÊNCIAS →" : "ASK FOR REFERENCES →"}
                  </a>
                  {reviewSources.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      className="font-mono text-[12px] tracking-mono font-semibold border-b border-black"
                    >
                      {s.label} →
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="border border-black p-6">
                <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-60 mb-4">
                  {lang === "pt" ? "Padrões de comunicação" : "Communication standards"}
                </div>
                <ul className="space-y-2.5 text-[14px] leading-[1.6]">
                  {communicationStandards[L].map((c) => (
                    <li key={c} className="flex gap-2">
                      <span aria-hidden="true" className="opacity-50">—</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-black p-6">
                <div className="font-mono text-[10.5px] tracking-mono uppercase opacity-60 mb-4">
                  {lang === "pt" ? "Verificação" : "Verification"}
                </div>
                {linkedinProfiles.length > 0 ? (
                  <ul className="space-y-2 text-[14px]">
                    {linkedinProfiles.map((l) => (
                      <li key={l.href}>
                        <a href={l.href} className="underline">{l.name} — LinkedIn</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[14px] leading-[1.6] opacity-85">
                    {lang === "pt"
                      ? "Perfis de LinkedIn e morada publicados assim que fornecidos. Referências falam em privado, a pedido sério."
                      : "LinkedIn profiles and a business address appear here as soon as they are supplied. References speak privately, upon serious inquiry."}
                  </p>
                )}
                {businessAddress && (
                  <p className="mt-3 font-mono text-[12px] tracking-mono opacity-80">{businessAddress}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
