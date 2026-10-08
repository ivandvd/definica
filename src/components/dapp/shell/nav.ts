import { SITE_ORIGIN } from "@/lib/site";
import type { ComponentType } from "react";
import { FEATURES } from "../lib/features";
import { ActivityIcon, BorrowIcon, HomeIcon, LiquidityIcon, LockIcon, StakeIcon, UnstakeIcon } from "../ui/icons";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** Shown with a "Coming soon" pill and opens a short preview page. */
  soon?: boolean;
}

/** The app's sections, in the sidebar (wide layout) and the hexagon's sheet (phones). */
export const NAV: NavItem[] = [
  { href: "/app", label: "Home", icon: HomeIcon },
  { href: "/app/stake", label: "Stake", icon: StakeIcon },
  { href: "/app/unstake", label: "Unstake", icon: UnstakeIcon },
  { href: "/app/locks", label: "Locks", icon: LockIcon },
  { href: "/app/activity", label: "Activity", icon: ActivityIcon },
];

/** What opens next. Each one moves up into NAV once its switch in features.ts turns on. */
export const MORE: NavItem[] = [
  { href: "/app/liquidity", label: "Liquidity", icon: LiquidityIcon, soon: !FEATURES.liquidity },
  { href: "/app/borrow", label: "Borrow", icon: BorrowIcon, soon: !FEATURES.borrowing },
];

/** Stake, Unstake and Locks: one switch on each of the three screens, on phones. */
export const STAKING_TABS = [
  { href: "/app/stake", label: "Stake" },
  { href: "/app/unstake", label: "Unstake" },
  { href: "/app/locks", label: "Locks" },
] as const;

export function isCurrent(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Where the app links out to. The docs paths resolve through the /docs redirect (see next.config.ts). */
/** Pages of the website go to its own address: the app may be on another one. */
export const LINKS = {
  site: `${SITE_ORIGIN}/`,
  roadmap: `${SITE_ORIGIN}/roadmap`,
  terms: `${SITE_ORIGIN}/terms`,
  privacy: `${SITE_ORIGIN}/privacy`,
  docs: "/docs",
  docsApp: "/docs/app",
  docsRisks: "/docs/risks",
  telegram: "https://t.me/definica",
  x: "https://x.com/definicacom",
};
