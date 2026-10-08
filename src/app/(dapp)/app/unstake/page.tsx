import type { Metadata } from "next";
import { UnstakeScreen } from "@/components/dapp/screens/UnstakeScreen";

export const metadata: Metadata = { title: "Unstake", description: "Request an exit for your Vault shares, follow the exit queue and claim your ETH." };

export default function UnstakePage() {
  return <UnstakeScreen />;
}
