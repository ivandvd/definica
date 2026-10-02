"use client";

import { useEffect, useImperativeHandle, useRef, useState, type HTMLAttributes, type Ref } from "react";
import { getDevice } from "../shared/device";
import { Draggable, gsap, ScrollTrigger } from "../shared/gsap";
import { useObserve } from "../shared/observe";
import { BlockchainsWheelItem, type Blockchain } from "./BlockchainsWheelItem";

export interface BlockchainsWheelHandle {
  /** Spins the wheel to the item at `index`; `replaced` adds a full extra turn (used when the slot's content was swapped). */
  goTo: (index: number, replaced?: boolean) => void;
}

export interface BlockchainsWheelProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onDrag"> {
  blockchains?: Blockchain[];
  onDrag?: () => void;
  ref?: Ref<BlockchainsWheelHandle>;
}

const ITEM_DURATION = 1;
const ITEM_STAGGER = 0.1;
const START_OFFSET = 0;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const NO_BLOCKCHAINS: Blockchain[] = [];

/**
 * Port of `BlockchainsWheel` (scope data-v-38fa199d): an endless vertical wheel driven by a
 * scrubbed seamless-loop timeline. It idles on the ticker, follows scroll velocity and drag,
 * and `goTo` snaps it to a given item.
 */
export function BlockchainsWheel({ blockchains = NO_BLOCKCHAINS, onDrag, ref, className, ...rest }: BlockchainsWheelProps) {
  const refEl = useRef<HTMLDivElement>(null);
  const refDragProxy = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const inView = useRef(false);
  const goToRef = useRef<BlockchainsWheelHandle["goTo"] | null>(null);
  const onDragRef = useRef(onDrag);
  useEffect(() => {
    onDragRef.current = onDrag;
  });

  useEffect(() => {
    const el = refEl.current;
    const proxy = refDragProxy.current;
    if (!el || !proxy) return;

    const desktop = getDevice().desktop;
    const items = gsap.utils.toArray<HTMLElement>(el.querySelectorAll<HTMLElement>(".BlockchainsWheel-item"));
    const loopDuration = ITEM_STAGGER * items.length;
    const startTime = loopDuration + ITEM_DURATION * 0.5 + START_OFFSET;
    const scrub = { position: 0 };

    let tickerActive = true;
    let direction = 1;
    let current = 0;
    let goToTimeout: ReturnType<typeof setTimeout> | null = null;

    const rawTimeline = gsap.timeline({ paused: true, repeat: -1, ease: "power1.inOut" });

    [...items, ...items, ...items].forEach((item, index) => {
      const offsetX = desktop ? "14rem" : "10rem";
      const setCurrent = () => {
        current = Number(item.getAttribute("data-index"));
      };
      const itemTimeline = gsap
        .timeline()
        .set(item, { yPercent: 650 })
        .to(item, { duration: 0.1 }, 0)
        .to(item, { duration: 0.1 }, 0.9)
        .fromTo(
          item,
          { x: offsetX, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, immediateRender: false, ease: "none" },
          0,
        )
        .fromTo(
          item,
          { yPercent: 650 },
          { yPercent: -650, duration: 1, immediateRender: false, ease: "none" },
          0,
        )
        .fromTo(
          item,
          { x: 0, opacity: 1 },
          { x: offsetX, opacity: 0, duration: 0.5, immediateRender: false, ease: "none" },
          0.5,
        )
        .add(setCurrent, 0.35)
        .add(setCurrent, 0.44)
        .fromTo(
          item,
          { zIndex: 1 },
          { zIndex: items.length, repeat: 1, yoyo: true, ease: "none", duration: 0.5, immediateRender: false },
          0,
        );
      rawTimeline.add(itemTimeline, index * ITEM_STAGGER);
    });

    const loop = gsap.fromTo(
      rawTimeline,
      { totalTime: startTime },
      { totalTime: `+=${loopDuration}`, duration: 1, ease: "none", repeat: -1, paused: true },
    );
    const wrapTime = gsap.utils.wrap(0, loop.duration());
    const snapPosition = gsap.utils.snap(1 / items.length);

    const scrubTween = gsap.to(scrub, {
      position: 0,
      onUpdate: () => {
        loop.totalTime(wrapTime(scrub.position));
      },
      paused: true,
      duration: desktop ? 0.55 : 0.1,
      ease: "power3",
    });
    // The original retargets the tween by mutating `vars.position`, then invalidate + restart.
    const scrubVars = scrubTween.vars as gsap.TweenVars & { position: number };
    const moveTo = (position: number) => {
      scrubVars.position = position;
      scrubTween.invalidate().restart();
    };

    const setScrubDuration = (duration?: number) => {
      if (duration) {
        scrubTween.duration(duration);
        scrubTween.eventCallback("onComplete", () => setScrubDuration());
      } else {
        scrubTween.duration(getDevice().desktop ? 0.55 : 0.1);
        scrubTween.eventCallback("onComplete", null);
      }
    };

    const tick = () => {
      if (inView.current) moveTo(scrubVars.position + 7e-4 * direction);
    };
    const removeTicker = () => {
      if (tickerActive) {
        gsap.ticker.remove(tick);
        tickerActive = false;
      }
    };
    const addTicker = () => {
      if (!tickerActive) {
        gsap.ticker.add(tick);
        tickerActive = true;
      }
    };

    let dragStartOffset = 0;
    const [draggable] = Draggable.create(proxy, {
      type: "y",
      trigger: items,
      onPress() {
        dragStartOffset = scrubVars.position;
      },
      onDrag() {
        moveTo(dragStartOffset + (draggable.startY - draggable.y) * 0.001);
        setSelected(null);
        onDragRef.current?.();
      },
      onDragEnd() {
        moveTo(snapPosition(scrubVars.position));
        direction = draggable.getDirection("start") === "up" ? 1 : -1;
        addTicker();
      },
    });

    const scrollTrigger = ScrollTrigger.create({
      trigger: el,
      start: "-=" + window.innerHeight,
      end: "+=" + window.innerHeight * 3,
      horizontal: false,
      onUpdate: (self) => {
        if (!inView.current) return;
        moveTo(scrubVars.position + self.getVelocity() * 5e-6);
        direction = self.direction;
        setSelected(null);
      },
    });

    goToRef.current = (index, replaced) => {
      removeTicker();
      const extraTurn = replaced ? 1 : 0;
      const duration = 0.5 + Math.abs(current - (index + (extraTurn !== 0 ? items.length : 0))) * 0.1;
      setScrubDuration(clamp(duration, 0.5, 1.3));
      goToTimeout = setTimeout(() => {
        moveTo(snapPosition(scrubVars.position + (index - current) / items.length + extraTurn));
        setSelected(index);
      }, 0);
    };

    gsap.ticker.add(tick);

    return () => {
      goToRef.current = null;
      if (goToTimeout) clearTimeout(goToTimeout);
      removeTicker();
      scrubTween.kill();
      loop.kill();
      rawTimeline.kill();
      draggable.kill();
      scrollTrigger.kill();
    };
  }, []);

  useImperativeHandle(ref, () => ({ goTo: (index, replaced) => goToRef.current?.(index, replaced) }), []);

  useObserve(refEl, {
    onEnter: () => {
      inView.current = true;
    },
    onLeave: () => {
      inView.current = false;
    },
    once: false,
  });

  return (
    // className must stay stable: `useObserve` toggles `--in-view` through classList.
    <div {...rest} ref={refEl} data-v-38fa199d="" className={className ? `BlockchainsWheel ${className}` : "BlockchainsWheel"}>
      <div ref={refDragProxy} data-v-38fa199d="" className="drag-proxy" />
      {blockchains.map((blockchain, index) => (
        <div key={index} data-v-38fa199d="" className="BlockchainsWheel-item" data-index={index - 1}>
          <BlockchainsWheelItem data-v-38fa199d="" {...blockchain} selected={selected === index} />
        </div>
      ))}
    </div>
  );
}
