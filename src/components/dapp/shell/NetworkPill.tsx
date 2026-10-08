"use client";

import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDapp } from "../providers/DappProvider";
import { EthDiamond } from "../ui/brand";

/** The walkthrough's "Ethereum" pill. On another network it becomes the way back to Ethereum. */
export function NetworkPill({ compact = false }: { compact?: boolean }) {
  const { wrongNetwork, wallet, switchToEthereum } = useDapp();
  if (wrongNetwork) {
    return (
      <button
        type="button"
        onClick={() => void switchToEthereum()}
        disabled={wallet.busy}
        className="flex h-10 items-center gap-2 rounded-control bg-red-soft px-3 text-[13px] font-semibold text-red transition-colors hover:bg-[#ffd4ce] disabled:opacity-60"
      >
        <TriangleAlert className="size-4" aria-hidden="true" />
        {wallet.busy ? "Switching…" : compact ? "Switch" : "Switch to Ethereum"}
      </button>
    );
  }
  return (
    <span className={cn("flex h-10 items-center gap-2 rounded-control bg-card text-[13px] font-semibold", compact ? "w-10 justify-center" : "px-3")} title="Ethereum">
      <EthDiamond className="h-4 w-2.5" />
      <span className={compact ? "sr-only" : undefined}>Ethereum</span>
    </span>
  );
}
