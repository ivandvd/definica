"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { ButtonLink } from "../ui/Button";
import { ArtBorrow, ArtLiquidity } from "../ui/art";
import { SoonPill } from "../ui/Pill";

interface Teaser {
  title: string;
  lead: string;
  art: ReactNode;
  points: { title: string; text: string }[];
  docs: string;
}

const TEASERS: Record<"liquidity" | "borrowing", Teaser> = {
  liquidity: {
    title: "Liquidity Module",
    lead: "Put osETH to work: supply it to Aave V3 and commit the position for a fixed term, with optional financing that supplies the borrowing markets.",
    art: <ArtLiquidity className="w-[220px] sm:w-[260px]" />,
    points: [
      { title: "Commit for a fixed term", text: "Lock aEthosETH under the Module's published rules, with lock incentives where a programme runs." },
      { title: "Every layer on its own line", text: "osETH exposure, Aave supply interest, incentives and any lending income, never blended." },
      { title: "Financing only if you choose", text: "A funding loan is opt-in, shown with its rate, LTV and health before you authorise it." },
    ],
    docs: "/docs/app/liquidity-and-borrowing#liquidity-module",
  },
  borrowing: {
    title: "Borrow",
    lead: "Borrow ETH against osETH, or lend ETH to the markets and earn 75% of the interest attributable to you.",
    art: <ArtBorrow className="w-[220px] sm:w-[260px]" />,
    points: [
      { title: "Borrow against osETH", text: "Your collateral keeps earning through the osETH rate while it backs the loan." },
      { title: "Health you can read", text: "A number, a word and a bar, with every action's effect shown before you confirm." },
      { title: "Lend ETH", text: "Supply the markets directly, with no funding debt, and withdraw what isn't lent out." },
    ],
    docs: "/docs/app/liquidity-and-borrowing#borrow",
  },
};

/** What a section that isn't open yet will do: one clear page, with the way back to staking. */
export function ComingSoonScreen({ feature }: { feature: "liquidity" | "borrowing" }) {
  const teaser = TEASERS[feature];
  return (
    <section className="overflow-hidden rounded-card bg-card">
      <div className="grid items-center gap-6 p-6 sm:p-10 xl:grid-cols-[minmax(0,1fr)_340px] lg:p-12">
        <div>
          <SoonPill />
          <h1 className="mt-4 text-[34px] leading-[1.05] font-extrabold tracking-[-0.025em] sm:text-[44px]">{teaser.title}</h1>
          <p className="mt-3 max-w-xl text-[15px] leading-6 text-ink-2">{teaser.lead}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <ButtonLink href="/app/stake" size="lg" trailing={<ArrowRight />}>
              Stake ETH meanwhile
            </ButtonLink>
            <ButtonLink href={teaser.docs} size="lg" variant="soft" trailing={<ArrowUpRight />}>
              How it will work
            </ButtonLink>
          </div>
        </div>
        <div className="flex justify-center rounded-[20px] bg-[#f7f9f7] py-8 lg:py-12">{teaser.art}</div>
      </div>
      <ul className="grid gap-3 border-t border-line-soft p-6 sm:p-10 md:grid-cols-3 lg:px-12">
        {teaser.points.map((point, i) => (
          <li key={point.title} className="rounded-[16px] bg-canvas p-4" style={{ animation: `rise 0.55s var(--ease-out-soft) ${150 + i * 80}ms both` }}>
            <div className="text-sm font-bold">{point.title}</div>
            <p className="mt-1 text-[13px] leading-5 text-ink-2">{point.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
