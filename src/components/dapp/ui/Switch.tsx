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

/**
 * A toggle in the brand's colours: a grey track with a white knob, turning ink with a lime knob
 * when on. The knob sits centred in the track (3px all round) and stretches a little while pressed.
 * Its label and a line of help sit beside it, and the label toggles it too.
 */
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
        className="group inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full bg-chip-hover p-[3px] transition-colors duration-200 ease-out outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-card data-[checked]:bg-ink data-[disabled]:cursor-not-allowed"
      >
        <BaseSwitch.Thumb className="block h-[22px] w-[22px] rounded-full bg-card shadow-[0_1px_2px_rgba(15,15,15,0.2),0_3px_8px_-2px_rgba(15,15,15,0.25)] transition-[translate,width,background-color] duration-300 ease-[var(--ease-out-soft)] group-active:w-[26px] data-[checked]:translate-x-5 data-[checked]:bg-lime group-active:data-[checked]:translate-x-4" />
      </BaseSwitch.Root>
    </div>
  );
}
