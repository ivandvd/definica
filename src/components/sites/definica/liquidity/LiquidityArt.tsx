"use client";

import { useId } from "react";
import { ArtSvg, Blob, C, Coin, Flowline, INK, LINE, Move, Sparkle, Tag, THIN } from "../shared/page-kit/art";
import { IconShape } from "../shared/page-kit/icons";
import { Sticker } from "../shared/page-kit/Sticker";
import styles from "./liquidity.module.css";

/*
 * The Main Liquidity Module page's illustrations: osETH into the Aave pool and its receipt into
 * the Module's drawers, the token that changes on the way, the consent switch, and the way back
 * out. Decorative: the text beside each one says everything it shows.
 */

const useClipId = (name: string) => `${name}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

const TICKET = "M0 8a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8v12a12 12 0 0 0 0 24v12a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V44a12 12 0 0 0 0-24Z";

/** A water line of crests `step` apart from x0 to x1 at height y, closed down to `bottom`. */
function wavePath(x0: number, x1: number, y: number, step: number, amp: number, bottom: number) {
  let d = `M${x0} ${y}`;
  for (let x = x0; x < x1; x += step) d += ` q${step / 4} ${-amp} ${step / 2} 0 t${step / 2} 0`;
  return `${d} L${x1} ${bottom} L${x0} ${bottom}Z`;
}

/** A receipt ticket with its perforation and lines, `width` wide. */
function Receipt({ fill = C.baby, width = 96 }: { fill?: string; width?: number }) {
  const k = width / 96;
  return (
    <g transform={`scale(${k})`}>
      <path d={TICKET} fill={fill} {...LINE} strokeWidth={2 / k} />
      <path d="M68 7v50" stroke={INK} strokeWidth={1.6 / k} strokeDasharray="4 4" />
      <path d="M14 22h36M14 33h26M14 44h32" stroke={INK} strokeWidth={2.4 / k} strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

/** The Aave pool: a bowl of water with waves sliding, clipped to the bowl. */
function Pool({ x, y, width = 260 }: { x: number; y: number; width?: number }) {
  const clip = useClipId("pool");
  const half = width / 2;
  const bowl = `M${x - half} ${y}h${width}c0 ${width * 0.285}-${half * 0.446} ${width * 0.49}-${half} ${width * 0.49}S${x - half} ${y + width * 0.285} ${x - half} ${y}Z`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <path d={bowl} />
        </clipPath>
      </defs>
      <path d={bowl} fill={C.white} />
      <g clipPath={`url(#${clip})`}>
        <Move motion="slide" dur={3.6} vars={{ "--dx": "-21px" }}>
          <path d={wavePath(x - half - 60, x + half + 60, y + 22, 42, 8, y + width * 0.6)} fill={C.sky} {...LINE} />
        </Move>
      </g>
      <path d={bowl} fill="none" {...LINE} />
    </g>
  );
}

/** Hero: an osETH coin into the Aave pool, its aEthosETH receipt up and into the Module's drawers. */
export function CommitHero() {
  return (
    <ArtSvg viewBox="0 0 1000 470">
      <circle cx="500" cy="262" r="214" fill="#fff1f6" />
      <circle cx="140" cy="232" r="122" fill="#eaf2fd" />
      <circle cx="820" cy="270" r="146" fill="#f4fbd6" />
      <ellipse cx="500" cy="440" rx="440" ry="15" fill={INK} opacity="0.07" />

      <Flowline d="M178 248C212 276 230 292 254 306" />
      <Flowline d="M448 296C458 270 466 258 480 246" />
      <Flowline d="M622 206C650 206 668 212 694 222" />

      {/* osETH */}
      <g transform="translate(128 192)">
        <Move motion="float" dur={5} vars={{ "--amp": "9px" }}>
          <Coin x={0} y={0} r={56} fill={C.sky} diamond="white" />
        </Move>
      </g>
      <Tag x={128} y={288} text="osETH" size={13} fill={C.white} />

      {/* the Aave pool */}
      <Pool x={380} y={300} width={260} />
      <g transform="translate(326 334)">
        <Move motion="bob" dur={2.6}>
          <Coin x={0} y={0} r={19} fill={C.sky} diamond="white" />
        </Move>
      </g>
      <Tag x={380} y={452} text="AAVE V3" size={12} fill={C.white} />

      {/* the aEthosETH receipt */}
      <g transform="translate(480 136) rotate(-9 60 40)">
        <Move motion="float" dur={4.6} delay={0.4} vars={{ "--amp": "10px" }}>
          <Receipt width={124} />
        </Move>
      </g>
      <Tag x={548} y={266} text="aEthosETH" size={12} fill={C.baby} />

      {/* the Module: drawers, one of them yours */}
      <rect x="722" y="402" width="36" height="22" rx="6" fill={INK} />
      <rect x="882" y="402" width="36" height="22" rx="6" fill={INK} />
      <rect x="700" y="128" width="240" height="282" rx="26" fill={C.baby} {...LINE} />
      {[150, 236, 322].flatMap((y) =>
        [718, 826].map((x) => {
          const yours = x === 826 && y === 236;
          return (
            <g key={`${x}-${y}`}>
              {yours ? <rect className={styles.drawerGlow} x={x} y={y} width="96" height="70" rx="12" fill={C.lime} /> : null}
              <rect x={x} y={y} width="96" height="70" rx="12" fill={yours ? C.lime : C.white} {...LINE} />
              {yours ? (
                <g transform={`translate(${x + 48} ${y + 36})`}>
                  <g className={styles.drawerClick}>
                    <path d="M-9 -2v-7a9 9 0 0 1 18 0v7" fill="none" stroke={INK} strokeWidth="4.4" strokeLinecap="round" />
                  </g>
                  <rect x="-15" y="-4" width="30" height="22" rx="6" fill={C.white} {...THIN} strokeWidth={1.8} />
                  <circle cx="0" cy="6" r="3" fill={INK} />
                </g>
              ) : (
                <>
                  <rect x={x + 34} y={y + 44} width="28" height="8" rx="4" fill={INK} />
                  <rect x={x + 16} y={y + 14} width="22" height="16" rx="4" fill={C.sky} {...THIN} />
                </>
              )}
            </g>
          );
        }),
      )}
      <Tag x={820} y={106} text="MAIN LIQUIDITY MODULE" size={12} fill={C.lemonade} />

      <Sparkle x={300} y={120} r={14} />
      <Sparkle x={652} y={96} r={11} fill={C.baby} delay={0.8} />
      <Sparkle x={968} y={420} r={12} fill={C.lemonade} delay={1.4} />
      <Sparkle x={42} y={366} r={10} fill={C.sky} delay={0.5} />
      <Sparkle x={612} y={404} r={9} delay={1.1} />
      <Blob x={236} y={92} size={22} fill={C.sky} />
      <Blob x={966} y={236} size={20} fill={C.lime} />
    </ArtSvg>
  );
}

/** The token that travels the path: osETH, then the aEthosETH receipt, then committed (`data-stage` on its parent). */
export function PathToken() {
  return (
    <span className={styles.token}>
      <span className={`${styles.tokenStage} ${styles.stageCoin}`}>
        <ArtSvg viewBox="0 0 64 64">
          <Coin x={32} y={32} r={26} fill={C.sky} diamond="white" />
        </ArtSvg>
      </span>
      <span className={`${styles.tokenStage} ${styles.stageTicket}`}>
        <ArtSvg viewBox="0 0 64 64">
          <IconShape name="ticket" tone={C.baby} />
        </ArtSvg>
      </span>
      <span className={`${styles.tokenStage} ${styles.stageLock}`}>
        <ArtSvg viewBox="0 0 64 64">
          <IconShape name="lock" />
        </ArtSvg>
      </span>
    </span>
  );
}

/** Consent: a pointer taps the switch on the funding-loan card, and only then does a debt appear. */
export function ConsentArt() {
  return (
    <ArtSvg viewBox="0 0 520 430">
      <circle cx="262" cy="214" r="196" fill="#fffbe0" />
      <ellipse cx="262" cy="404" rx="190" ry="12" fill={INK} opacity="0.07" />
      <rect x="70" y="92" width="380" height="244" rx="28" fill={C.white} {...LINE} />
      {[156, 200, 244].map((y, i) => (
        <g key={y}>
          <circle cx="112" cy={y} r="9" fill={[C.sky, C.baby, C.lemonade][i]} {...THIN} />
          <rect x="132" y={y - 6} width={[118, 92, 106][i]} height="12" rx="6" fill={C.grey} />
        </g>
      ))}
      <rect x="290" y="186" width="120" height="60" rx="30" fill={C.grey} {...LINE} />
      <rect className={styles.consentOn} x="290" y="186" width="120" height="60" rx="30" fill={C.lime} {...LINE} />
      <g className={styles.consentKnob}>
        <circle cx="320" cy="216" r="23" fill={C.white} {...LINE} />
      </g>
      <Tag x={350} y={288} text="AUTHORISE" size={11} fill={C.white} />
      <Tag x={260} y={92} text="FUNDING LOAN" size={12} fill={C.lemonade} />
      <g className={styles.consentOn}>
        <Tag x={260} y={376} text="ALLOCATED DEBT" size={12} fill={C.baby} />
      </g>
      <g className={styles.consentHand}>
        <path d="M432 330 432 378 445 366 455 388 466 383 456 361 474 361Z" fill={C.white} {...LINE} />
      </g>
      <Sparkle x={58} y={70} r={12} />
      <Sparkle x={478} y={150} r={10} fill={C.baby} delay={0.7} />
      <Sparkle x={70} y={376} r={9} fill={C.sky} delay={1.3} />
    </ArtSvg>
  );
}

/** The way out, step by step: the lock opens, the loan is repaid, the receipt goes back into the pool, osETH comes out. */
export function UnwindArt() {
  return (
    <ArtSvg viewBox="0 0 960 260">
      <ellipse cx="480" cy="236" rx="440" ry="12" fill={INK} opacity="0.07" />
      <Flowline d="M204 132C250 132 290 132 336 132" />
      <Flowline d="M430 132C470 132 488 140 516 150" />
      <Flowline d="M716 150C744 140 762 134 790 134" />

      {/* 1 · the lock opens */}
      <g transform="translate(150 120)">
        <Move motion="wobble" dur={4.8}>
          <path d="M-26 -6v-28a26 26 0 0 1 52 0" fill="none" stroke={INK} strokeWidth="12" strokeLinecap="round" transform="rotate(-24 26 -6)" />
          <path d="M-26 -6v-28a26 26 0 0 1 52 0" fill="none" stroke={C.stone} strokeWidth="6.4" strokeLinecap="round" transform="rotate(-24 26 -6)" />
          <rect x="-46" y="-8" width="92" height="76" rx="18" fill={C.lime} {...LINE} />
          <circle cx="0" cy="22" r="8" fill={INK} />
          <rect x="-4.5" y="24" width="9" height="22" rx="4.5" fill={INK} />
        </Move>
      </g>

      {/* 2 · the loan repaid */}
      <g transform="translate(384 128)">
        <Move motion="float" dur={4.2} vars={{ "--amp": "7px" }}>
          <Coin x={0} y={0} r={40} fill={C.lemonade} />
        </Move>
      </g>
      <path d="M342 82a48 48 0 0 1 72-22" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeDasharray="5 6" />
      <path d="M409 50l7 10-12 3" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />

      {/* 3 · the receipt back into the pool */}
      <Pool x={616} y={150} width={190} />
      <g transform="translate(578 56) rotate(10 40 26)">
        <Move motion="bob" dur={3}>
          <Receipt width={78} />
        </Move>
      </g>

      {/* 4 · osETH out: keep it, or convert it */}
      <g transform="translate(840 132)">
        <Move motion="float" dur={5} delay={0.3} vars={{ "--amp": "8px" }}>
          <Coin x={0} y={0} r={44} fill={C.sky} diamond="white" />
        </Move>
      </g>
      <g transform="translate(924 196)">
        <Coin x={0} y={0} r={22} fill={C.white} />
      </g>

      {[150, 384, 616, 840].map((x, i) => (
        <g key={x} transform={`translate(${x} 22)`}>
          <circle r="17" fill={C.lime} {...LINE} />
          <text y="6" textAnchor="middle" fontFamily='"Tomato Grotesk", Arial, sans-serif' fontWeight={700} fontSize={17} fill={INK}>
            {i + 1}
          </text>
        </g>
      ))}
      <Sparkle x={30} y={208} r={11} fill={C.baby} delay={0.6} />
      <Sparkle x={930} y={60} r={10} delay={1.2} />
      <Sparkle x={500} y={34} r={9} fill={C.lemonade} delay={0.3} />
    </ArtSvg>
  );
}

/** Stickers around the hero, clear of its wide title: above it at the sides, and beside the lead. */
export function HeroStickers() {
  return (
    <>
      <Sticker icon="coin" tone={C.sky} x="7%" y="12rem" size="8rem" mx="4%" my="10.5rem" ms="4.8rem" motion="spin" dur={6} />
      <Sticker icon="sparkle" x="15%" y="9rem" size="4rem" mx="20%" my="8.4rem" ms="2.6rem" motion="twinkle" delay={0.5} />
      <Sticker icon="blob" tone={C.baby} x="9%" y="70rem" size="4rem" motion="float" desktopOnly />
      <Sticker icon="ticket" tone={C.baby} x="85%" y="12rem" size="8.5rem" mx="82%" my="10rem" ms="4.8rem" motion="tilt" dur={5} rotate={-10} />
      <Sticker icon="sparkle" tone={C.lemonade} x="88%" y="66rem" size="4rem" motion="twinkle" delay={1.1} desktopOnly />
      <Sticker icon="blob" tone={C.lime} x="83%" y="76rem" size="3.4rem" motion="drift" desktopOnly />
    </>
  );
}

/** Stickers around the close. */
export function ClosingStickers() {
  return (
    <>
      <Sticker icon="book" x="7%" y="30%" size="10rem" mx="4%" my="3rem" ms="5.4rem" motion="float" />
      <Sticker icon="sparkle" x="15%" y="22%" size="4rem" mx="18%" my="2rem" ms="2.4rem" motion="twinkle" delay={0.4} />
      <Sticker icon="lock" x="84%" y="22%" size="9.5rem" mx="80%" my="3rem" ms="5.2rem" motion="sway" />
      <Sticker icon="blob" tone={C.sky} x="80%" y="62%" size="3.6rem" motion="float" delay={1.2} desktopOnly />
    </>
  );
}
