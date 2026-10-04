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
import { buildStage1, buildStage2, buildStage3, Stage1Markup, Stage2Markup, Stage3Markup } from "./transparencyScenes";
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
  // "Stake, lock, borrow." stage cards (the videos were shown 16:9)
  stage1: { Markup: Stage1Markup, build: buildStage1, width: 480, height: 270 },
  stage2: { Markup: Stage2Markup, build: buildStage2, width: 480, height: 270 },
  stage3: { Markup: Stage3Markup, build: buildStage3, width: 480, height: 270 },
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
