"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useDapp } from "../providers/DappProvider";

/*
 * Live countdowns: the next harvest, a lock's maturity, an exit's expected claim. They tick every
 * second against the protocol's clock (the chain's time), not the device's alone.
 */

/** The protocol's clock, ticking every `intervalMs`. */
export function useNow(intervalMs = 1000) {
  const { env, data } = useDapp();
  const [now, setNow] = useState(data.now);
  useEffect(() => {
    const tick = () => setNow(env.protocol.now());
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, intervalMs);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [env, intervalMs]);
  // A refresh can move the clock on before the next tick; never show a time behind the data's.
  return Math.max(now, data.now);
}

const pad = (value: number) => String(value).padStart(2, "0");

export function splitDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(total / 86_400), h: Math.floor((total % 86_400) / 3600), m: Math.floor((total % 3600) / 60), s: total % 60 };
}

/** "89d 23h 59m", "5h 42m 10s", "42m 10s", "10s". */
export function formatTicking(ms: number) {
  const { d, h, m, s } = splitDuration(ms);
  if (d > 0) return `${d}d ${pad(h)}h ${pad(m)}m`;
  if (h > 0) return `${h}h ${pad(m)}m ${pad(s)}s`;
  if (m > 0) return `${m}m ${pad(s)}s`;
  return `${s}s`;
}

/** A countdown in running text ("5h 42m 10s"); `done` once it reaches zero. */
export function CountdownText({ to, done = "any moment now", className }: { to: number; done?: string; className?: string }) {
  const now = useNow();
  const ms = to - now;
  return <span className={cn("tabular", className)}>{ms <= 0 ? done : formatTicking(ms)}</span>;
}

function Tile({ value, label, className }: { value: string; label: string; className?: string }) {
  return (
    <span className={cn("flex min-w-[44px] flex-col items-center rounded-[12px] border-[1.5px] border-ink bg-card px-1.5 pt-1 pb-0.5", className)}>
      <span className="block h-[26px] overflow-hidden">
        {/* Keyed by its value: each new figure drops in. */}
        <span key={value} className="figure block animate-[tick-in_0.35s_var(--ease-out-soft)] text-[21px] leading-[26px] font-extrabold">
          {value}
        </span>
      </span>
      <span className="text-[9px] font-bold tracking-[0.06em] text-ink-3 uppercase">{label}</span>
    </span>
  );
}

/** A countdown as tiles: days (when there are any), hours, minutes, seconds. */
export function CountdownTiles({ to, className, tileClassName }: { to: number; className?: string; tileClassName?: string }) {
  const now = useNow();
  const { d, h, m, s } = splitDuration(to - now);
  return (
    <span className={cn("inline-flex items-start gap-1.5", className)} role="timer" aria-label={`${formatTicking(to - now)} left`}>
      {d > 0 ? <Tile value={String(d)} label={d === 1 ? "day" : "days"} className={tileClassName} /> : null}
      <Tile value={pad(h)} label="hrs" className={tileClassName} />
      <Tile value={pad(m)} label="min" className={tileClassName} />
      <Tile value={pad(s)} label="sec" className={tileClassName} />
    </span>
  );
}

/** How far through its cycle something is, as a ring. */
function CycleRing({ value }: { value: number }) {
  const r = 15;
  const length = 2 * Math.PI * r;
  return (
    <span className="relative flex size-10 shrink-0 items-center justify-center" aria-hidden="true">
      <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90">
        <circle cx="20" cy="20" r={r} fill="#ffffff" stroke="#0f0f0f" strokeWidth="1.5" />
        <circle cx="20" cy="20" r={r - 4} fill="none" stroke="#e2f2e5" strokeWidth="5" />
        <circle
          cx="20"
          cy="20"
          r={r - 4}
          fill="none"
          stroke="#05c92f"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${((length * (r - 4)) / r) * value} ${length}`}
          className="transition-[stroke-dasharray] duration-700 ease-out"
        />
      </svg>
      <Clock className="relative size-3.5 text-ink" />
    </span>
  );
}

/**
 * Time to the next harvest, when rewards reach every share. When it lands, the position is read
 * again, so the new rewards show without a reload.
 */
export function HarvestCountdown({ title = "Next harvest", text = "Rewards reach every share, every 12 hours.", className }: { title?: string; text?: string; className?: string }) {
  const { data, refresh } = useDapp();
  const vault = data.vault;
  const now = useNow();
  const target = vault?.nextHarvestAt ?? null;
  const due = target !== null && now >= target;

  useEffect(() => {
    if (due) void refresh();
  }, [due, refresh]);

  if (!vault || target === null) return null;
  const cycle = target - vault.lastHarvestAt;
  const progress = cycle > 0 ? Math.min(1, Math.max(0, (now - vault.lastHarvestAt) / cycle)) : 0;
  // Sized by its own width (a narrow panel on a wide screen too): one row when the tiles fit
  // beside the words, otherwise the tiles take a full-width row underneath.
  return (
    <div className={cn("@container", className)}>
      <div className="flex flex-col gap-3 rounded-[16px] bg-mint px-3.5 py-3 text-left @md:flex-row @md:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <CycleRing value={progress} />
          <div className="min-w-0">
            <div className="text-[13px] leading-4 font-bold">{title}</div>
            <div className="mt-0.5 text-xs leading-4 text-ink-2">{due ? "Harvesting now…" : text}</div>
          </div>
        </div>
        <CountdownTiles to={target} className="flex w-full @md:inline-flex @md:w-auto" tileClassName="flex-1 @md:flex-none" />
      </div>
    </div>
  );
}
