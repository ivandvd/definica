"use client";

import { useEffect, useImperativeHandle, useLayoutEffect, useRef, type Ref } from "react";
import { gsap } from "../../shared/gsap";

/** Same controls as `BaseVideoVimeoLoop`, so an animated scene can stand in for a looping video. */
export interface LoopHandle {
  play: () => void;
  playVideo: () => void;
  pause: (options?: { completeLoop?: boolean }) => void;
}

export interface LoopTimelineOptions {
  /** Builds the scene's looping timeline from its rendered markup. */
  build: (canvas: HTMLElement) => gsap.core.Timeline;
  /** Width of the design canvas; the canvas is scaled to the container's width and fills its height. */
  designWidth: number;
  /** Restart from the first frame on every play() (like `restartOnPlay` videos) instead of resuming. */
  restartOnPlay?: boolean;
  /** Play whenever on screen, like an autoplaying video. */
  autoplay?: boolean;
  /** Frame shown when the visitor prefers reduced motion. */
  still?: "start" | "end";
  ref?: Ref<LoopHandle>;
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Runs a scene's GSAP timeline the way the site runs its looping videos: scaled to its container,
 * paused off-screen, optionally autoplaying, and controllable through a video-like handle.
 */
export function useLoopTimeline({
  build,
  designWidth,
  restartOnPlay = false,
  autoplay = false,
  still = "start",
  ref,
}: LoopTimelineOptions) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const playing = useRef(false);
  const visible = useRef(false);
  const settings = useRef({ autoplay, restartOnPlay, still });
  useEffect(() => {
    settings.current = { autoplay, restartOnPlay, still };
  });

  /** Starts (or resumes) the timeline, cancelling any pending end-of-loop pause. */
  const start = (restart: boolean) => {
    const tl = timeline.current;
    if (!tl) return;
    tl.eventCallback("onRepeat", null);
    if (prefersReducedMotion()) {
      tl.pause(settings.current.still === "end" ? tl.duration() * 0.999 : 0);
      return;
    }
    if (restart) tl.restart();
    else tl.play();
  };

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    if (!viewport || !canvas) return;
    let canvasHeight = 0;

    const create = () => {
      timeline.current?.revert();
      const tl = build(canvas);
      // Play through once so every tween records its starting values in order; loops then rewind cleanly.
      tl.progress(1).progress(0);
      timeline.current = tl;
      if (playing.current) start(true);
    };

    const fit = () => {
      const width = viewport.clientWidth;
      const height = viewport.clientHeight;
      if (!width || !height) return false;
      const scale = width / designWidth;
      const nextHeight = Math.round((height / scale) * 10) / 10;
      canvas.style.transform = `scale(${scale})`;
      canvas.style.height = `${nextHeight}px`;
      const changed = Math.abs(nextHeight - canvasHeight) > 1;
      canvasHeight = nextHeight;
      return changed;
    };

    fit();
    create();

    let rebuildTimer: ReturnType<typeof setTimeout> | undefined;
    const observer = new ResizeObserver(() => {
      if (!fit()) return;
      clearTimeout(rebuildTimer);
      // Layout positions measured by the build depend on the canvas height.
      rebuildTimer = setTimeout(create, 150);
    });
    observer.observe(viewport);

    return () => {
      observer.disconnect();
      clearTimeout(rebuildTimer);
      timeline.current?.revert();
      timeline.current = null;
    };
  }, [build, designWidth]);

  // Like the videos: play on entering the viewport when autoplaying, pause shortly after leaving it.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timer);
        if (entry.isIntersecting) {
          visible.current = true;
          if (settings.current.autoplay) {
            playing.current = true;
            start(false);
          }
          return;
        }
        timer = setTimeout(() => {
          visible.current = false;
          playing.current = false;
          timeline.current?.pause();
        }, 100);
      },
      { threshold: 0, rootMargin: `${window.innerHeight || 1000}px` },
    );
    observer.observe(viewport);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // `autoplay` can change after hydration (it depends on the device), so follow it.
  useEffect(() => {
    if (autoplay && visible.current) {
      playing.current = true;
      start(false);
    } else if (!autoplay && playing.current) {
      playing.current = false;
      timeline.current?.pause(0);
    }
  }, [autoplay]);

  useImperativeHandle(ref, () => {
    const play = () => {
      playing.current = true;
      start(settings.current.restartOnPlay);
    };
    return {
      play,
      playVideo: play,
      pause: ({ completeLoop = false } = {}) => {
        const tl = timeline.current;
        if (!tl) return;
        if (completeLoop && tl.isActive()) {
          // Finish the current loop, then rest on the first frame.
          tl.eventCallback("onRepeat", () => {
            tl.eventCallback("onRepeat", null);
            playing.current = false;
            tl.pause(0);
          });
          return;
        }
        playing.current = false;
        tl.pause();
      },
    };
  }, []);

  return { viewportRef, canvasRef };
}
