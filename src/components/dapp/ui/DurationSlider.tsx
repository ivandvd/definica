"use client";

import { Slider } from "@base-ui/react/slider";
import { useId } from "react";
import { cn } from "@/lib/utils";
import { clamp } from "../lib/format";

export interface DurationSliderProps {
  days: number;
  onChange: (days: number) => void;
  min: number;
  max: number;
  presets: number[];
  disabled?: boolean;
}

/** Lock duration: quick picks, a slider and a number field (a slider is never the only way in). */
export function DurationSlider({ days, onChange, min, max, presets, disabled = false }: DurationSliderProps) {
  const id = useId();
  return (
    <div className={cn(disabled && "opacity-55")}>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${presets.length}, minmax(0, 1fr))` }}>
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            disabled={disabled}
            aria-pressed={days === preset}
            onClick={() => onChange(preset)}
            className={cn(
              "h-10 rounded-chip bg-chip text-[13px] font-semibold text-ink transition-colors hover:bg-chip-hover disabled:pointer-events-none",
              days === preset && "bg-ink text-white hover:bg-ink",
            )}
          >
            {preset === 365 ? "1 year" : `${preset} days`}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4">
        <Slider.Root
          className="flex-1"
          value={days}
          min={min}
          max={max}
          step={1}
          disabled={disabled}
          onValueChange={(next) => onChange(Array.isArray(next) ? next[0] : (next as number))}
        >
          <Slider.Control className="flex w-full touch-none items-center py-3 select-none">
            <Slider.Track className="relative h-1.5 w-full rounded-full bg-chip">
              <Slider.Indicator className="rounded-full bg-ink" />
              <Slider.Thumb
                aria-label="Lock duration in days"
                className="size-6 rounded-full border-[1.5px] border-ink bg-lime shadow-thumb outline-none transition-transform focus-visible:ring-4 focus-visible:ring-lime/60 active:scale-110"
              />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
        <label htmlFor={id} className="flex h-10 items-center gap-1.5 rounded-chip bg-canvas px-3 text-sm text-ink-2 focus-within:shadow-[inset_0_0_0_1.5px_var(--color-ink)]">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            value={days}
            disabled={disabled}
            onChange={(event) => {
              const next = Number(event.target.value);
              if (Number.isFinite(next)) onChange(clamp(Math.round(next), min, max));
            }}
            // 16px: iOS zooms the page into any field set smaller when it's focused.
            className="w-12 bg-transparent text-right text-base font-semibold text-ink tabular outline-none"
            aria-label="Days"
          />
          days
        </label>
      </div>
    </div>
  );
}
