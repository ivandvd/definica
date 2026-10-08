"use client";

import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatAmount, formatDateTime, formatInteger, shortAddress, timeAgo, unitOf } from "../lib/format";
import type { ActivityItem } from "../lib/types";
import { useDapp } from "../providers/DappProvider";
import { ACTIVITY_META, activityTitle } from "../screens/ActivityScreen";
import { ButtonLink } from "../ui/Button";
import { ResponsiveSheet } from "../ui/Dialog";
import { GlyphBadge, StatusMark, TokenIcon } from "../ui/Glyph";

const EXPLORER_TX = "https://etherscan.io/tx/";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line-soft py-3 text-sm last:border-0">
      <span className="text-ink-2">{label}</span>
      <span className="min-w-0 text-right font-semibold">{children}</span>
    </div>
  );
}

function CopyHash({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-mono text-[13px]">{shortAddress(hash, 6)}</span>
      <button
        type="button"
        aria-label="Copy transaction hash"
        className="flex size-7 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-canvas hover:text-ink"
        onClick={() => {
          void navigator.clipboard.writeText(hash).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
          });
        }}
      >
        {copied ? <Check className="size-3.5 text-green-ink" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      </button>
    </span>
  );
}

const STATUS = {
  confirmed: { label: "Confirmed", pill: "bg-green-soft text-green-ink" },
  pending: { label: "Pending", pill: "bg-amber-soft text-amber" },
  failed: { label: "Failed", pill: "bg-red-soft text-red" },
} as const;

/**
 * A transaction's receipt: what it did, its status, when, the block, the fee, the hash, and the way
 * to Etherscan. Opens from the result screen, the toast, the notifications and the history.
 */
export function ReceiptSheet() {
  const { env, data, txs, wallet, receipt, closeReceipt } = useDapp();
  const confirmed = receipt ? data.activity.filter((item) => item.hash === receipt) : [];
  const record = receipt ? txs.find((item) => item.hash === receipt || item.hashes.includes(receipt)) : undefined;
  // The main entry for the hash (an action can record two, a commitment and its loan).
  const item: ActivityItem | null = confirmed[0] ?? null;
  const pending = !item && record && record.status !== "failed";
  const status = item ? item.status : pending ? "pending" : "failed";
  const failed = status === "failed";
  const meta = item ? ACTIVITY_META[item.kind] : null;
  const title = item ? activityTitle(item) : (record?.labels.title ?? "Transaction");
  const sign = failed ? "" : item?.direction === "in" ? "+" : item?.direction === "out" ? "−" : "";

  return (
    <ResponsiveSheet open={receipt !== null} onOpenChange={(next) => !next && closeReceipt()} title="Transaction">
      {receipt ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-center rounded-[18px] bg-card px-4 py-5 text-center">
            {meta ? (
              <span className="relative">
                <GlyphBadge glyph={meta.glyph} size={52} className={cn(failed && "opacity-60 grayscale")} />
                <StatusMark status={status} />
              </span>
            ) : null}
            <div className="mt-3 text-base font-bold">{title}</div>
            {item?.amount !== null && item?.amount !== undefined && item.asset ? (
              // The figure, its unit and its token, as the wallet window sets them.
              <div className="mt-1.5 flex items-center justify-center gap-2.5">
                <span className={cn("flex items-baseline gap-[0.28em] leading-none", failed ? "text-ink-3" : "text-ink")}>
                  <span className="figure text-[30px] font-extrabold">
                    {sign}
                    {formatAmount(item.amount)}
                  </span>
                  <span className={cn("text-[22px] font-bold", failed ? "text-ink-3" : "text-ink-2")}>{unitOf(item.asset)}</span>
                </span>
                <TokenIcon asset={item.asset} size={26} className={failed ? "opacity-50 grayscale" : undefined} />
              </div>
            ) : null}
            {item?.note ? <div className="mt-2 text-[13px] text-ink-2">{item.note}</div> : null}
            <span className={cn("mt-3 inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold", STATUS[status].pill)}>{STATUS[status].label}</span>
          </div>

          <div className="rounded-[18px] bg-card px-4 py-1">
            <Row label="Date">{item ? `${formatDateTime(item.at)} · ${timeAgo(item.at, data.now)}` : "Just now"}</Row>
            <Row label="Network">Ethereum</Row>
            {item?.block ? <Row label="Block">#{formatInteger(item.block)}</Row> : null}
            {item?.feeEth ? <Row label="Network fee">{formatAmount(item.feeEth)} ETH</Row> : null}
            {wallet.address ? <Row label="From">{shortAddress(wallet.address)}</Row> : null}
            <Row label="To">Definica</Row>
            <Row label="Transaction">
              <CopyHash hash={receipt} />
            </Row>
          </div>

          {/* Etherscan has the transactions of a live chain. */}
          {env.preview ? null : (
            <ButtonLink href={`${EXPLORER_TX}${receipt}`} external size="lg" block variant="secondary" trailing={<ArrowUpRight />}>
              View on Etherscan
            </ButtonLink>
          )}
        </div>
      ) : null}
    </ResponsiveSheet>
  );
}
