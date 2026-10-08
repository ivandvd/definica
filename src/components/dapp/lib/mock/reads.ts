import { HEALTH_CAUTION } from "../protocol";
import type {
  ActivityItem,
  AppStatus,
  BorrowPosition,
  Commitment,
  ContractInfo,
  ExitRequest,
  ExitStatus,
  LendPosition,
  LiquidityInfo,
  LiquidityPosition,
  LockPosition,
  Market,
  MarketId,
  PhaseInfo,
  Position,
  PositionPoint,
  VaultInfo,
} from "../types";
import {
  blockAt,
  borrowRateAt,
  DAY,
  ETH_SUPPLY_CAP,
  FEE_BPS,
  FINANCING,
  HARVEST_INTERVAL,
  MARKET_RULES,
  MIN_DEPOSIT,
  MODULE_RULES,
  POOL_RATE_MODEL,
  poolBorrowed,
  poolSupplyRate,
  poolUtilisation,
  RESERVE,
  VAULT_CAPACITY,
  type AccountState,
  type CollateralMarket,
  type CommitmentState,
  type ExitState,
  type PricePoint,
  type World,
} from "./world";

/* Everything the screens read, derived from the preview world at a given moment. */

export const TERMS_VERSION = "2026-10";

const contract = (name: string, role: string): ContractInfo => ({ name, role, address: null });

const CORE_CONTRACTS: ContractInfo[] = [
  contract("DefinicaCore", "User ledger; holds the aggregate Vault shares"),
  contract("Staking Vault", "StakeWise Vault that pools ETH and funds validators"),
  contract("Keeper", "StakeWise contract for harvests and reward updates"),
];

const MODULE_CONTRACTS: ContractInfo[] = [
  contract("Main Liquidity Module", "Records custody, commitments and allocated debt"),
  contract("Aave V3 Pool", "Holds the osETH reserve and the funding loan"),
  contract("aEthosETH", "Aave's receipt for supplied osETH"),
];

const MARKET_CONTRACTS: ContractInfo[] = [
  contract("Borrowing markets", "Hold collateral, debt and ETH supply"),
  contract("Price oracle", "Prices collateral and debt"),
  contract("Market guardian", "Holds the emergency controls"),
];

export function readAppStatus(world: World): AppStatus {
  return {
    incident: world.sim.incident
      ? {
          level: "warning",
          title: "Exits are taking longer than usual",
          text: "Ethereum's validator exit queue is long, so exits that wait on validator exits may take longer than shown. Claims, releases and repayments are unaffected.",
        }
      : null,
    unsafeVersion: false,
    dataAgeSeconds: world.sim.stale ? 1_260 : 8,
    stale: world.sim.stale,
    blockNumber: blockAt(world.vault.lastHarvestAt),
  };
}

export function readPhases(world: World): PhaseInfo[] {
  const { phases } = world.sim;
  return [
    {
      id: 1,
      name: "Pooled ETH staking",
      short: "Staking",
      status: phases[1],
      summary: "Stake ETH through DefinicaCore into a dedicated StakeWise Vault and hold a proportional share, with optional share locks.",
      requirements: ["ETH on Ethereum, at least the minimum deposit", "A wallet you control"],
      contracts: CORE_CONTRACTS,
      docsPath: "/phase-1",
    },
    {
      id: 2,
      name: "Main Liquidity Module",
      short: "Liquidity",
      status: phases[2],
      summary: "Supply osETH to Aave V3, commit the aEthosETH position for a fixed duration and, if you choose, finance it.",
      requirements: ["osETH, or aEthosETH from Aave V3's osETH reserve", "Your explicit authorisation for any funding loan"],
      contracts: MODULE_CONTRACTS,
      docsPath: "/phase-2",
    },
    {
      id: 3,
      name: "Borrowing markets",
      short: "Borrowing",
      status: phases[3],
      summary: "Borrow ETH against approved ETH-correlated collateral, or lend ETH to the markets for 75% of the interest attributable to you.",
      requirements: ["osETH, or aEthosETH where a market approves it, to borrow", "ETH, to lend"],
      contracts: MARKET_CONTRACTS,
      docsPath: "/phase-3",
    },
  ];
}

const priceAt = (points: PricePoint[], t: number) => {
  let price = points[0]?.price ?? 1;
  for (const point of points) {
    if (point.t > t) break;
    price = point.price;
  }
  return price;
};

export function readVault(world: World, now: number): VaultInfo {
  const { vault, sim } = world;
  const assets = vault.totalShares * vault.sharePriceEth;
  const capacityLeft = sim.vault === "full" ? 0 : sim.vault === "nearlyFull" ? 1.2 : Math.max(0, VAULT_CAPACITY - assets);
  const monthAgo = priceAt(vault.prices, now - 30 * DAY);
  return {
    name: "Definica Vault",
    network: "Ethereum",
    operator: "Selected operator",
    capacityEth: VAULT_CAPACITY,
    totalAssetsEth: VAULT_CAPACITY - capacityLeft,
    totalShares: vault.totalShares,
    sharePriceEth: vault.sharePriceEth,
    sharePriceChange30dPct: ((vault.sharePriceEth - monthAgo) / monthAgo) * 100,
    feeBps: FEE_BPS,
    minDepositEth: MIN_DEPOSIT,
    activated: sim.vault !== "notActivated",
    lastHarvestAt: vault.lastHarvestAt,
    nextHarvestAt: vault.lastHarvestAt + HARVEST_INTERVAL,
    withdrawableEth: vault.withdrawableEth,
    exitWait: sim.incident ? { avgDays: 6, maxDays: 18 } : { avgDays: 3, maxDays: 9 },
    contracts: CORE_CONTRACTS,
  };
}

export function readLiquidity(world: World): LiquidityInfo {
  const { module, sim } = world;
  return {
    reserve: {
      status: sim.reserve,
      supplyCap: RESERVE.supplyCap,
      totalSupplied: module.reserveSupplied,
      supplyRatePct: RESERVE.supplyRatePct,
      unborrowed: module.reserveUnborrowed,
    },
    rules: {
      durations: MODULE_RULES.durations,
      minCommit: MODULE_RULES.minCommit,
      maxCommit: MODULE_RULES.maxCommit,
      capacity: MODULE_RULES.capacity,
      committed: module.committed,
      earlyRelease: MODULE_RULES.earlyRelease,
      acceptedReceipts: "aEthosETH from Aave V3 Ethereum's osETH reserve",
      withdrawal: "After maturity and release, once any allocated debt is repaid",
      incentive: {
        name: "Commitment programme",
        asset: "ETH",
        budget: 40,
        endsAt: world.vault.lastHarvestAt + 64 * DAY,
        eligibility: "Commitments of 90 days or more",
        allocation: "Pro rata to committed aEthosETH, weighted by duration",
      },
    },
    financing: {
      available: sim.financing,
      asset: "WETH",
      emode: FINANCING.emode,
      maxLtvPct: FINANCING.maxLtvPct,
      liquidationThresholdPct: FINANCING.liquidationThresholdPct,
      borrowRatePct: 2.4,
      borrowCap: FINANCING.borrowCap,
      totalBorrowed: FINANCING.totalBorrowed,
    },
    osethRateEth: module.osethRateEth,
    contracts: MODULE_CONTRACTS,
  };
}

const marketStatus = (world: World): Market["status"] => (world.sim.phases[3] === "paused" ? "paused" : "active");

export function readMarkets(world: World): Market[] {
  const { pool, module } = world;
  const utilisationPct = poolUtilisation(pool);
  const borrowRatePct = borrowRateAt(utilisationPct);
  const liquidity = Math.max(0, pool.supplied - poolBorrowed(pool));
  const status = marketStatus(world);
  const collateralMarket = (id: CollateralMarket): Market => {
    const rules = MARKET_RULES[id];
    const oseth = id === "oseth";
    return {
      id,
      kind: "collateral",
      asset: oseth ? "osETH" : "aEthosETH",
      name: oseth ? "osETH" : "aEthosETH",
      role: oseth ? "Primary collateral" : "Liquidity Module receipt, where approved",
      status,
      uses: oseth
        ? ["Collateral to borrow ETH", "Keeps earning staking rewards through the osETH rate", "Is not lent out to other borrowers"]
        : [
            "Collateral to borrow ETH, in this approved market",
            "Only aEthosETH in your wallet: committed aEthosETH cannot be posted",
            "Keeps earning Aave supply interest",
          ],
      params: {
        borrowAsset: "ETH",
        maxLtvPct: rules.maxLtvPct,
        liquidationThresholdPct: rules.liquidationThresholdPct,
        liquidationPenaltyPct: rules.penaltyPct,
        oracle: oseth ? "osETH/ETH exchange rate" : "osETH/ETH exchange rate × Aave index",
        oracleFormula: oseth ? "price = StakeWise osETH/ETH rate, growth capped per day" : "price = osETH/ETH rate × aEthosETH : osETH (1 : 1)",
        rateModel: POOL_RATE_MODEL,
        supplyCap: rules.supplyCap,
        borrowCap: rules.borrowCap,
        liquidation: `Anyone can repay part of an unhealthy position and receive its collateral at a ${rules.penaltyPct}% discount, up to half the debt per call.`,
        emergency: "The market guardian can pause supply and borrowing or lower caps. Repayments and collateral top-ups stay open.",
      },
      totalSupplied: pool.collateral[id],
      totalBorrowed: pool.borrowed[id],
      utilisationPct,
      liquidity,
      borrowRatePct,
      supplyRatePct: 0,
      priceEth: module.osethRateEth,
      badDebt: 0,
      contracts: MARKET_CONTRACTS,
    };
  };

  return [
    collateralMarket("oseth"),
    collateralMarket("aethoseth"),
    {
      id: "eth",
      kind: "supply",
      asset: "ETH",
      name: "ETH",
      role: "Direct lending supply",
      status,
      uses: ["Lent to borrowers in the osETH and aEthosETH markets", "75% of the interest attributable to you is allocated to you", "Withdrawals depend on unborrowed liquidity"],
      params: {
        borrowAsset: "ETH",
        maxLtvPct: 0,
        liquidationThresholdPct: 0,
        liquidationPenaltyPct: 0,
        oracle: "Not priced (ETH)",
        oracleFormula: "1 ETH = 1 ETH",
        rateModel: POOL_RATE_MODEL,
        supplyCap: ETH_SUPPLY_CAP,
        borrowCap: 0,
        liquidation: "Lenders are repaid from borrowers' debt; liquidations protect the supply.",
        emergency: "The market guardian can pause new supply. Withdrawals of unborrowed ETH stay open.",
      },
      totalSupplied: pool.supplied,
      totalBorrowed: poolBorrowed(pool),
      utilisationPct,
      liquidity,
      borrowRatePct,
      supplyRatePct: poolSupplyRate(pool),
      priceEth: 1,
      badDebt: 0,
      contracts: MARKET_CONTRACTS,
    },
  ];
}

/* ---------- account ---------- */

/** A step series of a value over time: one point per harvest and one either side of each change. */
function stepSeries(prices: PricePoint[], events: { t: number; amount: number }[], now: number): PositionPoint[] {
  if (!events.length) return [];
  const start = events[0].t - DAY;
  const points: PositionPoint[] = [];
  const amountAt = (t: number) => {
    let amount = 0;
    for (const event of events) {
      if (event.t > t) break;
      amount = event.amount;
    }
    return amount;
  };
  const times = new Set<number>();
  for (const point of prices) if (point.t >= start && point.t <= now) times.add(point.t);
  for (const event of events) {
    times.add(event.t - 1);
    times.add(event.t);
  }
  times.add(now);
  for (const t of [...times].sort((a, b) => a - b)) {
    if (t < start) continue;
    points.push({ t, valueEth: amountAt(t) * priceAt(prices, t) });
  }
  return points;
}

export function readPosition(world: World, account: AccountState, now: number): Position | null {
  const openExits = account.exits.filter((exit) => exit.claimedAt === null);
  if (account.shares <= 1e-9 && account.depositedEth === 0 && !openExits.length) return null;
  const price = world.vault.sharePriceEth;
  const lockedShares = account.locks.filter((lock) => lock.releasedAt === null).reduce((sum, lock) => sum + lock.shares, 0);
  const exitingShares = openExits.reduce((sum, exit) => sum + exitSharesLeft(exit), 0);
  const valueEth = account.shares * price;
  const { staking, treasury, penalties } = account.returns1;
  return {
    depositedEth: account.depositedEth,
    shares: account.shares,
    valueEth,
    rewardsEth: valueEth + account.claimedEth - account.depositedEth,
    lockedShares,
    exitingShares,
    availableShares: Math.max(0, account.shares - lockedShares - exitingShares),
    history: stepSeries(
      world.vault.prices,
      account.shareEvents.map((event) => ({ t: event.t, amount: event.shares })),
      now,
    ).map((point) => ({ ...point, earnedEth: point.valueEth - netInflow(account, point.t) })),
    returns: [
      { id: "staking", label: "Staking rewards", phase: 1, amount: staking, asset: "ETH", note: "Validator performance, net of the Vault and Definica fees" },
      { id: "treasury", label: "Treasury contributions", phase: 1, amount: treasury, asset: "ETH", note: "Discretionary contributions to the Vault, shared by every share" },
      { id: "penalties", label: "Penalties", phase: 1, amount: penalties, asset: "ETH", note: "Validator penalties, borne by every share" },
    ],
  };
}

/** ETH put into the position up to a moment: deposits, less claimed exits. */
function netInflow(account: AccountState, t: number) {
  let net = 0;
  for (const item of account.activity) {
    if (item.at > t || item.status !== "confirmed" || item.amount === null) continue;
    if (item.kind === "deposit") net += item.amount;
    if (item.kind === "exit-claim") net -= item.amount;
  }
  return net;
}

/** Shares still in an exit request (a partial claim burns its part). */
export const exitSharesLeft = (exit: ExitState) => (exit.ethEstimate > 0 ? exit.shares * (1 - exit.claimedEth / exit.ethEstimate) : 0);

export function readExit(exit: ExitState, now: number): ExitRequest {
  const processed = exit.schedule.filter((part) => part.at <= now).reduce((sum, part) => sum + part.eth, 0);
  const claimable = Math.max(0, processed - exit.claimedEth);
  const pending = exit.schedule.filter((part) => part.at > now);
  let status: ExitStatus;
  if (exit.claimedAt !== null) status = "claimed";
  else if (processed >= exit.ethEstimate - 1e-9) status = "claimable";
  else if (claimable > 1e-9) status = "partial";
  // A part due later than a day after the request waits on validator exits.
  else if (pending.some((part) => part.at - exit.requestedAt > 2 * DAY)) status = "exiting";
  else status = "queued";
  const last = exit.schedule[exit.schedule.length - 1];
  return {
    id: exit.id,
    shares: exit.shares,
    ethEstimate: exit.ethEstimate,
    route: exit.route,
    requestedAt: exit.requestedAt,
    status,
    claimableEth: status === "claimed" ? 0 : claimable,
    expectedAt: status === "claimed" ? null : (last?.at ?? null),
    claimedEth: exit.claimedEth > 0 ? exit.claimedEth : null,
    claimedAt: exit.claimedAt,
    ticket: exit.ticket,
  };
}

export const readExits = (account: AccountState, now: number) =>
  account.exits.map((exit) => readExit(exit, now)).sort((a, b) => b.requestedAt - a.requestedAt);

export function readLocks(account: AccountState, now: number): LockPosition[] {
  return account.locks
    .map((lock) => ({
      id: lock.id,
      shares: lock.shares,
      days: lock.days,
      startedAt: lock.startedAt,
      maturesAt: lock.maturesAt,
      releasedAt: lock.releasedAt,
      status: lock.releasedAt !== null ? ("released" as const) : lock.maturesAt <= now ? ("matured" as const) : ("active" as const),
    }))
    .sort((a, b) => {
      const order = { matured: 0, active: 1, released: 2 };
      return order[a.status] - order[b.status] || a.maturesAt - b.maturesAt;
    });
}

export function fundingHealth(world: World, commitment: Pick<CommitmentState, "amount" | "debt">) {
  if (commitment.debt <= 0) return Infinity;
  return (commitment.amount * world.module.osethRateEth * FINANCING.liquidationThresholdPct) / 100 / commitment.debt;
}

export function readCommitment(world: World, commitment: CommitmentState, now: number): Commitment {
  const status = commitment.releasedAt !== null ? "released" : commitment.maturesAt <= now ? "matured" : "active";
  return {
    id: commitment.id,
    amount: commitment.amount,
    source: commitment.source,
    days: commitment.days,
    startedAt: commitment.startedAt,
    maturesAt: commitment.maturesAt,
    status,
    financing: commitment.borrowedAt !== null ? { debt: commitment.debt, borrowedAt: commitment.borrowedAt, healthFactor: fundingHealth(world, commitment) } : null,
    releasedAt: commitment.releasedAt,
    heldForRepayment: commitment.releasedAt !== null && commitment.debt > 0,
  };
}

export function readLiquidityPosition(world: World, account: AccountState, now: number): LiquidityPosition {
  const rate = world.module.osethRateEth;
  const commitments = account.commitments
    .map((commitment) => readCommitment(world, commitment, now))
    .sort((a, b) => {
      const order = { matured: 0, active: 1, released: 2 };
      return order[a.status] - order[b.status] || a.maturesAt - b.maturesAt;
    });
  const locked = commitments.filter((item) => item.status !== "released").reduce((sum, item) => sum + item.amount, 0);
  const debt = account.commitments.reduce((sum, item) => sum + item.debt, 0);
  const { osethExposure, aaveSupply, incentives, lendingIncome, fundingCost } = account.returns2;
  const hasPosition = account.commitments.length > 0;
  return {
    locked,
    lockedValueEth: locked * rate,
    commitments,
    returns: hasPosition
      ? [
          { id: "osethExposure", label: "osETH staking exposure", phase: 2, amount: osethExposure, asset: "ETH", note: "The osETH rate rising with StakeWise staking rewards" },
          { id: "aaveSupply", label: "Aave supply interest", phase: 2, amount: aaveSupply, asset: "ETH", note: "Interest on the supplied osETH, paid as more aEthosETH" },
          { id: "incentives", label: "Lock incentives", phase: 2, amount: incentives, asset: "ETH", note: "From the commitment programme, funded separately" },
          { id: "lendingIncome", label: "Lending interest (your 75%)", phase: 3, amount: lendingIncome, asset: "ETH", note: "From the funding loan lent in the borrowing markets" },
          { id: "fundingCost", label: "Funding cost", phase: 2, amount: fundingCost, asset: "ETH", note: "Variable interest on the funding loan" },
        ]
      : [],
    obligations:
      debt > 0
        ? [{ id: "funding", label: "Funding loan", asset: "WETH", amount: debt, settledAt: "Owed at Aave V3; repaid through the Module", accruing: true }]
        : [],
    history: stepSeries(
      world.module.rates,
      account.lockedEvents.map((event) => ({ t: event.t, amount: event.locked })),
      now,
    ),
  };
}

export function readBorrowPosition(world: World, account: AccountState, id: CollateralMarket): BorrowPosition {
  const { collateral, debt } = account.borrow[id];
  const rules = MARKET_RULES[id];
  const price = world.module.osethRateEth;
  const collateralValueEth = collateral * price;
  const maxDebt = (collateralValueEth * rules.maxLtvPct) / 100;
  return {
    marketId: id,
    collateral,
    collateralValueEth,
    debt,
    healthFactor: debt > 0 ? (collateralValueEth * rules.liquidationThresholdPct) / 100 / debt : null,
    ltvPct: collateralValueEth > 0 ? (debt / collateralValueEth) * 100 : 0,
    borrowable: Math.max(0, maxDebt - debt),
    liquidationPriceEth: debt > 0 && collateral > 0 ? debt / ((collateral * rules.liquidationThresholdPct) / 100) : null,
  };
}

export function readBorrowPositions(world: World, account: AccountState): BorrowPosition[] {
  return (["oseth", "aethoseth"] as const)
    .filter((id) => account.borrow[id].collateral > 0 || account.borrow[id].debt > 0)
    .map((id) => readBorrowPosition(world, account, id));
}

export function readLendPosition(world: World, account: AccountState): LendPosition | null {
  if (account.lend.supplied <= 0 && account.lend.income <= 0) return null;
  const liquidity = Math.max(0, world.pool.supplied - poolBorrowed(world.pool));
  return { supplied: account.lend.supplied, income: account.lend.income, withdrawableNow: Math.min(account.lend.supplied, liquidity) };
}

export const readActivity = (account: AccountState): ActivityItem[] => [...account.activity].sort((a, b) => b.at - a.at);

/** Whether any of the account's loans sits below the caution line (for the needs-you prompts). */
export const hasHealthWarning = (positions: BorrowPosition[]) =>
  positions.some((position) => position.healthFactor !== null && position.healthFactor < HEALTH_CAUTION);

export const isCollateralMarket = (id: MarketId): id is CollateralMarket => id === "oseth" || id === "aethoseth";
