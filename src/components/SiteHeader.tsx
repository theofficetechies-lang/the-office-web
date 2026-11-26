import { useEffect, useRef, useState } from "react";
import ManifestBar from "./ManifestBar";
import { NAV_ITEMS } from "@/lib/site";
import { useRoute } from "@/lib/router";
import { useI18n, type Lang, type TKey } from "@/lib/i18n";

const DESKTOP_QUERY = "(min-width: 1024px)";

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia(DESKTOP_QUERY).matches
  );

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return isDesktop;
}

/** EN / PT switcher. Persists the choice and is announced to assistive tech. */
function LangSwitcher() {
  const { lang, setLang } = useI18n();
  const options: { code: Lang; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "pt", label: "PT" },
  ];
  return (
    <div
      className="flex items-center border border-faint text-[11px] font-medium"
      role="group"
      aria-label="Language"
    >
      {options.map((o) => (
        <button
          key={o.code}
          type="button"
          onClick={() => setLang(o.code)}
          aria-pressed={lang === o.code}
          className={
            "px-2 py-[3px] cursor-pointer transition-colors " +
            (lang === o.code ? "bg-ink text-white font-semibold" : "text-mute hover:text-ink")
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Phase 12 — one header for every route, in EN or PT.
 * `mode="home"` links to on-page anchors; `mode="page"` links back to them with
 * absolute paths. Below `lg` the nav collapses into a real menu: focus moves
 * into it on open, Escape closes it, and the document behind it stops scrolling.
 */
/**
 * Is this nav item the page the visitor is on?
 *
 * The old header had no active state at all: every item looked identical
 * wherever you were. That is a real navigation failure on a 100-route site, not
 * just a missing flourish — it was the only way to know where you were, and it
 * did not exist. Derived from the route rather than a prop so it stays correct
 * on every page without each one passing it down.
 */
function isActive(item: { href: string }, route: { kind: string; slug?: string; id?: string }): boolean {
  const href = item.href;
  switch (href) {
    case "/about":
      return route.kind === "about";
    case "/contact":
      return route.kind === "contact";
    case "/work":
      return route.kind === "workIndex" || route.kind === "work";
    case "/insights":
      return route.kind === "insightsIndex" || route.kind === "note";
    case "/services":
      return (
        route.kind === "servicesIndex" ||
        route.kind === "service" ||
        route.kind === "division"
      );
    case "/industries":
      return route.kind === "industriesIndex" || route.kind === "industry";
    default:
      return false;
  }
}

export default function SiteHeader({ mode }: { mode: "home" | "page" }) {
  const route = useRoute();
  const [open, setOpen] = useState(false);
  const isDesktop = useIsDesktop();
  const { t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const menuOpen = open && !isDesktop;

  const target = (anchor: string, href: string) => (mode === "home" ? anchor : href);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClickAway = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickAway);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickAway);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  return (
    <>
      <ManifestBar />
      <header className="rule-b relative z-40 bg-white/95 backdrop-blur-[2px] sticky top-0">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 h-[68px] flex items-center gap-8">
          <a
            href={mode === "home" ? "#top" : "/"}
            className="display-lg text-[19px] leading-none shrink-0"
            aria-label="THE OFFICE 360 — home"
          >
            THE OFFICE 360
            <span className="align-super text-[9px] ml-0.5 text-mute">®</span>
          </a>

          <nav
            className="ml-auto hidden lg:flex items-center gap-7 text-[13px] font-medium"
            aria-label="Primary"
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(item, route);
              return (
                <a
                  key={item.tkey}
                  href={target(item.anchor, item.href)}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "relative py-1.5 transition-colors",
                    active
                      ? "text-ink after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:bg-signal"
                      : "text-charcoal/75 hover:text-ink",
                  ].join(" ")}
                >
                  {t(item.tkey as TKey)}
                </a>
              );
            })}
            <span className="w-px h-4 bg-faint" aria-hidden="true" />
            <LangSwitcher />
            <a href={target("/store", "/store")} className="text-charcoal/75 hover:text-ink transition-colors">
              {t("nav.store")}
            </a>
            <a href={target("/#contact", "/contact")} className="btn-primary !py-2.5 !px-4 !text-[12.5px]">
              {t("nav.startBrief")}
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-3 lg:hidden">
            <LangSwitcher />
            <a
              href={target("/#contact", "/contact")}
              className="btn-primary !py-2 !px-3 !text-[12px]"
            >
              {t("nav.brief")}
            </a>
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="border border-ink px-3 py-2 text-[12px] font-semibold cursor-pointer hover:bg-ink hover:text-white transition-colors"
            >
              {menuOpen ? "Close" : t("nav.menu")}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-menu" ref={panelRef} className="lg:hidden rule-t bg-white" aria-label="Mobile">
            <nav className="mx-auto max-w-[1440px] px-5 sm:px-8 py-2 flex flex-col">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item, route);
                return (
                  <a
                    key={item.tkey}
                    href={target(item.anchor, item.href)}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "flex items-baseline justify-between gap-4 py-4 border-b border-faint text-[24px] tracking-display font-semibold",
                      active ? "text-signal" : "text-ink",
                    ].join(" ")}
                  >
                    {t(item.tkey as TKey)}
                    <span className="text-[11px] font-medium text-mute">→</span>
                  </a>
                );
              })}
              <a
                href={target("/store", "/store")}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between gap-4 py-4 border-b border-faint text-[24px] tracking-display font-semibold text-ink"
              >
                {t("nav.store")}
                <span className="text-[11px] font-medium text-mute">→</span>
              </a>
              <a
                href={target("/#contact", "/contact")}
                onClick={() => setOpen(false)}
                className="btn-primary mt-5 mb-2 justify-center"
              >
                {t("nav.startBrief")}
              </a>
              <p className="pb-4 text-[11.5px] text-mute">
                theofficetechies@gmail.com
              </p>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
