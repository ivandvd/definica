import { ShieldAlert, ShieldCheck, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { clamp, formatHealth, HEALTH_WORDS, healthZone } from "../lib/format";
import { HEALTH_CAUTION, HEALTH_RISK } from "../lib/protocol";
import type { HealthZone } from "../lib/types";

/* Health is always shown as a number and a word, never by colour alone. */

const ZONE_PILL: Record<HealthZone, string> = {
  safe: "bg-green-soft text-green-ink",
  caution: "bg-amber-soft text-amber",
  risk: "bg-orange-soft text-orange",
  liquidatable: "bg-red-soft text-red",
};

const ZONE_ICON: Record<HealthZone, typeof ShieldCheck> = {
  safe: ShieldCheck,
  caution: TriangleAlert,
  risk: ShieldAlert,
  liquidatable: ShieldAlert,
};

export function HealthBadge({ value, className, size = "md" }: { value: number | null; className?: string; size?: "sm" | "md" }) {
  const zone = healthZone(value);
  const Icon = ZONE_ICON[zone];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-pill font-semibold whitespace-nowrap tabular",
        size === "sm" ? "h-5 px-1.5 text-[11px]" : "h-7 px-2.5 text-[13px]",
        ZONE_PILL[zone],
        className,
      )}
    >
      <Icon className={size === "sm" ? "size-3" : "size-3.5"} aria-hidden="true" />
      {value === null ? "No debt" : `${formatHealth(value)} · ${HEALTH_WORDS[zone]}`}
    </span>
  );
}

/** Where a health factor sits on the bar: liquidation at the left edge, comfortable at the right. */
const HEALTH_MAX = 3;
const positionOf = (value: number) => clamp((value - 1) / (HEALTH_MAX - 1), 0, 1);

/**
 * The walkthrough-style health bar: red near liquidation, amber, then green, with a marker at the
 * position's health. Zones follow the review thresholds (1.15 and 1.5).
 */
export function HealthBar({ value, className }: { value: number | null; className?: string }) {
  const marker = value === null ? 1 : positionOf(value);
  const risk = positionOf(HEALTH_RISK) * 100;
  const caution = positionOf(HEALTH_CAUTION) * 100;
  return (
    <div className={cn("w-full", className)}>
      <div
        className="relative h-2.5 w-full rounded-full"
        style={{
          background: `linear-gradient(90deg, var(--color-red) 0%, var(--color-orange) ${risk}%, var(--color-amber) ${caution * 0.85}%, #9ad06b ${caution}%, var(--color-green) 100%)`,
        }}
        role="meter"
        aria-valuemin={1}
        aria-valuemax={HEALTH_MAX}
        aria-valuenow={value === null ? HEALTH_MAX : Math.min(value, HEALTH_MAX)}
        aria-valuetext={value === null ? "No debt" : `Health factor ${formatHealth(value)}, ${HEALTH_WORDS[healthZone(value)]}`}
        aria-label="Health factor"
      >
        <span
          className="absolute top-1/2 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink bg-card shadow-thumb transition-[left] duration-700 ease-[var(--ease-out-soft)]"
          style={{ left: `${marker * 100}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-ink-3">
        <span>Liquidation · 1.00</span>
        <span>{HEALTH_MAX.toFixed(2)}+</span>
      </div>
    </div>
  );
}
