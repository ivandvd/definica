"use client";

import { ArrowLeftRight, ChevronDown, Crosshair, Gauge, Gavel, Lock, Percent, ShieldCheck, TriangleAlert, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatAmount, formatHealth, formatPercent, healthZone, parseAmount } from "../lib/format";
import { HEALTH_CAUTION, type Action } from "../lib/protocol";
import type { BorrowPosition, Market, MarketId } from "../lib/types";
import { useDapp } from "../providers/DappProvider";
import { FlowPanes } from "../tx/TxPanes";
import { usePreview } from "../tx/usePreview";
import { useTxFlow } from "../tx/useTxFlow";
import { Amount } from "../ui/Amount";
import { AmountInput } from "../ui/AmountInput";
import { ArtBorrow } from "../ui/art";
import { Button } from "../ui/Button";
import { Card, CardHeader, Row } from "../ui/Card";
import { Sheet } from "../ui/Dialog";
import { EmptyState } from "../ui/EmptyState";
import { AssetBadge } from "../ui/Glyph";
import { HealthBadge, HealthBar } from "../ui/Health";
import { PageHeader } from "../ui/PageHeader";
import { Pill } from "../ui/Pill";
import { ProgressBar } from "../ui/Progress";
import { Segmented } from "../ui/Segmented";
import { SkeletonCard } from "../ui/Skeleton";
import { splitProblem } from "../tx/problems";
import { ActionButton, ConnectCard, DocsLink, EyeToggle, FormProblem, MiniStat, RulesCard } from "./shared";

/* ---------- parameters: what each one sets ---------- */

interface ParameterLine {
  key: string;
  name: string;
  sets: string;
  icon: LucideIcon;
  value: (market: Market) => string;
}

export const PARAMETERS: ParameterLine[] = [
  { key: "asset", name: "Borrow asset", sets: "What you borrow and repay", icon: ArrowLeftRight, value: (m) => m.params.borrowAsset },
  { key: "ltv", name: "Max LTV", sets: "The most you can borrow against the collateral", icon: Gauge, value: (m) => formatPercent(m.params.maxLtvPct, 0) },
  { key: "threshold", name: "Liquidation threshold", sets: "The loan-to-value where liquidation starts", icon: TriangleAlert, value: (m) => formatPercent(m.params.liquidationThresholdPct, 0) },
  { key: "oracle", name: "Oracle", sets: "The price source for collateral and debt", icon: Crosshair, value: (m) => m.params.oracle },
  { key: "rate", name: "Interest rate model", sets: "How the borrow rate follows utilisation", icon: Percent, value: (m) => `${formatPercent(m.borrowRatePct)} now · kink at ${m.params.rateModel.kinkPct}%` },
  { key: "caps", name: "Market caps", sets: "The limits on supply and borrowing", icon: Lock, value: (m) => `${formatAmount(m.params.supplyCap, 0)} ${m.asset} · ${formatAmount(m.params.borrowCap, 0)} ETH` },
  { key: "liquidation", name: "Liquidation process", sets: "Who can liquidate, how much, and the discount", icon: Gavel, value: (m) => `${formatPercent(m.params.liquidationPenaltyPct, 0)} penalty` },
  { key: "emergency", name: "Emergency controls", sets: "What can pause or cap the market", icon: ShieldCheck, value: () => "Market guardian" },
];

const marketById = (markets: Market[], id: MarketId) => markets.find((market) => market.id === id) ?? null;

/* ---------- the action panel ---------- */

type CollateralTab = "supply" | "borrow" | "repay" | "withdraw";
type LendTab = "supply" | "withdraw";

/** Health with a safe buffer: what Max may borrow or withdraw to, without crossing 1.5. */
const SAFE_HEALTH = HEALTH_CAUTION;

function CollateralForm({ market, flow, surface, tab }: { market: Market; flow: ReturnType<typeof useTxFlow>; surface: "card" | "canvas"; tab: CollateralTab }) {
  const { data, connected } = useDapp();
  const [input, setInput] = useState("");
  const position = data.borrowPositions.find((item) => item.marketId === market.id);
  const collateral = position?.collateral ?? 0;
  const debt = position?.debt ?? 0;
  const lt = market.params.liquidationThresholdPct / 100;
  const price = market.priceEth;
  const walletAsset = data.balances ? data.balances[market.asset as "osETH" | "aEthosETH"] : null;
  const ethBalance = data.balances?.ETH ?? null;
  const amount = parseAmount(input);

  const safeBorrow = Math.max(0, Math.min(position?.borrowable ?? 0, (collateral * price * lt) / SAFE_HEALTH - debt));
  const safeWithdraw = debt > 0 ? Math.max(0, collateral - (debt * SAFE_HEALTH) / (price * lt)) : collateral;

  const config: Record<CollateralTab, { asset: "osETH" | "aEthosETH" | "ETH"; balance: number | null; balanceLabel: string; max: number | null; verb: string; type: Action["type"] }> = {
    supply: { asset: market.asset as "osETH" | "aEthosETH", balance: walletAsset, balanceLabel: "In wallet", max: walletAsset, verb: "Supply", type: "supplyCollateral" },
    borrow: { asset: "ETH", balance: position?.borrowable ?? 0, balanceLabel: "Can borrow", max: safeBorrow, verb: "Borrow", type: "borrow" },
    repay: { asset: "ETH", balance: debt, balanceLabel: "Owed", max: debt > 0 ? debt * 1.0001 : 0, verb: "Repay", type: "repay" },
    withdraw: { asset: market.asset as "osETH" | "aEthosETH", balance: collateral, balanceLabel: "Supplied", max: safeWithdraw, verb: "Withdraw", type: "withdrawCollateral" },
  };
  const current = config[tab];
  const action = amount !== null && amount > 0 ? ({ type: current.type, marketId: market.id, amount } as Action) : null;
  const { preview, fresh } = usePreview(action);
  const ready = Boolean(action && fresh && preview && !preview.problem);
  const problems = splitProblem(action ? preview : null, fresh);
  const healthChange = preview?.changes.find((change) => change.label === "Health factor");
  const repayAll = tab === "repay" && amount !== null && amount >= debt - 1e-9 && debt > 0;

  return (
    <FlowPanes
      flow={flow}
      surface={surface}
      onFinished={(succeeded) => {
        if (succeeded) setInput("");
      }}
      form={
        <div className="flex flex-col gap-4">
          <AmountInput
            key={tab}
            label={tab === "supply" ? "You supply" : tab === "borrow" ? "You borrow" : tab === "repay" ? "You repay" : "You withdraw"}
            value={input}
            onChange={setInput}
            asset={current.asset}
            balance={connected ? current.balance : null}
            balanceLabel={current.balanceLabel}
            max={current.max}
            presets={
              current.balance
                ? [
                    { label: "25%", value: (current.max ?? 0) * 0.25 },
                    { label: "50%", value: (current.max ?? 0) * 0.5 },
                    { label: tab === "repay" ? "All" : tab === "supply" ? "Max" : "Safe max", value: current.max ?? 0 },
                  ]
                : undefined
            }
            error={problems.field}
            below={
              tab === "repay" ? (
                <>
                  Wallet: <Amount value={ethBalance ?? 0} asset="ETH" />
                  {repayAll ? " · clears interest to the minute" : ""}
                </>
              ) : tab === "borrow" ? (
                `Safe max keeps your health at ${SAFE_HEALTH.toFixed(2)} or above.`
              ) : tab === "withdraw" && debt > 0 ? (
                `Safe max keeps your health at ${SAFE_HEALTH.toFixed(2)} or above.`
              ) : (
                `Priced by the ${market.params.oracle}.`
              )
            }
          />
          <div className={cn("rounded-[16px] p-4", surface === "card" ? "bg-canvas" : "bg-card")}>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-ink-2">Health factor</span>
              <span className="flex items-center gap-1.5 font-semibold tabular">
                <span className="text-ink-3">{formatHealth(position?.healthFactor ?? null)}</span>
                {healthChange && fresh ? (
                  <>
                    <span className="text-ink-3">→</span>
                    <span className={healthChange.tone === "danger" ? "text-red" : healthChange.tone === "caution" ? "text-amber" : "text-green-ink"}>{healthChange.after}</span>
                  </>
                ) : null}
              </span>
            </div>
            <HealthBar value={position?.healthFactor ?? null} className="mt-3" />
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <span className="text-ink-2">
                Borrow rate <span className="font-semibold text-ink">{formatPercent(market.borrowRatePct)}</span>
              </span>
              <span className="text-right text-ink-2">
                Max LTV <span className="font-semibold text-ink">{market.params.maxLtvPct}%</span>
              </span>
            </div>
          </div>
          <FormProblem message={problems.form} />
          <ActionButton
            label={amount && amount > 0 ? (repayAll ? "Repay all" : `${current.verb} ${formatAmount(amount)} ${current.asset}`) : "Enter an amount"}
            disabled={!ready}
            onClick={() =>
              preview &&
              action &&
              amount &&
              flow.openReview({
                action,
                preview,
                labels: {
                  title: { supply: "Supply collateral", borrow: "Borrow ETH", repay: "Repay ETH", withdraw: "Withdraw collateral" }[tab],
                  successTitle: { supply: "Collateral supplied", borrow: "Borrowed", repay: repayAll ? "Loan repaid" : "Repaid", withdraw: "Collateral withdrawn" }[tab],
                  successText: {
                    supply: "Your collateral is in the market and your borrowing power is up.",
                    borrow: "The ETH is in your wallet. Interest accrues at the variable rate; keep an eye on your health.",
                    repay: repayAll ? "Your debt is cleared. Your collateral is free to withdraw." : "Your debt is lower and your health is higher.",
                    withdraw: "The collateral is back in your wallet.",
                  }[tab],
                },
                confirmLabel: repayAll ? "Repay all" : `${current.verb} ${formatAmount(amount)} ${current.asset}`,
                acknowledgement:
                  tab === "borrow"
                    ? "I understand the debt accrues variable interest and that my collateral can be liquidated if my health factor falls below 1."
                    : tab === "withdraw" && debt > 0
                      ? "I understand that withdrawing collateral lowers my health factor and brings liquidation closer."
                      : undefined,
              })
            }
          />
        </div>
      }
    />
  );
}

function LendForm({ market, flow, surface, tab }: { market: Market; flow: ReturnType<typeof useTxFlow>; surface: "card" | "canvas"; tab: LendTab }) {
  const { data, connected } = useDapp();
  const [input, setInput] = useState("");
  const lend = data.lendPosition;
  const eth = data.balances?.ETH ?? null;
  const amount = parseAmount(input);
  const action: Action | null = amount !== null && amount > 0 ? { type: tab === "supply" ? "supplyEth" : "withdrawEth", amount } : null;
  const { preview, fresh } = usePreview(action);
  const ready = Boolean(action && fresh && preview && !preview.problem);
  const problems = splitProblem(action ? preview : null, fresh);
  const balance = tab === "supply" ? eth : (lend?.withdrawableNow ?? 0);
  const max = tab === "supply" ? Math.max(0, (eth ?? 0) - 0.003) : (lend?.withdrawableNow ?? 0);
  return (
    <FlowPanes
      flow={flow}
      surface={surface}
      onFinished={(succeeded) => {
        if (succeeded) setInput("");
      }}
      form={
        <div className="flex flex-col gap-4">
          <AmountInput
            key={tab}
            label={tab === "supply" ? "You lend" : "You withdraw"}
            value={input}
            onChange={setInput}
            asset="ETH"
            balance={connected ? balance : null}
            balanceLabel={tab === "supply" ? "Balance" : "Withdrawable"}
            max={max}
            presets={[
              { label: "25%", value: max * 0.25 },
              { label: "50%", value: max * 0.5 },
              { label: "Max", value: max },
            ]}
            error={problems.field}
            below={tab === "supply" ? "75% of the interest attributable to you is allocated to you." : "Up to the ETH not lent out right now."}
          />
          <div className={cn("rounded-[16px] px-4 py-1", surface === "card" ? "bg-canvas" : "bg-card")}>
            <Row label="Supply rate" value={`${formatPercent(market.supplyRatePct)} a year`} hint="Variable, before the 75 / 25 split" />
            <Row label="Utilisation" value={formatPercent(market.utilisationPct, 1)} className="border-t border-line-soft" />
          </div>
          <FormProblem message={problems.form} />
          <ActionButton
            label={amount && amount > 0 ? `${tab === "supply" ? "Lend" : "Withdraw"} ${formatAmount(amount)} ETH` : "Enter an amount"}
            disabled={!ready}
            onClick={() =>
              preview &&
              action &&
              amount &&
              flow.openReview({
                action,
                preview,
                labels: {
                  title: tab === "supply" ? "Lend ETH" : "Withdraw ETH",
                  successTitle: tab === "supply" ? "ETH lent" : "ETH withdrawn",
                  successText: tab === "supply" ? "Your ETH is supplied to the markets. Your 75% of its interest is reported on its own line." : "The ETH is back in your wallet.",
                },
                confirmLabel: `${tab === "supply" ? "Lend" : "Withdraw"} ${formatAmount(amount)} ETH`,
                acknowledgement: tab === "supply" ? "I understand that lending losses can reduce what I get back, and that withdrawals depend on the ETH not lent out at the time." : undefined,
              })
            }
          />
        </div>
      }
    />
  );
}

/** Supply, borrow, repay and withdraw for one market (or lend ETH), with a market switch where offered. */
export function BorrowPanel({ marketId, onMarketChange, surface = "card", initialTab }: { marketId: MarketId; onMarketChange?: (id: MarketId) => void; surface?: "card" | "canvas"; initialTab?: CollateralTab }) {
  const { data } = useDapp();
  const flow = useTxFlow();
  const [tab, setTab] = useState<CollateralTab>(initialTab ?? "borrow");
  const market = marketById(data.markets, marketId);
  if (!market) return <SkeletonCard rows={5} />;
  const lending = market.kind === "supply";
  const lendTab: LendTab = tab === "withdraw" ? "withdraw" : "supply";

  return (
    <div className="flex flex-col gap-4">
      {onMarketChange && flow.step === "form" ? (
        <Segmented
          block
          surface={surface === "card" ? "canvas" : "card"}
          value={marketId}
          onChange={onMarketChange}
          options={data.markets.map((item) => ({
            value: item.id,
            label: (
              <span className="flex items-center gap-1.5">
                <AssetBadge asset={item.asset} size={18} />
                {item.kind === "supply" ? "Lend ETH" : item.name}
              </span>
            ),
          }))}
          aria-label="Market"
        />
      ) : null}
      {flow.step === "form" ? (
        lending ? (
          <Segmented
            block
            surface={surface === "card" ? "canvas" : "card"}
            value={lendTab}
            onChange={(next) => setTab(next)}
            options={[
              { value: "supply", label: "Lend" },
              { value: "withdraw", label: "Withdraw" },
            ]}
            aria-label="Action"
          />
        ) : (
          <Segmented
            block
            surface={surface === "card" ? "canvas" : "card"}
            value={tab}
            onChange={setTab}
            options={[
              { value: "supply", label: "Supply" },
              { value: "borrow", label: "Borrow" },
              { value: "repay", label: "Repay" },
              { value: "withdraw", label: "Withdraw" },
            ]}
            aria-label="Action"
          />
        )
      ) : null}
      {market.status !== "active" ? (
        <p className="rounded-[14px] bg-amber-soft p-3 text-[13px] text-ink-2">
          <span className="font-semibold text-ink">This market is paused.</span> Repayments, collateral top-ups and withdrawals of unborrowed ETH stay open.
        </p>
      ) : null}
      {lending ? (
        <LendForm key={`${market.id}-${lendTab}`} market={market} flow={flow} surface={surface} tab={lendTab} />
      ) : (
        <CollateralForm key={`${market.id}-${tab}`} market={market} flow={flow} surface={surface} tab={tab} />
      )}
    </div>
  );
}

/* ---------- position and markets ---------- */

function PositionSummary({ positions }: { positions: BorrowPosition[] }) {
  const { data } = useDapp();
  const collateralValue = positions.reduce((sum, item) => sum + item.collateralValueEth, 0);
  const debt = positions.reduce((sum, item) => sum + item.debt, 0);
  const borrowable = positions.reduce((sum, item) => sum + item.borrowable, 0);
  const worst = positions.reduce<number | null>((min, item) => (item.healthFactor === null ? min : min === null ? item.healthFactor : Math.min(min, item.healthFactor)), null);
  const primary = positions.find((item) => item.marketId === "oseth") ?? positions[0];
  const market = primary ? marketById(data.markets, primary.marketId) : null;
  const zone = healthZone(worst);
  return (
    <Card className={cn(zone === "risk" || zone === "liquidatable" ? "shadow-[inset_0_0_0_2px_var(--color-red)]" : undefined)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-[13px] font-semibold">
          Your borrow position <EyeToggle />
        </div>
        <HealthBadge value={worst} />
      </div>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="figure text-[34px] leading-none font-extrabold sm:text-[40px]">
          <Amount value={primary?.collateral ?? 0} asset={market?.asset} animate className="figure" unitClassName="ml-[0.3em] text-xl" />
        </span>
        <Pill tone="green">Collateral</Pill>
      </div>
      <div className="mt-5">
        <HealthBar value={worst} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line-soft pt-4 sm:grid-cols-4">
        <MiniStat label="Collateral value">
          <Amount value={collateralValue} asset="ETH" />
        </MiniStat>
        <MiniStat label="Debt" hint="With interest">
          <Amount value={debt} asset="ETH" />
        </MiniStat>
        <MiniStat label="Can still borrow">
          <Amount value={borrowable} asset="ETH" />
        </MiniStat>
        <MiniStat label="Liquidation price" hint={market ? `ETH per ${market.asset}` : undefined}>
          {primary?.liquidationPriceEth ? formatAmount(primary.liquidationPriceEth) : "—"}
        </MiniStat>
      </div>
      {zone === "risk" || zone === "liquidatable" ? (
        <p className="mt-4 rounded-[14px] bg-red-soft p-3 text-[13px] text-ink-2" role="alert">
          <span className="font-semibold text-red">{zone === "liquidatable" ? "This loan can be liquidated now." : "This loan is close to liquidation."}</span> Repay some ETH or add collateral to raise your health.
        </p>
      ) : null}
    </Card>
  );
}

function MarketRow({ market, position }: { market: Market; position?: BorrowPosition }) {
  const [open, setOpen] = useState(false);
  const { data } = useDapp();
  const supplied = market.kind === "supply" ? (data.lendPosition?.supplied ?? 0) : (position?.collateral ?? 0);
  return (
    <li>
      <div className="flex items-center gap-3 py-3.5">
        <AssetBadge asset={market.asset} size={38} />
        <button type="button" onClick={() => setOpen(!open)} className="min-w-0 flex-1 text-left" aria-expanded={open}>
          <span className="flex items-center gap-2 text-sm font-bold">
            {market.kind === "supply" ? "ETH supply" : market.name}
            {market.status !== "active" ? (
              <Pill tone="amber" size="sm">
                Paused
              </Pill>
            ) : null}
          </span>
          <span className="block truncate text-xs text-ink-2">{market.role}</span>
        </button>
        <span className="text-right">
          <span className="block text-sm font-bold">{supplied > 0 ? <Amount value={supplied} /> : "—"}</span>
          <span className="block text-xs text-ink-3">{supplied > 0 ? (market.kind === "supply" ? "Lent" : "Supplied") : "Available"}</span>
        </span>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex size-8 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-canvas hover:text-ink"
          aria-label={open ? "Hide parameters" : "Show parameters"}
          aria-expanded={open}
        >
          <ChevronDown className={cn("size-4 transition-transform duration-300", open && "rotate-180")} aria-hidden="true" />
        </button>
      </div>
      <div className={cn("grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-soft)]", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <ul className="mb-3 ml-[50px] flex flex-col">
            {(market.kind === "supply" ? PARAMETERS.filter((line) => ["rate", "caps", "emergency"].includes(line.key)) : PARAMETERS).map((line, i) => (
              <li key={line.key} className="flex items-center gap-3 py-2" style={open ? { animation: `rise 0.4s var(--ease-out-soft) ${i * 45}ms both` } : undefined}>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-canvas">
                  <line.icon className="size-3.5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold">{line.name}</span>
                  <span className="block text-xs text-green-ink">{line.sets}</span>
                </span>
                <span className="max-w-[45%] text-right text-[13px] font-semibold">{line.value(market)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

function MarketsCard() {
  const { data, publicLoading } = useDapp();
  const [view, setView] = useState<"markets" | "parameters">("markets");
  if (publicLoading) return <SkeletonCard rows={4} />;
  const collateral = data.markets.filter((market) => market.kind === "collateral");
  return (
    <Card>
      <div className="mb-2 flex items-center justify-between gap-3">
        <Segmented
          size="sm"
          value={view}
          onChange={setView}
          options={[
            { value: "markets", label: "Markets" },
            { value: "parameters", label: "Parameters" },
          ]}
          aria-label="View"
        />
        <DocsLink href="/docs/phase-3/market-parameters">Market parameters</DocsLink>
      </div>
      {view === "markets" ? (
        <ul className="row-divide">
          {data.markets.map((market) => (
            <MarketRow key={market.id} market={market} position={data.borrowPositions.find((item) => item.marketId === market.id)} />
          ))}
        </ul>
      ) : (
        <div className="-mx-1 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-[13px]">
            <thead>
              <tr className="text-xs text-ink-3">
                <th className="px-1 py-2 font-semibold">Parameter</th>
                {collateral.map((market) => (
                  <th key={market.id} className="px-1 py-2 font-semibold">
                    {market.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="row-divide">
              {PARAMETERS.map((line) => (
                <tr key={line.key} className="border-t border-line-soft">
                  <td className="px-1 py-2.5">
                    <span className="block font-semibold">{line.name}</span>
                    <span className="block text-xs text-green-ink">{line.sets}</span>
                  </td>
                  {collateral.map((market) => (
                    <td key={market.id} className="px-1 py-2.5 font-semibold">
                      {line.value(market)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function LendCard({ onLend }: { onLend: () => void }) {
  const { data, connected } = useDapp();
  const market = marketById(data.markets, "eth");
  if (!market) return null;
  const lend = data.lendPosition;
  return (
    <Card>
      <CardHeader title="Lend ETH" hint="Supply the markets directly, with no funding debt." icon={<AssetBadge asset="ETH" size={34} />} action={<Button size="sm" onClick={onLend}>Lend</Button>} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MiniStat label="You lend">{connected && lend ? <Amount value={lend.supplied} asset="ETH" /> : "—"}</MiniStat>
        <MiniStat label="Your interest" hint="Your 75%">
          {connected && lend ? <Amount value={lend.income} asset="ETH" signed className="text-green-ink" /> : "—"}
        </MiniStat>
        <MiniStat label="Supply rate" hint="Variable">
          {formatPercent(market.supplyRatePct)}
        </MiniStat>
        <MiniStat label="Utilisation">{formatPercent(market.utilisationPct, 1)}</MiniStat>
      </div>
      <ProgressBar value={market.utilisationPct / 100} tone={market.utilisationPct > 90 ? "amber" : "green"} size="sm" className="mt-4" label="Utilisation" />
      <p className="mt-2 text-xs text-ink-3">
        <Amount value={market.liquidity} asset="ETH" digits={2} isPublic /> not lent out, so withdrawable now. At high utilisation, lenders wait for repayments.
      </p>
    </Card>
  );
}

/* ---------- screen ---------- */

export function BorrowScreen() {
  const { data, connected, accountLoading } = useDapp();
  const [marketId, setMarketId] = useState<MarketId>("oseth");
  const [sheet, setSheet] = useState<{ market: MarketId; tab: CollateralTab } | null>(null);
  const positions = data.borrowPositions;
  const open = (tab: CollateralTab, market: MarketId = "oseth") => setSheet({ market, tab });

  let summary: ReactNode;
  if (!connected) summary = <ConnectCard title="Connect to see your loans" text="Your collateral, debt and health are read for the connected address." art={<ArtBorrow />} />;
  else if (accountLoading) summary = <SkeletonCard rows={4} />;
  else if (!positions.length)
    summary = (
      <Card>
        <EmptyState
          art={<ArtBorrow />}
          title="No loans yet"
          text="Supply osETH as collateral, then borrow ETH against it. Every market's rules are listed below, before you confirm."
          action={
            <>
              <Button className="xl:hidden" onClick={() => open("supply")}>
                Supply osETH
              </Button>
              <Button className="hidden xl:inline-flex" onClick={() => setMarketId("oseth")}>
                Supply osETH on the right
              </Button>
            </>
          }
        />
      </Card>
    );
  else
    summary = (
      <>
        <PositionSummary positions={positions} />
        <div className="grid grid-cols-4 gap-2 xl:hidden">
          {(["supply", "borrow", "repay", "withdraw"] as CollateralTab[]).map((tab) => (
            <Button key={tab} variant={tab === "borrow" ? "primary" : "secondary"} onClick={() => open(tab)} className="capitalize">
              {tab}
            </Button>
          ))}
        </div>
      </>
    );

  return (
    <>
      <PageHeader title="Borrowing markets" description="Borrow ETH against approved ETH-correlated collateral, or lend ETH to the markets." />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px] xl:items-start xl:gap-6 2xl:grid-cols-[minmax(0,1fr)_440px]">
        <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
          {summary}
          <MarketsCard />
          <LendCard onLend={() => (window.matchMedia("(min-width: 1280px)").matches ? setMarketId("eth") : open("supply", "eth"))} />
          <RulesCard
            title="What applies to every market"
            rules={[
              { title: "Debt and interest", text: "Borrowers pay variable interest, and the debt with its interest must be repaid to release the collateral." },
              { title: "Oracle dependency", text: "An oracle prices the collateral and the debt. Its correctness is a dependency of every market." },
              { title: "Liquidation", text: "If the collateral's value falls or the debt grows past the threshold, some or all of the collateral can be sold." },
              { title: "Correlation isn't safety", text: "ETH-correlated collateral still carries validator, fee, price, liquidity, redemption and contract risks." },
            ]}
          />
        </div>
        <aside className="hidden xl:sticky xl:top-[100px] xl:block">
          <Card>
            <BorrowPanel key={marketId} marketId={marketId} onMarketChange={setMarketId} />
          </Card>
        </aside>
      </div>
      <Sheet
        open={sheet !== null}
        onOpenChange={(next) => !next && setSheet(null)}
        title={sheet?.market === "eth" ? "Lend ETH" : sheet ? `${marketById(data.markets, sheet.market)?.name ?? ""} market` : ""}
      >
        {sheet ? <BorrowPanel key={`${sheet.market}-${sheet.tab}`} marketId={sheet.market} surface="canvas" initialTab={sheet.tab} /> : null}
      </Sheet>
    </>
  );
}
