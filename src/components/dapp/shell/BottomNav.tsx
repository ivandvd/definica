"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HexMark } from "../ui/brand";
import { Sheet } from "../ui/Dialog";
import { ActivityIcon, GearIcon, HomeIcon, StakeIcon } from "../ui/icons";
import { SoonPill } from "../ui/Pill";
import { useAlerts } from "./alerts";
import { isCurrent, MORE, NAV } from "./nav";

function Tab({ href, label, icon, current }: { href: string; label: string; icon: ReactNode; current: boolean }) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn("flex flex-col items-center gap-1 pt-2.5 pb-1 text-[11px] font-semibold transition-colors", current ? "text-ink" : "text-ink-3 active:text-ink-2")}
    >
      <span className={cn("transition-transform duration-200 [&_svg]:size-[22px]", current && "-translate-y-px")}>{icon}</span>
      {label}
    </Link>
  );
}

const STAKING = ["/app/stake", "/app/unstake", "/app/locks"];

/**
 * The walkthrough's tab bar: Home, Stake, the Definica hexagon, Activity, Settings. The hexagon
 * opens every section, with whatever is ready to collect on top and what opens next below.
 */
export function BottomNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const alerts = useAlerts();
  const stakingCurrent = STAKING.some((path) => isCurrent(pathname, path));
  const sections = [...NAV.filter((item) => item.href !== "/app"), ...MORE];

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-[#e3e7e4] bg-[#f6f7f6]/95 px-1.5 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
        aria-label="Sections"
      >
        <Tab href="/app" label="Home" icon={<HomeIcon filled={pathname === "/app"} />} current={pathname === "/app"} />
        <Tab href="/app/stake" label="Stake" icon={<StakeIcon />} current={stakingCurrent} />
        <button type="button" onClick={() => setOpen(true)} className="flex flex-col items-center" aria-label="All sections" aria-haspopup="dialog">
          <span className="relative -mt-3.5 flex size-[58px] items-center justify-center">
            {alerts.length ? <span className="absolute top-1 right-1 z-10 size-3 animate-pop rounded-full border-2 border-[#f6f7f6] bg-lime" aria-hidden="true" /> : null}
            <HexMark className="size-[58px] drop-shadow-[0_6px_12px_rgba(15,15,15,0.28)] transition-transform duration-200 active:scale-90" />
          </span>
        </button>
        <Tab href="/app/activity" label="Activity" icon={<ActivityIcon />} current={isCurrent(pathname, "/app/activity")} />
        <Tab href="/app/settings" label="Settings" icon={<GearIcon />} current={isCurrent(pathname, "/app/settings")} />
      </nav>

      <Sheet open={open} onOpenChange={setOpen} title="Where to?">
        {alerts.length ? (
          <div className="mb-3 flex flex-col gap-2">
            {alerts.slice(0, 3).map((alert) => (
              <Link
                key={alert.id}
                href={alert.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-[16px] p-3.5 transition-transform active:scale-[0.98]",
                  alert.tone === "danger" ? "bg-red-soft" : alert.tone === "caution" ? "bg-amber-soft" : alert.tone === "success" ? "bg-green-soft" : "bg-sky-soft",
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{alert.title}</span>
                  <span className="block text-xs text-ink-2">{alert.text}</span>
                </span>
                <span className="rounded-[9px] bg-card px-3 py-1.5 text-xs font-semibold">{alert.cta}</span>
              </Link>
            ))}
          </div>
        ) : null}
        <ul className="flex flex-col gap-2">
          {sections.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-[16px] bg-card p-3.5 transition-transform active:scale-[0.98]",
                  isCurrent(pathname, item.href) && "shadow-[inset_0_0_0_1.5px_var(--color-ink)]",
                )}
              >
                <span className={cn("flex size-10 items-center justify-center rounded-[12px]", item.soon ? "bg-canvas text-ink-3" : "bg-ink text-lime")}>
                  <item.icon className="size-5" />
                </span>
                <span className={cn("flex-1 text-[15px] font-semibold", item.soon && "text-ink-2")}>{item.label}</span>
                {item.soon ? <SoonPill /> : <ChevronRight className="size-4 text-ink-3" aria-hidden="true" />}
              </Link>
            </li>
          ))}
        </ul>
      </Sheet>
    </>
  );
}
