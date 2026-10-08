"use client";

import { useId, useMemo, useState, type PointerEvent } from "react";
import { cn } from "@/lib/utils";
import { DAY, formatAmount, formatDateTime, formatSigned } from "../lib/format";
import type { PositionPoint } from "../lib/types";
import { usePreferences } from "../providers/DappProvider";

export type ChartRange = "1W" | "1M" | "3M" | "All";
const RANGE_DAYS: Record<ChartRange, number> = { "1W": 7, "1M": 30, "3M": 90, All: Infinity };
const RANGE_WORDS: Record<ChartRange, string> = { "1W": "this week", "1M": "this month", "3M": "in three months", All: "since your first deposit" };

/** Values move at harvests, every 12 hours. */
const HARVEST = 12 * 3_600_000;

const WIDTH = 640;
const HEIGHT = 168;
const PAD_TOP = 14;
const PAD_BOTTOM = 6;

export interface StepChartProps {
  points: PositionPoint[];
  /** The asset the values are in, for the change line and the hover label. */
  unit?: string;
  className?: string;
  /** Shown when there is not enough history to draw. */
  emptyText?: string;
}

/**
 * A position's value over time, drawn as steps: values move only at harvests and transactions,
 * never continuously. Hover (or touch) reads any point; the change over the range sits above.
 */
export function StepChart({ points, unit = "ETH", className, emptyText = "Your chart starts at the next harvest, when rewards first apply." }: StepChartProps) {
  const [range, setRange] = useState<ChartRange>("1M");
  const [hover, setHover] = useState<number | null>(null);
  const { hideBalances, precision } = usePreferences();
  const gradientId = useId();

  const view = useMemo(() => {
    if (points.length < 2) return null;
    const end = points[points.length - 1].t;
    // A position younger than one harvest has nothing to draw yet.
    const funded = points.find((point) => point.valueEth > 0);
    if (!funded || end - funded.t < HARVEST) return null;
    // Start no earlier than just before the first stake, so a young position isn't a flat zero line.
    const from = Math.max(end - RANGE_DAYS[range] * DAY, funded.t - (end - funded.t) * 0.04);
    const inRange = points.filter((point) => point.t >= from);
    // Start the range with the value it entered at, so the first step is flat, not missing.
    const before = points.filter((point) => point.t < from).pop();
    const slice = before ? [{ ...before, t: from }, ...inRange] : inRange;
    if (slice.length < 2) return null;
    const t0 = slice[0].t;
    const span = Math.max(1, end - t0);
    const values = slice.map((point) => point.valueEth);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pad = (max - min) * 0.12 || max * 0.002 || 1;
    const lo = min - pad;
    const hi = max + pad;
    const x = (t: number) => ((t - t0) / span) * WIDTH;
    const y = (v: number) => PAD_TOP + (1 - (v - lo) / (hi - lo)) * (HEIGHT - PAD_TOP - PAD_BOTTOM);
    let line = `M0 ${y(slice[0].valueEth).toFixed(1)}`;
    for (let i = 1; i < slice.length; i++) {
      line += ` H${x(slice[i].t).toFixed(1)} V${y(slice[i].valueEth).toFixed(1)}`;
    }
    line += ` H${WIDTH}`;
    const first = values[0];
    const last = values[values.length - 1];
    // With earnings on the points, the headline is what was earned, never deposits counted as gains.
    const earned = slice.every((point) => point.earnedEth !== undefined);
    const changeAbs = earned ? (slice[slice.length - 1].earnedEth ?? 0) - (slice[0].earnedEth ?? 0) : last - first;
    return {
      slice,
      line,
      area: `${line} V${HEIGHT} H0 Z`,
      x,
      y,
      earned,
      changeAbs,
      changePct: first > 0 ? (changeAbs / first) * 100 : 0,
      endY: y(last),
    };
  }, [points, range]);

  const onPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!view) return;
    const box = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - box.left) / box.width) * WIDTH;
    let index = 0;
    for (let i = 0; i < view.slice.length; i++) if (view.x(view.slice[i].t) <= px) index = i;
    setHover(index);
  };

  const hovered = view && hover !== null ? view.slice[Math.min(hover, view.slice.length - 1)] : null;
  const up = (view?.changeAbs ?? 0) >= 0;

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex min-h-5 items-center justify-between gap-3 text-[13px]">
        {view ? (
          hovered ? (
            <span className="text-ink-2">
              <span className="font-semibold text-ink tabular">{hideBalances ? "••••" : formatAmount(hovered.valueEth, precision)}</span> {unit} ·{" "}
              {formatDateTime(hovered.t)}
            </span>
          ) : (
            <span className="text-ink-2">
              <span className={cn("font-semibold tabular", up ? "text-green-ink" : "text-red")}>
                {hideBalances ? "••••" : formatSigned(view.changeAbs, precision)} {unit}
              </span>{" "}
              {view.earned ? `earned ${RANGE_WORDS[range]}` : RANGE_WORDS[range]}
            </span>
          )
        ) : (
          <span className="text-ink-3">{emptyText}</span>
        )}
      </div>

      <div className="relative mt-3 -mx-5 sm:-mx-6">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          className="block h-36 w-full touch-pan-y sm:h-44"
          role="img"
          aria-label={view ? `Position value over time. ${view.earned ? "Earned" : "Change"} ${RANGE_WORDS[range]}: ${formatSigned(view.changeAbs, 4)} ${unit}` : "No history yet"}
          onPointerMove={onPointer}
          onPointerDown={onPointer}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#05c92f" stopOpacity="0.22" />
              <stop offset="1" stopColor="#05c92f" stopOpacity="0" />
            </linearGradient>
          </defs>
          {view ? (
            <g key={range}>
              <path d={view.area} fill={`url(#${gradientId})`} className="animate-fade" />
              <path
                d={view.line}
                fill="none"
                stroke="#05c92f"
                strokeWidth="2"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                strokeDasharray="1"
                className="[animation:draw_1.1s_var(--ease-out-soft)_both]"
              />
              {hovered ? (
                <>
                  <line x1={view.x(hovered.t)} x2={view.x(hovered.t)} y1={0} y2={HEIGHT} stroke="#0f0f0f" strokeOpacity="0.25" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
                </>
              ) : null}
            </g>
          ) : (
            <path d={`M0 ${HEIGHT * 0.7} H${WIDTH}`} stroke="#dde2de" strokeWidth="2" strokeDasharray="6 6" vectorEffect="non-scaling-stroke" />
          )}
        </svg>
        {view ? (
          <span
            className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-green shadow-thumb"
            style={{
              left: hovered ? `${(view.x(hovered.t) / WIDTH) * 100}%` : "100%",
              top: `${((hovered ? view.y(hovered.valueEth) : view.endY) / HEIGHT) * 100}%`,
              marginLeft: hovered ? 0 : -6,
            }}
            aria-hidden="true"
          />
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between px-0.5 text-xs text-ink-2" role="tablist" aria-label="Chart range">
        {(Object.keys(RANGE_DAYS) as ChartRange[]).map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={range === option}
            onClick={() => setRange(option)}
            className={cn("rounded-[8px] px-3 py-1.5 font-semibold transition-colors hover:text-ink", range === option && "bg-green-soft text-green-ink hover:text-green-ink")}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
