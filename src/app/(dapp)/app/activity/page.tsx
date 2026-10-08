import type { Metadata } from "next";
import { ActivityScreen } from "@/components/dapp/screens/ActivityScreen";

export const metadata: Metadata = { title: "Activity" };

export default function ActivityPage() {
  return <ActivityScreen />;
}
