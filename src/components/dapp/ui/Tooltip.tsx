"use client";

import { Tooltip } from "@base-ui/react/tooltip";
import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A small "i" that explains a term on hover or focus. */
export function InfoTip({ children, label = "More information", className }: { children: ReactNode; label?: string; className?: string }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        className={cn("inline-flex size-4 shrink-0 items-center justify-center rounded-full align-middle text-ink-3 transition-colors hover:text-ink", className)}
        aria-label={label}
      >
        <Info className="size-3.5" aria-hidden="true" />
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={6} className="z-[60]">
          <Tooltip.Popup className="max-w-[260px] rounded-[10px] bg-ink px-3 py-2 text-xs leading-5 font-medium text-white shadow-pop transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0">
            {children}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

/** Wraps any trigger with a short tooltip. */
export function Tip({ content, children }: { content: ReactNode; children: React.ReactElement }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={children} />
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={8} className="z-[60]">
          <Tooltip.Popup className="max-w-[240px] rounded-[10px] bg-ink px-3 py-2 text-xs leading-5 font-medium text-white shadow-pop transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0">
            {content}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
