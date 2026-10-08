"use client";

import { Popover } from "@base-ui/react/popover";
import { Bell, CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDapp, type TxRecord } from "../providers/DappProvider";
import { Sheet } from "../ui/Dialog";
import { useIsDesktop } from "../ui/useMediaQuery";
import { useAlerts, type Alert } from "./alerts";

const TONE_DOT: Record<Alert["tone"], string> = {
  success: "bg-green",
  info: "bg-sky-ink",
  caution: "bg-amber",
  danger: "bg-red",
};

function TxRow({ record, onOpen }: { record: TxRecord; onOpen: () => void }) {
  const { openReceipt } = useDapp();
  const icon =
    record.status === "confirmed" ? (
      <CircleCheck className="size-4 text-green-ink" aria-hidden="true" />
    ) : record.status === "failed" ? (
      <CircleX className="size-4 text-red" aria-hidden="true" />
    ) : (
      <LoaderCircle className="size-4 animate-spin text-ink-2" aria-hidden="true" />
    );
  const state = { wallet: "Waiting for your wallet", pending: "Pending on the network", updating: "Updating", confirmed: record.labels.successTitle, failed: record.error?.code === "rejected" ? "Rejected in your wallet" : "Failed" }[record.status];
  const hash = record.hash;
  return (
    <li>
      <button
        type="button"
        disabled={!hash}
        onClick={() => {
          if (!hash) return;
          onOpen();
          openReceipt(hash);
        }}
        className="flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left transition-colors enabled:hover:bg-canvas"
      >
        {icon}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{record.labels.title}</span>
          <span className="block text-xs text-ink-2">{state}</span>
        </span>
        {hash ? <span className="text-xs font-semibold text-ink-2">View</span> : null}
      </button>
    </li>
  );
}

function Panel({ onNavigate }: { onNavigate: () => void }) {
  const alerts = useAlerts();
  const { txs, connected } = useDapp();
  const recent = txs.slice(0, 5);
  if (!connected) return <p className="px-3 py-6 text-center text-sm text-ink-2">Connect a wallet to see what needs you.</p>;
  if (!alerts.length && !recent.length) return <p className="px-3 py-6 text-center text-sm text-ink-2">Nothing needs you right now.</p>;
  return (
    <div className="flex flex-col gap-1">
      {alerts.length ? (
        <>
          <div className="px-3 pt-1 pb-1 text-[11px] font-semibold tracking-wide text-ink-3 uppercase">Needs you</div>
          <ul>
            {alerts.map((alert) => (
              <li key={alert.id}>
                <Link href={alert.href} onClick={onNavigate} className="flex items-start gap-3 rounded-[12px] px-3 py-2.5 transition-colors hover:bg-canvas">
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", TONE_DOT[alert.tone])} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{alert.title}</span>
                    <span className="block text-xs leading-4 text-ink-2">{alert.text}</span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-ink underline-offset-4">{alert.cta}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {recent.length ? (
        <>
          <div className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-ink-3 uppercase">This session</div>
          <ul>
            {recent.map((record) => (
              <TxRow key={record.id} record={record} onOpen={onNavigate} />
            ))}
          </ul>
        </>
      ) : null}
      <Link href="/app/activity" onClick={onNavigate} className="mx-3 mt-1 mb-1 text-center text-[13px] font-semibold text-ink underline-offset-4 hover:underline">
        All activity
      </Link>
    </div>
  );
}

/** The bell: everything waiting on the user and the transactions of this session. */
export function Notifications() {
  const alerts = useAlerts();
  const { txs } = useDapp();
  const desktop = useIsDesktop();
  const [open, setOpen] = useState(false);
  const pending = txs.filter((record) => record.status === "wallet" || record.status === "pending" || record.status === "updating").length;
  const count = alerts.length + pending;
  const label = count ? `Notifications, ${count} new` : "Notifications";

  const badge = count ? (
    <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-canvas bg-lime px-1 text-[10px] font-bold text-ink tabular">
      {pending ? <LoaderCircle className="size-2.5 animate-spin" aria-hidden="true" /> : count}
    </span>
  ) : null;
  const triggerClass = "relative flex size-10 items-center justify-center rounded-control bg-card text-ink transition-colors hover:bg-canvas-2 data-[popup-open]:bg-canvas-2";

  if (desktop) {
    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger className={triggerClass} aria-label={label}>
          <Bell className="size-[18px]" aria-hidden="true" />
          {badge}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={8} align="end" className="z-50">
            <Popover.Popup className="w-[360px] rounded-[20px] bg-card p-2 shadow-pop outline-none transition-[opacity,scale] duration-150 data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0">
              <Panel onNavigate={() => setOpen(false)} />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    );
  }
  return (
    <>
      <button type="button" className={triggerClass} onClick={() => setOpen(true)} aria-label={label}>
        <Bell className="size-[18px]" aria-hidden="true" />
        {badge}
      </button>
      <Sheet open={open} onOpenChange={setOpen} title="Notifications" surface="card">
        <Panel onNavigate={() => setOpen(false)} />
      </Sheet>
    </>
  );
}
