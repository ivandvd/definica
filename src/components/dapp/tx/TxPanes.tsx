"use client";

import { ArrowDown, ArrowUpRight, Check, LoaderCircle, PenLine, Send } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatAmount, shortAddress, unitOf } from "../lib/format";
import type { ActionPreview, TxStep } from "../lib/protocol";
import type { AssetAmount, Hash } from "../lib/types";
import { useDapp, type TxRecord } from "../providers/DappProvider";
import { Amount } from "../ui/Amount";
import { Button } from "../ui/Button";
import { AssetBadge } from "../ui/Glyph";
import { Notice } from "../ui/Notice";
import { TxStage, type StageState } from "../ui/txart";
import type { ReviewRequest, TxFlow } from "./useTxFlow";

export const EXPLORER_TX = "https://etherscan.io/tx/";

export type Surface = "card" | "canvas";

/** Blocks inside a pane contrast with whatever the pane sits on. */
const inner = (surface: Surface) => (surface === "card" ? "bg-canvas" : "bg-card");

/* ---------- pieces ---------- */

function AmountLine({ label, amounts }: { label: string; amounts: AssetAmount[] }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[13px] text-ink-2">{label}</span>
      <span className="flex flex-col items-end gap-1">
        {amounts.map((item) => (
          <span key={item.asset} className="figure flex items-center gap-2 text-lg font-extrabold">
            <Amount value={item.amount} asset={item.asset} className="figure" unitClassName="ml-[0.3em] text-sm font-semibold text-ink-2" />
            <AssetBadge asset={item.asset} size={24} />
          </span>
        ))}
      </span>
    </div>
  );
}

/** "You give → You get", the head of every review and result. */
export function TxSummary({ preview, surface }: { preview: Pick<ActionPreview, "gives" | "gets">; surface: Surface }) {
  const { gives, gets } = preview;
  if (!gives.length && !gets.length) return null;
  return (
    <div className={cn("rounded-[16px] p-4", inner(surface))}>
      {gives.length ? <AmountLine label="You give" amounts={gives} /> : null}
      {gives.length && gets.length ? (
        <div className="my-2 flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-line" />
          <span className="flex size-7 items-center justify-center rounded-full border border-line bg-card">
            <ArrowDown className="size-3.5 text-ink-2" />
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>
      ) : null}
      {gets.length ? <AmountLine label="You get" amounts={gets} /> : null}
    </div>
  );
}

function StepsList({ steps, current, status }: { steps: TxStep[]; current?: number; status?: TxRecord["status"] }) {
  if (steps.length < 2 && current === undefined) return null;
  return (
    <ol className="space-y-2">
      {steps.map((step, i) => {
        const index = i + 1;
        const done = current !== undefined && (index < current || (index === current && (status === "updating" || status === "confirmed")));
        const active = current !== undefined && index === current && !done && status !== "failed";
        return (
          <li key={step.label} className="flex items-center gap-3 text-sm">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                done ? "bg-green text-white" : active ? "bg-ink text-lime" : "bg-chip text-ink-2",
              )}
            >
              {done ? <Check className="size-3.5" aria-hidden="true" /> : active ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" /> : index}
            </span>
            <span className={cn("flex-1", done || active ? "font-semibold text-ink" : "text-ink-2")}>{step.label}</span>
            <span className="flex items-center gap-1 text-xs text-ink-3">
              {step.kind === "signature" ? <PenLine className="size-3" aria-hidden="true" /> : <Send className="size-3" aria-hidden="true" />}
              {step.kind === "signature" ? "Signature, no fee" : "Transaction, fee"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** The transaction's hash, opening its receipt (status, block, fee, Etherscan). */
function HashLink({ hash }: { hash: Hash }) {
  const { openReceipt } = useDapp();
  return (
    <button type="button" onClick={() => openReceipt(hash)} className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:bg-chip">
      View transaction <span className="font-mono text-xs font-medium text-ink-2">{shortAddress(hash, 4)}</span>
      <ArrowUpRight className="size-3.5" aria-hidden="true" />
    </button>
  );
}

/* ---------- review ---------- */

export function ReviewPane({ request, surface, onConfirm, onBack, backLabel = "Back" }: { request: ReviewRequest; surface: Surface; onConfirm: () => void; onBack: () => void; backLabel?: string }) {
  const { wrongNetwork } = useDapp();
  const [ticked, setTicked] = useState(false);
  const { preview, acknowledgement } = request;
  const blocked = Boolean(preview.problem) || (Boolean(acknowledgement) && !ticked) || wrongNetwork;

  return (
    <div className="space-y-3">
      <TxSummary preview={preview} surface={surface} />

      {preview.changes.length ? (
        <div className={cn("rounded-[16px] px-4 py-1", inner(surface))}>
          {preview.changes.map((change) => (
            <div key={change.label} className="flex items-center justify-between gap-3 border-b border-line-soft py-2.5 text-sm last:border-0">
              <span className="text-ink-2">{change.label}</span>
              <span className="flex items-center gap-1.5 text-right tabular">
                <span className="text-ink-3">{change.before}</span>
                <span className="text-ink-3" aria-label="becomes">
                  →
                </span>
                <span
                  className={cn(
                    "font-semibold",
                    change.tone === "danger" ? "text-red" : change.tone === "caution" ? "text-amber" : change.tone === "good" ? "text-green-ink" : "text-ink",
                  )}
                >
                  {change.after}
                </span>
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div className={cn("rounded-[16px] px-4 py-1", inner(surface))}>
        {preview.conditions.map((condition) => (
          <div key={condition.label} className="flex items-start justify-between gap-4 border-b border-line-soft py-2.5 text-sm last:border-0">
            <span className="text-ink-2">
              {condition.label}
              {condition.hint ? <span className="mt-0.5 block text-xs text-ink-3">{condition.hint}</span> : null}
            </span>
            <span className="max-w-[58%] text-right font-semibold">{condition.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
          <span className="text-ink-2">Network fee</span>
          <span className="font-semibold tabular">≈ {formatAmount(preview.networkFeeEth)} ETH · Ethereum</span>
        </div>
      </div>

      {preview.warnings.map((warning) => (
        <Notice key={warning.text} tone={warning.level === "danger" ? "danger" : warning.level === "caution" ? "caution" : "info"}>
          {warning.text}
        </Notice>
      ))}

      {preview.steps.length > 1 ? (
        <div className={cn("rounded-[16px] p-4", inner(surface))}>
          <div className="mb-3 text-[13px] font-semibold">Your wallet will ask {preview.steps.length} times</div>
          <StepsList steps={preview.steps} />
        </div>
      ) : null}

      {preview.problem ? (
        <Notice tone="danger" title="This can't go through as it is" live>
          {preview.problem.message}
        </Notice>
      ) : null}

      {acknowledgement && !preview.problem ? (
        <label className={cn("flex cursor-pointer gap-3 rounded-[16px] p-4 text-[13px] leading-5 text-ink-2 transition-shadow", inner(surface), ticked && "shadow-[inset_0_0_0_1.5px_var(--color-ink)]")}>
          <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-[#0f0f0f]" checked={ticked} onChange={(event) => setTicked(event.target.checked)} />
          <span>{acknowledgement}</span>
        </label>
      ) : null}

      <div className="flex flex-col gap-2 pt-1">
        <Button size="lg" block onClick={onConfirm} disabled={blocked}>
          {wrongNetwork ? "Switch to Ethereum first" : request.confirmLabel}
        </Button>
        <Button size="lg" block variant={surface === "card" ? "soft" : "secondary"} onClick={onBack}>
          {backLabel}
        </Button>
      </div>
    </div>
  );
}

/* ---------- progress and result ---------- */

/** "Submitted 4 s ago", with a bar that keeps moving while the network confirms. */
function PendingBar({ startedAt }: { startedAt: number }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const tick = () => setSeconds(Math.max(0, Math.round((Date.now() - startedAt) / 1000)));
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [startedAt]);
  return (
    <div className="mt-4 w-full max-w-xs">
      <div className="h-1.5 overflow-hidden rounded-full bg-chip" role="progressbar" aria-label="Waiting for the network" aria-valuetext="In progress">
        <div className="h-full w-1/3 animate-[pending-bar_1.4s_ease-in-out_infinite] rounded-full bg-green" />
      </div>
      <p className="mt-2 text-xs text-ink-3">Submitted {seconds < 2 ? "just now" : `${seconds} s ago`} · usually under a minute</p>
    </div>
  );
}

/** The stage's picture for a record: which wallet request, which kind of failure. */
function stageFor(record: TxRecord, signature: boolean): StageState {
  switch (record.status) {
    case "wallet":
      return signature ? "signature" : "wallet";
    case "failed": {
      const code = record.error?.code;
      return code === "rejected" || code === "reverted" || code === "network" ? code : "error";
    }
    default:
      return record.status;
  }
}

/** After a transaction fails onchain: what stayed with you, and the fee that was spent. */
function FailedSummary({ preview, surface }: { preview: ActionPreview; surface: Surface }) {
  return (
    <div className={cn("mt-5 w-full rounded-[16px] px-4 py-1 text-left", inner(surface))}>
      {preview.gives.map((item) => (
        <div key={item.asset} className="flex items-center justify-between gap-3 border-b border-line-soft py-3 text-sm">
          <span className="text-ink-2">Stayed with you</span>
          <span className="flex items-center gap-2 font-extrabold">
            <Amount value={item.amount} asset={item.asset} className="figure" unitClassName="ml-[0.3em] font-semibold text-ink-2" />
            <AssetBadge asset={item.asset} size={22} />
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between gap-3 py-3 text-sm">
        <span className="text-ink-2">Network fee spent</span>
        <span className="font-semibold tabular">≈ {formatAmount(preview.networkFeeEth)} ETH</span>
      </div>
    </div>
  );
}

const FAILURE_TITLE: Partial<Record<string, string>> = {
  rejected: "Request rejected",
  reverted: "Transaction failed",
  network: "Couldn't reach the network",
  unknown: "Something went wrong",
};

export function ProgressPane({
  record,
  preview,
  surface,
  onDone,
  onRetry,
  doneLabel = "Done",
  next,
  successArt,
  successExtra,
}: {
  record: TxRecord;
  preview: ActionPreview;
  surface: Surface;
  onDone: () => void;
  onRetry: () => void;
  doneLabel?: string;
  /** A follow-up after success: "View activity", "Lock these shares". */
  next?: ReactNode;
  /** Shown under the success text: what happens next, and when (a countdown). */
  successExtra?: ReactNode;
  /** The action's own picture of the outcome (the factory, the gate, the safe); the seal otherwise. */
  successArt?: ReactNode;
}) {
  const { env } = useDapp();
  const { status, step, total, stepLabel, error, hash } = record;
  const steps = preview.steps;
  const current = steps[step - 1];
  const signature = current?.kind === "signature";
  // The coin on the stage: what you send, or else what you get.
  const asset = preview.gives[0]?.asset ?? preview.gets[0]?.asset ?? null;
  const secondary = surface === "card" ? "soft" : "secondary";

  // One stage for the whole transaction, so each state's picture fades into the next.
  const stage = <TxStage state={stageFor(record, signature)} asset={asset} success={successArt} />;

  if (status === "confirmed") {
    return (
      <div className="flex flex-col items-center text-center">
        {stage}
        <h3 className="mt-2 text-xl font-extrabold tracking-[-0.01em]" role="status">
          {record.labels.successTitle}
        </h3>
        <p className="mt-1.5 max-w-sm text-sm leading-5 text-ink-2">{record.labels.successText}</p>
        {successExtra ? <div className="mt-4 w-full">{successExtra}</div> : null}
        <div className="mt-5 w-full text-left">
          <TxSummary preview={preview} surface={surface} />
        </div>
        {record.hash ? (
          <div className="mt-3 flex flex-col items-center gap-1">
            <HashLink hash={record.hash} />
          </div>
        ) : null}
        <div className="mt-5 flex w-full flex-col gap-2">
          <Button size="lg" block onClick={onDone}>
            {doneLabel}
          </Button>
          {next}
        </div>
      </div>
    );
  }

  if (status === "failed") {
    const code = error?.code ?? "unknown";
    return (
      <div className="flex flex-col items-center text-center">
        {stage}
        <h3 className="mt-2 text-xl font-extrabold tracking-[-0.01em]" role="alert">
          {FAILURE_TITLE[code] ?? "This can't go through now"}
        </h3>
        <p className="mt-1.5 max-w-sm text-sm leading-5 text-ink-2">{error?.message ?? "The transaction could not be completed."}</p>
        {code === "reverted" ? <FailedSummary preview={preview} surface={surface} /> : null}
        {hash && code === "reverted" ? (
          <div className="mt-3">
            <HashLink hash={hash} />
          </div>
        ) : null}
        <div className="mt-5 flex w-full flex-col gap-2">
          <Button size="lg" block onClick={onRetry}>
            Try again
          </Button>
          <Button size="lg" block variant={secondary} onClick={onDone}>
            Close
          </Button>
        </div>
      </div>
    );
  }

  const walletText = signature ? "A signature, with no network fee. Check it in your wallet, then sign." : "Check the amount and the network in your wallet, then confirm.";
  return (
    <div className="flex flex-col items-center text-center">
      {stage}
      <h3 className="mt-2 text-xl font-extrabold tracking-[-0.01em]" role="status" aria-live="polite">
        {status === "wallet" ? (signature ? "Sign in your wallet" : "Confirm in your wallet") : status === "pending" ? "Transaction submitted" : "Updating your position"}
      </h3>
      <p className="mt-1.5 max-w-sm text-sm leading-5 text-ink-2">
        {status === "wallet"
          ? total > 1
            ? `Step ${step} of ${total}: ${stepLabel}. ${walletText}`
            : walletText
          : status === "pending"
            ? "Waiting for the network to confirm. This usually takes under a minute; you can close this and keep using the app."
            : "Confirmed. Reading your new position from the chain."}
      </p>
      {status === "wallet" && !env.preview ? <p className="mt-2 text-xs text-ink-3 lg:hidden">On a phone, approve in your wallet app, then come back to this tab.</p> : null}
      {hash && status !== "wallet" ? (
        <div className="mt-3">
          <HashLink hash={hash} />
        </div>
      ) : null}
      {status === "pending" ? <PendingBar startedAt={record.startedAt} /> : null}
      <div className="mt-5 w-full text-left">
        <TxSummary preview={preview} surface={surface} />
      </div>
      {steps.length > 1 ? (
        <div className={cn("mt-3 w-full rounded-[16px] p-4 text-left", inner(surface))}>
          <StepsList steps={steps} current={step} status={status} />
        </div>
      ) : null}
      {status === "pending" ? (
        <Button size="lg" block variant={secondary} className="mt-4" onClick={onDone}>
          Close and keep going
        </Button>
      ) : null}
    </div>
  );
}

/** Review and progress for a flow, with the walkthrough's pane slide between steps. */
export function FlowPanes({
  flow,
  surface,
  form,
  doneLabel,
  next,
  successArt,
  successExtra,
  onFinished,
}: {
  flow: TxFlow;
  surface: Surface;
  /** The form pane. */
  form: ReactNode;
  doneLabel?: string;
  next?: ReactNode;
  successArt?: ReactNode;
  successExtra?: ReactNode;
  /** Called on Done (true: clear the form) and on Close after a failure (false: keep it for a retry). */
  onFinished?: (succeeded: boolean) => void;
}) {
  const { step, direction, review, record } = flow;
  const anchor = useRef<HTMLDivElement>(null);
  const shownStep = useRef(step);
  // Each step can be much shorter than the last (a long review, then the wallet step): bring the
  // panel's top back into view when it has scrolled away, so nobody is left looking past it. Only
  // between steps: never on the first render.
  useEffect(() => {
    const element = anchor.current;
    if (!element || shownStep.current === step) return;
    shownStep.current = step;
    const top = element.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.7) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      element.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    }
  }, [step]);
  const pane =
    step === "progress" && record && review ? (
      <ProgressPane
        record={record}
        preview={review.preview}
        surface={surface}
        doneLabel={doneLabel}
        next={next}
        successArt={successArt}
        successExtra={successExtra}
        onRetry={flow.retry}
        onDone={() => {
          // Done after success, or closed while pending: either way the form starts fresh, so nobody sends twice.
          onFinished?.(record.status !== "failed");
          flow.finish();
        }}
      />
    ) : step === "review" && review ? (
      <ReviewPane request={review} surface={surface} onConfirm={flow.confirm} onBack={flow.back} />
    ) : (
      form
    );
  return (
    <div ref={anchor} className="scroll-mt-24">
      <div key={step} className={direction === "forward" ? "animate-pane-in" : "animate-pane-back"}>
        {pane}
      </div>
    </div>
  );
}

/** "Stake 1.25 ETH": the confirm label from an amount. */
export const actionLabel = (verb: string, amount: number, asset: AssetAmount["asset"]) => `${verb} ${formatAmount(amount)} ${unitOf(asset)}`;
