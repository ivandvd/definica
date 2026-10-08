"use client";

import { ArtSvg, Band, Blob, C, Chip, Dashes, Eth, Flowline, FONT, INK, LINE, Mark, Move, Sparkle, Tag, THIN } from "../shared/page-kit/art";
import { IconShape } from "../shared/page-kit/icons";
import { Sticker } from "../shared/page-kit/Sticker";

/*
 * The About page's illustrations: the three layers pulled apart under a magnifier, the two
 * foundations under Definica, and the envelope for the contact section. Decorative: the text
 * beside each one says everything it shows.
 */

/** An isometric slab: its top face centred on (cx, y), `w` wide, `h` deep and `t` thick. */
function Slab({ cx, y, w = 320, h = 128, t = 16, fill }: { cx: number; y: number; w?: number; h?: number; t?: number; fill: string }) {
  const hw = w / 2;
  const hh = h / 2;
  return (
    <g>
      <path d={`M${cx - hw} ${y}L${cx} ${y + hh}V${y + hh + t}L${cx - hw} ${y + t}Z`} fill={fill} {...LINE} />
      <path d={`M${cx} ${y + hh}L${cx + hw} ${y}V${y + t}L${cx} ${y + hh + t}Z`} fill={fill} {...LINE} />
      <path d={`M${cx} ${y + hh}L${cx + hw} ${y}V${y + t}L${cx} ${y + hh + t}Z`} fill={INK} opacity="0.12" />
      <path d={`M${cx - hw} ${y}L${cx} ${y - hh}L${cx + hw} ${y}L${cx} ${y + hh}Z`} fill={fill} {...LINE} />
    </g>
  );
}

/** Hero: staking, the Main Liquidity Module and the borrowing markets as three layers pulled apart, a magnifier passing over them. */
export function AboutHero() {
  return (
    <ArtSvg viewBox="0 0 1000 480">
      <circle cx="500" cy="250" r="222" fill="#f4fbd6" />
      <circle cx="166" cy="214" r="112" fill="#eaf2fd" />
      <circle cx="836" cy="300" r="122" fill="#fff1f6" />
      <ellipse cx="500" cy="456" rx="420" ry="14" fill={INK} opacity="0.07" />

      {/* borrowing */}
      <g>
        <Move motion="float" dur={6.4} delay={0.8} vars={{ "--amp": "6px" }}>
          <Slab cx={500} y={362} fill={C.lemonade} />
          <g transform="translate(462 300) scale(1.2)">
            <IconShape name="scale" tone={C.white} />
          </g>
        </Move>
      </g>
      {/* the Main Liquidity Module */}
      <g>
        <Move motion="float" dur={6.4} delay={0.4} vars={{ "--amp": "6px" }}>
          <Slab cx={500} y={240} fill={C.baby} />
          <path d="M482 214v-14a18 18 0 0 1 36 0v14" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <path d="M482 214v-14a18 18 0 0 1 36 0v14" fill="none" stroke={C.stone} strokeWidth="5" strokeLinecap="round" />
          <rect x="466" y="208" width="68" height="46" rx="12" fill={C.lime} {...LINE} />
          <circle cx="500" cy="228" r="5.5" fill={INK} />
          <rect x="497" y="230" width="6" height="12" rx="3" fill={INK} />
        </Move>
      </g>
      {/* staking */}
      <g>
        <Move motion="float" dur={6.4} vars={{ "--amp": "6px" }}>
          <Slab cx={500} y={118} fill={C.sky} />
          <Chip x={500} y={112} rx={44} ry={13} h={10} fill={C.lemonade} />
          <Chip x={500} y={98} rx={44} ry={13} h={10} fill={C.white} />
          <Chip x={500} y={84} rx={44} ry={13} h={10} fill={C.lemonade} />
          <Eth x={500} y={84} h={14} />
        </Move>
      </g>

      <Dashes d="M670 118H736" opacity={0.55} />
      <Dashes d="M670 240H730" opacity={0.55} />
      <Dashes d="M670 362H736" opacity={0.55} />
      <Tag x={800} y={118} text="STAKING" size={12} fill={C.sky} />
      <Tag x={814} y={240} text="LIQUIDITY MODULE" size={12} fill={C.baby} />
      <Tag x={804} y={362} text="BORROWING" size={12} fill={C.lemonade} />

      {/* the magnifier */}
      <g transform="translate(362 232)">
        <Move motion="drift" dur={7.5} vars={{ "--dx": "26px", "--dy": "-30px" }}>
          <Band d="M-52 52-112 112" color={C.lemonade} width={15} />
          <circle r="74" fill={C.white} opacity="0.32" />
          <circle r="74" fill="none" stroke={INK} strokeWidth="15" />
          <circle r="74" fill="none" stroke={C.lime} strokeWidth="9.5" />
          <path d="M-44-24a50 50 0 0 1 22-22" fill="none" stroke={C.white} strokeWidth="7" strokeLinecap="round" />
        </Move>
      </g>

      {/* the mark */}
      <g transform="translate(150 112)">
        <Move motion="bob" dur={4.4}>
          <circle r="42" fill={C.lime} {...LINE} />
          <Mark x={1} y={0} size={40} color={INK} accent={C.white} />
        </Move>
      </g>

      <Sparkle x={298} y={70} r={14} />
      <Sparkle x={680} y={56} r={11} fill={C.baby} delay={0.8} />
      <Sparkle x={952} y={414} r={12} fill={C.lemonade} delay={1.4} />
      <Sparkle x={58} y={300} r={10} fill={C.sky} delay={0.5} />
      <Sparkle x={612} y={448} r={9} delay={1.1} />
      <Blob x={258} y={420} size={20} fill={C.lime} />
      <Blob x={944} y={190} size={22} fill={C.sky} />
    </ArtSvg>
  );
}

/** Built on: two blocks, StakeWise V3 and Aave V3, with Definica's layer resting across them. */
export function FoundationArt() {
  return (
    <ArtSvg viewBox="0 0 600 420">
      <circle cx="300" cy="218" r="194" fill="#eaf2fd" />
      <ellipse cx="300" cy="392" rx="240" ry="12" fill={INK} opacity="0.07" />
      <rect x="86" y="232" width="206" height="152" rx="22" fill={C.sky} {...LINE} />
      <path d="M86 284h206M86 332h206M156 232v52M224 284v48M156 332v52" stroke={INK} strokeWidth="1.4" opacity="0.35" />
      <g transform="translate(150 246) scale(1.25)">
        <IconShape name="vault" tone={C.white} />
      </g>
      <Tag x={189} y={358} text="STAKEWISE V3" size={12} fill={C.white} />
      <rect x="308" y="232" width="206" height="152" rx="22" fill={C.baby} {...LINE} />
      <path d="M308 284h206M308 332h206M378 232v52M446 284v48M378 332v52" stroke={INK} strokeWidth="1.4" opacity="0.35" />
      <g transform="translate(371 244) scale(1.25)">
        <IconShape name="pool" />
      </g>
      <Tag x={411} y={358} text="AAVE V3" size={12} fill={C.white} />
      <g>
        <Move motion="float" dur={5} vars={{ "--amp": "6px" }}>
          <rect x="110" y="150" width="380" height="66" rx="22" fill={C.lime} {...LINE} />
          <Mark x={300} y={183} size={36} color={INK} accent={C.white} />
        </Move>
      </g>
      <Sparkle x={70} y={110} r={12} />
      <Sparkle x={540} y={130} r={10} fill={C.baby} delay={0.7} />
      <Sparkle x={560} y={330} r={9} fill={C.lemonade} delay={1.2} />
    </ArtSvg>
  );
}

/** Contact: an open envelope with a letter, a paper plane on its way, and a speech bubble typing. */
export function MailArt() {
  return (
    <ArtSvg viewBox="0 0 540 420">
      <circle cx="270" cy="214" r="186" fill="#fffbe0" />
      <ellipse cx="250" cy="392" rx="200" ry="11" fill={INK} opacity="0.07" />
      <rect x="110" y="190" width="260" height="170" rx="20" fill={C.lemonade} {...LINE} />
      <g>
        <Move motion="bob" dur={3.6} vars={{ "--amp": "8px" }}>
          <rect x="146" y="120" width="188" height="170" rx="14" fill={C.white} {...LINE} />
          <text x="240" y="178" textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={INK}>
            @
          </text>
          <rect x="176" y="204" width="128" height="10" rx="5" fill={C.grey} />
          <rect x="176" y="224" width="96" height="10" rx="5" fill={C.grey} />
        </Move>
      </g>
      <path d="M110 230 240 302 370 230V344a16 16 0 0 1-16 16H126a16 16 0 0 1-16-16Z" fill={C.lemonade} {...LINE} />
      <path d="M118 352 210 286M362 352 270 286" stroke={INK} strokeWidth="1.6" opacity="0.5" />

      <Flowline d="M330 96C370 66 404 64 430 82" />
      <g transform="translate(424 40) scale(1.6)">
        <Move motion="drift" dur={6} vars={{ "--dx": "10px", "--dy": "-8px" }}>
          <IconShape name="plane" tone={C.sky} />
        </Move>
      </g>

      <g transform="translate(396 236)">
        <path d="M0 0h96a14 14 0 0 1 14 14v34a14 14 0 0 1-14 14H40l-18 16V62H14A14 14 0 0 1 0 48V14A14 14 0 0 1 14 0Z" fill={C.baby} {...LINE} />
        {[30, 55, 80].map((cx, i) => (
          <Move key={cx} motion="blink" dur={1.4} delay={i * 0.2}>
            <circle cx={cx} cy="31" r="5.5" fill={INK} />
          </Move>
        ))}
      </g>
      <circle cx="96" cy="128" r="10" fill={C.sky} {...THIN} />
      <Sparkle x={70} y={84} r={12} />
      <Sparkle x={500} y={170} r={10} fill={C.lemonade} delay={0.7} />
      <Sparkle x={70} y={330} r={9} fill={C.baby} delay={1.2} />
    </ArtSvg>
  );
}

/** Stickers in the mission's top corners, clear of the statement. */
export function MissionStickers() {
  return (
    <>
      <Sticker icon="star" x="7%" y="5rem" size="12rem" mx="4%" my="2.5rem" ms="6rem" motion="turn" dur={40} />
      <Sticker icon="sparkle" x="88%" y="8rem" size="5rem" mx="86%" my="4rem" ms="3rem" motion="twinkle" />
    </>
  );
}

/** Stickers around the hero's title. */
export function HeroStickers() {
  return (
    <>
      <Sticker icon="star" x="7%" y="29rem" size="9.5rem" mx="4%" my="10.5rem" ms="4.8rem" motion="turn" dur={30} />
      <Sticker icon="sparkle" x="15%" y="23rem" size="4.6rem" mx="20%" my="8.4rem" ms="2.6rem" motion="twinkle" delay={0.5} />
      <Sticker icon="blob" tone={C.lime} x="11%" y="58rem" size="4rem" motion="float" desktopOnly />
      <Sticker icon="magnifier" x="84%" y="27rem" size="9.5rem" mx="81%" my="10rem" ms="5rem" motion="tilt" dur={5} />
      <Sticker icon="sparkle" tone={C.lemonade} x="80%" y="56rem" size="4.4rem" motion="twinkle" delay={1.1} desktopOnly />
      <Sticker icon="blob" tone={C.sky} x="90%" y="47rem" size="3.6rem" motion="drift" desktopOnly />
    </>
  );
}

