import { cn } from "@/lib/utils";
import { clamp } from "../lib/format";

export interface ProgressBarProps {
  /** 0–1 */
  value: number;
  tone?: "green" | "lime" | "sky" | "ink" | "amber" | "red";
  size?: "sm" | "md";
  label?: string;
  className?: string;
}

const TONES = {
  green: "bg-green",
  lime: "bg-lime",
  sky: "bg-sky",
  ink: "bg-ink",
  amber: "bg-amber",
  red: "bg-red",
};

export function ProgressBar({ value, tone = "green", size = "md", label, className }: ProgressBarProps) {
  const percent = clamp(value, 0, 1) * 100;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      aria-label={label}
      className={cn("w-full overflow-hidden rounded-full bg-chip", size === "sm" ? "h-1.5" : "h-2", className)}
    >
      <div className={cn("h-full rounded-full transition-[width] duration-700 ease-[var(--ease-out-soft)]", TONES[tone])} style={{ width: `${percent}%` }} />
    </div>
  );
}
