"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useScrollProgress } from "../motion";
import styles from "./kit.module.css";

interface Point {
  x: number;
  y: number;
}

interface Geometry {
  points: Point[];
  /** Distance along the track at each stop. */
  at: number[];
  total: number;
  stops: HTMLElement[];
}

const EMPTY: Geometry = { points: [], at: [], total: 0, stops: [] };

/** Position of an element inside the track, from the layout (entrance transforms are ignored). */
function offsetWithin(el: HTMLElement, root: HTMLElement): Point {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/** Measures the stops and draws the pipe through their centres. */
function measure(root: HTMLElement, svg: SVGSVGElement): Geometry {
  const stops = Array.from(root.querySelectorAll<HTMLElement>("[data-track-stop]"));
  const points = stops.map((stop) => {
    const offset = offsetWithin(stop, root);
    return { x: offset.x + stop.offsetWidth / 2, y: offset.y + stop.offsetHeight / 2 };
  });
  const at = points.map(() => 0);
  for (let i = 1; i < points.length; i++) {
    at[i] = at[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  const total = at[at.length - 1] ?? 0;
  const d = points.map((point, i) => `${i ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join("");
  svg.setAttribute("viewBox", `0 0 ${root.offsetWidth} ${root.offsetHeight}`);
  svg.querySelectorAll("path").forEach((path) => path.setAttribute("d", d));
  const fill = svg.querySelector<SVGPathElement>("[data-track-fill]");
  if (fill) fill.style.strokeDasharray = `${total.toFixed(1)} ${(total + 2).toFixed(1)}`;
  return { points, at, total, stops };
}

/** Moves the token to `progress` of the way along, fills the pipe behind it and marks the stops it has reached. */
function place(geometry: Geometry, svg: SVGSVGElement, token: HTMLElement, progress: number) {
  const { points, at, total, stops } = geometry;
  if (points.length < 2) return;
  const distance = progress * total;
  let i = 0;
  while (i < at.length - 2 && at[i + 1] < distance) i++;
  const t = Math.min(1, Math.max(0, (distance - at[i]) / (at[i + 1] - at[i] || 1)));
  const x = points[i].x + (points[i + 1].x - points[i].x) * t;
  const y = points[i].y + (points[i + 1].y - points[i].y) * t;
  token.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  const fill = svg.querySelector<SVGPathElement>("[data-track-fill]");
  if (fill) fill.style.strokeDashoffset = (total - distance).toFixed(1);
  let stage = 0;
  stops.forEach((stop, index) => {
    const reached = at[index] <= distance + 2;
    stop.toggleAttribute("data-reached", reached);
    if (reached) stage = index;
  });
  token.dataset.stage = String(stage);
}

interface PathTrackProps {
  /** The stations; the element each one's pipe runs through carries `data-track-stop`. */
  children: ReactNode;
  /** What travels along the pipe (a coin…), centred on its point; it gets `data-stage` = the last stop reached. */
  token: ReactNode;
  className?: string;
  /** ScrollTrigger start and end of the journey. */
  start?: string;
  end?: string;
}

/**
 * Stations joined by a pipe, with a token that travels along it as the page scrolls (both ways)
 * and fills the pipe behind it; each stop it reaches gets `data-reached`. The pipe is measured
 * from the layout, so it runs across a row on desktop and down a column on phones. Under reduced
 * motion the token waits at the last stop and the pipe is full.
 */
export function PathTrack({ children, token, className, start = "top 72%", end = "bottom 58%" }: PathTrackProps) {
  const refRoot = useRef<HTMLDivElement>(null);
  const refSvg = useRef<SVGSVGElement>(null);
  const refToken = useRef<HTMLDivElement>(null);
  const geometry = useRef<Geometry>(EMPTY);
  const progress = useRef(0);

  useEffect(() => {
    const root = refRoot.current;
    const svg = refSvg.current;
    const tokenEl = refToken.current;
    if (!root || !svg || !tokenEl) return;
    let frame = 0;
    let cancelled = false;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        geometry.current = measure(root, svg);
        place(geometry.current, svg, tokenEl, progress.current);
      });
    };
    const observer = new ResizeObserver(update);
    observer.observe(root);
    document.fonts.ready.then(() => {
      if (!cancelled) update();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  useScrollProgress(
    refRoot,
    (value) => {
      progress.current = value;
      const svg = refSvg.current;
      const tokenEl = refToken.current;
      if (svg && tokenEl) place(geometry.current, svg, tokenEl, value);
    },
    { start, end },
  );

  return (
    <div ref={refRoot} className={className ? `${styles.track} ${className}` : styles.track}>
      <svg ref={refSvg} className={styles.trackSvg} aria-hidden="true" focusable="false">
        <path className={styles.trackOutline} />
        <path className={styles.trackBase} />
        <path className={styles.trackFill} data-track-fill="" />
      </svg>
      {children}
      <div ref={refToken} className={styles.trackToken} aria-hidden="true">
        {token}
      </div>
    </div>
  );
}
