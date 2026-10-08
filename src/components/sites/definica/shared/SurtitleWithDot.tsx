"use client";

import { useEffect, useRef, type HTMLAttributes, type RefObject } from "react";
import { gsap } from "./gsap";
import { useObserve } from "./observe";

export interface SurtitleWithDotProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  tag?: string;
  surtitle: string;
  /** Suffix of the `--bg-*` colour class of the dot. */
  dotColor?: string;
}

/** Fill of the blob for each original dot colour class. */
export const BLOB_FILLS: Record<string, string> = {
  green: "#05c92f",
  "flash-red": "#ff5a4d",
  baby: "#ffcadc",
  lemonade: "#fbe74e",
  sky: "#9dc4f5",
};

/** A soft, hand-drawn blob in the site's sticker style (ink outline, flat fill); a 24 x 24 path. */
export const BLOB_PATH =
  "M12.4 2.3c3.5-.2 7.6 1.6 8.9 5 1.2 3.1-.3 5.4.2 8.2.4 2.7-2 5.6-5.4 6.1-3 .4-4.6-1.3-7.6-1.1-3 .2-5.6-1.7-6.1-4.9-.5-3.1 1.6-4.4 1.6-7.4C4 4.9 7.9 2.5 12.4 2.3Z";

/**
 * Port of `SurtitleWithDot` (scope data-v-7c967a2e): text slides in, then the dot drops with a bounce.
 * For Definica the dot is drawn as a small blob (see definica.css), which keeps the drop animation.
 */
export function SurtitleWithDot({ tag = "div", surtitle, dotColor = "green", className, ...rest }: SurtitleWithDotProps) {
  const refEl = useRef<HTMLElement>(null);
  const refDot = useRef<HTMLSpanElement>(null);
  const refText = useRef<HTMLSpanElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(
    () => () => {
      timeline.current?.kill();
      timeline.current = null;
    },
    [],
  );

  useObserve(refEl, {
    onEnter: () => {
      timeline.current = gsap
        .timeline()
        .from(refText.current, { x: "10rem", ease: "power3.out", duration: 0.8 }, 0.2)
        .from(refText.current, { autoAlpha: 0, ease: "power1.inOut", duration: 0.2 }, 0.2)
        .fromTo(refDot.current, { y: "-4rem" }, { y: "0rem", ease: "elastic.out", duration: 1.5 }, ">0.1")
        .fromTo(refDot.current, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power1.inOut", duration: 0.2 }, "<");
    },
  });

  // Dynamic tag, as `<component :is="tag">` in the original.
  const Tag = tag as "div";
  return (
    <Tag
      ref={refEl as RefObject<HTMLDivElement | null>}
      data-v-7c967a2e=""
      {...rest}
      className={className ? `SurtitleWithDot ${className}` : "SurtitleWithDot"}
    >
      <span ref={refDot} data-v-7c967a2e="" className="SurtitleWithDot-dot">
        <svg data-v-7c967a2e="" className="SurtitleWithDot-blob" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d={BLOB_PATH}
            fill={BLOB_FILLS[dotColor] ?? BLOB_FILLS.green}
            stroke="#001405"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span ref={refText} data-v-7c967a2e="" className="SurtitleWithDot-text">
        {surtitle}
      </span>
    </Tag>
  );
}
