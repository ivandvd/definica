import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type PillTone = "green" | "grey" | "white" | "lime" | "sky" | "amber" | "orange" | "red" | "ink";

const TONES: Record<PillTone, string> = {
  green: "bg-green-soft text-green-ink",
  grey: "bg-chip text-ink-2",
  white: "bg-card text-ink-2",
  lime: "bg-lime text-ink",
  sky: "bg-sky-soft text-sky-ink",
  amber: "bg-amber-soft text-amber",
  orange: "bg-orange-soft text-orange",
  red: "bg-red-soft text-red",
  ink: "bg-ink text-white",
};

const DOTS: Record<PillTone, string> = {
  green: "bg-green",
  grey: "bg-ink-3",
  white: "bg-ink-3",
  lime: "bg-ink",
  sky: "bg-sky-ink",
  amber: "bg-amber",
  orange: "bg-orange",
  red: "bg-red",
  ink: "bg-lime",
};

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: PillTone;
  /** A status dot before the label; `pulse` animates it (pending states). */
  dot?: boolean | "pulse";
  size?: "sm" | "md";
}

/** The walkthrough's small rounded label ("Vault shares", "Ready to claim"). */
export function Pill({ tone = "grey", dot = false, size = "md", className, children, ...rest }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-pill font-semibold whitespace-nowrap",
        size === "sm" ? "h-5 px-1.5 text-[11px]" : "h-6 px-2 text-xs",
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {dot ? <span className={cn("size-1.5 rounded-full", DOTS[tone], dot === "pulse" && "animate-pulse-dot")} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/** "Coming soon": the sticker-style pill (lime, ink outline) on what opens next. */
export function SoonPill({ className, label = "Coming soon" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-full border border-sticker bg-lime px-2 text-[10.5px] font-bold tracking-[0.01em] whitespace-nowrap text-sticker",
        className,
      )}
    >
      {label}
    </span>
  );
}
