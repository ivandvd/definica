"use client";

import type { ComponentType, Ref } from "react";
import type { gsap } from "../../shared/gsap";
import { useLoopTimeline, type LoopHandle } from "../scenes/useLoopTimeline";
import styles from "./phone.module.css";
import { BorrowMarkup, buildBorrow } from "./screens/BorrowScreen";
import { buildIntro, IntroMarkup } from "./screens/IntroScreen";
import { buildLiquidity, LiquidityMarkup } from "./screens/LiquidityScreen";
import { buildStake, StakeMarkup } from "./screens/StakeScreen";

/** Same controls as `BaseVideoVimeoLoop`, so the slice can drive a screen exactly like a video. */
export type PhoneScreenHandle = LoopHandle;

interface ScreenDefinition {
  Markup: ComponentType;
  build: (canvas: HTMLElement) => gsap.core.Timeline;
}

const SCREENS = {
  intro: { Markup: IntroMarkup, build: buildIntro },
  stake: { Markup: StakeMarkup, build: buildStake },
  liquidity: { Markup: LiquidityMarkup, build: buildLiquidity },
  borrow: { Markup: BorrowMarkup, build: buildBorrow },
} satisfies Record<string, ScreenDefinition>;

export type PhoneScreenName = keyof typeof SCREENS;

export const isPhoneScreenName = (name: unknown): name is PhoneScreenName =>
  typeof name === "string" && name in SCREENS;

interface PhoneScreenProps {
  screen: PhoneScreenName;
  className?: string;
  ref?: Ref<PhoneScreenHandle>;
}

/**
 * An animated app screen for the phone mock-up: live markup animated by a looping GSAP timeline,
 * played and paused by the slice like a video. It restarts on every play.
 */
export function PhoneScreen({ screen, className, ref }: PhoneScreenProps) {
  const { Markup, build } = SCREENS[screen];
  const { viewportRef, canvasRef } = useLoopTimeline({ build, designWidth: 360, restartOnPlay: true, still: "end", ref });

  return (
    <div ref={viewportRef} className={className ? `${styles.viewport} ${className}` : styles.viewport} aria-hidden="true">
      <div ref={canvasRef} className={styles.canvas}>
        <Markup />
      </div>
    </div>
  );
}
