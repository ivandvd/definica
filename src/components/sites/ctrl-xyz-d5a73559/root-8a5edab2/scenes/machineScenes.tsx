import type { ReactNode } from "react";
import { gsap } from "../../shared/gsap";
import { DefinicaMark, glyphSrc, PercentIcon } from "../phone/kit";
import { allEl, byEl } from "../phone/motion";
import {
  INK,
  Ledger,
  Pipes,
  RingPops,
  Station,
  Tag,
  Token,
  flash,
  popIn,
  popOut,
  port,
  release,
  resetChecks,
  ride,
  route,
  tick,
  untick,
  type Pt,
} from "./motionKit";
import styles from "./scenes.module.css";

/*
 * "Watch it work": one machine per mechanism of the Definica design, each on a 400 x 400 canvas for
 * the big vertical cards. Tokens only ever leave a tile through a pipe and arrive in another one, so
 * every movement has a source and a destination; no numbers are invented.
 */

type Timeline = gsap.core.Timeline;

/** Hides every station's pop lines and every token's name pill until they are used. */
function prepare(canvas: HTMLElement) {
  gsap.set(canvas.querySelectorAll('[data-el$="Pops"]'), { autoAlpha: 0 });
  gsap.set(canvas.querySelectorAll("[data-caption]"), { autoAlpha: 0 });
}

/** Holds the last frame until the loop length. */
const hold = (tl: Timeline, loop: number) => tl.to({}, { duration: 0.01 }, loop - 0.01);

/* ---------- icons ---------- */

const Smiley = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="#ffcadc" stroke={INK} strokeWidth="1.8" />
    <path d="M8.5 14c1 1.4 2.2 2 3.5 2s2.5-.6 3.5-2" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="9" cy="10" r="1.2" fill={INK} />
    <circle cx="15" cy="10" r="1.2" fill={INK} />
  </svg>
);

/** Three server units; their lights (data-el="led") come on when the validators are funded. */
const ServerIcon = () => (
  <svg viewBox="0 0 56 46" aria-hidden="true">
    {[2, 17, 32].map((y) => (
      <g key={y}>
        <rect x="1.5" y={y} width="53" height="12" rx="4" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
        <circle data-el="led" cx="10" cy={y + 6} r="3" fill={INK} stroke={INK} strokeWidth="1.4" />
        <path d={`M19 ${y + 6}h10`} stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

const KeyIcon = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="16" cy="24" r="9" fill="#ffffff" stroke={INK} strokeWidth="3" />
    <circle cx="16" cy="24" r="3" fill={INK} />
    <path d="M25 24h17M36 24v7M42 24v5" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShieldCheck = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <path d="M24 5 39 11v11c0 10-6.4 18-15 21-8.6-3-15-11-15-21V11Z" fill="#ffffff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    <path d="M17 24.5l5 5 9.5-10.5" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FlameArt = () => (
  <svg viewBox="0 0 40 48" aria-hidden="true">
    <path d="M20 3c3 8 13 13 13 25a13 13 0 0 1-26 0c0-6 3-9 5-12 1 4 3 6 5 6-2-7 0-14 3-19Z" fill="#ff5a4d" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
    <path d="M20 26c2 3 6 5 6 10a6 6 0 0 1-12 0c0-3 2-5 3-7 0 2 1 3 2 3 0-3 0-4 1-6Z" fill="#fbe74e" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const WalletIcon = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <rect x="6" y="12" width="34" height="26" rx="6" fill="#ffffff" stroke={INK} strokeWidth="3" />
    <path d="M30 21h12v10H30a5 5 0 0 1 0-10Z" fill="#ffffff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    <circle cx="31" cy="26" r="2" fill={INK} />
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <rect x="7" y="7" width="34" height="34" rx="7" fill="#ffffff" stroke={INK} strokeWidth="3" />
    <path d="M14 31l7-8 6 5 8-11" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GridIcon = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    {[
      [8, 8],
      [26, 8],
      [8, 26],
      [26, 26],
    ].map(([x, y]) => (
      <rect key={`${x}${y}`} x={x} y={y} width="14" height="14" rx="4" fill="#ffffff" stroke={INK} strokeWidth="3" />
    ))}
  </svg>
);

/** The splitter's mark: a coin cut into three quarters and one quarter. */
const SplitIcon = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true">
    <path d="M23 25V7A18 18 0 1 0 41 25Z" fill="#fbe74e" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    <path d="M27 21V3A18 18 0 0 1 45 21Z" fill="#ffffff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M5 7.5V5.5a3 3 0 0 1 6 0v2" fill="none" stroke={INK} strokeWidth="1.8" />
    <rect x="2.8" y="7.2" width="10.4" height="7.6" rx="2" fill="#fbe74e" stroke={INK} strokeWidth="1.6" />
  </svg>
);

const DebtIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3.5 1.8h9v12.4l-2.2-1.4-2.3 1.4-2.3-1.4-2.2 1.4Z" fill="#ffcadc" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M6 6h4M6 9h4" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const SharesGlyph = () => (
  // eslint-disable-next-line @next/next/no-img-element -- tiny decorative svg
  <img src={glyphSrc("vault-shares")} alt="" draggable={false} />
);

/* ---------- 1. Pooled staking: You -> DefinicaCore -> Staking Vault -> Validators ---------- */

const POOL = { you: [76, 92], core: [324, 92], vault: [324, 308], validators: [76, 308] } as const satisfies Record<string, Pt>;
const POOL_YOU_CORE = route([POOL.you, POOL.core]);
const POOL_CORE_VAULT = route([POOL.core, POOL.vault]);
const POOL_VAULT_CORE = route([POOL.vault, POOL.core]);
const POOL_VAULT_VAL = route([POOL.vault, POOL.validators]);
const POOL_VAL_VAULT = route([POOL.validators, POOL.vault]);

export function PooledMarkup() {
  return (
    <>
      <Pipes routes={[POOL_YOU_CORE, POOL_CORE_VAULT, POOL_VAULT_VAL]} />
      {/* Core's user ledger, tucked under the Core tile. */}
      <Ledger x={156} y={126} w={154} title="CORE LEDGER" rows={[{ el: "yours", label: "Your shares", icon: <SharesGlyph /> }]} />
      <Station el="you" x={POOL.you[0]} y={POOL.you[1]} color="#ffffff" label="You" labelSide="above">
        <Smiley />
      </Station>
      <Station el="core" x={POOL.core[0]} y={POOL.core[1]} color={INK} label="DefinicaCore" labelSide="above">
        <DefinicaMark color="#d1f500" accent={null} />
      </Station>
      <Station el="vault" x={POOL.vault[0]} y={POOL.vault[1]} color="#ffcadc" glyph="stakewise-vault" label="Staking Vault" />
      <Station el="validators" x={POOL.validators[0]} y={POOL.validators[1]} color="#05c92f" label="Validators">
        <ServerIcon />
      </Station>
      <Tag el="sharesTag" x={176} y={214} color="#fbe74e">
        VAULT SHARES
      </Tag>
      <Tag el="rewardsTag" x={164} y={256} color="#d1f500">
        REWARDS
      </Tag>
      <Token el="eth" />
      <Token el="share" size={36} color="lemon" glyph="vault-shares" />
      <Token el="reward" size={34} color="lime" />
      <Token el="reward" size={34} color="lime" />
    </>
  );
}

export function buildPooled(canvas: HTMLElement) {
  const you = port(canvas, "you");
  const core = port(canvas, "core");
  const vault = port(canvas, "vault");
  const validators = port(canvas, "validators");
  const eth = byEl(canvas, "eth");
  const share = byEl(canvas, "share");
  const rewards = allEl(canvas, "reward");
  const check = byEl(canvas, "yoursCheck");
  const leds = allEl(canvas, "led");
  const sharesTag = byEl(canvas, "sharesTag");
  const rewardsTag = byEl(canvas, "rewardsTag");

  prepare(canvas);
  gsap.set(eth, { x: POOL.you[0], y: POOL.you[1], scale: 0.8 });
  gsap.set(share, { x: POOL.vault[0], y: POOL.vault[1], scale: 0.8 });
  gsap.set(rewards, { x: POOL.validators[0], y: POOL.validators[1], scale: 0.8 });
  gsap.set(leds, { fill: INK });
  gsap.set([sharesTag, rewardsTag], { autoAlpha: 0, scale: 0.4, rotation: -12 });
  resetChecks([check]);

  const tl = gsap.timeline({ paused: true, repeat: -1 });
  // Your ETH goes to DefinicaCore...
  const deposit = ride(tl, eth, POOL_YOU_CORE, 0.3, { from: you, to: core });
  // ...which forwards it to the dedicated Staking Vault...
  const forward = ride(tl, eth, POOL_CORE_VAULT, deposit.inside + 0.5, { from: core, to: vault });
  // ...which issues the Vault shares to Core; Core records them as yours.
  const shares = ride(tl, share, POOL_VAULT_CORE, forward.inside + 0.5, { from: vault, to: core, size: 36 });
  popIn(tl, sharesTag, shares.start + 0.15, -4);
  popOut(tl, sharesTag, shares.inside + 0.15);
  tick(tl, check, shares.inside + 0.08);
  // The Vault funds the validators: their lights come on and blink while they work...
  const stake = ride(tl, eth, POOL_VAULT_VAL, shares.start + 0.8, { from: vault, to: validators });
  tl.to(leds, { fill: "#d1f500", duration: 0.1, stagger: 0.08 }, stake.inside + 0.05).to(
    leds,
    { fill: INK, duration: 0.08, yoyo: true, repeat: 1, stagger: 0.1 },
    stake.inside + 0.55,
  );
  // ...and their rewards flow back into the Vault, where they accrue to every share.
  const paid = rewards.map((reward, i) => ride(tl, reward, POOL_VAL_VAULT, stake.inside + 0.95 + i * 0.34, { from: validators, to: vault, size: 34 }));
  popIn(tl, rewardsTag, stake.inside + 1.05, 4);
  popOut(tl, rewardsTag, paid[paid.length - 1].inside + 0.2);

  // Ready for the next deposit.
  const loop = paid[paid.length - 1].inside + 1.2;
  untick(tl, check, loop - 0.75);
  tl.to(leds, { fill: INK, duration: 0.3 }, loop - 0.7);
  hold(tl, loop);
  return tl;
}

/* ---------- 2. Two routes to a stronger share: each share is backed by more ETH ---------- */

/*
 * A two-sided card. Front: the multisig donates ETH through DefinicaCore to the Vault; at the next
 * harvest every share's backing rises (P = (A + D) / S). Back: the multisig burns its own Vault share;
 * its ETH stays in the Vault, so the remaining shares' backing rises (P = A / (S - B)). Each side starts
 * from the same Vault: four shares, each a jar of the ETH backing it.
 */

const BOARD = { left: 20, top: 20, size: 360 };
const FRAME = { left: 18, top: 174, width: 320, height: 126 };
const JAR = { width: 40, height: 76, top: 202, gap: 26 };
const JAR_LEFT = [0, 1, 2, 3].map((k) => 63 + k * (JAR.width + JAR.gap));
/** The flame sits straight above the multisig's jar (the fourth), which rises into it. */
const TR = { multisig: [64, 98], core: [178, 98], flame: [JAR_LEFT[3] + JAR.width / 2, 94] } as const satisfies Record<string, Pt>;
/** Liquid heights (px): the base level, and the level after either route (x 4/3 for both). */
const LEVEL = { base: 33, after: 44 };
const JAR_FLOOR = JAR.top + JAR.height - 2.5;
const TR_MS_CORE = route([TR.multisig, TR.core]);
const TR_CORE_VAULT = route([TR.core, [TR.core[0], 238]]);
/** The burned share breaks into six charred pieces (2 x 3) and gives off embers. */
const SHARDS = [0, 1, 2, 3, 4, 5].map((i) => [(i % 2) * (JAR.width / 2), Math.floor(i / 2) * (JAR.height / 3)] as const);
const EMBERS = [
  { x: 12, y: 20, color: "#ff5a4d" },
  { x: 28, y: 26, color: "#fbe74e" },
  { x: 18, y: 40, color: "#ff5a4d" },
  { x: 30, y: 50, color: "#fbe74e" },
  { x: 8, y: 54, color: "#fbe74e" },
  { x: 22, y: 62, color: "#ff5a4d" },
  { x: 34, y: 34, color: "#ff5a4d" },
  { x: 6, y: 32, color: "#fbe74e" },
];

function Jar({ el, left, owned = false, burnable = false }: { el: string; left: number; owned?: boolean; burnable?: boolean }) {
  return (
    <div className={styles.jarBox} data-el={el} style={{ left, top: JAR.top, width: JAR.width, height: JAR.height }}>
      <div className={styles.jar} data-el={burnable ? "burnBody" : undefined}>
        <span className={styles.jarFill} data-el="jarFill" />
      </div>
      {owned ? (
        <span className={styles.jarBadge} data-el={burnable ? "burnBadge" : "badge"}>
          <KeyIcon />
        </span>
      ) : null}
      {burnable
        ? SHARDS.map(([x, y], i) => (
            <span key={i} className={styles.shard} data-el="shard" style={{ left: x, top: y, width: JAR.width / 2, height: JAR.height / 3 }} />
          ))
        : null}
    </div>
  );
}

function VaultSide({ side }: { side: 1 | 2 }) {
  const eth = side === 1;
  return (
    <div className={styles.face} data-el={`face${side}`}>
      <div className={styles.routePill} style={{ left: 18, top: 16 }}>
        {eth ? "01 · ETH ROUTE" : "02 · SHARE ROUTE"}
      </div>
      {eth ? <Pipes routes={[TR_MS_CORE, TR_CORE_VAULT]} size={360} /> : null}
      <Station el={`multisig${side}`} x={TR.multisig[0]} y={TR.multisig[1]} size={62} color="#fbe74e" label="Multisig">
        <KeyIcon />
      </Station>
      {eth ? (
        <Station el="core1" x={TR.core[0]} y={TR.core[1]} size={62} color={INK} label="DefinicaCore" labelSide="right">
          <DefinicaMark color="#d1f500" accent={null} />
        </Station>
      ) : (
        <>
          {[0, 1, 2].map((k) => (
            <span key={k} className={styles.smoke} data-el="smoke" style={{ left: TR.flame[0], top: TR.flame[1] - 26 }} />
          ))}
          {/* Embers fly out of the burning share, in front of the flame. */}
          {EMBERS.map(({ x, y, color }, i) => (
            <span key={i} className={styles.ember} data-el="ember" style={{ left: TR.flame[0] - JAR.width / 2 + x, top: TR.flame[1] + 2 - JAR.height / 2 + y, background: color }} />
          ))}
          <div className={styles.flame} data-el="flame" style={{ left: TR.flame[0] - 28, top: TR.flame[1] - 36, width: 56, height: 68 }}>
            <span className={styles.flameInner} data-el="flameInner">
              <FlameArt />
            </span>
          </div>
        </>
      )}
      {/* The Vault: its frame, the four shares (jars of the ETH backing each one) and the P level. */}
      <div className={styles.vaultGroup} data-el={`vault${side}`}>
        <div className={styles.vaultFrame} style={{ left: FRAME.left, top: FRAME.top, width: FRAME.width, height: FRAME.height }}>
          <span className={styles.frameCaption}>VAULT SHARES</span>
        </div>
        {JAR_LEFT.map((left, k) => (
          <Jar key={k} el={`jar${side}_${k}`} left={left} owned={k === 3} burnable={!eth && k === 3} />
        ))}
        <div className={styles.pLine} data-el={`pLine${side}`} style={{ left: 48, top: JAR_FLOOR - LEVEL.base, width: 256 }}>
          <b className={styles.pBadge}>P</b>
        </div>
      </div>
      <div className={styles.formula} style={{ left: 18, top: 312, width: 320 }}>
        <span data-el={`fBase${side}`}>P = A / S</span>
        <span data-el={`fAfter${side}`}>{eth ? "P = (A + D) / S" : "P = A / (S − B)"}</span>
      </div>
      {eth ? (
        <>
          <Tag el="harvest" x={204} y={150} color="#d1f500">
            NEXT HARVEST
          </Tag>
          <Token el="donation" size={36} caption="Donation D" captionSide="above" />
        </>
      ) : (
        <Tag el="assetsStay" x={30} y={155} color="#d1f500">
          ITS ETH STAYS IN THE VAULT
        </Tag>
      )}
    </div>
  );
}

export function TreasuryMarkup() {
  return (
    <div className={styles.board} data-el="board" style={{ left: BOARD.left, top: BOARD.top, width: BOARD.size, height: BOARD.size }}>
      <VaultSide side={1} />
      <VaultSide side={2} />
    </div>
  );
}

export function buildTreasury(canvas: HTMLElement) {
  const board = byEl(canvas, "board");
  const face1 = byEl(canvas, "face1");
  const face2 = byEl(canvas, "face2");
  const multisig1 = port(canvas, "multisig1");
  const multisig2 = port(canvas, "multisig2");
  const core = port(canvas, "core1");
  const vault = port(canvas, "vault1", 238 - FRAME.top, 0.35);
  const vaultGroups = [byEl(canvas, "vault1"), byEl(canvas, "vault2")];
  const donation = byEl(canvas, "donation");
  const harvest = byEl(canvas, "harvest");
  const assetsStay = byEl(canvas, "assetsStay");
  const fills1 = allEl(face1, "jarFill");
  const fills2 = allEl(face2, "jarFill");
  const [pLine1, pLine2] = [byEl(canvas, "pLine1"), byEl(canvas, "pLine2")];
  const [fBase1, fAfter1, fBase2, fAfter2] = ["fBase1", "fAfter1", "fBase2", "fAfter2"].map((name) => byEl(canvas, name));
  const burnJar = byEl(canvas, "jar2_3");
  const burnBody = byEl(canvas, "burnBody");
  const burnBadge = byEl(canvas, "burnBadge");
  const shards = allEl(canvas, "shard");
  const embers = allEl(canvas, "ember");
  const smoke = allEl(canvas, "smoke");
  const flame = byEl(canvas, "flame");
  const flameInner = byEl(canvas, "flameInner");
  const rise = LEVEL.after - LEVEL.base;

  prepare(canvas);
  gsap.set(board, { scaleX: 1 });
  gsap.set(vaultGroups, { transformOrigin: `${FRAME.left + FRAME.width / 2}px ${FRAME.top + FRAME.height / 2}px` });
  gsap.set(face1, { autoAlpha: 1 });
  gsap.set(face2, { autoAlpha: 0 });
  gsap.set([...fills1, ...fills2], { height: LEVEL.base });
  gsap.set([pLine1, pLine2], { y: 0 });
  gsap.set([fBase1, fBase2], { autoAlpha: 1, y: 0 });
  gsap.set([fAfter1, fAfter2], { autoAlpha: 0, y: 0 });
  gsap.set(donation, { x: TR.multisig[0], y: TR.multisig[1], scale: 0.8 });
  gsap.set([harvest, assetsStay], { autoAlpha: 0, scale: 0.4, rotation: -12 });
  gsap.set(burnJar, { x: 0, y: 0, rotation: 0, scaleY: 1 });
  gsap.set([burnBody, burnBadge], { autoAlpha: 1, backgroundColor: "#ffffff" });
  gsap.set(shards, { autoAlpha: 0, x: 0, y: 0, rotation: 0, scale: 1 });
  gsap.set(embers, { autoAlpha: 0, x: 0, y: 0, scale: 1 });
  gsap.set(smoke, { autoAlpha: 0, x: 0, y: 0, scale: 0.4 });
  gsap.set(flame, { scale: 0.8, transformOrigin: "50% 100%" });
  gsap.set(flameInner, { scaleY: 1, scaleX: 1, transformOrigin: "50% 100%" });

  const tl = gsap.timeline({ paused: true, repeat: -1 });
  const swap = (show: HTMLElement, hide: HTMLElement, at: number) =>
    tl.to(hide, { autoAlpha: 0, duration: 0.15 }, at).fromTo(show, { y: 6 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "back.out(2)", immediateRender: false }, at + 0.1);
  const flip = (show: HTMLElement, hide: HTMLElement, at: number) =>
    tl
      .to(board, { scaleX: 0.02, duration: 0.2, ease: "power2.in" }, at)
      .set(hide, { autoAlpha: 0 }, at + 0.2)
      .set(show, { autoAlpha: 1 }, at + 0.2)
      .to(board, { scaleX: 1, duration: 0.36, ease: "back.out(1.5)" }, at + 0.2);

  // Front, ETH route: the multisig donates through DefinicaCore into the Vault...
  const toCore = ride(tl, donation, TR_MS_CORE, 0.35, { from: multisig1, to: core, size: 36 });
  const toVault = ride(tl, donation, TR_CORE_VAULT, toCore.inside + 0.5, { from: core, to: vault, size: 36 });
  // ...and it counts from the next harvest: then every share's backing rises.
  popIn(tl, harvest, toVault.inside + 0.1, 5);
  const harvestAt = toVault.inside + 0.75;
  tl.to(harvest, { scale: 1.15, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1 }, harvestAt);
  fills1.forEach((fill, k) => tl.to(fill, { height: LEVEL.after, duration: 0.45, ease: "back.out(2)" }, harvestAt + 0.1 + k * 0.07));
  tl.to(pLine1, { y: -rise, duration: 0.45, ease: "back.out(2)" }, harvestAt + 0.15);
  swap(fAfter1, fBase1, harvestAt + 0.25);
  popOut(tl, harvest, harvestAt + 1.1);

  // Turn the card over.
  const FLIP_TO_BACK = harvestAt + 1.55;
  flip(face2, face1, FLIP_TO_BACK);
  // The front quietly returns to its starting state while it is face down.
  const reset = FLIP_TO_BACK + 0.6;
  tl.set(fills1, { height: LEVEL.base }, reset)
    .set(pLine1, { y: 0 }, reset)
    .set(fBase1, { autoAlpha: 1, y: 0 }, reset)
    .set(fAfter1, { autoAlpha: 0 }, reset)
    .set(donation, { x: TR.multisig[0], y: TR.multisig[1], scale: 0.8 }, reset);

  // Back, share route: the multisig acts on its own share (the jar with its key)...
  const B = FLIP_TO_BACK + 0.75;
  release(tl, multisig2.tile, B, [0, 0]);
  tl.to(burnBadge, { rotation: 18, duration: 0.1, ease: "power1.out", yoyo: true, repeat: 3 }, B + 0.12);
  // ...its ETH stays in the Vault: the other three shares now hold it...
  const drain = B + 0.55;
  tl.to(fills2[3], { height: 0, duration: 0.75, ease: "power1.inOut" }, drain);
  fills2.slice(0, 3).forEach((fill, k) => tl.to(fill, { height: LEVEL.after, duration: 0.65, ease: "back.out(1.6)" }, drain + 0.1 + k * 0.06));
  tl.to(pLine2, { y: -rise, duration: 0.6, ease: "back.out(1.6)" }, drain + 0.15);
  popIn(tl, assetsStay, drain + 0.2, -4);
  // ...and the empty share is lifted out and burned.
  const lift = drain + 0.95;
  const toFlame = TR.flame[1] + 2 - (JAR.top + JAR.height / 2);
  tl.to(burnJar, { y: 4, scaleY: 0.94, transformOrigin: "50% 100%", duration: 0.12, ease: "power2.in" }, lift)
    .to(burnJar, { y: toFlame, scaleY: 1, duration: 0.6, ease: "power2.inOut" }, lift + 0.12);
  const burn = lift + 0.72;
  // The flame flares and swallows it: it chars and shakes, crumbles into embers, smoke rises.
  tl.to(flame, { scale: 1.45, duration: 0.2, ease: "power2.out" }, burn)
    .to([burnBody, burnBadge], { backgroundColor: "#3a3f3b", duration: 0.35, ease: "power1.in" }, burn + 0.05)
    .to(burnJar, { x: 2.5, duration: 0.05, ease: "none", yoyo: true, repeat: 7 }, burn + 0.1)
    .set([burnBody, burnBadge], { autoAlpha: 0 }, burn + 0.55)
    .set(shards, { autoAlpha: 1 }, burn + 0.55);
  shards.forEach((shard, i) => {
    const side = i % 2 ? 1 : -1;
    const row = Math.floor(i / 2);
    tl.to(
      shard,
      { x: side * (12 + row * 7), y: 18 + row * 10, rotation: side * (40 + row * 25), scale: 0.25, autoAlpha: 0, duration: 0.6, ease: "power2.in" },
      burn + 0.55 + row * 0.04,
    );
  });
  embers.forEach((ember, i) => {
    const at = burn + 0.5 + i * 0.045;
    tl.set(ember, { autoAlpha: 1, x: 0, y: 0, scale: 1 }, at).to(
      ember,
      { x: ((i * 7) % 5) * 6 - 12, y: -58 - ((i * 5) % 4) * 12, scale: 0.15, autoAlpha: 0, duration: 1.0, ease: "power1.out" },
      at,
    );
  });
  smoke.forEach((puff, i) => {
    tl.set(puff, { autoAlpha: 0.95, x: 0, y: 0, scale: 0.4 }, burn + 0.4 + i * 0.22).to(
      puff,
      { x: (i - 1) * 8, y: -42, scale: 1.5, autoAlpha: 0, duration: 1.0, ease: "power1.out" },
      burn + 0.4 + i * 0.22,
    );
  });
  tl.to(flame, { scale: 0.8, duration: 0.55, ease: "power2.inOut" }, burn + 0.95);
  // The flame flickers while it burns.
  tl.to(flameInner, { scaleY: 1.1, scaleX: 0.94, duration: 0.14, ease: "sine.inOut", yoyo: true, repeat: 7 }, burn);
  swap(fAfter2, fBase2, burn + 0.7);
  popOut(tl, assetsStay, burn + 1.2);

  // Turn back to the front for the next round.
  const FLIP_TO_FRONT = burn + 2.0;
  flip(face1, face2, FLIP_TO_FRONT);
  hold(tl, FLIP_TO_FRONT + 0.9);
  return tl;
}

/* ---------- 3. Committed liquidity: osETH -> Aave V3 -> aEthosETH -> Main Liquidity Module ---------- */

const COMMIT = { you: [58, 112], aave: [194, 112], module: [330, 112], markets: [194, 300] } as const satisfies Record<string, Pt>;
const COMMIT_SUPPLY = route([COMMIT.you, COMMIT.aave]);
const COMMIT_LOCK = route([COMMIT.aave, COMMIT.module]);
const COMMIT_LOAN = route([COMMIT.aave, COMMIT.markets]);

export function CommitMarkup() {
  return (
    <>
      <Pipes routes={[COMMIT_SUPPLY, COMMIT_LOCK, COMMIT_LOAN]} />
      {/* The module's records, tucked under the module tile. */}
      <Ledger
        x={262}
        y={146}
        w={132}
        rows={[
          { el: "custody", label: "Custody", icon: <LockIcon /> },
          { el: "debt", label: "Debt", icon: <DebtIcon /> },
        ]}
      />
      <Station el="you" x={COMMIT.you[0]} y={COMMIT.you[1]} size={76} color="#ffffff" label="You" labelSide="above">
        <Smiley />
      </Station>
      <Station el="aave" x={COMMIT.aave[0]} y={COMMIT.aave[1]} size={84} color="#c6dcfa" glyph="aave-v3" label="Aave V3" labelSide="above" />
      <Station el="module" x={COMMIT.module[0]} y={COMMIT.module[1]} size={84} color="#ff5a4d" glyph="liquidity-module" label="Liquidity Module" labelSide="above" />
      <Station el="markets" x={COMMIT.markets[0]} y={COMMIT.markets[1]} size={84} color="#fbe74e" glyph="borrowing-markets" label="Lending markets" />
      <Tag el="loanTag" x={212} y={226} color="#ffffff">
        FUNDING LOAN
      </Tag>
      <Token el="oseth" glyph="oseth" caption="osETH" captionSide="above" />
      <Token el="aeth" color="mint" glyph="aethoseth" caption="aEthosETH" captionSide="above" />
      <Token el="weth" color="grey" caption="WETH" captionSide="left" />
    </>
  );
}

export function buildCommit(canvas: HTMLElement) {
  const you = port(canvas, "you");
  const aave = port(canvas, "aave");
  const moduleTile = port(canvas, "module");
  const markets = port(canvas, "markets");
  const oseth = byEl(canvas, "oseth");
  const aeth = byEl(canvas, "aeth");
  const weth = byEl(canvas, "weth");
  const custody = byEl(canvas, "custodyCheck");
  const debt = byEl(canvas, "debtCheck");
  const loanTag = byEl(canvas, "loanTag");

  prepare(canvas);
  gsap.set(oseth, { x: COMMIT.you[0], y: COMMIT.you[1], scale: 0.8 });
  gsap.set([aeth, weth], { x: COMMIT.aave[0], y: COMMIT.aave[1], scale: 0.8 });
  gsap.set(loanTag, { autoAlpha: 0, scale: 0.4, rotation: -12 });
  resetChecks([custody, debt]);

  const tl = gsap.timeline({ paused: true, repeat: -1 });
  // Supply osETH to Aave V3...
  const supply = ride(tl, oseth, COMMIT_SUPPLY, 0.3, { from: you, to: aave });
  // ...which issues aEthosETH; commit it to the Liquidity Module, which records custody.
  const lock = ride(tl, aeth, COMMIT_LOCK, supply.inside + 0.55, { from: aave, to: moduleTile });
  tick(tl, custody, lock.inside + 0.08);
  // A funding loan against the supplied position goes to the lending markets; the module records the debt.
  const loan = ride(tl, weth, COMMIT_LOAN, lock.start + 0.85, { from: aave, to: markets });
  popIn(tl, loanTag, loan.start + 0.1, -4);
  popOut(tl, loanTag, loan.inside + 0.45);
  tick(tl, debt, loan.inside + 0.08);

  const loop = loan.inside + 2.3;
  untick(tl, custody, loop - 0.8);
  untick(tl, debt, loop - 0.7);
  hold(tl, loop);
  return tl;
}

/* ---------- 4. Interest, split in the open: 0.75 x I to you, 0.25 x I to Definica ---------- */

const SPLIT = { market: [200, 84], splitter: [200, 194], you: [100, 296], definica: [300, 296] } as const satisfies Record<string, Pt>;
const SPLIT_IN = route([SPLIT.market, SPLIT.splitter]);
const SPLIT_YOU = route([SPLIT.splitter, [SPLIT.you[0], SPLIT.splitter[1]], SPLIT.you]);
const SPLIT_DEF = route([SPLIT.splitter, [SPLIT.definica[0], SPLIT.splitter[1]], SPLIT.definica]);
const PIECE = 50;

/** A piece of an interest coin (three quarters or one quarter), centred on its anchor. */
function CoinPiece({ el, part }: { el: string; part: 0.75 | 0.25 }) {
  const r = PIECE / 2 - 1.5;
  const face = part === 0.75 ? `M0 0V${-r}A${r} ${r} 0 1 0 ${r} 0Z` : `M0 0V${-r}A${r} ${r} 0 0 1 ${r} 0Z`;
  // The quarter is shifted so its middle sits on the anchor (and on the pipe).
  const shift = part === 0.25 ? -r * 0.42 : 0;
  const box = PIECE + 12;
  return (
    <div className={styles.token} data-el={el}>
      <svg className={styles.piece} viewBox={`${-box / 2} ${-box / 2} ${box} ${box}`} style={{ left: -box / 2, top: -box / 2, width: box, height: box }} aria-hidden="true">
        <g transform={`translate(${shift} ${-shift})`}>
          <path d={face} transform="translate(0 4)" fill="#d9c22c" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path d={face} fill="#fbe74e" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

export function ReturnsMarkup() {
  return (
    <>
      <Pipes routes={[SPLIT_IN, SPLIT_YOU, SPLIT_DEF]} />
      <Station el="market" x={SPLIT.market[0]} y={SPLIT.market[1]} size={80} color="#fbe74e" glyph="borrowing-markets" label="Lending interest · I" labelSide="above" />
      <Station el="splitter" x={SPLIT.splitter[0]} y={SPLIT.splitter[1]} size={72} color="#ffffff">
        <SplitIcon />
      </Station>
      <Station el="you" x={SPLIT.you[0]} y={SPLIT.you[1]} size={76} color="#ffffff" label="You">
        <Smiley />
      </Station>
      <Station el="definica" x={SPLIT.definica[0]} y={SPLIT.definica[1]} size={76} color={INK} label="Definica">
        <DefinicaMark color="#d1f500" accent={null} />
      </Station>
      <div className={styles.splitShare} style={{ left: 112, top: 156 }}>
        75%
      </div>
      <div className={styles.splitShare} style={{ left: 244, top: 156 }}>
        25%
      </div>
      {[
        { x: SPLIT.you[0], text: "0.75 × I", el: "fYou" },
        { x: SPLIT.definica[0], text: "0.25 × I", el: "fDef" },
      ].map(({ x, text, el }) => (
        <div key={el} className={styles.formula} data-el={el} style={{ left: x - 50, top: SPLIT.you[1] + 38 + 30, width: 100, height: 28 }}>
          <span>{text}</span>
        </div>
      ))}
      {[0, 1].map((k) => (
        <Token key={k} el="interest" size={PIECE} color="lemon">
          <span className={styles.coinIcon}>
            <PercentIcon />
          </span>
        </Token>
      ))}
      {[0, 1].map((k) => (
        <CoinPiece key={`a${k}`} el="piece75" part={0.75} />
      ))}
      {[0, 1].map((k) => (
        <CoinPiece key={`b${k}`} el="piece25" part={0.25} />
      ))}
    </>
  );
}

export function buildReturns(canvas: HTMLElement) {
  const market = port(canvas, "market");
  const splitter = port(canvas, "splitter");
  const you = port(canvas, "you");
  const definica = port(canvas, "definica");
  const coins = allEl(canvas, "interest");
  const big = allEl(canvas, "piece75");
  const small = allEl(canvas, "piece25");
  const fYou = byEl(canvas, "fYou");
  const fDef = byEl(canvas, "fDef");
  const ROUND = 2.3;

  prepare(canvas);
  gsap.set(coins, { x: SPLIT.market[0], y: SPLIT.market[1], scale: 0.8 });
  gsap.set([...big, ...small], { x: SPLIT.splitter[0], y: SPLIT.splitter[1], scale: 0.8 });

  const tl = gsap.timeline({ paused: true, repeat: -1 });
  coins.forEach((coin, k) => {
    const at = 0.3 + k * ROUND;
    // Interest from the lending markets goes into the splitter...
    const into = ride(tl, coin, SPLIT_IN, at, { from: market, to: splitter, size: PIECE });
    // ...which cuts it: three quarters to you, one quarter to Definica.
    const out = into.inside + 0.55;
    release(tl, splitter.tile, out, [0, 0]);
    const toYou = ride(tl, big[k], SPLIT_YOU, out, { from: splitter, to: you, size: PIECE, quiet: true });
    const toDef = ride(tl, small[k], SPLIT_DEF, out, { from: splitter, to: definica, size: PIECE * 0.6, quiet: true });
    tl.to(fYou, { scale: 1.1, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1 }, toYou.inside);
    tl.to(fDef, { scale: 1.1, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1 }, toDef.inside);
  });
  hold(tl, 0.3 + coins.length * ROUND);
  return tl;
}

/* ---------- 5. Built on StakeWise: a gear train that runs once every part is connected ---------- */

/*
 * StakeWise Vaults are the engine (the drive gear, always turning). Each of the three things Definica
 * needs from them is a gear that slides in and meshes, in order; when the last one connects, the train
 * reaches the Definica gear and it runs. Then the gears slide out again, last one first.
 * All gears share one tooth size, so they mesh: pitch radius = TOOTH x teeth.
 */

const TOOTH = 2.9;
const ADDENDUM = 3.6;
const DEDENDUM = 4.6;
const ROWS = { low: 238, up: 194 };
const SLIDE = 26;

interface GearSpec {
  el: string;
  teeth: number;
  color: string;
  row: "low" | "up";
  label: string[];
  hub: number;
  icon: ReactNode;
}

const GEAR_SPECS: GearSpec[] = [
  {
    el: "gS",
    teeth: 16,
    color: "#ffcadc",
    row: "low",
    label: ["StakeWise", "Vaults"],
    hub: 46,
    // eslint-disable-next-line @next/next/no-img-element -- tiny decorative svg
    icon: <img src={glyphSrc("stakewise-vault")} alt="" draggable={false} />,
  },
  { el: "gA", teeth: 12, color: "#9dc4f5", row: "up", label: ["Independent", "Vault admin"], hub: 36, icon: <KeyIcon /> },
  { el: "gB", teeth: 12, color: "#fbe74e", row: "low", label: ["Proportional", "accounting"], hub: 36, icon: <SharesGlyph /> },
  { el: "gC", teeth: 12, color: "#d1f500", row: "up", label: ["Approved", "upgrades"], hub: 36, icon: <ShieldCheck /> },
  { el: "gD", teeth: 10, color: INK, row: "low", label: ["Definica"], hub: 32, icon: <DefinicaMark color="#d1f500" accent={null} /> },
];

/** Gear centres along a zigzag, each one meshing with the one before it, centred on the canvas. */
const GEARS = (() => {
  const pitch = (g: GearSpec) => TOOTH * g.teeth;
  const xs = [0];
  for (let i = 1; i < GEAR_SPECS.length; i++) {
    const distance = pitch(GEAR_SPECS[i - 1]) + pitch(GEAR_SPECS[i]);
    const dy = ROWS[GEAR_SPECS[i - 1].row] - ROWS[GEAR_SPECS[i].row];
    xs.push(xs[i - 1] + Math.sqrt(distance * distance - dy * dy));
  }
  const first = pitch(GEAR_SPECS[0]) + ADDENDUM;
  const last = pitch(GEAR_SPECS[GEAR_SPECS.length - 1]) + ADDENDUM;
  const left = (400 - (first + xs[xs.length - 1] + last)) / 2 + first;
  return GEAR_SPECS.map((spec, i) => ({ ...spec, x: left + xs[i], y: ROWS[spec.row], pitch: pitch(spec) }));
})();

function gearTeethPath(teeth: number, pitch: number) {
  const outer = pitch + ADDENDUM;
  const inner = pitch - DEDENDUM;
  const step = (Math.PI * 2) / teeth;
  const points: string[] = [];
  for (let i = 0; i < teeth; i++) {
    for (const [offset, r] of [
      [-0.25, inner],
      [-0.11, outer],
      [0.11, outer],
      [0.25, inner],
    ] as const) {
      const angle = (i + offset) * step;
      points.push(`${(r * Math.cos(angle)).toFixed(2)} ${(r * Math.sin(angle)).toFixed(2)}`);
    }
  }
  return `M${points.join("L")}Z`;
}

/** Each gear's angle (degrees) when the drive gear is at 0, so that every neighbouring pair meshes. */
const GEAR_REF = (() => {
  const refs = [0];
  for (let i = 1; i < GEARS.length; i++) {
    const a = GEARS[i - 1];
    const b = GEARS[i];
    const toB = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    const stepA = 360 / a.teeth;
    const stepB = 360 / b.teeth;
    const fracA = ((((toB - refs[i - 1]) / stepA) % 1) + 1) % 1;
    refs.push(toB + 180 - stepB * (0.5 - fracA));
  }
  return refs;
})();

export function StakewiseMarkup() {
  return (
    <>
      {GEARS.map((gear) => {
        const R = gear.pitch + ADDENDUM + 2;
        const labelTop = gear.row === "low" ? gear.pitch + ADDENDUM + 8 : -(gear.pitch + ADDENDUM + 8 + gear.label.length * 15);
        return (
          <div key={gear.el} className={styles.gearUnit} data-el={gear.el} style={{ left: gear.x, top: gear.y }}>
            <div className={styles.gearBody} data-el={`${gear.el}Body`}>
              <svg className={styles.gearTeeth} data-el={`${gear.el}Teeth`} viewBox={`${-R} ${-R} ${R * 2} ${R * 2}`} style={{ left: -R, top: -R, width: R * 2, height: R * 2 }} aria-hidden="true">
                <path d={gearTeethPath(gear.teeth, gear.pitch)} fill={gear.color} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
              </svg>
              <div
                className={styles.gearHub}
                data-el={`${gear.el}Hub`}
                style={{ left: -gear.hub / 2, top: -gear.hub / 2, width: gear.hub, height: gear.hub, background: gear.el === "gD" ? INK : "#ffffff" }}
              >
                {gear.icon}
              </div>
            </div>
            <div className={styles.gearLabel} style={{ top: labelTop }}>
              {gear.label.map((line) => (
                <div key={line}>
                  {line}
                  {gear.el === "gD" ? <span className={styles.lamp} data-el="lamp" /> : null}
                </div>
              ))}
            </div>
            <RingPops el={`${gear.el}Pops`} x={0} y={0} r={gear.pitch + ADDENDUM} count={10} />
          </div>
        );
      })}
    </>
  );
}

export function buildStakewise(canvas: HTMLElement) {
  const LOOP = 6.4;
  const drive = GEARS[0];
  /** Drive speed: eight teeth per loop, so the loop joins up seamlessly. */
  const omega = (8 * 360) / drive.teeth / LOOP;
  const teeth = GEARS.map((gear) => byEl(canvas, `${gear.el}Teeth`));
  const units = GEARS.map((gear) => byEl(canvas, gear.el));
  const bodies = GEARS.map((gear) => byEl(canvas, `${gear.el}Body`));
  const hubs = GEARS.map((gear) => byEl(canvas, `${gear.el}Hub`));
  const pops = GEARS.map((gear) => byEl(canvas, `${gear.el}Pops`));
  const lamp = byEl(canvas, "lamp");
  /** Each gear's angle while the train is connected up to it. */
  const angle = (i: number, t: number) => GEAR_REF[i] + (i % 2 ? -1 : 1) * (drive.teeth / GEARS[i].teeth) * omega * t;
  // When each gear meshes (contact) and when it starts to slide out; the Definica gear follows gear C.
  const ENGAGE = [0, 0.8, 1.6, 2.4, 2.4];
  const DISENGAGE = [LOOP, 5.3, 4.9, 4.5, 4.5];
  const slideOffset = (i: number) => (GEARS[i].row === "up" ? -SLIDE : SLIDE);

  prepare(canvas);
  gsap.set(teeth, { transformOrigin: "50% 50%" });
  gsap.set(lamp, { backgroundColor: "#d1d6d2" });
  GEARS.forEach((_, i) => {
    if (i === 0) return;
    gsap.set(teeth[i], { rotation: angle(i, DISENGAGE[i]) });
    if (i < 4) gsap.set(units[i], { y: slideOffset(i) });
  });

  const tl = gsap.timeline({ paused: true, repeat: -1 });
  // The engine runs the whole time.
  tl.fromTo(teeth[0], { rotation: 0 }, { rotation: omega * LOOP, duration: LOOP, ease: "none", immediateRender: false }, 0);

  GEARS.forEach((gear, i) => {
    if (i === 0) return;
    const step = 360 / gear.teeth;
    const held = angle(i, DISENGAGE[i]);
    const start = angle(i, ENGAGE[i]);
    // Line the teeth up with the turning neighbour as the gear arrives, then turn with the train.
    const target = start + Math.round((held - start) / step) * step;
    const turn = angle(i, DISENGAGE[i]) - start;
    tl.to(teeth[i], { rotation: target, duration: 0.4, ease: "power1.inOut" }, ENGAGE[i] - 0.4).to(
      teeth[i],
      { rotation: target + turn, duration: DISENGAGE[i] - ENGAGE[i], ease: "none" },
      ENGAGE[i],
    );
    if (i < 4) {
      // Slide in and mesh with a clunk; slide back out later.
      tl.to(units[i], { y: 0, duration: 0.4, ease: "power2.in" }, ENGAGE[i] - 0.4)
        .to(bodies[i], { scale: 1.07, duration: 0.08, ease: "power2.out" }, ENGAGE[i])
        .to(bodies[i], { scale: 1, duration: 0.55, ease: "elastic.out(1, 0.4)" }, ENGAGE[i] + 0.08)
        .to(units[i], { y: slideOffset(i), duration: 0.42, ease: "power2.out" }, DISENGAGE[i]);
      flash(tl, pops[i], ENGAGE[i] + 0.02);
      tl.to(hubs[i], { scale: 1.15, duration: 0.09, ease: "power2.out", yoyo: true, repeat: 1 }, ENGAGE[i] + 0.04);
    }
  });

  // The last connection reaches Definica: its gear turns and the lamp lights.
  tl.to(lamp, { backgroundColor: "#05c92f", duration: 0.15 }, ENGAGE[4] + 0.1)
    .to(lamp, { scale: 1.4, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1 }, ENGAGE[4] + 0.1)
    .to(hubs[4], { scale: 1.2, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1 }, ENGAGE[4] + 0.1)
    .to(lamp, { backgroundColor: "#d1d6d2", duration: 0.2 }, DISENGAGE[4]);
  flash(tl, pops[4], ENGAGE[4] + 0.1);

  hold(tl, LOOP);
  return tl;
}

/* ---------- 6. New stake for StakeWise: integrations bring new users' ETH ---------- */

const CHANNELS: { y: number; color: string; label: string; icon: ReactNode }[] = [
  { y: 96, color: "#9dc4f5", label: "Wallets", icon: <WalletIcon /> },
  { y: 200, color: "#fbe74e", label: "Portfolio apps", icon: <ChartIcon /> },
  { y: 304, color: "#e2f2e5", label: "Aggregators", icon: <GridIcon /> },
];
const GROW = { channelX: 62, trunkX: 128, app: [200, 200], stakewise: [334, 200] } as const;
const GROW_IN = CHANNELS.map(({ y }) =>
  y === GROW.app[1]
    ? route([[GROW.channelX, y], GROW.app])
    : route([[GROW.channelX, y], [GROW.trunkX, y], [GROW.trunkX, GROW.app[1]], GROW.app]),
);
const GROW_OUT = route([GROW.app, GROW.stakewise]);
const METER = { left: 290, top: 272, width: 88 };

export function GrowthMarkup() {
  return (
    <>
      <Pipes routes={[...GROW_IN, GROW_OUT]} />
      {CHANNELS.map(({ y, color, label, icon }, i) => (
        <Station key={label} el={`channel${i}`} x={GROW.channelX} y={y} size={64} color={color} label={label}>
          {icon}
        </Station>
      ))}
      <Station el="app" x={GROW.app[0]} y={GROW.app[1]} size={84} color={INK} label="Definica">
        <DefinicaMark color="#d1f500" accent={null} />
      </Station>
      <Station el="stakewise" x={GROW.stakewise[0]} y={GROW.stakewise[1]} size={84} color="#ffcadc" glyph="stakewise-vault" label="StakeWise" labelSide="above" />
      <div className={styles.binLabel} style={{ left: METER.left - 20, top: METER.top - 22, width: METER.width + 40 }}>
        NET NEW ETH
      </div>
      <div className={styles.segMeter} data-el="meter" style={{ left: METER.left, top: METER.top, width: METER.width }}>
        {CHANNELS.map(({ label }) => (
          <span key={label} data-el="segment" />
        ))}
      </div>
      {CHANNELS.map(({ label }) => (
        <Token key={label} el="newEth" size={34} />
      ))}
    </>
  );
}

export function buildGrowth(canvas: HTMLElement) {
  const channels = CHANNELS.map((_, i) => port(canvas, `channel${i}`));
  const app = port(canvas, "app");
  const stakewise = port(canvas, "stakewise");
  const coins = allEl(canvas, "newEth");
  const segments = allEl(canvas, "segment");
  const meter = byEl(canvas, "meter");
  const SPEED = 280;
  const COIN = 34;

  prepare(canvas);
  coins.forEach((coin, i) => gsap.set(coin, { x: GROW.channelX, y: CHANNELS[i].y, scale: 0.8 }));
  gsap.set(segments, { backgroundColor: "#ffffff" });

  const tl = gsap.timeline({ paused: true, repeat: -1 });
  // New users' ETH arrives through each integration, evenly spaced into Definica, then on to StakeWise;
  // each arrival adds to the net new ETH meter.
  let last = 0;
  coins.forEach((coin, i) => {
    const rt = GROW_IN[i];
    const arrive = 1.05 + i * 0.85;
    const start = arrive - (rt.length - 42 + COIN / 2) / SPEED;
    const into = ride(tl, coin, rt, start, { from: channels[i], to: app, size: COIN, speed: SPEED });
    const out = ride(tl, coin, GROW_OUT, into.inside + 0.45, { from: app, to: stakewise, size: COIN, speed: SPEED });
    tl.to(segments[i], { backgroundColor: "#d1f500", duration: 0.12 }, out.inside + 0.05);
    tl.to(meter, { scale: 1.06, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1 }, out.inside + 0.05);
    last = out.inside;
  });
  // The meter is read, then clears for the next period.
  const loop = last + 2.0;
  tl.to(segments.slice().reverse(), { backgroundColor: "#ffffff", duration: 0.2, stagger: 0.12 }, loop - 0.85);
  hold(tl, loop);
  return tl;
}
