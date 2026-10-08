"use client";

import { useRef } from "react";
import { useRefreshOnResize } from "../shared/motion";
import { RiskSection } from "../shared/page-kit/Blocks";
import { Closing } from "../shared/page-kit/Closing";
import kit from "../shared/page-kit/kit.module.css";
import { PageHero } from "../shared/page-kit/PageHero";
import { ClosingStickers, HeroStickers, ScaleHero } from "./BorrowingArt";
import { borrowing } from "./content";
import { Collateral, Health, Lending, Markets, Parameters, Rules } from "./sections";

/**
 * The borrowing page, deeper than the home page's card: the markets and who brings what,
 * collateral, the parameters and what each sets, the health factor and liquidation, the 75 / 25
 * split of lending interest, the four rules of every market, the risks, and where to read on.
 */
export function BorrowingPage() {
  const ref = useRef<HTMLDivElement>(null);
  useRefreshOnResize(ref);
  const { hero, risks, closing } = borrowing;

  return (
    <div ref={ref} className={`${kit.page} Page`}>
      <PageHero {...hero} dotColor="lemonade" art={<ScaleHero />} stickers={<HeroStickers />} />
      <Markets />
      <Collateral />
      <Parameters />
      <Health />
      <Lending />
      <Rules />
      <RiskSection head={risks} intro={risks.intro} items={risks.items} link={risks.link} />
      <Closing {...closing} art={<ClosingStickers />} />
    </div>
  );
}
