import type { ActionPreview, ProtocolErrorCode } from "../lib/protocol";

/** Problems about what was typed: they belong under the amount field. */
const FIELD_CODES = new Set<ProtocolErrorCode>([
  "invalid",
  "belowMinimum",
  "balance",
  "capacity",
  "limit",
  "supplyCap",
  "borrowCap",
  "healthFactor",
  "liquidity",
  "notBorrowableInEMode",
]);

/**
 * Splits a preview's problem into one for the field (the amount is wrong) and one for the form
 * (the figures are out of date, a restriction, a pause), which shows as a notice above the button.
 */
export function splitProblem(preview: ActionPreview | null, fresh: boolean) {
  const problem = fresh ? (preview?.problem ?? null) : null;
  if (!problem) return { field: null, form: null };
  return FIELD_CODES.has(problem.code) ? { field: problem.message, form: null } : { field: null, form: problem.message };
}
