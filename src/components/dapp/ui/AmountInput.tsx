"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { amountToInput, formatAmount, parseAmount, unitOf } from "../lib/format";
import type { Asset } from "../lib/types";
import { usePreferences } from "../providers/DappProvider";
import { AssetBadge } from "./Glyph";

export interface AmountPreset {
  label: string;
  value: number;
}

export interface AmountInputProps {
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  asset: Asset;
  /** What the user holds (or can use); shown top right. */
  balance?: number | null;
  balanceLabel?: string;
  /** What Max fills in, when it differs from the balance (a gas reserve for ETH). */
  max?: number | null;
  presets?: AmountPreset[];
  /** A line under the field: "≈ 0.9928 Vault shares". */
  below?: ReactNode;
  error?: string | null;
  disabled?: boolean;
  autoFocus?: boolean;
}

/**
 * The big amount field of every form: the walkthrough's chips under it, Max beside the balance,
 * and the error read out to screen readers as it appears.
 */
export function AmountInput({
  label,
  value,
  onChange,
  asset,
  balance = null,
  balanceLabel = "Balance",
  max = null,
  presets,
  below,
  error = null,
  disabled = false,
  autoFocus = false,
}: AmountInputProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const { hideBalances } = usePreferences();
  const maxValue = max ?? balance;
  const parsed = parseAmount(value);
  const invalid = value.trim() !== "" && parsed === null;
  const message = invalid ? "Enter a number." : error;

  return (
    <div className={cn(disabled && "opacity-55")}>
      <div
        className={cn(
          "rounded-[16px] bg-canvas px-4 pt-3.5 pb-3 transition-shadow focus-within:shadow-[inset_0_0_0_1.5px_var(--color-ink)]",
          message && "shadow-[inset_0_0_0_1.5px_var(--color-red)] focus-within:shadow-[inset_0_0_0_1.5px_var(--color-red)]",
        )}
      >
        <div className="flex items-center justify-between gap-3 text-[13px]">
          <label htmlFor={id} className="text-ink-2">
            {label}
          </label>
          {balance !== null ? (
            <span className="flex items-center gap-2 text-ink-2">
              <span>
                {balanceLabel} <span className="font-semibold text-ink tabular">{hideBalances ? "••••" : formatAmount(balance)}</span>
              </span>
              {maxValue !== null ? (
                <button
                  type="button"
                  disabled={disabled || maxValue <= 0}
                  onClick={() => onChange(amountToInput(maxValue))}
                  className="h-6 rounded-[7px] bg-card px-2 text-[11px] font-bold tracking-wide text-ink shadow-[inset_0_0_0_1px_var(--color-line)] transition-colors hover:bg-lime disabled:opacity-40"
                >
                  MAX
                </button>
              ) : null}
            </span>
          ) : null}
        </div>
        <div className="mt-1 flex items-center gap-3">
          <input
            id={id}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            placeholder="0.00"
            value={value}
            disabled={disabled}
            autoFocus={autoFocus}
            aria-invalid={message ? true : undefined}
            aria-describedby={message || below ? messageId : undefined}
            onChange={(event) => onChange(event.target.value.replace(",", "."))}
            className="figure h-12 w-full min-w-0 bg-transparent text-[34px] leading-none font-extrabold text-ink outline-none placeholder:text-ink-3/60 disabled:cursor-not-allowed sm:text-[38px]"
          />
          <span className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-card py-1 pr-3 pl-1 text-sm font-semibold">
            <AssetBadge asset={asset} size={26} />
            {unitOf(asset) === "shares" ? "Shares" : unitOf(asset)}
          </span>
        </div>
        {below ? (
          <div id={message ? undefined : messageId} className="mt-1 min-h-5 text-[13px] text-ink-2">
            {below}
          </div>
        ) : null}
      </div>

      {presets?.length ? (
        <div className="mt-2.5 grid gap-2" style={{ gridTemplateColumns: `repeat(${presets.length}, minmax(0, 1fr))` }}>
          {presets.map((preset) => {
            const selected = parsed !== null && preset.value > 0 && Math.abs(parsed - Number(amountToInput(preset.value))) < 1e-9;
            return (
              <button
                key={preset.label}
                type="button"
                disabled={disabled || preset.value <= 0}
                onClick={() => onChange(amountToInput(preset.value))}
                aria-pressed={selected}
                className={cn(
                  "h-10 rounded-chip bg-chip text-[13px] font-semibold text-ink transition-colors hover:bg-chip-hover disabled:pointer-events-none disabled:opacity-40",
                  selected && "bg-ink text-white hover:bg-ink",
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {message ? (
        <p id={messageId} className="mt-2 flex items-start gap-1.5 text-[13px] leading-5 font-medium text-red" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
