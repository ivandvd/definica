import type { CSSProperties, ReactNode } from "react";
import { BLOB_PATH } from "../SurtitleWithDot";
import styles from "./kit.module.css";

/*
 * The building blocks of the content pages' illustrations, drawn in the site's sticker style:
 * flat pastel shapes, a thin ink outline, small sparkles and bold Tomato Grotesk lettering.
 * Every piece is a `<g>` placed in its parent drawing's own units, so a scene is one SVG.
 * Decorative only: the drawings are hidden from assistive technology, the text says it all.
 */

export const INK = "#001405";
export const FONT = '"Tomato Grotesk", Arial, sans-serif';

/** The site's colours: the blob fills, the card tones, lime, coral and big blue. */
export const C = {
  ink: INK,
  lime: "#d1f500",
  green: "#05c92f",
  sky: "#9dc4f5",
  skyLight: "#a7cbf6",
  baby: "#ffcadc",
  babyLight: "#ffd0e2",
  lemonade: "#fbe74e",
  lemonadeLight: "#fcea59",
  mint: "#d6eedb",
  lightGreen: "#e2f2e5",
  coral: "#ff5a4d",
  blue: "#2a5cd3",
  white: "#ffffff",
  paper: "#f9faf9",
  stone: "#d1d6d2",
  grey: "#ecefec",
} as const;

/** The ink outline every shape wears. */
export const LINE = { stroke: INK, strokeWidth: 2, strokeLinejoin: "round", strokeLinecap: "round" } as const;
/** A lighter line, for details inside a shape. */
export const THIN = { stroke: INK, strokeWidth: 1.4, strokeLinejoin: "round", strokeLinecap: "round" } as const;

export type Motion =
  | "float"
  | "bob"
  | "sway"
  | "tilt"
  | "twinkle"
  | "spin"
  | "turn"
  | "drift"
  | "pulse"
  | "wobble"
  | "blink"
  | "drop"
  | "slide"
  | "thump"
  | "flash"
  | "notch"
  | "spark"
  | "pop"
  | "queue";

const MOTION: Record<Motion, string> = {
  float: styles.float,
  bob: styles.bob,
  sway: styles.sway,
  tilt: styles.tilt,
  twinkle: styles.twinkle,
  spin: styles.spin,
  turn: styles.turn,
  drift: styles.drift,
  pulse: styles.pulse,
  wobble: styles.wobble,
  blink: styles.blink,
  drop: styles.drop,
  slide: styles.slide,
  thump: styles.thump,
  flash: styles.flash,
  notch: styles.notch,
  spark: styles.spark,
  pop: styles.pop,
  queue: styles.queue,
};

interface MoveProps {
  motion: Motion;
  /** Cycle length in seconds. */
  dur?: number;
  delay?: number;
  /** CSS transform-origin, relative to the group's own box ("50% 100%" sways from the foot). */
  origin?: string;
  /** Custom properties the keyframes read: `--amp`, `--dx`, `--dy`, `--fall`, `--sink`, `--rest`. */
  vars?: Record<string, string>;
  className?: string;
  children: ReactNode;
}

/**
 * A group that moves on a loop (see the keyframes in kit.module.css); it holds still under
 * reduced motion. Position its contents with a transform on a parent group, never on this one:
 * the animation owns this group's transform.
 */
export function Move({ motion, dur, delay, origin, vars, className, children }: MoveProps) {
  const style: Record<string, string> = { ...vars };
  if (dur) style.animationDuration = `${dur}s`;
  if (delay) style.animationDelay = `${delay}s`;
  if (origin) style.transformOrigin = origin;
  return (
    <g className={className ? `${MOTION[motion]} ${className}` : MOTION[motion]} style={style as CSSProperties}>
      {children}
    </g>
  );
}

/** The outer `<svg>` of a drawing. */
export function ArtSvg({ viewBox, className, children }: { viewBox: string; className?: string; children: ReactNode }) {
  return (
    <svg
      className={className ? `${styles.art} ${className}` : styles.art}
      viewBox={viewBox}
      overflow="visible"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const n = (value: number) => Number(value.toFixed(2));

/** A four-point sparkle of radius `r`, centred on the origin (the site's sparkle, any size). */
export function sparklePath(r: number) {
  const a = n(0.076 * r);
  const b = n(0.438 * r);
  const R = n(r);
  return `M0 ${-R}C${a} ${-b} ${b} ${-a} ${R} 0 ${b} ${a} ${a} ${b} 0 ${R} ${-a} ${b} ${-b} ${a} ${-R} 0 ${-b} ${-a} ${-a} ${-b} 0 ${-R}Z`;
}

interface PlaceProps {
  x: number;
  y: number;
}

/** A sparkle that twinkles. */
export function Sparkle({
  x,
  y,
  r = 9,
  fill = C.lime,
  delay = 0,
  dur = 3,
  still = false,
}: PlaceProps & { r?: number; fill?: string; delay?: number; dur?: number; still?: boolean }) {
  const path = <path d={sparklePath(r)} fill={fill} stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />;
  return (
    <g transform={`translate(${x} ${y})`}>
      {still ? (
        path
      ) : (
        <Move motion="twinkle" dur={dur} delay={delay}>
          {path}
        </Move>
      )}
    </g>
  );
}

/** The site's blob, centred on (x, y). */
export function Blob({ x, y, size = 24, fill = C.green }: PlaceProps & { size?: number; fill?: string }) {
  const k = size / 24;
  return (
    <path
      d={BLOB_PATH}
      transform={`translate(${n(x - size / 2)} ${n(y - size / 2)}) scale(${n(k)})`}
      fill={fill}
      stroke={INK}
      strokeWidth={n(1.8 / k)}
      strokeLinejoin="round"
    />
  );
}

/** The Ethereum diamond, `h` tall, centred on (x, y). */
export function Eth({ x, y, h = 24, fill = INK, outline = false }: PlaceProps & { h?: number; fill?: string; outline?: boolean }) {
  const k = h / 24.5;
  const stroke = outline ? { stroke: INK, strokeWidth: n(1.4 / k), strokeLinejoin: "round" as const } : null;
  return (
    <g transform={`translate(${n(x)} ${n(y - 0.25 * k)}) scale(${n(k)})`} fill={fill}>
      <path d="M0-12 7.5 0.5 0 5-7.5 0.5Z" {...stroke} />
      <path d="M-7.5 2.4 0 6.9 7.5 2.4 0 12.5Z" {...stroke} />
    </g>
  );
}

/** A coin seen face on: rim, inner ring and the ETH diamond (white with an outline, or ink). */
export function Coin({
  x,
  y,
  r = 20,
  fill = C.lemonade,
  diamond = "ink",
}: PlaceProps & { r?: number; fill?: string; diamond?: "ink" | "white" | "none" }) {
  return (
    <g transform={`translate(${n(x)} ${n(y)})`}>
      <circle r={r} fill={fill} {...LINE} />
      <circle r={n(r * 0.74)} fill="none" stroke={INK} strokeWidth={1.2} opacity={0.4} />
      {diamond === "ink" ? <Eth x={0} y={0} h={r * 0.95} /> : null}
      {diamond === "white" ? <Eth x={0} y={0} h={r * 1.02} fill={C.white} outline /> : null}
    </g>
  );
}

/** A coin seen edge on, as a piece of a stack: the top face at (x, y). */
export function Chip({
  x,
  y,
  rx = 26,
  ry = 8.5,
  h = 7,
  fill = C.lemonade,
}: PlaceProps & { rx?: number; ry?: number; h?: number; fill?: string }) {
  return (
    <g>
      <path d={`M${n(x - rx)} ${n(y)}v${h}a${rx} ${ry} 0 0 0 ${rx * 2} 0v${-h}`} fill={fill} {...LINE} />
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={fill} {...LINE} />
      <ellipse cx={x} cy={y} rx={n(rx * 0.68)} ry={n(ry * 0.62)} fill="none" stroke={INK} strokeWidth={1.1} opacity={0.35} />
    </g>
  );
}

/** A soft shadow under a piece. */
export function Shadow({ x, y, rx, ry = 6 }: PlaceProps & { rx: number; ry?: number }) {
  return <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={INK} opacity={0.08} />;
}

/** A pill with an uppercase label, centred on (x, y): "VAULT", "AAVE V3". */
export function Tag({
  x,
  y,
  text,
  fill = C.white,
  size = 11,
  width,
}: PlaceProps & { text: string; fill?: string; size?: number; width?: number }) {
  const w = width ?? n(text.length * size * 0.72 + size * 1.7);
  const h = n(size * 2.1);
  return (
    <g transform={`translate(${n(x)} ${n(y)})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={fill} {...LINE} strokeWidth={1.6} />
      <text
        x={0}
        y={n(size * 0.36)}
        textAnchor="middle"
        fontFamily={FONT}
        fontWeight={700}
        fontSize={size}
        letterSpacing={n(size * 0.06)}
        fill={INK}
      >
        {text}
      </text>
    </g>
  );
}

/** Bold lettering, centred on (x, y). */
export function Letters({
  x,
  y,
  text,
  size = 14,
  fill = INK,
  weight = 700,
  anchor = "middle",
}: PlaceProps & { text: string; size?: number; fill?: string; weight?: number; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={n(y + size * 0.35)} textAnchor={anchor} fontFamily={FONT} fontWeight={weight} fontSize={size} fill={fill}>
      {text}
    </text>
  );
}

/** The Definica mark's paths, in its own -1.3 0 24 24 box. */
const MARK_D =
  "M9.12705 0.252278C10.8655 0.252278 12.4782 0.553437 13.9651 1.15575C15.4519 1.73576 16.7444 2.56116 17.8424 3.63194C18.9632 4.68042 19.8325 5.91851 20.4501 7.34622C21.0677 8.75163 21.3765 10.2909 21.3765 11.964C21.3765 13.6148 21.0677 15.154 20.4501 16.5817C19.8325 18.0095 18.9747 19.2587 17.8767 20.3295C16.7787 21.378 15.4862 22.2034 13.9994 22.8057C12.5125 23.3857 10.9113 23.6757 9.19568 23.6757H1.78138C0.797549 23.6757 0 22.869 0 21.8739V2.05408C0 1.05897 0.797549 0.252278 1.78138 0.252278H9.12705ZM9.38556 5.45784L3.9263 11.3478C3.6051 11.6944 3.6051 12.2336 3.9263 12.5801L4.48495 13.1829L5.90247 14.7122L9.38556 18.4701C9.73745 18.8498 10.3333 18.8498 10.6851 18.4701L16.1444 12.5801C16.4656 12.2336 16.4656 11.6944 16.1444 11.3478L15.6535 10.8182L14.236 9.28886L10.6851 5.45784C10.3333 5.07819 9.73745 5.07819 9.38556 5.45784Z";
const MARK_SLASH =
  "M16.9295 10.3087L15.6535 10.8182L5.90247 14.7122L3.93511 15.4979L3.21179 13.6913L4.48495 13.1829L14.236 9.28886L16.2061 8.50211L16.9295 10.3087Z";
const MARK_LOWER =
  "M10.6851 18.4701L16.1444 12.5801C16.4656 12.2336 16.4656 11.6944 16.1444 11.3478L15.6535 10.8182L5.90247 14.7122L9.38556 18.4701C9.73745 18.8498 10.3333 18.8498 10.6851 18.4701Z";
const MARK_UPPER =
  "M9.38556 5.45784L3.9263 11.3478C3.6051 11.6944 3.6051 12.2336 3.9263 12.5801L4.48495 13.1829L14.236 9.28886L10.6851 5.45784C10.3333 5.07819 9.73745 5.07819 9.38556 5.45784Z";

/** The Definica mark, `size` tall, centred on (x, y): the D in `color`, its diamond in `accent`. */
export function Mark({ x, y, size = 24, color = INK, accent = C.lime }: PlaceProps & { size?: number; color?: string; accent?: string }) {
  const k = size / 24;
  return (
    <g transform={`translate(${n(x - 10.7 * k)} ${n(y - 12 * k)}) scale(${n(k)})`}>
      <path fillRule="evenodd" clipRule="evenodd" d={MARK_D} fill={color} />
      <path d={MARK_SLASH} fill={color} />
      <path d={MARK_LOWER} fill={accent} />
      <path d={MARK_UPPER} fill={accent} />
    </g>
  );
}

/** A chunky two-tone stroke: an ink outline around a coloured band, for arrows and pipes. */
export function Band({ d, color = C.lime, width = 6, dash }: { d: string; color?: string; width?: number; dash?: string }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={INK} strokeWidth={width + 3.4} />
      <path d={d} stroke={color} strokeWidth={width} strokeDasharray={dash} />
    </g>
  );
}

/** A dashed connector. */
export function Dashes({ d, opacity = 0.45 }: { d: string; opacity?: number }) {
  return <path d={d} fill="none" stroke={INK} strokeWidth={1.6} strokeDasharray="4 5" strokeLinecap="round" opacity={opacity} />;
}

/** A dashed connector whose dashes march along it, in the direction it is drawn (still under reduced motion). */
export function Flowline({ d, color = INK, width = 2.4, opacity = 0.7 }: { d: string; color?: string; width?: number; opacity?: number }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeDasharray="6 12"
      strokeLinecap="round"
      opacity={opacity}
      className={styles.march}
    />
  );
}
