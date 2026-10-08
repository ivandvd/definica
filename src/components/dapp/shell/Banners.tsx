"use client";

import { Clock3, OctagonAlert, RefreshCw, ShieldOff, TriangleAlert, WifiOff } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatAge } from "../lib/format";
import { chainName } from "../lib/wallet";
import { useDapp } from "../providers/DappProvider";
import { Button } from "../ui/Button";

function Banner({ tone, icon, children, action }: { tone: "caution" | "danger" | "info"; icon: ReactNode; children: ReactNode; action?: ReactNode }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[16px] px-4 py-3 text-[13px] leading-5 sm:flex-row sm:items-center",
        tone === "danger" ? "bg-red-soft" : tone === "caution" ? "bg-amber-soft" : "bg-sky-soft",
      )}
      role={tone === "danger" ? "alert" : "status"}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span className={cn("mt-px shrink-0 [&_svg]:size-[18px]", tone === "danger" ? "text-red" : tone === "caution" ? "text-amber" : "text-sky-ink")}>{icon}</span>
        <div className="min-w-0 text-ink-2 [&_strong]:font-semibold [&_strong]:text-ink">{children}</div>
      </div>
      {action ? <div className="shrink-0 pl-8 sm:pl-0">{action}</div> : null}
    </div>
  );
}

/**
 * App-wide states, above every screen: a broken interface version, a connection problem, the wrong
 * network, an incident, stale data and a regional restriction.
 */
export function Banners() {
  const { data, wrongNetwork, wallet, switchToEthereum, loadError, refresh } = useDapp();
  const status = data.status;
  const items: ReactNode[] = [];

  if (status?.unsafeVersion) {
    items.push(
      <Banner key="unsafe" tone="danger" icon={<OctagonAlert />} action={<Button size="sm" onClick={() => window.location.reload()}>Reload</Button>}>
        <strong>This version of the app is no longer safe to use.</strong> Reload to get the current one before you sign anything.
      </Banner>,
    );
  }
  if (loadError) {
    items.push(
      <Banner key="error" tone="danger" icon={<WifiOff />} action={<Button size="sm" variant="secondary" icon={<RefreshCw />} onClick={() => void refresh()}>Try again</Button>}>
        <strong>Can&apos;t reach the network.</strong> {loadError}
      </Banner>,
    );
  }
  if (wrongNetwork) {
    items.push(
      <Banner
        key="network"
        tone="danger"
        icon={<TriangleAlert />}
        action={
          <Button size="sm" loading={wallet.busy} onClick={() => void switchToEthereum()}>
            Switch to Ethereum
          </Button>
        }
      >
        <strong>Your wallet is on {chainName(wallet.chainId)}.</strong> Definica runs on Ethereum. Your figures stay visible; switch to make changes.
      </Banner>,
    );
  }
  if (status?.incident) {
    items.push(
      <Banner key="incident" tone={status.incident.level === "critical" ? "danger" : status.incident.level === "warning" ? "caution" : "info"} icon={<TriangleAlert />}>
        <strong>{status.incident.title}.</strong> {status.incident.text}
      </Banner>,
    );
  }
  if (status?.stale) {
    items.push(
      <Banner key="stale" tone="caution" icon={<Clock3 />} action={<Button size="sm" variant="secondary" icon={<RefreshCw />} onClick={() => void refresh()}>Refresh</Button>}>
        <strong>The figures may be out of date.</strong> They were last read {formatAge(status.dataAgeSeconds)} ago, so confirming is paused until they refresh.
      </Banner>,
    );
  }
  if (data.eligibility?.status === "region") {
    items.push(
      <Banner key="region" tone="info" icon={<ShieldOff />}>
        <strong>New positions aren&apos;t available in your region.</strong> You can still exit, claim, release and repay everything you hold.
      </Banner>,
    );
  }

  if (!items.length) return null;
  return <div className="mb-5 flex flex-col gap-2">{items}</div>;
}
