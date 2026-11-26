import { CONTACT_EMAIL, NAV_ITEMS } from "@/lib/site";
import { useI18n, type TKey } from "@/lib/i18n";
import { services } from "@/data/services";

/**
 * The footer.
 *
 * Structurally it now opens with a real closing call to action rather than
 * dropping straight into a five-column directory. The old footer put the
 * studio's email address in 22px type and the navigation in 12px mono —
 * everything fought for the same volume, so nothing led. Here the CTA block is
 * unambiguously the loudest thing on the page, the directory below it is quiet,
 * and the legal strip is quieter still.
 */
export default function SiteFooter({ mode }: { mode: "home" | "page" }) {
  const { t, lang } = useI18n();
  const href = (anchor: string, path: string) => (mode === "home" ? anchor : path);

  return (
    <footer className="bg-night text-white">
      {/* Closing CTA — the loudest block in the footer. */}
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="grid grid-cols-12 gap-x-8 gap-y-10 border-b border-white/12 py-16 sm:py-20 lg:py-24">
          <div className="col-span-12 lg:col-span-8">
            <span className="eyebrow !text-white/45">Next step</span>
            <h2 className="display-xl mt-5 text-[38px] sm:text-[52px] lg:text-[64px] max-w-[17ch]">
              Ready to build a smarter digital business?
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:pt-3 flex flex-col items-start gap-5">
            <p className="text-[15px] leading-[1.65] text-white/65 max-w-[38ch]">
              Bring us the problem, not a specification. We reply to every brief
              within two working days, and we tell you honestly whether we are
              the right studio for it.
            </p>
            <a href={href("#contact", "/contact")} className="btn-inverse">
              Book a free consultation
              <span aria-hidden="true">→</span>
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-[14px] text-white/70 underline-offset-4 hover:text-white hover:underline transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-12 gap-x-8 gap-y-12">
          <div className="col-span-12 lg:col-span-4">
            <a
              href={mode === "home" ? "#top" : "/"}
              className="display-lg text-[22px] leading-none inline-block"
            >
              THE OFFICE 360<span className="align-super text-[9px] ml-0.5 text-white/40">®</span>
            </a>
            <p className="mt-5 text-[15px] leading-[1.7] text-white/70 max-w-[38ch]">
              {t("footer.statement")}
            </p>
            <p className="mt-4 text-[13.5px] leading-[1.7] text-white/45 max-w-[40ch]">
              Research, strategy, design and engineering on one brief — with a
              human making the judgment calls.
            </p>
            <div className="mt-7 flex items-center gap-2.5 text-[12.5px] text-white/55">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
              {t("footer.replyDetail")}
            </div>
          </div>

          <nav className="col-span-6 sm:col-span-3 lg:col-span-2 lg:col-start-6" aria-label="Footer navigation">
            <h3 className="eyebrow !text-white/40 mb-5">{t("footer.navigate")}</h3>
            <ul className="space-y-3 text-[14px]">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a href={href(item.anchor, item.href)} className="text-white/70 hover:text-white transition-colors">
                    {t(item.tkey as TKey)}
                  </a>
                </li>
              ))}
              <li><a href="/store" className="text-white/70 hover:text-white transition-colors">Store</a></li>
              <li><a href="/demos" className="text-white/70 hover:text-white transition-colors">Proof</a></li>
              <li><a href="/press" className="text-white/70 hover:text-white transition-colors">Press</a></li>
              <li><a href="/glossary" className="text-white/70 hover:text-white transition-colors">Glossary</a></li>
            </ul>
          </nav>

          <nav className="col-span-6 sm:col-span-3 lg:col-span-2" aria-label="Service divisions">
            <h3 className="eyebrow !text-white/40 mb-5">{t("footer.services")}</h3>
            <ul className="space-y-3 text-[14px]">
              {/* Each service links to its own page. These all used to point at
                  the homepage's #services anchor, so five links collapsed into
                  one destination. */}
              {services.map((s) => (
                <li key={s.slug}>
                  <a href={`/services/${s.slug}`} className="text-white/70 hover:text-white transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="/services" className="text-white hover:text-signal transition-colors font-medium">
                  All services →
                </a>
              </li>
            </ul>
          </nav>

          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <h3 className="eyebrow !text-white/40 mb-5">Also</h3>
            <ul className="space-y-3 text-[14px]">
              <li>
                <a href="/resources/backlist-audit-checklist" className="text-white/70 hover:text-white transition-colors">
                  Backlist audit checklist
                </a>
              </li>
              <li><a href="/notes" className="text-white/70 hover:text-white transition-colors">Field notes</a></li>
              <li><a href="/privacy" className="text-white/70 hover:text-white transition-colors">Privacy</a></li>
              <li><a href="/terms" className="text-white/70 hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
      </div>

      {lang === "pt" && (
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-3.5 text-[12px] text-white/50">
            {t("lang.note")}
          </div>
        </div>
      )}

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-5 flex flex-col gap-3 text-[12.5px] text-white/50 sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} THE OFFICE 360</div>
          <div className="sm:ml-auto flex items-center gap-5">
            <span className="hidden sm:inline">Four principals · Six divisions</span>
            <a href={mode === "home" ? "#top" : "/"} className="text-white/70 hover:text-white transition-colors">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
