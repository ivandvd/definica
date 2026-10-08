"use client";

import { useRef } from "react";
import { useRefreshOnResize } from "../shared/motion";
import { RiskSection } from "../shared/page-kit/Blocks";
import { Closing } from "../shared/page-kit/Closing";
import kit from "../shared/page-kit/kit.module.css";
import { PageHero } from "../shared/page-kit/PageHero";
import { staking } from "./content";
import { Exits, Flow, Locks, Rewards, Shares, Verify } from "./sections";
import { ClosingStickers, HeroStickers, VaultHero } from "./StakingArt";

/**
 * The staking page, deeper than the home page's card: how a deposit flows, how a share is priced,
 * where rewards come from and what fees apply, share locks, unstaking, what to verify onchain,
 * the risks, and the way into the app.
 */
export function StakingPage() {
  const ref = useRef<HTMLDivElement>(null);
  useRefreshOnResize(ref);
  const { hero, risks, closing } = staking;

  return (
    <div ref={ref} className={`${kit.page} Page`}>
      <PageHero {...hero} dotColor="green" art={<VaultHero />} stickers={<HeroStickers />} />
      <Flow />
      <Shares />
      <Rewards />
      <Locks />
      <Exits />
      <Verify />
      <RiskSection head={risks} intro={risks.intro} items={risks.items} link={risks.link} />
      <Closing {...closing} art={<ClosingStickers />} />
    </div>
  );
}
