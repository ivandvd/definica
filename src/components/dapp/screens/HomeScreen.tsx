"use client";

import { ArrowDownToLine, ArrowRight, ArrowUpFromLine, History, Lock } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FEATURES } from "../lib/features";
import { formatBps, formatPercent, timeAgo } from "../lib/format";
import { useDapp } from "../providers/DappProvider";
import { useAlerts, type Alert } from "../shell/alerts";
import { LINKS } from "../shell/nav";
import { Amount } from "../ui/Amount";
import { ButtonLink } from "../ui/Button";
import { ArtCoins, ArtExit, ArtLock } from "../ui/art";
import { Card, CardHeader, Row } from "../ui/Card";
import { StepChart } from "../ui/Chart";
import { CountdownText, HarvestCountdown } from "../ui/Countdown";
import { EmptyState } from "../ui/EmptyState";
import { GlyphBadge } from "../ui/Glyph";
import { StickerBurst } from "../ui/illustrations";
import { Notice } from "../ui/Notice";
import { Pill } from "../ui/Pill";
import { ProgressBar } from "../ui/Progress";
import { Skeleton, SkeletonCard } from "../ui/Skeleton";
import { ActivityRows } from "./ActivityScreen";
import { ConnectButton, EyeToggle, LayersCard, MiniStat, ReturnsCard } from "./shared";

/* ---------- the position card ---------- */

function PositionCard() {
  const { data, preferences, setPreferences } = useDapp();
  const { position, vault } = data;

  if (!position) {
    return (
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 text-[13px] font-semibold">
          Your position <EyeToggle />
        </div>
        <EmptyState
          art={<ArtCoins />}
          title="No position yet"
          text="Stake ETH to hold Vault shares: your proportion of the Vault, earning at every harvest."
          action={
            <ButtonLink href="/app/stake" size="lg" trailing={<ArrowRight />}>
              Stake ETH
            </ButtonLink>
          }
          className="pb-4"
        />
      </Card>
    );
  }

  const shares = preferences.positionUnit === "shares";
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-[13px] font-semibold">
          Your position <EyeToggle />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPreferences({ positionUnit: shares ? "eth" : "shares" })}
            className="rounded-[8px] px-2 py-1 text-xs font-semibold text-ink-2 transition-colors hover:bg-canvas hover:text-ink"
            aria-label={shares ? "Show the value in ETH" : "Show Vault shares"}
          >
            {shares ? "Show ETH" : "Show shares"}
          </button>
          <Link href="/app/stake" className="flex size-8 items-center justify-center rounded-full text-ink-2 hover:bg-canvas hover:text-ink" aria-label="Open Staking">
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="figure text-[36px] leading-none font-extrabold sm:text-[46px]">
          {shares ? (
            <Amount value={position.shares} asset="shares" animate className="figure" unitClassName="ml-[0.3em] text-xl sm:text-2xl" />
          ) : (
            <Amount value={position.valueEth} asset="ETH" animate className="figure" unitClassName="ml-[0.3em] text-xl sm:text-2xl" />
          )}
        </span>
        <Pill tone="green">Vault shares</Pill>
      </div>
      <div className="mt-2 text-[13px] text-ink-2">
        <Amount value={position.rewardsEth} asset="ETH" signed className="font-semibold text-green-ink" /> lifetime rewards ·{" "}
        <Amount value={position.depositedEth} asset="ETH" digits={2} /> deposited
      </div>
      <HarvestCountdown className="mt-4" />
      <StepChart points={position.history} className="mt-4" />
      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line-soft pt-4 sm:grid-cols-4">
        <MiniStat label="Available" hint="To exit or lock">
          <Amount value={position.availableShares} asset="shares" unitClassName="text-xs font-semibold text-ink-2" />
        </MiniStat>
        <MiniStat label="Locked" hint="Still earning">
          <Amount value={position.lockedShares} asset="shares" unitClassName="text-xs font-semibold text-ink-2" />
        </MiniStat>
        <MiniStat label="In the exit queue" hint="Still earning">
          <Amount value={position.exitingShares} asset="shares" unitClassName="text-xs font-semibold text-ink-2" />
        </MiniStat>
        <MiniStat label="Share price" hint={vault ? `${formatPercent(vault.sharePriceChange30dPct)} in 30 days` : undefined}>
          {vault ? <Amount value={vault.sharePriceEth} asset="ETH" digits={4} isPublic unitClassName="text-xs font-semibold text-ink-2" /> : "—"}
        </MiniStat>
      </div>
    </Card>
  );
}

/* ---------- needs you ---------- */

const ALERT_TONES: Record<Alert["tone"], string> = {
  success: "bg-green-soft",
  info: "bg-sky-soft",
  caution: "bg-amber-soft",
  danger: "bg-red-soft",
};

function NeedsYou() {
  const alerts = useAlerts();
  return (
    <Card>
      <CardHeader title="Needs you" hint={alerts.length ? undefined : FEATURES.borrowing ? "Nothing is waiting. Claims, lock maturities and loan health show up here." : "Nothing is waiting. Claims and lock maturities show up here."} className={alerts.length ? undefined : "mb-0"} />
      {alerts.length ? (
        <ul className="flex flex-col gap-2">
          {alerts.map((alert) => (
            <li key={alert.id} className={cn("flex items-center gap-3 rounded-[14px] p-3.5", ALERT_TONES[alert.tone])}>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{alert.title}</span>
                <span className="block text-xs leading-4 text-ink-2">{alert.text}</span>
              </span>
              <ButtonLink href={alert.href} size="sm" variant="secondary">
                {alert.cta}
              </ButtonLink>
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}

/* ---------- quick actions ---------- */

const QUICK = [
  { href: "/app/stake", label: "Stake", icon: ArrowDownToLine, primary: true },
  { href: "/app/unstake", label: "Unstake", icon: ArrowUpFromLine },
  { href: "/app/locks", label: "Lock", icon: Lock },
  { href: "/app/activity", label: "Activity", icon: History },
];

function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {QUICK.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 rounded-[16px] py-4 text-[13px] font-semibold transition-colors",
            action.primary ? "bg-ink text-white hover:bg-ink-hover" : "bg-card text-ink hover:bg-canvas-2",
          )}
        >
          <action.icon className={cn("size-[18px]", action.primary && "text-lime")} aria-hidden="true" />
          {action.label}
        </Link>
      ))}
    </div>
  );
}

/* ---------- the Vault ---------- */

export function VaultCard() {
  const { data, publicLoading } = useDapp();
  const { vault } = data;
  if (publicLoading || !vault) return <SkeletonCard rows={5} />;
  const capacityLeft = vault.capacityEth - vault.totalAssetsEth;
  return (
    <Card>
      <CardHeader
        title={vault.name}
        hint={`${vault.network} · ${vault.operator}`}
        icon={<GlyphBadge glyph="stakewise-vault" size={36} />}
        action={vault.activated ? <Pill tone="green" dot>Active</Pill> : <Pill tone="amber" dot="pulse">Activating</Pill>}
      />
      <div className="mb-1 flex items-center justify-between text-[13px]">
        <span className="text-ink-2">Capacity used</span>
        <span className="font-semibold tabular">
          <Amount value={vault.totalAssetsEth} digits={2} isPublic /> / <Amount value={vault.capacityEth} asset="ETH" digits={0} isPublic />
        </span>
      </div>
      <ProgressBar value={vault.totalAssetsEth / vault.capacityEth} tone={capacityLeft <= 0 ? "amber" : "green"} label="Vault capacity used" />
      <div className="row-divide mt-2">
        <Row label="Share price" value={<Amount value={vault.sharePriceEth} asset="ETH" digits={4} isPublic />} hint={`${formatPercent(vault.sharePriceChange30dPct)} over 30 days`} />
        <Row label="Fees" value={`${formatBps(vault.feeBps.vault + vault.feeBps.definica)} of rewards`} hint={`Vault ${formatBps(vault.feeBps.vault)} · Definica ${formatBps(vault.feeBps.definica)}`} />
        <Row label="Minimum deposit" value={<Amount value={vault.minDepositEth} asset="ETH" digits={2} isPublic />} />
        <Row
          label="Next harvest"
          value={
            <>
              in <CountdownText to={vault.nextHarvestAt} done="now" />
            </>
          }
          hint={`Last ${timeAgo(vault.lastHarvestAt, data.now)}`}
        />
      </div>
    </Card>
  );
}

/* ---------- how it works (no wallet) ---------- */

const STEPS: { art: ReactNode; title: string; text: string }[] = [
  { art: <ArtCoins className="w-[120px]" />, title: "Stake", text: "Deposit ETH. It's pooled in the Vault and you hold Vault shares, your proportion of it." },
  { art: <ArtLock className="w-[120px]" />, title: "Earn, or lock", text: "Rewards reach every share at each harvest. Lock shares for 7 to 365 days if you like; they keep earning." },
  { art: <ArtExit className="w-[120px]" />, title: "Unstake", text: "Request an exit whenever you want, then claim the ETH once the Vault has it ready." },
];

function HowItWorks() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {STEPS.map((step, i) => (
        <div key={step.title} className="flex flex-col rounded-card bg-card p-5" style={{ animation: `rise 0.55s var(--ease-out-soft) ${120 + i * 80}ms both` }}>
          <div className="flex h-[96px] items-end">{step.art}</div>
          <span className="mt-4 flex items-center gap-2 text-base font-extrabold">
            <span className="flex size-6 items-center justify-center rounded-full bg-lime text-xs font-bold">{i + 1}</span>
            {step.title}
          </span>
          <span className="mt-1.5 text-[13px] leading-5 text-ink-2">{step.text}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- recent activity ---------- */

function RecentActivity() {
  const { data } = useDapp();
  const items = data.activity.slice(0, 5);
  return (
    <Card>
      <CardHeader
        title="Recent activity"
        action={
          <Link href="/app/activity" className="flex items-center gap-1 text-[13px] font-semibold text-ink-2 hover:text-ink">
            All <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        }
        className="mb-1"
      />
      {items.length ? <ActivityRows items={items} compact /> : <p className="py-6 text-center text-sm text-ink-2">Your transactions will appear here.</p>}
    </Card>
  );
}

/* ---------- screens ---------- */

function Welcome() {
  return (
    <>
      <section className="relative mb-4 overflow-hidden rounded-card bg-card lg:mb-6">
        <div className="grid items-center xl:grid-cols-[minmax(0,1fr)_440px]">
          <div className="relative z-10 p-6 sm:p-10 lg:p-12">
            <Pill tone="green">Pooled ETH staking</Pill>
            <h1 className="mt-4 max-w-xl text-[34px] leading-[1.05] font-extrabold tracking-[-0.025em] sm:text-[48px]">Stake ETH. Put it to work.</h1>
            <p className="mt-4 max-w-lg text-[15px] leading-6 text-ink-2">
              Stake ETH in a dedicated StakeWise Vault. No validator to run, rewards at every harvest, and your share of the Vault always proportional.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <ConnectButton />
              <ButtonLink href="/app/stake" size="lg" variant="soft">
                Explore staking
              </ButtonLink>
            </div>
          </div>
          <div className="relative h-[300px] overflow-hidden bg-[#f7f9f7] xl:h-full xl:min-h-[400px]">
            <StickerBurst className="absolute inset-0" scale={0.82} />
          </div>
        </div>
      </section>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-6 2xl:grid-cols-[minmax(0,1fr)_440px]">
        <div className="flex flex-col gap-4">
          <h2 className="px-1 text-[15px] font-semibold">How it works</h2>
          <HowItWorks />
          <Notice tone="neutral" title="No return is guaranteed">
            Staking rewards depend on validator performance, and treasury contributions to the Vault are discretionary. The app never shows a projected rate.
          </Notice>
        </div>
        <VaultCard />
      </div>
    </>
  );
}

function HomeLoading() {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-6 2xl:grid-cols-[minmax(0,1fr)_440px]" aria-busy="true" aria-label="Loading your position">
      <div className="flex flex-col gap-4">
        <div className="rounded-card bg-card p-6">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-3 h-11 w-56" />
          <Skeleton className="mt-6 h-40 w-full" />
        </div>
        <SkeletonCard rows={3} />
      </div>
      <div className="flex flex-col gap-4">
        <SkeletonCard rows={2} />
        <SkeletonCard rows={4} />
      </div>
    </div>
  );
}

/** Home: the walkthrough's position card and layers, with what needs you beside them. */
export function HomeScreen() {
  const { connected, accountLoading } = useDapp();
  if (!connected) return <Welcome />;
  if (accountLoading) return <HomeLoading />;
  return (
    <div className="grid animate-fade gap-4 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-6 2xl:grid-cols-[minmax(0,1fr)_440px]">
      <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
        <PositionCard />
        <div className="xl:hidden">
          <NeedsYou />
        </div>
        <LayersCard />
        <ReturnsCard />
        <div className="xl:hidden">
          <RecentActivity />
        </div>
      </div>
      <aside className="flex min-w-0 flex-col gap-4 lg:gap-5">
        <div className="hidden xl:block">
          <NeedsYou />
        </div>
        <QuickActions />
        <VaultCard />
        <div className="hidden xl:block">
          <RecentActivity />
        </div>
        <Notice tone="neutral">
          No return is guaranteed. Rewards depend on validator performance, and the app never shows a projected rate.{" "}
          <a href={LINKS.docsRisks}>Read the risks</a>
        </Notice>
      </aside>
    </div>
  );
}
