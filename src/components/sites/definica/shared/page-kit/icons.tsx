import type { ReactNode } from "react";
import { BLOB_PATH } from "../SurtitleWithDot";
import { Band, C, Chip, Coin, Eth, INK, Mark, sparklePath } from "./art";

/*
 * Small stickers for cards and lists, each drawn in a 64 × 64 box with the pages' ink outline
 * and a default tone that the caller can change. Decorative: hidden from assistive technology.
 */

const L = { stroke: INK, strokeWidth: 2.2, strokeLinejoin: "round", strokeLinecap: "round" } as const;

const shade = (cx = 32, rx = 20) => <ellipse cx={cx} cy={60} rx={rx} ry={3} fill={INK} opacity={0.08} />;

/** A gear's outline: `teeth` flat-topped teeth between two radii. */
function gearPath(cx: number, cy: number, outer: number, inner: number, teeth: number) {
  const points: string[] = [];
  const step = (Math.PI * 2) / (teeth * 4);
  for (let i = 0; i < teeth * 4; i++) {
    const r = i % 4 < 2 ? outer : inner;
    const a = (i - 0.5) * step - Math.PI / 2;
    points.push(`${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${points.join("L")}Z`;
}

interface IconDef {
  tone: string;
  draw: (tone: string) => ReactNode;
}

const ICONS = {
  wallet: {
    tone: C.coral,
    draw: (t) => (
      <>
        {shade()}
        <rect x="18" y="6" width="30" height="20" rx="3.5" fill={C.lime} {...L} transform="rotate(-10 33 16)" />
        <rect x="7" y="19" width="48" height="36" rx="8" fill={t} {...L} />
        <path d="M7 29h48" {...L} />
        <rect x="36" y="32" width="23" height="14" rx="6" fill={C.white} {...L} />
        <circle cx="43" cy="39" r="2.6" fill={INK} />
      </>
    ),
  },
  core: {
    tone: INK,
    draw: (t) => (
      <>
        {shade()}
        <rect x="8" y="7" width="48" height="48" rx="14" fill={t} />
        <Mark x={32.5} y={31} size={26} color={C.lime} accent={t} />
      </>
    ),
  },
  vault: {
    tone: C.baby,
    draw: (t) => (
      <>
        {shade()}
        <path d="M15 52v5M49 52v5" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        <rect x="8" y="8" width="48" height="45" rx="8" fill={t} {...L} />
        <rect x="14" y="14" width="36" height="33" rx="5" fill={C.white} {...L} />
        <circle cx="29" cy="30.5" r="9" fill={t} {...L} />
        <circle cx="29" cy="30.5" r="3" fill={INK} />
        <path d="M29 21.5V25M29 36v3.5M20 30.5h3.5M34.5 30.5H38" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <path d="M43.5 24.5v12" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
      </>
    ),
  },
  validators: {
    tone: C.mint,
    draw: (t) => (
      <>
        {shade()}
        {[9, 24, 39].map((y) => (
          <g key={y}>
            <rect x="9" y={y} width="46" height="13" rx="4.5" fill={t} {...L} />
            <circle cx="16.5" cy={y + 6.5} r="2" fill={INK} />
            <path d={`M23 ${y + 6.5}h12`} stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
            <circle cx="47" cy={y + 6.5} r="2.7" fill={C.lime} stroke={INK} strokeWidth="1.4" />
          </g>
        ))}
      </>
    ),
  },
  clock: {
    tone: C.lemonade,
    draw: (t) => (
      <>
        {shade()}
        <rect x="27" y="3" width="10" height="6" rx="2.5" fill={t} {...L} />
        <path d="M32 9v3" {...L} />
        <circle cx="32" cy="35" r="23" fill={t} {...L} />
        <circle cx="32" cy="35" r="17.5" fill={C.white} {...L} strokeWidth={1.8} />
        <path d="M32 20.5v3M32 46.5v3M17.5 35h3M43.5 35h3" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M32 35v-9M32 35l6.5 4" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
        <circle cx="32" cy="35" r="2.4" fill={INK} />
      </>
    ),
  },
  coin: {
    tone: C.lemonade,
    draw: (t) => (
      <>
        {shade()}
        <Coin x={32} y={31} r={24} fill={t} diamond="white" />
      </>
    ),
  },
  coins: {
    tone: C.sky,
    draw: (t) => (
      <>
        {shade(32, 23)}
        <Chip x={32} y={46} rx={22} ry={7} h={6} fill={C.lemonade} />
        <Chip x={32} y={36} rx={22} ry={7} h={6} fill={C.baby} />
        <Chip x={32} y={26} rx={22} ry={7} h={6} fill={t} />
        <Eth x={32} y={26} h={9} />
      </>
    ),
  },
  lock: {
    tone: C.lime,
    draw: (t) => (
      <>
        {shade()}
        <path d="M21 29v-8a11 11 0 0 1 22 0v8" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        <path d="M21 29v-8a11 11 0 0 1 22 0v8" fill="none" stroke={C.stone} strokeWidth="3.4" strokeLinecap="round" />
        <rect x="11" y="27" width="42" height="30" rx="8" fill={t} {...L} />
        <circle cx="32" cy="39" r="4" fill={INK} />
        <path d="M32 41v8" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      </>
    ),
  },
  calendar: {
    tone: C.sky,
    draw: (t) => (
      <>
        {shade()}
        <rect x="8" y="12" width="48" height="45" rx="8" fill={C.white} {...L} />
        <path d="M8 20a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8v6H8Z" fill={t} {...L} />
        <path d="M20 7v9M44 7v9" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        {[18, 27.5, 37, 46.5].flatMap((x) =>
          [36, 46].map((y) =>
            x === 37 && y === 46 ? (
              <rect key={`${x}-${y}`} x={x - 4} y={y - 4} width="8" height="8" rx="2" fill={C.lime} stroke={INK} strokeWidth="1.6" />
            ) : (
              <rect key={`${x}-${y}`} x={x - 2.6} y={y - 2.6} width="5.2" height="5.2" rx="1.4" fill={INK} opacity="0.75" />
            ),
          ),
        )}
      </>
    ),
  },
  ticket: {
    tone: C.lemonade,
    draw: (t) => (
      <>
        {shade()}
        <path
          d="M7 18a4 4 0 0 1 4-4h42a4 4 0 0 1 4 4v7a7 7 0 0 0 0 14v7a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4v-7a7 7 0 0 0 0-14Z"
          fill={t}
          {...L}
        />
        <path d="M43 17v30" stroke={INK} strokeWidth="1.8" strokeDasharray="3 3.5" />
        <path d="M15 25h20M15 32h14M15 39h17" stroke={INK} strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
      </>
    ),
  },
  door: {
    tone: C.mint,
    draw: (t) => (
      <>
        {shade(28)}
        <rect x="8" y="6" width="32" height="51" rx="5" fill={t} {...L} />
        <path d="M14 57V14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v43" fill={C.white} {...L} />
        <circle cx="30" cy="35" r="2" fill={INK} />
        <Band d="M30 34h21" color={C.coral} width={4.4} />
        <Band d="M45 27l8 7-8 7" color={C.coral} width={4.4} />
      </>
    ),
  },
  hourglass: {
    tone: C.lemonade,
    draw: (t) => (
      <>
        <path d="M20 8c0 13 10 16 10 24s-10 11-10 24h24c0-13-10-16-10-24s10-11 10-24Z" fill={C.white} {...L} />
        <path d="M23.5 15c2 6 6 9 8.5 11 2.5-2 6.5-5 8.5-11Z" fill={t} />
        <path d="M22.6 54c1.2-6 5.4-9 9.4-10.5 4 1.5 8.2 4.5 9.4 10.5Z" fill={t} />
        <path d="M32 30v12" stroke={INK} strokeWidth="1.6" strokeDasharray="1.5 3" strokeLinecap="round" />
        <path d="M17 7h30M17 57h30" stroke={INK} strokeWidth="3.6" strokeLinecap="round" />
      </>
    ),
  },
  magnifier: {
    tone: C.sky,
    draw: (t) => (
      <>
        <Band d="M40 40 54 54" color={t} width={5} />
        <circle cx="27" cy="27" r="18" fill={C.white} {...L} />
        <circle cx="27" cy="27" r="12.5" fill={t} opacity="0.5" />
        <path d="M20 27.5l5 5 9.5-10" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.5 21a13 13 0 0 1 6.5-6.5" fill="none" stroke={C.white} strokeWidth="2.4" strokeLinecap="round" />
      </>
    ),
  },
  shield: {
    tone: C.mint,
    draw: (t) => (
      <>
        {shade()}
        <path d="M32 5 53 12.5v15c0 13.5-9 23-21 28-12-5-21-14.5-21-28v-15Z" fill={t} {...L} />
        <path d="M22.5 30.5 29 37l13-13.5" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  key: {
    tone: C.lemonade,
    draw: (t) => (
      <>
        <Band d="M30 31 53 54" color={t} width={5} />
        <path d="M43 44l5.5-5.5M49 50l5.5-5.5" stroke={INK} strokeWidth="3.6" strokeLinecap="round" />
        <circle cx="21" cy="22" r="14" fill={t} {...L} />
        <circle cx="17.5" cy="18.5" r="4.5" fill={C.white} {...L} />
      </>
    ),
  },
  gear: {
    tone: C.lemonade,
    draw: (t) => (
      <>
        {shade()}
        <path d={gearPath(32, 31, 25, 19, 8)} fill={t} {...L} />
        <circle cx="32" cy="31" r="8" fill={C.white} {...L} />
      </>
    ),
  },
  eye: {
    tone: C.sky,
    draw: (t) => (
      <>
        <path d="M5 32c7.5-11.5 16.5-17.5 27-17.5S51.5 20.5 59 32c-7.5 11.5-16.5 17.5-27 17.5S12.5 43.5 5 32Z" fill={C.white} {...L} />
        <circle cx="32" cy="32" r="11.5" fill={t} {...L} />
        <circle cx="32" cy="32" r="5" fill={INK} />
        <circle cx="35.5" cy="28.5" r="2" fill={C.white} />
      </>
    ),
  },
  warning: {
    tone: C.lemonade,
    draw: (t) => (
      <>
        {shade()}
        <path d="M32 7 58 53H6Z" fill={t} {...L} strokeWidth={2.4} />
        <path d="M32 23v14" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <circle cx="32" cy="45" r="2.7" fill={INK} />
      </>
    ),
  },
  tag: {
    tone: C.baby,
    draw: (t) => (
      <>
        <path
          d="M9 13a4 4 0 0 1 4-4h20.5L56 31.5a4 4 0 0 1 0 5.7L37.2 56a4 4 0 0 1-5.7 0L9 33.5Z"
          fill={t}
          {...L}
        />
        <circle cx="19" cy="19" r="4" fill={C.white} {...L} />
        <circle cx="29.5" cy="31" r="3.2" fill="none" stroke={INK} strokeWidth="2.2" />
        <circle cx="40.5" cy="42" r="3.2" fill="none" stroke={INK} strokeWidth="2.2" />
        <path d="M42 29.5 28 43.5" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      </>
    ),
  },
  receipt: {
    tone: C.green,
    draw: (t) => (
      <>
        <path d="M13 6h38v52l-6.3-4.5-6.4 4.5-6.3-4.5-6.3 4.5-6.4-4.5L13 58Z" fill={C.white} {...L} />
        <path d="M21 17h22M21 25h15M21 33h22M21 42h9" stroke={INK} strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
        <path d="M36 42h7" stroke={t} strokeWidth="3.6" strokeLinecap="round" />
      </>
    ),
  },
  gas: {
    tone: C.coral,
    draw: (t) => (
      <>
        <path d="M38 24h5a4 4 0 0 1 4 4v15a3.5 3.5 0 0 0 7 0V25l-6-8" fill="none" {...L} strokeWidth={2.6} />
        <rect x="10" y="9" width="28" height="46" rx="6" fill={t} {...L} />
        <rect x="15.5" y="15" width="17" height="13" rx="3" fill={C.white} {...L} />
        <path d="M6 56h36" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  ballot: {
    tone: C.sky,
    draw: (t) => (
      <>
        {shade()}
        <g transform="rotate(-8 32 20)">
          <rect x="21" y="4" width="22" height="28" rx="3.5" fill={C.white} {...L} />
          <path d="M26.5 17.5l4 4 7.5-8.5" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <rect x="8" y="28" width="48" height="28" rx="6" fill={t} {...L} />
        <path d="M21 28h22" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      </>
    ),
  },
  block: {
    tone: C.lemonade,
    draw: (t) => (
      <>
        {shade()}
        <path d="M32 7 55 19.5v25L32 57 9 44.5v-25Z" fill={t} {...L} />
        <path d="M55 19.5v25L32 57V32Z" fill={INK} opacity="0.1" />
        <path d="M32 7 55 19.5 32 32 9 19.5Z" fill={C.white} {...L} />
        <path d="M32 32v25" {...L} />
        <Eth x={32} y={19.5} h={10} />
      </>
    ),
  },
  pool: {
    tone: C.sky,
    draw: (t) => (
      <>
        <path d="M7 30h50c0 14.5-11 25-25 25S7 44.5 7 30Z" fill={C.white} {...L} />
        <path
          d="M10 35c3.5-3 7-3 10.5 0s7 3 10.5 0 7-3 10.5 0 7 3 10-.5C49 46 41.5 52 32 52S13 45 10 35Z"
          fill={t}
          {...L}
          strokeWidth={1.8}
        />
        <path d="M32 4c5.5 7.5 8.5 11.5 8.5 15.5a8.5 8.5 0 0 1-17 0c0-4 3-8 8.5-15.5Z" fill={C.blue} {...L} />
        <path d="M28.5 21a4 4 0 0 0 3 3.5" fill="none" stroke={C.white} strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  toggle: {
    tone: C.lime,
    draw: (t) => (
      <>
        <rect x="5" y="19" width="54" height="28" rx="14" fill={t} {...L} />
        <circle cx="45" cy="33" r="10" fill={C.white} {...L} />
        <path d="M14 33l4 4 7-8" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  link: {
    tone: C.baby,
    draw: (t) => (
      <g transform="rotate(-40 32 32)">
        <rect x="4" y="24" width="31" height="16" rx="8" fill="none" stroke={INK} strokeWidth="7.4" />
        <rect x="4" y="24" width="31" height="16" rx="8" fill="none" stroke={t} strokeWidth="4" />
        <rect x="29" y="24" width="31" height="16" rx="8" fill="none" stroke={INK} strokeWidth="7.4" />
        <rect x="29" y="24" width="31" height="16" rx="8" fill="none" stroke={t} strokeWidth="4" />
      </g>
    ),
  },
  scale: {
    tone: C.lemonade,
    draw: (t) => (
      <>
        <path d="M32 13v40" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M20 56h24" stroke={INK} strokeWidth="3.6" strokeLinecap="round" />
        <path d="M9 18h46" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <path d="M9 18 3.5 35M9 18l5.5 17M55 18l-5.5 17M55 18l5.5 17" stroke={INK} strokeWidth="1.6" />
        <path d="M2 35h14a7 7 0 0 1-14 0Z" fill={t} {...L} />
        <path d="M48 35h14a7 7 0 0 1-14 0Z" fill={t} {...L} />
        <circle cx="32" cy="13" r="4" fill={t} {...L} />
      </>
    ),
  },
  gauge: {
    tone: C.white,
    draw: (t) => (
      <>
        <path d="M6 46a26 26 0 0 1 52 0Z" fill={t} {...L} />
        <path d="M12 46A20 20 0 0 1 22 28.68" fill="none" stroke={C.coral} strokeWidth="6" />
        <path d="M22 28.68A20 20 0 0 1 38.84 27.21" fill="none" stroke={C.lemonade} strokeWidth="6" />
        <path d="M38.84 27.21A20 20 0 0 1 52 46" fill="none" stroke={C.green} strokeWidth="6" />
        <path d="M32 46 43.5 31" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="32" cy="46" r="4.2" fill={INK} />
        <path d="M3 46h58" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      </>
    ),
  },
  gavel: {
    tone: C.coral,
    draw: (t) => (
      <>
        <rect x="35" y="50" width="25" height="7" rx="3" fill={C.stone} {...L} />
        <Band d="M27 27 47 47" color={C.white} width={4.4} />
        <g transform="rotate(-45 21 21)">
          <rect x="7" y="13" width="28" height="16" rx="4" fill={t} {...L} />
          <path d="M13 13v16M29 13v16" stroke={INK} strokeWidth="2" />
        </g>
      </>
    ),
  },
  chart: {
    tone: C.coral,
    draw: (t) => (
      <>
        <rect x="6" y="9" width="52" height="46" rx="8" fill={C.white} {...L} />
        <path d="M6 19h52" stroke={INK} strokeWidth="1.6" />
        <circle cx="13" cy="14" r="1.6" fill={INK} />
        <circle cx="18.5" cy="14" r="1.6" fill={INK} />
        <path d="M13 43c4-9 8-9 11.5-2.5S32 47 35.5 38 43 23 51 28" fill="none" stroke={INK} strokeWidth="6.4" strokeLinecap="round" />
        <path d="M13 43c4-9 8-9 11.5-2.5S32 47 35.5 38 43 23 51 28" fill="none" stroke={t} strokeWidth="3.4" strokeLinecap="round" />
      </>
    ),
  },
  building: {
    tone: C.sky,
    draw: (t) => (
      <>
        <path d="M7 23 32 8l25 15Z" fill={t} {...L} />
        <rect x="10" y="23" width="44" height="5" rx="1.5" fill={C.white} {...L} />
        <path d="M16 31v14M26 31v14M38 31v14M48 31v14" stroke={INK} strokeWidth="3.6" strokeLinecap="round" />
        <rect x="7" y="47" width="50" height="8" rx="2.5" fill={t} {...L} />
        <circle cx="32" cy="17" r="2.6" fill={C.white} stroke={INK} strokeWidth="1.4" />
      </>
    ),
  },
  person: {
    tone: C.baby,
    draw: (t) => (
      <>
        <path d="M11 57c0-12.5 9.4-21 21-21s21 8.5 21 21Z" fill={C.sky} {...L} />
        <circle cx="32" cy="23" r="12.5" fill={t} {...L} />
        <circle cx="27.5" cy="22" r="1.7" fill={INK} />
        <circle cx="36.5" cy="22" r="1.7" fill={INK} />
        <path d="M27.5 27c2.6 2.4 6.4 2.4 9 0" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  layers: {
    tone: C.sky,
    draw: (t) => (
      <>
        <path d="M32 38 57 48.5 32 59 7 48.5Z" fill={C.lemonade} {...L} />
        <path d="M32 23.5 57 34 32 44.5 7 34Z" fill={C.baby} {...L} />
        <path d="M32 9 57 19.5 32 30 7 19.5Z" fill={t} {...L} />
      </>
    ),
  },
  flag: {
    tone: C.lime,
    draw: (t) => (
      <>
        <ellipse cx="17" cy="58" rx="10" ry="2.8" fill={INK} opacity="0.12" />
        <path d="M17 6v52" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M17 9c9-6 17 3 32-2v24c-15 5-23-4-32 2Z" fill={t} {...L} />
      </>
    ),
  },
  envelope: {
    tone: C.lemonade,
    draw: (t) => (
      <>
        {shade()}
        <rect x="6" y="15" width="52" height="37" rx="6" fill={t} {...L} />
        <path d="M8 18.5l24 18 24-18" fill="none" {...L} />
        <path d="M9 49l16-13.5M55 49 39 35.5" fill="none" {...L} strokeWidth={1.6} />
      </>
    ),
  },
  plane: {
    tone: C.sky,
    draw: (t) => (
      <>
        <path d="M5 28 59 7 45 56 30 39Z" fill={C.white} {...L} />
        <path d="M30 39v15l8-8.5" fill={t} {...L} />
        <path d="M30 39 59 7" fill="none" {...L} />
      </>
    ),
  },
  chat: {
    tone: C.baby,
    draw: (t) => (
      <>
        <path
          d="M12 9h40a7 7 0 0 1 7 7v21a7 7 0 0 1-7 7H31l-11 10v-10h-8a7 7 0 0 1-7-7V16a7 7 0 0 1 7-7Z"
          fill={t}
          {...L}
        />
        {[22, 32, 42].map((cx) => (
          <circle key={cx} cx={cx} cy="26.5" r="3" fill={INK} />
        ))}
      </>
    ),
  },
  book: {
    tone: C.sky,
    draw: (t) => (
      <>
        {shade()}
        <path d="M32 15c-6-4.5-14-5-23-3v37c9-2 17-1.5 23 3 6-4.5 14-5 23-3V12c-9-2-17-1.5-23 3Z" fill={t} {...L} />
        <path d="M32 15v37" {...L} />
        <path
          d="M14 22c4-.7 8-.4 12 1M14 30c4-.7 8-.4 12 1M14 38c3-.5 6-.4 9 .4M38 23c4-1.4 8-1.7 12-1M38 31c4-1.4 8-1.7 12-1M38 39c3-1 6-1.2 9-.8"
          fill="none"
          stroke={INK}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    ),
  },
  gift: {
    tone: C.baby,
    draw: (t) => (
      <>
        {shade()}
        <rect x="9" y="27" width="46" height="29" rx="4" fill={t} {...L} />
        <rect x="6" y="18" width="52" height="11" rx="3.5" fill={t} {...L} />
        <rect x="27.5" y="18" width="9" height="38" fill={C.lime} {...L} />
        <path d="M32 18c-4-9-15-11-15-4 0 4 8 4 15 4ZM32 18c4-9 15-11 15-4 0 4-8 4-15 4Z" fill={C.lime} {...L} />
      </>
    ),
  },
  globe: {
    tone: C.sky,
    draw: (t) => (
      <>
        <circle cx="32" cy="32" r="24" fill={t} {...L} />
        <ellipse cx="32" cy="32" rx="10.5" ry="24" fill="none" {...L} strokeWidth={1.8} />
        <path d="M9 25h46M9 39h46M32 8v48" fill="none" stroke={INK} strokeWidth="1.8" />
      </>
    ),
  },
  pause: {
    tone: C.coral,
    draw: (t) => (
      <>
        <circle cx="32" cy="32" r="24" fill={t} {...L} />
        <rect x="23" y="21" width="6" height="22" rx="2.5" fill={C.white} {...L} />
        <rect x="35" y="21" width="6" height="22" rx="2.5" fill={C.white} {...L} />
      </>
    ),
  },
  power: {
    tone: C.lime,
    draw: (t) => (
      <>
        <circle cx="32" cy="32" r="24" fill={t} {...L} />
        <path d="M24 23a12.5 12.5 0 1 0 16 0" fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M32 17v14" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
      </>
    ),
  },
  split: {
    tone: C.lime,
    draw: (t) => (
      <>
        <Band d="M7 32h15c9 0 11-14 23-14h4" color={t} width={4.4} />
        <Band d="M22 32c9 0 11 14 23 14h4" color={t} width={4.4} />
        <Band d="M48 11l8 7-8 7" color={t} width={4.4} />
        <Band d="M48 39l8 7-8 7" color={t} width={4.4} />
      </>
    ),
  },
  bell: {
    tone: C.lemonade,
    draw: (t) => (
      <>
        <path d="M26 50a6 6 0 0 0 12 0" fill={C.white} {...L} />
        <path
          d="M32 7a4 4 0 0 1 4 4v1.6c7 2 11 8 11 15.4v9l5 6v2.5H12V43l5-6v-9c0-7.4 4-13.4 11-15.4V11a4 4 0 0 1 4-4Z"
          fill={t}
          {...L}
        />
        <path d="M51 14c3 3 4.5 6 4.5 10M13 14c-3 3-4.5 6-4.5 10" fill="none" {...L} />
      </>
    ),
  },
  interest: {
    tone: C.lemonade,
    draw: (t) => (
      <>
        {shade()}
        <circle cx="32" cy="31" r="24" fill={t} {...L} />
        <circle cx="32" cy="31" r="18" fill="none" stroke={INK} strokeWidth="1.3" opacity="0.4" />
        <circle cx="25.5" cy="24.5" r="4" fill={C.white} {...L} />
        <circle cx="38.5" cy="37.5" r="4" fill={C.white} {...L} />
        <path d="M40 22.5 24 39.5" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  pen: {
    tone: C.baby,
    draw: (t) => (
      <>
        <path d="M6 52c6-6 9 4 14-2s6-8 10-3" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
        <g transform="rotate(42 40 26)">
          <rect x="34" y="2" width="12" height="36" rx="3" fill={t} {...L} />
          <path d="M34 38h12l-6 11Z" fill={C.white} {...L} />
          <path d="M34 10h12" stroke={INK} strokeWidth="2" />
        </g>
      </>
    ),
  },
  stairs: {
    tone: C.lime,
    draw: (t) => (
      <>
        <path d="M6 57V45h13V33h13V21h13V9h13v48Z" fill={t} {...L} />
        <path d="M19 45v12M32 33v24M45 21v36" stroke={INK} strokeWidth="1.6" opacity="0.4" />
      </>
    ),
  },
  star: {
    tone: C.lemonade,
    draw: (t) => (
      <>
        <path d={sparklePath(28)} transform="translate(32 32)" fill={t} {...L} />
        <path d={sparklePath(15)} transform="translate(32 32) rotate(45)" fill={C.white} {...L} />
        <circle cx="32" cy="32" r="3.2" fill={INK} />
      </>
    ),
  },
  sparkle: {
    tone: C.lime,
    draw: (t) => <path d={sparklePath(28)} transform="translate(32 32)" fill={t} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />,
  },
  blob: {
    tone: C.sky,
    draw: (t) => (
      <path d={BLOB_PATH} transform="translate(4 4) scale(2.333)" fill={t} stroke={INK} strokeWidth="0.85" strokeLinejoin="round" />
    ),
  },
  check: {
    tone: C.lime,
    draw: (t) => (
      <>
        <circle cx="32" cy="32" r="26" fill={t} stroke={INK} strokeWidth="4" />
        <path d="M19.5 33 28 41.5l16.5-18" fill="none" stroke={INK} strokeWidth="5.4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  up: {
    tone: C.lightGreen,
    draw: (t) => (
      <>
        <circle cx="32" cy="32" r="26" fill={t} stroke={INK} strokeWidth="3.4" />
        <path d="M32 45V20M21 30l11-11 11 11" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  down: {
    tone: C.baby,
    draw: (t) => (
      <>
        <circle cx="32" cy="32" r="26" fill={t} stroke={INK} strokeWidth="3.4" />
        <path d="M32 19v25M21 34l11 11 11-11" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  flat: {
    tone: C.white,
    draw: (t) => (
      <>
        <circle cx="32" cy="32" r="26" fill={t} stroke={INK} strokeWidth="3.4" />
        <path d="M20 27h24M20 37h24" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      </>
    ),
  },
  less: {
    tone: C.lemonade,
    draw: (t) => (
      <>
        <circle cx="32" cy="32" r="26" fill={t} stroke={INK} strokeWidth="3.4" />
        <path d="M32 42V27M24 33l8-8 8 8" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 47h20" stroke={INK} strokeWidth="3.4" strokeLinecap="round" opacity="0.45" />
      </>
    ),
  },
  plus: {
    tone: C.lightGreen,
    draw: (t) => (
      <>
        <circle cx="32" cy="32" r="26" fill={t} stroke={INK} strokeWidth="3.4" />
        <path d="M32 20v24M20 32h24" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      </>
    ),
  },
  minus: {
    tone: C.baby,
    draw: (t) => (
      <>
        <circle cx="32" cy="32" r="26" fill={t} stroke={INK} strokeWidth="3.4" />
        <path d="M20 32h24" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      </>
    ),
  },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof ICONS;

const DRAWINGS: Record<string, IconDef> = ICONS;

/** One of the stickers, in its default tone or another; an unknown name draws the star. */
export function StickerIcon({ name, tone, className }: { name: IconName | (string & {}); tone?: string; className?: string }) {
  const icon = DRAWINGS[name] ?? ICONS.star;
  return (
    <svg className={className} viewBox="0 0 64 64" overflow="visible" aria-hidden="true" focusable="false">
      {icon.draw(tone ?? icon.tone)}
    </svg>
  );
}

/** A sticker's drawing without its `<svg>`, for placing inside another drawing (64 × 64 units). */
export function IconShape({ name, tone }: { name: IconName | (string & {}); tone?: string }) {
  const icon = DRAWINGS[name] ?? ICONS.star;
  return <>{icon.draw(tone ?? icon.tone)}</>;
}
