"use client";

import { ArrowUpRight, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { DAY, formatDayHeading, formatTime, shortAddress, timeAgo } from "../lib/format";
import { FEATURES } from "../lib/features";
import { ACTION_PHASE, type ActionType } from "../lib/protocol";
import type { ActivityItem, ActivityKind } from "../lib/types";
import { useDapp } from "../providers/DappProvider";
import { Amount } from "../ui/Amount";
import { Button } from "../ui/Button";
import { ArtActivity } from "../ui/art";
import { Card } from "../ui/Card";
import { EmptyState } from "../ui/EmptyState";
import { GlyphBadge, StatusMark, type GlyphName } from "../ui/Glyph";
import { PageHeader } from "../ui/PageHeader";
import { Pill } from "../ui/Pill";
import { Skeleton } from "../ui/Skeleton";
import { ConnectCard } from "./shared";

/** Each kind's title once done, and what was tried, for a transaction that failed ("Stake", with a Failed pill). */
export const ACTIVITY_META: Record<ActivityKind, { title: string; tried: string; glyph: GlyphName }> = {
  deposit: { title: "Staked", tried: "Stake", glyph: "vault-shares" },
  "exit-request": { title: "Exit requested", tried: "Exit request", glyph: "exit-queue" },
  "exit-claim": { title: "Exit claimed", tried: "Claim", glyph: "ethereum" },
  lock: { title: "Shares locked", tried: "Lock", glyph: "share-locks" },
  "lock-release": { title: "Lock released", tried: "Lock release", glyph: "share-locks" },
  reward: { title: "Rewards accrued", tried: "Rewards", glyph: "validators" },
  treasury: { title: "Treasury contribution", tried: "Treasury contribution", glyph: "treasury" },
  commit: { title: "aEthosETH committed", tried: "Commitment", glyph: "liquidity-module" },
  "commit-release": { title: "Commitment released", tried: "Commitment release", glyph: "liquidity-module" },
  "funding-borrow": { title: "Funding loan taken", tried: "Funding loan", glyph: "aave-v3" },
  "funding-repay": { title: "Funding loan repaid", tried: "Funding loan repayment", glyph: "aave-v3" },
  "aave-withdraw": { title: "Withdrawn to osETH", tried: "Withdrawal to osETH", glyph: "oseth" },
  "collateral-supply": { title: "Collateral supplied", tried: "Collateral supply", glyph: "oseth" },
  "collateral-withdraw": { title: "Collateral withdrawn", tried: "Collateral withdrawal", glyph: "oseth" },
  borrow: { title: "ETH borrowed", tried: "Borrow", glyph: "borrowing-markets" },
  repay: { title: "Loan repaid", tried: "Repayment", glyph: "borrowing-markets" },
  "eth-supply": { title: "ETH lent", tried: "Lending", glyph: "ethereum" },
  "eth-withdraw": { title: "ETH withdrawn", tried: "Withdrawal", glyph: "ethereum" },
  liquidation: { title: "Liquidation", tried: "Liquidation", glyph: "borrowing-markets" },
};

/** A row's title: what happened, or for a failed transaction, what was tried. */
export const activityTitle = (item: Pick<ActivityItem, "kind" | "status">) => (item.status === "failed" ? ACTIVITY_META[item.kind].tried : ACTIVITY_META[item.kind].title);

const ACTION_KIND: Record<ActionType, ActivityKind> = {
  stake: "deposit",
  requestExit: "exit-request",
  claimExits: "exit-claim",
  createLock: "lock",
  releaseLocks: "lock-release",
  commit: "commit",
  releaseCommitment: "commit-release",
  repayFunding: "funding-repay",
  withdrawToOseth: "aave-withdraw",
  supplyCollateral: "collateral-supply",
  withdrawCollateral: "collateral-withdraw",
  borrow: "borrow",
  repay: "repay",
  supplyEth: "eth-supply",
  withdrawEth: "eth-withdraw",
};

type Filter = "all" | "deposits" | "exits" | "locks" | "rewards" | "liquidity" | "borrowing";

const FILTERS: { value: Filter; label: string; kinds: ActivityKind[] | null }[] = [
  { value: "all", label: "All", kinds: null },
  { value: "deposits", label: "Deposits", kinds: ["deposit"] },
  { value: "exits", label: "Exits", kinds: ["exit-request", "exit-claim"] },
  { value: "locks", label: "Locks", kinds: ["lock", "lock-release"] },
  { value: "rewards", label: "Rewards", kinds: ["reward", "treasury"] },
  ...(FEATURES.liquidity ? [{ value: "liquidity" as const, label: "Liquidity", kinds: ["commit", "commit-release", "funding-borrow", "funding-repay", "aave-withdraw"] as ActivityKind[] }] : []),
  ...(FEATURES.borrowing
    ? [{ value: "borrowing" as const, label: "Borrowing", kinds: ["collateral-supply", "collateral-withdraw", "borrow", "repay", "eth-supply", "eth-withdraw", "liquidation"] as ActivityKind[] }]
    : []),
];

/** Transactions of this session still on their way, shown above the history as pending. */
function usePendingItems(): ActivityItem[] {
  const { txs } = useDapp();
  return txs
    .filter((record) => (record.status === "pending" || record.status === "updating") && record.hash)
    .map((record) => ({
      id: record.id,
      kind: ACTION_KIND[record.action.type],
      phase: ACTION_PHASE[record.action.type],
      at: record.startedAt,
      amount: null,
      asset: null,
      direction: "none" as const,
      status: "pending" as const,
      hash: record.hash,
      note: record.labels.title,
      block: null,
      feeEth: null,
    }));
}

function HashLink({ hash }: { hash: string }) {
  const { env } = useDapp();
  if (env.preview) return null;
  return (
    <a href={`https://etherscan.io/tx/${hash}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 font-mono text-[11px] text-ink-2 hover:text-ink" aria-label="View on Etherscan">
      {shortAddress(hash, 4)}
      <ArrowUpRight className="size-3" aria-hidden="true" />
    </a>
  );
}

/** Activity entries as rows: what happened, the amount and when, each traced to its transaction. */
export function ActivityRows({ items, compact = false }: { items: ActivityItem[]; compact?: boolean }) {
  const { data, openReceipt } = useDapp();
  return (
    <ul className="row-divide">
      {items.map((item) => {
        const meta = ACTIVITY_META[item.kind];
        const sign = item.direction === "in" ? 1 : item.direction === "out" ? -1 : 0;
        const hash = item.hash;
        return (
          <li
            key={item.id}
            className={cn(
              "-mx-2 flex items-center gap-3 rounded-[14px] px-2 py-3 transition-colors",
              hash && "cursor-pointer hover:bg-canvas focus-within:bg-canvas",
            )}
            onClick={hash ? () => openReceipt(hash) : undefined}
          >
            <span className="relative">
              <GlyphBadge glyph={meta.glyph} size={36} tone={item.kind === "liquidation" ? "#ffcadc" : undefined} className={cn(item.status === "failed" && "opacity-60 grayscale")} />
              {item.status !== "confirmed" ? <StatusMark status={item.status} size={17} /> : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold">{item.status === "pending" && item.note ? item.note : activityTitle(item)}</span>
                {item.status === "pending" ? (
                  <Pill tone="amber" size="sm" dot="pulse">
                    Pending
                  </Pill>
                ) : item.status === "failed" ? (
                  <Pill tone="red" size="sm">
                    Failed
                  </Pill>
                ) : null}
              </span>
              <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-3">
                {item.status !== "pending" && item.note ? <span className="truncate">{item.note}</span> : null}
                {!compact && item.hash ? <HashLink hash={item.hash} /> : null}
              </span>
            </span>
            <span className="shrink-0 text-right">
              {item.amount !== null && item.asset ? (
                <Amount
                  value={sign === 0 ? item.amount : sign * item.amount}
                  asset={item.asset}
                  signed={sign !== 0}
                  className={cn("block text-sm font-bold", item.status === "failed" ? "text-ink-3" : sign > 0 ? "text-green-ink" : "text-ink")}
                />
              ) : null}
              <span className="block text-xs text-ink-3">{compact ? timeAgo(item.at, data.now) : formatTime(item.at)}</span>
            </span>
            {hash ? (
              <button type="button" className="sr-only focus:not-sr-only" onClick={() => openReceipt(hash)}>
                View transaction
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function dayLabel(at: number, now: number) {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const today = startOfToday.getTime();
  if (at >= today) return "Today";
  if (at >= today - DAY) return "Yesterday";
  return formatDayHeading(at);
}

function exportCsv(items: ActivityItem[]) {
  const header = ["date", "type", "direction", "amount", "asset", "status", "note", "transaction"];
  const rows = items.map((item) => [
    new Date(item.at).toISOString(),
    activityTitle(item),
    item.direction,
    item.amount ?? "",
    item.asset ?? "",
    item.status,
    item.note ?? "",
    item.hash ?? "",
  ]);
  const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "definica-activity.csv";
  link.click();
  URL.revokeObjectURL(url);
}

/** Every deposit, exit, lock, reward, commitment and loan of the account, with filters and an export. */
export function ActivityScreen() {
  const { data, connected, accountLoading } = useDapp();
  const pending = usePendingItems();
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo(() => {
    const kinds = FILTERS.find((item) => item.value === filter)?.kinds;
    const all = [...pending, ...data.activity];
    return kinds ? all.filter((item) => kinds.includes(item.kind)) : all;
  }, [pending, data.activity, filter]);

  const groups = useMemo(() => {
    const map = new Map<string, ActivityItem[]>();
    for (const item of items) {
      const label = dayLabel(item.at, data.now);
      map.set(label, [...(map.get(label) ?? []), item]);
    }
    return [...map.entries()];
  }, [items, data.now]);

  return (
    <>
      <PageHeader
        title="Activity"
        description="Every stake, exit, lock and reward of your account, each traced to its transaction."
        actions={
          connected && data.activity.length ? (
            <Button variant="secondary" icon={<Download />} onClick={() => exportCsv(items)}>
              Export CSV
            </Button>
          ) : null
        }
      />
      {!connected ? (
        <ConnectCard title="Connect to see your activity" text="Your history is read from the chain for the connected address." art={<ArtActivity />} />
      ) : (
        <>
          <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter activity">
            {FILTERS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={filter === option.value}
                onClick={() => setFilter(option.value)}
                className={cn(
                  "h-9 shrink-0 rounded-full px-4 text-[13px] font-semibold transition-colors",
                  filter === option.value ? "bg-ink text-white" : "bg-card text-ink-2 hover:text-ink",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          {accountLoading ? (
            <Card aria-busy="true" aria-label="Loading activity">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="flex items-center gap-3 py-3">
                  <Skeleton className="size-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </Card>
          ) : groups.length ? (
            <div className="flex flex-col gap-4">
              {groups.map(([label, group]) => (
                <section key={label}>
                  <h2 className="mb-2 px-1 text-[13px] font-semibold text-ink-2">{label}</h2>
                  <Card className="py-1 sm:py-1">
                    <ActivityRows items={group} />
                  </Card>
                </section>
              ))}
            </div>
          ) : (
            <Card>
              <EmptyState
                art={<ArtActivity />}
                title={filter === "all" ? "No activity yet" : "Nothing here"}
                text={filter === "all" ? "Stake ETH and your deposits, rewards, exits and locks will be listed here." : "No entries match this filter."}
              />
            </Card>
          )}
        </>
      )}
    </>
  );
}
