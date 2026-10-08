"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 700;
const ease = (t: number) => 1 - (1 - t) ** 3;

/**
 * A number that glides to its new value (the walkthrough's count-up): from 0 on first show, then
 * from wherever it was. Off, it returns the target untouched. Respects reduced motion.
 */
export function useCountUp(target: number, enabled = true) {
  const [value, setValue] = useState(0);
  const shown = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shown.current = target;
      frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }
    const from = shown.current;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const next = from + (target - from) * ease(t);
      shown.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled]);

  return enabled ? value : target;
}
