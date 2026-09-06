import { CONTACT_EMAIL, NAV_ITEMS } from "@/lib/site";
import { useI18n, type TKey } from "@/lib/i18n";
import { services } from "@/data/services";

/**
 * Phase 12 — the footer. Brand statement, navigation, services, contact,
 * legal. Only links that resolve to something real on this site.
 */
export default function SiteFooter({ mode }: { mode: "home" | "page" }) {
  const { t, lang } = useI18n();
  const href = (anchor: string, path: string) => (mode === "home" ? anchor : path);

  return (
    <footer className="border-t border-white/20 bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 lg:col-span-5">
            <div className="font-display text-[26px] sm:text-[30px] tracking-display leading-[1.1] max-w-[22ch]">
              A four-person studio for books, the web, automation, and research.
            </div>
            <p className="mt-5 text-[14px] leading-[1.65] opacity-75 max-w-[46ch]">
              Research, strategy, design and technology on one brief — with a
              human making the judgment calls. We take a small number of
              engagements each quarter.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-6 inline-block font-display text-[20px] sm:text-[22px] tracking-display border-b border-white/40 pb-1 hover:border-white transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <nav className="col-span-6 sm:col-span-4 lg:col-span-2 lg:col-start-7" aria-label="Footer navigation">
            <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-4">{t("footer.navigate").toUpperCase()}</div>
            <ul className="space-y-2.5 font-mono text-[12px] tracking-mono">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a href={href(item.anchor, item.href)} className="opacity-80 hover:opacity-100">
                    {t(item.tkey as TKey).toUpperCase()}
                  </a>
                </li>
              ))}
              <li><a href="/store" className="opacity-80 hover:opacity-100">STORE</a></li>
              <li><a href="/demos" className="opacity-80 hover:opacity-100">PROOF</a></li>
              <li><a href="/press" className="opacity-80 hover:opacity-100">PRESS</a></li>
              <li><a href="/glossary" className="opacity-80 hover:opacity-100">GLOSSARY</a></li>
            </ul>
          </nav>

          <nav className="col-span-6 sm:col-span-4 lg:col-span-2" aria-label="Services">
            <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-4">{t("footer.services").toUpperCase()}</div>
            <ul className="space-y-2.5 font-mono text-[12px] tracking-mono">
              {services.map((s) => (
                <li key={s.slug}>
                  <a
                    href={href("#services", "/#services")}
                    className="opacity-80 hover:opacity-100"
                  >
                    {s.title.toUpperCase()}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-12 sm:col-span-4 lg:col-span-2">
            <div className="font-mono text-[10.5px] tracking-mono opacity-60 mb-4">{t("footer.reply").toUpperCase()}</div>
            <p className="font-mono text-[12px] tracking-mono leading-[1.8] opacity-80">
              {t("footer.replyDetail").toUpperCase()}
            </p>
            <a
              href={href("#contact", "/#contact")}
              className="mt-5 inline-block bg-white text-black px-4 py-2.5 font-mono text-[11px] tracking-mono font-semibold hover:bg-transparent hover:text-white border border-white transition-colors"
            >
              START A BRIEF →
            </a>
          </div>
        </div>
      </div>

      {lang === "pt" && (
        <div className="border-t border-white/15">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-3 font-mono text-[10.5px] tracking-mono opacity-70">
            {t("lang.note")}
          </div>
        </div>
      )}

      <div className="border-t border-white/15">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-5 flex flex-col gap-3 font-mono text-[11px] tracking-mono opacity-80 sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} THE OFFICE 360.</div>
          <div className="hidden sm:block opacity-50">/</div>
          <nav className="flex items-center gap-4" aria-label="Legal">
            <a href="/privacy" className="opacity-80 hover:opacity-100 underline-offset-2 hover:underline">
              PRIVACY
            </a>
            <a href="/terms" className="opacity-80 hover:opacity-100 underline-offset-2 hover:underline">
              TERMS
            </a>
            <a href="/notes" className="opacity-80 hover:opacity-100 underline-offset-2 hover:underline">
              NOTES
            </a>
          </nav>
          <div className="sm:ml-auto">
            <a href={mode === "home" ? "#top" : "/"} className="opacity-80 hover:opacity-100">
              TOP ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
