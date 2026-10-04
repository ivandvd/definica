import { gsap } from "../../../shared/gsap";
import { DefinicaMark } from "../kit";
import { allEl, byEl } from "../motion";
import styles from "../phone.module.css";
import { STICKERS } from "../stickers";

/* Intro loop shown before the stages: Definica stickers burst out of the mark and drift off-screen. */

export function IntroMarkup() {
  return (
    <div className={`${styles.layer} ${styles.intro}`}>
      {STICKERS.map(({ Component }, index) => (
        <Component key={index} />
      ))}
      <div className={styles.introMark} data-el="mark">
        <DefinicaMark />
      </div>
    </div>
  );
}

const LOOP = 2.5;

export function buildIntro(canvas: HTMLElement) {
  const mark = byEl(canvas, "mark");
  const stickers = allEl(canvas, "sticker");

  gsap.set(stickers, { autoAlpha: 0, scale: 0.2 });

  const tl = gsap.timeline({ paused: true, repeat: -1 });

  tl.fromTo(mark, { scale: 1 }, { scale: 0.88, duration: 0.12, ease: "power2.in" }, 0.02).to(
    mark,
    { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.45)" },
    0.14,
  );

  STICKERS.forEach(({ angle, distance, rotation }, i) => {
    const sticker = stickers[i];
    const rad = (angle * Math.PI) / 180;
    const start = 0.1 + i * 0.018;
    const exit = distance + 260;
    tl.fromTo(
      sticker,
      { x: 0, y: 0, scale: 0.2, rotation: rotation * -1.5, autoAlpha: 0 },
      {
        x: Math.cos(rad) * distance,
        y: Math.sin(rad) * distance,
        scale: 1,
        rotation,
        autoAlpha: 1,
        duration: 0.6,
        ease: "power3.out",
        immediateRender: false,
      },
      start,
    ).to(
      sticker,
      { x: Math.cos(rad) * exit, y: Math.sin(rad) * exit, rotation: rotation * 1.6, duration: LOOP - start - 0.6, ease: "power1.in" },
      start + 0.6,
    );
  });

  return tl;
}
