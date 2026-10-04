"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Port of the original `v-observe` directive and its `$viewportObserver` gate.
 * Observers stay dormant until the page loader flips `viewportObserver.active`.
 */
type ActiveListener = (active: boolean) => void;

function createViewportObserver() {
  let active = false;
  const listeners = new Set<ActiveListener>();
  return {
    get active() {
      return active;
    },
    setActive(value: boolean) {
      if (active === value) return;
      active = value;
      listeners.forEach((l) => l(value));
    },
    subscribe(listener: ActiveListener) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
  };
}

export const viewportObserver = createViewportObserver();

export interface ObserveOptions {
  /** Class toggled on the element while it is in view. Default `--in-view`. */
  activeClass?: string;
  threshold?: number;
  /** Shrinks the bottom of the viewport by this many px. */
  offset?: number;
  /** Stop observing after the first enter. Default true. */
  once?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
}

/**
 * Adds `--in-view` to the element (via classList, like the directive) and fires
 * onEnter/onLeave. Callbacks are read through a ref, so they may close over fresh
 * state. Keep the element's `className` prop stable, otherwise React will drop
 * the class when it rewrites the attribute.
 */
export function useObserve<T extends Element>(ref: RefObject<T | null>, options: ObserveOptions = {}) {
  const latest = useRef(options);
  useEffect(() => {
    latest.current = options;
  });

  const { activeClass = "--in-view", threshold = 0, offset = 0, once = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          latest.current.onEnter?.();
          el.classList.add(activeClass);
          if (once) observer.unobserve(el);
        } else {
          latest.current.onLeave?.();
          el.classList.remove(activeClass);
        }
      },
      { root: null, rootMargin: `0px 0px ${-offset}px 0px`, threshold },
    );
    if (viewportObserver.active) observer.observe(el);
    const unsubscribe = viewportObserver.subscribe((active) => {
      if (active) observer.observe(el);
      else {
        observer.disconnect();
        el.classList.remove(activeClass);
      }
    });
    return () => {
      unsubscribe();
      observer.disconnect();
    };
  }, [ref, activeClass, threshold, offset, once]);
}
