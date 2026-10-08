"use client";

import type { Ref } from "react";
import { ArtSvg, Blob, C, Chip, Coin, Eth, Flowline, FONT, INK, LINE, Mark, Move, Sparkle, Tag, THIN } from "../shared/page-kit/art";
import { IconShape } from "../shared/page-kit/icons";
import { Sticker } from "../shared/page-kit/Sticker";
import styles from "./borrowing.module.css";

/*
 * The borrowing page's illustrations: the scale of collateral against a loan, the market's flows
 * and the interest split, the two paths for aEthosETH, the health gauge whose needle follows the
 * scroll, and the 75 / 25 ring. Decorative: the text beside each one says everything it shows.
 */

/** A health gauge's coloured bands between two radii, centred on (cx, cy): liquidation, caution, healthy. */
function GaugeBands({ cx, cy, r, width }: { cx: number; cy: number; r: number; width: number }) {
  const at = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy - r * Math.sin(a)).toFixed(2)}`;
  };
  return (
    <g fill="none" strokeWidth={width}>
      <path d={`M${at(180)}A${r} ${r} 0 0 1 ${at(130)}`} stroke={C.coral} />
      <path d={`M${at(130)}A${r} ${r} 0 0 1 ${at(95)}`} stroke={C.lemonade} />
      <path d={`M${at(95)}A${r} ${r} 0 0 1 ${at(0)}`} stroke={C.green} />
    </g>
  );
}

/** Hero: collateral against a loan on a gently swaying scale, the health gauge on one side and the market's rules on the other. */
export function ScaleHero() {
  return (
    <ArtSvg viewBox="0 0 1000 470">
      <circle cx="500" cy="262" r="214" fill="#fffbe0" />
      <circle cx="150" cy="250" r="118" fill="#fff1f6" />
      <circle cx="852" cy="250" r="128" fill="#eaf2fd" />
      <ellipse cx="500" cy="440" rx="440" ry="15" fill={INK} opacity="0.07" />

      {/* the health gauge */}
      <path d="M70 262a70 70 0 0 1 140 0Z" fill={C.white} {...LINE} />
      <GaugeBands cx={140} cy={262} r={54} width={14} />
      <Move motion="sway" dur={4.4} origin="50% 50%" vars={{ "--r": "6deg" }}>
        <circle cx="140" cy="262" r="50" fill="none" />
        <path d="M140 262 176 224" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      </Move>
      <circle cx="140" cy="262" r="8" fill={INK} />
      <path d="M62 262h156" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <Tag x={140} y={298} text="HEALTH FACTOR" size={12} fill={C.white} />

      {/* the scale */}
      <path d="M440 420h120l-14-30h-92Z" fill={C.lemonade} {...LINE} />
      <rect x="490" y="150" width="20" height="244" rx="10" fill={C.white} {...LINE} />
      <Move motion="sway" dur={5.2} origin="50% 2%" vars={{ "--r": "-3deg" }}>
        <rect x="300" y="150" width="400" height="14" rx="7" fill={C.white} {...LINE} />
        <path d="M312 164 268 280M312 164l44 116M688 164l-44 116M688 164l44 116" stroke={INK} strokeWidth="1.8" />
        <path d="M246 280h132c0 18-29 30-66 30s-66-12-66-30Z" fill={C.sky} {...LINE} />
        <path d="M622 280h132c0 18-29 30-66 30s-66-12-66-30Z" fill={C.baby} {...LINE} />
        <Chip x={312} y={266} rx={46} ry={13} h={10} fill={C.sky} />
        <Chip x={312} y={250} rx={46} ry={13} h={10} fill={C.white} />
        <Chip x={312} y={234} rx={46} ry={13} h={10} fill={C.sky} />
        <Eth x={312} y={234} h={14} />
        <Coin x={688} y={244} r={34} fill={C.lemonade} />
        <Tag x={312} y={340} text="COLLATERAL" size={12} fill={C.sky} />
        <Tag x={688} y={340} text="BORROWED" size={12} fill={C.baby} />
      </Move>
      <circle cx="500" cy="152" r="16" fill={C.lime} {...LINE} />

      {/* the market's rules */}
      <rect x="782" y="150" width="172" height="196" rx="22" fill={C.white} {...LINE} />
      <rect className={styles.scanRow} x="792" y="174" width="152" height="32" rx="10" fill={C.lime} />
      {[196, 238, 280, 322].map((y, i) => (
        <g key={y}>
          <circle cx="808" cy={y - 6} r="7" fill={[C.sky, C.baby, C.lemonade, C.lime][i]} {...THIN} />
          <rect x="824" y={y - 12} width={[62, 48, 56, 40][i]} height="11" rx="5.5" fill={C.grey} />
          <rect x="900" y={y - 17} width="36" height="20" rx="10" fill={i === 1 ? C.grey : C.lime} {...THIN} />
          <circle cx={i === 1 ? 910 : 926} cy={y - 7} r="6.5" fill={C.white} {...THIN} />
        </g>
      ))}
      <Tag x={868} y={150} text="PER MARKET" size={12} fill={C.lemonade} />

      <Sparkle x={318} y={98} r={14} />
      <Sparkle x={664} y={94} r={11} fill={C.baby} delay={0.8} />
      <Sparkle x={964} y={392} r={12} fill={C.lemonade} delay={1.4} />
      <Sparkle x={40} y={150} r={10} fill={C.sky} delay={0.5} />
      <Sparkle x={588} y={420} r={9} delay={1.1} />
      <Blob x={232} y={386} size={20} fill={C.lime} />
      <Blob x={740} y={110} size={22} fill={C.sky} />
    </ArtSvg>
  );
}

/** A node of the flow: a sticker in a white circle. */
function FlowNode({ x, y, icon, tone, r = 54 }: { x: number; y: number; icon: string; tone?: string; r?: number }) {
  const k = (r * 1.25) / 64;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={C.white} {...LINE} />
      <g transform={`translate(${x - 32 * k} ${y - 32 * k}) scale(${k.toFixed(3)})`}>
        <IconShape name={icon} tone={tone} />
      </g>
    </g>
  );
}

/** The market: liquidity in from funding loans and direct ETH, loans out to borrowers, interest back and split. */
export function MarketFlowArt({ you, definica }: { you: string; definica: string }) {
  return (
    <ArtSvg viewBox="0 0 1000 470">
      <circle cx="500" cy="226" r="200" fill="#fffbe0" />
      <ellipse cx="500" cy="448" rx="440" ry="12" fill={INK} opacity="0.07" />

      <Flowline d="M200 120C300 120 330 168 396 190" />
      <Flowline d="M200 330C300 330 330 280 396 256" />
      <Flowline d="M604 196C700 196 738 170 800 164" />
      <Flowline d="M804 200C740 240 700 258 604 258" color={C.green} width={2.8} opacity={0.95} />
      <Flowline d="M466 304C452 330 436 346 418 360" color={C.green} width={2.8} opacity={0.95} />
      <Flowline d="M534 304C548 330 564 346 582 360" color={C.green} width={2.8} opacity={0.95} />

      <FlowNode x={140} y={120} icon="lock" />
      <Tag x={140} y={196} text="FUNDING LOANS" size={11} fill={C.white} />
      <FlowNode x={140} y={330} icon="coins" />
      <Tag x={140} y={406} text="DIRECT ETH" size={11} fill={C.white} />

      <rect x="398" y="142" width="204" height="160" rx="30" fill={C.lemonade} {...LINE} />
      <Chip x={500} y={256} rx={48} ry={14} h={11} fill={C.white} />
      <Chip x={500} y={240} rx={48} ry={14} h={11} fill={C.sky} />
      <Chip x={500} y={224} rx={48} ry={14} h={11} fill={C.white} />
      <Eth x={500} y={224} h={14} />
      <Tag x={500} y={142} text="LENDING MARKET" size={12} fill={C.white} />

      <FlowNode x={860} y={176} icon="person" />
      <g transform="translate(922 118)">
        <Move motion="bob" dur={3.2}>
          <Coin x={0} y={0} r={20} fill={C.sky} diamond="white" />
        </Move>
      </g>
      <Tag x={860} y={252} text="BORROWERS" size={11} fill={C.white} />
      <Tag x={704} y={160} text="LOANS" size={10} fill={C.white} />
      <Tag x={706} y={272} text="INTEREST" size={10} fill={C.lightGreen} />

      <g transform="translate(404 384)">
        <Move motion="float" dur={4.4} vars={{ "--amp": "5px" }}>
          <circle r="40" fill={C.lime} {...LINE} />
          <text y="7.5" textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={21} fill={INK}>
            {you}
          </text>
        </Move>
      </g>
      <g transform="translate(596 384)">
        <Move motion="float" dur={4.4} delay={0.6} vars={{ "--amp": "5px" }}>
          <circle r="40" fill={C.white} {...LINE} />
          <text y="7.5" textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={21} fill={INK}>
            {definica}
          </text>
        </Move>
      </g>
      <Mark x={650} y={420} size={20} />

      <Sparkle x={300} y={50} r={12} />
      <Sparkle x={960} y={330} r={10} fill={C.baby} delay={0.7} />
      <Sparkle x={36} y={226} r={9} fill={C.lemonade} delay={1.3} />
    </ArtSvg>
  );
}

const TICKET = "M0 8a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8v12a12 12 0 0 0 0 24v12a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V44a12 12 0 0 0 0-24Z";

/** One aEthosETH receipt, two paths: posted as collateral where a market approves it, or committed as liquidity. */
export function PathsArt() {
  return (
    <ArtSvg viewBox="0 0 560 420">
      <circle cx="290" cy="210" r="190" fill="#fff1f6" />
      <ellipse cx="280" cy="398" rx="200" ry="11" fill={INK} opacity="0.07" />
      <g transform="translate(40 172) rotate(-8 60 40)">
        <Move motion="float" dur={4.6} vars={{ "--amp": "8px" }}>
          <g transform="scale(1.25)">
            <path d={TICKET} fill={C.baby} {...LINE} strokeWidth={1.6} />
            <path d="M68 7v50" stroke={INK} strokeWidth="1.3" strokeDasharray="4 4" />
            <path d="M14 22h36M14 33h26M14 44h32" stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          </g>
        </Move>
      </g>
      <Tag x={104} y={292} text="aEthosETH" size={12} fill={C.baby} />
      {[
        { d: "M180 212C240 212 254 120 330 112", color: C.lime, className: styles.branch },
        { d: "M180 212C240 212 254 304 330 312", color: C.sky, className: `${styles.branch} ${styles.branchLater}` },
      ].map(({ d, color, className }) => (
        <g key={d} fill="none" strokeLinecap="round">
          <path d={d} stroke={INK} strokeWidth="9.4" />
          <path d={d} stroke={C.white} strokeWidth="6" />
          <path className={className} d={d} stroke={color} strokeWidth="6" />
        </g>
      ))}
      <Tag x={232} y={212} text="OR" size={12} fill={C.white} />
      <FlowNode x={402} y={112} icon="scale" r={58} />
      <Tag x={402} y={192} text="COLLATERAL" size={12} fill={C.lime} />
      <FlowNode x={402} y={312} icon="lock" r={58} />
      <Tag x={402} y={392} text="LIQUIDITY" size={12} fill={C.sky} />
      <Sparkle x={500} y={46} r={12} />
      <Sparkle x={30} y={80} r={10} fill={C.lemonade} delay={0.7} />
      <Sparkle x={520} y={236} r={9} fill={C.baby} delay={1.2} />
    </ArtSvg>
  );
}

/**
 * The health gauge: the needle reads `--p` on a parent (0 → 1 as the page scrolls) and swings from
 * healthy into the liquidation zone below 1.
 */
export function GaugeArt({ safe, edge, line }: { safe: string; edge: string; line: string }) {
  return (
    <ArtSvg viewBox="0 0 600 400">
      <circle cx="300" cy="250" r="230" fill="#f4fbd6" />
      <ellipse cx="300" cy="372" rx="250" ry="12" fill={INK} opacity="0.07" />
      <path d="M70 300a230 230 0 0 1 460 0Z" fill={C.white} {...LINE} />
      <GaugeBands cx={300} cy={300} r={190} width={46} />
      <path d="M77 300a223 223 0 0 1 446 0M133 300a167 167 0 0 1 334 0" fill="none" stroke={INK} strokeWidth="2" />
      <path d="M197.15 177.43 155.58 127.88" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <text x="140" y="112" textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill={INK}>
        {line}
      </text>
      <g style={{ transformBox: "view-box", transformOrigin: "300px 300px", transform: "rotate(calc(55deg - var(--p, 1) * 125deg))" }}>
        <path d="M294 300 300 126 306 300Z" fill={INK} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      </g>
      <circle cx="300" cy="300" r="20" fill={INK} />
      <circle cx="300" cy="300" r="8" fill={C.lime} />
      <path d="M50 300h500" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <Tag x={140} y={334} text={edge.toUpperCase()} size={12} fill={C.coral} />
      <Tag x={460} y={334} text={safe.toUpperCase()} size={12} fill={C.lightGreen} />
      <Sparkle x={52} y={86} r={12} />
      <Sparkle x={556} y={120} r={10} fill={C.baby} delay={0.6} />
    </ArtSvg>
  );
}

interface DonutProps {
  you: string;
  definica: string;
  ref?: Ref<SVGSVGElement>;
}

/** The 75 / 25 ring; its two arcs are drawn from the parent (stroke-dasharray, with pathLength 100). */
export function DonutArt({ you, definica, ref }: DonutProps) {
  return (
    <svg ref={ref} viewBox="0 0 400 400" overflow="visible" aria-hidden="true" focusable="false" style={{ display: "block", width: "100%", height: "auto" }}>
      <circle cx="200" cy="200" r="186" fill="#f4fbd6" />
      <circle cx="200" cy="200" r="130" fill="none" stroke={C.grey} strokeWidth="56" />
      <circle
        data-arc="you"
        cx="200"
        cy="200"
        r="130"
        fill="none"
        stroke={C.lime}
        strokeWidth="56"
        pathLength={100}
        strokeDasharray="75 100"
        transform="rotate(-90 200 200)"
      />
      <circle
        data-arc="definica"
        cx="200"
        cy="200"
        r="130"
        fill="none"
        stroke={C.sky}
        strokeWidth="56"
        pathLength={100}
        strokeDasharray="25 100"
        strokeDashoffset="-75"
        transform="rotate(-90 200 200)"
      />
      <circle cx="200" cy="200" r="158" fill="none" stroke={INK} strokeWidth="2.4" />
      <circle cx="200" cy="200" r="102" fill={C.white} stroke={INK} strokeWidth="2.4" />
      <path d="M200 42v56M42 200h56" stroke={INK} strokeWidth="2.4" />
      <text x="200" y="196" textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill={INK}>
        {you}
      </text>
      <text x="200" y="236" textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={22} fill={INK} opacity={0.6}>
        {definica}
      </text>
      <Sparkle x={364} y={40} r={14} />
      <Sparkle x={40} y={352} r={10} fill={C.baby} delay={0.8} />
    </svg>
  );
}

/** Stickers around the hero, clear of its wide title: above it at the sides, and beside the lead. */
export function HeroStickers() {
  return (
    <>
      <Sticker icon="interest" x="7%" y="12rem" size="8rem" mx="4%" my="10.5rem" ms="4.8rem" motion="spin" dur={6.5} />
      <Sticker icon="sparkle" x="15%" y="9rem" size="4rem" mx="20%" my="8.4rem" ms="2.6rem" motion="twinkle" delay={0.5} />
      <Sticker icon="blob" tone={C.lemonade} x="9%" y="70rem" size="4rem" motion="float" desktopOnly />
      <Sticker icon="gauge" x="84%" y="12rem" size="9rem" mx="81%" my="10rem" ms="5rem" motion="bob" dur={4} />
      <Sticker icon="sparkle" tone={C.baby} x="88%" y="66rem" size="4rem" motion="twinkle" delay={1.1} desktopOnly />
      <Sticker icon="blob" tone={C.sky} x="83%" y="76rem" size="3.4rem" motion="drift" desktopOnly />
    </>
  );
}

/** Stickers around the close. */
export function ClosingStickers() {
  return (
    <>
      <Sticker icon="book" x="7%" y="30%" size="10rem" mx="4%" my="3rem" ms="5.4rem" motion="float" />
      <Sticker icon="sparkle" x="15%" y="22%" size="4rem" mx="18%" my="2rem" ms="2.4rem" motion="twinkle" delay={0.4} />
      <Sticker icon="scale" x="84%" y="22%" size="10rem" mx="80%" my="3rem" ms="5.4rem" motion="sway" />
      <Sticker icon="blob" tone={C.lime} x="80%" y="62%" size="3.6rem" motion="float" delay={1.2} desktopOnly />
    </>
  );
}
