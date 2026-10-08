"use client";

import { Tabs } from "@base-ui/react/tabs";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  size?: "sm" | "md";
  /** "canvas" sits on white cards (grey track); "card" sits on the canvas (white track). */
  surface?: "canvas" | "card";
  block?: boolean;
  className?: string;
  "aria-label"?: string;
}

/** The walkthrough's segment control: one white thumb sliding behind the selected option. */
export function Segmented<T extends string>({ value, onChange, options, size = "md", surface = "canvas", block = false, className, ...rest }: SegmentedProps<T>) {
  return (
    <Tabs.Root value={value} onValueChange={(next) => onChange(next as T)} className={cn(block && "w-full", className)}>
      <Tabs.List
        aria-label={rest["aria-label"]}
        className={cn(
          "relative isolate inline-flex items-center rounded-chip p-[3px]",
          surface === "canvas" ? "bg-canvas" : "bg-chip",
          size === "sm" ? "h-9" : "h-11",
          block && "flex w-full",
        )}
      >
        <Tabs.Indicator className="absolute top-[3px] left-0 -z-10 h-[calc(100%-6px)] w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)] rounded-[8px] bg-card shadow-thumb transition-[translate,width] duration-300 ease-[var(--ease-out-soft)]" />
        {options.map((option) => (
          <Tabs.Tab
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className={cn(
              "flex h-full items-center justify-center gap-1.5 rounded-[8px] font-semibold whitespace-nowrap text-ink-2 transition-colors outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-ink/40 disabled:opacity-40 aria-selected:text-ink",
              size === "sm" ? "px-3 text-[13px]" : "px-4 text-sm",
              block && "flex-1",
            )}
          >
            {option.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
