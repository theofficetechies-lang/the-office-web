/**
 * Motion preference, read defensively so it is safe during SSR and in
 * environments without matchMedia (jsdom, older browsers).
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
