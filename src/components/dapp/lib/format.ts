import { HEALTH_CAUTION, HEALTH_RISK } from "./protocol";
import type { Asset, HealthZone } from "./types";

const LOCALE = "en-GB";

const formatters = new Map<string, Intl.NumberFormat>();

const numberFormat = (max: number, min = max) => {
  const key = `${min}:${max}`;
  let format = formatters.get(key);
  if (!format) {
    format = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: min, maximumFractionDigits: max });
    formatters.set(key, format);
  }
  return format;
};

/** "1,234.5678": amounts of ETH, osETH or shares. Tiny non-zero amounts read "<0.0001". */
export function formatAmount(value: number, digits = 4) {
  if (value !== 0 && Math.abs(value) < 10 ** -digits) return `${value < 0 ? "-" : ""}<${(10 ** -digits).toFixed(digits)}`;
  return numberFormat(digits, Math.min(2, digits)).format(value);
}

/** Kept for the existing call sites: ETH with 2 or 4 decimals. */
export const formatEth = (value: number, digits: 2 | 4 = 4) => formatAmount(value, digits);

/** "+0.0581" / "−0.0012": a signed amount for returns and activity. */
export function formatSigned(value: number, digits = 4) {
  if (value === 0) return formatAmount(0, digits);
  return `${value > 0 ? "+" : "−"}${formatAmount(Math.abs(value), digits)}`;
}

/** "4,312" */
export const formatInteger = (value: number) => numberFormat(0).format(value);

/** "1.2k", "12.4k", "1.3M": large totals in tight spaces. */
export function formatCompact(value: number) {
  return new Intl.NumberFormat(LOCALE, { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

/** "3.12%" */
export function formatPercent(value: number, digits = 2) {
  return `${numberFormat(digits, 0).format(value)}%`;
}

/** Basis points as a percentage: 500 → "5%". */
export const formatBps = (bps: number) => formatPercent(bps / 100, 2);

/** The unit an asset is written in. */
export const unitOf = (asset: Asset) => (asset === "shares" ? "shares" : asset);

/** "1.25 ETH", "4.193 shares". */
export const formatAsset = (amount: number, asset: Asset, digits = 4) => `${formatAmount(amount, digits)} ${unitOf(asset)}`;

/** "0xDEF1…c0DE" */
export const shortAddress = (address: string, chars = 4) => `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;

const dateFormat = new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "short", year: "numeric" });
const shortDateFormat = new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "short" });
const dateTimeFormat = new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const timeFormat = new Intl.DateTimeFormat(LOCALE, { hour: "2-digit", minute: "2-digit" });
const dayHeadingFormat = new Intl.DateTimeFormat(LOCALE, { weekday: "long", day: "numeric", month: "long" });

export const formatDate = (timestamp: number) => dateFormat.format(timestamp);
export const formatShortDate = (timestamp: number) => shortDateFormat.format(timestamp);
export const formatDateTime = (timestamp: number) => dateTimeFormat.format(timestamp);
export const formatTime = (timestamp: number) => timeFormat.format(timestamp);
export const formatDayHeading = (timestamp: number) => dayHeadingFormat.format(timestamp);

export const DAY = 86_400_000;
export const HOUR = 3_600_000;

/** "in 12 days", "3 days ago", "today". */
export function relativeDays(timestamp: number, now: number) {
  const days = Math.round((timestamp - now) / DAY);
  if (days === 0) return "today";
  const unit = Math.abs(days) === 1 ? "day" : "days";
  return days > 0 ? `in ${days} ${unit}` : `${-days} ${unit} ago`;
}

/** "2 days 4 hours", "5 hours", "under an hour": time left until a moment. */
export function formatCountdown(timestamp: number, now: number) {
  const ms = timestamp - now;
  if (ms <= 0) return "now";
  const days = Math.floor(ms / DAY);
  const hours = Math.floor((ms % DAY) / HOUR);
  if (days >= 3) return `${days} days`;
  if (days > 0) return `${days} ${days === 1 ? "day" : "days"}${hours ? ` ${hours} h` : ""}`;
  if (hours > 0) return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  return "under an hour";
}

/** "2h ago", "3d ago", or the date when older than a week. */
export function timeAgo(timestamp: number, now: number) {
  const minutes = Math.round((now - timestamp) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(timestamp);
}

/** "12 s", "4 min": the age of the data on screen. */
export function formatAge(seconds: number) {
  if (seconds < 60) return `${Math.max(1, Math.round(seconds))} s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  return `${Math.round(minutes / 60)} h`;
}

/** "1.84", "∞" (no debt), "<1.00" stays honest about being under one. */
export function formatHealth(value: number | null) {
  if (value === null || !Number.isFinite(value)) return "∞";
  if (value >= 100) return ">100";
  return numberFormat(2).format(Math.floor(value * 100) / 100);
}

export function healthZone(value: number | null): HealthZone {
  if (value === null || !Number.isFinite(value)) return "safe";
  if (value < 1) return "liquidatable";
  if (value < HEALTH_RISK) return "risk";
  if (value < HEALTH_CAUTION) return "caution";
  return "safe";
}

export const HEALTH_WORDS: Record<HealthZone, string> = {
  safe: "Safe",
  caution: "Caution",
  risk: "At risk",
  liquidatable: "Liquidatable",
};

/** Parses what a user typed into an amount field; `null` when it is not a non-negative number. */
export function parseAmount(input: string) {
  const trimmed = input.trim().replace(",", ".");
  if (trimmed === "" || trimmed === ".") return null;
  if (!/^\d*\.?\d*$/.test(trimmed)) return null;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

/** An amount written back into a field: no float noise, no trailing zeros. */
export const amountToInput = (value: number, digits = 6) => {
  if (!(value > 0)) return "";
  const factor = 10 ** digits;
  return String(Math.floor(value * factor) / factor);
};

/** Clamps a number to [min, max]. */
export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
