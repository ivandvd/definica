"use client";

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { getDevice } from "../shared/device";
import { gsap } from "../shared/gsap";

export interface StickyHorizontalListProps<T> extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  items?: T[] | null;
  itemsWrapper?: string;
  listClass?: string;
  /** `surtitle` slot. */
  surtitle?: ReactNode;
  /** `head` slot. */
  head?: ReactNode;
  /** `item` scoped slot. */
  renderItem: (item: T, index: number) => ReactNode;
}

/**
 * Port of `StickyHorizontalList` (scope data-v-372fd053): a tall section whose sticky
 * viewport first lifts the list over the (shrinking, fading) head, then slides the
 * items horizontally — all scrubbed by the scroll position of the section.
 */
export function StickyHorizontalList<T>({
  items,
  itemsWrapper = "1330",
  listClass = "1330",
  surtitle,
  head,
  renderItem,
  className,
  ...rest
}: StickyHorizontalListProps<T>) {
  const refEl = useRef<HTMLElement>(null);
  const refSticky = useRef<HTMLDivElement>(null);
  const refList = useRef<HTMLDivElement>(null);
  const refListWrapWrap = useRef<HTMLDivElement>(null);
  const refListWrap = useRef<HTMLDivElement>(null);
  const refListItems = useRef<(HTMLDivElement | null)[]>([]);
  const refHead = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = refEl.current;
    if (!el) return;

    let timeline: gsap.core.Timeline | null = null;
    let buildTimer: ReturnType<typeof setTimeout> | undefined;
    let debounceTimer: ReturnType<typeof setTimeout> | undefined;

    const killTimeline = () => {
      if (!timeline) return;
      timeline.revert();
      timeline.scrollTrigger?.kill();
      timeline.kill();
      timeline = null;
    };

    const initScrollAnimation = () => {
      const listItems = refListItems.current.filter((item): item is HTMLDivElement => item !== null);
      killTimeline();
      clearTimeout(buildTimer);
      buildTimer = setTimeout(() => {
        const list = refList.current;
        const listWrapWrap = refListWrapWrap.current;
        const sticky = refSticky.current;
        if (!list || !listWrapWrap || !sticky) return;
        const { desktop } = getDevice();
        const wrapRect = listWrapWrap.getBoundingClientRect();
        const listRect = list.getBoundingClientRect();
        const y =
          -wrapRect.top +
          sticky.getBoundingClientRect().top +
          (wrapRect.top - listRect.top) / 2 +
          window.innerHeight / 2 -
          wrapRect.height / 2;
        const x = -list.scrollWidth + window.innerWidth - listRect.left * 2;

        timeline = gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top top",
              scrub: desktop ? 1 : 0.3,
              end: "bottom bottom",
            },
          })
          .fromTo(refListWrap.current, { y: 0 }, { y, ease: "power1.inOut" }, 0)
          .fromTo(
            refHead.current,
            { scale: 1, autoAlpha: 1 },
            { scale: 0.8, autoAlpha: 0, ease: "power1.inOut" },
            0,
          );
        if (list.scrollWidth > list.clientWidth) {
          timeline.fromTo(
            listItems,
            { x: 0 },
            { x, duration: 1, ease: desktop ? "power1.inOut" : "none" },
            ">-0.15",
          );
        }
      }, 0);
    };

    const setHeight = () => {
      const { desktop } = getDevice();
      const height =
        ((refListWrap.current?.scrollWidth ?? 0) / window.innerWidth) * (desktop ? 2 : 1) * window.innerHeight;
      gsap.set(el, { height });
    };

    // useResizeObserver(refEl, useDebounceFn(..., 1000))
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setHeight();
        initScrollAnimation();
      }, 1000);
    });
    resizeObserver.observe(el);

    setHeight();
    initScrollAnimation();

    return () => {
      resizeObserver.disconnect();
      clearTimeout(debounceTimer);
      clearTimeout(buildTimer);
      killTimeline();
    };
  }, []);

  return (
    <section
      ref={refEl}
      data-v-372fd053=""
      {...rest}
      className={className ? `StickyHorizontalList ${className}` : "StickyHorizontalList"}
    >
      <div ref={refSticky} className="StickyHorizontalList-sticky" data-v-372fd053="">
        {surtitle}
        <div ref={refHead} className="StickyHorizontalList-head" data-v-372fd053="">
          {head}
        </div>
        <div ref={refListWrapWrap} className="StickyHorizontalList-listWrapWrap" data-v-372fd053="">
          <div ref={refListWrap} className="StickyHorizontalList-listWrap" data-v-372fd053="">
            {items ? (
              <div
                ref={refList}
                className={`AppWrapper-${itemsWrapper} ${listClass} StickyHorizontalList-list`}
                data-v-372fd053=""
              >
                {items.map((item, index) => (
                  <div
                    key={index}
                    ref={(node) => {
                      refListItems.current[index] = node;
                    }}
                    className="StickyHorizontalList-listItem"
                    data-v-372fd053=""
                  >
                    {renderItem(item, index)}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
