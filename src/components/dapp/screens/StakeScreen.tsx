"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import { formatAmount, formatBps, parseAmount } from "../lib/format";
import { useDapp } from "../providers/DappProvider";
import { actionLabel, FlowPanes } from "../tx/TxPanes";
import { usePreview } from "../tx/usePreview";
import { useTxFlow } from "../tx/useTxFlow";
import { Amount } from "../ui/Amount";
import { AmountInput } from "../ui/AmountInput";
import { ButtonLink } from "../ui/Button";
import { Card, CardHeader, Row } from "../ui/Card";
import { GlyphBadge, type GlyphName } from "../ui/Glyph";
import { HarvestCountdown } from "../ui/Countdown";
import { StakeFactory } from "../ui/scenes";
import { Notice } from "../ui/Notice";
import { PageHeader } from "../ui/PageHeader";
import { SkeletonCard } from "../ui/Skeleton";
import { InfoTip } from "../ui/Tooltip";
import { VaultCard } from "./HomeScreen";
import { splitProblem } from "../tx/problems";
import { ActionButton, DocsLink, FormProblem, MiniStat, SplitLayout, StakingTabs } from "./shared";

/** What Max leaves in the wallet for network fees. */
const GAS_RESERVE = 0.003;

const STEPS: { glyph: GlyphName; title: string; text: string }[] = [
  { glyph: "definica-core", title: "Your ETH goes in", text: "Definica sends it to the dedicated StakeWise Vault and records your position." },
  { glyph: "vault-shares", title: "You hold Vault shares", text: "They are your proportion of the Vault's assets, so they stay worth your share of it." },
  { glyph: "validators", title: "Rewards arrive", text: "Validators run by the selected operator earn rewards, which reach every share at each harvest, net of fees." },
];

function StakeForm({ flow }: { flow: ReturnType<typeof useTxFlow> }) {
  const { data, connected, accountLoading } = useDapp();
  const [input, setInput] = useState("");
  const amount = parseAmount(input);
  const { preview, fresh } = usePreview(amount !== null && amount > 0 ? { type: "stake", amount } : null);
  const balance = data.balances?.ETH ?? null;
  const vault = data.vault;
  const shares = amount && vault ? amount / vault.sharePriceEth : 0;
  const problems = splitProblem(amount && amount > 0 ? preview : null, fresh);
  // A balance problem means nothing until a wallet is connected.
  const fieldError = problems.field && (connected || preview?.problem?.code !== "balance") ? problems.field : null;
  const ready = Boolean(amount && amount > 0 && fresh && preview && !preview.problem);

  return (
    <FlowPanes
      flow={flow}
      surface="card"
      doneLabel="Stake more"
      successArt={<StakeFactory done className="mb-1 max-w-[280px]" />}
      successExtra={<HarvestCountdown title="Your first rewards" text="At the next harvest, when rewards reach every share." />}
      next={
        <ButtonLink href="/app" size="lg" block variant="soft">
          See your position
        </ButtonLink>
      }
      onFinished={(succeeded) => {
        if (succeeded) setInput("");
      }}
      form={
        <div className="flex flex-col gap-4">
          <div className="flex justify-center overflow-hidden rounded-[20px] bg-[#f7f9f7] px-3 pt-5 pb-2">
            <StakeFactory active={Boolean(amount && amount > 0)} />
          </div>
          {!vault?.activated && vault ? (
            <Notice tone="caution" title="Deposits open once the Vault is activated">
              The Vault accepts deposits once it has registered validators (StakeWise&apos;s activation check).
            </Notice>
          ) : null}
          <AmountInput
            label="You stake"
            value={input}
            onChange={setInput}
            asset="ETH"
            balance={connected && !accountLoading ? balance : null}
            max={balance !== null ? Math.max(0, balance - GAS_RESERVE) : null}
            presets={[
              { label: "0.1 ETH", value: 0.1 },
              { label: "1 ETH", value: 1 },
              { label: "5 ETH", value: 5 },
            ]}
            error={fieldError}
            below={
              amount && amount > 0 && vault ? (
                <>
                  You receive ≈ <span className="font-semibold text-ink tabular">{formatAmount(shares)}</span> Vault shares
                </>
              ) : (
                "Shares are your proportion of the Vault, not a fixed balance."
              )
            }
          />
          {vault ? (
            <div className="rounded-[14px] bg-canvas px-4 py-1">
              <Row label="Share price" value={<Amount value={vault.sharePriceEth} asset="ETH" isPublic digits={4} />} />
              <Row label="Fees" value={`${formatBps(vault.feeBps.vault + vault.feeBps.definica)} of rewards`} hint="Taken from rewards, never from your deposit" className="border-t border-line-soft" />
            </div>
          ) : null}
          <FormProblem message={problems.form} />
          <ActionButton
            label={amount && amount > 0 ? actionLabel("Stake", amount, "ETH") : "Enter an amount"}
            disabled={!ready}
            onClick={() =>
              preview &&
              amount &&
              flow.openReview({
                action: { type: "stake", amount },
                preview,
                labels: { title: "Stake ETH", successTitle: "Staked", successText: "Your Vault shares are in your position. Rewards apply at each harvest, every 12 hours." },
                confirmLabel: actionLabel("Stake", amount, "ETH"),
                acknowledgement:
                  "I understand that rewards depend on validator performance and aren't guaranteed, that fees are taken from rewards, and that a withdrawal may wait for validator exits before the ETH can be claimed.",
              })
            }
          />
          <div className="flex items-center justify-center gap-2 text-xs text-ink-2">
            <span className="h-px w-10 bg-line" aria-hidden="true" />
            No validator to run
            <InfoTip label="About validators">The Vault pools deposits until there is enough to fund validators, run by the selected operator.</InfoTip>
            <span className="h-px w-10 bg-line" aria-hidden="true" />
          </div>
        </div>
      }
    />
  );
}

function YourStake() {
  const { data, connected, accountLoading } = useDapp();
  if (!connected) return null;
  if (accountLoading) return <SkeletonCard rows={2} />;
  const position = data.position;
  if (!position) return null;
  return (
    <Card>
      <CardHeader title="Your stake" action={<DocsLink href="/docs/app/stake">How staking works</DocsLink>} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MiniStat label="Value">
          <Amount value={position.valueEth} asset="ETH" />
        </MiniStat>
        <MiniStat label="Vault shares">
          <Amount value={position.shares} />
        </MiniStat>
        <MiniStat label="Available">
          <Amount value={position.availableShares} />
        </MiniStat>
        <MiniStat label="Lifetime rewards">
          <Amount value={position.rewardsEth} asset="ETH" signed className="text-green-ink" />
        </MiniStat>
      </div>
    </Card>
  );
}

/** Stake: the walkthrough's coin card and chips, with the Vault's conditions beside it. */
export function StakeScreen() {
  const flow = useTxFlow();
  return (
    <>
      <PageHeader title="Stake ETH" description="Pooled in a dedicated StakeWise Vault. No validator to run, and your share stays proportional." actions={<StakingTabs />} />
      <SplitLayout
        aside={
          <Card>
            <h2 className="sr-only">Stake</h2>
            <StakeForm flow={flow} />
          </Card>
        }
        main={
          <>
            <YourStake />
            <VaultCard />
            <Card>
              <CardHeader title="How it works" />
              <ol className="grid gap-4 md:grid-cols-3">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="rounded-[16px] bg-canvas p-4">
                    <div className="flex items-center gap-2">
                      <GlyphBadge glyph={step.glyph} size={34} />
                      <span className="text-xs font-bold text-ink-3">0{i + 1}</span>
                    </div>
                    <div className="mt-3 text-sm font-bold">{step.title}</div>
                    <p className="mt-1 text-[13px] leading-5 text-ink-2">{step.text}</p>
                  </li>
                ))}
              </ol>
            </Card>
            <Notice tone="neutral" title="Unstaking" icon={<Info className="size-[18px] text-ink-2" aria-hidden="true" />}>
              Unstaking uses the Vault&apos;s available liquidity, or waits for validator exits, before the ETH can be claimed. Locked shares can be unstaked once their lock matures.
            </Notice>
          </>
        }
      />
    </>
  );
}
