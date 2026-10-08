"use client";

import { ArrowUpRight, Eye, EyeOff, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatHealth } from "../lib/format";
import { FEATURES } from "../lib/features";
import { useDapp } from "../providers/DappProvider";
import { ConnectDialog } from "../shell/ConnectDialog";
import { STAKING_TABS } from "../shell/nav";
import { Amount } from "../ui/Amount";
import { Button } from "../ui/Button";
import { ArtWallet } from "../ui/art";
import { Card, CardHeader } from "../ui/Card";
import { GlyphBadge, type GlyphName } from "../ui/Glyph";
import { HealthBadge } from "../ui/Health";
import { KebabMenu, type MenuAction } from "../ui/Menu";
import { Notice } from "../ui/Notice";
import { SoonPill } from "../ui/Pill";

/* ---------- connection ---------- */

/** A button that opens the wallet chooser (it brings its own dialog). */
export function ConnectButton({ children = "Connect wallet", size = "lg", block = false, className }: { children?: ReactNode; size?: "md" | "lg"; block?: boolean; className?: string }) {
  const { wallet } = useDapp();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button size={size} block={block} icon={<Wallet />} loading={wallet.status === "connecting"} onClick={() => setOpen(true)} className={className}>
        {wallet.status === "connecting" ? "Connecting…" : children}
      </Button>
      <ConnectDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

/** The main button of a form: connect first, switch network if needed, then the action itself. */
export function ActionButton({ label, disabled, onClick }: { label: ReactNode; disabled?: boolean; onClick: () => void }) {
  const { connected, wrongNetwork, wallet, switchToEthereum } = useDapp();
  if (!connected) return <ConnectButton block>Connect wallet to continue</ConnectButton>;
  if (wrongNetwork)
    return (
      <Button size="lg" block loading={wallet.busy} onClick={() => void switchToEthereum()}>
        Switch to Ethereum
      </Button>
    );
  return (
    <Button size="lg" block disabled={disabled} onClick={onClick}>
      {label}
    </Button>
  );
}

/** A problem with the whole form (out-of-date figures, a restriction, a pause), above its button. */
export function FormProblem({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <Notice tone="caution" live className="animate-rise">
      {message}
    </Notice>
  );
}

/** In place of account data when no wallet is connected. */
export function ConnectCard({ title, text, art, className }: { title: string; text: string; art?: ReactNode; className?: string }) {
  return (
    <Card className={cn("flex flex-col items-center py-10 text-center", className)}>
      {art ?? <ArtWallet />}
      <h2 className="mt-4 text-lg font-extrabold">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm leading-5 text-ink-2">{text}</p>
      <div className="mt-5">
        <ConnectButton />
      </div>
    </Card>
  );
}

/* ---------- layout ---------- */

/**
 * The wide layout's two columns: context on the left, the active flow on the right (sticky). On
 * phones the flow comes first, then the context.
 */
export function SplitLayout({ main, aside, asideFirstOnMobile = true }: { main: ReactNode; aside: ReactNode; asideFirstOnMobile?: boolean }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px] xl:items-start xl:gap-6 2xl:grid-cols-[minmax(0,1fr)_440px]">
      <div className={cn("flex min-w-0 flex-col gap-4 lg:gap-5", asideFirstOnMobile && "order-2 xl:order-1")}>{main}</div>
      <aside className={cn("flex min-w-0 flex-col gap-4 xl:sticky xl:top-[100px]", asideFirstOnMobile && "order-1 xl:order-2")}>{aside}</aside>
    </div>
  );
}

/** Stake / Unstake / Locks on phones (the wide layout has them in the sidebar). */
export function StakingTabs() {
  const pathname = usePathname();
  const { data } = useDapp();
  const ready = data.exits.filter((exit) => exit.status === "claimable" || exit.status === "partial").length;
  const matured = data.locks.filter((lock) => lock.status === "matured").length;
  const badges: Record<string, number> = { "/app/unstake": ready, "/app/locks": matured };
  return (
    <nav aria-label="Staking" className="w-full lg:hidden">
      <ul className="flex w-full gap-1 rounded-chip bg-chip p-[3px]">
        {STAKING_TABS.map((tab) => {
          const current = pathname === tab.href;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex h-10 items-center justify-center gap-2 rounded-[8px] px-5 text-sm font-semibold transition-colors",
                  current ? "bg-card text-ink shadow-thumb" : "text-ink-2 hover:text-ink",
                )}
              >
                {tab.label}
                {badges[tab.href] ? (
                  <span className="flex size-5 items-center justify-center rounded-full bg-lime text-[11px] font-bold text-ink" aria-label={`${badges[tab.href]} ready`}>
                    {badges[tab.href]}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ---------- position ---------- */

export function EyeToggle({ className }: { className?: string }) {
  const { preferences, setPreferences } = useDapp();
  const hidden = preferences.hideBalances;
  return (
    <button
      type="button"
      onClick={() => setPreferences({ hideBalances: !hidden })}
      className={cn("flex size-7 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-canvas hover:text-ink", className)}
      aria-label={hidden ? "Show balances" : "Hide balances"}
      aria-pressed={hidden}
    >
      {hidden ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
    </button>
  );
}

/** A figure in a row of small stats under a headline. */
export function MiniStat({ label, children, hint }: { label: ReactNode; children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-xs text-ink-2">{label}</div>
      <div className="figure mt-1 truncate text-[15px] font-bold">{children}</div>
      {hint ? <div className="mt-0.5 truncate text-[11px] text-ink-3">{hint}</div> : null}
    </div>
  );
}

/* ---------- layers ---------- */

export interface LayerRowProps {
  name: string;
  glyph: GlyphName;
  /** Not open yet: a "Coming soon" pill in place of the actions. */
  soon?: boolean;
  value: ReactNode;
  sub?: ReactNode;
  muted?: boolean;
  href: string;
  actions: MenuAction[];
  extra?: ReactNode;
}

/** One row of "Your layers", as in the walkthrough: name and glyph, value, then its actions (or "Coming soon"). */
export function LayerRow({ name, glyph, soon = false, value, sub, muted = false, href, actions, extra }: LayerRowProps) {
  return (
    <div className="group relative flex items-center gap-3 py-3.5">
      <GlyphBadge glyph={glyph} size={40} />
      <Link href={href} className="min-w-0 flex-1 after:absolute after:inset-0 after:content-['']">
        <span className="flex items-center gap-1.5 text-[13px] text-ink-2">{name}</span>
        <span className={cn("figure mt-0.5 block truncate text-base font-extrabold", muted && "text-ink-3")}>{value}</span>
        {sub ? <span className="mt-0.5 block truncate text-xs text-ink-3">{sub}</span> : null}
      </Link>
      {extra}
      {soon ? <SoonPill className="relative" /> : <KebabMenu label={`${name} actions`} actions={actions} className="relative" />}
    </div>
  );
}

/** "Your layers": the three phases of the position, one row each. */
export function LayersCard({ className, title = "Your layers" }: { className?: string; title?: string }) {
  const { data, connected } = useDapp();
  const { position, liquidityPosition, borrowPositions, lendPosition } = data;
  const debt = borrowPositions.reduce((sum, item) => sum + item.debt, 0);
  const worst = borrowPositions.reduce<number | null>((min, item) => (item.healthFactor === null ? min : min === null ? item.healthFactor : Math.min(min, item.healthFactor)), null);
  const collateral = borrowPositions.reduce((sum, item) => sum + item.collateralValueEth, 0);

  return (
    <Card>
      <CardHeader
        title={title}
        hint="Each layer on its own line, never added together."
        className="mb-1"
      />
      <div className={cn("row-divide", className)}>
        <LayerRow
          name="Vault shares"
          glyph="vault-shares"
          href="/app/stake"
          muted={!position}
          value={connected && position ? <Amount value={position.valueEth} asset="ETH" /> : "No stake yet"}
          sub={connected && position ? <Amount value={position.shares} asset="shares" /> : "Stake ETH to start"}
          actions={[
            { label: "Stake more", href: "/app/stake" },
            { label: "Unstake", href: "/app/unstake", disabled: !position },
            { label: "Lock shares", href: "/app/locks", disabled: !position },
          ]}
        />
        <LayerRow
          name="Liquidity Module"
          glyph="liquidity-module"
          soon={!FEATURES.liquidity}
          href="/app/liquidity"
          muted={!liquidityPosition?.locked}
          value={connected && liquidityPosition?.locked ? <Amount value={liquidityPosition.locked} asset="aEthosETH" /> : "Nothing locked"}
          sub={
            connected && liquidityPosition?.locked ? (
              <>
                <Amount value={liquidityPosition.lockedValueEth} asset="ETH" /> · {liquidityPosition.commitments.filter((item) => item.status !== "released").length} commitments
              </>
            ) : (
              "Commit aEthosETH for a fixed term"
            )
          }
          actions={[
            { label: "Lock aEthosETH", href: "/app/liquidity" },
            { label: "Manage commitments", href: "/app/liquidity", disabled: !liquidityPosition?.commitments.length },
          ]}
        />
        <LayerRow
          name="Borrowing"
          glyph="borrowing-markets"
          soon={!FEATURES.borrowing}
          href="/app/borrow"
          muted={!debt && !collateral && !lendPosition}
          value={connected && debt > 0 ? <Amount value={debt} asset="ETH" /> : connected && lendPosition ? <Amount value={lendPosition.supplied} asset="ETH" /> : "No debt"}
          sub={
            connected && debt > 0 ? (
              <>Debt · health {formatHealth(worst)}</>
            ) : connected && lendPosition ? (
              "Lent to the markets"
            ) : (
              "Borrow against osETH, or lend ETH"
            )
          }
          extra={connected && debt > 0 ? <HealthBadge value={worst} size="sm" className="relative hidden sm:inline-flex" /> : null}
          actions={[
            { label: "Borrow ETH", href: "/app/borrow" },
            { label: "Repay", href: "/app/borrow", disabled: debt <= 0 },
            { label: "Lend ETH", href: "/app/borrow" },
          ]}
        />
      </div>
    </Card>
  );
}

/* ---------- returns ---------- */

/** Every source of return on its own line, by phase, with no total. */
export function ReturnsCard() {
  const { data, connected } = useDapp();
  if (!connected) return null;
  const lines = [...(data.position?.returns ?? []), ...(data.liquidityPosition?.returns ?? [])];
  if (data.lendPosition) {
    lines.push({ id: "lendingIncome", label: "Lending interest (your 75%)", phase: 3, amount: data.lendPosition.income, asset: "ETH", note: "From the ETH you lend to the markets" });
  }
  if (!lines.length) return null;
  return (
    <Card>
      <CardHeader title="Where your return comes from" hint="Each source on its own line. Definica never blends them into one rate." />
      <ul className="row-divide">
        {lines.map((line, i) => (
          <li key={`${line.id}-${i}`} className="flex items-center gap-3 py-3">
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{line.label}</span>
              <span className="block truncate text-xs text-ink-3">{line.note}</span>
            </span>
            <Amount value={line.amount} asset={line.asset} signed className={cn("text-sm font-bold", line.amount < 0 ? "text-red" : line.amount > 0 ? "text-green-ink" : "text-ink-2")} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ---------- misc ---------- */

/** A titled list of plain rules (what applies to every market, what a lock does…). */
export function RulesCard({ title, hint, rules }: { title: string; hint?: string; rules: { title: string; text: string }[] }) {
  return (
    <Card>
      <CardHeader title={title} hint={hint} />
      <ul className="grid gap-3 sm:grid-cols-2">
        {rules.map((rule) => (
          <li key={rule.title} className="rounded-[14px] bg-canvas p-4">
            <div className="text-sm font-bold">{rule.title}</div>
            <p className="mt-1 text-[13px] leading-5 text-ink-2">{rule.text}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** A small "Learn more" link into the docs. */
export function DocsLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink-2 hover:text-ink">
      {children}
      <ArrowUpRight className="size-3.5" aria-hidden="true" />
    </a>
  );
}
