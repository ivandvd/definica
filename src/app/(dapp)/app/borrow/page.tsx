import type { Metadata } from "next";
import { FEATURES } from "@/components/dapp/lib/features";
import { BorrowScreen } from "@/components/dapp/screens/BorrowScreen";
import { ComingSoonScreen } from "@/components/dapp/screens/ComingSoonScreen";

export const metadata: Metadata = { title: "Borrow" };

export default function BorrowPage() {
  return FEATURES.borrowing ? <BorrowScreen /> : <ComingSoonScreen feature="borrowing" />;
}
