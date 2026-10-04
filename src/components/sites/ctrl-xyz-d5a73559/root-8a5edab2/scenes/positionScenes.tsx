import { gsap } from "../../shared/gsap";
import { DefinicaMark, EthDiamond, glyphSrc, type GlyphName } from "../phone/kit";
import { allEl, byEl } from "../phone/motion";
import { RingPops } from "./motionKit";
import styles from "./scenes.module.css";

/* Scenes for the "See every part of your position" cards (400 x 400 canvases). */

const INK = "#001405";

/*
 * Shares, not fixed balances: the Vault as a pie of everyone's shares. ETH drops into the Vault's
 * slot and the pie grows; every slice grows with it (a ripple runs round them), so your slice is
 * worth more though your number of shares stays the same. Only ETH goes in: Definica has no token
 * of its own.
 */

const PIE = { cx: 200, cy: 218, r: 116, depth: 12 };
/** The coin slot in the middle of the pie (coins disappear into it), and where coins appear. */
const SLOT = { x: 200, y: 218, w: 76, h: 14 };
const SPAWN_Y = 66;

interface Slice {
  from: number;
  to: number;
  fill: string;
  edge: string;
}

/** Angles in degrees, clockwise from 3 o'clock. */
const OTHER_SLICES: Slice[] = [
  { from: -90, to: -30, fill: "#9dc4f5", edge: "#6f9ed8" },
  { from: -30, to: 16, fill: "#ffcadc", edge: "#e7a3ba" },
  { from: 74, to: 140, fill: "#fbe74e", edge: "#d9c22c" },
  { from: 140, to: 196, fill: "#d1d6d2", edge: "#a9b0ab" },
  { from: 196, to: 270, fill: "#ff5a4d", edge: "#d63b2f" },
];
const MY_SLICE: Slice = { from: 16, to: 74, fill: "#d1f500", edge: "#a6c300" };
/** How far your slice slides out, along its middle. */
const MY_POP = 14;

const piePoint = (degrees: number, dy = 0) => {
  const angle = (degrees * Math.PI) / 180;
  const x = PIE.cx + PIE.r * Math.cos(angle);
  const y = PIE.cy + dy + PIE.r * Math.sin(angle);
  return `${Math.round(x * 100) / 100},${Math.round(y * 100) / 100}`;
};

const facePath = ({ from, to }: Slice) =>
  `M${PIE.cx},${PIE.cy}L${piePoint(from)}A${PIE.r},${PIE.r} 0 ${to - from > 180 ? 1 : 0} 1 ${piePoint(to)}Z`;

/** The slice's side band; only the front half of the pie (0°–180°) shows one. */
const sidePath = ({ from, to }: Slice) => {
  const a = Math.max(from, 0);
  const b = Math.min(to, 180);
  if (b <= a) return null;
  const arc = `${PIE.r},${PIE.r} 0 0`;
  return `M${piePoint(a)}A${arc} 1 ${piePoint(b)}L${piePoint(b, PIE.depth)}A${arc} 0 ${piePoint(a, PIE.depth)}Z`;
};

/** A slice: the outer group ripples, the inner one (your slice) slides out. */
function PieSlice({ slice, mine = false }: { slice: Slice; mine?: boolean }) {
  const side = sidePath(slice);
  return (
    <g data-el="ripple">
      <g data-el={mine ? "mine" : undefined}>
        {side ? <path d={side} fill={slice.edge} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" /> : null}
        <path d={facePath(slice)} fill={slice.fill} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      </g>
    </g>
  );
}

const DROPS = 3;
const COIN = 58;
/** Slices in clockwise order from 12 o'clock, for the ripple. */
const RIPPLE_ORDER = [...OTHER_SLICES, MY_SLICE]
  .map((slice, index) => ({ index, mid: (((slice.from + slice.to) / 2 + 90 + 360) % 360) }))
  .sort((a, b) => a.mid - b.mid);

export function SharesMarkup() {
  return (
    <>
      <div className={styles.abs} data-el="pie" style={{ left: 0, top: 0, width: 400, height: 400 }}>
        <svg viewBox="0 0 400 400" width="400" height="400" overflow="visible" aria-hidden="true">
          {OTHER_SLICES.map((slice) => (
            <PieSlice key={slice.from} slice={slice} />
          ))}
          <PieSlice slice={MY_SLICE} mine />
          <rect
            data-el="slot"
            x={SLOT.x - SLOT.w / 2}
            y={SLOT.y - SLOT.h / 2}
            width={SLOT.w}
            height={SLOT.h}
            rx={SLOT.h / 2}
            fill={INK}
            stroke={INK}
            strokeWidth="2.5"
          />
        </svg>
      </div>
      {/* Pop lines at the slot as a coin goes in (as on the padlock), and a sparkle where a coin appears. */}
      <svg className={styles.abs} data-el="slotPops" viewBox="-80 -40 160 80" style={{ left: SLOT.x - 80, top: SLOT.y - 40, width: 160, height: 80, overflow: "visible", zIndex: 4 }} aria-hidden="true">
        <path d="M-50 -10l-11-8M-54 2h-13M-50 14l-11 8M50 -10l11-8M54 2h13M50 14l11 8" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      </svg>
      <RingPops el="spawnPops" x={SLOT.x} y={SPAWN_Y} r={COIN / 2} />
      {/* The coins fall inside a box that ends at the slot, so each one disappears into it. */}
      <div className={styles.abs} style={{ left: 0, top: 0, width: 400, height: SLOT.y, overflow: "hidden", zIndex: 3 }}>
        {Array.from({ length: DROPS }, (_, i) => (
          <div key={i} className={styles.ethCoin} data-el="coin" style={{ left: SLOT.x - COIN / 2, top: SPAWN_Y - COIN / 2, width: COIN, height: COIN }}>
            <span className={styles.coinEdge} />
            <span className={styles.coinFace}>
              <span className={styles.coinRim} />
              <EthDiamond color={INK} />
            </span>
          </div>
        ))}
      </div>
      <div className={styles.stickerPill} style={{ left: 40, top: 84, background: "#ffffff", color: INK, transform: "rotate(-8deg)" }}>
        VAULT
      </div>
      <div className={styles.stickerPill} data-el="yours" style={{ left: 252, top: 268, background: INK, color: "#ffffff", zIndex: 5 }}>
        YOUR SHARE
      </div>
    </>
  );
}

export function buildShares(canvas: HTMLElement) {
  const pie = byEl(canvas, "pie");
  const mine = byEl(canvas, "mine");
  const slot = byEl(canvas, "slot");
  const ripples = allEl(canvas, "ripple");
  const coins = allEl(canvas, "coin");
  const yours = byEl(canvas, "yours");
  const slotPops = byEl(canvas, "slotPops");
  const spawnPops = byEl(canvas, "spawnPops");
  const slices = [...OTHER_SLICES, MY_SLICE];

  const SMALL = 0.92;
  gsap.set(pie, { scale: SMALL, transformOrigin: `${PIE.cx}px ${PIE.cy + PIE.depth / 2}px` });
  gsap.set(slot, { scaleX: 1, transformOrigin: "50% 50%" });
  gsap.set(ripples, { x: 0, y: 0 });
  gsap.set(coins, { autoAlpha: 0, x: 0, y: 0, scale: 0, rotation: 0 });
  gsap.set([slotPops, spawnPops], { autoAlpha: 0 });
  gsap.set(yours, { autoAlpha: 0, scale: 0.3, rotation: -24 });

  const tl = gsap.timeline({ paused: true, repeat: -1 });

  // ETH arrives one coin after another: it appears with a sparkle, drops into the Vault's slot, and
  // the Vault takes it in: the slot gulps, the pie gives and grows, and a ripple runs round every slice.
  const fall = SLOT.y + COIN / 2 + 6 - SPAWN_Y;
  for (let i = 0; i < DROPS; i++) {
    const coin = coins[i];
    const at = 0.25 + i * 0.9;
    const drop = at + 0.5;
    const touches = drop + 0.29;
    const inside = drop + 0.38;
    const size = SMALL + ((1 - SMALL) * (i + 1)) / DROPS;
    // A set (not fromTo start values) so the coin shows however the playhead reaches it.
    tl.set(coin, { autoAlpha: 1, y: 0, scale: 0, rotation: -24 }, at)
      .to(coin, { scale: 1, rotation: 0, duration: 0.36, ease: "back.out(2.6)" }, at)
      .to(coin, { y: -6, duration: 0.14, ease: "sine.out" }, at + 0.36)
      .to(coin, { y: fall, duration: 0.38, ease: "power2.in" }, drop)
      .set(coin, { autoAlpha: 0 }, inside + 0.02);
    tl.set(spawnPops, { autoAlpha: 1, scale: 0.8 }, at + 0.05)
      .to(spawnPops, { scale: 1.05, duration: 0.18, ease: "power2.out" }, at + 0.05)
      .to(spawnPops, { autoAlpha: 0, scale: 1.2, duration: 0.22, ease: "power1.in" }, at + 0.25);
    tl.to(slot, { scaleX: 1.16, duration: 0.08, ease: "power2.out" }, touches).to(slot, { scaleX: 1, duration: 0.45, ease: "elastic.out(1, 0.4)" }, touches + 0.08);
    tl.to(pie, { scaleX: size + 0.03, scaleY: size - 0.035, duration: 0.09, ease: "power2.out" }, inside)
      .to(pie, { scaleX: size, scaleY: size, duration: 0.6, ease: "elastic.out(1, 0.42)" }, inside + 0.09);
    tl.set(slotPops, { autoAlpha: 1, scale: 0.8 }, inside)
      .to(slotPops, { scale: 1.05, duration: 0.18, ease: "power2.out" }, inside)
      .to(slotPops, { autoAlpha: 0, scale: 1.2, duration: 0.25, ease: "power1.in" }, inside + 0.2);
    RIPPLE_ORDER.forEach(({ index }, k) => {
      const { from, to } = slices[index];
      const mid = (((from + to) / 2) * Math.PI) / 180;
      const t = inside + 0.06 + k * 0.035;
      tl.to(ripples[index], { x: Math.cos(mid) * 6, y: Math.sin(mid) * 6, duration: 0.1, ease: "power2.out" }, t).to(
        ripples[index],
        { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, 0.5)" },
        t + 0.1,
      );
    });
  }

  // Your slice slides out and the sticker lands: same share of a bigger Vault.
  const out = (MY_POP * Math.SQRT2) / 2;
  tl.to(mine, { x: out, y: out, duration: 0.45, ease: "back.out(2.2)" }, 3.35)
    .to(yours, { autoAlpha: 1, scale: 1, rotation: -6, duration: 0.45, ease: "back.out(2.2)" }, 3.45)
    .to(yours, { autoAlpha: 0, scale: 0.4, rotation: 6, duration: 0.3, ease: "power2.in" }, 5.0)
    .to(mine, { x: 0, y: 0, duration: 0.4, ease: "power2.inOut" }, 5.1);

  // The pie eases back for the next round, like the original ring breathing.
  tl.to(pie, { scale: SMALL, duration: 1.0, ease: "sine.inOut" }, 5.4);

  tl.to({}, { duration: 0.1 }, 6.5);
  return tl;
}

/*
 * Every layer, kept apart: the Definica tile works a "show each layer separately" switch. Switched
 * off, the layer pills fold in behind it (one blended number); switched on, they spring back out,
 * each in its own colour.
 */

const LAYER_PILLS = [
  { label: "Incentives", left: 176, top: 52, width: 132, height: 40, dot: "#ffcadc" },
  { label: "Staking", left: 166, top: 104, width: 152, height: 46, dot: "#ff5a4d" },
  { label: "Aave supply", left: 166, top: 250, width: 152, height: 46, dot: "#9dc4f5" },
  { label: "Net of fees", left: 176, top: 308, width: 132, height: 40, dot: "#fbe74e" },
];
const TOGGLE = { left: 158, top: 170, width: 176, height: 60 };
/** Knob travel from the off (left) to the on (right) end of the track. */
const KNOB_ON = 114;
const DOT_OFF = "#d1d6d2";

export function LayersMarkup() {
  return (
    <>
      <div className={styles.markTile} data-el="tile" style={{ left: 50, top: 156, width: 88, height: 88 }}>
        <DefinicaMark color="#d1f500" accent={null} />
      </div>
      {LAYER_PILLS.map((pill) => (
        <LayerPill key={pill.label} {...pill} />
      ))}
      {/* Above the pills, so they can fold away behind it. */}
      <div className={styles.togglePill} style={{ ...TOGGLE, zIndex: 2 }}>
        <span className={styles.toggleOn} data-el="toggleOn" />
        <span className={styles.toggleKnob} data-el="knob" />
      </div>
    </>
  );
}

function LayerPill({ label, left, top, width, height, dot }: (typeof LAYER_PILLS)[number]) {
  return (
    <div className={styles.layerPill} data-el="pill" style={{ left, top, width, height, zIndex: 1 }}>
      {label}
      <span className={styles.layerDot} data-el="dot" style={{ background: dot }} />
    </div>
  );
}

export function buildLayers(canvas: HTMLElement) {
  const tile = byEl(canvas, "tile");
  const pills = allEl(canvas, "pill");
  const dots = allEl(canvas, "dot");
  const toggleOn = byEl(canvas, "toggleOn");
  const knob = byEl(canvas, "knob");

  // Start switched on: green track, knob on the right, every layer out in its own colour.
  gsap.set(knob, { x: KNOB_ON });
  gsap.set(toggleOn, { opacity: 1 });
  gsap.set(pills, { y: 0, scale: 1 });
  LAYER_PILLS.forEach((pill, i) => gsap.set(dots[i], { backgroundColor: pill.dot, scale: 1 }));

  const tl = gsap.timeline({ paused: true, repeat: -1 });
  const toggleMiddle = TOGGLE.top + TOGGLE.height / 2;
  const outer = (i: number) => i === 0 || i === LAYER_PILLS.length - 1;
  // The tile presses just before the switch moves: Definica works the switch.
  const press = (at: number) =>
    tl
      .to(tile, { scale: 0.92, duration: 0.15, ease: "power2.in" }, at)
      .to(tile, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" }, at + 0.15);

  // Off: the knob slides back, the track greys and the layers fold in behind the switch.
  const OFF = 0.9;
  press(OFF - 0.15);
  tl.to(knob, { x: 0, duration: 0.4, ease: "power2.inOut" }, OFF).to(
    toggleOn,
    { opacity: 0, duration: 0.3, ease: "power1.inOut" },
    OFF,
  );
  LAYER_PILLS.forEach((pill, i) => {
    const toMiddle = toggleMiddle - (pill.top + pill.height / 2);
    tl.to(dots[i], { backgroundColor: DOT_OFF, duration: 0.2, ease: "none" }, OFF + 0.05).to(
      pills[i],
      { y: toMiddle, scale: 0.8, duration: 0.45, ease: "power3.in" },
      OFF + 0.1 + (outer(i) ? 0 : 0.05),
    );
  });

  // On: the knob slides over, the track turns green and the layers spring back out, in colour.
  const ON = 2.5;
  press(ON - 0.15);
  tl.to(knob, { x: KNOB_ON, duration: 0.4, ease: "power2.inOut" }, ON).to(
    toggleOn,
    { opacity: 1, duration: 0.3, ease: "power1.inOut" },
    ON + 0.05,
  );
  LAYER_PILLS.forEach((pill, i) => {
    const at = ON + 0.15 + (outer(i) ? 0.08 : 0);
    tl.to(pills[i], { y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }, at)
      .to(dots[i], { backgroundColor: pill.dot, duration: 0.2, ease: "none" }, at + 0.25)
      .to(dots[i], { scale: 1.45, duration: 0.14, ease: "power2.out", yoyo: true, repeat: 1 }, at + 0.25);
  });

  tl.to({}, { duration: 0.1 }, 4.5);
  return tl;
}

/*
 * Know which contract holds it: layer cards turn over to the contract that holds each layer, then
 * back. Pairs follow the brief: DefinicaCore holds the aggregate Vault shares and the share locks;
 * the Staking Vault holds the pooled ETH and funds the validators; Aave V3 holds supplied osETH; the
 * planned Main Liquidity Module holds aEthosETH locks. The small Definica tile turns to its Treasury.
 */

type CardGlyph = GlyphName | "mark";
interface CardFace {
  glyph: CardGlyph;
  color: string;
}

const CONTRACT_CARDS: { left: number; top: number; size: [number, number]; front: CardFace; back: CardFace }[] = [
  { left: 84, top: 98, size: [108, 108], front: { glyph: "vault-shares", color: "#fbe74e" }, back: { glyph: "definica-core", color: "#d1f500" } },
  { left: 46, top: 196, size: [100, 90], front: { glyph: "share-locks", color: "#9dc4f5" }, back: { glyph: "definica-core", color: "#d1f500" } },
  { left: 196, top: 44, size: [128, 128], front: { glyph: "validators", color: "#05c92f" }, back: { glyph: "stakewise-vault", color: "#ffcadc" } },
  { left: 300, top: 150, size: [62, 62], front: { glyph: "mark", color: "#395c3d" }, back: { glyph: "treasury", color: "#fbe74e" } },
  { left: 118, top: 226, size: [108, 88], front: { glyph: "ethereum", color: "#ffffff" }, back: { glyph: "stakewise-vault", color: "#ffcadc" } },
  { left: 256, top: 204, size: [92, 78], front: { glyph: "aethoseth", color: "#e2f2e5" }, back: { glyph: "liquidity-module", color: "#ff5a4d" } },
  { left: 222, top: 270, size: [80, 80], front: { glyph: "oseth", color: "#ffcadc" }, back: { glyph: "aave-v3", color: "#9dc4f5" } },
];

function CardGlyphArt({ glyph }: { glyph: CardGlyph }) {
  if (glyph === "mark") return <DefinicaMark color="#d1f500" accent={null} />;
  // eslint-disable-next-line @next/next/no-img-element -- tiny decorative svg
  return <img src={glyphSrc(glyph)} alt="" draggable={false} />;
}

export function ContractsMarkup() {
  return (
    <>
      {CONTRACT_CARDS.map(({ left, top, size: [width, height], front, back }, i) => (
        <div key={i} className={styles.contractCard} data-el="card" style={{ left, top, width, height, background: front.color }}>
          <span className={styles.cardFace} data-el="front">
            <CardGlyphArt glyph={front.glyph} />
          </span>
          <span className={styles.cardFace} data-el="back" style={{ visibility: "hidden" }}>
            <CardGlyphArt glyph={back.glyph} />
          </span>
        </div>
      ))}
    </>
  );
}

export function buildContracts(canvas: HTMLElement) {
  const cards = allEl(canvas, "card");
  const fronts = allEl(canvas, "front");
  const backs = allEl(canvas, "back");
  const LOOP = 5;

  CONTRACT_CARDS.forEach(({ front }, i) => {
    gsap.set(cards[i], { backgroundColor: front.color, scaleX: 1 });
    gsap.set(fronts[i], { autoAlpha: 1 });
    gsap.set(backs[i], { autoAlpha: 0 });
  });

  const tl = gsap.timeline({ paused: true, repeat: -1 });

  // Gentle float, each card on its own phase; back at rest by the end of the loop.
  cards.forEach((card, i) => {
    const offset = (i * 0.13) % 0.5;
    tl.fromTo(card, { y: 0 }, { y: i % 2 ? 5 : -5, duration: (LOOP - 0.5) / 2, ease: "sine.inOut", yoyo: true, repeat: 1 }, offset);
  });

  // Each card turns over and shows its other face (and colour) at the halfway point.
  const flip = (index: number, at: number, toBack: boolean) => {
    const { front, back } = CONTRACT_CARDS[index];
    const mid = at + 0.26;
    tl.to(cards[index], { scaleX: 0.04, duration: 0.26, ease: "power1.in" }, at)
      .set(toBack ? fronts[index] : backs[index], { autoAlpha: 0 }, mid)
      .set(toBack ? backs[index] : fronts[index], { autoAlpha: 1 }, mid)
      .set(cards[index], { backgroundColor: toBack ? back.color : front.color }, mid)
      .to(cards[index], { scaleX: 1, duration: 0.38, ease: "back.out(1.6)" }, mid);
  };
  // A wave turns every layer over to its contract, a second wave turns them back.
  const order = [2, 0, 3, 5, 1, 4, 6];
  order.forEach((index, k) => flip(index, 0.7 + k * 0.07, true));
  order.forEach((index, k) => flip(index, 2.95 + k * 0.07, false));

  tl.to({}, { duration: 0.1 }, LOOP - 0.1);
  return tl;
}
