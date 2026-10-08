import type { Metadata } from "next";
import { LocksScreen } from "@/components/dapp/screens/LocksScreen";

export const metadata: Metadata = { title: "Share locks", description: "Lock Vault shares for 7 to 365 days and release them when they mature." };

export default function LocksPage() {
  return <LocksScreen />;
}
