import type { CSSProperties, ReactNode } from "react";
import { gsap } from "../../shared/gsap";
import { EthDiamond, glyphSrc, type GlyphName } from "../phone/kit";
import styles from "./scenes.module.css";

/*
 * Building blocks for the machine scenes, and the motion every scene shares:
 * - A route is one list of points that both draws a pipe and steers a token, so a token always runs
 *   down the middle of its pipe and a pipe always meets a tile at the middle of an edge.
 * - Tokens travel under tiles. A tile releases a token (it braces, then pushes it out) and absorbs
 *   one (it gives where the token enters, settles with a wobble, and pop lines flash at its corners).
 * - Nothing appears or disappears in the open.
 */

export const INK = "#001405";

export const TONES = {
  sky: ["#9dc4f5", "#6f9ed8"],
  mint: ["#e2f2e5", "#a9cfb2"],
  lime: ["#d1f500", "#a6c300"],
  lemon: ["#fbe74e", "#d9c22c"],
  grey: ["#d1d6d2", "#a9b0ab"],
  pink: ["#ffcadc", "#e7a3ba"],
} as const;
export type Tone = keyof typeof TONES;

export const tone = (name: Tone) => ({ "--fill": TONES[name][0], "--edge": TONES[name][1] }) as CSSProperties;

/* ---------- routes ---------- */

export type Pt = readonly [number, number];

export interface Route {
  /** SVG path data for the pipe. */
  d: string;
  length: number;
  /** Unit direction of the first and the last segment. */
  startDir: Pt;
  endDir: Pt;
  /** Point at a distance along the route. */
  at: (distance: number) => Pt;
  /** [distance, x, y] at the start, every corner sample and the end, in order. */
  samples: [number, number, number][];
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const unit = (a: Pt, b: Pt): Pt => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
};

/** A polyline with rounded corners (quadratic curves through each corner point). */
export function route(points: Pt[], radius = 18): Route {
  const samples: [number, number, number][] = [[0, points[0][0], points[0][1]]];
  let length = 0;
  let last = points[0];
  const advance = (p: Pt) => {
    length += Math.hypot(p[0] - last[0], p[1] - last[1]);
    samples.push([length, p[0], p[1]]);
    last = p;
  };
  let d = `M${round2(points[0][0])} ${round2(points[0][1])}`;
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    const next = points[i + 1];
    if (!next) {
      d += `L${round2(p[0])} ${round2(p[1])}`;
      advance(p);
      break;
    }
    const prev = points[i - 1];
    const r = Math.min(radius, Math.hypot(p[0] - prev[0], p[1] - prev[1]) / 2, Math.hypot(next[0] - p[0], next[1] - p[1]) / 2);
    const u = unit(prev, p);
    const v = unit(p, next);
    const a: Pt = [p[0] - u[0] * r, p[1] - u[1] * r];
    const b: Pt = [p[0] + v[0] * r, p[1] + v[1] * r];
    d += `L${round2(a[0])} ${round2(a[1])}Q${round2(p[0])} ${round2(p[1])} ${round2(b[0])} ${round2(b[1])}`;
    advance(a);
    for (let k = 1; k <= 8; k++) {
      const t = k / 8;
      advance([
        (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * p[0] + t * t * b[0],
        (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * p[1] + t * t * b[1],
      ]);
    }
  }
  const at = (distance: number): Pt => {
    const dist = Math.max(0, Math.min(length, distance));
    let i = 1;
    while (i < samples.length - 1 && samples[i][0] < dist) i++;
    const [d0, x0, y0] = samples[i - 1];
    const [d1, x1, y1] = samples[i];
    const t = d1 > d0 ? (dist - d0) / (d1 - d0) : 0;
    return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
  };
  const n = points.length;
  return { d, length, startDir: unit(points[0], points[1]), endDir: unit(points[n - 2], points[n - 1]), at, samples };
}

/** Thick outlined pipes; overlapping routes merge into one network. */
export const Pipes = ({ routes, size = 400 }: { routes: Route[]; size?: number }) => {
  const d = routes.map((r) => r.d).join("");
  return (
    <svg className={styles.pipes} viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }} aria-hidden="true">
      <path d={d} fill="none" stroke={INK} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#ffffff" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

/* ---------- pieces ---------- */

type Side = "above" | "below" | "left" | "right";

/** A token: a zero-size anchor (placed by its x/y) holding a coin and, optionally, a name pill. */
export function Token({
  el,
  size = 40,
  color = "sky",
  glyph,
  caption,
  captionSide = "below",
  children,
}: {
  el: string;
  size?: number;
  color?: Tone;
  glyph?: GlyphName;
  caption?: string;
  captionSide?: Side;
  children?: ReactNode;
}) {
  const gap = size / 2 + 6;
  const captionStyle: CSSProperties =
    captionSide === "below"
      ? { left: 0, top: gap, transform: "translateX(-50%)" }
      : captionSide === "above"
        ? { left: 0, bottom: gap, transform: "translateX(-50%)" }
        : captionSide === "right"
          ? { left: gap, top: 0, transform: "translateY(-50%)" }
          : { right: gap, top: 0, transform: "translateY(-50%)" };
  return (
    <div className={styles.token} data-el={el}>
      <div className={`${styles.ethCoin} ${styles.miniCoin}`} style={{ left: -size / 2, top: -size / 2, width: size, height: size, ...tone(color) }}>
        <span className={styles.coinEdge} />
        <span className={styles.coinFace}>
          <span className={styles.coinRim} />
          {glyph ? (
            // eslint-disable-next-line @next/next/no-img-element -- tiny decorative svg
            <img className={styles.coinGlyph} src={glyphSrc(glyph)} alt="" draggable={false} />
          ) : (
            (children ?? <EthDiamond color={INK} />)
          )}
        </span>
      </div>
      {caption ? (
        <span className={styles.tokenCaption} data-caption="" style={captionStyle}>
          {caption}
        </span>
      ) : null}
    </div>
  );
}

/** Pop lines at a tile's corners: two short strokes fanning out from each corner. */
export function Pops({ el, x, y, w, h = w, round = 22 }: { el: string; x: number; y: number; w: number; h?: number; round?: number }) {
  const pad = 30;
  const width = w + pad * 2;
  const height = h + pad * 2;
  const cx = w / 2 - round + round * Math.SQRT1_2;
  const cy = h / 2 - round + round * Math.SQRT1_2;
  const strokes: string[] = [];
  for (const [sx, sy] of [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ]) {
    for (const spread of [-22, 22]) {
      const angle = Math.atan2(sy, sx) + (spread * Math.PI) / 180;
      const x0 = sx * cx + Math.cos(angle) * 8;
      const y0 = sy * cy + Math.sin(angle) * 8;
      strokes.push(`M${round2(x0)} ${round2(y0)}L${round2(x0 + Math.cos(angle) * 9)} ${round2(y0 + Math.sin(angle) * 9)}`);
    }
  }
  return (
    <svg
      className={styles.pops}
      data-el={el}
      viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
      style={{ left: x - width / 2, top: y - height / 2, width, height }}
      aria-hidden="true"
    >
      <path d={strokes.join("")} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Pop lines around a circle (a coin or a gear). */
export function RingPops({ el, x, y, r, count = 8 }: { el: string; x: number; y: number; r: number; count?: number }) {
  const size = (r + 24) * 2;
  const strokes = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.PI / count;
    const r0 = r + 7;
    return `M${round2(Math.cos(angle) * r0)} ${round2(Math.sin(angle) * r0)}L${round2(Math.cos(angle) * (r0 + 9))} ${round2(Math.sin(angle) * (r0 + 9))}`;
  });
  return (
    <svg className={styles.pops} data-el={el} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} style={{ left: x - size / 2, top: y - size / 2, width: size, height: size }} aria-hidden="true">
      <path d={strokes.join("")} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** A station: a bold tile centred on (x, y), its label, and the pop lines it flashes when it takes a token in. */
export function Station({
  el,
  x,
  y,
  size = 88,
  height,
  color,
  glyph,
  label,
  labelSide = "below",
  children,
}: {
  el: string;
  x: number;
  y: number;
  size?: number;
  height?: number;
  color: string;
  glyph?: GlyphName;
  label?: string;
  labelSide?: Side;
  children?: ReactNode;
}) {
  const w = size;
  const h = height ?? size;
  const labelStyle: CSSProperties =
    labelSide === "below"
      ? { left: x - 90, top: y + h / 2 + 8, width: 180 }
      : labelSide === "above"
        ? { left: x - 90, top: y - h / 2 - 24, width: 180 }
        : labelSide === "right"
          ? { left: x + w / 2 + 10, top: y - 8, width: 180, textAlign: "left" }
          : { left: x - w / 2 - 190, top: y - 8, width: 180, textAlign: "right" };
  return (
    <>
      <div className={styles.station} data-el={el} style={{ left: x - w / 2, top: y - h / 2, width: w, height: h, background: color }}>
        {glyph ? (
          // eslint-disable-next-line @next/next/no-img-element -- tiny decorative svg
          <img src={glyphSrc(glyph)} alt="" draggable={false} />
        ) : (
          children
        )}
      </div>
      {label ? (
        <div className={styles.stationLabel} style={labelStyle}>
          {label}
        </div>
      ) : null}
      <Pops el={`${el}Pops`} x={x} y={y} w={w} h={h} />
    </>
  );
}

/** A small bold label that pops in (sticker style, white by default). */
export const Tag = ({ el, x, y, color = "#ffffff", children }: { el: string; x: number; y: number; color?: string; children: ReactNode }) => (
  <div className={styles.tag} data-el={el} style={{ left: x, top: y, background: color }}>
    {children}
  </div>
);

/** A record card with one row per entry; each row has a check that ticks when the entry is recorded. */
export function Ledger({ x, y, w, title, rows }: { x: number; y: number; w: number; title?: string; rows: { el: string; label: string; icon?: ReactNode }[] }) {
  return (
    <div className={styles.ledger} style={{ left: x, top: y, width: w }}>
      {title ? <span className={styles.ledgerTitle}>{title}</span> : null}
      {rows.map((row) => (
        <span key={row.el} className={styles.ledgerRow} data-el={`${row.el}Row`}>
          {row.icon ? <span className={styles.ledgerIcon}>{row.icon}</span> : null}
          <span className={styles.ledgerLabel}>{row.label}</span>
          <span className={styles.check} data-el={`${row.el}Check`}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.5 8.5 6.8 11.6 12.6 4.6" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}

/* ---------- motion ---------- */

type Timeline = gsap.core.Timeline;

/** Moves an anchor along a route at a steady speed (from one distance to another). */
export function travel(tl: Timeline, el: Element, rt: Route, at: number, { from = 0, to = rt.length, speed = 260 } = {}) {
  const forward = to >= from;
  const stops = rt.samples.map(([d]) => d).filter((d) => (forward ? d > from + 0.5 && d < to - 0.5 : d < from - 0.5 && d > to + 0.5));
  if (!forward) stops.reverse();
  stops.push(to);
  const [x0, y0] = rt.at(from);
  tl.set(el, { x: x0, y: y0 }, at);
  let prev = from;
  const keyframes = stops.map((d) => {
    const [x, y] = rt.at(d);
    const frame = { x, y, duration: Math.abs(d - prev) / speed, ease: "none" };
    prev = d;
    return frame;
  });
  tl.to(el, { keyframes }, at);
  const timeAt = (d: number) => at + Math.abs(d - from) / speed;
  return { end: timeAt(to), timeAt };
}

/** Pop lines flash out and fade. */
export function flash(tl: Timeline, pops: Element | null | undefined, at: number) {
  if (!pops) return;
  tl.set(pops, { autoAlpha: 1, scale: 0.82 }, at)
    .to(pops, { scale: 1.06, duration: 0.18, ease: "power2.out" }, at)
    .to(pops, { autoAlpha: 0, scale: 1.2, duration: 0.24, ease: "power1.in" }, at + 0.2);
}

/** The glyph inside a tile does a little squash-bounce. */
export function bounceGlyph(tl: Timeline, tile: HTMLElement, at: number, amount = 1.18) {
  const glyph = tile.querySelector(":scope > img, :scope > svg");
  if (!glyph) return;
  tl.to(glyph, { scale: amount, duration: 0.09, ease: "power2.out" }, at).to(glyph, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.45)" }, at + 0.09);
}

/**
 * A tile takes a token in: it gives in the direction of travel, wobbles back and flashes its pop lines.
 * `strength` scales the give (big containers give less).
 */
export function absorb(tl: Timeline, tile: HTMLElement, at: number, dir: Pt, pops?: Element | null, strength = 1) {
  const horizontal = Math.abs(dir[0]) >= Math.abs(dir[1]);
  const squash = 1 - 0.1 * strength;
  const stretch = 1 + 0.07 * strength;
  tl.to(
    tile,
    {
      x: dir[0] * 4 * strength,
      y: dir[1] * 4 * strength,
      scaleX: horizontal ? squash : stretch,
      scaleY: horizontal ? stretch : squash,
      duration: 0.09,
      ease: "power2.out",
    },
    at,
  ).to(tile, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" }, at + 0.09);
  bounceGlyph(tl, tile, at);
  flash(tl, pops, at + 0.02);
}

/** A tile lets a token out: it braces, then pushes (recoiling against the direction of travel). */
export function release(tl: Timeline, tile: HTMLElement, at: number, dir: Pt) {
  tl.to(tile, { scale: 0.93, duration: 0.12, ease: "power2.in" }, at - 0.12)
    .to(tile, { x: -dir[0] * 3, y: -dir[1] * 3, scale: 1.05, duration: 0.08, ease: "power2.out" }, at)
    .to(tile, { x: 0, y: 0, scale: 1, duration: 0.5, ease: "elastic.out(1, 0.45)" }, at + 0.08);
}

export interface Port {
  tile: HTMLElement;
  pops?: Element | null;
  /** Distance from the route's end point to the tile's edge (defaults to half the tile). */
  edge?: number;
  /** How much the tile gives when it takes a token in (1 for a tile, less for a big container). */
  strength?: number;
}

/** A tile and its pop lines, by the tile's data-el name. */
export const port = (canvas: ParentNode, name: string, edge?: number, strength = 1): Port => {
  const tile = canvas.querySelector<HTMLElement>(`[data-el="${name}"]`);
  if (!tile) throw new Error(`Machine scene: missing [data-el="${name}"]`);
  return { tile, pops: canvas.querySelector(`[data-el="${name}Pops"]`), edge, strength };
};

const halfAlong = (tile: HTMLElement, dir: Pt) => (Math.abs(dir[0]) >= Math.abs(dir[1]) ? tile.offsetWidth : tile.offsetHeight) / 2;

/**
 * One token, one hop: the source tile releases it, it runs the route under both tiles' edges and the
 * target tile absorbs it. It rests hidden under the target until its next hop.
 */
export function ride(
  tl: Timeline,
  token: HTMLElement,
  rt: Route,
  at: number,
  { from, to, size = 40, speed = 260, quiet = false }: { from: Port | null; to: Port | null; size?: number; speed?: number; quiet?: boolean },
) {
  const r = size / 2;
  const outEdge = from ? (from.edge ?? halfAlong(from.tile, rt.startDir)) : 0;
  const inEdge = rt.length - (to ? (to.edge ?? halfAlong(to.tile, rt.endDir)) : 0);
  if (from && !quiet) release(tl, from.tile, at, rt.startDir);
  tl.set(token, { scale: 0.8 }, at);
  const move = travel(tl, token, rt, at, { speed });
  tl.to(token, { scale: 1, duration: 0.22, ease: "back.out(2.6)" }, move.timeAt(Math.max(0, outEdge - r * 0.3)));
  const touch = move.timeAt(inEdge - r);
  const inside = move.timeAt(Math.min(rt.length, inEdge + r));
  if (to) {
    tl.to(token, { scale: 0.84, duration: Math.max(0.05, inside - touch), ease: "power1.in" }, touch);
    absorb(tl, to.tile, inside - 0.03, rt.endDir, to.pops, to.strength ?? 1);
  }
  const caption = token.querySelector("[data-caption]");
  if (caption) {
    tl.to(caption, { autoAlpha: 1, duration: 0.15 }, move.timeAt(outEdge + r * 0.6)).to(caption, { autoAlpha: 0, duration: 0.12 }, touch - 0.12);
  }
  return { start: at, touch, inside, end: move.end, timeAt: move.timeAt };
}

/** Sticker-style tags: pop in with a tilt, pop out. */
export const popIn = (tl: Timeline, el: Element, at: number, rotation = -6) =>
  tl.to(el, { autoAlpha: 1, scale: 1, rotation, duration: 0.4, ease: "back.out(2.2)" }, at);
export const popOut = (tl: Timeline, el: Element | Element[], at: number) =>
  tl.to(el, { autoAlpha: 0, scale: 0.5, duration: 0.25, ease: "power2.in" }, at);

/** A ledger check ticks: it fills lime, the tick draws and the row bumps. */
export function tick(tl: Timeline, check: HTMLElement, at: number) {
  const path = check.querySelector("path");
  tl.to(check, { backgroundColor: "#d1f500", duration: 0.15 }, at).to(check, { scale: 1.3, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1 }, at);
  if (path) tl.to(path, { strokeDashoffset: 0, duration: 0.25, ease: "power2.out" }, at + 0.05);
}

export function untick(tl: Timeline, check: HTMLElement, at: number) {
  const path = check.querySelector("path");
  tl.to(check, { backgroundColor: "#ffffff", duration: 0.3 }, at);
  if (path) tl.to(path, { strokeDashoffset: 18, duration: 0.25, ease: "power1.in" }, at);
}

/** Initial state for ledger checks (empty, tick undrawn). */
export function resetChecks(checks: HTMLElement[]) {
  checks.forEach((check) => {
    gsap.set(check, { backgroundColor: "#ffffff", scale: 1 });
    const path = check.querySelector("path");
    if (path) gsap.set(path, { strokeDasharray: 18, strokeDashoffset: 18 });
  });
}
