import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

/**
 * Port of the original `useSmoothScroll` singleton: Lenis on fine pointers,
 * native scroll otherwise, with a small event bus ("scroll" / "resize").
 */
export interface ScrollState {
  previous: number;
  /** Animated (smoothed) scroll position. */
  lerp: number;
  /** Actual scroll position. */
  value: number;
  /** Position Lenis is easing towards. */
  target: number;
  direction: "up" | "down";
}

type ScrollEvent = "scroll" | "resize";
type ScrollHandler = (state: ScrollState) => void;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

function createSmoothScroll() {
  const y: ScrollState = { previous: 0, lerp: 0, value: 0, target: 0, direction: "down" };
  const handlers: Record<ScrollEvent, Set<ScrollHandler>> = { scroll: new Set(), resize: new Set() };
  let container: HTMLElement | null = null;
  let lenis: Lenis | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let initialized = false;
  let active = true;
  let locked = false;
  let bounds = 0;

  const emit = (event: ScrollEvent) => handlers[event].forEach((h) => h(y));

  const updateY = () => {
    if (active && lenis) {
      y.lerp = lenis.animatedScroll;
      y.value = lenis.actualScroll;
      y.target = lenis.targetScroll;
    } else {
      y.lerp = y.value = y.target = window.scrollY;
    }
  };
  const updateDirection = () => {
    if (y.previous > y.value) y.direction = "up";
    else if (y.previous < y.value) y.direction = "down";
    y.previous = y.value;
  };
  const onNativeScroll = () => {
    updateY();
    updateDirection();
    emit("scroll");
    ScrollTrigger.update();
  };
  const raf = (time: number) => {
    lenis?.raf(time);
    updateY();
    updateDirection();
    emit("scroll");
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  };
  const updateBounds = () => {
    if (!active || !container) return;
    bounds = Math.abs(container.clientHeight - window.innerHeight);
  };
  const onResize = () => {
    if (active) lenis?.resize();
    updateY();
    emit("scroll");
    emit("resize");
    updateBounds();
  };
  const scrollBy = (delta = 0, force = false) => {
    if (locked && !force) return;
    y.value = clamp(y.value + delta, 0, bounds);
    lenis?.scrollTo(y.value);
  };
  const scrollTo = (target: number, force = false) => {
    if (locked && !force) return;
    if (active) scrollBy(target - y.value);
    else window.scrollTo({ top: target, behavior: "smooth" });
  };
  const goTo = (target: number, force = false) => {
    if (locked && !force) return;
    if (active && lenis) {
      lenis.scrollTo(target, { immediate: true, force, lock: force });
      updateY();
    } else {
      window.scrollTo(0, target);
      onNativeScroll();
    }
  };

  return {
    on: (event: ScrollEvent, handler: ScrollHandler) => void handlers[event].add(handler),
    off: (event: ScrollEvent, handler: ScrollHandler) => void handlers[event].delete(handler),
    y,
    get active() {
      return active;
    },
    /** Maximum scroll position (container height − viewport height). Fine pointers only, as in the original. */
    get bounds() {
      return bounds;
    },
    get container() {
      return container;
    },
    get isLocked() {
      return locked;
    },
    /** Called once when the app mounts. Idempotent. */
    init() {
      if (initialized || typeof window === "undefined") return;
      initialized = true;
      active = window.matchMedia("(pointer:fine)").matches;
      if (active) {
        window.scrollTo(0, 0);
        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          autoResize: false,
        });
        lenis.scrollTo(0, { immediate: true });
        requestAnimationFrame(raf);
      } else {
        window.addEventListener("scroll", onNativeScroll);
      }
    },
    /** Registers the scroll container (the app root element). */
    start(el: HTMLElement) {
      container = el;
      updateBounds();
      resizeObserver?.disconnect();
      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(el);
      onResize();
    },
    onResize,
    scrollTo,
    goTo,
    goToTop: (force = false) => goTo(0, force),
    goToBottom: (force = false) => goTo(bounds, force),
    scrollToBottom: (force = false) => scrollTo(bounds, force),
    scrollOfOneViewport: (force = false) => scrollTo(y.value + window.innerHeight, force),
    scrollToElement(el: Element | null, offset = 0, force = false) {
      if ((locked && !force) || !el) return;
      scrollTo(y.lerp + el.getBoundingClientRect().top + offset, force);
    },
    easeToElement(el: Element | null, offset = 0, force = false, duration = 0.6, onComplete?: () => void) {
      gsap.killTweensOf(y);
      if ((locked && !force) || !el) return;
      const target = y.lerp + el.getBoundingClientRect().top + offset;
      gsap.to(y, {
        value: target,
        duration,
        ease: "power3.out",
        onUpdate: () => scrollTo(y.value, force),
        onComplete: () => onComplete?.(),
      });
    },
    goToElement(el: Element | null, offset = 0, force = false) {
      if ((locked && !force) || !el) return;
      goTo(y.lerp + el.getBoundingClientRect().top + offset, force);
    },
    lock() {
      locked = true;
      if (active) lenis?.stop();
      else document.body.style.overflow = "hidden";
    },
    unlock() {
      locked = false;
      if (active) lenis?.start();
      else document.body.style.overflow = "auto";
    },
  };
}

export const smoothScroll = createSmoothScroll();
export type SmoothScroll = typeof smoothScroll;
