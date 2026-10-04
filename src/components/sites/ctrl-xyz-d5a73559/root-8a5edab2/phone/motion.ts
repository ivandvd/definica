import { gsap } from "../../shared/gsap";

/* Helpers for building the phone screens' timelines. Elements are addressed by `data-el` names. */

export function byEl(root: ParentNode, name: string): HTMLElement {
  const node = root.querySelector<HTMLElement>(`[data-el="${name}"]`);
  if (!node) throw new Error(`Phone screen: missing [data-el="${name}"]`);
  return node;
}

export function allEl(root: ParentNode, name: string): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(`[data-el="${name}"]`));
}

/**
 * Centre of `target` in canvas coordinates, from layout offsets. Offsets ignore CSS transforms,
 * so targets can be measured while they are still off-screen or mid-animation.
 */
export function centerIn(target: HTMLElement, canvas: HTMLElement) {
  let x = target.offsetWidth / 2;
  let y = target.offsetHeight / 2;
  let node: HTMLElement | null = target;
  while (node && node !== canvas) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/** Places the cursor on `target` (no animation) and fades it in. */
export function showCursor(tl: gsap.core.Timeline, cursor: HTMLElement, target: HTMLElement, canvas: HTMLElement, at: number) {
  const { x, y } = centerIn(target, canvas);
  tl.set(cursor, { x: x + 26, y: y + 44, scale: 0.9 }, at)
    .to(cursor, { opacity: 1, duration: 0.25, ease: "power1.out" }, at)
    .to(cursor, { x, y, scale: 1, duration: 0.55, ease: "power2.out" }, at);
}

/** Glides the cursor to the centre of `target`. */
export function moveCursor(
  tl: gsap.core.Timeline,
  cursor: HTMLElement,
  target: HTMLElement,
  canvas: HTMLElement,
  at: number,
  duration = 0.6,
) {
  const { x, y } = centerIn(target, canvas);
  tl.to(cursor, { x, y, duration, ease: "power2.inOut" }, at);
}

/** A tap: the pointer presses towards its tip, a ring spreads from the tip, the tapped element dips. */
export function tap(tl: gsap.core.Timeline, cursor: HTMLElement, target: HTMLElement | null, at: number) {
  tl.to(cursor, { scale: 0.82, duration: 0.1, ease: "power2.out" }, at).to(
    cursor,
    { scale: 1, duration: 0.3, ease: "back.out(2)" },
    at + 0.12,
  );
  const ripple = cursor.querySelector<HTMLElement>('[data-el="ripple"]');
  if (ripple) {
    // A set rather than fromTo start values, so the ring shows however the playhead reaches it.
    tl.set(ripple, { scale: 0.3, autoAlpha: 1 }, at).to(
      ripple,
      { scale: 1.5, autoAlpha: 0, duration: 0.5, ease: "power2.out" },
      at,
    );
  }
  if (target) tl.to(target, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" }, at);
}

export function hideCursor(tl: gsap.core.Timeline, cursor: HTMLElement, at: number) {
  tl.to(cursor, { opacity: 0, scale: 0.85, duration: 0.3, ease: "power1.in" }, at);
}

/** Counts `el`'s text from `from` to `to`; holds `from` before `at` so loops restart cleanly. */
export function countUp(
  tl: gsap.core.Timeline,
  el: HTMLElement,
  from: number,
  to: number,
  decimals: number,
  at: number,
  duration: number,
) {
  const proxy = { v: from };
  const render = () => {
    el.textContent = proxy.v.toFixed(decimals);
  };
  tl.fromTo(proxy, { v: from }, { v: from, duration: Math.max(at, 0.01), ease: "none", onUpdate: render, immediateRender: false }, 0).to(
    proxy,
    { v: to, duration, ease: "power2.out", onUpdate: render },
    at,
  );
}

/**
 * Counts `el`'s text through several values with one proxy (so the steps never fight each other).
 * `steps` are [value, start time, duration]; the text shows `start` before the first step.
 */
export function countSteps(
  tl: gsap.core.Timeline,
  el: HTMLElement,
  start: number,
  decimals: number,
  steps: [number, number, number][],
) {
  const proxy = { v: start };
  const render = () => {
    el.textContent = proxy.v.toFixed(decimals);
  };
  tl.fromTo(proxy, { v: start }, { v: start, duration: Math.max(steps[0][1], 0.01), ease: "none", onUpdate: render, immediateRender: false }, 0);
  for (const [value, at, duration] of steps) {
    tl.to(proxy, { v: value, duration, ease: "power2.inOut", onUpdate: render }, at);
  }
}

/** Draws an SVG path from start to end. */
export function drawPath(tl: gsap.core.Timeline, path: SVGPathElement, at: number, duration: number) {
  const length = path.getTotalLength();
  tl.fromTo(
    path,
    { strokeDasharray: length, strokeDashoffset: length },
    { strokeDashoffset: 0, duration, ease: "power2.inOut", immediateRender: true },
    at,
  );
}
