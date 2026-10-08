import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StatProps {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** A figure with its label, as used in tiles and card headers. */
export function Stat({ label, value, hint, size = "md", className }: StatProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex items-center gap-1.5 text-[13px] text-ink-2">{label}</div>
      <div
        className={cn(
          "figure mt-1 truncate font-extrabold",
          size === "lg" ? "text-[28px] leading-9" : size === "md" ? "text-xl leading-7" : "text-base leading-6",
        )}
      >
        {value}
      </div>
      {hint ? <div className="mt-0.5 text-xs leading-4 text-ink-3">{hint}</div> : null}
    </div>
  );
}
