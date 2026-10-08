"use client";

import { useState } from "react";
import { DAY, formatAmount, formatDate, parseAmount } from "../lib/format";
import { LOCK_MAX_DAYS, LOCK_MAX_POSITIONS, LOCK_MIN_DAYS } from "../lib/protocol";
import type { LockPosition } from "../lib/types";
import { useDapp } from "../providers/DappProvider";
import { FlowPanes } from "../tx/TxPanes";
import { TxSheet, type SheetRequest } from "../tx/TxSheet";
import { usePreview } from "../tx/usePreview";
import { useTxFlow } from "../tx/useTxFlow";
import { Amount } from "../ui/Amount";
import { AmountInput } from "../ui/AmountInput";
import { Button, ButtonLink } from "../ui/Button";
import { ArtLock } from "../ui/art";
import { AddToCalendar, CalendarTile, lockReminder } from "../ui/Calendar";
import { Card, CardHeader } from "../ui/Card";
import { CountdownText } from "../ui/Countdown";
import { DurationSlider } from "../ui/DurationSlider";
import { EmptyState } from "../ui/EmptyState";
import { GlyphBadge } from "../ui/Glyph";
import { LockSafe } from "../ui/scenes";
import { Notice } from "../ui/Notice";
import { PageHeader } from "../ui/PageHeader";
import { Pill } from "../ui/Pill";
import { ProgressBar } from "../ui/Progress";
import { SkeletonCard } from "../ui/Skeleton";
import { splitProblem } from "../tx/problems";
import { ActionButton, ConnectCard, DocsLink, FormProblem, MiniStat, RulesCard, SplitLayout, StakingTabs } from "./shared";

const releaseRequest = (locks: LockPosition[]): SheetRequest => {
  const shares = locks.reduce((sum, lock) => sum + lock.shares, 0);
  return {
    action: { type: "releaseLocks", ids: locks.map((lock) => lock.id) },
    labels: { title: locks.length > 1 ? "Release locks" : "Release lock", successTitle: "Lock released", successText: "The shares are available again, for an exit or a new lock." },
    confirmLabel: `Release ${formatAmount(shares)} shares`,
  };
};

/* ---------- form ---------- */

function LockForm({ flow }: { flow: ReturnType<typeof useTxFlow> }) {
  const { data, connected } = useDapp();
  const [input, setInput] = useState("");
  const [days, setDays] = useState(90);
  const position = data.position;
  const available = position?.availableShares ?? 0;
  const open = data.locks.filter((lock) => lock.status !== "released").length;
  const full = open >= LOCK_MAX_POSITIONS;
  const shares = parseAmount(input);
  const { preview, fresh } = usePreview(shares !== null && shares > 0 ? { type: "createLock", shares, days } : null);
  const ready = Boolean(shares && shares > 0 && fresh && preview && !preview.problem);
  const problems = splitProblem(shares && shares > 0 ? preview : null, fresh);
  const maturesAt = data.now + days * DAY;

  return (
    <FlowPanes
      flow={flow}
      surface="card"
      successArt={<LockSafe done days={days} className="mb-1 max-w-[280px]" />}
      successExtra={<NewLockReminder />}
      onFinished={(done) => {
        if (done) setInput("");
      }}
      form={
        <div className="flex flex-col gap-4">
          <div className="flex justify-center overflow-hidden rounded-[20px] bg-[#f7f9f7] px-3 pt-5 pb-2">
            <LockSafe active={Boolean(shares && shares > 0)} days={days} />
          </div>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-base font-bold">New lock</h2>
              <p className="text-[13px] text-ink-2">
                {LOCK_MIN_DAYS} to {LOCK_MAX_DAYS} days · {open} of {LOCK_MAX_POSITIONS} positions in use
              </p>
            </div>
          </div>
          {full ? (
            <Notice tone="caution" title="Lock limit reached">
              All {LOCK_MAX_POSITIONS} lock positions are in use. Release a matured lock to open a slot.
            </Notice>
          ) : null}
          <AmountInput
            label="You lock"
            value={input}
            onChange={setInput}
            asset="shares"
            disabled={full}
            balance={connected && position ? available : null}
            balanceLabel="Available"
            presets={[
              { label: "25%", value: available * 0.25 },
              { label: "50%", value: available * 0.5 },
              { label: "All", value: available },
            ]}
            error={problems.field}
            below={shares && shares > 0 && data.vault ? <>≈ {formatAmount(shares * data.vault.sharePriceEth)} ETH, still earning while locked</> : "Locked shares stay in reward accounting."}
          />
          <div>
            <div className="mb-2 text-[13px] text-ink-2">Duration</div>
            <DurationSlider days={days} onChange={setDays} min={LOCK_MIN_DAYS} max={LOCK_MAX_DAYS} presets={[7, 30, 90, 180, 365]} disabled={full} />
          </div>
          <div className="flex items-center gap-4 rounded-[14px] bg-canvas p-4">
            <CalendarTile at={maturesAt} />
            <div className="min-w-0">
              <div className="text-[13px] text-ink-2">Unlock date will be set to</div>
              <div className="mt-1 text-lg font-extrabold tracking-[-0.01em]">
                {formatDate(maturesAt)} · {days} days
              </div>
              <div className="mt-1 text-xs text-ink-3">At maturity, release the lock to use the shares again. There is no early unlock.</div>
            </div>
          </div>
          <FormProblem message={problems.form} />
          <ActionButton
            label={full ? "Lock limit reached" : shares && shares > 0 ? `Lock for ${days} days` : "Enter an amount"}
            disabled={!ready || full}
            onClick={() =>
              preview &&
              shares &&
              flow.openReview({
                action: { type: "createLock", shares, days },
                preview,
                labels: { title: "Lock shares", successTitle: "Shares locked", successText: `Your lock is in place and matures on ${formatDate(maturesAt)}.` },
                confirmLabel: `Lock for ${days} days`,
                acknowledgement: "I understand that locked shares can't exit before the lock matures, that there is no early unlock, and that they stay in reward accounting throughout.",
              })
            }
          />
        </div>
      }
    />
  );
}

/** After a lock goes through: its maturity, counting down, and a reminder for the calendar. */
function NewLockReminder() {
  const { data } = useDapp();
  // The lock just made: the newest one still running.
  const lock = data.locks.filter((item) => item.status === "active").sort((a, b) => b.startedAt - a.startedAt)[0];
  if (!lock) return null;
  return (
    <div className="flex flex-col gap-3 rounded-[16px] bg-canvas p-4 text-left">
      <div className="flex items-center gap-4">
        <CalendarTile at={lock.maturesAt} />
        <div className="min-w-0">
          <div className="text-[13px] text-ink-2">Matures in</div>
          <div className="text-lg font-extrabold tracking-[-0.01em]">
            <CountdownText to={lock.maturesAt} done="now" />
          </div>
          <div className="text-xs text-ink-3">{formatDate(lock.maturesAt)}</div>
        </div>
      </div>
      <AddToCalendar event={lockReminder(lock, formatAmount(lock.shares))} variant="secondary" block>
        Add the date to your calendar
      </AddToCalendar>
    </div>
  );
}

/* ---------- positions ---------- */

function LockRow({ lock, onRelease }: { lock: LockPosition; onRelease: () => void }) {
  const { data } = useDapp();
  const progress = lock.status === "active" ? (data.now - lock.startedAt) / (lock.maturesAt - lock.startedAt) : 1;
  return (
    <li className="py-4">
      <div className="flex flex-wrap items-center gap-3">
        <GlyphBadge glyph="share-locks" size={38} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-bold">
              <Amount value={lock.shares} asset="shares" />
            </span>
            {lock.status === "matured" ? (
              <Pill tone="green" size="sm" dot>
                Matured
              </Pill>
            ) : lock.status === "active" ? (
              <Pill tone="sky" size="sm">
                Active
              </Pill>
            ) : (
              <Pill tone="grey" size="sm">
                Released
              </Pill>
            )}
          </div>
          <div className="mt-0.5 text-xs text-ink-2">
            {lock.days} days · {formatDate(lock.startedAt)} → {formatDate(lock.maturesAt)}
          </div>
        </div>
        {lock.status === "matured" ? (
          <Button size="sm" onClick={onRelease} className="hidden sm:inline-flex">
            Release
          </Button>
        ) : null}
      </div>
      {lock.status !== "released" ? (
        <div className="mt-3 pl-[50px]">
          <ProgressBar value={progress} tone={lock.status === "matured" ? "green" : "ink"} size="sm" label="Time to maturity" />
          {lock.status === "matured" ? (
            <div className="mt-1.5 text-xs text-ink-3">Ready to release. Until then the shares stay locked.</div>
          ) : (
            <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 text-xs text-ink-3">
              <span>
                <CountdownText to={lock.maturesAt} done="now" className="font-semibold text-ink-2" /> left
              </span>
              <AddToCalendar event={lockReminder(lock, formatAmount(lock.shares))} variant="ghost" size="sm" className="-mr-2">
                Remind me
              </AddToCalendar>
            </div>
          )}
        </div>
      ) : null}
      {lock.status === "matured" ? (
        <Button size="md" block onClick={onRelease} className="mt-3 sm:hidden">
          Release <Amount value={lock.shares} asset="shares" />
        </Button>
      ) : null}
    </li>
  );
}

function LockPositions({ onRelease }: { onRelease: (locks: LockPosition[]) => void }) {
  const { data, connected, accountLoading } = useDapp();
  if (!connected) return <ConnectCard title="Connect to see your locks" text="Your lock positions and what has matured are read for the connected address." art={<ArtLock />} />;
  if (accountLoading) return <SkeletonCard rows={4} />;
  const locks = data.locks;
  const open = locks.filter((lock) => lock.status !== "released");
  const matured = locks.filter((lock) => lock.status === "matured");
  const active = locks.filter((lock) => lock.status === "active").sort((a, b) => a.maturesAt - b.maturesAt);
  const lockedShares = open.reduce((sum, lock) => sum + lock.shares, 0);

  return (
    <>
      <Card>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MiniStat label="Locked shares">
            <Amount value={lockedShares} />
          </MiniStat>
          <MiniStat label="Positions" hint={`${LOCK_MAX_POSITIONS - open.length} free`}>
            {open.length} of {LOCK_MAX_POSITIONS}
          </MiniStat>
          <MiniStat label="Matured" hint={matured.length ? "Ready to release" : undefined}>
            {matured.length}
          </MiniStat>
          <MiniStat label="Next maturity" hint={active[0] ? <CountdownText to={active[0].maturesAt} done="now" /> : undefined}>
            {active[0] ? formatDate(active[0].maturesAt) : "—"}
          </MiniStat>
        </div>
      </Card>
      <Card>
        <CardHeader
          title="Lock positions"
          hint="Matured locks first, then by maturity date."
          action={
            matured.length > 1 ? (
              <Button size="sm" onClick={() => onRelease(matured)}>
                Release all
              </Button>
            ) : null
          }
        />
        {locks.length ? (
          <ul className="row-divide -mt-2">
            {locks.map((lock) => (
              <LockRow key={lock.id} lock={lock} onRelease={() => onRelease([lock])} />
            ))}
          </ul>
        ) : (
          <EmptyState
            art={<ArtLock />}
            title={data.position ? "No locks yet" : "No shares to lock"}
            text={data.position ? "Lock available shares for 7 to 365 days. They keep earning while locked." : "Stake ETH first; your Vault shares can then be locked."}
            action={data.position ? null : <ButtonLink href="/app/stake">Stake ETH</ButtonLink>}
            className="py-6"
          />
        )}
      </Card>
    </>
  );
}

/** Share locks: a new lock on the right, the lock positions on the left. */
export function LocksScreen() {
  const flow = useTxFlow();
  const [release, setRelease] = useState<SheetRequest | null>(null);
  return (
    <>
      <PageHeader title="Share locks" description="Lock Vault shares for 7 to 365 days. They keep earning, and you release them once they mature." actions={<StakingTabs />} />
      <SplitLayout
        asideFirstOnMobile={false}
        aside={
          <Card>
            <LockForm flow={flow} />
          </Card>
        }
        main={
          <>
            <LockPositions onRelease={(locks) => setRelease(releaseRequest(locks))} />
            <RulesCard
              title="What a lock does"
              rules={[
                { title: "Rewards continue", text: "Locked shares earn and lose exactly as unlocked shares do. A lock earns no extra staking reward." },
                { title: "No early exit", text: "Locked shares can't enter the exit queue before maturity, in any market, validator or protocol conditions." },
                { title: "Release is a step", text: "A matured lock needs the Release transaction before its shares are available again." },
                { title: "Up to ten at a time", text: "Each lock is its own position, up to ten open at once. Released locks free their slot." },
              ]}
            />
            <div className="px-1">
              <DocsLink href="/docs/app/share-locks">Share locks in the docs</DocsLink>
            </div>
          </>
        }
      />
      <TxSheet request={release} onClose={() => setRelease(null)} />
    </>
  );
}
