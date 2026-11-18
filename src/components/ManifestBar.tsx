import { useEffect, useState } from "react";

/**
 * The signature element: a persistent "MANIFEST" status bar at the very top.
 * Mono-typed data that ticks. Specific to a studio that works with words
 * (book strategy, research) — not a cursor follower, not a blob.
 *
 * Everything in here is verifiable: the live UTC clock and the current
 * quarter. The bar used to count up to an invented "active engagements"
 * figure; that has been removed, because the studio does not publish numbers
 * it cannot back up.
 */
function currentQuarter(d: Date): string {
  return `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getUTCFullYear()}`;
}

export default function ManifestBar() {
  const [now, setNow] = useState<string>("");
  const [quarter, setQuarter] = useState<string>("");

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const hh = d.getUTCHours().toString().padStart(2, "0");
      const mm = d.getUTCMinutes().toString().padStart(2, "0");
      const ss = d.getUTCSeconds().toString().padStart(2, "0");
      setNow(`${hh}:${mm}:${ss} UTC`);
      setQuarter(currentQuarter(d));
    };
    fmt();
    const t = setInterval(fmt, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="ink-block font-mono text-[10.5px] sm:text-[11px] tracking-mono"
      aria-hidden="true"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-1.5 flex items-center gap-3 sm:gap-5 overflow-hidden whitespace-nowrap">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
          <span className="font-semibold">MANIFEST</span>
        </span>
        <span className="opacity-60 hidden sm:inline">/</span>
        <span className="hidden sm:inline opacity-80">
          STATUS: ACCEPTING BRIEFS · {quarter}
        </span>
        <span className="opacity-60 hidden md:inline">/</span>
        <span className="hidden md:inline opacity-80">
          FOUR PEOPLE · NO SUBCONTRACTORS
        </span>
        <span className="opacity-60 ml-auto">/</span>
        <span className="ml-auto sm:ml-0 opacity-90 tabular-nums">{now}</span>
      </div>
    </div>
  );
}
