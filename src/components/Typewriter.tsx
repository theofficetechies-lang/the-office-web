import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/utils/motion";

/**
 * The other half of the signature element:
 * a single line that types itself out on load, then resolves.
 * Specific to a studio that works with prose.
 *
 * Purely decorative — nothing else on the page waits on it. The full line is
 * exposed to assistive tech immediately, and with reduced motion it is rendered
 * complete on the first paint.
 *
 * That exposure used to be an aria-label on the wrapper <span>. It was wrong in a
 * way only a real rule engine notices: aria-label is prohibited on an element with
 * no role, so the attribute was ignored and the typed line had no accessible name
 * at all — the screen reader got the animated fragments and nothing else. The
 * wrapper now carries a visually-hidden copy of the finished line instead, which
 * needs no role and reads correctly while the visible text types itself out.
 *
 * Both the start timeout and the typing interval are cleaned up on unmount;
 * an earlier version only cleared the timeout and left the interval running
 * against an unmounted component.
 */
type Props = {
  text: string;
  speed?: number;
  className?: string;
  startDelay?: number;
};

export default function Typewriter({ text, speed = 38, className, startDelay = 600 }: Props) {
  const [i, setI] = useState(() => (prefersReducedMotion() ? text.length : 0));

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let t: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      t = setInterval(() => {
        setI((prev) => {
          if (prev >= text.length) {
            if (t) clearInterval(t);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(start);
      if (t) clearInterval(t);
    };
  }, [text, speed, startDelay]);

  const done = i >= text.length;
  return (
    <span className={className}>
      {/* Read in full, once, regardless of how far the animation has got. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{text.slice(0, i)}</span>
      {!done && <span className="caret" aria-hidden="true" />}
    </span>
  );
}
