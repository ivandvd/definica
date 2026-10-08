import type {
  ActivityItem,
  Address,
  AppStatus,
  Asset,
  AssetAmount,
  Balances,
  BorrowPosition,
  Eligibility,
  ExitRequest,
  ExitRoute,
  Hash,
  LendPosition,
  LiquidityInfo,
  LiquidityPosition,
  LockPosition,
  Market,
  MarketId,
  PhaseId,
  PhaseInfo,
  Position,
  TxReceipt,
  VaultInfo,
} from "./types";

/* ---------- actions ---------- */

/** Everything a user can do. One preview and one execute path serve all of them. */
export type Action =
  | { type: "stake"; amount: number }
  | { type: "requestExit"; shares: number; route: ExitRoute }
  | { type: "claimExits"; ids: string[] }
  | { type: "createLock"; shares: number; days: number }
  | { type: "releaseLocks"; ids: string[] }
  | { type: "commit"; source: "osETH" | "aEthosETH"; amount: number; days: number; financing: number | null }
  | { type: "releaseCommitment"; id: string }
  | { type: "repayFunding"; id: string; amount: number }
  | { type: "withdrawToOseth"; amount: number }
  | { type: "supplyCollateral"; marketId: MarketId; amount: number }
  | { type: "withdrawCollateral"; marketId: MarketId; amount: number }
  | { type: "borrow"; marketId: MarketId; amount: number }
  | { type: "repay"; marketId: MarketId; amount: number }
  | { type: "supplyEth"; amount: number }
  | { type: "withdrawEth"; amount: number };

export type ActionType = Action["type"];

/** The phase each action belongs to (paused phases block their actions, except the way out). */
export const ACTION_PHASE: Record<ActionType, PhaseId> = {
  stake: 1,
  requestExit: 1,
  claimExits: 1,
  createLock: 1,
  releaseLocks: 1,
  commit: 2,
  releaseCommitment: 2,
  repayFunding: 2,
  withdrawToOseth: 2,
  supplyCollateral: 3,
  withdrawCollateral: 3,
  borrow: 3,
  repay: 3,
  supplyEth: 3,
  withdrawEth: 3,
};

/**
 * Actions that open or grow a position. A regional restriction blocks these and only these:
 * exits, claims, releases and repayments always stay open, so nobody's funds are trapped.
 */
export const OPENS_POSITION: ReadonlySet<ActionType> = new Set<ActionType>(["stake", "createLock", "commit", "supplyCollateral", "borrow", "supplyEth"]);

/* ---------- previews ---------- */

/** A line of the "before you confirm" summary. */
export interface ConditionLine {
  label: string;
  value: string;
  hint?: string;
}

/** Before → after, for the figures an action changes (shares, slots, health, debt). */
export interface ChangeLine {
  label: string;
  before: string;
  after: string;
  /** Colours the "after" value: health that drops into caution or risk, say. */
  tone?: "good" | "caution" | "danger";
}

export interface PreviewWarning {
  level: "info" | "caution" | "danger";
  text: string;
}

/** One wallet request in an action: a free signature (permit) or a transaction that costs gas. */
export interface TxStep {
  label: string;
  kind: "signature" | "transaction";
}

/**
 * Everything the review shows, and whatever blocks the action. Forms read it as the user types,
 * so the review never shows a number the form did not.
 */
export interface ActionPreview {
  action: Action;
  /** What leaves the wallet or the position… */
  gives: AssetAmount[];
  /** …and what comes back. */
  gets: AssetAmount[];
  changes: ChangeLine[];
  conditions: ConditionLine[];
  warnings: PreviewWarning[];
  steps: TxStep[];
  /** The contract the wallet will show, so it can be matched against the Contracts card. */
  contract: { name: string; address: Address | null; method: string };
  networkFeeEth: number;
  /** Why the action cannot go through as entered; the confirm button stays disabled. */
  problem: { code: ProtocolErrorCode; message: string } | null;
}

/* ---------- transactions ---------- */

/** Reported as each step waits for the wallet, then for the network. */
export type TxProgress =
  | { phase: "wallet"; step: number; total: number; label: string }
  | { phase: "pending"; step: number; total: number; label: string; hash: Hash };

export type OnTxProgress = (progress: TxProgress) => void;

export type ProtocolErrorCode =
  | "rejected"
  | "invalid"
  | "belowMinimum"
  | "balance"
  | "capacity"
  | "limit"
  | "notActive"
  | "paused"
  | "restricted"
  | "notMatured"
  | "supplyCap"
  | "borrowCap"
  | "notBorrowableInEMode"
  | "healthFactor"
  | "liquidity"
  | "stale"
  | "network"
  | "reverted";

export class ProtocolError extends Error {
  constructor(
    message: string,
    readonly code: ProtocolErrorCode,
  ) {
    super(message);
    this.name = "ProtocolError";
  }
}

/**
 * Everything the app reads from, and sends to, the protocol. The screens only ever talk to this
 * interface: the preview client serves sample data, and an onchain client (wagmi + viem, the
 * published addresses and a Definica indexer for per-account history) replaces it without
 * touching the UI.
 */
export interface ProtocolClient {
  readonly mode: "preview" | "onchain";
  /** Called when data changes outside a transaction (a harvest, a preview control). */
  subscribe(listener: () => void): () => void;
  /** The clock the data was read at; durations and countdowns are measured against it. */
  now(): number;

  getAppStatus(): Promise<AppStatus>;
  getPhases(): Promise<PhaseInfo[]>;
  getVault(): Promise<VaultInfo>;
  getLiquidity(): Promise<LiquidityInfo>;
  getMarkets(): Promise<Market[]>;

  getEligibility(address: Address): Promise<Eligibility>;
  acceptTerms(address: Address, version: string): Promise<void>;
  getBalances(address: Address): Promise<Balances>;
  getPosition(address: Address): Promise<Position | null>;
  getExitRequests(address: Address): Promise<ExitRequest[]>;
  getLocks(address: Address): Promise<LockPosition[]>;
  getLiquidityPosition(address: Address): Promise<LiquidityPosition>;
  getBorrowPositions(address: Address): Promise<BorrowPosition[]>;
  getLendPosition(address: Address): Promise<LendPosition | null>;
  getActivity(address: Address): Promise<ActivityItem[]>;

  /** What an action would do. `address` is null when no wallet is connected (a read-only preview). */
  preview(address: Address | null, action: Action): Promise<ActionPreview>;
  /** Sends the action's transactions, reporting each step; rejects with a `ProtocolError`. */
  execute(address: Address, action: Action, onProgress: OnTxProgress): Promise<TxReceipt>;
}

/* ---------- rules of the design ---------- */

/** Share-lock bounds of Phase 1 (7–365 days, up to 10 positions). */
export const LOCK_MIN_DAYS = 7;
export const LOCK_MAX_DAYS = 365;
export const LOCK_MAX_POSITIONS = 10;

/** Of the lending interest attributable to a participant, the share allocated to them. */
export const PARTICIPANT_SHARE = 0.75;

/** Health factor below which reviews ask for an explicit tick, and the zone limits. */
export const HEALTH_CAUTION = 1.5;
export const HEALTH_RISK = 1.15;

/** The units an asset is counted in, for labels. */
export const ASSET_UNIT: Record<Asset, string> = {
  ETH: "ETH",
  osETH: "osETH",
  aEthosETH: "aEthosETH",
  WETH: "WETH",
  shares: "shares",
};
