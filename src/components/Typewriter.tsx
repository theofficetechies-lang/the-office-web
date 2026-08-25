import { useEffect, useState } from "react";

/**
 * The other half of the signature element:
 * a single line that types itself out on load, then resolves.
 * Specific to a studio that works with prose.
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
  const [i, setI] = useState(0);

  useEffect(() => {
    // Check reduced motion: render full text instantly
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setI(text.length);
      onDone?.();
      return;
    }
    const start = setTimeout(() => {
      const t = setInterval(() => {
        setI((prev) => {
          if (prev >= text.length) {
            clearInterval(t);
            onDone?.();
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }, startDelay);
    return () => clearTimeout(start);
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
