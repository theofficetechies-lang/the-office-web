import { useEffect, useRef, useState } from "react";
import ManifestBar from "./ManifestBar";
import { NAV_ITEMS } from "@/lib/site";

/**
 * Phase 12 — one header for every route.
 * `mode="home"` links to on-page anchors; `mode="page"` links back to them with
 * absolute paths. Below `md` the nav collapses into a real menu: focus moves
 * into it on open, Escape closes it, and the document behind it stops scrolling.
 */
export default function SiteHeader({ mode }: { mode: "home" | "page" }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const target = (anchor: string, href: string) => (mode === "home" ? anchor : href);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClickAway = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
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
  }, [open]);

  return (
    <>
      <ManifestBar />
      <header className="rule-b relative z-40 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-4 flex items-center gap-6">
          <a
            href={mode === "home" ? "#top" : "/"}
            className="font-display text-[20px] sm:text-[22px] tracking-display-tight font-semibold"
            aria-label="THE OFFICE — home"
          >
            THE&nbsp;OFFICE
            <span className="font-mono text-[10px] tracking-mono align-top ml-1 opacity-60">®</span>
          </a>

          <nav
            className="ml-auto hidden lg:flex items-center gap-5 xl:gap-7 font-mono text-[12px] tracking-mono"
            aria-label="Primary"
          >
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={target(item.anchor, item.href)} className="hover:opacity-60">
                {item.label.toUpperCase()}
              </a>
            ))}
            <a href={target("#contact", "/#contact")} className="ink-block px-3 py-1.5 font-semibold">
              START A BRIEF →
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-3 lg:hidden">
            <a
              href={target("#contact", "/#contact")}
              className="ink-block px-3 py-1.5 font-mono text-[11px] tracking-mono font-semibold"
            >
              BRIEF →
            </a>
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="border border-black px-3 py-1.5 font-mono text-[11px] tracking-mono font-semibold cursor-pointer hover:bg-black hover:text-white transition-colors"
            >
              {open ? "CLOSE [×]" : "MENU"}
            </button>
          </div>
        </div>

        {open && (
          <div
            id="mobile-menu"
            ref={panelRef}
            className="lg:hidden rule-t bg-white"
            aria-label="Mobile"
          >
            <nav className="mx-auto max-w-[1400px] px-4 sm:px-6 py-2 flex flex-col">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={target(item.anchor, item.href)}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between gap-4 py-3.5 border-b border-black/10 font-display text-[22px] tracking-display"
                >
                  {item.label}
                  <span className="font-mono text-[10px] tracking-mono opacity-50">→</span>
                </a>
              ))}
              <a
                href={target("#contact", "/#contact")}
                onClick={() => setOpen(false)}
                className="mt-4 mb-2 bg-black text-white px-4 py-3 text-center font-mono text-[12px] tracking-mono font-semibold"
              >
                SEND A BRIEF →
              </a>
              <p className="pb-4 font-mono text-[10.5px] tracking-mono opacity-60">
                theofficetechies@gmail.com
              </p>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
