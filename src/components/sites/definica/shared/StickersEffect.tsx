"use client";

import { useEffect, useImperativeHandle, useRef, type HTMLAttributes, type Ref } from "react";
import { ASSET_BASE } from "./content";
import { getDevice } from "./device";
import { gsap } from "./gsap";
import { useObserve } from "./observe";

export type StickersEffectItemSize = "default" | "small";

/** What the original item exposes to `StickersEffect` (`expose({ rect, refEl, isActive })`). */
export interface StickersEffectItemHandle {
  readonly rect: DOMRect | null;
  readonly refEl: HTMLDivElement | null;
  isActive: () => boolean;
}

interface StickersEffectItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "className"> {
  name?: string | null;
  size?: StickersEffectItemSize;
  ref?: Ref<StickersEffectItemHandle>;
}

/** Port of `StickersEffectItem` (scope data-v-f798db2b). The class-name typo is the original's. */
export function StickersEffectItem({ name = null, size = "default", ref, ...rest }: StickersEffectItemProps) {
  const refEl = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      get rect() {
        return rect.current;
      },
      get refEl() {
        return refEl.current;
      },
      // Original: `gsap.isTweening(el) || el?.style.opacity !== 0`. `style.opacity` is a
      // string, so the strict comparison with the number 0 is always true.
      isActive: () => true,
    }),
    [],
  );

  useEffect(() => {
    const el = refEl.current;
    if (!el) return;
    const updateRect = () => {
      rect.current = el.getBoundingClientRect();
    };
    updateRect();
    // The observer also fires once on observe(), which is what writes the initial inline style.
    const observer = new ResizeObserver(() => {
      gsap.set(el, { scale: 1, x: 0, y: 0, opacity: 0 });
      updateRect();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div {...rest} ref={refEl} data-v-f798db2b="" className={`StickersEffetctItem --size-${size}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-v-f798db2b="" src={`${ASSET_BASE}/images/stickers/${name}.svg`} loading="lazy" alt="" />
    </div>
  );
}

const stickerSet = (prefix: string, count = 5) =>
  Array.from({ length: count * 2 }, (_, i) => `${prefix}sticker-${(i % count) + 1}_clean`);

/** The footer stickers (six Definica stickers), each shown twice per cycle. */
const STICKERS = {
  default: stickerSet("", 6),
} as const;

export type StickersEffectPageType = keyof typeof STICKERS;

interface StickersEffectProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "className"> {
  pageType?: StickersEffectPageType;
  isActive?: boolean;
}

interface Point {
  x: number;
  y: number;
}

const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;
const distance = (x1: number, y1: number, x2: number, y2: number) => Math.hypot(x2 - x1, y2 - y1);

/** Distance (px) the mouse must travel before the next sticker is dropped. */
const THRESHOLD = 100;

/**
 * Port of `StickersEffect` (scope data-v-357233d0): a desktop-only mouse trail that drops
 * stickers along the pointer path while the element is in view. Pass the parent's scope
 * attribute (e.g. `data-v-b3bc0079=""`) through the rest props.
 */
export function StickersEffect({ pageType = "default", isActive = true, ...rest }: StickersEffectProps) {
  const refEl = useRef<HTMLDivElement>(null);
  const refArea = useRef<HTMLDivElement>(null);
  const refImages = useRef<(StickersEffectItemHandle | null)[]>([]);

  const isActiveRef = useRef(isActive);
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const isRunning = useRef(false);
  useObserve(refEl, {
    onEnter: () => {
      isRunning.current = true;
    },
    onLeave: () => {
      isRunning.current = false;
    },
    once: false,
  });

  useEffect(() => {
    if (!getDevice().desktop) return;

    const images = refImages.current.filter((item): item is StickersEffectItemHandle => item !== null);
    const imagesTotal = images.length;
    let lastMousePos: Point = { x: 0, y: 0 };
    let mousePos: Point = { x: 0, y: 0 };
    const cacheMousePos: Point = { x: 0, y: 0 };
    let imgPosition = 0;
    let zIndexVal = 1;

    const onMouseMove = (event: MouseEvent) => {
      const el = refEl.current;
      const area = refArea.current;
      if (!isRunning.current || !el || !area) return;
      const x = event.pageX;
      const y = event.pageY - el.getBoundingClientRect().y - window.scrollY;
      if (y > area.offsetHeight) return;
      mousePos = { x, y };
    };

    const showNextImage = () => {
      const image = images[imgPosition];
      const el = image?.refEl;
      const rect = image?.rect;
      if (!el || !rect) return;
      gsap.killTweensOf(el);
      gsap
        .timeline()
        .set(
          el,
          {
            startAt: { opacity: 0, scale: 1 },
            opacity: 1,
            scale: 1,
            rotate: 20,
            zIndex: zIndexVal,
            x: cacheMousePos.x - rect.width / 2,
            y: cacheMousePos.y - rect.height / 2,
          },
          0,
        )
        .to(
          el,
          {
            ease: "expo.out",
            rotate: 0,
            x: mousePos.x - rect.width / 2,
            y: mousePos.y - rect.height / 2,
            duration: 1,
          },
          0,
        )
        .to(el, { ease: "none", opacity: 0, duration: 0.3 }, 0.5)
        .to(el, { ease: "power3.inOut", scale: 0.2, duration: 0.5 }, 0.4);
    };

    const tick = () => {
      if (!isRunning.current || !isActiveRef.current) return;
      const dist = distance(mousePos.x, mousePos.y, lastMousePos.x, lastMousePos.y);
      cacheMousePos.x = lerp(cacheMousePos.x || mousePos.x, mousePos.x, 0.1);
      cacheMousePos.y = lerp(cacheMousePos.y || mousePos.y, mousePos.y, 0.1);
      if (dist > THRESHOLD) {
        showNextImage();
        ++zIndexVal;
        imgPosition = imgPosition < imagesTotal - 1 ? imgPosition + 1 : 0;
        lastMousePos = mousePos;
      }
      // Reset the z-index counter once every sticker is idle (never happens in practice:
      // the original `isActive()` is always true, see StickersEffectItem).
      if (zIndexVal !== 1 && images.every((image) => !image.isActive())) zIndexVal = 1;
    };

    window.addEventListener("mousemove", onMouseMove);
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div {...rest} ref={refEl} data-v-357233d0="" className="StickersEffect" aria-hidden="true">
      <div ref={refArea} data-v-357233d0="" className="StickersEffect-area" />
      {STICKERS[pageType].map((name, index) => (
        <StickersEffectItem
          key={index}
          ref={(handle) => {
            refImages.current[index] = handle;
          }}
          data-v-357233d0=""
          name={name}
          size={pageType !== "default" ? "small" : "default"}
        />
      ))}
    </div>
  );
}
