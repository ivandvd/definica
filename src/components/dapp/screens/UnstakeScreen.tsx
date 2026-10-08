"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatAmount, formatDate, parseAmount } from "../lib/format";
import { CountdownText } from "../ui/Countdown";
import type { ExitRequest, ExitRoute } from "../lib/types";
import { useDapp } from "../providers/DappProvider";
import { actionLabel, FlowPanes } from "../tx/TxPanes";
import { TxSheet, type SheetRequest } from "../tx/TxSheet";
import { usePreview } from "../tx/usePreview";
import { useTxFlow } from "../tx/useTxFlow";
import { Amount } from "../ui/Amount";
import { AmountInput } from "../ui/AmountInput";
import { Button, ButtonLink } from "../ui/Button";
import { ArtExit } from "../ui/art";
import { ExitGate } from "../ui/scenes";
import { Card, CardHeader, Row } from "../ui/Card";
import { EmptyState } from "../ui/EmptyState";
import { GlyphBadge } from "../ui/Glyph";
import { Notice } from "../ui/Notice";
import { PageHeader } from "../ui/PageHeader";
import { Pill, type PillTone } from "../ui/Pill";
import { ProgressBar } from "../ui/Progress";
import { Segmented } from "../ui/Segmented";
import { SkeletonCard } from "../ui/Skeleton";
import { splitProblem } from "../tx/problems";
import { ActionButton, ConnectCard, DocsLink, FormProblem, SplitLayout, StakingTabs } from "./shared";

const STATUS: Record<ExitRequest["status"], { label: string; tone: PillTone }> = {
  queued: { label: "In the queue", tone: "sky" },
  exiting: { label: "Waiting for validator exits", tone: "amber" },
  partial: { label: "Partly claimable", tone: "green" },
  claimable: { label: "Ready to claim", tone: "green" },
  claimed: { label: "Claimed", tone: "grey" },
};

const ROUTES: { value: ExitRoute; title: string; text: string }[] = [
  { value: "core", title: "Through Definica", text: "Definica holds the exit for you. A partial claim pays what is ready and keeps the rest for later." },
  { value: "vault", title: "Directly at the Vault", text: "The exit goes to your own address at the Vault, and you claim it there." },
];

const claimRequest = (exits: ExitRequest[]): SheetRequest => {
  const eth = exits.reduce((sum, exit) => sum + exit.claimableEth, 0);
  return {
    action: { type: "claimExits", ids: exits.map((exit) => exit.id) },
    labels: {
      title: exits.length > 1 ? "Claim exits" : "Claim exit",
      successTitle: "Claimed",
      successText: "The ETH is in your wallet and the exited shares have left your position.",
    },
    confirmLabel: `Claim ${formatAmount(eth)} ETH`,
  };
};

/* ---------- form ---------- */

function ExitForm({ flow }: { flow: ReturnType<typeof useTxFlow> }) {
  const { data, connected } = useDapp();
  const [unit, setUnit] = useState<"shares" | "eth">("shares");
  const [input, setInput] = useState("");
  const [route, setRoute] = useState<ExitRoute>("core");
  const position = data.position;
  const price = data.vault?.sharePriceEth ?? 1;
  const available = position?.availableShares ?? 0;
  const typed = parseAmount(input);
  const shares = typed === null ? null : unit === "shares" ? typed : typed / price;
  const { preview, fresh } = usePreview(shares !== null && shares > 0 ? { type: "requestExit", shares, route } : null);
  const ready = Boolean(shares && shares > 0 && fresh && preview && !preview.problem);
  const problems = splitProblem(shares && shares > 0 ? preview : null, fresh);
  const conditions = preview?.conditions ?? [];
  const pick = (label: string) => conditions.find((condition) => condition.label === label)?.value;
  const inUnit = (value: number) => (unit === "shares" ? value : value * price);

  return (
    <FlowPanes
      flow={flow}
      surface="card"
      doneLabel="Done"
      successArt={<ExitGate done className="mb-1 max-w-[280px]" />}
      onFinished={(succeeded) => {
        if (succeeded) setInput("");
      }}
      form={
        <div className="flex flex-col gap-4">
          <div className="flex justify-center overflow-hidden rounded-[20px] bg-[#f7f9f7] px-3 pt-5 pb-2">
            <ExitGate active={Boolean(shares && shares > 0)} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-bold">Unstake</h2>
            <Segmented
              size="sm"
              value={unit}
              onChange={(next) => {
                setUnit(next);
                setInput("");
              }}
              options={[
                { value: "shares", label: "Shares" },
                { value: "eth", label: "ETH" },
              ]}
              aria-label="Enter the amount in"
            />
          </div>
          <AmountInput
            label="You exit"
            value={input}
            onChange={setInput}
            asset={unit === "shares" ? "shares" : "ETH"}
            balance={connected && position ? inUnit(available) : null}
            balanceLabel="Available"
            presets={[
              { label: "25%", value: inUnit(available * 0.25) },
              { label: "50%", value: inUnit(available * 0.5) },
              { label: "75%", value: inUnit(available * 0.75) },
              { label: "All", value: inUnit(available) },
            ]}
            error={problems.field}
            below={
              shares && shares > 0 ? (
                unit === "shares" ? (
                  <>
                    ≈ <span className="font-semibold text-ink tabular">{formatAmount(shares * price)}</span> ETH at today&apos;s share price
                  </>
                ) : (
                  <>
                    = <span className="font-semibold text-ink tabular">{formatAmount(shares)}</span> Vault shares
                  </>
                )
              ) : position && position.lockedShares > 0 ? (
                <>
                  <Amount value={position.lockedShares} /> shares are locked until their lock matures.
                </>
              ) : (
                "Locked shares and shares already exiting aren't available."
              )
            }
          />

          <fieldset>
            <legend className="mb-2 text-[13px] text-ink-2">Route</legend>
            <div className="grid gap-2">
              {ROUTES.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-[14px] bg-canvas p-3.5 transition-shadow",
                    route === option.value && "shadow-[inset_0_0_0_1.5px_var(--color-ink)]",
                  )}
                >
                  <input type="radio" name="route" value={option.value} checked={route === option.value} onChange={() => setRoute(option.value)} className="mt-1 size-4 shrink-0 accent-[#0f0f0f]" />
                  <span>
                    <span className="block text-sm font-semibold">{option.title}</span>
                    <span className="mt-0.5 block text-xs leading-4 text-ink-2">{option.text}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {shares && shares > 0 && preview ? (
            <div className="rounded-[14px] bg-canvas px-4 py-1">
              <Row label="From available liquidity" value={pick("From available liquidity") ?? "—"} />
              {pick("After validator exits") ? <Row label="After validator exits" value={pick("After validator exits")} className="border-t border-line-soft" /> : null}
              <Row label="Expected wait" value={pick("Expected wait") ?? "—"} hint="An estimate, not a promise" className="border-t border-line-soft" />
            </div>
          ) : null}

          <Notice tone="info">Shares in an exit request keep earning rewards, and bearing any penalties, until the Vault burns them.</Notice>

          <FormProblem message={problems.form} />
          <ActionButton
            label={shares && shares > 0 ? `Request exit of ${formatAmount(shares)} shares` : "Enter an amount"}
            disabled={!ready}
            onClick={() =>
              preview &&
              shares &&
              flow.openReview({
                action: { type: "requestExit", shares, route },
                preview,
                labels: {
                  title: "Request exit",
                  successTitle: "Exit requested",
                  successText: "Your request is in the exit queue. You'll see it here, and on Home, when the ETH is ready to claim.",
                },
                confirmLabel: actionLabel("Request exit of", shares, "shares"),
                acknowledgement:
                  "I understand that an exit request can't be cancelled, may wait for validator exits before the ETH is claimable, and that queued shares keep earning and bearing penalties until they are burned.",
              })
            }
          />
        </div>
      }
    />
  );
}

/* ---------- queue ---------- */

function ExitRow({ exit, onClaim }: { exit: ExitRequest; onClaim: () => void }) {
  const { data } = useDapp();
  const status = STATUS[exit.status];
  const progress =
    exit.status === "claimed" || exit.status === "claimable"
      ? 1
      : exit.expectedAt
        ? Math.min(0.96, Math.max(0.04, (data.now - exit.requestedAt) / Math.max(1, exit.expectedAt - exit.requestedAt)))
        : 0.1;

  return (
    <li className="py-4">
      <div className="flex flex-wrap items-start gap-3">
        <GlyphBadge glyph="exit-queue" size={38} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-bold tabular">
              <Amount value={exit.shares} asset="shares" />
            </span>
            <Pill tone={status.tone} size="sm" dot={exit.status === "exiting" || exit.status === "queued" ? "pulse" : undefined}>
              {status.label}
            </Pill>
          </div>
          <div className="mt-0.5 text-xs text-ink-2">
            ≈ <Amount value={exit.ethEstimate} asset="ETH" /> · requested {formatDate(exit.requestedAt)} · {exit.route === "core" ? "through Definica" : "at the Vault"}
          </div>
        </div>
        {exit.status === "claimable" || exit.status === "partial" ? (
          <Button size="sm" onClick={onClaim} className="hidden sm:inline-flex">
            Claim <Amount value={exit.claimableEth} asset="ETH" />
          </Button>
        ) : null}
      </div>
      {exit.status !== "claimed" ? (
        <div className="mt-3 pl-[50px]">
          <ProgressBar value={progress} tone={exit.status === "claimable" || exit.status === "partial" ? "green" : "sky"} size="sm" label="Exit progress" />
          {exit.claimedEth ? (
            <div className="mt-1.5 text-xs font-semibold text-green-ink">
              <Amount value={exit.claimedEth} asset="ETH" /> claimed so far
            </div>
          ) : null}
          <div className="mt-1.5 text-xs text-ink-3">
            {exit.status === "claimable" ? (
              "The ETH is ready."
            ) : exit.status === "partial" ? (
              exit.expectedAt ? (
                <>
                  Part is ready now; the rest in about <CountdownText to={exit.expectedAt} className="font-semibold text-ink-2" />.
                </>
              ) : (
                "Part is ready now; the rest follows as validators exit."
              )
            ) : exit.expectedAt ? (
              <>
                Claimable in about <CountdownText to={exit.expectedAt} className="font-semibold text-ink-2" />. An estimate: it depends on harvests and validator exits.
              </>
            ) : (
              "Not estimated yet."
            )}
          </div>
        </div>
      ) : (
        <div className="mt-1 pl-[50px] text-xs text-ink-3">
          Claimed <Amount value={exit.claimedEth ?? 0} asset="ETH" /> on {exit.claimedAt ? formatDate(exit.claimedAt) : "—"}
        </div>
      )}
      {exit.status === "claimable" || exit.status === "partial" ? (
        <Button size="md" block onClick={onClaim} className="mt-3 sm:hidden">
          Claim <Amount value={exit.claimableEth} asset="ETH" />
        </Button>
      ) : null}
    </li>
  );
}

function ExitQueue({ onClaim }: { onClaim: (exits: ExitRequest[]) => void }) {
  const { data, connected, accountLoading } = useDapp();
  if (!connected) return <ConnectCard title="Connect to see your exits" text="Your exit requests and what's ready to claim are read for the connected address." art={<ArtExit />} />;
  if (accountLoading) return <SkeletonCard rows={4} />;
  const exits = data.exits;
  const ready = exits.filter((exit) => exit.status === "claimable" || exit.status === "partial");
  const readyEth = ready.reduce((sum, exit) => sum + exit.claimableEth, 0);
  return (
    <>
      {ready.length ? (
        <Card tone="lime" className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold">Ready to claim</div>
            <div className="figure mt-1 text-[30px] leading-none font-extrabold">
              <Amount value={readyEth} asset="ETH" animate className="figure" unitClassName="ml-[0.3em] text-lg" />
            </div>
            <div className="mt-1 text-xs text-ink-2">{ready.length === 1 ? "From 1 exit request" : `From ${ready.length} exit requests, in one transaction`}</div>
          </div>
          <Button size="lg" onClick={() => onClaim(ready)}>
            {ready.length > 1 ? "Claim all" : "Claim"}
          </Button>
        </Card>
      ) : null}
      <Card>
        <CardHeader title="Exit queue" hint={exits.length ? `${exits.length} ${exits.length === 1 ? "request" : "requests"}, newest first` : undefined} action={<DocsLink href="/docs/concepts/exit-queue">How the queue works</DocsLink>} />
        {exits.length ? (
          <ul className="row-divide -mt-2">
            {exits.map((exit) => (
              <ExitRow key={exit.id} exit={exit} onClaim={() => onClaim([exit])} />
            ))}
          </ul>
        ) : (
          <EmptyState
            art={<ArtExit />}
            title={data.position ? "No exit requests" : "Nothing to unstake"}
            text={data.position ? "Request an exit for available shares. It waits here until the ETH is ready to claim." : "Stake ETH first. Exits appear here once you request one."}
            action={data.position ? null : <ButtonLink href="/app/stake">Stake ETH</ButtonLink>}
            className="py-6"
          />
        )}
      </Card>
    </>
  );
}

function HowExitsSettle() {
  const { data } = useDapp();
  const vault = data.vault;
  if (!vault) return <SkeletonCard rows={3} />;
  return (
    <Card>
      <CardHeader title="How exits settle" />
      <div className="row-divide">
        <Row label="Available liquidity now" value={<Amount value={vault.withdrawableEth} asset="ETH" digits={2} isPublic />} hint="Paid without waiting for validators" />
        <Row label="Wait when validators must exit" value={vault.exitWait ? `Up to ${vault.exitWait.maxDays} days (average ${vault.exitWait.avgDays})` : "Not estimated"} />
        <Row
          label="Next harvest"
          value={
            <>
              in <CountdownText to={vault.nextHarvestAt} done="now" />
            </>
          }
          hint="Requests are processed at harvests"
        />
      </div>
      <p className="mt-3 text-[13px] leading-5 text-ink-2">
        A request becomes claimable once the Vault has processed it and its claim delay has passed. When validators must exit, the timing depends on Ethereum&apos;s validator exit queue, which Definica doesn&apos;t control.
      </p>
    </Card>
  );
}

/** Unstake: request an exit on the right, the queue and claims on the left. */
export function UnstakeScreen() {
  const flow = useTxFlow();
  const [claim, setClaim] = useState<SheetRequest | null>(null);
  return (
    <>
      <PageHeader title="Unstake" description="Request an exit for your available shares, then claim the ETH once it is ready." actions={<StakingTabs />} />
      <SplitLayout
        asideFirstOnMobile={false}
        aside={
          <Card>
            <ExitForm flow={flow} />
          </Card>
        }
        main={
          <>
            <ExitQueue onClaim={(exits) => setClaim(claimRequest(exits))} />
            <HowExitsSettle />
          </>
        }
      />
      <TxSheet request={claim} onClose={() => setClaim(null)} />
    </>
  );
}
