/*
 * Domain model of the Definica app. Everything the screens render comes through these types, so
 * the preview client (mock/) and an onchain client are interchangeable. Amounts are plain numbers
 * in whole units (ETH, osETH, shares…); an onchain client converts from and to wei at its edge.
 */

export type Address = `0x${string}`;
export type Hash = `0x${string}`;

export type PhaseId = 1 | 2 | 3;

/** "active": open for new positions. "paused": stopped by an emergency control. "inactive": not activated. */
export type PhaseStatus = "active" | "paused" | "inactive";

export type Asset = "ETH" | "osETH" | "aEthosETH" | "WETH" | "shares";

export interface AssetAmount {
  asset: Asset;
  amount: number;
}

export interface ContractInfo {
  name: string;
  role: string;
  /** `null` until Definica publishes the verified address. */
  address: Address | null;
}

export interface PhaseInfo {
  id: PhaseId;
  name: string;
  /** One word for tabs and pills: Staking, Liquidity, Borrowing. */
  short: string;
  status: PhaseStatus;
  summary: string;
  /** What you need before you can take part. */
  requirements: string[];
  contracts: ContractInfo[];
  /** The phase's page in the documentation. */
  docsPath: string;
}

export type BannerLevel = "info" | "warning" | "critical";

/** App-wide state read before anything else: incidents and whether this interface is still safe. */
export interface AppStatus {
  incident: { level: BannerLevel; title: string; text: string } | null;
  /** A remote switch that tells everyone on this build to stop and reload. */
  unsafeVersion: boolean;
  /** Seconds since the data was read from the chain, and whether that is too old to act on. */
  dataAgeSeconds: number;
  stale: boolean;
  blockNumber: number;
}

/* ---------- account ---------- */

/**
 * "ok": everything is open. "region": new positions are blocked where the app is restricted, but
 * exits, claims and repayments stay open. "blocked": the address failed screening; nothing is open.
 */
export type EligibilityStatus = "ok" | "region" | "blocked";

export interface Eligibility {
  status: EligibilityStatus;
  /** The current version of the Terms, and the one this address last accepted. */
  termsVersion: string;
  acceptedTermsVersion: string | null;
}

export interface Balances {
  ETH: number;
  osETH: number;
  aEthosETH: number;
  WETH: number;
}

/* ---------- Phase 1: pooled staking ---------- */

export interface VaultInfo {
  name: string;
  network: "Ethereum";
  operator: string;
  capacityEth: number;
  totalAssetsEth: number;
  totalShares: number;
  /** ETH backing one Vault share. */
  sharePriceEth: number;
  /** Change of the share price over the last 30 days, in percent. */
  sharePriceChange30dPct: number;
  /** Fees taken from rewards, in basis points. */
  feeBps: { vault: number; definica: number };
  minDepositEth: number;
  /** `Keeper.isCollateralized(vault)`: deposits open once the Vault has registered validators. */
  activated: boolean;
  lastHarvestAt: number;
  nextHarvestAt: number;
  /** ETH the Vault can pay out now without waiting for validator exits. */
  withdrawableEth: number;
  /** The current wait for exits that need validators to leave; `null` when it cannot be estimated. */
  exitWait: { avgDays: number; maxDays: number } | null;
  contracts: ContractInfo[];
}

export interface PositionPoint {
  t: number;
  valueEth: number;
  /** Rewards earned up to this point (value less what was deposited, plus what was claimed). */
  earnedEth?: number;
}

export type ReturnId =
  | "staking"
  | "treasury"
  | "penalties"
  | "osethExposure"
  | "aaveSupply"
  | "incentives"
  | "lendingIncome"
  | "fundingCost";

/** One source of return, always reported on its own line and never blended with the others. */
export interface ReturnLine {
  id: ReturnId;
  label: string;
  phase: PhaseId;
  /** Signed: penalties and funding costs are negative. */
  amount: number;
  asset: Asset;
  note: string;
}

export interface Position {
  depositedEth: number;
  shares: number;
  valueEth: number;
  /** Lifetime rewards after fees (staking performance plus treasury contributions, less penalties). */
  rewardsEth: number;
  lockedShares: number;
  exitingShares: number;
  /** Shares that are neither locked nor in an exit request. */
  availableShares: number;
  history: PositionPoint[];
  returns: ReturnLine[];
}

export type ExitRoute = "core" | "vault";

/**
 * "queued": waiting in the exit queue. "exiting": waiting for validators to leave. "partial": part
 * of the request is claimable. "claimable": all of it is. "claimed": paid out.
 */
export type ExitStatus = "queued" | "exiting" | "partial" | "claimable" | "claimed";

export interface ExitRequest {
  id: string;
  shares: number;
  ethEstimate: number;
  route: ExitRoute;
  requestedAt: number;
  status: ExitStatus;
  /** ETH claimable now (all of it once claimable, a part when partial). */
  claimableEth: number;
  /** When the request is expected to be claimable; `null` when it cannot be estimated. */
  expectedAt: number | null;
  claimedEth: number | null;
  claimedAt: number | null;
  /** The Vault's position ticket, for claiming without the app. */
  ticket: string;
}

export type LockStatus = "active" | "matured" | "released";

export interface LockPosition {
  id: string;
  shares: number;
  days: number;
  startedAt: number;
  maturesAt: number;
  status: LockStatus;
  releasedAt: number | null;
}

/* ---------- Phase 2: Main Liquidity Module ---------- */

export type ReserveStatus = "active" | "frozen" | "paused";

/** Aave V3's osETH reserve, read before any supply. */
export interface AaveReserve {
  status: ReserveStatus;
  supplyCap: number;
  totalSupplied: number;
  /** Variable supply rate, in percent a year. */
  supplyRatePct: number;
  /** osETH that is not borrowed out, so it can be withdrawn now. */
  unborrowed: number;
}

/** The terms of a funding loan, read from Aave and the Module before you authorise one. */
export interface FinancingTerms {
  available: boolean;
  asset: "WETH";
  emode: string;
  maxLtvPct: number;
  liquidationThresholdPct: number;
  /** Variable borrow rate, in percent a year. */
  borrowRatePct: number;
  borrowCap: number;
  totalBorrowed: number;
}

export interface IncentiveProgramme {
  name: string;
  asset: string;
  budget: number;
  endsAt: number;
  eligibility: string;
  allocation: string;
}

export interface ModuleRules {
  /** The fixed commitment durations, in days. */
  durations: number[];
  minCommit: number;
  maxCommit: number;
  capacity: number;
  committed: number;
  earlyRelease: boolean;
  acceptedReceipts: string;
  withdrawal: string;
  incentive: IncentiveProgramme | null;
}

export interface LiquidityInfo {
  reserve: AaveReserve;
  rules: ModuleRules;
  financing: FinancingTerms;
  /** ETH value of one osETH (osETH accrues staking rewards, so it trades above 1). */
  osethRateEth: number;
  contracts: ContractInfo[];
}

export type CommitmentStatus = "active" | "matured" | "released";

export interface FundingLoan {
  /** The debt allocated to this commitment, in WETH, with accrued interest. */
  debt: number;
  borrowedAt: number;
  healthFactor: number;
}

export interface Commitment {
  id: string;
  amount: number;
  source: "osETH" | "aEthosETH";
  days: number;
  startedAt: number;
  maturesAt: number;
  status: CommitmentStatus;
  financing: FundingLoan | null;
  releasedAt: number | null;
  /** Released, but the aEthosETH stays with the Module until the funding loan is repaid. */
  heldForRepayment: boolean;
}

/** A debt the position carries, listed apart from its returns. */
export interface Obligation {
  id: string;
  label: string;
  asset: Asset;
  amount: number;
  /** Where it is owed and how it is settled. */
  settledAt: string;
  accruing: boolean;
}

export interface LiquidityPosition {
  locked: number;
  /** ETH value of the locked aEthosETH (at the osETH rate). */
  lockedValueEth: number;
  commitments: Commitment[];
  returns: ReturnLine[];
  obligations: Obligation[];
  /** The locked position's ETH value over time. */
  history: PositionPoint[];
}

/* ---------- Phase 3: borrowing markets ---------- */

export type MarketId = "oseth" | "aethoseth" | "eth";
export type MarketStatus = "active" | "frozen" | "paused";

export interface RateModel {
  basePct: number;
  slope1Pct: number;
  slope2Pct: number;
  kinkPct: number;
}

export interface MarketParams {
  borrowAsset: Asset;
  maxLtvPct: number;
  liquidationThresholdPct: number;
  liquidationPenaltyPct: number;
  oracle: string;
  oracleFormula: string;
  rateModel: RateModel;
  supplyCap: number;
  borrowCap: number;
  liquidation: string;
  emergency: string;
}

export interface Market {
  id: MarketId;
  /** "collateral": borrow ETH against it. "supply": lend ETH to the markets. */
  kind: "collateral" | "supply";
  asset: Asset;
  name: string;
  role: string;
  status: MarketStatus;
  /** What the asset can be used for here, in plain words. */
  uses: string[];
  params: MarketParams;
  totalSupplied: number;
  totalBorrowed: number;
  utilisationPct: number;
  /** ETH available to borrow or withdraw. */
  liquidity: number;
  borrowRatePct: number;
  supplyRatePct: number;
  /** ETH value of one unit of the asset. */
  priceEth: number;
  badDebt: number;
  contracts: ContractInfo[];
}

export type HealthZone = "safe" | "caution" | "risk" | "liquidatable";

export interface BorrowPosition {
  marketId: MarketId;
  collateral: number;
  collateralValueEth: number;
  /** ETH owed, with accrued interest. */
  debt: number;
  /** `null` while there is no debt. */
  healthFactor: number | null;
  ltvPct: number;
  /** ETH that can still be borrowed at the market's max LTV. */
  borrowable: number;
  /** The collateral price, in ETH, at which liquidation starts; `null` without debt. */
  liquidationPriceEth: number | null;
}

export interface LendPosition {
  supplied: number;
  /** The 75% of attributable lending interest allocated to you, so far. */
  income: number;
  withdrawableNow: number;
}

/* ---------- activity ---------- */

export type ActivityKind =
  | "deposit"
  | "exit-request"
  | "exit-claim"
  | "lock"
  | "lock-release"
  | "reward"
  | "treasury"
  | "commit"
  | "commit-release"
  | "funding-borrow"
  | "funding-repay"
  | "aave-withdraw"
  | "collateral-supply"
  | "collateral-withdraw"
  | "borrow"
  | "repay"
  | "eth-supply"
  | "eth-withdraw"
  | "liquidation";

export type ActivityStatus = "confirmed" | "pending" | "failed";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  phase: PhaseId;
  at: number;
  amount: number | null;
  asset: Asset | null;
  /** "in": adds to the position or wallet. "out": leaves it. "none": moves nothing (a lock). */
  direction: "in" | "out" | "none";
  status: ActivityStatus;
  hash: Hash | null;
  note: string | null;
  /** The block it landed in, and the network fee paid; null for entries that aren't transactions (rewards). */
  block: number | null;
  feeEth: number | null;
}

export interface TxReceipt {
  hash: Hash;
  /** Every transaction the action sent, in order (an approval, then the action). */
  hashes: Hash[];
  at: number;
}
