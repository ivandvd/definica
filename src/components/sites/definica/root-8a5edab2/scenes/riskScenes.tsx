import { gsap } from "../../shared/gsap";
import { DEFINICA_TRIANGLE, DefinicaMark, EthDiamond, PercentIcon, TargetIcon } from "../phone/kit";
import { allEl, byEl, centerIn, countSteps, countUp } from "../phone/motion";
import { RingPops, Station, Tag, absorb, flash, popIn, popOut, release } from "./motionKit";
import styles from "./scenes.module.css";

/* Scenes for the "Risks, stated up front" cards (400 x 375 canvases, 16:15 like the videos). */

const INK = "#001405";

/*
 * Staking & validator: rewards depend on validator performance. Three validators pay ETH rewards
 * into the Rewards tray (each coin comes out from under its validator). One is penalised: it turns
 * red, its heartbeat flattens and a reward goes back up into it. It recovers and pays again, and the
 * tray's rewards slide on into the Vault, which takes each one in.
 */

/** Tile colours chosen to stand out on the card's lemonade background. */
const VALIDATORS = [
  { left: 28, color: "#e2f2e5" },
  { left: 148, color: "#9dc4f5" },
  { left: 268, color: "#ffffff" },
];
const PENALISED = 1;
const TILE = { top: 30, width: 104, height: 96 };
/** The tray runs under the Vault tile at its right end, so rewards slide straight into the Vault. */
const TRAY = { left: 30, top: 246, width: 304, height: 66 };
const VAULT = { x: 334, size: 74 };
const slotX = (slot: number) => TRAY.left + 44 + slot * 58;
const SLOT_Y = TRAY.top + TRAY.height / 2;
const tileX = (i: number) => VALIDATORS[i].left + TILE.width / 2;
const TILE_Y = TILE.top + TILE.height / 2;
/** Each reward: the validator paying it, the tray slot it lands in, and when it drops. */
const REWARDS = [
  { from: 0, slot: 0, at: 0.3 },
  { from: 2, slot: 1, at: 0.85 },
  { from: 0, slot: 1, at: 2.75 },
  { from: 2, slot: 2, at: 3.25 },
  { from: 1, slot: 3, at: 4.3 },
];
/** The reward the penalty takes back (the one in slot 1). */
const CLAWED = 1;
const PENALTY_AT = 1.6;
const RECOVER_AT = 3.75;
const MINI_COIN = 40;
const BEAT = "M0 10H22L27 2L33 18L39 5L43 10H80";
const LIGHT_ON = "#d1f500";

const ServerGlyph = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 56 46" aria-hidden="true">
    {[2, 17, 32].map((y) => (
      <g key={y}>
        <rect x="1.5" y={y} width="53" height="12" rx="4" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
        <circle cx="10" cy={y + 6} r="2.4" fill={INK} />
        <path d={`M18 ${y + 6}h10`} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

/** A validator's status light: the Definica triangle, lime while the validator is healthy. */
const StatusLight = ({ className }: { className: string }) => (
  <svg className={className} viewBox="2.9 4.4 12.2 9.6" aria-hidden="true">
    <path data-el="dotShape" d={DEFINICA_TRIANGLE} fill={LIGHT_ON} stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />
  </svg>
);

export function ValidatorsMarkup() {
  return (
    <>
      {VALIDATORS.map(({ left, color }, i) => (
        <div
          key={i}
          className={styles.valTile}
          data-el="node"
          style={{ left, top: TILE.top, width: TILE.width, height: TILE.height, background: color, zIndex: 3 }}
        >
          <ServerGlyph className={styles.valServer} />
          <StatusLight className={styles.valLight} />
          <svg className={styles.valBeat} viewBox="0 0 80 20" aria-hidden="true">
            <path data-el="beat" d={BEAT} fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ))}
      <div className={styles.capLabel} style={{ left: TRAY.left + 4, top: TRAY.top + TRAY.height + 12 }}>
        <EthDiamond className={styles.capLabelIcon} color={INK} />
        REWARDS
      </div>
      <div
        className={styles.rewardTray}
        data-el="tray"
        style={{ left: TRAY.left, top: TRAY.top, width: TRAY.width, height: TRAY.height }}
      />
      {/* Little landing pops, one per tray slot. */}
      {[0, 1, 2, 3].map((slot) => (
        <svg
          key={slot}
          className={styles.abs}
          data-el="landPops"
          viewBox="-30 -10 60 20"
          style={{ left: slotX(slot) - 30, top: SLOT_Y + 14, width: 60, height: 20, overflow: "visible", zIndex: 4 }}
          aria-hidden="true"
        >
          <path d="M-22 2l-7 4M-24 -4h-7M22 2l7 4M24 -4h7" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ))}
      {REWARDS.map((_, i) => (
        <div
          key={i}
          className={`${styles.ethCoin} ${styles.miniCoin}`}
          data-el="reward"
          style={{ left: -MINI_COIN / 2, top: -MINI_COIN / 2, width: MINI_COIN, height: MINI_COIN, zIndex: 2 }}
        >
          <span className={styles.coinEdge} />
          <span className={styles.coinFace}>
            <span className={styles.coinRim} />
            <EthDiamond color={INK} />
          </span>
        </div>
      ))}
      <Station el="vault" x={VAULT.x} y={SLOT_Y} size={VAULT.size} color="#ffcadc" glyph="stakewise-vault" label="Vault" labelSide="above" />
      <div className={styles.stickerPill} data-el="penalty" style={{ left: 148, top: 110, background: "#ff5a4d", color: INK, zIndex: 5 }}>
        PENALTY
      </div>
    </>
  );
}

export function buildValidators(canvas: HTMLElement) {
  const nodes = allEl(canvas, "node");
  const lights = Array.from(canvas.querySelectorAll<SVGPathElement>('[data-el="dotShape"]'));
  const beats = Array.from(canvas.querySelectorAll<SVGPathElement>('[data-el="beat"]'));
  const coins = allEl(canvas, "reward");
  const tray = byEl(canvas, "tray");
  const penalty = byEl(canvas, "penalty");
  const landPops = allEl(canvas, "landPops");
  const vault = byEl(canvas, "vault");
  const vaultPops = byEl(canvas, "vaultPops");
  const node = nodes[PENALISED];
  const LOOP = 6.7;

  gsap.set(penalty, { autoAlpha: 0, scale: 0.3, rotation: -24 });
  // Each coin waits hidden under the validator that pays it.
  REWARDS.forEach(({ from }, i) => gsap.set(coins[i], { x: tileX(from), y: TILE_Y, scale: 0.8, autoAlpha: 1, "--fill": "#9dc4f5", "--edge": "#6f9ed8" }));
  gsap.set([...landPops, vaultPops], { autoAlpha: 0 });
  gsap.set(tray, { transformOrigin: "50% 100%" });
  const beatLength = beats[0]?.getTotalLength() ?? 90;
  gsap.set(beats, { strokeDasharray: beatLength, strokeDashoffset: 0 });

  const tl = gsap.timeline({ paused: true, repeat: -1 });

  // Every validator is working: its heartbeat redraws.
  beats.forEach((beat, i) => {
    for (let k = 0; k < 3; k++) {
      const at = 0.1 + i * 0.22 + k * 1.8;
      tl.fromTo(beat, { strokeDashoffset: beatLength }, { strokeDashoffset: 0, duration: 0.7, ease: "power1.inOut", immediateRender: false }, at);
    }
  });

  // Rewards: the validator pushes an ETH coin out from under it, and it drops into the tray.
  REWARDS.forEach(({ from, slot, at }, i) => {
    const coin = coins[i];
    // It drops straight out of the tile's bottom edge, then curves over to its slot.
    const below = TILE.top + TILE.height + MINI_COIN / 2 + 4;
    release(tl, nodes[from], at, [0, 1]);
    tl.set(coin, { x: tileX(from), y: TILE_Y, scale: 0.8, autoAlpha: 1 }, at)
      .to(coin, { keyframes: [{ y: below, duration: 0.22, ease: "power1.in" }, { y: SLOT_Y, duration: 0.38, ease: "power1.in" }] }, at)
      .to(coin, { x: slotX(slot), duration: 0.4, ease: "power1.inOut" }, at + 0.2)
      .to(coin, { scale: 1, duration: 0.25, ease: "back.out(2.5)" }, at + 0.14)
      .to(coin, { scaleX: 1.15, scaleY: 0.85, duration: 0.07, ease: "power1.out", yoyo: true, repeat: 1 }, at + 0.6)
      .to(tray, { scaleY: 0.94, duration: 0.08, ease: "power1.out", yoyo: true, repeat: 1 }, at + 0.6);
    flash(tl, landPops[slot], at + 0.6);
  });

  // The penalty: the validator shakes and turns red, its heartbeat flattens, the sticker lands and a
  // reward is taken back out of the tray.
  tl.to(node, { x: -4, duration: 0.05, yoyo: true, repeat: 7, ease: "none" }, PENALTY_AT)
    .to(node, { backgroundColor: "#ff5a4d", duration: 0.25, ease: "power1.inOut" }, PENALTY_AT)
    .to(lights[PENALISED], { fill: "#ffffff", duration: 0.2 }, PENALTY_AT)
    .to(beats[PENALISED], { scaleY: 0.12, transformOrigin: "50% 50%", duration: 0.3, ease: "power2.inOut" }, PENALTY_AT + 0.05)
    .to(penalty, { autoAlpha: 1, scale: 1, rotation: -9, duration: 0.45, ease: "back.out(2.2)" }, PENALTY_AT + 0.15)
    .to(coins[CLAWED], { "--fill": "#ff5a4d", "--edge": "#d63b2f", duration: 0.2 }, PENALTY_AT + 0.45)
    .to(coins[CLAWED], { x: "+=3", duration: 0.05, ease: "none", yoyo: true, repeat: 5 }, PENALTY_AT + 0.45)
    // ...and the coin goes back up into the penalised validator, which takes it in.
    .to(coins[CLAWED], { x: tileX(PENALISED), duration: 0.5, ease: "power1.inOut" }, PENALTY_AT + 0.8)
    .to(coins[CLAWED], { y: TILE_Y, duration: 0.55, ease: "power2.in" }, PENALTY_AT + 0.75)
    .to(coins[CLAWED], { scale: 0.84, duration: 0.15, ease: "power1.in" }, PENALTY_AT + 1.15);
  absorb(tl, node, PENALTY_AT + 1.27, [0, -1]);

  // ...and it recovers.
  tl.to(penalty, { autoAlpha: 0, scale: 0.4, rotation: 6, duration: 0.3, ease: "power2.in" }, RECOVER_AT)
    .to(node, { backgroundColor: VALIDATORS[PENALISED].color, duration: 0.35, ease: "power1.inOut" }, RECOVER_AT)
    .to(lights[PENALISED], { fill: LIGHT_ON, duration: 0.25 }, RECOVER_AT + 0.05)
    .to(beats[PENALISED], { scaleY: 1, duration: 0.35, ease: "back.out(2)" }, RECOVER_AT + 0.05);

  // The tray's rewards slide on into the Vault, which takes each one in; the tray is ready for the
  // next round.
  const SWEEP = 5.05;
  const SPEED = 270;
  REWARDS.forEach(({ slot }, i) => {
    if (i === CLAWED) return;
    const coin = coins[i];
    const startX = slotX(slot);
    const toEdge = VAULT.x - VAULT.size / 2 - MINI_COIN / 2;
    const inside = SWEEP + (VAULT.x - VAULT.size / 2 + MINI_COIN / 2 - startX) / SPEED;
    tl.to(coin, { x: VAULT.x, duration: (VAULT.x - startX) / SPEED, ease: "none" }, SWEEP)
      .to(coin, { scale: 0.84, duration: 0.15, ease: "power1.in" }, SWEEP + (toEdge - startX) / SPEED);
    absorb(tl, vault, inside - 0.03, [1, 0], vaultPops);
  });

  tl.to({}, { duration: 0.1 }, LOOP - 0.1);
  return tl;
}

/*
 * Smart contract risk: verify every address Definica publishes. A magnifier checks the address in use
 * against the published one, character by character: first a match, then a lookalike with one
 * character changed, which is caught. The address is a stylised placeholder, shortened with "…".
 */

const ADDRESS = "0xDEF1CA…C0DE";
const LOOKALIKE = "0xDEF1CB…C0DE";
const DIFF = Array.from(ADDRESS).findIndex((char, i) => char !== Array.from(LOOKALIKE)[i]);
const ADDR_CARD = { left: 34, width: 332, height: 104 };
const PUBLISHED_TOP = 44;
const IN_USE_TOP = 202;
/** Where the magnifier's lens centre sits inside its 56 x 56 box. */
const LENS = { x: 22, y: 22 };

const DocGlyph = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <path d="M12 5h17l9 9v29H12Z" fill="#ffffff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    <path d="M29 5v9h9" fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    <path d="M18 24h14M18 31h14M18 38h8" stroke={INK} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const AddressChars = ({ text, name }: { text: string; name: string }) => (
  <>
    {Array.from(text).map((char, i) => (
      <span key={i} className={styles.addrChar} data-el={name}>
        {char}
      </span>
    ))}
  </>
);

export function ContractMarkup() {
  return (
    <>
      <div className={styles.boldCard} style={{ left: ADDR_CARD.left, top: PUBLISHED_TOP, width: ADDR_CARD.width, height: ADDR_CARD.height }}>
        <div className={styles.markTile} style={{ left: 18, top: 28, width: 48, height: 48, borderRadius: 14 }}>
          <DefinicaMark color="#d1f500" accent={null} />
        </div>
        <div className={styles.addrLabel}>PUBLISHED BY DEFINICA</div>
        {/* Same per-character spacing as the address in use, so the two line up. */}
        <div className={styles.addrText}>
          <AddressChars text={ADDRESS} name="charPublished" />
        </div>
      </div>
      {/* Between the two: "?" while checking, a tick on a match, a cross on a mismatch. */}
      <div className={styles.addrLink} style={{ left: 183, top: 158 }}>
        <span data-el="linkAsk">?</span>
        <span data-el="linkSame" style={{ background: "#d1f500" }}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3.5 8.5 6.8 11.6 12.6 4.6" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span data-el="linkDiff" style={{ background: "#ff5a4d" }}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        </span>
      </div>
      <div className={styles.boldCard} data-el="inUse" style={{ left: ADDR_CARD.left, top: IN_USE_TOP, width: ADDR_CARD.width, height: ADDR_CARD.height }}>
        <div className={styles.bigTile} style={{ left: 18, top: 28, width: 48, height: 48, borderRadius: 14, background: "#05c92f" }}>
          <DocGlyph />
        </div>
        <div className={styles.addrLabel}>ADDRESS IN USE</div>
        <div className={styles.addrText} data-el="rowSame">
          <AddressChars text={ADDRESS} name="charSame" />
        </div>
        <div className={styles.addrText} data-el="rowDiff" style={{ visibility: "hidden" }}>
          <AddressChars text={LOOKALIKE} name="charDiff" />
        </div>
      </div>
      <svg className={styles.magnifier} data-el="glass" viewBox="0 0 56 56" aria-hidden="true">
        <path d="M33 33l15 15" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        <circle cx={LENS.x} cy={LENS.y} r="15" fill="rgba(255,255,255,0.35)" stroke={INK} strokeWidth="3.5" />
        <path d="M13.5 19.5a9 9 0 0 1 6-6" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <div className={styles.stickerPill} data-el="match" style={{ left: 254, top: 182, background: "#d1f500", color: INK, zIndex: 5 }}>
        MATCH
      </div>
      <div className={styles.stickerPill} data-el="mismatch" style={{ left: 226, top: 182, background: "#ff5a4d", color: INK, zIndex: 5 }}>
        MISMATCH
      </div>
    </>
  );
}

export function buildContract(canvas: HTMLElement) {
  const inUse = byEl(canvas, "inUse");
  const rowSame = byEl(canvas, "rowSame");
  const rowDiff = byEl(canvas, "rowDiff");
  const same = allEl(canvas, "charSame");
  const diff = allEl(canvas, "charDiff");
  const glass = byEl(canvas, "glass");
  const ask = byEl(canvas, "linkAsk");
  const linkSame = byEl(canvas, "linkSame");
  const linkDiff = byEl(canvas, "linkDiff");
  const match = byEl(canvas, "match");
  const mismatch = byEl(canvas, "mismatch");
  const LOOP = 6.9;

  // Lens positions over each character, from layout offsets (unaffected by transforms).
  const lensAt = (char: HTMLElement) => {
    const { x, y } = centerIn(char, canvas);
    return { x: x - LENS.x, y: y - LENS.y };
  };

  gsap.set([...same, ...diff], { backgroundColor: "rgba(209, 245, 0, 0)" });
  gsap.set(rowSame, { autoAlpha: 1 });
  gsap.set(rowDiff, { autoAlpha: 0 });
  gsap.set(glass, { ...lensAt(same[0]), autoAlpha: 0, scale: 0.8 });
  gsap.set([linkSame, linkDiff], { autoAlpha: 0, scale: 0.5 });
  gsap.set(ask, { autoAlpha: 1, scale: 1 });
  gsap.set([match, mismatch], { autoAlpha: 0, scale: 0.3, rotation: -20 });

  const tl = gsap.timeline({ paused: true, repeat: -1 });
  const STEP = 0.085;
  /** The lens reads `chars` up to (and including) `last`, lighting each one as it passes. */
  const read = (chars: HTMLElement[], from: number, last: number) => {
    chars.slice(0, last + 1).forEach((char, i) => {
      const at = from + i * STEP;
      tl.to(glass, { ...lensAt(char), duration: STEP, ease: "none" }, at).to(
        char,
        { backgroundColor: "#d1f500", duration: 0.06 },
        at + STEP * 0.6,
      );
    });
    return from + (last + 1) * STEP;
  };
  const swapLink = (show: HTMLElement, hide: HTMLElement, at: number) =>
    tl.to(hide, { autoAlpha: 0, scale: 0.5, duration: 0.15, ease: "power2.in" }, at).to(
      show,
      { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2.4)" },
      at + 0.12,
    );

  // Round 1: the address in use matches the published one.
  tl.to(glass, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, 0.2);
  const doneSame = read(same, 0.45, same.length - 1);
  swapLink(linkSame, ask, doneSame + 0.05);
  tl.to(match, { autoAlpha: 1, scale: 1, rotation: -6, duration: 0.45, ease: "back.out(2.2)" }, doneSame + 0.1)
    .to(same, { backgroundColor: "rgba(209, 245, 0, 0)", duration: 0.3 }, 2.95)
    .to(match, { autoAlpha: 0, scale: 0.4, rotation: 6, duration: 0.3, ease: "power2.in" }, 2.95);
  swapLink(ask, linkSame, 2.95);
  tl.to(glass, { ...lensAt(same[0]), duration: 0.45, ease: "power2.inOut" }, 3.0);

  // Round 2: a lookalike with one character changed. The lens stops on it.
  tl.to(rowSame, { autoAlpha: 0, duration: 0.15 }, 3.3)
    .to(rowDiff, { autoAlpha: 1, duration: 0.15 }, 3.38)
    .to(inUse, { scale: 0.97, duration: 0.1, ease: "power1.out", yoyo: true, repeat: 1 }, 3.3);
  const doneDiff = read(diff, 3.6, DIFF);
  tl.to(diff[DIFF], { backgroundColor: "#ff5a4d", duration: 0.12 }, doneDiff)
    .to(glass, { x: `+=4`, duration: 0.05, yoyo: true, repeat: 5, ease: "none" }, doneDiff + 0.05)
    .to(inUse, { x: -5, duration: 0.05, yoyo: true, repeat: 7, ease: "none" }, doneDiff + 0.2)
    .to(mismatch, { autoAlpha: 1, scale: 1, rotation: -6, duration: 0.45, ease: "back.out(2.2)" }, doneDiff + 0.25);
  swapLink(linkDiff, ask, doneDiff + 0.2);

  // Reset for the next round.
  const RESET = 5.75;
  tl.to(diff, { backgroundColor: "rgba(209, 245, 0, 0)", duration: 0.25 }, RESET)
    .to(mismatch, { autoAlpha: 0, scale: 0.4, rotation: 6, duration: 0.3, ease: "power2.in" }, RESET)
    .to(rowDiff, { autoAlpha: 0, duration: 0.15 }, RESET + 0.2)
    .to(rowSame, { autoAlpha: 1, duration: 0.15 }, RESET + 0.28)
    .to(glass, { autoAlpha: 0, scale: 0.8, duration: 0.25, ease: "power1.in" }, RESET + 0.15)
    .set(glass, lensAt(same[0]), RESET + 0.45);
  swapLink(ask, linkDiff, RESET);

  tl.to({}, { duration: 0.1 }, LOOP - 0.1);
  return tl;
}

/*
 * Market & liquidity: a chunky card where the osETH rate line rolls on, the Aave supply and exit
 * liquidity bars move, and a "RATES MOVE" sticker lands.
 */

// Three identical 140px periods: wider than the window plus the one period it scrolls by,
// so the line never runs out and the loop has no jump.
const RATE_WAVE =
  "M0 30 C12 30 22 16 40 16 S62 40 80 40 S98 22 112 22 S128 30 140 30 " +
  "S162 16 180 16 S202 40 220 40 S238 22 252 22 S268 30 280 30 " +
  "S302 16 320 16 S342 40 360 40 S378 22 392 22 S408 30 420 30";

export function MarketMarkup() {
  return (
    <>
      <div className={styles.boldCard} style={{ left: 38, top: 58, width: 324, height: 258 }}>
        <div className={styles.boldRow} style={{ top: 20 }}>
          osETH / ETH
          <span data-el="rate">1.0412</span>
        </div>
        <div className={styles.abs} style={{ left: 22, right: 22, top: 50, height: 60, overflow: "hidden" }}>
          <svg data-el="wave" viewBox="0 0 420 60" style={{ position: "absolute", left: 0, top: 0, width: 420, height: 60 }} aria-hidden="true">
            <path d={RATE_WAVE} fill="none" stroke="#2a5cd3" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <div className={styles.boldRow} style={{ top: 124 }}>
          Aave supply
          <span>
            <span data-el="utilisation">42</span>%
          </span>
        </div>
        <div className={styles.boldBar} style={{ top: 150 }}>
          <span className={styles.boldFill} data-el="bar" style={{ background: "#9dc4f5" }} />
        </div>
        <div className={styles.boldRow} style={{ top: 186 }}>
          Exit liquidity
        </div>
        <div className={styles.boldBar} style={{ top: 212 }}>
          <span className={styles.boldFill} data-el="liquidity" style={{ background: "#05c92f" }} />
        </div>
      </div>
      <div className={styles.stickerPill} data-el="sticker" style={{ left: 244, top: 36, background: "#fbe74e", color: INK, zIndex: 5 }}>
        RATES MOVE
      </div>
    </>
  );
}

export function buildMarket(canvas: HTMLElement) {
  const wave = byEl(canvas, "wave");
  const rate = byEl(canvas, "rate");
  const utilisation = byEl(canvas, "utilisation");
  const bar = byEl(canvas, "bar");
  const liquidity = byEl(canvas, "liquidity");
  const sticker = byEl(canvas, "sticker");

  // Widths, not scale, so the bars keep their ink edge.
  gsap.set(bar, { width: "42%" });
  gsap.set(liquidity, { width: "70%" });
  gsap.set(sticker, { autoAlpha: 0, scale: 0.3, rotation: 22 });

  const tl = gsap.timeline({ paused: true, repeat: -1 });
  const LOOP = 5.2;

  tl.fromTo(wave, { x: 0 }, { x: -140, duration: LOOP, ease: "none" }, 0);
  countUp(tl, rate, 1.0412, 1.0437, 4, 0.4, 2.0);
  tl.to(bar, { width: "71%", duration: 1.2, ease: "power2.inOut" }, 0.6)
    .to(liquidity, { width: "45%", duration: 1.2, ease: "power2.inOut" }, 0.6)
    .to(bar, { width: "55%", duration: 1.0, ease: "power2.inOut" }, 2.6)
    .to(liquidity, { width: "60%", duration: 1.0, ease: "power2.inOut" }, 2.6)
    .to(bar, { width: "42%", duration: 0.9, ease: "power2.inOut" }, 4.1)
    .to(liquidity, { width: "70%", duration: 0.9, ease: "power2.inOut" }, 4.1);
  countSteps(tl, utilisation, 42, 0, [
    [71, 0.6, 1.2],
    [55, 2.6, 1.0],
    [42, 4.1, 0.9],
  ]);
  tl.to(sticker, { autoAlpha: 1, scale: 1, rotation: 8, duration: 0.45, ease: "back.out(2.2)" }, 1.3).to(
    sticker,
    { autoAlpha: 0, scale: 0.4, rotation: -6, duration: 0.3, ease: "power2.in" },
    4.3,
  );

  return tl;
}

/*
 * Borrowing risk: debt, interest, oracles and liquidation. A position's collateral and debt sit
 * above its health bar. Interest adds to the debt, the oracle reports a lower collateral price,
 * health falls into the red and the position is liquidated: collateral goes to repay debt. No
 * numbers: market parameters are set per market.
 */

const PILE = { collateralX: 108, debtX: 292, baseY: 206, step: 15, coin: 92 };
const COLLATERAL = 3;
const HEALTH = { left: 40, top: 314, width: 320, height: 26 };
/** Health marker positions, as a share of the bar (left = danger). */
const HEALTHY = 0.82;
const AFTER_INTEREST = 0.64;
const AFTER_ORACLE = 0.16;
const AFTER_LIQUIDATION = 0.6;

/** A coin seen from the side, for the piles (92 x 30). */
export const FlatCoin = ({ face, edge }: { face: string; edge: string }) => (
  <svg viewBox="0 0 92 30" aria-hidden="true">
    <path d="M2 12v6c0 6.6 19.7 11 44 11s44-4.4 44-11v-6" fill={edge} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
    <ellipse cx="46" cy="12" rx="44" ry="10" fill={face} stroke={INK} strokeWidth="2.2" />
    <ellipse cx="46" cy="12" rx="31" ry="6" fill="none" stroke={INK} strokeWidth="1.5" />
  </svg>
);

const Pile = ({ x, count, face, edge, name }: { x: number; count: number; face: string; edge: string; name: string }) => (
  <>
    {Array.from({ length: count }, (_, k) => (
      <div
        key={k}
        className={styles.flatCoin}
        data-el={name}
        style={{ left: x - PILE.coin / 2, top: PILE.baseY - k * PILE.step, zIndex: 2 + k }}
      >
        <FlatCoin face={face} edge={edge} />
      </div>
    ))}
  </>
);

export function BorrowRiskMarkup() {
  return (
    <>
      <div className={styles.oracle} style={{ left: 178, top: 40 }}>
        <span className={styles.oraclePing} data-el="ping" />
        <span className={styles.oracleBadge} data-el="oracle">
          <TargetIcon />
        </span>
        <span className={styles.capLabel} style={{ position: "absolute", left: "50%", top: 50, transform: "translateX(-50%)" }}>
          ORACLE
        </span>
      </div>
      <div className={styles.pricePill} data-el="price" style={{ left: 238, top: 47 }}>
        PRICE
        <svg data-el="priceArrow" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className={styles.interestBadge} data-el="interest" style={{ left: 318, top: 128 }}>
        <PercentIcon />
      </span>
      <Pile x={PILE.collateralX} count={COLLATERAL} face="#fbe74e" edge="#d9c22c" name="collateral" />
      <Pile x={PILE.debtX} count={2} face="#9dc4f5" edge="#6f9ed8" name="debt" />
      <div className={styles.pileLabel} style={{ left: PILE.collateralX - 70, top: 246, width: 140 }}>
        Collateral
      </div>
      <div className={styles.pileLabel} style={{ left: PILE.debtX - 70, top: 246, width: 140 }}>
        Debt
      </div>
      <div className={styles.capLabel} style={{ left: HEALTH.left + 2, top: HEALTH.top - 32 }}>
        HEALTH
      </div>
      <div className={styles.healthBar} style={{ left: HEALTH.left, top: HEALTH.top, width: HEALTH.width, height: HEALTH.height }}>
        <span style={{ left: 0, width: "30%", background: "#ff5a4d" }} />
        <span style={{ left: "30%", width: "25%", background: "#fbe74e" }} />
        <span style={{ left: "55%", width: "45%", background: "#05c92f" }} />
      </div>
      <svg className={styles.healthMarker} data-el="marker" viewBox="0 0 22 20" style={{ left: HEALTH.left - 11, top: HEALTH.top - 15 }} aria-hidden="true">
        <path d="M3 3h16l-8 13Z" fill={INK} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <div className={styles.stickerPill} data-el="liquidation" style={{ left: 238, top: 86, background: "#ff5a4d", color: INK, zIndex: 8 }}>
        LIQUIDATION
      </div>
      {/* Where the collateral coin and the debt it repays cancel out, and where a new collateral coin appears. */}
      <RingPops el="repaidPops" x={PILE.debtX} y={PILE.baseY - 2 * PILE.step + 12} r={40} />
      <RingPops el="topUpPops" x={PILE.collateralX} y={PILE.baseY - (COLLATERAL - 1) * PILE.step - 34} r={30} />
      <Tag el="repaid" x={PILE.debtX + 6} y={PILE.baseY - 2 * PILE.step - 34} color="#d1f500">
        REPAID
      </Tag>
    </>
  );
}

export function buildBorrowRisk(canvas: HTMLElement) {
  const collateral = allEl(canvas, "collateral");
  const debt = allEl(canvas, "debt");
  const marker = byEl(canvas, "marker");
  const ping = byEl(canvas, "ping");
  const oracle = byEl(canvas, "oracle");
  const price = byEl(canvas, "price");
  const priceArrow = byEl(canvas, "priceArrow");
  const interest = byEl(canvas, "interest");
  const liquidation = byEl(canvas, "liquidation");
  const repaid = byEl(canvas, "repaid");
  const repaidPops = byEl(canvas, "repaidPops");
  const topUpPops = byEl(canvas, "topUpPops");
  const top = collateral[COLLATERAL - 1];
  const baseDebt = debt[0];
  const addedDebt = debt[1];
  const LOOP = 6.4;
  const at = (share: number) => share * HEALTH.width;
  /** From the added debt coin's place to the middle of the interest badge (it grows out of the badge). */
  const fromBadge = { x: 336 - PILE.debtX, y: 146 - (PILE.baseY - PILE.step + 15) };
  /** From the top collateral coin's place to the top of the debt pile. */
  const toDebt = PILE.debtX - PILE.collateralX;

  gsap.set(marker, { x: at(HEALTHY) });
  gsap.set(collateral, { x: 0, y: 0, rotation: 0, autoAlpha: 1, scale: 1, scaleY: 1 });
  gsap.set(addedDebt, { x: fromBadge.x, y: fromBadge.y, scale: 0, autoAlpha: 1 });
  gsap.set(baseDebt, { scaleY: 1, transformOrigin: "50% 100%" });
  gsap.set(ping, { autoAlpha: 0, scale: 0.6 });
  gsap.set(price, { backgroundColor: "#05c92f" });
  gsap.set(priceArrow, { rotation: 0, transformOrigin: "50% 50%" });
  gsap.set(interest, { autoAlpha: 0, scale: 0.3 });
  gsap.set([liquidation, repaid], { autoAlpha: 0, scale: 0.3, rotation: -24 });
  gsap.set([repaidPops, topUpPops], { autoAlpha: 0 });

  const tl = gsap.timeline({ paused: true, repeat: -1 });

  // Interest: the badge drops a coin onto the debt, and health slips.
  tl.to(interest, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2.4)" }, 0.45)
    .to(interest, { scale: 0.85, duration: 0.1, ease: "power2.in" }, 0.62)
    .to(interest, { scale: 1, duration: 0.3, ease: "back.out(3)" }, 0.72)
    .to(addedDebt, { scale: 1, duration: 0.3, ease: "back.out(2)" }, 0.72)
    .to(addedDebt, { x: 0, duration: 0.45, ease: "power1.inOut" }, 0.78)
    .to(addedDebt, { y: 0, duration: 0.45, ease: "power2.in" }, 0.78)
    .to(addedDebt, { scaleY: 0.8, transformOrigin: "50% 100%", duration: 0.07, ease: "power1.out", yoyo: true, repeat: 1 }, 1.23)
    .to(baseDebt, { scaleY: 0.9, duration: 0.07, ease: "power1.out", yoyo: true, repeat: 1 }, 1.23)
    .to(marker, { x: at(AFTER_INTEREST), duration: 0.6, ease: "power2.inOut" }, 1.0)
    .to(interest, { autoAlpha: 0, scale: 0.4, duration: 0.25, ease: "power2.in" }, 1.45);

  // The oracle reports a lower collateral price: the pile sags and health falls into the red.
  tl.set(ping, { autoAlpha: 0.9, scale: 0.6 }, 1.75)
    .to(ping, { autoAlpha: 0, scale: 1.9, duration: 0.6, ease: "power2.out" }, 1.75)
    .to(oracle, { scale: 1.12, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1 }, 1.75)
    .to(price, { backgroundColor: "#ff5a4d", duration: 0.2 }, 2.0)
    .to(priceArrow, { rotation: 180, duration: 0.35, ease: "back.out(2)" }, 2.0)
    .to(collateral, { scaleY: 0.82, transformOrigin: "50% 100%", duration: 0.35, ease: "power2.inOut", stagger: 0.04 }, 2.05)
    .to(marker, { x: at(AFTER_ORACLE), duration: 0.7, ease: "power2.in" }, 2.1);

  // Liquidation: a collateral coin hops onto the debt and repays it (the two cancel out), and health
  // recovers.
  tl.to(marker, { x: `+=3`, duration: 0.05, yoyo: true, repeat: 5, ease: "none" }, 2.8)
    .to(liquidation, { autoAlpha: 1, scale: 1, rotation: -8, duration: 0.45, ease: "back.out(2.2)" }, 2.85)
    .to(top, { x: toDebt, duration: 0.55, ease: "power1.inOut" }, 3.15)
    .to(top, { keyframes: [{ y: -38, duration: 0.27, ease: "power2.out" }, { y: 0, duration: 0.28, ease: "power2.in" }] }, 3.15)
    .to([top, addedDebt], { scaleY: 0.7, transformOrigin: "50% 100%", duration: 0.08, ease: "power2.out" }, 3.7)
    .to([top, addedDebt], { scale: 0, duration: 0.24, ease: "back.in(2)" }, 3.82);
  flash(tl, repaidPops, 3.9);
  popIn(tl, repaid, 3.9, -6);
  tl.to(marker, { x: at(AFTER_LIQUIDATION), duration: 0.55, ease: "back.out(1.6)" }, 3.95)
    .to(liquidation, { autoAlpha: 0, scale: 0.4, rotation: 6, duration: 0.3, ease: "power2.in" }, 4.4);
  popOut(tl, repaid, 4.45);

  // Reset for the next round: prices recover and fresh collateral tops the pile back up.
  tl.to(price, { backgroundColor: "#05c92f", duration: 0.25 }, 4.8)
    .to(priceArrow, { rotation: 0, duration: 0.35, ease: "back.out(2)" }, 4.8)
    .to(collateral.slice(0, COLLATERAL - 1), { scaleY: 1, duration: 0.35, ease: "back.out(2)" }, 4.85)
    .set(top, { x: 0, y: -34, rotation: 0, scale: 0 }, 5.0)
    .to(top, { scale: 1, duration: 0.35, ease: "back.out(2.6)" }, 5.0)
    .to(top, { y: 0, duration: 0.3, ease: "power2.in" }, 5.4)
    .to(top, { scaleY: 0.8, transformOrigin: "50% 100%", duration: 0.07, ease: "power1.out", yoyo: true, repeat: 1 }, 5.7)
    .set(addedDebt, { x: fromBadge.x, y: fromBadge.y, scale: 0 }, 5.0)
    .to(marker, { x: at(HEALTHY), duration: 0.6, ease: "power2.inOut" }, 5.1);
  flash(tl, topUpPops, 5.02);

  tl.to({}, { duration: 0.1 }, LOOP - 0.1);
  return tl;
}
