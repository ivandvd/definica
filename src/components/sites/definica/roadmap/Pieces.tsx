import { useId, type CSSProperties, type ReactNode } from "react";
import { BLOB_FILLS } from "../shared/SurtitleWithDot";
import { INK } from "./Blob";

/** The site's lime (the launch button, the footer). */
export const LIME = "#d1f500";

/** The colours the roadmap's graphics are drawn in: the blob fills, lime, mint and white. */
export const PALETTE = {
  ink: INK,
  lime: LIME,
  green: BLOB_FILLS.green,
  baby: BLOB_FILLS.baby,
  lemonade: BLOB_FILLS.lemonade,
  sky: BLOB_FILLS.sky,
  mint: "#d6eedb",
  white: "#ffffff",
} as const;

export interface PieceProps {
  className?: string;
  style?: CSSProperties;
  fill?: string;
}

/** Outline shared by every piece: the blob's ink, a little lighter than the road's. */
const OUTLINE = { stroke: INK, strokeWidth: 2.2, strokeLinejoin: "round", strokeLinecap: "round" } as const;

function Svg({ className, style, children, viewBox = "0 0 48 48" }: PieceProps & { children: ReactNode; viewBox?: string }) {
  return (
    <svg className={className} style={style} viewBox={viewBox} overflow="visible" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

/** A four-point sparkle. */
export function Sparkle({ fill = LIME, ...rest }: PieceProps) {
  return (
    <Svg {...rest} viewBox="0 0 24 24">
      <path
        d="M12 1.5C12.8 7.4 16.6 11.2 22.5 12 16.6 12.8 12.8 16.6 12 22.5 11.2 16.6 7.4 12.8 1.5 12 7.4 11.2 11.2 7.4 12 1.5Z"
        fill={fill}
        stroke={INK}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** An ETH coin, face on. */
export function Coin({ fill = PALETTE.lemonade, ...rest }: PieceProps) {
  return (
    <Svg {...rest}>
      <circle cx="24" cy="24" r="20" fill={fill} {...OUTLINE} />
      <circle cx="24" cy="24" r="14.5" fill="none" stroke={INK} strokeWidth="1.6" />
      <path d="M24 13.5 30.5 24.3 24 28.2 17.5 24.3Z" fill={PALETTE.white} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M17.5 26.6 24 30.5 30.5 26.6 24 35Z" fill={PALETTE.white} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
    </Svg>
  );
}

/** Three coins in a stack. */
export function Coins({ fill = PALETTE.lemonade, ...rest }: PieceProps) {
  return (
    <Svg {...rest}>
      {[34, 27, 20].map((cy) => (
        <g key={cy}>
          <path d={`M8 ${cy}v5a16 5.5 0 0 0 32 0v-5`} fill={fill} {...OUTLINE} />
          <ellipse cx="24" cy={cy} rx="16" ry="5.5" fill={fill} {...OUTLINE} />
          <ellipse cx="24" cy={cy} rx="10.5" ry="3.2" fill="none" stroke={INK} strokeWidth="1.4" />
        </g>
      ))}
    </Svg>
  );
}

/** A rounded bar with a highlight. */
export function Pill({ fill = PALETTE.baby, ...rest }: PieceProps) {
  return (
    <Svg {...rest}>
      <rect x="4" y="17" width="40" height="14" rx="7" fill={fill} {...OUTLINE} />
      <path d="M11 21.5h11" stroke={PALETTE.white} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

/** A lollipop tree on a stick. */
export function Tree({ fill = LIME, ...rest }: PieceProps) {
  return (
    <Svg {...rest}>
      <path d="M24 29v16M18 45h12" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="24" cy="17" r="13" fill={fill} {...OUTLINE} />
      <path d="M16.5 14.5a8.5 8.5 0 0 1 6-6" fill="none" stroke={PALETTE.white} strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );
}

/** A diamond road sign with an arrow, on a post. */
export function Sign({ fill = PALETTE.lemonade, ...rest }: PieceProps) {
  return (
    <Svg {...rest}>
      <path d="M24 31v15" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M24 3 41 18 24 33 7 18Z" fill={fill} {...OUTLINE} />
      <path
        d="M19 23 28.5 13.5M22.5 13h6.5v6.5"
        fill="none"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** A map pin. */
export function Pin({ fill = LIME, ...rest }: PieceProps) {
  return (
    <Svg {...rest}>
      <path d="M24 45S9 30.5 9 19.5a15 15 0 0 1 30 0C39 30.5 24 45 24 45Z" fill={fill} {...OUTLINE} />
      <circle cx="24" cy="19.5" r="5.5" fill={PALETTE.white} stroke={INK} strokeWidth="2" />
    </Svg>
  );
}

/** A padlock. */
export function Lock({ fill = PALETTE.baby, ...rest }: PieceProps) {
  return (
    <Svg {...rest}>
      <path d="M15.5 22v-6.5a8.5 8.5 0 0 1 17 0V22" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      <rect x="9" y="21" width="30" height="23" rx="6" fill={fill} {...OUTLINE} />
      <circle cx="24" cy="30.5" r="3.4" fill={INK} />
      <path d="M24 32v5.5" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
    </Svg>
  );
}

/** A sticky note with a folded corner and an ink shadow. */
export function Note({ fill = PALETTE.lemonade, ...rest }: PieceProps) {
  return (
    <Svg {...rest}>
      <path d="M11 10h30v24l-8 8H11Z" fill={INK} />
      <path d="M7 6h30v24l-8 8H7Z" fill={fill} {...OUTLINE} />
      <path d="M29 38v-8h8" fill={PALETTE.white} {...OUTLINE} />
      <path d="M13 14h17M13 20h18M13 26h10" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

/** A folded map with a dashed route. */
export function MapSheet({ fill = PALETTE.mint, ...rest }: PieceProps) {
  return (
    <Svg {...rest}>
      <path d="M5 12 17 7v29L5 41Z" fill={fill} />
      <path d="M17 7 31 12v29l-14-5Z" fill={PALETTE.white} />
      <path d="M31 12 43 7v29l-12 5Z" fill={fill} />
      <path d="M5 12 17 7 31 12 43 7V36L31 41 17 36 5 41Z" fill="none" {...OUTLINE} />
      <path d="M17 7v29M31 12v29" stroke={INK} strokeWidth="1.8" />
      <path d="M10 31c4-6 8-1 12-6s8-9 13-4" fill="none" stroke={INK} strokeWidth="1.8" strokeDasharray="2.6 2.6" strokeLinecap="round" />
      <circle cx="35.5" cy="20.5" r="2.8" fill={PALETTE.baby} stroke={INK} strokeWidth="1.6" />
    </Svg>
  );
}

/** A disc dotted with white, around a coloured centre. */
export function DottedDisc({ fill = LIME, centre = PALETTE.baby, ...rest }: PieceProps & { centre?: string }) {
  const id = `dots-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <Svg {...rest}>
      <defs>
        <pattern id={id} width="4.2" height="4.2" patternUnits="userSpaceOnUse">
          <circle cx="2.1" cy="2.1" r="0.8" fill={PALETTE.white} />
        </pattern>
      </defs>
      <circle cx="24" cy="24" r="20" fill={fill} />
      <circle cx="24" cy="24" r="20" fill={`url(#${id})`} {...OUTLINE} />
      <circle cx="24" cy="24" r="8.5" fill={centre} {...OUTLINE} />
    </Svg>
  );
}

/** A wavy ribbon. */
export function Squiggle({ fill = PALETTE.sky, ...rest }: PieceProps) {
  const d = "M6 27Q12 15 18 27T30 27T42 27";
  return (
    <Svg {...rest}>
      <path d={d} fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={fill} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** A chunky plus. */
export function Plus({ fill = PALETTE.sky, ...rest }: PieceProps) {
  return (
    <Svg {...rest}>
      <path d="M19 5h10v14h14v10H29v14H19V29H5V19h14Z" fill={fill} {...OUTLINE} />
    </Svg>
  );
}

/** Two snow-capped peaks. */
export function Mountains({ fill = PALETTE.mint, back = PALETTE.sky, ...rest }: PieceProps & { back?: string }) {
  return (
    <Svg {...rest}>
      <path d="M17 42 31 14 45 42Z" fill={back} {...OUTLINE} />
      <path d="M31 14 34 20 32.4 21.6 31 20 29.6 21.6 28 20Z" fill={PALETTE.white} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 42 18 18 33 42Z" fill={fill} {...OUTLINE} />
      <path
        d="M18 18 21.75 24 19.8 25.6 18 24 16.2 25.6 14.25 24Z"
        fill={PALETTE.white}
        stroke={INK}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M2 42h44" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
    </Svg>
  );
}

/** An eight-point compass star. */
export function Compass({ fill = PALETTE.lemonade, ...rest }: PieceProps) {
  return (
    <Svg {...rest}>
      <path
        d="M24 9 26.6 21.4 39 24 26.6 26.6 24 39 21.4 26.6 9 24 21.4 21.4Z"
        transform="rotate(45 24 24)"
        fill={PALETTE.white}
        {...OUTLINE}
      />
      <path d="M24 2 28 20 46 24 28 28 24 46 20 28 2 24 20 20Z" fill={fill} {...OUTLINE} />
      <circle cx="24" cy="24" r="2.6" fill={INK} />
    </Svg>
  );
}

/** An open book. */
export function Book({ fill = PALETTE.sky, ...rest }: PieceProps) {
  return (
    <Svg {...rest}>
      <path
        d="M24 13c-5-3.5-12-4-19-2.5V38c7-1.5 14-1 19 2.5 5-3.5 12-4 19-2.5V10.5C36 9 29 9.5 24 13Z"
        fill={fill}
        {...OUTLINE}
      />
      <path d="M24 13v27.5" fill="none" stroke={INK} strokeWidth="2.2" />
      <path
        d="M9.5 17.5c3.4-.6 6.8-.3 10 .9M9.5 23.5c3.4-.6 6.8-.3 10 .9M9.5 29.5c2.5-.4 5-.3 7.4.4M28.5 18.4c3.2-1.2 6.6-1.5 10-.9M28.5 24.4c3.2-1.2 6.6-1.5 10-.9M28.5 30.4c2.4-.8 4.9-1 7.4-.6"
        fill="none"
        stroke={INK}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** A speech bubble; `dotClass` animates its three dots. */
export function Bubble({ fill = PALETTE.baby, dotClass, ...rest }: PieceProps & { dotClass?: string }) {
  return (
    <Svg {...rest}>
      <path
        d="M11 7h26a7 7 0 0 1 7 7v13a7 7 0 0 1-7 7H23l-9 8v-8h-3a7 7 0 0 1-7-7V14a7 7 0 0 1 7-7Z"
        fill={fill}
        {...OUTLINE}
      />
      {[15.5, 24, 32.5].map((cx) => (
        <circle key={cx} className={dotClass} cx={cx} cy="20.5" r="2.7" fill={INK} />
      ))}
    </Svg>
  );
}

/** A shield with a tick. */
export function Shield({ fill = PALETTE.mint, ...rest }: PieceProps) {
  return (
    <Svg {...rest}>
      <path d="M24 4 40 10v12c0 10-7 17.5-16 21-9-3.5-16-11-16-21V10Z" fill={fill} {...OUTLINE} />
      <path d="M17 24.5 22 29.5 31.5 19" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
