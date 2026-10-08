import { gsap } from "../../shared/gsap";
import { DefinicaCursor, DefinicaMark, glyphSrc } from "../phone/kit";
import { allEl, byEl } from "../phone/motion";
import styles from "./scenes.module.css";

/* Scenes for the "Stake, lock, borrow." phase cards (480 x 270 canvases, shown 16:9 like the videos). */

const INK = "#001405";

/* ---------- Phase 1: the mark is clicked and Phase 1's components fill the card ---------- */

const PHASE1_PILLS: [string, string][] = [
  ["Definica Core", "#d1f500"],
  ["StakeWise Vault", "#ffcadc"],
  ["Validators", "#05c92f"],
  ["Vault shares", "#fbe74e"],
  ["Share locks", "#9dc4f5"],
  ["Exit queue", "#ff5a4d"],
  ["Keeper", "#2a5cd3"],
  ["Treasury", "#fbe74e"],
  ["Ethereum", "#9dc4f5"],
  ["Non-custodial", "#e2f2e5"],
  ["Net of fees", "#ffcadc"],
  ["Proportional", "#05c92f"],
  ["Deposits", "#ff5a4d"],
  ["Withdrawals", "#9dc4f5"],
  ["Rewards", "#d1f500"],
  ["Operator", "#395c3d"],
  ["Exits", "#fbe74e"],
  ["osETH", "#e2f2e5"],
];
const COLUMNS = [92, 240, 388];
const ROW_TOP = 40;
const ROW_GAP = 42;
/** Middle of the mark tile, where the chips burst out of and gather back into. */
const TILE_CENTER = { x: 240, y: 135 };

/** Where the pointer's tip starts, and how far it travels to click the mark (just below its centre). */
const POINTER_FROM = { left: 300, top: 206 };
const POINTER_TRAVEL = { x: -46, y: -58 };

/** The Definica pointer (the mark's triangle as an arrow); the element is an anchor at its tip. */
const Pointer = () => (
  <div className={styles.pointer} data-el="pointer" style={POINTER_FROM}>
    <DefinicaCursor className={styles.pointerArrow} />
  </div>
);

export function Phase1Markup() {
  return (
    <>
      <div className={styles.abs} data-el="list" style={{ left: 0, top: 0, width: 480, height: 400 }}>
        {PHASE1_PILLS.map(([label, color], i) => (
          <div
            key={label}
            className={styles.chainPill}
            data-el="chip"
            style={{ left: COLUMNS[i % 3], top: ROW_TOP + Math.floor(i / 3) * ROW_GAP }}
          >
            <span className={styles.chainDot} style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>
      <div className={styles.markTile} data-el="tile" style={{ left: 194, top: 89, width: 92, height: 92 }}>
        <DefinicaMark color="#d1f500" accent={null} />
      </div>
      <Pointer />
    </>
  );
}

export function buildPhase1(canvas: HTMLElement) {
  const list = byEl(canvas, "list");
  const chips = allEl(canvas, "chip");
  const tile = byEl(canvas, "tile");
  const pointer = byEl(canvas, "pointer");
  const firstRows = chips.slice(0, 12);
  const laterRows = chips.slice(12);
  const LIST_SHIFT = ROW_GAP * 2;
  /** Offset from a chip's place to the middle of the mark tile (with the list scrolled up by `shift`). */
  const toTile = (i: number, shift = 0) => ({
    x: TILE_CENTER.x - COLUMNS[i % 3],
    y: TILE_CENTER.y - (ROW_TOP + Math.floor(i / 3) * ROW_GAP + 13.5) + shift,
  });

  gsap.set(chips, { xPercent: -50, x: 0, y: 0, autoAlpha: 0, scale: 0.4 });
  gsap.set(tile, { scale: 1 });

  const tl = gsap.timeline({ paused: true, repeat: -1 });

  // Click on the mark.
  tl.to(pointer, { ...POINTER_TRAVEL, duration: 0.45, ease: "power2.inOut" }, 0.35)
    .to(pointer, { scale: 0.82, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1 }, 0.85)
    .to(tile, { scale: 0.92, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1 }, 0.85)
    .to(pointer, { scale: 0.8, autoAlpha: 0, duration: 0.3, ease: "power1.in" }, 1.1);

  // The mark opens up: Phase 1's parts burst out of it and fill the card...
  firstRows.forEach((chip, i) => {
    const from = toTile(i);
    const at = 1.05 + i * 0.03;
    tl.set(chip, { x: from.x, y: from.y, scale: 0.3, autoAlpha: 1 }, at).to(chip, { x: 0, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.5)" }, at);
  });
  tl.to(tile, { scale: 0, duration: 0.35, ease: "back.in(2)" }, 1.2);

  // ...then the list scrolls on.
  tl.to(list, { y: -LIST_SHIFT, duration: 0.8, ease: "power2.inOut" }, 2.9).to(
    laterRows,
    { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.05 },
    3.05,
  );

  // The parts gather back into the mark for the next round.
  chips.forEach((chip, i) => {
    const to = toTile(i, LIST_SHIFT);
    tl.to(chip, { x: to.x, y: to.y, scale: 0.3, duration: 0.42, ease: "power2.in" }, 4.7 + i * 0.015);
  });
  tl.to(tile, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }, 4.95)
    .set(chips, { autoAlpha: 0 }, 5.45)
    .set(list, { y: 0 }, 5.45)
    // A set for the start values, so the pointer is reset however the playhead reaches it.
    .set(pointer, { x: 0, y: 0, scale: 0.6 }, 5.55)
    .to(pointer, { scale: 1, autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 5.55);

  tl.to({}, { duration: 0.1 }, 6.2);
  return tl;
}

/*
 * Phase 2: a fixed-duration aEthosETH lock-up. The aEthosETH coin goes into the padlock, the shackle
 * snaps shut, the fixed-duration track fills (no numbers: durations are not published yet), then the
 * lock opens and the coin comes back out.
 */

/** Centre of the coin at the start, inside the padlock, and on the way out. */
const COIN_START = { x: 82, y: 112 };
const COIN_IN = { x: 240, y: 128 };
const COIN_OUT = { x: 398, y: 112 };
const LOCK_COIN = 50;
const SHACKLE_OPEN = -21;

const BigPadlock = () => (
  <svg className={styles.bigPadlock} data-el="padlock" viewBox="0 0 100 118" style={{ left: 190, top: 50 }} aria-hidden="true">
    <g data-el="shackle">
      <path d="M28 58V36a22 22 0 0 1 44 0v22" fill="none" stroke={INK} strokeWidth="15" strokeLinecap="round" />
      <path d="M28 58V36a22 22 0 0 1 44 0v22" fill="none" stroke="#ecefec" strokeWidth="9" strokeLinecap="round" />
    </g>
    <rect x="9" y="50" width="82" height="64" rx="17" fill="#fbe74e" stroke={INK} strokeWidth="2.5" />
    <g data-el="keyhole">
      <circle cx="50" cy="76" r="7.5" fill={INK} />
      <rect x="46.4" y="78" width="7.2" height="17" rx="3.6" fill={INK} />
    </g>
  </svg>
);

/** Where the locked coin shows on the padlock's face (in place of the keyhole). */
const LOCK_WINDOW = { x: 240, y: 133, size: 38 };

const Hourglass = () => (
  <svg className={styles.hourglass} data-el="hourglass" viewBox="0 0 24 24" style={{ left: 92, top: 196 }} aria-hidden="true">
    <path d="M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 18.5h5l-2.5-2.5Z" fill="#fbe74e" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

export function Phase2Markup() {
  return (
    <>
      <div className={styles.lockCaption} style={{ left: 120, top: 172, width: 240 }}>
        FIXED DURATION
      </div>
      <div className={styles.lockTrack} style={{ left: 122, top: 196, width: 236 }}>
        <span className={styles.lockFill} data-el="fill" />
        {[1, 2, 3, 4, 5].map((k) => (
          <span key={k} className={styles.lockTick} style={{ left: `${(k * 100) / 6}%` }} />
        ))}
      </div>
      <Hourglass />
      <BigPadlock />
      {/* Feedback as the coin goes in: pop lines and a ring burst from the lock, and the coin shows on its face. */}
      <svg className={styles.abs} data-el="lockPops" viewBox="0 0 120 120" style={{ left: LOCK_WINDOW.x - 60, top: LOCK_WINDOW.y - 60, width: 120, height: 120, overflow: "visible", zIndex: 4 }} aria-hidden="true">
        <path d="M-6 26l-10-7M-8 60h-12M-6 94l-10 7M126 26l10-7M128 60h12M126 94l10 7" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span
        className={styles.lockBurst}
        data-el="burst"
        style={{ left: LOCK_WINDOW.x - 30, top: LOCK_WINDOW.y - 30, width: 60, height: 60 }}
      />
      <div
        className={`${styles.ethCoin} ${styles.lockCoin} ${styles.lockWindow}`}
        data-el="window"
        style={{ left: LOCK_WINDOW.x - LOCK_WINDOW.size / 2, top: LOCK_WINDOW.y - LOCK_WINDOW.size / 2, width: LOCK_WINDOW.size, height: LOCK_WINDOW.size }}
      >
        <span className={styles.coinFace}>
          {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative svg */}
          <img src={glyphSrc("aethoseth")} alt="" draggable={false} />
        </span>
      </div>
      <div
        className={styles.stickerPill}
        data-el="locked"
        style={{ left: 286, top: 40, background: "#d1f500", color: INK, zIndex: 4 }}
      >
        LOCKED
      </div>
      <div className={styles.abs} data-el="coin" style={{ left: COIN_START.x, top: COIN_START.y, zIndex: 3 }}>
        <div className={`${styles.ethCoin} ${styles.lockCoin}`} style={{ left: -LOCK_COIN / 2, top: -LOCK_COIN / 2, width: LOCK_COIN, height: LOCK_COIN }}>
          <span className={styles.coinEdge} />
          <span className={styles.coinFace}>
            <span className={styles.coinRim} />
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative svg */}
            <img src={glyphSrc("aethoseth")} alt="" draggable={false} />
          </span>
        </div>
        <div className={styles.chainPill} data-el="coinLabel" style={{ left: 0, top: 36, transform: "translateX(-50%)" }}>
          aEthosETH
        </div>
      </div>
      {/* Little pop lines when the coin comes back out. */}
      <svg className={styles.abs} data-el="pops" viewBox="0 0 60 60" style={{ left: COIN_OUT.x - 30, top: COIN_OUT.y - 30, width: 60, height: 60, overflow: "visible", zIndex: 2 }} aria-hidden="true">
        <path d="M30 -6v-9M54 6l7-6M60 30h9M6 6l-7-6M0 30h-9" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </>
  );
}

export function buildPhase2(canvas: HTMLElement) {
  const coin = byEl(canvas, "coin");
  const coinLabel = byEl(canvas, "coinLabel");
  const padlock = byEl(canvas, "padlock");
  const shackle = byEl(canvas, "shackle");
  const fill = byEl(canvas, "fill");
  const hourglass = byEl(canvas, "hourglass");
  const locked = byEl(canvas, "locked");
  const pops = byEl(canvas, "pops");
  const keyhole = byEl(canvas, "keyhole");
  const burst = byEl(canvas, "burst");
  const lockWindow = byEl(canvas, "window");
  const lockPops = byEl(canvas, "lockPops");

  gsap.set(keyhole, { scale: 1, transformOrigin: "50% 50%" });
  gsap.set(burst, { autoAlpha: 0, scale: 0.4 });
  gsap.set(lockPops, { autoAlpha: 0, scale: 0.7, transformOrigin: "50% 50%" });
  gsap.set(lockWindow, { autoAlpha: 0, scale: 0.2 });
  gsap.set(coin, { x: 0, y: 0, scale: 1, autoAlpha: 1 });
  gsap.set(coinLabel, { autoAlpha: 1 });
  gsap.set(shackle, { y: SHACKLE_OPEN });
  gsap.set(fill, { scaleX: 0, transformOrigin: "0% 50%" });
  gsap.set(hourglass, { rotation: 0, transformOrigin: "50% 50%" });
  gsap.set(locked, { autoAlpha: 0, scale: 0.3, rotation: -24 });
  gsap.set(pops, { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" });
  gsap.set(padlock, { transformOrigin: "50% 80%" });

  const tl = gsap.timeline({ paused: true, repeat: -1 });
  const inside = { x: COIN_IN.x - COIN_START.x, y: COIN_IN.y - COIN_START.y };
  const out = { x: COIN_OUT.x - COIN_START.x, y: COIN_OUT.y - COIN_START.y };
  const bump = (at: number) =>
    tl.to(padlock, { scaleX: 1.06, scaleY: 0.94, duration: 0.12, ease: "power2.out" }, at).to(
      padlock,
      { scaleX: 1, scaleY: 1, duration: 0.45, ease: "elastic.out(1, 0.5)" },
      at + 0.12,
    );

  // The coin goes into the lock: it spins in, the padlock takes it with a squash and a ring burst,
  // and the coin shows on the padlock's face in place of the keyhole.
  tl.to(coinLabel, { autoAlpha: 0, duration: 0.2 }, 0.3)
    .to(coin, { ...inside, scale: 0.55, rotation: 360, duration: 0.55, ease: "power2.in" }, 0.3)
    .to(coin, { autoAlpha: 0, duration: 0.1 }, 0.82);
  bump(0.85);
  tl.set(burst, { autoAlpha: 1, scale: 0.4 }, 0.85)
    .to(burst, { autoAlpha: 0, scale: 2.5, duration: 0.6, ease: "power2.out" }, 0.85)
    .to(lockPops, { autoAlpha: 1, scale: 1, duration: 0.2, ease: "back.out(2)" }, 0.88)
    .to(lockPops, { autoAlpha: 0, scale: 1.2, duration: 0.3, ease: "power1.in" }, 1.2)
    .to(keyhole, { scale: 0, duration: 0.15, ease: "power2.in" }, 0.82)
    .to(lockWindow, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2.4)" }, 0.88);
  // ...the shackle snaps shut and the sticker lands.
  tl.to(shackle, { y: 0, duration: 0.3, ease: "back.out(3)" }, 0.95)
    .to(locked, { autoAlpha: 1, scale: 1, rotation: -8, duration: 0.45, ease: "back.out(2.2)" }, 1.05);

  // The fixed duration runs: the track fills while the hourglass turns; the locked coin glints.
  tl.to(hourglass, { rotation: 180, duration: 0.5, ease: "power2.inOut" }, 1.15)
    .to(fill, { scaleX: 1, duration: 2.8, ease: "none" }, 1.25)
    .to(lockWindow, { scale: 1.12, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }, 2.6);

  // Done: the lock opens, the coin leaves the padlock's face and comes back out.
  tl.to(locked, { autoAlpha: 0, scale: 0.4, rotation: 6, duration: 0.3, ease: "power2.in" }, 4.1)
    .to(shackle, { y: SHACKLE_OPEN, duration: 0.35, ease: "back.out(2.5)" }, 4.15);
  bump(4.15);
  tl.to(lockWindow, { autoAlpha: 0, scale: 0.2, duration: 0.2, ease: "power2.in" }, 4.22)
    .to(keyhole, { scale: 1, duration: 0.3, ease: "back.out(2)" }, 4.4);
  tl.set(coin, { ...inside, scale: 0.55, rotation: 0 }, 4.3)
    .to(coin, { autoAlpha: 1, duration: 0.1 }, 4.3)
    .to(coin, { ...out, scale: 1, duration: 0.6, ease: "back.out(1.6)" }, 4.3)
    .to(pops, { autoAlpha: 1, scale: 1, duration: 0.25, ease: "back.out(2)" }, 4.75)
    .to(pops, { autoAlpha: 0, scale: 1.25, duration: 0.3, ease: "power1.in" }, 5.15);

  // Reset for the next round: the track empties, the unlocked coin carries on out of the card and the
  // next one slides in from the other side.
  tl.to(hourglass, { rotation: 360, duration: 0.5, ease: "power2.inOut" }, 5.2)
    .to(fill, { scaleX: 0, duration: 0.45, ease: "power2.inOut" }, 5.25)
    .to(coin, { x: 480 + LOCK_COIN - COIN_START.x, rotation: 200, duration: 0.45, ease: "power2.in" }, 5.25)
    .set(coin, { x: -LOCK_COIN - 70 - COIN_START.x, y: 0, rotation: 0 }, 5.72)
    .set(coinLabel, { autoAlpha: 1 }, 5.72)
    .to(coin, { x: 0, duration: 0.5, ease: "power2.out" }, 5.74);

  tl.to({}, { duration: 0.1 }, 6.2);
  return tl;
}

/* ---------- Phase 3: a short chat about borrowing ---------- */

const EXCHANGES: { left: string; right: string }[] = [
  { left: "Borrow against osETH.", right: "What's the max LTV?" },
  { left: "Each market shows it.", right: "Fair enough!" },
];

const Chars = ({ text }: { text: string }) => (
  <>
    {Array.from(text).map((char, i) => (
      <span key={i} className={styles.char} data-el="char">
        {char}
      </span>
    ))}
  </>
);

export function Phase3Markup() {
  return (
    <>
      <div className={styles.avatar} style={{ left: 34, top: 76, background: INK }}>
        <DefinicaMark color="#d1f500" accent={null} />
      </div>
      <div className={styles.avatar} style={{ left: 408, top: 152, background: "#ffcadc" }}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" fill="none" stroke={INK} strokeWidth="1.8" />
          <path d="M8.5 14c1 1.4 2.2 2 3.5 2s2.5-.6 3.5-2" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="9" cy="10" r="1.2" fill={INK} />
          <circle cx="15" cy="10" r="1.2" fill={INK} />
        </svg>
      </div>
      {EXCHANGES.map((exchange, i) => (
        <div key={i}>
          <div className={styles.bubble} data-el={`left${i}`} style={{ left: 82, top: 74 }}>
            <Chars text={exchange.left} />
          </div>
          <div className={styles.bubble} data-el={`right${i}`} style={{ right: 82, top: 150 }}>
            <Chars text={exchange.right} />
          </div>
        </div>
      ))}
    </>
  );
}

export function buildPhase3(canvas: HTMLElement) {
  const bubbles = [0, 1].map((i) => ({ left: byEl(canvas, `left${i}`), right: byEl(canvas, `right${i}`) }));
  // Measure natural widths from a clean state: a previous build (resize, dev double-mount) may have shrunk them.
  gsap.set(
    bubbles.flatMap(({ left, right }) => [left, right]),
    { clearProps: "width,opacity,visibility" },
  );
  const widths = new Map<HTMLElement, number>();
  bubbles.forEach(({ left, right }) => {
    widths.set(left, left.offsetWidth);
    widths.set(right, right.offsetWidth);
  });

  gsap.set([bubbles[1].left, bubbles[1].right], { autoAlpha: 0, width: 46 });
  gsap.set([...allEl(bubbles[1].left, "char"), ...allEl(bubbles[1].right, "char")], { opacity: 0 });

  const tl = gsap.timeline({ paused: true, repeat: -1 });

  /** The bubble pops open from its avatar side and the message types in. */
  const say = (bubble: HTMLElement, at: number) => {
    tl.fromTo(bubble, { autoAlpha: 0, width: 46 }, { autoAlpha: 1, duration: 0.15, immediateRender: false }, at)
      .to(bubble, { width: widths.get(bubble), duration: 0.45, ease: "power3.out" }, at)
      .fromTo(allEl(bubble, "char"), { opacity: 0 }, { opacity: 1, duration: 0.05, stagger: 0.025, immediateRender: false }, at + 0.2);
  };
  const clear = (bubble: HTMLElement, at: number) => {
    tl.to(allEl(bubble, "char"), { opacity: 0, duration: 0.15 }, at)
      .to(bubble, { width: 46, duration: 0.3, ease: "power2.in" }, at + 0.08)
      .to(bubble, { autoAlpha: 0, duration: 0.15 }, at + 0.3);
  };

  clear(bubbles[0].left, 1.5);
  clear(bubbles[0].right, 1.65);
  say(bubbles[1].left, 2.1);
  say(bubbles[1].right, 3.3);
  clear(bubbles[1].left, 4.8);
  clear(bubbles[1].right, 4.95);
  say(bubbles[0].left, 5.4);
  say(bubbles[0].right, 6.1);

  tl.to({}, { duration: 0.1 }, 7.4);
  return tl;
}
