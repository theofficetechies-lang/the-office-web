import { useEffect } from "react";

/**
 * Phase 14 — scroll reveal.
 *
 * Two invariants matter here:
 *  - the hidden state lives behind a `.js` class on <html>, so a visitor with
 *    scripting disabled never sees an invisible page;
 *  - `prefers-reduced-motion` short-circuits straight to visible.
 *
 * `key` is the current route so a navigation re-scans for new elements.
 */
export function useReveal(key: string) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (els.length === 0) return;

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);
}
