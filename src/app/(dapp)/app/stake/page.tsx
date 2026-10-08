import type { Metadata } from "next";
import { StakeScreen } from "@/components/dapp/screens/StakeScreen";

export const metadata: Metadata = { title: "Stake ETH", description: "Stake ETH in the Definica Vault: no validator to run, rewards at every harvest." };

export default function StakePage() {
  return <StakeScreen />;
}
