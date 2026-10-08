"use client";

import type { ComponentType, HTMLAttributes, Ref } from "react";
import type { gsap } from "../../shared/gsap";
import {
  buildContracts,
  buildLayers,
  buildShares,
  ContractsMarkup,
  LayersMarkup,
  SharesMarkup,
} from "./positionScenes";
import {
  BorrowRiskMarkup,
  buildBorrowRisk,
  buildContract,
  buildMarket,
  buildValidators,
  ContractMarkup,
  MarketMarkup,
  ValidatorsMarkup,
} from "./riskScenes";
import {
  buildCommit,
  buildGrowth,
  buildPooled,
  buildReturns,
  buildStakewise,
  buildTreasury,
  CommitMarkup,
  GrowthMarkup,
  PooledMarkup,
  ReturnsMarkup,
  StakewiseMarkup,
  TreasuryMarkup,
} from "./machineScenes";
import styles from "./scenes.module.css";
import { buildPhase1, buildPhase2, buildPhase3, Phase1Markup, Phase2Markup, Phase3Markup } from "./transparencyScenes";
import { useLoopTimeline, type LoopHandle } from "./useLoopTimeline";

interface SceneDefinition {
  Markup: ComponentType;
  build: (canvas: HTMLElement) => gsap.core.Timeline;
  /** Design canvas size; its ratio matches the card slot the scene replaces a video in. */
  width: number;
  height: number;
}

const SCENES = {
  // "See every part of your position" (square, like the 1080x1080 videos)
  shares: { Markup: SharesMarkup, build: buildShares, width: 400, height: 400 },
  layers: { Markup: LayersMarkup, build: buildLayers, width: 400, height: 400 },
  contracts: { Markup: ContractsMarkup, build: buildContracts, width: 400, height: 400 },
  // "Stake, lock, borrow." phase cards (the videos were shown 16:9)
  phase1: { Markup: Phase1Markup, build: buildPhase1, width: 480, height: 270 },
  phase2: { Markup: Phase2Markup, build: buildPhase2, width: 480, height: 270 },
  phase3: { Markup: Phase3Markup, build: buildPhase3, width: 480, height: 270 },
  // "Risks, stated up front" (16:15)
  validators: { Markup: ValidatorsMarkup, build: buildValidators, width: 400, height: 375 },
  contract: { Markup: ContractMarkup, build: buildContract, width: 400, height: 375 },
  market: { Markup: MarketMarkup, build: buildMarket, width: 400, height: 375 },
  borrowRisk: { Markup: BorrowRiskMarkup, build: buildBorrowRisk, width: 400, height: 375 },
  // "Watch it work" machines (big vertical cards, square)
  pooled: { Markup: PooledMarkup, build: buildPooled, width: 400, height: 400 },
  treasury: { Markup: TreasuryMarkup, build: buildTreasury, width: 400, height: 400 },
  commit: { Markup: CommitMarkup, build: buildCommit, width: 400, height: 400 },
  returns: { Markup: ReturnsMarkup, build: buildReturns, width: 400, height: 400 },
  stakewise: { Markup: StakewiseMarkup, build: buildStakewise, width: 400, height: 400 },
  growth: { Markup: GrowthMarkup, build: buildGrowth, width: 400, height: 400 },
} satisfies Record<string, SceneDefinition>;

export type LoopSceneName = keyof typeof SCENES;
export type LoopSceneHandle = LoopHandle;

export const isLoopSceneName = (name: unknown): name is LoopSceneName => typeof name === "string" && name in SCENES;

interface LoopSceneProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  scene: LoopSceneName;
  /** Play whenever on screen, like an autoplaying video; otherwise the parent plays it (e.g. on hover). */
  autoplay?: boolean;
  ref?: Ref<LoopSceneHandle>;
}

/**
 * A looping animated illustration that stands in for a product video in a card: same slot, same
 * play/pause controls, transparent background so the card colour shows through.
 */
export function LoopScene({ scene, autoplay = false, className, style, ref, ...rest }: LoopSceneProps) {
  const { Markup, build, width, height } = SCENES[scene];
  const { viewportRef, canvasRef } = useLoopTimeline({ build, designWidth: width, autoplay, ref });

  return (
    <div
      ref={viewportRef}
      {...rest}
      className={className ? `${styles.root} ${className}` : styles.root}
      style={{ aspectRatio: `${width} / ${height}`, ...style }}
      aria-hidden="true"
    >
      <div ref={canvasRef} className={styles.canvas} style={{ width }}>
        <Markup />
      </div>
    </div>
  );
}
