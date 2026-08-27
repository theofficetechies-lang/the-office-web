import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/utils/motion";

/**
 * The other half of the signature element:
 * a single line that types itself out on load, then resolves.
 * Specific to a studio that works with prose.
 *
 * Reduced motion is resolved during the initial state computation, so the
 * full line is present on the very first paint rather than arriving via a
 * state update from an effect. Both the start timeout and the typing interval
 * are cleaned up on unmount — an earlier version only cleared the timeout and
 * left the interval running against an unmounted component.
 */
type Props = {
  text: string;
  speed?: number;
  className?: string;
  onDone?: () => void;
  startDelay?: number;
};

export default function Typewriter({
  text,
  speed = 38,
  className,
  onDone,
  startDelay = 600,
}: Props) {
  const [i, setI] = useState(() => (prefersReducedMotion() ? text.length : 0));
  const doneRef = useRef(false);

  useEffect(() => {
    const notify = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDone?.();
    };

    // Already complete (reduced motion, or nothing to type).
    if (prefersReducedMotion()) {
      notify();
      return;
    }

    let t: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      t = setInterval(() => {
        setI((prev) => {
          if (prev >= text.length) {
            if (t) clearInterval(t);
            notify();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = i >= text.length;
  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, i)}</span>
      {!done && <span className="caret" aria-hidden="true" />}
    </span>
  );
}
