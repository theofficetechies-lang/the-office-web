import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/utils/motion";

/**
 * The other half of the signature element:
 * a single line that types itself out on load, then resolves.
 * Specific to a studio that works with prose.
 *
 * Purely decorative — nothing else on the page waits on it. The full line is
 * exposed to assistive tech immediately via aria-label, and with reduced
 * motion it is rendered complete on the first paint.
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
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, i)}</span>
      {!done && <span className="caret" aria-hidden="true" />}
    </span>
  );
}
