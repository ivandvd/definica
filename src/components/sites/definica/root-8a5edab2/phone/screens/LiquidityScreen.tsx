import { gsap } from "../../../shared/gsap";
import {
  BackIcon,
  Badge,
  BottomNav,
  ChevronIcon,
  CloseIcon,
  Cursor,
  InfoIcon,
  LayersList,
  PositionCard,
  TopBar,
} from "../kit";
import { byEl, countUp, hideCursor, moveCursor, showCursor, tap } from "../motion";
import styles from "../phone.module.css";

/*
 * Stage 2 — Main Liquidity Module (planned): a sheet over the dimmed overview, a toggle switching
 * on, then Lock → choose 50% → Review → Confirm, and the locked balance counting up.
 */

function LockBadge() {
  return (
    <svg className={styles.lockBadge} viewBox="0 0 38 38" aria-hidden="true" focusable="false">
      <path
        data-el="shackle"
        d="M12.5 17.5v-4a6.5 6.5 0 0 1 13 0v4"
        fill="none"
        stroke="#002012"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <rect data-el="lockBody" x="8" y="16.5" width="22" height="17" rx="4.5" fill="#ffffff" stroke="#002012" strokeWidth="2.6" />
      <circle cx="19" cy="24" r="2.3" fill="#002012" />
      <path d="M19 25.2v3.3" stroke="#002012" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  );
}

export function LiquidityMarkup() {
  return (
    <>
      <div className={`${styles.layer} ${styles.home}`}>
        <TopBar />
        <PositionCard value="1.00" />
        <LayersList />
        <BottomNav />
      </div>
      <div className={`${styles.layer} ${styles.overlay}`} />

      <div className={styles.sheet} data-el="sheet">
        <div className={styles.pane} data-el="paneA">
          <div className={styles.sheetHeader}>
            <InfoIcon />
            <span>Liquidity Module</span>
            <CloseIcon />
          </div>
          <div className={styles.sheetCard}>
            <div className={styles.sheetLabel}>
              Locked aEthosETH
              <span className={`${styles.pill} ${styles.pillGrey}`}>Planned</span>
            </div>
            <div className={styles.sheetValue}>
              <span data-el="lockedValue">0.00</span>
            </div>
            <LockBadge />
            <div className={styles.rule} />
            <div className={styles.toggleRow}>
              <div>
                <div className={styles.toggleTitle}>Show each layer separately</div>
                <div className={styles.toggleText}>Staking, Aave supply interest and incentives are never blended.</div>
              </div>
              <span className={styles.toggle}>
                <span className={styles.toggleFill} data-el="toggleFill" />
                <span className={styles.toggleKnob} data-el="toggleKnob" />
              </span>
            </div>
          </div>
          <div className={styles.buttonRow}>
            <div className={styles.secondaryButton}>Unlock</div>
            <div className={styles.primaryButton} data-el="lockButton">
              Lock
            </div>
          </div>
        </div>

        <div className={styles.pane} data-el="paneB">
          <div className={styles.sheetHeader}>
            <BackIcon />
            <span>Lock amount</span>
            <CloseIcon />
          </div>
          <div className={`${styles.sheetCard} ${styles.center}`}>
            <Badge glyph="aethoseth" color="#9dc4f5" size={40} />
            <div className={styles.tokenName}>aEthosETH</div>
            <div className={styles.tokenSub}>0.80 available</div>
            <div className={styles.amount}>
              <span data-el="amount">0.08</span>
            </div>
            <div className={styles.tokenSub}>aEthosETH</div>
            <div className={styles.segment}>
              <div className={styles.segmentThumb} data-el="thumb" />
              <span>Min</span>
              <span data-el="half">50%</span>
              <span>Max</span>
            </div>
          </div>
          <div className={`${styles.primaryButton} ${styles.fullButton}`} data-el="reviewButton">
            Review
          </div>
        </div>

        <div className={styles.pane} data-el="paneC">
          <div className={styles.sheetHeader}>
            <BackIcon />
            <span>Confirm lock</span>
            <CloseIcon />
          </div>
          <div className={styles.flowIcons}>
            <Badge glyph="oseth" color="#e2f2e5" size={34} />
            <ChevronIcon />
            <Badge glyph="aethoseth" color="#9dc4f5" size={34} />
          </div>
          <div className={styles.sheetCard}>
            <div className={styles.kvRow}>
              <span>Supplied to</span>
              <span>Aave V3</span>
            </div>
            <div className={styles.kvRow}>
              <span>Position</span>
              <span>aEthosETH</span>
            </div>
          </div>
          <div className={styles.sheetCard}>
            <div className={styles.kvRow}>
              <span>
                Lock rules
                <InfoIcon />
              </span>
              <span>Published with the module</span>
            </div>
          </div>
          <div className={styles.sheetNote}>Supply interest and incentives are reported separately.</div>
          <div className={styles.primaryButton} data-el="confirmButton">
            Confirm
          </div>
        </div>
      </div>

      <Cursor />
    </>
  );
}

export function buildLiquidity(canvas: HTMLElement) {
  const sheet = byEl(canvas, "sheet");
  const paneA = byEl(canvas, "paneA");
  const paneB = byEl(canvas, "paneB");
  const paneC = byEl(canvas, "paneC");
  const lockedValue = byEl(canvas, "lockedValue");
  const shackle = byEl(canvas, "shackle");
  const lockBody = byEl(canvas, "lockBody");
  const toggleFill = byEl(canvas, "toggleFill");
  const toggleKnob = byEl(canvas, "toggleKnob");
  const lockButton = byEl(canvas, "lockButton");
  const amount = byEl(canvas, "amount");
  const thumb = byEl(canvas, "thumb");
  const half = byEl(canvas, "half");
  const reviewButton = byEl(canvas, "reviewButton");
  const confirmButton = byEl(canvas, "confirmButton");
  const cursor = byEl(canvas, "cursor");

  const heightA = paneA.offsetHeight;
  const heightB = paneB.offsetHeight;
  const heightC = paneC.offsetHeight;

  gsap.set(sheet, { height: heightA });
  gsap.set([paneB, paneC], { autoAlpha: 0, x: 28 });
  gsap.set(shackle, { y: -4.5 });

  const tl = gsap.timeline({ paused: true, repeat: -1 });

  /** Swaps the sheet's content: the old pane slides out left, the sheet resizes, the new pane slides in. */
  const swap = (from: HTMLElement, to: HTMLElement, height: number, at: number) => {
    tl.to(from, { autoAlpha: 0, x: -28, duration: 0.3, ease: "power2.in" }, at)
      .to(sheet, { height, duration: 0.55, ease: "power3.inOut" }, at + 0.05)
      // immediateRender: false, or returning to the first pane would hide it from the start.
      .fromTo(
        to,
        { autoAlpha: 0, x: 28 },
        { autoAlpha: 1, x: 0, duration: 0.45, ease: "power3.out", immediateRender: false },
        at + 0.25,
      );
  };

  // The toggle switches on and the lock closes.
  tl.to(toggleFill, { opacity: 1, duration: 0.3, ease: "power1.inOut" }, 0.9)
    .to(toggleKnob, { x: 16, borderColor: "#ffffff", duration: 0.35, ease: "power2.inOut" }, 0.9)
    .to(shackle, { y: 0, duration: 0.35, ease: "back.out(2.5)" }, 1.15)
    .to(lockBody, { fill: "#d1f500", duration: 0.3, ease: "power1.out" }, 1.2);

  // Lock → amount sheet.
  showCursor(tl, cursor, lockButton, canvas, 2.4);
  tap(tl, cursor, lockButton, 3.1);
  swap(paneA, paneB, heightB, 3.35);

  // Choose 50%.
  moveCursor(tl, cursor, half, canvas, 4.35, 0.55);
  tap(tl, cursor, null, 4.95);
  tl.to(thumb, { x: 62, duration: 0.35, ease: "power2.inOut" }, 5.0);
  countUp(tl, amount, 0.08, 0.4, 2, 5.05, 0.55);

  // Review → confirmation sheet.
  moveCursor(tl, cursor, reviewButton, canvas, 5.85, 0.55);
  tap(tl, cursor, reviewButton, 6.45);
  swap(paneB, paneC, heightC, 6.7);

  // Confirm → back to the module, with the locked balance counting up.
  moveCursor(tl, cursor, confirmButton, canvas, 7.6, 0.55);
  tap(tl, cursor, confirmButton, 8.2);
  hideCursor(tl, cursor, 8.5);
  swap(paneC, paneA, heightA, 8.45);
  countUp(tl, lockedValue, 0, 0.4, 2, 9.0, 1.0);

  tl.to({}, { duration: 2.4 }, 10.0);
  return tl;
}
