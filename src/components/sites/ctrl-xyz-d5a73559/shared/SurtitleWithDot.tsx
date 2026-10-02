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

/** Port of `SurtitleWithDot` (scope data-v-7c967a2e): text slides in, then the dot drops with a bounce. */
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
      <span ref={refDot} data-v-7c967a2e="" className={`SurtitleWithDot-dot --bg-${dotColor}`} />
      <span ref={refText} data-v-7c967a2e="" className="SurtitleWithDot-text">
        {surtitle}
      </span>
    </Tag>
  );
}
