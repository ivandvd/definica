"use client";

import { useEffect, useRef, type RefObject } from "react";
import { getDevice } from "../shared/device";
import { gsap, ScrollTrigger } from "../shared/gsap";
import { useObserve } from "../shared/observe";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export interface RiseOptions {
  /** Seconds between entering the viewport and starting to move. */
  delay?: number;
  /** How far below its place the element starts on desktop, in rem. */
  distanceDesktop?: number;
  /** The same on mobile. */
  distanceMobile?: number;
  /** Viewport bottom offset of the enter trigger in px (negative fires before the element is fully in view). */
  offset?: number;
}

/**
 * The roadmap's entrance for text and cards: a short fade-up once the element is about to scroll
 * in. The start values apply right away, so nothing flashes. Under `prefers-reduced-motion`
 * nothing is built and the element simply sits in place.
 */
export function useRise<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { delay = 0, distanceDesktop = 2.4, distanceMobile = 1.6, offset = -120 }: RiseOptions = {},
) {
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const distance = getDevice().desktop ? distanceDesktop : distanceMobile;
      timeline.current = gsap
        .timeline({ paused: true, delay })
        .fromTo(el, { y: `${distance}rem` }, { y: 0, ease: "power2.out", duration: 0.8 }, 0)
        .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power1.inOut", duration: 0.6 }, 0);
    });
    return () => {
      timeline.current = null;
      ctx.revert();
    };
  }, [ref, delay, distanceDesktop, distanceMobile]);

  useObserve(ref, { onEnter: () => timeline.current?.play(), offset });
}

export interface PopOptions {
  delay?: number;
  offset?: number;
  /** "scale" pops up from small; "drop" falls into place and bounces, like a pin on a map. */
  from?: "scale" | "drop";
}

/** The entrance for the markers on the road: they pop up from small (or drop in), with a little overshoot. */
export function usePop<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { delay = 0, offset = -120, from = "scale" }: PopOptions = {},
) {
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, delay });
      if (from === "drop") tl.fromTo(el, { y: "-5rem" }, { y: 0, ease: "bounce.out", duration: 0.9 }, 0);
      else tl.fromTo(el, { scale: 0.4 }, { scale: 1, ease: "back.out(1.8)", duration: 0.7 }, 0);
      tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, ease: "power1.inOut", duration: 0.3 }, 0);
      timeline.current = tl;
    });
    return () => {
      timeline.current = null;
      ctx.revert();
    };
  }, [ref, delay, from]);

  useObserve(ref, { onEnter: () => timeline.current?.play(), offset });
}

/**
 * The element drifts against the scroll while it crosses the viewport, `depth` × 3rem either side
 * of its place, which gives the scenery some depth. Scrubbed, so it follows the scroll both ways.
 */
export function useParallax<T extends HTMLElement>(ref: RefObject<T | null>, depth = 0) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !depth || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: `${depth * 3}rem` },
        {
          y: `${-depth * 3}rem`,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 },
        },
      );
    });
    return () => ctx.revert();
  }, [ref, depth]);
}

/**
 * Words darken one after another as the paragraph scrolls up the viewport (every word is a
 * `[data-word]`), all of them in ink by the time the paragraph's foot passes two thirds of the
 * way down. Tied to the scroll position, so it runs back when scrolling up.
 */
export function useScrubWords<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const words = el.querySelectorAll("[data-word]");
    if (!words.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          duration: 0.6,
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 66%", scrub: 0.4 },
        },
      );
    });
    return () => ctx.revert();
  }, [ref]);
}

/**
 * Keeps every ScrollTrigger on the page in step with its layout: positions are measured again
 * once the fonts are in and whenever the element's height changes (an accordion opening, a title
 * re-splitting), debounced so a height tween refreshes once, at its end.
 */
export function useRefreshOnResize<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer = 0;
    let height = el.offsetHeight;
    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    const observer = new ResizeObserver(() => {
      if (el.offsetHeight === height) return;
      height = el.offsetHeight;
      refresh();
    });
    observer.observe(el);
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) refresh();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [ref]);
}
