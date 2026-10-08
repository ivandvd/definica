"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDapp } from "../providers/DappProvider";
import { DefinicaLogo } from "../ui/brand";
import { GearIcon } from "../ui/icons";
import { SoonPill } from "../ui/Pill";
import { isCurrent, LINKS, MORE, NAV, type NavItem } from "./nav";

function Item({ item, current, badge }: { item: NavItem; current: boolean; badge?: number }) {
  return (
    <Link
      href={item.href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "group relative flex h-11 items-center gap-3 rounded-[14px] px-3 text-[15px] font-semibold transition-[background-color,color] duration-200",
        current ? "bg-ink text-white" : item.soon ? "text-ink-2 hover:bg-canvas" : "text-ink-2 hover:bg-canvas hover:text-ink",
      )}
    >
      <item.icon className={cn("size-[21px] shrink-0 transition-colors", current ? "text-lime" : "text-ink-3 group-hover:text-ink")} />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.soon ? <SoonPill /> : null}
      {badge ? (
        <span className={cn("flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular", current ? "bg-lime text-ink" : "bg-lime text-ink")} aria-label={`${badge} ready`}>
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

/** The wide layout's navigation: the app's sections, then what opens next, then settings. */
export function Sidebar() {
  const pathname = usePathname();
  const { data } = useDapp();
  const ready = data.exits.filter((exit) => exit.status === "claimable" || exit.status === "partial").length;
  const matured = data.locks.filter((lock) => lock.status === "matured").length;
  const badges: Record<string, number> = { "/app/unstake": ready, "/app/locks": matured };
  const live = MORE.filter((item) => !item.soon);
  const soon = MORE.filter((item) => item.soon);

  return (
    <aside className="sticky top-0 hidden h-dvh w-[272px] shrink-0 p-3 lg:block">
      <div className="flex h-full flex-col rounded-[24px] bg-card px-3 pt-5 pb-3 shadow-[0_1px_0_rgba(15,15,15,0.04),0_12px_32px_-24px_rgba(15,15,15,0.3)]">
        <Link href="/app" aria-label="Definica app home" className="flex items-center gap-2 px-3">
          <DefinicaLogo className="h-[23px]" />
          <span className="rounded-[6px] bg-lime px-1.5 py-0.5 text-[10.5px] font-bold tracking-wide">APP</span>
        </Link>

        <nav aria-label="Sections" className="mt-7 flex flex-col gap-1">
          {[...NAV, ...live].map((item) => (
            <Item key={item.href} item={item} current={isCurrent(pathname, item.href)} badge={badges[item.href]} />
          ))}
        </nav>

        {soon.length ? (
          <div className="mt-6">
            <div className="px-3 pb-2 text-xs font-semibold text-ink-3">Next</div>
            <div className="flex flex-col gap-1">
              {soon.map((item) => (
                <Item key={item.href} item={item} current={isCurrent(pathname, item.href)} />
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-auto flex flex-col gap-1 border-t border-line-soft pt-3">
          <Item item={{ href: "/app/settings", label: "Settings", icon: GearIcon }} current={isCurrent(pathname, "/app/settings")} />
          <a href={LINKS.docs} className="group flex h-11 items-center gap-3 rounded-[14px] px-3 text-[15px] font-semibold text-ink-2 transition-colors hover:bg-canvas hover:text-ink">
            <ArrowUpRight className="size-[21px] text-ink-3 transition-colors group-hover:text-ink" aria-hidden="true" />
            Docs
          </a>
        </div>
      </div>
    </aside>
  );
}
