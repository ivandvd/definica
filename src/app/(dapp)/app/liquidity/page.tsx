import type { Metadata } from "next";
import { FEATURES } from "@/components/dapp/lib/features";
import { ComingSoonScreen } from "@/components/dapp/screens/ComingSoonScreen";
import { LiquidityScreen } from "@/components/dapp/screens/LiquidityScreen";

export const metadata: Metadata = { title: "Liquidity Module" };

export default function LiquidityPage() {
  return FEATURES.liquidity ? <LiquidityScreen /> : <ComingSoonScreen feature="liquidity" />;
}
