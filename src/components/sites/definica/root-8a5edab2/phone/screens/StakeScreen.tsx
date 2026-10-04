import { gsap } from "../../../shared/gsap";
import { BottomNav, Cursor, EthDiamond, InfoIcon, LayersList, PositionCard, TopBar } from "../kit";
import { allEl, byEl, countUp, drawPath, hideCursor, moveCursor, showCursor, tap } from "../motion";
import styles from "../phone.module.css";

/*
 * Stage 1 — pooled staking: six ETH coins flip in the card, the cursor picks an amount and taps
 * Stake, the coins pool into one stack, and the screen builds into the position overview.
 */

const COIN_TONES = ["yellow", "pink", "green", "mint", "red", "blue"] as const;
const AMOUNTS = ["0.1 ETH", "1 ETH", "5 ETH"];

export function StakeMarkup() {
  return (
    <>
      <div className={`${styles.layer} ${styles.stakeIntro}`} data-el="intro">
        <div className={`${styles.screenTitle} ${styles.stakeTitle}`}>Stake ETH</div>
        <div className={styles.coinCard}>
          {COIN_TONES.map((tone) => (
            <div key={tone} className={styles.coin} data-tone={tone} data-el="coin">
              <span className={styles.coinEdge} data-el="coinEdge" />
              <span className={styles.coinFace} data-el="coinFace">
                <EthDiamond color="#0f0f0f" />
              </span>
            </div>
          ))}
        </div>
        <div className={`${styles.primaryButton} ${styles.stakeButton}`} data-el="stakeButton">
          <span className={styles.labelStack}>
            <span data-el="labelA">Stake ETH</span>
            <span className={styles.alt} data-el="labelB">
              Stake 1 ETH
            </span>
          </span>
        </div>
        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          No validator to run
          <InfoIcon />
          <span className={styles.dividerLine} />
        </div>
        <div className={styles.chips}>
          {AMOUNTS.map((label, index) => (
            <div key={label} className={styles.chip} data-el={`chip${index}`}>
              <div className={styles.chipFill} data-el={`chipFill${index}`} />
              <span data-el={`chipLabel${index}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.layer} ${styles.home}`} data-el="home">
        <div data-el="homeTop">
          <TopBar />
        </div>
        <PositionCard value="0.00" valueEl="value" dataEl="positionCard" lineEl="chartLine" fillEl="chartFill" />
        <LayersList headEl="layersHead" listEl="layers" rowEl="layerRow" />
        <BottomNav dataEl="nav" />
      </div>

      <Cursor />
    </>
  );
}

export function buildStake(canvas: HTMLElement) {
  const intro = byEl(canvas, "intro");
  const coins = allEl(canvas, "coin");
  const faces = allEl(canvas, "coinFace");
  const edges = allEl(canvas, "coinEdge");
  const button = byEl(canvas, "stakeButton");
  const labelA = byEl(canvas, "labelA");
  const labelB = byEl(canvas, "labelB");
  const chip = byEl(canvas, "chip1");
  const chipFill = byEl(canvas, "chipFill1");
  const chipLabel = byEl(canvas, "chipLabel1");
  const home = byEl(canvas, "home");
  const homeTop = byEl(canvas, "homeTop");
  const positionCard = byEl(canvas, "positionCard");
  const value = byEl(canvas, "value");
  const chartLine = canvas.querySelector<SVGPathElement>('[data-el="chartLine"]');
  const chartFill = byEl(canvas, "chartFill");
  const layersHead = byEl(canvas, "layersHead");
  const layers = byEl(canvas, "layers");
  const rows = allEl(canvas, "layerRow");
  const nav = byEl(canvas, "nav");
  const cursor = byEl(canvas, "cursor");

  gsap.set(home, { autoAlpha: 0 });
  gsap.set([homeTop, positionCard, layersHead, layers], { y: 70, autoAlpha: 0 });
  gsap.set(nav, { yPercent: 100 });

  const tl = gsap.timeline({ paused: true, repeat: -1 });

  // The coins turn edge-on and back, staggered, like the shapes in the original card.
  coins.forEach((_, i) => {
    const flip = (at: number) => {
      tl.to(faces[i], { scaleX: 0.14, duration: 0.26, ease: "power1.in" }, at)
        .to(edges[i], { x: 3.5, scaleX: 0.34, duration: 0.26, ease: "power1.in" }, at)
        .to(faces[i], { scaleX: 1, duration: 0.34, ease: "power1.out" }, at + 0.26)
        .to(edges[i], { x: 0, scaleX: 1, duration: 0.34, ease: "power1.out" }, at + 0.26);
    };
    flip(0.15 + i * 0.12);
    flip(1.3 + ((i * 4) % 6) * 0.09);
  });

  // Pick an amount.
  showCursor(tl, cursor, chip, canvas, 1.55);
  tap(tl, cursor, chip, 2.2);
  tl.to(chipFill, { opacity: 1, duration: 0.25, ease: "power1.out" }, 2.25)
    .to(chipLabel, { color: "#ffffff", duration: 0.25, ease: "power1.out" }, 2.25)
    .to(labelA, { yPercent: -70, opacity: 0, duration: 0.28, ease: "power2.in" }, 2.35)
    .fromTo(labelB, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.36, ease: "power2.out" }, 2.55);

  // Stake: the six coins pool into one stack in the middle of the card.
  moveCursor(tl, cursor, button, canvas, 2.75, 0.55);
  tap(tl, cursor, button, 3.35);
  coins.forEach((coin, i) => {
    tl.to(coin, { x: 70 - coin.offsetLeft, y: 52 - i * 4 - coin.offsetTop, duration: 0.55, ease: "power3.inOut" }, 3.45 + i * 0.035);
  });
  hideCursor(tl, cursor, 3.75);

  // The stake screen clears, then the position overview builds up from the bottom, as in the original.
  tl.to(intro, { autoAlpha: 0, y: -24, duration: 0.3, ease: "power2.in" }, 3.95)
    .set(home, { autoAlpha: 1 }, 4.25)
    .to(nav, { yPercent: 0, duration: 0.6, ease: "power3.out" }, 4.25)
    .to(homeTop, { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }, 4.3)
    .to(positionCard, { y: 0, autoAlpha: 1, duration: 0.75, ease: "power3.out" }, 4.36)
    .to(layersHead, { y: 0, autoAlpha: 1, duration: 0.75, ease: "power3.out" }, 4.48)
    .to(layers, { y: 0, autoAlpha: 1, duration: 0.75, ease: "power3.out" }, 4.54)
    .fromTo(rows, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.09 }, 4.7);
  countUp(tl, value, 0, 1, 2, 4.8, 1.1);
  if (chartLine) drawPath(tl, chartLine, 4.7, 1.4);
  tl.fromTo(chartFill, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "power1.out" }, 5.2);

  // Hold on the overview before looping, like the original.
  tl.to({}, { duration: 2.1 }, 6.0);
  return tl;
}
