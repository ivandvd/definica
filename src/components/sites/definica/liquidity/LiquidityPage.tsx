"use client";

import { useRef } from "react";
import { useRefreshOnResize } from "../shared/motion";
import { RiskSection } from "../shared/page-kit/Blocks";
import { Closing } from "../shared/page-kit/Closing";
import kit from "../shared/page-kit/kit.module.css";
import { PageHero } from "../shared/page-kit/PageHero";
import { liquidity } from "./content";
import { ClosingStickers, CommitHero, HeroStickers } from "./LiquidityArt";
import { Financing, Leaving, Lines, Path, Rules } from "./sections";

/**
 * The Main Liquidity Module page, deeper than the home page's card: the committed-liquidity path,
 * optional financing, the separate lines of returns and obligations, the Module's rules, the way
 * out, the risks, and where to read on.
 */
export function LiquidityPage() {
  const ref = useRef<HTMLDivElement>(null);
  useRefreshOnResize(ref);
  const { hero, risks, closing } = liquidity;

  return (
    <div ref={ref} className={`${kit.page} Page`}>
      <PageHero {...hero} dotColor="baby" art={<CommitHero />} stickers={<HeroStickers />} />
      <Path />
      <Financing />
      <Lines />
      <Rules />
      <Leaving />
      <RiskSection head={risks} intro={risks.intro} items={risks.items} link={risks.link} tone="white" />
      <Closing {...closing} tone="grey" art={<ClosingStickers />} />
    </div>
  );
}
