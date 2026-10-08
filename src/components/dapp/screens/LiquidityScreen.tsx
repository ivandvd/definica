"use client";

import { Check, Lock, Unlock } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DAY, formatAmount, formatCountdown, formatDate, formatHealth, formatPercent, parseAmount } from "../lib/format";
import { HEALTH_CAUTION } from "../lib/protocol";
import type { Commitment } from "../lib/types";
import { useDapp } from "../providers/DappProvider";
import { FlowPanes } from "../tx/TxPanes";
import { TxSheet, type SheetRequest } from "../tx/TxSheet";
import { usePreview } from "../tx/usePreview";
import { useTxFlow } from "../tx/useTxFlow";
import { Amount } from "../ui/Amount";
import { AmountInput } from "../ui/AmountInput";
import { ArtLiquidity } from "../ui/art";
import { Button } from "../ui/Button";
import { Card, CardHeader, Row } from "../ui/Card";
import { ResponsiveSheet, Sheet } from "../ui/Dialog";
import { EmptyState } from "../ui/EmptyState";
import { AssetBadge, GlyphBadge } from "../ui/Glyph";
import { HealthBadge } from "../ui/Health";
import { Padlock } from "../ui/illustrations";
import { Notice } from "../ui/Notice";
import { PageHeader } from "../ui/PageHeader";
import { Pill } from "../ui/Pill";
import { ProgressBar } from "../ui/Progress";
import { Segmented } from "../ui/Segmented";
import { SkeletonCard } from "../ui/Skeleton";
import { Switch } from "../ui/Switch";
import { splitProblem } from "../tx/problems";
import { ActionButton, ConnectCard, DocsLink, FormProblem } from "./shared";

type Source = "osETH" | "aEthosETH";

/* ---------- the lock flow (the walkthrough's sheet) ---------- */

function LockForm({ flow, surface }: { flow: ReturnType<typeof useTxFlow>; surface: "card" | "canvas" }) {
  const { data, connected } = useDapp();
  const info = data.liquidity;
  const balances = data.balances;
  const [source, setSource] = useState<Source>("osETH");
  const [input, setInput] = useState("");
  const [days, setDays] = useState(90);
  const [financed, setFinanced] = useState(false);
  const [loanInput, setLoanInput] = useState("");
  const amount = parseAmount(input);
  const loan = financed ? parseAmount(loanInput) : null;
  const balance = balances ? balances[source] : null;
  const action = amount !== null && amount > 0 ? { type: "commit" as const, source, amount, days, financing: financed && loan && loan > 0 ? loan : null } : null;
  const { preview, fresh } = usePreview(action);
  const ready = Boolean(action && fresh && preview && !preview.problem && (!financed || (loan && loan > 0)));
  const problems = splitProblem(action ? preview : null, fresh);
  const loanCodes = ["healthFactor", "borrowCap", "notBorrowableInEMode"];
  const loanProblem = problems.field && preview?.problem && loanCodes.includes(preview.problem.code) ? problems.field : null;
  const amountProblem = problems.field && !loanProblem ? problems.field : null;
  const inner = surface === "card" ? "bg-canvas" : "bg-card";

  if (!info) return <SkeletonCard rows={4} />;
  const { rules, financing, reserve } = info;
  const maxLoan = amount ? amount * info.osethRateEth * (financing.maxLtvPct / 100) : 0;
  const safeLoan = maxLoan * 0.8;
  const health = amount && loan ? (amount * info.osethRateEth * financing.liquidationThresholdPct) / 100 / loan : null;
  const nothingToLock = connected && balances !== null && balances.osETH <= 0 && balances.aEthosETH <= 0;
  const maturesAt = data.now + days * DAY;

  return (
    <FlowPanes
      flow={flow}
      surface={surface}
      doneLabel="Done"
      successArt={<Padlock locked size={76} className="mb-1" />}
      onFinished={(succeeded) => {
        if (succeeded) {
          setInput("");
          setLoanInput("");
          setFinanced(false);
        }
      }}
      form={
        <div className="flex flex-col gap-4">
          <Segmented
            block
            surface={surface === "card" ? "canvas" : "card"}
            value={source}
            onChange={(next) => {
              setSource(next);
              setInput("");
            }}
            options={[
              { value: "osETH", label: "From osETH" },
              { value: "aEthosETH", label: "From aEthosETH" },
            ]}
            aria-label="What you lock from"
          />
          <p className="-mt-1 text-xs leading-4 text-ink-3">
            {source === "osETH" ? "Your osETH is supplied to Aave V3, then the aEthosETH it becomes is committed." : "aEthosETH you already hold from Aave's osETH reserve is committed directly."}
          </p>

          {nothingToLock ? (
            <Notice tone="info" title="You need osETH or aEthosETH">
              Mint osETH against ETH staked in a StakeWise Vault, or acquire it on a market. Your Vault shares don&apos;t mint osETH.{" "}
              <a href="https://app.stakewise.io" target="_blank" rel="noreferrer">
                Open StakeWise
              </a>
            </Notice>
          ) : null}
          {source === "osETH" && reserve.status !== "active" ? (
            <Notice tone="caution" title={reserve.status === "frozen" ? "The osETH reserve is frozen" : "The osETH reserve is paused"}>
              New supply to Aave is closed for now. You can still commit aEthosETH you already hold.
            </Notice>
          ) : null}

          <AmountInput
            label="You lock"
            value={input}
            onChange={setInput}
            asset={source}
            balance={connected ? balance : null}
            balanceLabel="Available"
            presets={[
              { label: "Min", value: rules.minCommit },
              { label: "50%", value: (balance ?? 0) * 0.5 },
              { label: "Max", value: Math.min(balance ?? 0, rules.maxCommit) },
            ]}
            error={amountProblem}
            below={amount && amount > 0 ? <>Becomes {formatAmount(amount)} aEthosETH, locked until {formatDate(maturesAt)}</> : "Committed aEthosETH isn't collateral in the borrowing markets."}
          />

          <div>
            <div className="mb-2 flex items-center justify-between text-[13px] text-ink-2">
              <span>Duration</span>
              {rules.incentive ? <span className="text-xs text-ink-3">✦ earns lock incentives</span> : null}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {rules.durations.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={days === option}
                  onClick={() => setDays(option)}
                  className={cn(
                    "relative h-11 rounded-chip text-[13px] font-semibold transition-colors",
                    days === option ? "bg-ink text-white" : surface === "card" ? "bg-chip hover:bg-chip-hover" : "bg-card hover:bg-chip",
                  )}
                >
                  {option === 365 ? "1 year" : `${option} days`}
                  {rules.incentive && option >= 90 ? <span className={cn("absolute top-1 right-1.5 text-[9px]", days === option ? "text-lime" : "text-ink-3")}>✦</span> : null}
                </button>
              ))}
            </div>
          </div>

          <div className={cn("rounded-[16px] p-4", inner)}>
            <Switch
              checked={financed}
              onCheckedChange={(next) => {
                setFinanced(next);
                if (!next) setLoanInput("");
              }}
              disabled={!financing.available}
              label="Finance this commitment"
              description={
                financing.available
                  ? "Optional. Borrow WETH at Aave against it; the loan supplies the borrowing markets and earns you 75% of its attributable interest."
                  : "Financing isn't available right now: the Aave market, eMode, liquidity or caps don't allow a loan."
              }
            />
            {financed ? (
              <div className="mt-4 flex flex-col gap-3 animate-rise">
                <AmountInput
                  label="Funding loan"
                  value={loanInput}
                  onChange={setLoanInput}
                  asset="WETH"
                  balance={amount ? maxLoan : null}
                  balanceLabel="Up to"
                  max={amount ? safeLoan : null}
                  presets={[
                    { label: "25%", value: maxLoan * 0.25 },
                    { label: "50%", value: maxLoan * 0.5 },
                    { label: "Safe max", value: safeLoan },
                  ]}
                  error={loanProblem}
                  below={!amount ? "Enter the amount to lock first." : "Safe max keeps a 20% buffer below the maximum LTV."}
                />
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-ink-2">Loan health after</span>
                  {health ? <HealthBadge value={health} /> : <span className="text-ink-3">—</span>}
                </div>
                <div className="rounded-[12px] bg-card/60 px-3 py-1 text-[13px]">
                  <Row label="Borrow rate" value={`${formatPercent(financing.borrowRatePct)} a year, variable`} className="py-2 text-[13px]" />
                  <Row label="eMode · max LTV · threshold" value={`${financing.emode} · ${financing.maxLtvPct}% · ${financing.liquidationThresholdPct}%`} className="border-t border-line-soft py-2 text-[13px]" />
                </div>
              </div>
            ) : null}
          </div>

          <FormProblem message={problems.form} />
          <ActionButton
            label={financed && !(loan && loan > 0) ? "Enter the loan amount" : amount && amount > 0 ? "Review" : "Enter an amount"}
            disabled={!ready}
            onClick={() =>
              preview &&
              action &&
              flow.openReview({
                action,
                preview,
                labels: {
                  title: "Confirm lock",
                  successTitle: "Locked",
                  successText: `Your aEthosETH is committed to the Module until ${formatDate(maturesAt)}. Each part of its return is reported on its own line.`,
                },
                confirmLabel: "Confirm lock",
                acknowledgement: `I understand the commitment runs for ${days} days with no early release and that locking aEthosETH doesn't make it collateral${
                  action.financing ? ", and that the funding loan is a real debt with variable interest and liquidation risk that only repayment ends" : ""
                }.`,
              })
            }
          />
          <p className="text-center text-xs text-ink-3">Supply interest and incentives are reported separately.</p>
        </div>
      }
    />
  );
}

/* ---------- the module card ---------- */

function ModuleCard({ onLock, onUnlock }: { onLock: () => void; onUnlock: () => void }) {
  const { data, connected, preferences, setPreferences } = useDapp();
  const position = data.liquidityPosition;
  const locked = position?.locked ?? 0;
  const releasable = (position?.commitments ?? []).filter((item) => item.status === "matured").length;
  return (
    <Card>
      <div className="relative">
        <div className="flex items-center gap-2 text-[13px] font-semibold">
          Locked aEthosETH
        </div>
        <div className="figure mt-2 text-[34px] leading-none font-extrabold sm:text-[40px]">
          <Amount value={connected ? locked : 0} animate className="figure" />
        </div>
        <div className="mt-1.5 text-[13px] text-ink-2">
          ≈ <Amount value={position?.lockedValueEth ?? 0} asset="ETH" /> at the osETH rate
        </div>
        <Padlock locked={locked > 0} size={46} className="absolute top-0 right-0" />
      </div>
      <div className="my-4 h-px bg-line-soft" />
      <Switch
        checked={preferences.showLayers}
        onCheckedChange={(next) => setPreferences({ showLayers: next })}
        label="Show each layer separately"
        description="Staking exposure, Aave supply interest and incentives are never blended."
      />
      {preferences.showLayers && connected && position?.returns.length ? (
        <ul className="mt-3 flex flex-col gap-1 animate-rise">
          {position.returns.map((line) => (
            <li key={line.id} className="flex items-center justify-between gap-3 rounded-[12px] bg-canvas px-3 py-2.5 text-sm">
              <span className="min-w-0">
                <span className="block font-semibold">{line.label}</span>
                <span className="block truncate text-xs text-ink-3">{line.note}</span>
              </span>
              <Amount value={line.amount} asset={line.asset} signed className={cn("font-bold", line.amount < 0 ? "text-red" : "text-green-ink")} />
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-4 grid grid-cols-2 gap-2 xl:hidden">
        <Button variant="soft" size="lg" icon={<Unlock />} onClick={onUnlock}>
          Unlock{releasable ? ` (${releasable})` : ""}
        </Button>
        <Button size="lg" icon={<Lock />} onClick={onLock}>
          Lock
        </Button>
      </div>
    </Card>
  );
}

/* ---------- commitments ---------- */

function CloseChecklist({ commitment, onRepay }: { commitment: Commitment; onRepay: () => void }) {
  const debt = commitment.financing?.debt ?? 0;
  const released = commitment.status === "released";
  const steps: { label: string; done: boolean; ready: boolean; note: string; action?: ReactNode }[] = [
    { label: "Release the commitment", done: released, ready: commitment.status === "matured", note: released ? "Released" : commitment.status === "matured" ? "Ready" : `At maturity, ${formatDate(commitment.maturesAt)}` },
    {
      label: "Repay the funding loan",
      done: debt <= 0,
      ready: debt > 0,
      note: debt > 0 ? `${formatAmount(debt)} WETH owed` : "Repaid",
      action: debt > 0 ? (
        <Button size="sm" variant="secondary" onClick={onRepay}>
          Repay
        </Button>
      ) : null,
    },
    { label: "Withdraw aEthosETH to osETH", done: false, ready: released && debt <= 0, note: released && debt <= 0 ? "From your wallet, below" : "After the first two steps" },
  ];
  return (
    <ol className="mt-3 flex flex-col gap-2 rounded-[14px] bg-canvas p-3">
      <li className="text-xs font-semibold text-ink-2">Closing a financed position</li>
      {steps.map((step, i) => (
        <li key={step.label} className="flex items-center gap-3 text-[13px]">
          <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold", step.done ? "bg-green text-white" : step.ready ? "bg-ink text-lime" : "bg-chip text-ink-2")}>
            {step.done ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
          </span>
          <span className="min-w-0 flex-1">
            <span className={cn("block font-semibold", step.done && "text-ink-3 line-through")}>{step.label}</span>
            <span className="block text-xs text-ink-3">{step.note}</span>
          </span>
          {step.action}
        </li>
      ))}
    </ol>
  );
}

function CommitmentRow({ commitment, onRelease, onRepay }: { commitment: Commitment; onRelease: () => void; onRepay: () => void }) {
  const { data } = useDapp();
  const loan = commitment.financing;
  const progress = commitment.status === "active" ? (data.now - commitment.startedAt) / (commitment.maturesAt - commitment.startedAt) : 1;
  return (
    <li className="py-4">
      <div className="flex flex-wrap items-center gap-3">
        <GlyphBadge glyph="liquidity-module" size={38} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-bold">
              <Amount value={commitment.amount} asset="aEthosETH" />
            </span>
            <Pill tone={commitment.status === "matured" ? "green" : commitment.status === "active" ? "sky" : "grey"} size="sm" dot={commitment.status === "matured"}>
              {commitment.status === "matured" ? "Matured" : commitment.status === "active" ? "Active" : "Released"}
            </Pill>
            {loan ? (
              <Pill tone="amber" size="sm">
                Financed
              </Pill>
            ) : null}
          </div>
          <div className="mt-0.5 text-xs text-ink-2">
            From {commitment.source} · {commitment.days} days · {formatDate(commitment.startedAt)} → {formatDate(commitment.maturesAt)}
          </div>
        </div>
        {commitment.status === "matured" ? (
          <Button size="sm" onClick={onRelease}>
            Release
          </Button>
        ) : null}
      </div>
      <div className="mt-3 pl-[50px]">
        {commitment.status !== "released" ? (
          <>
            <ProgressBar value={progress} tone={commitment.status === "matured" ? "green" : "ink"} size="sm" label="Time to maturity" />
            <div className="mt-1.5 text-xs text-ink-3">{commitment.status === "matured" ? "Matured: release it to end the commitment." : `${formatCountdown(commitment.maturesAt, data.now)} left`}</div>
          </>
        ) : null}
        {loan && loan.debt > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
            <span className="text-ink-2">
              Funding loan <Amount value={loan.debt} asset="WETH" className="font-semibold text-ink" />
            </span>
            <HealthBadge value={loan.healthFactor} size="sm" />
            {loan.healthFactor < HEALTH_CAUTION ? <span className="text-xs font-semibold text-amber">Consider repaying part</span> : null}
          </div>
        ) : null}
        {commitment.heldForRepayment ? (
          <Notice tone="caution" className="mt-3">
            Released. The aEthosETH stays with the Module until the funding loan is repaid.
          </Notice>
        ) : null}
        {loan ? <CloseChecklist commitment={commitment} onRepay={onRepay} /> : null}
      </div>
    </li>
  );
}

function Commitments({ onRelease, onRepay }: { onRelease: (commitment: Commitment) => void; onRepay: (commitment: Commitment) => void }) {
  const { data, connected, accountLoading } = useDapp();
  if (!connected) return <ConnectCard title="Connect to see your commitments" text="Your locked aEthosETH, funding loans and what has matured are read for the connected address." art={<ArtLiquidity />} />;
  if (accountLoading) return <SkeletonCard rows={4} />;
  const commitments = data.liquidityPosition?.commitments ?? [];
  return (
    <Card>
      <CardHeader title="Your commitments" hint="Matured first, then by maturity date." action={<DocsLink href="/docs/phase-2">How it works</DocsLink>} />
      {commitments.length ? (
        <ul className="row-divide -mt-2">
          {commitments.map((commitment) => (
            <CommitmentRow key={commitment.id} commitment={commitment} onRelease={() => onRelease(commitment)} onRepay={() => onRepay(commitment)} />
          ))}
        </ul>
      ) : (
        <EmptyState
          art={<ArtLiquidity />}
          title="Nothing locked yet"
          text="Lock osETH or aEthosETH for a fixed term. Supply interest, incentives and any lending income are each reported on their own line."
          className="py-6"
        />
      )}
    </Card>
  );
}

/* ---------- obligations, wallet, reserve, rules ---------- */

function Obligations({ onRepay }: { onRepay: (commitment: Commitment) => void }) {
  const { data, connected } = useDapp();
  if (!connected) return null;
  const position = data.liquidityPosition;
  const financed = (position?.commitments ?? []).filter((item) => (item.financing?.debt ?? 0) > 0);
  return (
    <Card>
      <CardHeader title="Obligations" hint="Debts are kept apart from returns. A commitment alone creates no debt." />
      {position?.obligations.length ? (
        <ul className="row-divide">
          {position.obligations.map((obligation) => (
            <li key={obligation.id} className="flex flex-wrap items-center gap-3 py-3">
              <AssetBadge asset={obligation.asset} size={34} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">
                  {obligation.label} · <Amount value={obligation.amount} asset={obligation.asset} />
                </span>
                <span className="block text-xs text-ink-3">
                  {obligation.settledAt}
                  {obligation.accruing ? " · interest accruing" : ""}
                </span>
              </span>
              {financed[0] ? (
                <Button size="sm" variant="secondary" onClick={() => onRepay(financed[0])}>
                  Repay
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-[14px] bg-canvas p-4 text-[13px] text-ink-2">No debts. Financing is opt-in, so nothing is owed unless you authorise a funding loan.</p>
      )}
      <p className="mt-3 text-xs leading-4 text-ink-3">If you minted osETH against staked ETH at a StakeWise Vault, that osETH liability is separate and stays at the minting Vault.</p>
    </Card>
  );
}

function WalletReceipts({ onWithdraw }: { onWithdraw: () => void }) {
  const { data, connected } = useDapp();
  if (!connected || !data.balances) return null;
  return (
    <Card>
      <CardHeader title="In your wallet" hint="Uncommitted receipts, free to lock or to withdraw from Aave." />
      <div className="grid gap-2 sm:grid-cols-2">
        {(["osETH", "aEthosETH"] as const).map((asset) => (
          <div key={asset} className="flex items-center gap-3 rounded-[14px] bg-canvas p-3.5">
            <AssetBadge asset={asset} size={34} />
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-ink-2">{asset}</span>
              <Amount value={data.balances![asset]} className="block text-base font-bold" />
            </span>
            {asset === "aEthosETH" && data.balances!.aEthosETH > 0 ? (
              <Button size="sm" variant="secondary" onClick={onWithdraw}>
                To osETH
              </Button>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  );
}

function ReserveAndRules() {
  const { data } = useDapp();
  const info = data.liquidity;
  if (!info) return <SkeletonCard rows={6} />;
  const { reserve, rules } = info;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
      <Card>
        <CardHeader
          title="Aave osETH reserve"
          icon={<GlyphBadge glyph="aave-v3" size={34} />}
          action={
            <Pill tone={reserve.status === "active" ? "green" : "amber"} dot>
              {reserve.status === "active" ? "Active" : reserve.status === "frozen" ? "Frozen" : "Paused"}
            </Pill>
          }
        />
        <div className="mb-1 flex justify-between text-[13px]">
          <span className="text-ink-2">Supply cap used</span>
          <span className="font-semibold tabular">{formatPercent((reserve.totalSupplied / reserve.supplyCap) * 100, 1)}</span>
        </div>
        <ProgressBar value={reserve.totalSupplied / reserve.supplyCap} tone={reserve.totalSupplied / reserve.supplyCap > 0.95 ? "amber" : "sky"} size="sm" label="Supply cap used" />
        <div className="row-divide mt-2">
          <Row label="Supply rate" value={`${formatPercent(reserve.supplyRatePct)} a year`} hint="Variable, set by Aave" />
          <Row label="Unborrowed osETH" value={<Amount value={reserve.unborrowed} asset="osETH" digits={0} isPublic />} hint="What can be withdrawn now" />
        </div>
      </Card>
      <Card>
        <CardHeader title="Module rules" icon={<GlyphBadge glyph="liquidity-module" size={34} />} />
        <div className="mb-1 flex justify-between text-[13px]">
          <span className="text-ink-2">Capacity used</span>
          <span className="font-semibold tabular">{formatPercent((rules.committed / rules.capacity) * 100, 1)}</span>
        </div>
        <ProgressBar value={rules.committed / rules.capacity} tone="green" size="sm" label="Module capacity used" />
        <div className="row-divide mt-2">
          <Row label="Durations" value={rules.durations.map((d) => (d === 365 ? "1 year" : `${d}d`)).join(" · ")} />
          <Row label="Per commitment" value={`${formatAmount(rules.minCommit, 2)} – ${formatAmount(rules.maxCommit, 0)}`} />
          <Row label="Early release" value={rules.earlyRelease ? "Allowed" : "Not available"} />
          {rules.incentive ? <Row label="Lock incentives" value={rules.incentive.name} hint={`${rules.incentive.eligibility}, until ${formatDate(rules.incentive.endsAt)}`} /> : null}
        </div>
      </Card>
    </div>
  );
}

/* ---------- sheets with a small form ---------- */

function AmountSheet({
  open,
  onClose,
  title,
  asset,
  max,
  balanceLabel,
  build,
  confirmLabel,
  labels,
  note,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  asset: "WETH" | "aEthosETH";
  max: number;
  balanceLabel: string;
  build: (amount: number) => Parameters<typeof usePreview>[0];
  confirmLabel: (amount: number) => string;
  labels: { title: string; successTitle: string; successText: string };
  note?: ReactNode;
}) {
  const flow = useTxFlow();
  const [input, setInput] = useState("");
  const amount = parseAmount(input);
  const action = amount !== null && amount > 0 ? build(amount) : null;
  const { preview, fresh } = usePreview(action);
  const ready = Boolean(action && fresh && preview && !preview.problem);
  const problems = splitProblem(action ? preview : null, fresh);
  const close = () => {
    flow.finish();
    setInput("");
    onClose();
  };
  return (
    <ResponsiveSheet open={open} onOpenChange={(next) => !next && close()} title={title} dismissible={flow.record?.status !== "wallet"}>
      <FlowPanes
        flow={flow}
        surface="canvas"
        onFinished={close}
        form={
          <div className="flex flex-col gap-3">
            <AmountInput
              label="Amount"
              value={input}
              onChange={setInput}
              asset={asset}
              balance={max}
              balanceLabel={balanceLabel}
              presets={[
                { label: "25%", value: max * 0.25 },
                { label: "50%", value: max * 0.5 },
                { label: "All", value: max },
              ]}
              error={problems.field}
            />
            {note}
            <FormProblem message={problems.form} />
            <ActionButton label="Review" disabled={!ready} onClick={() => preview && action && amount && flow.openReview({ action, preview, labels, confirmLabel: confirmLabel(amount) })} />
          </div>
        }
      />
    </ResponsiveSheet>
  );
}

/* ---------- screen ---------- */

/** Phase 2: commit aEthosETH for a fixed term, optionally financed, and unwind it in order. */
export function LiquidityScreen() {
  const { data } = useDapp();
  const desktopFlow = useTxFlow();
  const mobileFlow = useTxFlow();
  const [lockOpen, setLockOpen] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [release, setRelease] = useState<SheetRequest | null>(null);
  const [repay, setRepay] = useState<Commitment | null>(null);
  const [withdraw, setWithdraw] = useState(false);

  const startRelease = (commitment: Commitment) => {
    setUnlockOpen(false);
    setRelease({
      action: { type: "releaseCommitment", id: commitment.id },
      labels: {
        title: "Release commitment",
        successTitle: "Commitment released",
        successText: (commitment.financing?.debt ?? 0) > 0 ? "The commitment has ended. Repay the funding loan to get the aEthosETH back." : "The aEthosETH is back in your wallet, free to withdraw to osETH or lock again.",
      },
      confirmLabel: "Release",
    });
  };
  const releasable = (data.liquidityPosition?.commitments ?? []).filter((item) => item.status === "matured");

  return (
    <>
      <PageHeader title="Main Liquidity Module" description="Supply osETH to Aave V3, commit the aEthosETH position for a fixed term, and finance it only if you choose." />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px] xl:items-start xl:gap-6 2xl:grid-cols-[minmax(0,1fr)_440px]">
        <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
          <ModuleCard onLock={() => setLockOpen(true)} onUnlock={() => setUnlockOpen(true)} />
          <Commitments onRelease={startRelease} onRepay={setRepay} />
          <Obligations onRepay={setRepay} />
          <WalletReceipts onWithdraw={() => setWithdraw(true)} />
          <ReserveAndRules />
          <Notice tone="neutral">
            Lending losses and funding costs can outweigh returns, and aEthosETH doesn&apos;t duplicate the osETH staking return.{" "}
            <a href="/docs/phase-2/separate-obligations">Separate obligations</a>
          </Notice>
        </div>
        <aside className="hidden xl:sticky xl:top-[100px] xl:block">
          <Card>
            <h2 className="mb-4 text-base font-bold">Lock amount</h2>
            <LockForm flow={desktopFlow} surface="card" />
          </Card>
        </aside>
      </div>

      {/* Phones: the walkthrough's sheet. */}
      <Sheet open={lockOpen} onOpenChange={(next) => !mobileFlow.inFlight && setLockOpen(next)} title="Lock amount" dismissible={!mobileFlow.inFlight || mobileFlow.record?.status !== "wallet"}>
        <LockForm flow={mobileFlow} surface="canvas" />
      </Sheet>
      <Sheet open={unlockOpen} onOpenChange={setUnlockOpen} title="Unlock">
        {releasable.length ? (
          <div className="flex flex-col gap-2">
            {releasable.map((commitment) => (
              <button key={commitment.id} type="button" onClick={() => startRelease(commitment)} className="flex items-center gap-3 rounded-[16px] bg-card p-3.5 text-left">
                <GlyphBadge glyph="liquidity-module" size={34} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">
                    <Amount value={commitment.amount} asset="aEthosETH" />
                  </span>
                  <span className="block text-xs text-ink-2">Matured {formatDate(commitment.maturesAt)}</span>
                </span>
                <span className="rounded-[9px] bg-ink px-3 py-1.5 text-xs font-semibold text-white">Release</span>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState art={<Padlock locked size={64} />} title="Nothing to unlock yet" text="Commitments can be released once they mature. Their dates are listed under Your commitments." className="py-6" />
        )}
      </Sheet>

      <TxSheet request={release} onClose={() => setRelease(null)} />
      <AmountSheet
        open={repay !== null}
        onClose={() => setRepay(null)}
        title="Repay funding loan"
        asset="WETH"
        max={(repay?.financing?.debt ?? 0) * 1.0001}
        balanceLabel="Owed"
        build={(amount) => (repay ? { type: "repayFunding", id: repay.id, amount } : null)}
        confirmLabel={(amount) => (amount >= (repay?.financing?.debt ?? 0) - 1e-9 ? "Repay the loan" : `Repay ${formatAmount(amount)} WETH`)}
        labels={{ title: "Repay funding loan", successTitle: "Repaid", successText: "Your funding debt is lower and the loan's health is higher." }}
        note={
          repay?.financing ? (
            <p className="text-xs leading-4 text-ink-3">
              Paid with ETH, wrapped to WETH in the same transaction. Health now {formatHealth(repay.financing.healthFactor)}.
            </p>
          ) : null
        }
      />
      <AmountSheet
        open={withdraw}
        onClose={() => setWithdraw(false)}
        title="Withdraw to osETH"
        asset="aEthosETH"
        max={Math.min(data.balances?.aEthosETH ?? 0, data.liquidity?.reserve.unborrowed ?? 0)}
        balanceLabel="Available"
        build={(amount) => ({ type: "withdrawToOseth", amount })}
        confirmLabel={(amount) => `Withdraw ${formatAmount(amount)} aEthosETH`}
        labels={{ title: "Withdraw to osETH", successTitle: "Withdrawn", successText: "The osETH is in your wallet. Keep it, or convert it through StakeWise's redemption queue or a market." }}
        note={<p className="text-xs leading-4 text-ink-3">Limited by the osETH Aave hasn&apos;t lent out. Then keep the osETH, or convert it through StakeWise.</p>}
      />
    </>
  );
}
