import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * The app's own illustrations, drawn in the landing page's sticker style: flat pastel shapes, a
 * thin ink outline, small sparkles. Each moves a little (float, bob, twinkle) and holds still when
 * reduced motion is on. Decorative: hidden from screen readers.
 */

const INK = "#001405";
const LINE = { stroke: INK, strokeWidth: 1.6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const C = {
  lemonade: "#fbe74e",
  baby: "#ffcadc",
  mint: "#e2f2e5",
  sky: "#9dc4f5",
  coral: "#ff5a4d",
  lime: "#d1f500",
  green: "#5ccf55",
  blue: "#3462d8",
  white: "#ffffff",
  stone: "#c9d0cb",
};

function Art({ children, className, viewBox = "0 0 160 120" }: { children: ReactNode; className?: string; viewBox?: string }) {
  return (
    <svg className={cn("block h-auto w-[148px] overflow-visible", className)} viewBox={viewBox} aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

/** A four-point sparkle that twinkles. */
function Sparkle({ x, y, size = 1, fill = C.lime, delay = 0 }: { x: number; y: number; size?: number; fill?: string; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <path
        d="M0-9C1.4-1.4 1.4-1.4 9 0 1.4 1.4 1.4 1.4 0 9-1.4 1.4-1.4 1.4-9 0-1.4-1.4-1.4-1.4 0-9Z"
        fill={fill}
        {...LINE}
        strokeWidth={1.4 / size}
        style={{ transformBox: "fill-box", transformOrigin: "center", animation: `art-twinkle 2.6s ease-in-out ${delay}s infinite` }}
      />
    </g>
  );
}

/** A coin seen from the side (a poker-chip stack piece) with its top face. */
function Coin({ x, y, fill, rx = 26, ry = 8.5, h = 7 }: { x: number; y: number; fill: string; rx?: number; ry?: number; h?: number }) {
  return (
    <g>
      <path d={`M${x - rx} ${y}v${h}a${rx} ${ry} 0 0 0 ${rx * 2} 0v${-h}`} fill={fill} {...LINE} />
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={fill} {...LINE} />
      <ellipse cx={x} cy={y} rx={rx - 7} ry={ry - 2.6} fill="none" stroke={INK} strokeWidth={1.1} opacity={0.35} />
    </g>
  );
}

/** The Ethereum diamond, small, in ink. */
function Diamond({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={INK}>
      <path d="M0-12 7.5 0.5 0 5 -7.5 0.5Z" />
      <path d="M-7.5 2.4 0 6.9 7.5 2.4 0 12.5Z" />
    </g>
  );
}

const float = (seconds: number, delay = 0) => ({ animation: `art-float ${seconds}s ease-in-out ${delay}s infinite` });

/** A stack of three coins with one more dropping on: staking, or no position yet. */
export function ArtCoins({ className }: { className?: string }) {
  return (
    <Art className={className}>
      <ellipse cx="80" cy="104" rx="42" ry="6" fill={INK} opacity="0.08" />
      <Coin x={80} y={92} fill={C.lemonade} />
      <Coin x={80} y={80} fill={C.baby} />
      <Coin x={80} y={68} fill={C.mint} />
      <g style={float(3.2)}>
        <circle cx="80" cy="36" r="18" fill={C.sky} {...LINE} />
        <circle cx="80" cy="36" r="13" fill="none" stroke={INK} strokeWidth={1.1} opacity={0.35} />
        <Diamond x={80} y={36} scale={0.82} />
      </g>
      <Sparkle x={124} y={30} size={0.9} />
      <Sparkle x={36} y={52} size={0.6} fill={C.baby} delay={0.8} />
      <Sparkle x={118} y={68} size={0.5} fill={C.sky} delay={1.4} />
    </Art>
  );
}

/** A door with an arrow leaving it: exits and the exit queue. */
export function ArtExit({ className }: { className?: string }) {
  return (
    <Art className={className}>
      <ellipse cx="74" cy="106" rx="46" ry="5.5" fill={INK} opacity="0.08" />
      <rect x="40" y="18" width="58" height="86" rx="10" fill={C.mint} {...LINE} />
      <rect x="48" y="26" width="42" height="78" rx="6" fill={C.white} {...LINE} />
      <circle cx="82" cy="66" r="3" fill={INK} />
      <g style={float(2.8)}>
        <path d="M96 60h40" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        <path d="M96 60h40" stroke={C.coral} strokeWidth={6} strokeLinecap="round" />
        <path d="M126 48l14 12-14 12" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M126 48l14 12-14 12" fill="none" stroke={C.coral} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g style={float(3.6, 0.4)}>
        <circle cx="30" cy="40" r="12" fill={C.lemonade} {...LINE} />
        <Diamond x={30} y={40} scale={0.52} />
      </g>
      <Sparkle x={120} y={26} size={0.7} delay={0.6} />
    </Art>
  );
}

/** A padlock with a calendar tag: share locks. */
export function ArtLock({ className }: { className?: string }) {
  return (
    <Art className={className}>
      <ellipse cx="80" cy="106" rx="40" ry="5.5" fill={INK} opacity="0.08" />
      <path d="M60 54V40a20 20 0 0 1 40 0v14" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <path d="M60 54V40a20 20 0 0 1 40 0v14" fill="none" stroke={C.stone} strokeWidth={5} strokeLinecap="round" />
      <rect x="46" y="52" width="68" height="52" rx="12" fill={C.lime} {...LINE} />
      <circle cx="80" cy="74" r="6" fill={INK} />
      <path d="M80 77v12" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <g style={{ ...float(3.4, 0.2), transformBox: "fill-box", transformOrigin: "top left" }}>
        <path d="M114 70l10-4" stroke={INK} strokeWidth={1.6} />
        <rect x="118" y="52" width="32" height="34" rx="6" fill={C.white} {...LINE} />
        <path d="M118 62h32" stroke={INK} strokeWidth={1.6} />
        <rect x="118" y="52" width="32" height="10" rx="5" fill={C.coral} {...LINE} />
        <text x="134" y="80" textAnchor="middle" fontFamily='"Tomato Grotesk", Arial, sans-serif' fontWeight="800" fontSize="15" fill={INK}>
          90
        </text>
      </g>
      <Sparkle x={34} y={40} size={0.8} fill={C.lemonade} />
      <Sparkle x={44} y={88} size={0.5} fill={C.sky} delay={1} />
    </Art>
  );
}

/** A drop in a ring, locked: committed liquidity (Phase 2). */
export function ArtLiquidity({ className }: { className?: string }) {
  return (
    <Art className={className}>
      <ellipse cx="78" cy="106" rx="44" ry="5.5" fill={INK} opacity="0.08" />
      <circle cx="74" cy="60" r="40" fill={C.sky} {...LINE} />
      <circle cx="74" cy="60" r="31" fill={C.white} {...LINE} />
      <g style={float(3)}>
        <path d="M74 36c10 13 15 21 15 28a15 15 0 0 1-30 0c0-7 5-15 15-28Z" fill={C.blue} {...LINE} />
        <path d="M67 66a7 7 0 0 0 6 7" fill="none" stroke={C.white} strokeWidth={2.6} strokeLinecap="round" />
      </g>
      <g style={float(3.8, 0.5)}>
        <path d="M112 74v-7a9 9 0 0 1 18 0v7" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <rect x="106" y="72" width="30" height="24" rx="6" fill={C.lime} {...LINE} />
        <circle cx="121" cy="83" r="2.8" fill={INK} />
      </g>
      <Sparkle x={30} y={26} size={0.75} fill={C.lime} delay={0.3} />
      <Sparkle x={130} y={30} size={0.55} fill={C.baby} delay={1.1} />
    </Art>
  );
}

/** A health gauge with its needle and a coin: borrowing (Phase 3). */
export function ArtBorrow({ className }: { className?: string }) {
  return (
    <Art className={className}>
      <ellipse cx="80" cy="106" rx="50" ry="5.5" fill={INK} opacity="0.08" />
      <path d="M28 92a52 52 0 0 1 104 0Z" fill={C.white} {...LINE} />
      <path d="M38 92a42 42 0 0 1 12.3-29.7" fill="none" stroke={C.coral} strokeWidth={9} />
      <path d="M50.3 62.3A42 42 0 0 1 80 50" fill="none" stroke={C.lemonade} strokeWidth={9} />
      <path d="M80 50a42 42 0 0 1 42 42" fill="none" stroke={C.green} strokeWidth={9} />
      <path d="M38 92a42 42 0 0 1 84 0" fill="none" stroke={INK} strokeWidth={1.4} opacity={0.5} />
      <g style={{ transformBox: "view-box", transformOrigin: "80px 92px", animation: "art-needle 4s ease-in-out infinite" }}>
        <path d="M80 92 108 62" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      </g>
      <circle cx="80" cy="92" r="7" fill={INK} />
      <path d="M22 92h116" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
      <g style={float(3.2, 0.3)}>
        <circle cx="136" cy="40" r="13" fill={C.mint} {...LINE} />
        <Diamond x={136} y={40} scale={0.56} />
      </g>
      <Sparkle x={26} y={42} size={0.7} delay={0.7} />
    </Art>
  );
}

/** A receipt with a clock: the history. */
export function ArtActivity({ className }: { className?: string }) {
  return (
    <Art className={className}>
      <ellipse cx="74" cy="108" rx="40" ry="5" fill={INK} opacity="0.08" />
      <path d="M44 14h56v86l-7-5-7 5-7-5-7 5-7-5-7 5-7-5-7 5Z" fill={C.white} {...LINE} />
      <path d="M54 32h36M54 44h28M54 56h36M54 68h22" stroke={INK} strokeWidth={2.4} strokeLinecap="round" opacity={0.75} />
      <path d="M78 80h12" stroke={C.green} strokeWidth={4} strokeLinecap="round" />
      <g style={float(3.4, 0.2)}>
        <circle cx="114" cy="74" r="20" fill={C.lemonade} {...LINE} />
        <path d="M114 62v12l8 5" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Sparkle x={34} y={28} size={0.65} fill={C.baby} delay={0.5} />
    </Art>
  );
}

/** A wallet with a lime card peeking out: connect a wallet. */
export function ArtWallet({ className }: { className?: string }) {
  return (
    <Art className={className}>
      <ellipse cx="80" cy="106" rx="46" ry="5.5" fill={INK} opacity="0.08" />
      <g style={float(3.2)}>
        <rect x="54" y="18" width="62" height="40" rx="7" fill={C.lime} {...LINE} transform="rotate(-8 85 38)" />
        <path d="M66 34h22" stroke={INK} strokeWidth={2.4} strokeLinecap="round" transform="rotate(-8 85 38)" />
      </g>
      <rect x="34" y="40" width="92" height="62" rx="12" fill={C.coral} {...LINE} />
      <path d="M34 54h92" stroke={INK} strokeWidth={1.6} />
      <rect x="98" y="62" width="34" height="24" rx="8" fill={C.white} {...LINE} />
      <circle cx="110" cy="74" r="4" fill={INK} />
      <Sparkle x={134} y={30} size={0.75} delay={0.4} />
      <Sparkle x={26} y={36} size={0.55} fill={C.sky} delay={1.2} />
    </Art>
  );
}

/** Three stacked layers: the three phases of one position. */
export function ArtPhases({ className }: { className?: string }) {
  return (
    <Art className={className}>
      <ellipse cx="80" cy="108" rx="48" ry="5" fill={INK} opacity="0.08" />
      <g style={float(3.6, 0.6)}>
        <path d="M80 70 128 84 80 98 32 84Z" fill={C.stone} {...LINE} />
      </g>
      <g style={float(3.6, 0.3)}>
        <path d="M80 50 128 64 80 78 32 64Z" fill={C.coral} {...LINE} />
      </g>
      <g style={float(3.6)}>
        <path d="M80 30 128 44 80 58 32 44Z" fill={C.lemonade} {...LINE} />
        <text x="80" y="48" textAnchor="middle" fontFamily='"Tomato Grotesk", Arial, sans-serif' fontWeight="800" fontSize="11" fill={INK}>
          1 · 2 · 3
        </text>
      </g>
      <Sparkle x={130} y={24} size={0.7} />
      <Sparkle x={28} y={30} size={0.5} fill={C.sky} delay={0.9} />
    </Art>
  );
}

/** A shield with a tick: safety, eligibility. */
export function ArtShield({ className, tone = "green" }: { className?: string; tone?: "green" | "coral" }) {
  return (
    <Art className={className}>
      <ellipse cx="80" cy="108" rx="36" ry="5" fill={INK} opacity="0.08" />
      <g style={float(3.4)}>
        <path d="M80 14l36 13v28c0 23-15 38-36 46-21-8-36-23-36-46V27Z" fill={tone === "green" ? C.mint : C.baby} {...LINE} />
        {tone === "green" ? (
          <path d="M64 58l11 11 22-24" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M68 46l24 24M92 46 68 70" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        )}
      </g>
      <Sparkle x={124} y={30} size={0.7} delay={0.3} />
      <Sparkle x={36} y={86} size={0.5} fill={C.lemonade} delay={1.1} />
    </Art>
  );
}

/** A gear and a toggle: settings. */
export function ArtSettings({ className }: { className?: string }) {
  return (
    <Art className={className}>
      <ellipse cx="80" cy="106" rx="44" ry="5" fill={INK} opacity="0.08" />
      <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "spin 12s linear infinite" }}>
        <path
          d="M64 22l6 9 10-2 3 10 10 4-3 10 7 8-8 6 1 10-10 2-3 10-10-3-7 7-6-8-10 1-1-10-10-4 4-9-6-8 8-6-1-10 10-2 4-9 9 4Z"
          fill={C.lemonade}
          {...LINE}
        />
        <circle cx="64" cy="58" r="12" fill={C.white} {...LINE} />
      </g>
      <rect x="96" y="66" width="44" height="24" rx="12" fill={INK} {...LINE} />
      <circle cx="128" cy="78" r="8" fill={C.lime} {...LINE} />
      <Sparkle x={128} y={40} size={0.7} delay={0.5} />
    </Art>
  );
}
