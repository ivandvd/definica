"use client";

import { useEffect, useId, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Asset } from "../lib/types";
import { MARK_D, MARK_SLASH } from "./brand";
import { INK, LINE as SCENE_LINE, Sparkle } from "./scenes";

/*
 * A transaction's stage, in the scenes' sticker style: one picture per state, cross-fading as the
 * transaction moves on. The wallet window waits for you (its button pressing, a coin bobbing); the
 * block takes your coin in while the network confirms; a check lands on it; the lime seal and
 * confetti when it's through. The endings that aren't: the wallet shakes its head, a coral sticker
 * with a "!" drops in, the plug can't reach its socket, the sign wobbles. Every picture sits on the
 * same centre, so nothing jumps between states. Decorative: the pane's words say what happened.
 */

export type StageState = "wallet" | "signature" | "pending" | "updating" | "confirmed" | "rejected" | "reverted" | "network" | "error";

const C = {
  lime: "#d1f500",
  lemonade: "#fbe74e",
  baby: "#ffcadc",
  blush: "#ffe3df",
  sky: "#9dc4f5",
  mint: "#e2f2e5",
  coral: "#ff5a4d",
  stone: "#c9d0cb",
  green: "#5ccf55",
  blue: "#3462d8",
  white: "#ffffff",
};

/** The centre every picture is drawn around: drawn on 280 × 160, framed a little tighter (244 × 140) so it fills its box. */
/** The scenes' outline, a touch finer: the frame's zoom brings it back to the same weight. */
const LINE = { ...SCENE_LINE, strokeWidth: 1.4 };

const X = 140;
const Y = 76;

function Stage({ children }: { children: ReactNode }) {
  return (
    <svg className="block h-auto w-full overflow-visible" viewBox="18 6 244 140" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

const Shadow = ({ y, rx }: { y: number; rx: number }) => <ellipse cx={X} cy={y} rx={rx} ry="5" fill={INK} opacity="0.08" />;

/** The coin on the move: a Vault share (ink, lime D) or an ETH coin, radius r, at the origin. */
function Token({ asset, r }: { asset: Asset | null; r: number }) {
  const k = r / 10.5;
  if (asset === "shares") {
    return (
      <g>
        <circle r={r} fill={INK} {...LINE} />
        <g transform={`translate(${-6 * k} ${-6.4 * k}) scale(${0.53 * k})`}>
          <path fillRule="evenodd" clipRule="evenodd" d={MARK_D} fill={C.lime} />
          <path d={MARK_SLASH} fill={C.lime} />
        </g>
      </g>
    );
  }
  return (
    <g>
      <circle r={r} fill={C.sky} {...LINE} />
      <g transform={`scale(${k})`} fill={INK}>
        <path d="M0-6.6 4.2 0.3 0 2.8-4.2 0.3Z" />
        <path d="M-4.2 1.5 0 4 4.2 1.5 0 7Z" />
      </g>
    </g>
  );
}

/** A round sticker badge with a mark in it, popping in. */
function Badge({ x, y, fill, children, delay = 0.3 }: { x: number; y: number; fill: string; children: ReactNode; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="tx-pop" style={{ animationDelay: `${delay}s` }}>
        <circle r="12" fill={fill} {...LINE} />
        {children}
      </g>
    </g>
  );
}

const Cross = ({ size = 4.2, width = 2.4 }: { size?: number; width?: number }) => (
  <path d={`M${-size} ${-size}L${size} ${size}M${size} ${-size}L${-size} ${size}`} stroke={INK} strokeWidth={width} strokeLinecap="round" />
);

/* ---------- the wallet window ---------- */

/** A wallet window, 68 × 100, centred: header, what it asks, and its confirm button. */
function WalletWindow({ children, button }: { children: ReactNode; button: ReactNode }) {
  return (
    <g>
      <rect x="106" y="26" width="68" height="100" rx="14" fill={C.white} {...LINE} />
      <rect x="116" y="35" width="11" height="11" rx="3.5" fill={C.coral} {...LINE} strokeWidth={1.2} />
      <rect x="132" y="38" width="30" height="5" rx="2.5" fill={C.stone} />
      <path d="M106 54h68" stroke={INK} strokeWidth={1.2} opacity={0.12} />
      {children}
      {button}
    </g>
  );
}

const BUTTON = { x: 118, y: 102, width: 44, height: 15, rx: 7.5 };

function WalletArt({ asset, signature }: { asset: Asset | null; signature: boolean }) {
  return (
    <Stage>
      <Shadow y={136} rx={40} />
      <g transform={`translate(${X} ${Y})`}>
        <circle className="tx-ring" r="56" fill="none" stroke={C.lime} strokeWidth="3" />
        <circle className="tx-ring" r="56" fill="none" stroke={C.lime} strokeWidth="3" style={{ animationDelay: "1s" }} />
      </g>
      <WalletWindow
        button={
          <g>
            <circle className="tx-tap" cx={X} cy="109.5" r="8" fill="none" stroke={INK} strokeWidth={1.4} />
            <g className="tx-press">
              <rect {...BUTTON} fill={signature ? C.lemonade : C.lime} {...LINE} />
              <path d="M134.8 109.6 138.4 113 145.4 106" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        }
      >
        {signature ? (
          <g>
            <rect x="118" y="63" width="44" height="4.5" rx="2.25" fill={C.stone} />
            <rect x="118" y="72" width="30" height="4.5" rx="2.25" fill={C.stone} />
            <path
              className="tx-sign"
              pathLength={1}
              d="M120 92c2-6 5-10 7-8s-2 8 1 8 4-9 7-8-1 7 2 7 4-6 7-5 1 4 4 3 5-3 9-3"
              fill="none"
              stroke={INK}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M118 97h44" stroke={INK} strokeWidth={1.2} strokeDasharray="2 3" opacity={0.35} />
          </g>
        ) : (
          <g transform="translate(140 78)">
            <g className="tx-bob">
              <Token asset={asset} r={15} />
            </g>
          </g>
        )}
      </WalletWindow>
      <Sparkle x={74} y={42} size={0.8} />
      <Sparkle x={208} y={110} size={0.6} fill={C.baby} delay={0.8} />
    </Stage>
  );
}

/** Declined: the same window shakes its head, its button greys out, a cross pops on its corner. */
function RejectedArt({ asset }: { asset: Asset | null }) {
  return (
    <Stage>
      <Shadow y={136} rx={40} />
      <g className="tx-no">
        <WalletWindow
          button={
            <g>
              <rect {...BUTTON} fill={C.stone} {...LINE} />
              <g transform="translate(140 109.5)">
                <Cross size={3.2} width={1.8} />
              </g>
            </g>
          }
        >
          <g transform="translate(140 78)">
            <Token asset={asset} r={15} />
          </g>
        </WalletWindow>
        <Badge x={172} y={30} fill={C.lemonade}>
          <Cross />
        </Badge>
      </g>
    </Stage>
  );
}

/* ---------- the chain ---------- */

/** An isometric block (48 × 56 at s = 1), centred on x, y. */
function Block({ x, y, s, top, left, right, dashed = false }: { x: number; y: number; s: number; top: string; left: string; right: string; dashed?: boolean }) {
  const line = { stroke: INK, strokeWidth: 1.4 / s, strokeLinejoin: "round" as const, strokeDasharray: dashed ? `${3 / s} ${3 / s}` : undefined };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0-28 24-14 0 0-24-14Z" fill={top} {...line} />
      <path d="M-24-14 0 0V28L-24 14Z" fill={left} {...line} />
      <path d="M24-14 0 0V28L24 14Z" fill={right} {...line} />
    </g>
  );
}

/** The last block, the links either side, and the next block still forming. */
function Chain({ forming = true, links = true }: { forming?: boolean; links?: boolean }) {
  return (
    <g>
      <Shadow y={115} rx={100} />
      <Block x={78} y={94} s={0.6} top={C.mint} left={C.white} right={C.mint} />
      <g opacity={forming ? 1 : 0.55}>
        <Block x={202} y={94} s={0.6} top={C.white} left={C.white} right={C.white} dashed />
        {forming ? (
          <g className="tx-build">
            <Block x={202} y={94} s={0.6} top={C.lime} left={C.white} right={C.mint} />
          </g>
        ) : null}
      </g>
      {links ? (
        <g stroke={INK} strokeWidth={2} strokeLinecap="round">
          <path className="tx-link" d="M95 93 107 87.5" />
          <path className="tx-link" d="M173 87.5 185 93" />
        </g>
      ) : null}
    </g>
  );
}

/** Sent: the coin hops from the last block into the new one, which takes it in with a thump. */
function PendingArt({ asset }: { asset: Asset | null }) {
  return (
    <Stage>
      <Chain />
      <g className="tx-thump">
        <Block x={X} y={Y} s={1.25} top={C.lime} left={C.white} right={C.mint} />
      </g>
      <g transform="translate(140 54)">
        <g className="tx-hop">
          <Token asset={asset} r={12} />
        </g>
      </g>
      <Sparkle x={62} y={44} size={0.75} />
      <Sparkle x={220} y={48} size={0.6} fill={C.sky} delay={0.7} />
    </Stage>
  );
}

/** Confirmed, reading the new position: a check lands on the block, a ring turning round it. */
function UpdatingArt() {
  return (
    <Stage>
      <Chain forming={false} links={false} />
      <Block x={202} y={94} s={0.6} top={C.lime} left={C.white} right={C.mint} />
      <Block x={X} y={Y} s={1.25} top={C.lime} left={C.white} right={C.mint} />
      <g transform="translate(140 50)">
        <circle className="tx-turn" r="19" fill="none" stroke={INK} strokeWidth={1.6} strokeDasharray="4 5" strokeLinecap="round" />
        <g className="tx-pop">
          <circle r="13" fill={C.lime} {...LINE} />
          <path d="M-5.6 0.4-1.6 4.2 5.8-3.6" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
      <Sparkle x={62} y={44} size={0.75} />
      <Sparkle x={220} y={48} size={0.6} fill={C.sky} delay={0.7} />
    </Stage>
  );
}

/** Short strokes either side of the sticker, flicking out as it shakes. */
const SHAKE = [-62, -42, 42, 62];

/** Failed onchain: a coral sticker with a "!" drops in and shakes. Nothing else moved. */
function RevertedArt() {
  return (
    <Stage>
      <Shadow y={128} rx={34} />
      <g transform={`translate(${X} ${Y})`}>
        {SHAKE.map((angle) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path className="tx-flick" d="M0-50V-58" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
          </g>
        ))}
        <g className="tx-thud">
          <g className="tx-jolt-late">
            <circle r="40" fill={C.coral} {...LINE} />
            <circle r="31" fill="none" stroke={INK} strokeWidth={1.2} strokeDasharray="2 4" opacity={0.4} />
            <path d="M0-18V4" stroke={INK} strokeWidth={7} strokeLinecap="round" />
            <circle cy="17" r="4.4" fill={INK} />
          </g>
        </g>
      </g>
      <Sparkle x={84} y={106} size={0.55} fill={C.baby} delay={0.6} />
      <Sparkle x={198} y={106} size={0.5} fill={C.stone} delay={1.2} />
    </Stage>
  );
}

/* ---------- the seal ---------- */

/** A scalloped sticker seal's outline: `bumps` arcs bulging out from a circle of radius r. */
function scallop(cx: number, cy: number, r: number, bumps: number) {
  const step = (Math.PI * 2) / bumps;
  const arc = r * Math.sin(step / 2) * 1.12;
  let d = "";
  for (let i = 0; i <= bumps; i++) {
    const angle = -Math.PI / 2 + i * step;
    const x = (cx + r * Math.cos(angle)).toFixed(2);
    const y = (cy + r * Math.sin(angle)).toFixed(2);
    d += i === 0 ? `M${x} ${y}` : `A${arc.toFixed(2)} ${arc.toFixed(2)} 0 0 1 ${x} ${y}`;
  }
  return `${d}Z`;
}

const SEAL = scallop(0, 0, 41, 16);

const CONFETTI: { x: number; y: number; r: number; fill: string; shape: "bar" | "dot" | "tri" }[] = [
  { x: -98, y: -34, r: 150, fill: C.sky, shape: "bar" },
  { x: -66, y: -60, r: -110, fill: C.coral, shape: "dot" },
  { x: -30, y: -70, r: 210, fill: C.lemonade, shape: "bar" },
  { x: 32, y: -70, r: -170, fill: C.baby, shape: "tri" },
  { x: 70, y: -58, r: 130, fill: C.green, shape: "bar" },
  { x: 100, y: -28, r: -210, fill: C.blue, shape: "dot" },
  { x: -108, y: 10, r: 100, fill: C.lemonade, shape: "tri" },
  { x: 108, y: 14, r: -130, fill: C.coral, shape: "bar" },
  { x: -84, y: 46, r: 170, fill: C.green, shape: "dot" },
  { x: 86, y: 48, r: -90, fill: C.sky, shape: "tri" },
  { x: -46, y: 60, r: 70, fill: C.baby, shape: "bar" },
  { x: 50, y: 60, r: -150, fill: C.lemonade, shape: "dot" },
];

function ConfettiPiece({ shape, fill }: { shape: "bar" | "dot" | "tri"; fill: string }) {
  const line = { stroke: INK, strokeWidth: 1.2, strokeLinejoin: "round" as const };
  if (shape === "dot") return <circle r="3.2" fill={fill} {...line} />;
  if (shape === "tri") return <path d="M0-4.4 4 2.8H-4Z" fill={fill} {...line} />;
  return <rect x="-5" y="-2.2" width="10" height="4.4" rx="1.4" fill={fill} {...line} />;
}

/** Through: the lime seal spins in, its check draws itself, the burst and the confetti fly out. */
function ConfirmedArt() {
  return (
    <Stage>
      <Shadow y={134} rx={38} />
      <g transform={`translate(${X} ${Y})`}>
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 30})`}>
            <path className="tx-burst" d="M0-57V-65" stroke={INK} strokeWidth={2.4} strokeLinecap="round" style={{ animationDelay: `${0.22 + (i % 2) * 0.06}s` }} />
          </g>
        ))}
        {CONFETTI.map((piece, i) => (
          <g
            key={i}
            className="tx-confetti"
            style={{ "--x": `${piece.x}px`, "--y": `${piece.y}px`, "--r": `${piece.r}deg`, animationDelay: `${0.18 + (i % 4) * 0.04}s` } as CSSProperties}
          >
            <ConfettiPiece shape={piece.shape} fill={piece.fill} />
          </g>
        ))}
        <g className="tx-seal">
          <g className="tx-turn tx-turn-slow">
            <path d={SEAL} fill={C.lime} {...LINE} />
          </g>
          <circle r="31" fill="none" stroke={INK} strokeWidth={1.2} strokeDasharray="2 4" opacity={0.4} />
          <path className="tx-draw" pathLength={1} d="M-19-2.6-7 9.4 18.6-16.2" fill="none" stroke={INK} strokeWidth={6.4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
      <Sparkle x={70} y={40} size={0.8} delay={0.4} />
      <Sparkle x={214} y={108} size={0.65} fill={C.baby} delay={1} />
      <Sparkle x={206} y={34} size={0.5} fill={C.sky} delay={0.7} />
    </Stage>
  );
}

/* ---------- the network, other problems ---------- */

/** Unreachable: the plug keeps reaching for its socket, sparks in the gap. */
function NetworkArt() {
  return (
    <Stage>
      <Shadow y={112} rx={84} />
      <path d="M176 76h22c18 0 22-16 42-16" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <rect x="150" y="62" width="26" height="28" rx="7" fill={C.sky} {...LINE} />
      <rect x="153" y="68" width="5" height="4" rx="1" fill={INK} />
      <rect x="153" y="80" width="5" height="4" rx="1" fill={INK} />
      <g className="tx-plug">
        <path d="M40 92c20 0 22-16 42-16h14" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <rect x="120" y="68" width="11" height="4" rx="1.5" fill={C.white} {...LINE} strokeWidth={1.2} />
        <rect x="120" y="80" width="11" height="4" rx="1.5" fill={C.white} {...LINE} strokeWidth={1.2} />
        <rect x="96" y="63" width="25" height="26" rx="6" fill={C.lemonade} {...LINE} />
      </g>
      {[
        { x: 141, y: 56, rotate: -14 },
        { x: 142, y: 98, rotate: 16 },
      ].map((spark) => (
        <g key={spark.y} transform={`translate(${spark.x} ${spark.y}) rotate(${spark.rotate})`}>
          <path className="tx-spark" d="M1.5-7-3.5 0.5H1L-1.5 7 4-0.8H-0.5Z" fill={C.lemonade} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
        </g>
      ))}
      <Sparkle x={66} y={40} size={0.6} fill={C.baby} delay={0.5} />
    </Stage>
  );
}

/** Anything else: the warning sign, wobbling gently. */
function ErrorArt() {
  return (
    <Stage>
      <Shadow y={122} rx={44} />
      <g className="tx-wobble">
        <path d="M140 36 186 116H94Z" fill={C.lemonade} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M140 64V88" stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <circle cx="140" cy="102" r="3.8" fill={INK} />
      </g>
      <Sparkle x={76} y={46} size={0.6} delay={0.3} />
      <Sparkle x={206} y={50} size={0.5} fill={C.sky} delay={0.9} />
    </Stage>
  );
}

function Art({ state, asset }: { state: StageState; asset: Asset | null }) {
  switch (state) {
    case "wallet":
    case "signature":
      return <WalletArt asset={asset} signature={state === "signature"} />;
    case "pending":
      return <PendingArt asset={asset} />;
    case "updating":
      return <UpdatingArt />;
    case "confirmed":
      return <ConfirmedArt />;
    case "rejected":
      return <RejectedArt asset={asset} />;
    case "reverted":
      return <RevertedArt />;
    case "network":
      return <NetworkArt />;
    default:
      return <ErrorArt />;
  }
}

/**
 * The stage for a transaction's state. When the state moves on, the old picture fades out under
 * the new one. `success` replaces the seal with an action's own ending (the factory, the safe).
 */
export function TxStage({ state, asset, success, className }: { state: StageState; asset: Asset | null; success?: ReactNode; className?: string }) {
  const [layers, setLayers] = useState<{ current: StageState; previous: StageState | null }>({ current: state, previous: null });
  if (layers.current !== state) setLayers({ current: state, previous: layers.current });

  useEffect(() => {
    if (!layers.previous) return;
    const timer = window.setTimeout(() => setLayers((value) => ({ ...value, previous: null })), 320);
    return () => window.clearTimeout(timer);
  }, [layers.previous]);

  const shown = layers.previous && layers.previous !== layers.current ? [layers.previous, layers.current] : [layers.current];
  return (
    <div className={cn("relative mx-auto aspect-[7/4] w-full max-w-[280px]", className)} aria-hidden="true">
      {shown.map((item) => (
        <div key={item} className={cn("absolute inset-0 flex items-center justify-center", item === layers.current ? "tx-layer-in" : "tx-layer-out")}>
          {item === "confirmed" && success ? success : <Art state={item} asset={asset} />}
        </div>
      ))}
    </div>
  );
}

/**
 * The wallet window's request glyph, drawn on its own grid so it sits dead centre in its disc: an
 * arrow that leaves through the top and comes back from below (a transaction), or a pen nib
 * writing (a signature).
 */
export function RequestGlyph({ signature, className }: { signature: boolean; className?: string }) {
  const clip = `glyph-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg className={cn("block size-12", className)} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clip}>
          <circle cx="24" cy="24" r="22.5" />
        </clipPath>
      </defs>
      <circle cx="24" cy="24" r="23.25" fill={signature ? C.lemonade : C.lime} stroke={INK} strokeWidth="1.5" />
      <g clipPath={`url(#${clip})`}>
        {signature ? (
          <g className="glyph-sign">
            <path d="M24 34.5 31 23.5 28.4 15.5H19.6L17 23.5Z" fill={C.white} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M24 34.5V25.8" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="24" cy="23.8" r="1.9" fill={INK} />
          </g>
        ) : (
          <g className="glyph-send">
            <path d="M24 32.6V17.6M17 24.6l7-7 7 7" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </g>
    </svg>
  );
}
