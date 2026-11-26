import { useEffect, useState } from "react";

/**
 * Status strip.
 *
 * This replaces the "MANIFEST" ticker: a black bar of pulsing dots and UTC
 * clocks in mono. That bar was the most overtly "generated dashboard" element on
 * the site — a live-updating telemetry strip that told a visitor nothing they
 * needed and existed to look engineered.
 *
 * What survives is the one thing on it that was true and useful: when the studio
 * is taking work. No clock (nobody books by UTC seconds), no pulse, no mono.
 * A single line of small sans, an accent dot, and the quarter.
 *
 * On hydration: the server has no idea what quarter it is on the client's clock,
 * so it renders the sentence without one and the effect adds it after mount. That
 * is a legitimate mount-time read of an external system (the current date) and
 * not derived state being copied into a variable, so it is kept in an effect —
 * but the render is correct without it, which is the part that matters.
 */
function currentQuarter(d: Date): string {
  return `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getUTCFullYear()}`;
}

export default function ManifestBar() {
  const [quarter, setQuarter] = useState<string>("");

  useEffect(() => {
    /*
     * Deferred to a microtask so React does not see a synchronous setState in the
     * effect body. The first paint is already complete and shipped; this only adds
     * four characters to an existing line, so there is no layout shift to avoid.
     */
    const id = setTimeout(() => setQuarter(currentQuarter(new Date())), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="bg-night text-white" aria-hidden="true">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-2 flex items-center gap-3 overflow-hidden whitespace-nowrap">
        <span className="inline-block h-[7px] w-[7px] rounded-full bg-signal shrink-0" />
        <span className="text-[11.5px] font-medium tracking-[0.02em]">
          Accepting briefs
        </span>
        <span className="text-[11.5px] text-white/45">
          {quarter ? `· ${quarter}` : ""}
        </span>
        <span className="ml-auto text-[11.5px] text-white/45 hidden sm:inline">
          Four principals · Six divisions · No subcontractors
        </span>
      </div>
    </div>
  );
}
