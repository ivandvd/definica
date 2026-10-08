"use client";

import { formatAge } from "../lib/format";
import { useDapp } from "../providers/DappProvider";
import { MarkTile } from "../ui/brand";
import { LINKS } from "./nav";
import { NetworkPill } from "./NetworkPill";
import { Notifications } from "./Notifications";
import { WalletButton } from "./WalletButton";

function Freshness() {
  const { data } = useDapp();
  const status = data.status;
  if (!status) return null;
  return (
    <span className="flex items-center gap-2 text-[13px] text-ink-3">
      <span className={status.stale ? "size-1.5 rounded-full bg-amber" : "size-1.5 animate-pulse-dot rounded-full bg-green"} aria-hidden="true" />
      {status.stale ? "Figures may be out of date" : "Live"} · updated {formatAge(status.dataAgeSeconds)} ago
    </span>
  );
}

/**
 * Phones: the walkthrough's top bar, the mark tile on the left and the wallet on the right.
 * Wide layout: the same controls above the content, beside the sidebar.
 */
export function TopBar() {
  return (
    <header className="sticky top-0 z-30 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-2 px-4 sm:px-6 lg:h-[76px] lg:px-8">
        <a href={LINKS.site} aria-label="Definica website" className="mr-auto lg:hidden">
          <MarkTile />
        </a>
        <div className="mr-auto hidden lg:block">
          <Freshness />
        </div>
        <span className="contents lg:hidden">
          <NetworkPill compact />
        </span>
        <span className="hidden items-center gap-2 lg:flex">
          <NetworkPill />
        </span>
        <Notifications />
        <WalletButton />
      </div>
    </header>
  );
}
