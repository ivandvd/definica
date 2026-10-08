"use client";

import { cn } from "@/lib/utils";
import { formatAmount, formatSigned, unitOf } from "../lib/format";
import type { Asset } from "../lib/types";
import { usePreferences } from "../providers/DappProvider";
import { useCountUp } from "./useCountUp";

const MASK = "••••";

export interface AmountProps {
  value: number;
  asset?: Asset;
  /** Overrides the decimals preference (counts, prices that always need 4). */
  digits?: number;
  /** Prefixes + or − (returns, activity). */
  signed?: boolean;
  /** Hides the unit, when a column header already says it. */
  bare?: boolean;
  /** The unit in a lighter weight and smaller size (headline figures). */
  unitClassName?: string;
  className?: string;
  /** Never masked: protocol-wide figures (capacity, share price) are public. */
  isPublic?: boolean;
  /** Glides to the value (headline figures), as the walkthrough's count-up. */
  animate?: boolean;
}

/**
 * Every amount of the user's own position goes through here, so the eye toggle (hide balances)
 * and the decimals preference apply everywhere at once.
 */
export function Amount({ value, asset, digits, signed = false, bare = false, unitClassName, className, isPublic = false, animate = false }: AmountProps) {
  const { hideBalances, precision } = usePreferences();
  const shown = useCountUp(value, animate);
  const places = digits ?? precision;
  const hidden = hideBalances && !isPublic;
  const figure = animate ? shown : value;
  const text = hidden ? MASK : signed ? formatSigned(figure, places) : formatAmount(figure, places);
  return (
    <span className={cn("tabular", className)}>
      {text}
      {asset && !bare ? <span className={cn("ml-[0.28em]", unitClassName)}>{unitOf(asset)}</span> : null}
    </span>
  );
}

/** Plain-text version for places that need a string (aria labels, button labels). */
export function useAmountText() {
  const { hideBalances, precision } = usePreferences();
  return (value: number, asset?: Asset, options: { digits?: number; isPublic?: boolean } = {}) => {
    const text = hideBalances && !options.isPublic ? MASK : formatAmount(value, options.digits ?? precision);
    return asset ? `${text} ${unitOf(asset)}` : text;
  };
}
