import type { Metadata } from "next";
import { HomeScreen } from "@/components/dapp/screens/HomeScreen";

export const metadata: Metadata = { title: "Home" };

export default function HomePage() {
  return <HomeScreen />;
}
