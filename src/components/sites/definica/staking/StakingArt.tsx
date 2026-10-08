"use client";

import { useId } from "react";
import { ArtSvg, Band, Blob, C, Chip, Coin, Dashes, Eth, Flowline, INK, LINE, Move, Sparkle, sparklePath, Tag, THIN } from "../shared/page-kit/art";
import { Sticker } from "../shared/page-kit/Sticker";

/*
 * The staking page's illustrations: the Vault with coins dropping in, the share price, a
 * harvest being split, a lock with its calendar, the exit queue and a magnifier over the
 * record. Decorative: the text beside each one says everything it shows.
 */

const useClipId = (name: string) => `${name}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

/** A row of Core's ledger: a blob for the holder and a bar for the shares. */
function LedgerRow({ y, fill, width, you = false }: { y: number; fill: string; width: number; you?: boolean }) {
  return (
    <g>
      {you ? <rect x="14" y={y - 20} width="212" height="40" rx="13" fill={C.lime} {...THIN} /> : null}
      <Blob x={38} y={y} size={26} fill={fill} />
      <rect x="64" y={y - 6} width={width} height="12" rx="6" fill={you ? C.white : C.grey} />
      {you ? (
        <text x="204" y={y + 4.5} textAnchor="middle" fontFamily='"Tomato Grotesk", Arial, sans-serif' fontWeight={700} fontSize={13} fill={INK}>
          YOU
        </text>
      ) : null}
    </g>
  );
}

/**
 * Hero: ETH drops into the dedicated Vault, shares go back to Core's ledger, validators blink on the
 * right. The Vault answers every coin: it squashes and settles, the slot flashes, the dial clicks
 * round, sparks pop (all on the coins' 1.6 s beat, starting with the first coin in).
 */
export function VaultHero() {
  const clip = useClipId("vault-slot");
  return (
    <ArtSvg viewBox="0 0 1000 470">
      <defs>
        <clipPath id={clip}>
          <rect x="380" y="-200" width="240" height="309" />
        </clipPath>
      </defs>
      <circle cx="500" cy="262" r="214" fill={C.lightGreen} />
      <circle cx="176" cy="262" r="128" fill="#fff1f6" />
      <circle cx="858" cy="292" r="118" fill="#eaf2fd" />
      <ellipse cx="500" cy="440" rx="440" ry="15" fill={INK} opacity="0.07" />

      {/* ETH in, shares back, ETH on to the validators */}
      <Flowline d="M304 262C332 262 342 268 368 268" />
      <Flowline d="M368 200C340 200 332 194 304 194" />
      <Tag x={336} y={172} text="SHARES" size={10} fill={C.white} />
      <Tag x={336} y={292} text="ETH" size={10} fill={C.white} />
      <Flowline d="M632 300C690 300 700 326 748 326" />

      {/* Core's ledger */}
      <g transform="translate(64 152) rotate(-5 120 100)">
        <Move motion="float" dur={6.5} vars={{ "--amp": "8px" }}>
          <rect width="240" height="200" rx="22" fill={C.white} {...LINE} />
          <Tag x={120} y={34} text="CORE LEDGER" size={12} fill={C.lime} />
          <LedgerRow y={84} fill={C.sky} width={120} />
          <LedgerRow y={126} fill={C.baby} width={92} you />
          <LedgerRow y={168} fill={C.lemonade} width={108} />
        </Move>
      </g>

      {/* the Vault, taking each coin with a thump */}
      <Move motion="thump" dur={1.6} delay={1.6}>
        <rect x="402" y="394" width="40" height="24" rx="7" fill={INK} />
        <rect x="558" y="394" width="40" height="24" rx="7" fill={INK} />
        <rect x="370" y="110" width="260" height="292" rx="30" fill={C.baby} {...LINE} />
        <rect x="394" y="134" width="212" height="244" rx="20" fill={C.white} {...LINE} />
        <rect x="383" y="172" width="16" height="38" rx="5" fill={INK} />
        <rect x="383" y="302" width="16" height="38" rx="5" fill={INK} />
        <Tag x={500} y={168} text="STAKEWISE VAULT" size={12} fill={C.lemonade} />
        <g transform="translate(482 278)">
          <circle r="62" fill={C.lemonade} {...LINE} />
          <Move motion="notch" dur={1.6} delay={1.6}>
            <Move motion="turn" dur={36}>
              <circle r="54" fill="none" />
              {Array.from({ length: 16 }, (_, i) => {
                const a = (i * Math.PI) / 8;
                return (
                  <path
                    key={i}
                    d={`M${(Math.cos(a) * 45).toFixed(1)} ${(Math.sin(a) * 45).toFixed(1)}L${(Math.cos(a) * 53).toFixed(1)} ${(Math.sin(a) * 53).toFixed(1)}`}
                    stroke={INK}
                    strokeWidth={i % 4 === 0 ? 3 : 1.8}
                    strokeLinecap="round"
                  />
                );
              })}
            </Move>
            <circle r="34" fill={C.white} {...LINE} />
            <path d="M-15 0H15M0-15V15" stroke={INK} strokeWidth="5" strokeLinecap="round" />
            <circle r="7" fill={INK} />
          </Move>
        </g>
        <rect x="562" y="236" width="20" height="86" rx="10" fill={C.lime} {...LINE} />
        <circle cx="572" cy="248" r="3" fill={INK} />
        <circle cx="572" cy="310" r="3" fill={INK} />
        <rect x="436" y="101" width="128" height="17" rx="8.5" fill={INK} />
        <Move motion="flash" dur={1.6} delay={1.6}>
          <rect x="436" y="101" width="128" height="17" rx="8.5" fill={C.lime} {...THIN} />
        </Move>
      </Move>
      {[
        { x: 420, y: 86, r: 11 },
        { x: 582, y: 82, r: 13 },
      ].map((spark) => (
        <g key={spark.x} transform={`translate(${spark.x} ${spark.y})`}>
          <Move motion="spark" dur={1.6} delay={1.6}>
            <path d={sparklePath(spark.r)} fill={C.lime} {...THIN} />
          </Move>
        </g>
      ))}

      {/* coins dropping into the slot */}
      <g clipPath={`url(#${clip})`}>
        {[C.lemonade, C.sky].map((fill, i) => (
          <g key={fill} transform="translate(500 70)">
            <Move motion="drop" dur={3.2} delay={i * 1.6} vars={{ "--fall": "92px", "--sink": "66px" }}>
              <Coin x={0} y={0} r={30} fill={fill} />
            </Move>
          </g>
        ))}
      </g>

      {/* validators */}
      <g transform="translate(752 196)">
        <rect x="-6" y="196" width="208" height="18" rx="9" fill={C.mint} {...LINE} />
        {[0, 68, 136].map((x, i) => (
          <g key={x} transform={`translate(${x} 0)`}>
            <rect x="0" y="40" width="60" height="158" rx="13" fill={C.white} {...LINE} />
            {[56, 98, 140].map((y, j) => (
              <g key={y}>
                <rect x="9" y={y} width="42" height="28" rx="7" fill={C.mint} {...THIN} />
                <path d={`M17 ${y + 14}h12`} stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                <Move motion="blink" dur={2.2} delay={(i * 3 + j) * 0.37}>
                  <circle cx="40" cy={y + 14} r="4.5" fill={C.lime} stroke={INK} strokeWidth="1.4" />
                </Move>
              </g>
            ))}
          </g>
        ))}
        <Tag x={98} y={4} text="VALIDATORS" size={12} fill={C.mint} />
      </g>

      <Sparkle x={326} y={92} r={15} />
      <Sparkle x={668} y={110} r={11} fill={C.baby} delay={0.8} />
      <Sparkle x={962} y={140} r={13} fill={C.lemonade} delay={1.4} />
      <Sparkle x={42} y={120} r={10} fill={C.sky} delay={0.5} />
      <Sparkle x={262} y={420} r={9} delay={1.1} />
      <Blob x={712} y={176} size={24} fill={C.sky} />
      <Blob x={84} y={412} size={18} fill={C.baby} />
    </ArtSvg>
  );
}

/** The share price: the Vault's assets in a jar, divided by its shares, re-priced by the harvest clock. */
export function SharePriceArt() {
  return (
    <ArtSvg viewBox="0 0 560 480">
      <circle cx="280" cy="250" r="206" fill={C.lightGreen} />
      <ellipse cx="280" cy="432" rx="240" ry="12" fill={INK} opacity="0.07" />

      {/* the harvest clock */}
      <g transform="translate(280 96)">
        <rect x="-12" y="-76" width="24" height="14" rx="5" fill={C.lemonade} {...LINE} />
        <circle r="62" fill={C.lemonade} {...LINE} />
        <circle r="48" fill={C.white} {...LINE} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * Math.PI) / 6;
          const inner = i % 3 === 0 ? 37 : 41;
          return (
            <path
              key={i}
              d={`M${(Math.cos(a) * inner).toFixed(1)} ${(Math.sin(a) * inner).toFixed(1)}L${(Math.cos(a) * 45).toFixed(1)} ${(Math.sin(a) * 45).toFixed(1)}`}
              stroke={INK}
              strokeWidth={i % 3 === 0 ? 3 : 1.6}
              strokeLinecap="round"
            />
          );
        })}
        <Move motion="turn" dur={90}>
          <circle r="40" fill="none" />
          <path d="M0 0L17 9" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        </Move>
        <Move motion="turn" dur={7.5}>
          <circle r="40" fill="none" />
          <path d="M0 0V-34" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        </Move>
        <circle r="5.5" fill={INK} />
      </g>
      <Tag x={280} y={188} text="EVERY 12 HOURS" size={12} fill={C.white} />

      {/* the Vault's assets */}
      <rect x="88" y="208" width="104" height="22" rx="8" fill={C.lemonade} {...LINE} />
      <path d="M92 234h96c16 0 24 10 24 26v130c0 22-16 34-38 34h-68c-22 0-38-12-38-34V260c0-16 8-26 24-26Z" fill={C.white} {...LINE} />
      <Coin x={104} y={392} r={21} fill={C.lemonade} />
      <Coin x={148} y={396} r={21} fill={C.sky} />
      <Coin x={190} y={388} r={20} fill={C.lime} />
      <Coin x={124} y={352} r={21} fill={C.baby} />
      <Coin x={168} y={350} r={21} fill={C.lemonade} />
      <g transform="translate(146 310)">
        <Move motion="bob" dur={3}>
          <Coin x={0} y={0} r={21} fill={C.sky} />
        </Move>
      </g>
      <path d="M82 272v58" stroke={C.sky} strokeWidth="7" strokeLinecap="round" opacity="0.55" />
      <Tag x={140} y={458} text="VAULT ASSETS" size={12} fill={C.white} />

      {/* divided by */}
      <circle cx="280" cy="330" r="32" fill={C.lime} {...LINE} />
      <path d="M262 330h36" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <circle cx="280" cy="315" r="4.5" fill={INK} />
      <circle cx="280" cy="345" r="4.5" fill={INK} />

      {/* the Vault's shares */}
      {[404, 384, 364, 344, 324, 304].map((y, i) => (
        <Chip key={y} x={420} y={y} rx={56} ry={17} h={12} fill={i % 2 ? C.white : C.sky} />
      ))}
      <Eth x={420} y={304} h={18} />
      <Tag x={420} y={458} text="VAULT SHARES" size={12} fill={C.white} />

      <Sparkle x={62} y={150} r={12} />
      <Sparkle x={498} y={168} r={10} fill={C.baby} delay={0.6} />
      <Sparkle x={526} y={262} r={9} fill={C.lemonade} delay={1.2} />
      <Sparkle x={34} y={300} r={8} fill={C.sky} delay={0.3} />
    </ArtSvg>
  );
}

/** A harvest split: the fee's wedge drifts off to the fee recipient, the rest stays with every share. */
export function HarvestSplitArt() {
  return (
    <ArtSvg viewBox="0 0 480 390">
      <circle cx="232" cy="206" r="176" fill="#fff4f8" />
      <ellipse cx="226" cy="356" rx="150" ry="11" fill={INK} opacity="0.07" />
      <Tag x={220} y={30} text="HARVEST GAIN" size={12} fill={C.white} />
      <path d="M220 196L314.99 116.29A124 124 0 1 0 344 196Z" fill={C.lemonade} {...LINE} />
      <path d="M293.54 134.29A96 96 0 1 0 316 196" fill="none" stroke={INK} strokeWidth="1.3" opacity="0.35" />
      <Eth x={196} y={214} h={74} fill={C.white} outline />
      <Move motion="drift" dur={4.2} vars={{ "--dx": "12px", "--dy": "-6px" }}>
        <path d="M220 196L344 196A124 124 0 0 0 314.99 116.29Z" fill={C.baby} {...LINE} />
      </Move>
      <Dashes d="M384 106C372 118 362 126 350 136" opacity={0.6} />
      <Tag x={398} y={88} text="FEE SHARES" size={12} fill={C.baby} />
      <Tag x={150} y={348} text="EVERY SHARE" size={12} fill={C.lemonade} />
      <Sparkle x={60} y={94} r={12} />
      <Sparkle x={440} y={244} r={10} fill={C.lemonade} delay={0.7} />
      <Sparkle x={78} y={300} r={8} fill={C.sky} delay={1.3} />
    </ArtSvg>
  );
}

/** A share lock: the padlock with its calendar tag, and a coin still rising from it (locked shares keep earning). */
export function LockArt() {
  return (
    <ArtSvg viewBox="0 0 520 460">
      <circle cx="252" cy="244" r="200" fill="#f4fbd6" />
      <ellipse cx="236" cy="430" rx="196" ry="12" fill={INK} opacity="0.07" />
      <path d="M168 236V176a62 62 0 0 1 124 0v60" fill="none" stroke={INK} strokeWidth="25" strokeLinecap="round" />
      <path d="M168 236V176a62 62 0 0 1 124 0v60" fill="none" stroke={C.stone} strokeWidth="15" strokeLinecap="round" />
      <path d="M292 190C320 198 338 208 350 226" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <rect x="122" y="222" width="216" height="186" rx="34" fill={C.lime} {...LINE} strokeWidth={2.4} />
      <path d="M148 252v58" stroke={C.white} strokeWidth="9" strokeLinecap="round" opacity="0.75" />
      <circle cx="230" cy="300" r="18" fill={INK} />
      <rect x="221" y="306" width="18" height="50" rx="9" fill={INK} />

      {/* the calendar tag */}
      <g transform="translate(332 226)">
        <Move motion="tilt" dur={5.2}>
          <rect x="0" y="0" width="140" height="134" rx="18" fill={C.white} {...LINE} />
          <path d="M0 18a18 18 0 0 1 18-18h104a18 18 0 0 1 18 18v24H0Z" fill={C.sky} {...LINE} />
          <path d="M36-8v18M104-8v18" stroke={INK} strokeWidth="6" strokeLinecap="round" />
          {[22, 50, 78, 106].flatMap((x) =>
            [62, 86, 110].map((y) =>
              x === 78 && y === 110 ? (
                <rect key={`${x}-${y}`} x={x - 2} y={y - 4} width="22" height="20" rx="5" fill={C.lime} {...THIN} />
              ) : (
                <rect key={`${x}-${y}`} x={x} y={y} width="14" height="12" rx="3" fill={INK} opacity="0.7" />
              ),
            ),
          )}
        </Move>
      </g>

      {/* still earning */}
      <g transform="translate(94 168)">
        <Move motion="float" dur={3.6} vars={{ "--amp": "12px" }}>
          <Coin x={0} y={0} r={23} fill={C.lemonade} />
        </Move>
      </g>
      <Sparkle x={52} y={110} r={9} fill={C.baby} delay={0.9} />
      <Sparkle x={430} y={92} r={13} />
      <Sparkle x={64} y={340} r={10} fill={C.sky} delay={0.4} />
      <Sparkle x={474} y={404} r={9} fill={C.lemonade} delay={1.3} />
    </ArtSvg>
  );
}

const TICKET = "M0 8a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8v12a12 12 0 0 0 0 24v12a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V44a12 12 0 0 0 0-24Z";

/** One ticket's place in the line, back to front (the front one is next through the door). */
const QUEUE = [
  { rotate: -5, fill: C.baby },
  { rotate: 4, fill: C.sky },
  { rotate: -3, fill: C.lemonade },
  { rotate: 5, fill: C.lime },
];

/**
 * The exit queue on a beat (1.8 s): every ticket steps forward a place, the front one goes through
 * the door, the door flashes, the ETH coin pops and a spark goes off, and a new ticket joins the
 * back. Each ticket runs the same loop a beat apart; under reduced motion each waits at its place.
 */
export function QueueArt() {
  return (
    <ArtSvg viewBox="0 0 680 330">
      <ellipse cx="340" cy="294" rx="320" ry="12" fill={INK} opacity="0.07" />
      <path d="M16 284H664" stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      {/* the line: drawn before the door, so the front ticket goes in behind its frame */}
      {QUEUE.map((ticket, i) => (
        <g key={ticket.fill} transform="translate(24 150)">
          <Move motion="queue" delay={-i * 1.8} vars={{ "--rest": `${i * 116}px` }}>
            <g transform={`rotate(${ticket.rotate} 48 32)`}>
              <Move motion="bob" dur={2.8} delay={i * 0.35}>
                <path d={TICKET} fill={ticket.fill} {...LINE} />
                <path d="M68 7v50" stroke={INK} strokeWidth="1.6" strokeDasharray="4 4" />
                <path d="M14 22h36M14 33h26M14 44h32" stroke={INK} strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
              </Move>
            </g>
          </Move>
        </g>
      ))}
      <rect x="520" y="56" width="128" height="228" rx="16" fill={C.mint} {...LINE} />
      <rect x="540" y="78" width="88" height="206" rx="10" fill={C.white} {...LINE} />
      <Move motion="flash" dur={1.8} delay={0.65}>
        <rect x="540" y="78" width="88" height="206" rx="10" fill={C.lime} opacity="0.55" />
      </Move>
      <g transform="translate(584 176)">
        <Move motion="pop" dur={1.8} delay={0.65}>
          <Move motion="float" dur={3}>
            <Coin x={0} y={0} r={28} fill={C.lemonade} />
          </Move>
        </Move>
      </g>
      <g transform="translate(634 98)">
        <Move motion="spark" dur={1.8} delay={0.65}>
          <path d={sparklePath(12)} fill={C.lime} {...THIN} />
        </Move>
      </g>
      <Tag x={584} y={30} text="EXIT QUEUE" size={12} fill={C.lemonade} />
      <Sparkle x={42} y={76} r={12} />
      <Sparkle x={318} y={72} r={10} fill={C.baby} delay={0.6} />
      <Sparkle x={468} y={110} r={9} fill={C.lemonade} delay={1.2} />
    </ArtSvg>
  );
}

/** Verify: a magnifier drifting over the record, with the chain's block behind. */
export function VerifyArt() {
  const rows = [130, 100, 150, 90, 120];
  return (
    <ArtSvg viewBox="0 0 520 460">
      <circle cx="262" cy="240" r="200" fill="#eaf2fd" />
      <ellipse cx="250" cy="432" rx="190" ry="12" fill={INK} opacity="0.07" />
      <g transform="translate(404 98)">
        <Move motion="float" dur={5.5}>
          <path d="M0-50 46-25v50L0 50-46 25v-50Z" fill={C.sky} {...LINE} />
          <path d="M46-25v50L0 50V0Z" fill={INK} opacity="0.1" />
          <path d="M0-50 46-25 0 0-46-25Z" fill={C.white} {...LINE} />
          <path d="M0 0v50" {...LINE} />
          <Eth x={0} y={-25} h={20} />
        </Move>
      </g>
      <g transform="rotate(-4 230 250)">
        <rect x="110" y="80" width="240" height="320" rx="20" fill={C.white} {...LINE} />
        <path d="M110 100a20 20 0 0 1 20-20h200a20 20 0 0 1 20 20v32H110Z" fill={C.lemonade} {...LINE} />
        <circle cx="134" cy="106" r="5" fill={INK} />
        <circle cx="152" cy="106" r="5" fill={INK} opacity="0.5" />
        {rows.map((width, i) => {
          const y = 168 + i * 48;
          return (
            <g key={y}>
              <circle cx="146" cy={y} r="13" fill={C.lime} {...THIN} />
              <path d={`M139.5 ${y}l4.5 4.5 8-8.5`} fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="170" y={y - 6} width={width} height="12" rx="6" fill={C.grey} />
            </g>
          );
        })}
      </g>
      <g transform="translate(292 252)">
        <Move motion="drift" dur={7} vars={{ "--dx": "-18px", "--dy": "-14px" }}>
          <Band d="M52 52 104 104" color={C.lemonade} width={14} />
          <circle r="74" fill={C.sky} opacity="0.25" />
          <circle r="74" fill="none" stroke={INK} strokeWidth="15" />
          <circle r="74" fill="none" stroke={C.lemonade} strokeWidth="9.5" />
          <path d="M-46-22a50 50 0 0 1 24-24" fill="none" stroke={C.white} strokeWidth="7" strokeLinecap="round" />
        </Move>
      </g>
      <Sparkle x={62} y={124} r={12} />
      <Sparkle x={476} y={300} r={10} fill={C.baby} delay={0.7} />
      <Sparkle x={86} y={380} r={9} fill={C.lemonade} delay={1.3} />
      <Sparkle x={326} y={42} r={8} fill={C.sky} delay={0.4} />
    </ArtSvg>
  );
}

/** The coin that travels the deposit's pipe. */
export function FlowCoin() {
  return (
    <ArtSvg viewBox="0 0 64 64">
      <Coin x={32} y={32} r={26} fill={C.lemonade} diamond="white" />
    </ArtSvg>
  );
}

/** Stickers around the hero's title. */
export function HeroStickers() {
  return (
    <>
      <Sticker icon="coin" x="6%" y="30rem" size="9.5rem" mx="4%" my="10.5rem" ms="4.8rem" motion="spin" dur={6} />
      <Sticker icon="sparkle" x="14%" y="24rem" size="4.6rem" mx="20%" my="8.4rem" ms="2.6rem" motion="twinkle" delay={0.5} />
      <Sticker icon="blob" tone={C.lime} x="10%" y="58rem" size="4rem" motion="float" desktopOnly />
      <Sticker icon="lock" x="85%" y="27rem" size="9rem" mx="82%" my="10rem" ms="4.8rem" motion="sway" dur={5} rotate={8} />
      <Sticker icon="sparkle" tone={C.lemonade} x="80%" y="56rem" size="4.4rem" motion="twinkle" delay={1.1} desktopOnly />
      <Sticker icon="blob" tone={C.sky} x="91%" y="47rem" size="3.6rem" motion="drift" desktopOnly />
    </>
  );
}

/** Stickers around the close. */
export function ClosingStickers() {
  return (
    <>
      <Sticker icon="book" x="7%" y="30%" size="10rem" mx="4%" my="3rem" ms="5.4rem" motion="float" />
      <Sticker icon="sparkle" x="15%" y="22%" size="4rem" mx="18%" my="2rem" ms="2.4rem" motion="twinkle" delay={0.4} />
      <Sticker icon="coins" x="84%" y="22%" size="10rem" mx="80%" my="3rem" ms="5.4rem" motion="bob" />
      <Sticker icon="blob" tone={C.lime} x="80%" y="62%" size="3.6rem" motion="float" delay={1.2} desktopOnly />
    </>
  );
}
