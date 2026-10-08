"use client";

import { useRef, type CSSProperties } from "react";
import { BLOB_FILLS } from "../shared/SurtitleWithDot";
import { Blob } from "./Blob";
import { useParallax } from "../shared/motion";
import {
  Book,
  Bubble,
  Coin,
  Coins,
  Compass,
  DottedDisc,
  LIME,
  Lock,
  MapSheet,
  Mountains,
  Note,
  PALETTE,
  Pill,
  Pin,
  Plus,
  Shield,
  Sign,
  Sparkle,
  Squiggle,
  Tree,
} from "./Pieces";
import styles from "./roadmap.module.css";

/** Fill of a stop's blob and of the road at that stop, by card tone. */
export const TONE_FILLS: Record<string, string> = {
  sky: BLOB_FILLS.sky,
  baby: BLOB_FILLS.baby,
  lemonade: BLOB_FILLS.lemonade,
  mint: PALETTE.mint,
  lime: LIME,
};

type Shape =
  | "blob"
  | "sparkle"
  | "coin"
  | "coins"
  | "pill"
  | "tree"
  | "sign"
  | "pin"
  | "lock"
  | "note"
  | "map"
  | "dots"
  | "squiggle"
  | "plus"
  | "mountains"
  | "compass"
  | "book"
  | "bubble"
  | "shield";

/** How a piece moves (see the keyframes in roadmap.module.css). */
type Motion = "float" | "sway" | "spin" | "twinkle" | "drift" | "hop" | "tilt" | "turn" | "still";

interface Piece {
  shape: Shape;
  fill?: string;
  /** Position and size inside the scenery box, in % of the box. */
  x: number;
  y: number;
  size: number;
  motion: Motion;
  /** Motion cycle in seconds, and its offset. */
  duration: number;
  delay?: number;
  /** Resting angle, in degrees. */
  rotate?: number;
}

const P = PALETTE;

/** The groups of pieces placed around the page, each a small still life. */
const SETS = {
  heroLeft: [
    { shape: "tree", fill: P.lime, x: 24, y: 0, size: 56, motion: "sway", duration: 5.5 },
    { shape: "coin", x: 0, y: 50, size: 34, motion: "spin", duration: 6, delay: 0.6 },
    { shape: "pill", fill: P.baby, x: 58, y: 70, size: 36, motion: "drift", duration: 7.5, rotate: -32 },
  ],
  heroRight: [
    { shape: "pin", fill: P.baby, x: 34, y: 0, size: 56, motion: "hop", duration: 4.4 },
    { shape: "sparkle", fill: P.lime, x: 0, y: 58, size: 28, motion: "twinkle", duration: 3.4, delay: 0.5 },
  ],
  heroBottom: [
    { shape: "dots", fill: P.lime, x: 0, y: 26, size: 52, motion: "turn", duration: 28 },
    { shape: "plus", fill: P.sky, x: 62, y: 0, size: 30, motion: "turn", duration: 12, rotate: 12 },
  ],
  aboutLeft: [
    { shape: "map", fill: P.mint, x: 0, y: 12, size: 66, motion: "tilt", duration: 6, rotate: -8 },
    { shape: "sparkle", fill: P.lemonade, x: 70, y: 0, size: 26, motion: "twinkle", duration: 3.6, delay: 0.8 },
  ],
  aboutRight: [
    { shape: "squiggle", fill: P.sky, x: 18, y: 6, size: 58, motion: "drift", duration: 7, rotate: -12 },
    { shape: "plus", fill: P.lemonade, x: 0, y: 62, size: 28, motion: "turn", duration: 14 },
  ],
  compass: [{ shape: "compass", fill: P.lemonade, x: 0, y: 0, size: 100, motion: "turn", duration: 40 }],
  spark: [{ shape: "sparkle", fill: P.lime, x: 0, y: 0, size: 100, motion: "twinkle", duration: 3.6 }],
  staking: [
    { shape: "coins", fill: P.lemonade, x: 10, y: 8, size: 62, motion: "float", duration: 6.5 },
    { shape: "sparkle", fill: P.lime, x: 70, y: 0, size: 24, motion: "twinkle", duration: 3.4, delay: 0.7 },
  ],
  accounting: [{ shape: "note", fill: P.baby, x: 8, y: 0, size: 64, motion: "tilt", duration: 6, rotate: 6 }],
  security: [
    { shape: "shield", fill: P.mint, x: 20, y: 0, size: 60, motion: "float", duration: 6.2 },
    { shape: "sparkle", fill: P.lime, x: 0, y: 64, size: 22, motion: "twinkle", duration: 3.2, delay: 1 },
  ],
  liquidity: [
    { shape: "lock", fill: P.baby, x: 16, y: 4, size: 60, motion: "float", duration: 6 },
    { shape: "pill", fill: P.sky, x: 52, y: 66, size: 40, motion: "drift", duration: 8, rotate: 28 },
  ],
  flow: [
    { shape: "squiggle", fill: P.lime, x: 0, y: 10, size: 66, motion: "drift", duration: 7.5, rotate: 8 },
    { shape: "blob", fill: P.sky, x: 66, y: 60, size: 24, motion: "float", duration: 6.4, delay: 0.6 },
  ],
  borrowing: [
    { shape: "sign", fill: P.lemonade, x: 22, y: 0, size: 62, motion: "sway", duration: 5 },
    { shape: "coin", x: 0, y: 62, size: 30, motion: "spin", duration: 6.5, delay: 0.8 },
  ],
  finishLeft: [
    { shape: "mountains", x: 0, y: 0, size: 100, motion: "still", duration: 1 },
    { shape: "sparkle", fill: P.lemonade, x: 76, y: -6, size: 20, motion: "twinkle", duration: 3.2, delay: 0.4 },
  ],
  finishRight: [
    { shape: "tree", fill: P.green, x: 8, y: 0, size: 62, motion: "sway", duration: 5 },
    { shape: "tree", fill: P.lime, x: 58, y: 28, size: 42, motion: "sway", duration: 5.8, delay: 0.7 },
  ],
  closingLeft: [
    { shape: "book", fill: P.sky, x: 0, y: 16, size: 66, motion: "float", duration: 6.5 },
    { shape: "sparkle", fill: P.lime, x: 72, y: 0, size: 24, motion: "twinkle", duration: 3.5, delay: 0.4 },
  ],
  closingRight: [
    { shape: "bubble", fill: P.baby, x: 18, y: 0, size: 64, motion: "float", duration: 5.8 },
    { shape: "blob", fill: P.lime, x: 0, y: 64, size: 26, motion: "float", duration: 7, delay: 1.2 },
  ],
} satisfies Record<string, Piece[]>;

export type SceneryVariant = keyof typeof SETS;

const MOTION: Record<Motion, string> = {
  float: styles.float,
  sway: styles.sway,
  spin: styles.spin,
  twinkle: styles.twinkle,
  drift: styles.drift,
  hop: styles.hop,
  tilt: styles.tilt,
  turn: styles.turn,
  still: styles.still,
};

function PieceShape({ shape, fill }: { shape: Shape; fill?: string }) {
  const className = styles.pieceSvg;
  switch (shape) {
    case "blob":
      return <Blob className={className} fill={fill} />;
    case "sparkle":
      return <Sparkle className={className} fill={fill} />;
    case "coin":
      return <Coin className={className} fill={fill} />;
    case "coins":
      return <Coins className={className} fill={fill} />;
    case "pill":
      return <Pill className={className} fill={fill} />;
    case "tree":
      return <Tree className={className} fill={fill} />;
    case "sign":
      return <Sign className={className} fill={fill} />;
    case "pin":
      return <Pin className={className} fill={fill} />;
    case "lock":
      return <Lock className={className} fill={fill} />;
    case "note":
      return <Note className={className} fill={fill} />;
    case "map":
      return <MapSheet className={className} fill={fill} />;
    case "dots":
      return <DottedDisc className={className} fill={fill} />;
    case "squiggle":
      return <Squiggle className={className} fill={fill} />;
    case "plus":
      return <Plus className={className} fill={fill} />;
    case "mountains":
      return <Mountains className={className} fill={fill} />;
    case "compass":
      return <Compass className={className} fill={fill} />;
    case "book":
      return <Book className={className} fill={fill} />;
    case "bubble":
      return <Bubble className={className} fill={fill} dotClass={styles.typingDot} />;
    case "shield":
      return <Shield className={className} fill={fill} />;
  }
}

interface SceneryProps {
  variant: SceneryVariant;
  className?: string;
  /** Side of the square box on desktop, in rem. */
  size?: number;
  /** The same on mobile (defaults to 60% of `size`). */
  sizeMobile?: number;
  /** How far the group drifts against the scroll (0 keeps it still). */
  depth?: number;
}

/** A small group of moving pieces, placed by the parent and drifting a little against the scroll. Decorative only. */
export function Scenery({ variant, className, size = 14, sizeMobile, depth = 0.6 }: SceneryProps) {
  const ref = useRef<HTMLSpanElement>(null);
  useParallax(ref, depth);

  const boxStyle = {
    "--scenery-size": `${size}rem`,
    "--scenery-size-mobile": `${sizeMobile ?? Math.round(size * 6) / 10}rem`,
  } as CSSProperties;

  return (
    <span ref={ref} className={className ? `${styles.scenery} ${className}` : styles.scenery} style={boxStyle} aria-hidden="true">
      {(SETS[variant] as Piece[]).map((piece, index) => {
        const style = {
          left: `${piece.x}%`,
          top: `${piece.y}%`,
          width: `${piece.size}%`,
          height: `${piece.size}%`,
          "--r": `${piece.rotate ?? 0}deg`,
          animationDuration: `${piece.duration}s`,
          animationDelay: `${piece.delay ?? 0}s`,
        } as CSSProperties;
        return (
          <span key={index} className={`${styles.piece} ${MOTION[piece.motion]}`} style={style}>
            <PieceShape shape={piece.shape} fill={piece.fill} />
          </span>
        );
      })}
    </span>
  );
}
