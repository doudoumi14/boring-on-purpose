"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a figure up when it first appears. Not decoration: a number that
 * animates into place draws the eye, and after five questions the target is the
 * thing worth looking at.
 *
 * Reduced motion is handled by running the same loop with a zero duration
 * rather than by branching to an early setState, which keeps every update
 * inside the animation frame instead of firing one synchronously from the
 * effect.
 */
export function CountUp({
  value,
  format,
  durationMs = 900,
}: {
  value: number;
  format: (v: number) => string;
  durationMs?: number;
}) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 0 : durationMs;
    const start = performance.now();
    const origin = from.current;
    let frame = 0;

    const tick = (now: number) => {
      const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      // easeOutCubic: quick at first, settles rather than stopping dead.
      const eased = 1 - Math.pow(1 - progress, 3);
      setShown(origin + (value - origin) * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else from.current = value;
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs]);

  return <span className="tabular-nums">{format(shown)}</span>;
}
