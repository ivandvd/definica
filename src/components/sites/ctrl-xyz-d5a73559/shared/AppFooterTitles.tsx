"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";
import { gsap } from "./gsap";
import { useObserve } from "./observe";

interface AppFooterTitlesProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "className"> {
  titles?: string[];
}

const NO_TITLES: string[] = [];
const CLIP_HIDDEN = "inset(-50% 100% -50% 0%)";
const CLIP_SHOWN = "inset(-50% 0% -50% 0%)";

/**
 * Port of `AppFooterTitles` (scope data-v-f201e754): the titles are wiped in and out one
 * after the other while the dot rides the right edge of the current one. The looping
 * timeline only runs while the block is in view and is rebuilt whenever the block resizes.
 */
export function AppFooterTitles({ titles = NO_TITLES, ...rest }: AppFooterTitlesProps) {
  const refEl = useRef<HTMLDivElement>(null);
  const refTitle = useRef<(HTMLDivElement | null)[]>([]);
  const refDot = useRef<HTMLSpanElement>(null);
  const isInView = useRef(false);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = refEl.current;
    const dot = refDot.current;
    if (!el || !dot) return;

    const build = () => {
      const items = refTitle.current.filter((item): item is HTMLDivElement => item !== null);
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3, paused: true });
      tl.set(el, { opacity: 1 });
      tl.set(items, { clipPath: CLIP_HIDDEN });
      items.forEach((item, index) => {
        const width = () => item.getBoundingClientRect().width;
        tl.fromTo(
          item,
          { clipPath: CLIP_HIDDEN },
          { clipPath: CLIP_SHOWN, duration: 1.2, ease: "back.inOut" },
          index * 4,
        );
        tl.fromTo(
          item,
          { clipPath: CLIP_SHOWN },
          { clipPath: CLIP_HIDDEN, duration: 1, ease: "power2.inOut" },
          3 + index * 3.8,
        );
        tl.fromTo(dot, { x: 0 }, { x: width, duration: 1.2, ease: "back.inOut" }, index * 4);
        tl.fromTo(dot, { x: width }, { x: 0, duration: 1, ease: "power2.inOut" }, 3 + index * 3.8);
      });
      timeline.current = tl;
      return tl;
    };

    build();
    // Like vueuse's `useResizeObserver`, this also fires once right after observing.
    const observer = new ResizeObserver(() => {
      const previous = timeline.current;
      if (previous) {
        previous.revert();
        previous.kill();
      }
      const next = build();
      if (isInView.current) next.play();
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      timeline.current?.kill();
      timeline.current = null;
    };
  }, [titles]);

  useObserve(refEl, {
    once: false,
    onEnter: () => {
      isInView.current = true;
      timeline.current?.play();
    },
    onLeave: () => {
      isInView.current = false;
      timeline.current?.pause();
    },
  });

  return (
    <div ref={refEl} {...rest} data-v-f201e754="" className="FooterTitles AppTitle-16 --fw-600">
      {titles.map((title, index) => (
        <div
          key={index}
          ref={(node) => {
            refTitle.current[index] = node;
          }}
          className="FooterTitles-item"
          data-v-f201e754=""
        >
          {title}
        </div>
      ))}
      <span ref={refDot} className="FooterTitles-point" data-v-f201e754="">
        .
      </span>
    </div>
  );
}
