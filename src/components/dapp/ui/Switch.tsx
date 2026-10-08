"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
}

/** The walkthrough's toggle: an ink outline that fills when on, with its label and a line of help. */
export function Switch({ checked, onCheckedChange, label, description, disabled = false, className }: SwitchProps) {
  const id = useId();
  return (
    <div className={cn("flex items-center justify-between gap-4", disabled && "opacity-50", className)}>
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="block text-sm font-semibold">{label}</span>
        {description ? <span className="mt-0.5 block text-[13px] leading-5 text-ink-2">{description}</span> : null}
      </label>
      <BaseSwitch.Root
        id={id}
        checked={checked}
        onCheckedChange={(next) => onCheckedChange(next)}
        disabled={disabled}
        className="relative h-[26px] w-[46px] shrink-0 cursor-pointer rounded-full border-[1.5px] border-ink bg-card transition-colors duration-200 data-[checked]:bg-ink"
      >
        <BaseSwitch.Thumb className="block size-[18px] translate-x-[2.5px] rounded-full border-[1.5px] border-ink bg-card transition-[translate,border-color] duration-300 ease-[var(--ease-out-soft)] data-[checked]:translate-x-[21.5px] data-[checked]:border-white" />
      </BaseSwitch.Root>
    </div>
  );
}
