import { useEffect, useState } from "react";

/**
 * The signature element: a persistent "MANIFEST" status bar at the very top.
 * Mono-typed data that ticks. Specific to a studio that works with words
 * (book strategy, research) — not a cursor follower, not a blob.
 *
 * The live clock and counter are decorative. They are hidden from assistive
 * tech (aria-hidden) so screen readers do not re-announce them on every tick.
 */
export default function ManifestBar() {
  const [now, setNow] = useState<string>("");
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const hh = d.getUTCHours().toString().padStart(2, "0");
      const mm = d.getUTCMinutes().toString().padStart(2, "0");
      const ss = d.getUTCSeconds().toString().padStart(2, "0");
      setNow(`${hh}:${mm}:${ss} UTC`);
    };
    fmt();
    const t = setInterval(fmt, 1000);
    // Count-up: illustrative. Label is "ACTIVE ENGAGEMENTS" and framed
    // as "—IL" in the UI to read as a rolling indicator rather than a
    // hard count. See A3.
    let n = 0;
    const target = 142;
    const step = setInterval(() => {
      n += 1;
      setCount(n);
      if (n >= target) clearInterval(step);
    }, 12);
    return () => {
      clearInterval(t);
      clearInterval(step);
    };
  }, []);

  return (
    <div
      className="ink-block font-mono text-[10.5px] sm:text-[11px] tracking-mono"
      aria-hidden="true"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-1.5 flex items-center gap-3 sm:gap-5 overflow-hidden whitespace-nowrap">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          <span className="font-semibold">MANIFEST</span>
        </span>
        <span className="opacity-60 hidden sm:inline">/</span>
        <span className="hidden sm:inline opacity-80">STATUS: ACCEPTING BRIEFS · Q1</span>
        <span className="opacity-60 hidden md:inline">/</span>
        <span className="hidden md:inline opacity-80">
          ACTIVE&nbsp;{count.toString().padStart(3, "0")}&nbsp;—IL
        </span>
        <span className="opacity-60 ml-auto">/</span>
        <span className="ml-auto sm:ml-0 opacity-90 tabular-nums">{now}</span>
      </div>
    </div>
  );
}
