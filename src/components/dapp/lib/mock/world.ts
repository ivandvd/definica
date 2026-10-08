import { FEATURES } from "../features";
import type {
  ActivityItem,
  ActivityKind,
  Address,
  Asset,
  Balances,
  EligibilityStatus,
  ExitRoute,
  Hash,
  PhaseId,
  PhaseStatus,
  ReserveStatus,
} from "../types";

/*
 * The preview's simulated chain: one serialisable world holding the Vault, the Module, the
 * borrowing pool and every preview account. It persists in localStorage, so a stake survives a
 * reload, and its clock can be moved forward so queued exits, locks, commitments and loans move
 * through every state they have. Sample figures only: nothing here is a published parameter.
 */

export const DAY = 86_400_000;
export const HOUR = 3_600_000;

/** StakeWise Oracles update the Vault every 12 hours; rewards apply at these harvests. */
export const HARVEST_INTERVAL = 12 * HOUR;
/** Sample growth of the share price per harvest (about 2.8% a year). */
const SHARE_PRICE_GROWTH = 0.028 / 730;
/** Exits paid from available liquidity become claimable a day after the next harvest. */
export const CLAIM_DELAY = DAY;

/** How each harvest's reward splits into the reported lines (sample proportions). */
const REWARD_SPLIT = { staking: 0.93, treasury: 0.08, penalties: -0.01 };

/* ---------- preview controls ---------- */

export interface SimSettings {
  /** Whether the next transaction reverts onchain; it goes back to "succeed" once used. */
  nextTx: "succeed" | "revert";
  phases: Record<PhaseId, PhaseStatus>;
  vault: "open" | "nearlyFull" | "full" | "notActivated";
  reserve: ReserveStatus;
  financing: boolean;
  incident: boolean;
  stale: boolean;
  restriction: EligibilityStatus;
}

export const DEFAULT_SIM: SimSettings = {
  nextTx: "succeed",
  phases: { 1: "active", 2: "active", 3: "active" },
  vault: "open",
  reserve: "active",
  financing: true,
  incident: false,
  stale: false,
  restriction: "ok",
};

/* ---------- state ---------- */

export interface PricePoint {
  t: number;
  price: number;
}

export interface VaultState {
  totalShares: number;
  sharePriceEth: number;
  lastHarvestAt: number;
  withdrawableEth: number;
  prices: PricePoint[];
}

export interface ModuleState {
  committed: number;
  osethRateEth: number;
  rates: PricePoint[];
  reserveSupplied: number;
  reserveUnborrowed: number;
  financingBorrowed: number;
}

export type CollateralMarket = "oseth" | "aethoseth";

export interface PoolState {
  /** ETH supplied by lenders and by funding loans. */
  supplied: number;
  borrowed: Record<CollateralMarket, number>;
  collateral: Record<CollateralMarket, number>;
}

export interface ExitState {
  id: string;
  shares: number;
  ethEstimate: number;
  route: ExitRoute;
  requestedAt: number;
  /** When each part of the request becomes claimable. */
  schedule: { at: number; eth: number }[];
  claimedEth: number;
  claimedAt: number | null;
  ticket: string;
}

export interface LockState {
  id: string;
  shares: number;
  days: number;
  startedAt: number;
  maturesAt: number;
  releasedAt: number | null;
}

export interface CommitmentState {
  id: string;
  amount: number;
  source: "osETH" | "aEthosETH";
  days: number;
  startedAt: number;
  maturesAt: number;
  releasedAt: number | null;
  /** WETH owed on the funding loan, with accrued interest. */
  debt: number;
  borrowedAt: number | null;
  /** Funding-loan WETH supplied to the Phase 3 markets for this commitment. */
  lent: number;
}

export interface AccountState {
  label: string;
  balances: Balances;
  termsAccepted: string | null;
  depositedEth: number;
  claimedEth: number;
  shares: number;
  /** The account's Vault shares after each change, for the value chart. */
  shareEvents: { t: number; shares: number }[];
  returns1: { staking: number; treasury: number; penalties: number };
  exits: ExitState[];
  locks: LockState[];
  commitments: CommitmentState[];
  returns2: { osethExposure: number; aaveSupply: number; incentives: number; lendingIncome: number; fundingCost: number };
  /** Locked aEthosETH after each change, for the Module chart. */
  lockedEvents: { t: number; locked: number }[];
  borrow: Record<CollateralMarket, { collateral: number; debt: number }>;
  lend: { supplied: number; income: number };
  activity: ActivityItem[];
}

export interface World {
  version: 4;
  clockOffset: number;
  txCount: number;
  idCount: number;
  vault: VaultState;
  module: ModuleState;
  pool: PoolState;
  accounts: Record<string, AccountState>;
  sim: SimSettings;
}

/* ---------- sample constants ---------- */

export const VAULT_CAPACITY = 12_000;
export const MIN_DEPOSIT = 0.01;
export const FEE_BPS = { vault: 500, definica: 500 };

export const MODULE_RULES = {
  durations: [30, 90, 180, 365],
  minCommit: 0.05,
  maxCommit: 500,
  capacity: 5_000,
  earlyRelease: false,
};

export const RESERVE = { supplyCap: 50_000, supplyRatePct: 0.04 };
export const FINANCING = { emode: "ETH correlated", maxLtvPct: 93, liquidationThresholdPct: 95, borrowCap: 2_500_000, totalBorrowed: 2_180_000 };

export interface RateModelSample {
  basePct: number;
  slope1Pct: number;
  slope2Pct: number;
  kinkPct: number;
}

export const POOL_RATE_MODEL: RateModelSample = { basePct: 0, slope1Pct: 3.5, slope2Pct: 60, kinkPct: 90 };

export const MARKET_RULES: Record<CollateralMarket, { maxLtvPct: number; liquidationThresholdPct: number; penaltyPct: number; supplyCap: number; borrowCap: number }> = {
  oseth: { maxLtvPct: 86, liquidationThresholdPct: 90, penaltyPct: 4, supplyCap: 5_000, borrowCap: 3_000 },
  aethoseth: { maxLtvPct: 80, liquidationThresholdPct: 85, penaltyPct: 5, supplyCap: 1_500, borrowCap: 800 },
};

export const ETH_SUPPLY_CAP = 10_000;

/** The pool's variable borrow rate at a utilisation (kinked model), in percent a year. */
export function borrowRateAt(utilisationPct: number, model: RateModelSample = POOL_RATE_MODEL) {
  const u = Math.max(0, Math.min(utilisationPct, 100));
  if (u <= model.kinkPct) return model.basePct + (model.slope1Pct * u) / model.kinkPct;
  return model.basePct + model.slope1Pct + (model.slope2Pct * (u - model.kinkPct)) / (100 - model.kinkPct);
}

export const poolBorrowed = (pool: PoolState) => pool.borrowed.oseth + pool.borrowed.aethoseth;
export const poolUtilisation = (pool: PoolState) => (pool.supplied > 0 ? (poolBorrowed(pool) / pool.supplied) * 100 : 0);
/** Gross supply rate: the borrow rate times utilisation. */
export const poolSupplyRate = (pool: PoolState) => (borrowRateAt(poolUtilisation(pool)) * poolUtilisation(pool)) / 100;

/* ---------- ids and hashes ---------- */

export function nextId(world: World, prefix: string) {
  world.idCount += 1;
  return `${prefix}-${world.idCount}`;
}

export function nextHash(world: World): Hash {
  world.txCount += 1;
  const hex = (world.txCount * 7_919_937 + 0xdef1ca).toString(16);
  return `0x${hex.padStart(8, "0").repeat(8).slice(0, 64)}`;
}

const seedHash = (n: number): Hash => `0x${(n * 2_654_435_761).toString(16).padStart(8, "0").repeat(8).slice(0, 64)}`;

/* ---------- activity ---------- */

const KIND_PHASE: Record<ActivityKind, PhaseId> = {
  deposit: 1,
  "exit-request": 1,
  "exit-claim": 1,
  lock: 1,
  "lock-release": 1,
  reward: 1,
  treasury: 1,
  commit: 2,
  "commit-release": 2,
  "funding-borrow": 2,
  "funding-repay": 2,
  "aave-withdraw": 2,
  "collateral-supply": 3,
  "collateral-withdraw": 3,
  borrow: 3,
  repay: 3,
  "eth-supply": 3,
  "eth-withdraw": 3,
  liquidation: 3,
};

const KIND_DIRECTION: Record<ActivityKind, ActivityItem["direction"]> = {
  deposit: "in",
  "exit-request": "none",
  "exit-claim": "out",
  lock: "none",
  "lock-release": "none",
  reward: "in",
  treasury: "in",
  commit: "in",
  "commit-release": "out",
  "funding-borrow": "none",
  "funding-repay": "none",
  "aave-withdraw": "none",
  "collateral-supply": "in",
  "collateral-withdraw": "out",
  borrow: "none",
  repay: "none",
  "eth-supply": "in",
  "eth-withdraw": "out",
  liquidation: "out",
};

/** The sample block at a moment: one every 12 seconds, around Ethereum's height in October 2026. */
export const blockAt = (at: number) => Math.round(23_480_000 + (at - Date.UTC(2026, 9, 8)) / 12_000);

/** A sample network fee for one transaction (about 90k gas at 12 gwei). */
export const SAMPLE_FEE = 0.0011;

export function record(
  world: World,
  account: AccountState,
  kind: ActivityKind,
  at: number,
  amount: number | null,
  asset: Asset | null,
  note: string | null,
  hash: Hash | null,
) {
  account.activity.push({
    id: nextId(world, "act"),
    kind,
    phase: KIND_PHASE[kind],
    at,
    amount,
    asset,
    direction: KIND_DIRECTION[kind],
    status: "confirmed",
    hash,
    note,
    block: hash ? blockAt(at) : null,
    feeEth: hash ? SAMPLE_FEE : null,
  });
}

/* ---------- the clock: harvests and accrual ---------- */

export const worldNow = (world: World) => Date.now() + world.clockOffset;

/**
 * Applies every harvest due up to `now`: the share price and the osETH rate rise, Aave interest
 * grows aEthosETH, loans accrue interest and lenders earn. Returns the harvests applied.
 */
export function catchUp(world: World, now: number) {
  const { vault, module, pool } = world;
  let harvests = 0;
  const gained = new Map<string, number>();

  while (vault.lastHarvestAt + HARVEST_INTERVAL <= now && harvests < 730) {
    const at = vault.lastHarvestAt + HARVEST_INTERVAL;
    const oldPrice = vault.sharePriceEth;
    vault.sharePriceEth = oldPrice * (1 + SHARE_PRICE_GROWTH);
    vault.lastHarvestAt = at;
    vault.prices.push({ t: at, price: vault.sharePriceEth });
    // Exits and new deposits keep some ETH unstaked; validator exits top it up.
    vault.withdrawableEth = Math.min(vault.withdrawableEth + 4.5, 420);

    const oldRate = module.osethRateEth;
    module.osethRateEth = oldRate * (1 + SHARE_PRICE_GROWTH);
    module.rates.push({ t: at, price: module.osethRateEth });

    const borrowRate = borrowRateAt(poolUtilisation(pool)) / 100;
    const supplyRate = poolSupplyRate(pool) / 100;
    const aaveSupply = RESERVE.supplyRatePct / 100 / 730;
    const fundingRate = 2.4 / 100 / 730;

    for (const [address, account] of Object.entries(world.accounts)) {
      // Phase 1: every share, locked or exiting, earns at the harvest.
      const delta = account.shares * oldPrice * SHARE_PRICE_GROWTH;
      if (delta > 0) {
        account.returns1.staking += delta * REWARD_SPLIT.staking;
        account.returns1.treasury += delta * REWARD_SPLIT.treasury;
        account.returns1.penalties += delta * REWARD_SPLIT.penalties;
        gained.set(address, (gained.get(address) ?? 0) + delta);
      }

      // Phase 2: committed aEthosETH grows with Aave supply interest and tracks the osETH rate.
      let locked = 0;
      for (const commitment of account.commitments) {
        if (commitment.releasedAt !== null && commitment.debt === 0) continue;
        const interest = commitment.amount * aaveSupply;
        commitment.amount += interest;
        account.returns2.aaveSupply += interest * oldRate;
        account.returns2.osethExposure += commitment.amount * oldRate * SHARE_PRICE_GROWTH;
        if (commitment.days >= 90) account.returns2.incentives += commitment.amount * (0.5 / 100 / 730);
        if (commitment.debt > 0) {
          const cost = commitment.debt * fundingRate;
          commitment.debt += cost;
          account.returns2.fundingCost -= cost;
          account.returns2.lendingIncome += commitment.lent * supplyRate * 0.75 / 730;
        }
        if (commitment.releasedAt === null) locked += commitment.amount;
      }
      if (account.commitments.length) account.lockedEvents.push({ t: at, locked });
      account.balances.aEthosETH += account.balances.aEthosETH * aaveSupply;

      // Phase 3: debts accrue; lenders earn their 75%.
      for (const market of ["oseth", "aethoseth"] as const) {
        const position = account.borrow[market];
        if (position.debt > 0) position.debt += position.debt * (borrowRate / 730);
      }
      if (account.lend.supplied > 0) account.lend.income += account.lend.supplied * supplyRate * 0.75 / 730;
    }

    pool.borrowed.oseth *= 1 + borrowRate / 730;
    pool.borrowed.aethoseth *= 1 + borrowRate / 730;
    harvests += 1;
  }

  if (harvests > 0) {
    for (const [address, eth] of gained) {
      const account = world.accounts[address];
      record(world, account, "reward", vault.lastHarvestAt, eth, "ETH", harvests === 1 ? "Vault harvest" : `${harvests} Vault harvests`, null);
    }
  }
  return harvests;
}

/* ---------- seed ---------- */

const emptyAccount = (label: string, balances: Partial<Balances>): AccountState => ({
  label,
  balances: { ETH: 0, osETH: 0, aEthosETH: 0, WETH: 0, ...balances },
  termsAccepted: null,
  depositedEth: 0,
  claimedEth: 0,
  shares: 0,
  shareEvents: [],
  returns1: { staking: 0, treasury: 0, penalties: 0 },
  exits: [],
  locks: [],
  commitments: [],
  returns2: { osethExposure: 0, aaveSupply: 0, incentives: 0, lendingIncome: 0, fundingCost: 0 },
  lockedEvents: [],
  borrow: { oseth: { collateral: 0, debt: 0 }, aethoseth: { collateral: 0, debt: 0 } },
  lend: { supplied: 0, income: 0 },
  activity: [],
});

export const PREVIEW_ADDRESSES = {
  full: "0xDEF1Ca5E0000000000000000000000000000c0DE" as Address,
  fresh: "0xE3f0000000000000000000000000000000000001" as Address,
  locked: "0x10C4ED000000000000000000000000000000A11C" as Address,
  atRisk: "0xBA5E000000000000000000000000000000001234" as Address,
};

/** The share price `harvestsAgo` harvests before the current one. */
const priceAgo = (world: World, harvestsAgo: number) => {
  const prices = world.vault.prices;
  return prices[Math.max(0, prices.length - 1 - harvestsAgo)].price;
};

const harvestsIn = (ms: number) => Math.floor(ms / HARVEST_INTERVAL);

/** A fresh world: 120 days of Vault history and three accounts with different stories. */
export function seedWorld(now: number): World {
  const lastHarvestAt = now - (now % HARVEST_INTERVAL);
  const sharePriceEth = 1.0072;
  const prices: PricePoint[] = [];
  const rates: PricePoint[] = [];
  for (let k = 240; k >= 0; k--) {
    const t = lastHarvestAt - k * HARVEST_INTERVAL;
    prices.push({ t, price: sharePriceEth / (1 + SHARE_PRICE_GROWTH) ** k });
    rates.push({ t, price: 1.0428 / (1 + SHARE_PRICE_GROWTH) ** k });
  }

  const world: World = {
    version: 4,
    clockOffset: 0,
    txCount: 0,
    idCount: 0,
    vault: { totalShares: 4_281.93, sharePriceEth, lastHarvestAt, withdrawableEth: 182.4, prices },
    module: { committed: 1_842.6, osethRateEth: 1.0428, rates, reserveSupplied: 41_250, reserveUnborrowed: 39_800, financingBorrowed: 612.4 },
    pool: { supplied: 2_140, borrowed: { oseth: 1_236.5, aethoseth: 318.2 }, collateral: { oseth: 1_688.2, aethoseth: 401.6 } },
    accounts: {},
    sim: { ...DEFAULT_SIM, phases: { ...DEFAULT_SIM.phases } },
  };

  world.accounts[PREVIEW_ADDRESSES.full] = seedFullAccount(world, now);
  world.accounts[PREVIEW_ADDRESSES.fresh] = emptyAccount("New account", { ETH: 1.25 });
  world.accounts[PREVIEW_ADDRESSES.locked] = seedLockedAccount(world, now);
  if (FEATURES.borrowing) world.accounts[PREVIEW_ADDRESSES.atRisk] = seedAtRiskAccount(world, now);
  return world;
}

/** The preview account: a position in every phase, with something waiting in each. */
function seedFullAccount(world: World, now: number): AccountState {
  const account = emptyAccount("Main account", FEATURES.liquidity ? { ETH: 3.4821, osETH: 1.2, aEthosETH: 0.8 } : { ETH: 3.4821 });
  let n = 1;
  const at = (daysAgo: number, hours = 0) => now - daysAgo * DAY - hours * HOUR;
  const add = (kind: ActivityKind, time: number, amount: number | null, asset: Asset | null, note: string | null) =>
    record(world, account, kind, time, amount, asset, note, seedHash(n++ * 7_919));

  // Deposits at the share price of their day.
  for (const [daysAgo, eth] of [
    [92, 5],
    [61, 2],
    [20, 1],
  ] as const) {
    const time = at(daysAgo, 3);
    const shares = eth / priceAgo(world, harvestsIn(now - time));
    account.depositedEth += eth;
    account.shares += shares;
    account.shareEvents.push({ t: time, shares: account.shares });
    add("deposit", time, eth, "ETH", null);
  }
  const rewards = account.shares * world.vault.sharePriceEth - account.depositedEth;
  account.returns1 = { staking: rewards * REWARD_SPLIT.staking, treasury: rewards * REWARD_SPLIT.treasury, penalties: rewards * REWARD_SPLIT.penalties };
  add("reward", at(30, 1), rewards * 0.42, "ETH", "60 Vault harvests");
  add("treasury", at(16, 4), rewards * 0.08, "ETH", "Treasury contribution to the Vault");
  add("reward", at(1, 2), rewards * 0.5, "ETH", "58 Vault harvests");

  // Two share locks: one matured and waiting to be released, one running.
  account.locks.push(
    { id: nextId(world, "lock"), shares: 1, days: 30, startedAt: at(38), maturesAt: at(8), releasedAt: null },
    { id: nextId(world, "lock"), shares: 2, days: 90, startedAt: at(31), maturesAt: at(31) + 90 * DAY, releasedAt: null },
  );
  add("lock", at(38), 1, "shares", "30-day share lock");
  add("lock", at(31), 2, "shares", "90-day share lock");

  // Two exits: one claimable, one partly claimable with the rest waiting on validator exits.
  const price = world.vault.sharePriceEth;
  account.exits.push(
    {
      id: nextId(world, "exit"),
      shares: 0.25,
      ethEstimate: 0.25 * price,
      route: "core",
      requestedAt: at(9),
      schedule: [{ at: at(7), eth: 0.25 * price }],
      claimedEth: 0,
      claimedAt: null,
      ticket: "184 220 517",
    },
    {
      id: nextId(world, "exit"),
      shares: 0.5,
      ethEstimate: 0.5 * price,
      route: "core",
      requestedAt: at(2),
      schedule: [
        { at: at(1), eth: 0.2 },
        { at: now + 5 * DAY, eth: 0.5 * price - 0.2 },
      ],
      claimedEth: 0,
      claimedAt: null,
      ticket: "191 006 342",
    },
  );
  add("exit-request", at(9), 0.25 * price, "ETH", "0.25 shares · through Definica");
  add("exit-request", at(2), 0.5 * price, "ETH", "0.50 shares · through Definica");

  if (FEATURES.liquidity) seedLiquidity(world, account, now, add);
  if (FEATURES.borrowing) seedBorrowing(account, now, add);

  account.termsAccepted = null;
  return account;
}

type Add = (kind: ActivityKind, time: number, amount: number | null, asset: Asset | null, note: string | null) => void;

/** Phase 2 for the preview account: a financed 90-day commitment and a 30-day one that has matured. */
function seedLiquidity(world: World, account: AccountState, now: number, add: Add) {
  const at = (daysAgo: number) => now - daysAgo * DAY;
  const rate = world.module.osethRateEth;
  account.commitments.push(
    {
      id: nextId(world, "commit"),
      amount: 0.5,
      source: "osETH",
      days: 90,
      startedAt: at(45),
      maturesAt: at(45) + 90 * DAY,
      releasedAt: null,
      debt: 0.2512,
      borrowedAt: at(45),
      lent: 0.25,
    },
    { id: nextId(world, "commit"), amount: 0.3, source: "aEthosETH", days: 30, startedAt: at(40), maturesAt: at(10), releasedAt: null, debt: 0, borrowedAt: null, lent: 0 },
  );
  account.lockedEvents.push({ t: at(45), locked: 0.5 }, { t: at(40), locked: 0.8 }, { t: now, locked: 0.8 });
  account.returns2 = { osethExposure: 0.8 * rate * 0.0034, aaveSupply: 0.000021, incentives: 0.00031, lendingIncome: 0.00052, fundingCost: -0.00074 };
  add("commit", at(45), 0.5, "aEthosETH", "osETH supplied to Aave V3 · 90 days");
  add("funding-borrow", at(45), 0.25, "WETH", "Funding loan supplied to the borrowing markets");
  add("commit", at(40), 0.3, "aEthosETH", "aEthosETH receipt · 30 days");
}

/** Phase 3 for the preview account: osETH collateral with an ETH loan, and ETH lent to the markets. */
function seedBorrowing(account: AccountState, now: number, add: Add) {
  const at = (daysAgo: number) => now - daysAgo * DAY;
  account.borrow.oseth = { collateral: 1, debt: 0.4521 };
  account.lend = { supplied: 0.6, income: 0.00118 };
  add("collateral-supply", at(25), 1, "osETH", "osETH market");
  add("borrow", at(24), 0.45, "ETH", "osETH market");
  add("eth-supply", at(15), 0.6, "ETH", "ETH supply");
}

/** A long-term staker with all ten lock positions in use, two of them matured. */
function seedLockedAccount(world: World, now: number): AccountState {
  const account = emptyAccount("All locks in use", { ETH: 0.86 });
  let n = 600;
  const at = (daysAgo: number) => now - daysAgo * DAY;
  const add = (kind: ActivityKind, time: number, amount: number | null, asset: Asset | null, note: string | null) =>
    record(world, account, kind, time, amount, asset, note, seedHash(n++ * 15_485));
  const time = at(200);
  const shares = 24 / priceAgo(world, harvestsIn(now - time));
  account.depositedEth = 24;
  account.shares = shares;
  account.shareEvents.push({ t: time, shares });
  add("deposit", time, 24, "ETH", null);
  const rewards = shares * world.vault.sharePriceEth - 24;
  account.returns1 = { staking: rewards * REWARD_SPLIT.staking, treasury: rewards * REWARD_SPLIT.treasury, penalties: rewards * REWARD_SPLIT.penalties };
  const plan: [number, number, number][] = [
    [190, 180, 2],
    [150, 120, 1.5],
    [120, 365, 3],
    [95, 90, 1],
    [80, 180, 2],
    [60, 90, 1.25],
    [45, 365, 4],
    [30, 30, 0.5],
    [20, 90, 2],
    [12, 180, 1],
  ];
  for (const [daysAgo, days, lockShares] of plan) {
    const startedAt = at(daysAgo);
    account.locks.push({ id: nextId(world, "lock"), shares: lockShares, days, startedAt, maturesAt: startedAt + days * DAY, releasedAt: null });
    add("lock", startedAt, lockShares, "shares", `${days}-day share lock`);
  }
  add("reward", at(3), rewards, "ETH", "Vault harvests");
  return account;
}

/** A borrower close to liquidation, with a past partial liquidation in the history. */
function seedAtRiskAccount(world: World, now: number): AccountState {
  const account = emptyAccount("Borrower at risk", { ETH: 0.42, osETH: 0.1 });
  account.borrow.oseth = { collateral: 1.88, debt: 1.672 };
  let n = 900;
  const add = (kind: ActivityKind, daysAgo: number, amount: number, asset: Asset, note: string) =>
    record(world, account, kind, now - daysAgo * DAY, amount, asset, note, seedHash(n++ * 104_729));
  add("collateral-supply", 40, 2, "osETH", "osETH market");
  add("borrow", 39, 1.6, "ETH", "osETH market");
  add("liquidation", 12, 0.12, "osETH", "Sold at 1.0311 ETH · health 0.98 at the time");
  return account;
}

/* ---------- persistence ---------- */

const STORAGE_KEY = "definica.app.preview.v4";

export function loadWorld(): World | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const world = JSON.parse(raw) as World;
    return world.version === 4 ? world : null;
  } catch {
    return null;
  }
}

export function saveWorld(world: World) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(world));
  } catch {
    // Storage can be full or unavailable (private mode); the preview simply starts fresh next time.
  }
}

export function clearWorld() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}
