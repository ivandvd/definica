import { formatAmount, formatBps, formatDate, formatHealth, formatPercent, healthZone } from "../format";
import {
  ACTION_PHASE,
  HEALTH_CAUTION,
  LOCK_MAX_DAYS,
  LOCK_MAX_POSITIONS,
  LOCK_MIN_DAYS,
  OPENS_POSITION,
  type Action,
  type ActionPreview,
  type ChangeLine,
  type ProtocolErrorCode,
} from "../protocol";
import type { Asset, Hash, PhaseId } from "../types";
import {
  exitSharesLeft,
  fundingHealth,
  readBorrowPosition,
  readCommitment,
  readExit,
  readLiquidity,
  readLocks,
  readMarkets,
  readPosition,
  readVault,
} from "./reads";
import {
  CLAIM_DELAY,
  DAY,
  FINANCING,
  HARVEST_INTERVAL,
  MARKET_RULES,
  nextId,
  record,
  type AccountState,
  type CollateralMarket,
  type World,
} from "./world";

/* Previews and effects of every action in the preview world. */

/** Sample network fee of one transaction (about 90k gas at 12 gwei). */
export const TX_FEE = 0.0011;
/** What Max leaves in the wallet for network fees when the amount is ETH. */
export const GAS_RESERVE = 0.003;

type Problem = { code: ProtocolErrorCode; message: string };

const fmt = (value: number, digits = 4) => formatAmount(value, digits);
const amountOf = (value: number, asset: Asset, digits = 4) => `${fmt(value, digits)} ${asset === "shares" ? "shares" : asset}`;
const health = (value: number) => (Number.isFinite(value) ? formatHealth(value) : "∞");
const healthTone = (value: number): ChangeLine["tone"] => {
  const zone = healthZone(Number.isFinite(value) ? value : null);
  return zone === "safe" ? "good" : zone === "caution" ? "caution" : "danger";
};

/** Checks that apply to every action, before its own: data age, eligibility and phase status. */
function gate(world: World, action: Action): Problem | null {
  const { sim } = world;
  if (sim.stale) return { code: "stale", message: "The figures on screen are out of date. Wait for them to refresh before you confirm." };
  if (sim.restriction === "blocked") return { code: "restricted", message: "This address can't use Definica." };
  if (sim.restriction === "region" && OPENS_POSITION.has(action.type))
    return { code: "restricted", message: "New positions aren't available in your region. Exits, claims, releases and repayments stay open." };
  const phase = ACTION_PHASE[action.type];
  const status = sim.phases[phase];
  if (status === "inactive") return { code: "notActive", message: `${PART_NAME[phase]} isn't open, so this action is closed.` };
  if (status === "paused" && OPENS_POSITION.has(action.type))
    return { code: "paused", message: `${PART_NAME[phase]} is paused by its emergency controls. Exits, claims and repayments stay open.` };
  return null;
}

const blank = (action: Action): ActionPreview => ({
  action,
  gives: [],
  gets: [],
  changes: [],
  conditions: [],
  warnings: [],
  steps: [],
  contract: { name: "DefinicaCore", address: null, method: "" },
  networkFeeEth: TX_FEE,
  problem: null,
});

/** Each part of the protocol by name, for messages (the app shows no phase numbers). */
const PART_NAME: Record<PhaseId, string> = { 1: "Staking", 2: "The Liquidity Module", 3: "Borrowing" };

/** Balance check for ETH that also leaves room for the network fee. */
function ethProblem(account: AccountState | null, amount: number, fee: number): Problem | null {
  if (!account) return null;
  if (amount > account.balances.ETH + 1e-12) return { code: "balance", message: "That is more than the ETH in your wallet." };
  if (amount + fee > account.balances.ETH + 1e-12)
    return { code: "balance", message: amount > 0 ? `Leave about ${fmt(fee)} ETH for the network fee.` : `You need about ${fmt(fee)} ETH in your wallet for the network fee.` };
  return null;
}

const firstProblem = (...problems: (Problem | null | false | undefined)[]) => problems.find((problem): problem is Problem => Boolean(problem)) ?? null;

export function previewAction(world: World, account: AccountState | null, action: Action, now: number): ActionPreview {
  const preview = blank(action);
  const gated = gate(world, action);
  const vault = readVault(world, now);
  const position = account ? readPosition(world, account, now) : null;

  switch (action.type) {
    case "stake": {
      const { amount } = action;
      const price = vault.sharePriceEth;
      const capacityLeft = Math.max(0, vault.capacityEth - vault.totalAssetsEth);
      const shares = amount / price;
      preview.gives = [{ asset: "ETH", amount }];
      preview.gets = [{ asset: "shares", amount: shares }];
      preview.changes = [
        { label: "Vault shares", before: fmt(position?.shares ?? 0), after: fmt((position?.shares ?? 0) + shares) },
        { label: "Position value", before: amountOf(position?.valueEth ?? 0, "ETH"), after: amountOf((position?.valueEth ?? 0) + amount, "ETH") },
      ];
      preview.conditions = [
        { label: "Vault", value: vault.name },
        { label: "Share price", value: amountOf(price, "ETH") },
        { label: "Vault fee", value: `${formatBps(vault.feeBps.vault)} of rewards` },
        { label: "Definica fee", value: `${formatBps(vault.feeBps.definica)} of rewards` },
        { label: "Minimum deposit", value: amountOf(vault.minDepositEth, "ETH", 2) },
        { label: "Capacity left", value: amountOf(capacityLeft, "ETH", 2) },
      ];
      preview.warnings = [{ level: "info", text: "Rewards depend on validator performance and are not guaranteed. Fees come out of rewards, never your deposit." }];
      preview.steps = [{ label: "Stake ETH", kind: "transaction" }];
      preview.contract = { name: "DefinicaCore", address: null, method: "deposit" };
      preview.problem = firstProblem(
        gated,
        !vault.activated && { code: "notActive", message: "Deposits open once the Vault has registered validators." },
        !(amount > 0) && { code: "invalid", message: "Enter an amount above zero." },
        amount < vault.minDepositEth && { code: "belowMinimum", message: `The minimum deposit is ${amountOf(vault.minDepositEth, "ETH", 2)}.` },
        ethProblem(account, amount, TX_FEE),
        amount > capacityLeft + 1e-9 && {
          code: "capacity",
          message: capacityLeft <= 0 ? "The Vault is full. Deposits reopen when capacity frees up." : `The Vault has room for ${amountOf(capacityLeft, "ETH", 2)} more.`,
        },
      );
      return preview;
    }

    case "requestExit": {
      const { shares, route } = action;
      const available = position?.availableShares ?? 0;
      const estimate = shares * vault.sharePriceEth;
      const fromLiquidity = Math.min(estimate, vault.withdrawableEth);
      const fromExits = Math.max(0, estimate - fromLiquidity);
      preview.gives = [{ asset: "shares", amount: shares }];
      preview.gets = [{ asset: "ETH", amount: estimate }];
      preview.changes = [
        { label: "Available shares", before: fmt(available), after: fmt(Math.max(0, available - shares)) },
        { label: "In the exit queue", before: fmt(position?.exitingShares ?? 0), after: fmt((position?.exitingShares ?? 0) + shares) },
      ];
      preview.conditions = [
        { label: "Route", value: route === "core" ? "Through Definica" : "Directly at the Vault" },
        { label: "Estimated ETH", value: amountOf(estimate, "ETH"), hint: "At today's share price; the amount paid follows the Vault's accounting." },
        { label: "From available liquidity", value: amountOf(fromLiquidity, "ETH") },
        ...(fromExits > 0 ? [{ label: "After validator exits", value: amountOf(fromExits, "ETH") }] : []),
        {
          label: "Expected wait",
          value:
            fromExits > 0
              ? vault.exitWait
                ? `Up to ${vault.exitWait.maxDays} days (average ${vault.exitWait.avgDays})`
                : "Not estimated"
              : "After the next harvest processes the queue",
        },
        { label: "Partial claims", value: route === "core" ? "The rest of the exit is kept for later" : "A new ticket is issued for the rest" },
      ];
      preview.warnings = [
        { level: "info", text: "Shares in an exit request keep earning rewards, and bearing any penalties, until the Vault burns them." },
        { level: "caution", text: "A request can't be cancelled once it is in the queue." },
      ];
      preview.steps = [{ label: "Request exit", kind: "transaction" }];
      preview.contract = route === "core" ? { name: "DefinicaCore", address: null, method: "requestExit" } : { name: "Staking Vault", address: null, method: "enterExitQueue" };
      preview.problem = firstProblem(
        gated,
        !position && { code: "invalid", message: "There are no shares to exit." },
        !(shares > 0) && { code: "invalid", message: "Enter the shares to exit." },
        shares > available + 1e-9 && {
          code: "invalid",
          message: position && position.lockedShares > 0 ? "That is more than your available shares. Locked shares can exit once their lock matures." : "That is more than your available shares.",
        },
        ethProblem(account, 0, TX_FEE),
      );
      return preview;
    }

    case "claimExits": {
      const exits = (account?.exits ?? []).filter((exit) => action.ids.includes(exit.id));
      const read = exits.map((exit) => readExit(exit, now));
      const claimable = read.reduce((sum, exit) => sum + exit.claimableEth, 0);
      const burned = exits.reduce((sum, exit) => sum + (exit.ethEstimate > 0 ? exit.shares * (readExit(exit, now).claimableEth / exit.ethEstimate) : 0), 0);
      const direct = read.some((exit) => exit.route === "vault");
      preview.gets = [{ asset: "ETH", amount: claimable }];
      preview.changes = [
        { label: "Ready to claim", before: amountOf(claimable, "ETH"), after: amountOf(0, "ETH") },
        { label: "Vault shares", before: fmt(position?.shares ?? 0), after: fmt(Math.max(0, (position?.shares ?? 0) - burned)) },
      ];
      preview.conditions = [
        { label: read.length === 1 ? "Request" : "Requests", value: read.length === 1 ? `Requested ${formatDate(read[0].requestedAt)}` : `${read.length} exits` },
        { label: "Route", value: direct ? "Directly at the Vault" : "Through Definica" },
        ...(read.some((exit) => exit.status === "partial") ? [{ label: "Partial claim", value: "The rest stays in the queue" }] : []),
        { label: "Paid to", value: "Your wallet" },
      ];
      preview.steps = [{ label: read.length > 1 ? `Claim ${read.length} exits` : "Claim ETH", kind: "transaction" }];
      preview.contract = direct ? { name: "Staking Vault", address: null, method: "claimExitedAssets" } : { name: "DefinicaCore", address: null, method: "claimExits" };
      preview.problem = firstProblem(gated, !(claimable > 0) && { code: "notMatured", message: "Nothing is claimable yet." }, ethProblem(account, 0, TX_FEE));
      return preview;
    }

    case "createLock": {
      const { shares, days } = action;
      const available = position?.availableShares ?? 0;
      const open = account ? readLocks(account, now).filter((lock) => lock.status !== "released").length : 0;
      const maturesAt = now + days * DAY;
      preview.gives = [{ asset: "shares", amount: shares }];
      preview.changes = [
        { label: "Available shares", before: fmt(available), after: fmt(Math.max(0, available - shares)) },
        { label: "Locked shares", before: fmt(position?.lockedShares ?? 0), after: fmt((position?.lockedShares ?? 0) + shares) },
        { label: "Lock positions", before: `${open} of ${LOCK_MAX_POSITIONS}`, after: `${open + 1} of ${LOCK_MAX_POSITIONS}` },
      ];
      preview.conditions = [
        { label: "Duration", value: `${days} days` },
        { label: "Matures on", value: formatDate(maturesAt) },
        { label: "Reward accounting", value: "Locked shares keep earning" },
        { label: "Early unlock", value: "Not available" },
      ];
      preview.warnings = [{ level: "caution", text: "Locked shares can't exit before the lock matures, and there is no early unlock." }];
      preview.steps = [{ label: "Lock shares", kind: "transaction" }];
      preview.contract = { name: "DefinicaCore", address: null, method: "lock" };
      preview.problem = firstProblem(
        gated,
        !position && { code: "invalid", message: "There are no shares to lock. Stake ETH first." },
        !(shares > 0) && { code: "invalid", message: "Enter the shares to lock." },
        shares > available + 1e-9 && { code: "invalid", message: "That is more than your available shares." },
        (days < LOCK_MIN_DAYS || days > LOCK_MAX_DAYS) && { code: "invalid", message: `Locks run from ${LOCK_MIN_DAYS} to ${LOCK_MAX_DAYS} days.` },
        open >= LOCK_MAX_POSITIONS && { code: "limit", message: "All 10 lock positions are in use. Release a matured lock to open a slot." },
        ethProblem(account, 0, TX_FEE),
      );
      return preview;
    }

    case "releaseLocks": {
      const locks = account ? readLocks(account, now).filter((lock) => action.ids.includes(lock.id)) : [];
      const shares = locks.reduce((sum, lock) => sum + lock.shares, 0);
      const open = account ? readLocks(account, now).filter((lock) => lock.status !== "released").length : 0;
      preview.gets = [{ asset: "shares", amount: shares }];
      preview.changes = [
        { label: "Available shares", before: fmt(position?.availableShares ?? 0), after: fmt((position?.availableShares ?? 0) + shares) },
        { label: "Lock positions", before: `${open} of ${LOCK_MAX_POSITIONS}`, after: `${Math.max(0, open - locks.length)} of ${LOCK_MAX_POSITIONS}` },
      ];
      preview.conditions = locks.length === 1
        ? [
            { label: "Lock", value: `${locks[0].days} days from ${formatDate(locks[0].startedAt)}` },
            { label: "Matured on", value: formatDate(locks[0].maturesAt) },
          ]
        : [{ label: "Locks", value: `${locks.length} matured locks` }];
      preview.steps = [{ label: locks.length > 1 ? `Release ${locks.length} locks` : "Release shares", kind: "transaction" }];
      preview.contract = { name: "DefinicaCore", address: null, method: "releaseLocks" };
      preview.problem = firstProblem(
        gated,
        !locks.length && { code: "invalid", message: "Choose a lock to release." },
        locks.some((lock) => lock.status !== "matured") && { code: "notMatured", message: "This lock hasn't matured yet." },
        ethProblem(account, 0, TX_FEE),
      );
      return preview;
    }

    case "commit": {
      const { source, amount, days, financing } = action;
      const info = readLiquidity(world);
      const { reserve, rules } = info;
      const loan = financing ?? 0;
      const balance = account ? account.balances[source] : Infinity;
      const locked = account ? account.commitments.filter((item) => item.releasedAt === null).reduce((sum, item) => sum + item.amount, 0) : 0;
      const debt = account ? account.commitments.reduce((sum, item) => sum + item.debt, 0) : 0;
      const healthAfter = loan > 0 ? fundingHealth(world, { amount, debt: loan }) : Infinity;
      const maxLoan = (amount * info.osethRateEth * FINANCING.maxLtvPct) / 100;
      const supplyHeadroom = Math.max(0, reserve.supplyCap - reserve.totalSupplied);
      const capacityLeft = Math.max(0, rules.capacity - rules.committed);
      const incentive = rules.incentive;

      preview.gives = [{ asset: source, amount }];
      preview.gets = [{ asset: "aEthosETH", amount }];
      preview.changes = [{ label: "Locked aEthosETH", before: fmt(locked), after: fmt(locked + amount) }];
      if (loan > 0) {
        preview.changes.push(
          { label: "Funding debt", before: amountOf(debt, "WETH"), after: amountOf(debt + loan, "WETH") },
          { label: "Loan health", before: "—", after: health(healthAfter), tone: healthTone(healthAfter) },
        );
      }
      preview.conditions = [
        ...(source === "osETH"
          ? [
              { label: "Supplied to", value: "Aave V3 Ethereum" },
              { label: "osETH reserve", value: reserve.status === "active" ? "Active" : reserve.status === "frozen" ? "Frozen" : "Paused" },
              { label: "Supply-cap headroom", value: amountOf(supplyHeadroom, "osETH", 2) },
              { label: "Supply rate", value: `${formatPercent(reserve.supplyRatePct)} a year, variable` },
            ]
          : [{ label: "Receipt", value: rules.acceptedReceipts }]),
        { label: "Duration", value: `${days} days` },
        { label: "Matures on", value: formatDate(now + days * DAY) },
        { label: "Early release", value: rules.earlyRelease ? "Allowed under the rules" : "Not available" },
        { label: "Module capacity left", value: amountOf(capacityLeft, "aEthosETH", 2) },
        {
          label: "Lock incentives",
          value: incentive ? (days >= 90 ? `${incentive.name}, until ${formatDate(incentive.endsAt)}` : "Not eligible (90 days or more)") : "No programme running",
        },
      ];
      if (loan > 0) {
        preview.conditions.push(
          { label: "Funding loan", value: `${amountOf(loan, "WETH")} at Aave V3` },
          { label: "eMode", value: info.financing.emode },
          { label: "Max LTV", value: formatPercent(info.financing.maxLtvPct, 0) },
          { label: "Liquidation threshold", value: formatPercent(info.financing.liquidationThresholdPct, 0) },
          { label: "Borrow rate", value: `${formatPercent(info.financing.borrowRatePct)} a year, variable` },
          { label: "Borrow-cap headroom", value: amountOf(info.financing.borrowCap - info.financing.totalBorrowed, "WETH", 0) },
          { label: "Loan goes to", value: "The borrowing markets" },
        );
      }
      preview.warnings = [
        { level: "info", text: "osETH exposure, Aave supply interest, incentives and any lending income are each reported on their own line." },
        { level: "info", text: "Locking aEthosETH doesn't make it collateral in the borrowing markets." },
      ];
      if (loan > 0) {
        preview.warnings.push({ level: "danger", text: "The funding loan is a real debt with variable interest and liquidation risk. Lending losses and funding costs can outweigh returns." });
        if (healthAfter < HEALTH_CAUTION) preview.warnings.push({ level: "caution", text: `Loan health after this would be ${health(healthAfter)}. Keep it well above 1.` });
      }
      preview.steps = [
        { label: source === "osETH" ? "Approve osETH" : "Approve aEthosETH", kind: "signature" },
        ...(loan > 0 ? [{ label: "Authorise the funding loan", kind: "signature" as const }] : []),
        { label: source === "osETH" ? "Supply and commit" : "Commit", kind: "transaction" },
      ];
      preview.contract = { name: "Main Liquidity Module", address: null, method: source === "osETH" ? "supplyAndCommit" : "commit" };
      preview.networkFeeEth = TX_FEE * (loan > 0 ? 2.2 : 1.6);
      preview.problem = firstProblem(
        gated,
        source === "osETH" &&
          reserve.status !== "active" && {
            code: "paused",
            message:
              reserve.status === "frozen"
                ? "Aave has frozen the osETH reserve, so new supply is closed. You can still commit aEthosETH you hold."
                : "Aave has paused the osETH reserve. Supply and withdrawals are closed until it reopens.",
          },
        !(amount > 0) && { code: "invalid", message: "Enter an amount above zero." },
        amount < rules.minCommit && { code: "belowMinimum", message: `The minimum commitment is ${amountOf(rules.minCommit, "aEthosETH", 2)}.` },
        amount > rules.maxCommit && { code: "limit", message: `The maximum commitment is ${amountOf(rules.maxCommit, "aEthosETH", 0)}.` },
        amount > balance + 1e-12 && { code: "balance", message: `That is more than the ${source} in your wallet.` },
        !rules.durations.includes(days) && { code: "invalid", message: "Choose one of the Module's durations." },
        amount > capacityLeft && { code: "capacity", message: `The Module has room for ${amountOf(capacityLeft, "aEthosETH", 2)} more.` },
        source === "osETH" && amount > supplyHeadroom && { code: "supplyCap", message: "Supplying this would take Aave's osETH reserve past its supply cap (SupplyCapExceeded)." },
        loan > 0 &&
          !info.financing.available && {
            code: "notBorrowableInEMode",
            message: "Financing isn't available right now: the Aave market, eMode, liquidity or caps don't allow a funding loan.",
          },
        loan > 0 &&
          loan > info.financing.borrowCap - info.financing.totalBorrowed && { code: "borrowCap", message: "This loan would take WETH borrowing at Aave past its cap (BorrowCapExceeded)." },
        loan > 0 &&
          loan > maxLoan + 1e-12 && {
            code: "healthFactor",
            message: `A loan this size would go past the ${formatPercent(info.financing.maxLtvPct, 0)} maximum LTV. The most is ${amountOf(maxLoan, "WETH")}.`,
          },
        ethProblem(account, 0, preview.networkFeeEth),
      );
      return preview;
    }

    case "releaseCommitment": {
      const state = account?.commitments.find((item) => item.id === action.id);
      const commitment = state ? readCommitment(world, state, now) : null;
      const rules = readLiquidity(world).rules;
      const locked = account ? account.commitments.filter((item) => item.releasedAt === null).reduce((sum, item) => sum + item.amount, 0) : 0;
      const debt = state?.debt ?? 0;
      if (commitment) {
        preview.gets = debt > 0 ? [] : [{ asset: "aEthosETH", amount: commitment.amount }];
        preview.changes = [{ label: "Locked aEthosETH", before: fmt(locked), after: fmt(Math.max(0, locked - commitment.amount)) }];
        preview.conditions = [
          { label: "Commitment", value: `${amountOf(commitment.amount, "aEthosETH")} · ${commitment.days} days` },
          { label: commitment.status === "matured" ? "Matured on" : "Matures on", value: formatDate(commitment.maturesAt) },
          { label: "Returned to", value: debt > 0 ? "Held by the Module until the funding loan is repaid" : "Your wallet" },
        ];
        if (debt > 0) preview.warnings = [{ level: "caution", text: `The funding loan of ${amountOf(debt, "WETH")} stays open after release. Repay it to get the aEthosETH back.` }];
      }
      preview.steps = [{ label: "Release commitment", kind: "transaction" }];
      preview.contract = { name: "Main Liquidity Module", address: null, method: "release" };
      preview.problem = firstProblem(
        gated,
        !commitment && { code: "invalid", message: "Choose a commitment to release." },
        commitment?.status === "released" && { code: "invalid", message: "This commitment is already released." },
        commitment?.status === "active" &&
          !rules.earlyRelease && { code: "notMatured", message: `This commitment matures on ${formatDate(commitment.maturesAt)}. The Module's rules don't allow an early release.` },
        ethProblem(account, 0, TX_FEE),
      );
      return preview;
    }

    case "repayFunding": {
      const state = account?.commitments.find((item) => item.id === action.id);
      const debt = state?.debt ?? 0;
      const pay = Math.min(action.amount, debt);
      const full = action.amount >= debt - 1e-9;
      const before = state ? fundingHealth(world, state) : Infinity;
      const after = state ? fundingHealth(world, { amount: state.amount, debt: full ? 0 : debt - pay }) : Infinity;
      preview.gives = [{ asset: "ETH", amount: pay }];
      preview.changes = [
        { label: "Funding debt", before: amountOf(debt, "WETH"), after: amountOf(full ? 0 : debt - pay, "WETH") },
        { label: "Loan health", before: health(before), after: health(after), tone: healthTone(after) },
      ];
      preview.conditions = [
        { label: "Repaid at", value: "Aave V3, through the Module" },
        { label: "Paid with", value: "ETH, wrapped to WETH in the same transaction" },
        ...(state && state.releasedAt !== null && full ? [{ label: "Returned to your wallet", value: amountOf(state.amount, "aEthosETH") }] : []),
      ];
      preview.steps = [{ label: full ? "Repay the loan" : "Repay part of the loan", kind: "transaction" }];
      preview.contract = { name: "Main Liquidity Module", address: null, method: "repayFunding" };
      preview.problem = firstProblem(
        gated,
        !(debt > 0) && { code: "invalid", message: "There is no debt on this commitment." },
        !(action.amount > 0) && { code: "invalid", message: "Enter an amount above zero." },
        ethProblem(account, pay, TX_FEE),
      );
      return preview;
    }

    case "withdrawToOseth": {
      const { amount } = action;
      const { reserve } = readLiquidity(world);
      preview.gives = [{ asset: "aEthosETH", amount }];
      preview.gets = [{ asset: "osETH", amount }];
      preview.conditions = [
        { label: "Withdrawn from", value: "Aave V3's osETH reserve" },
        { label: "Unborrowed osETH", value: amountOf(reserve.unborrowed, "osETH", 2) },
        { label: "Then", value: "Keep the osETH, or convert it through StakeWise's redemption queue or a market" },
      ];
      preview.steps = [{ label: "Withdraw to osETH", kind: "transaction" }];
      preview.contract = { name: "Aave V3 Pool", address: null, method: "withdraw" };
      preview.problem = firstProblem(
        gated,
        reserve.status === "paused" && { code: "paused", message: "Aave has paused the osETH reserve. Withdrawals reopen when it does." },
        !(amount > 0) && { code: "invalid", message: "Enter an amount above zero." },
        account && amount > account.balances.aEthosETH + 1e-12 && { code: "balance", message: "That is more than the aEthosETH in your wallet." },
        amount > reserve.unborrowed && {
          code: "liquidity",
          message: `Aave's osETH reserve has ${amountOf(reserve.unborrowed, "osETH", 2)} unborrowed. Withdraw less or wait.`,
        },
        ethProblem(account, 0, TX_FEE),
      );
      return preview;
    }

    case "supplyCollateral":
    case "withdrawCollateral":
    case "borrow":
    case "repay": {
      const id = action.marketId;
      if (id === "eth") {
        preview.problem = { code: "invalid", message: "Choose a collateral market." };
        return preview;
      }
      const market = readMarkets(world).find((item) => item.id === id)!;
      const rules = MARKET_RULES[id];
      const current = account ? readBorrowPosition(world, account, id) : null;
      const collateral = current?.collateral ?? 0;
      const debt = current?.debt ?? 0;
      const price = market.priceEth;
      const healthOf = (c: number, d: number) => (d > 0 ? (c * price * rules.liquidationThresholdPct) / 100 / d : Infinity);
      const borrowableOf = (c: number, d: number) => Math.max(0, (c * price * rules.maxLtvPct) / 100 - d);
      const { amount } = action;

      let collateralAfter = collateral;
      let debtAfter = debt;
      if (action.type === "supplyCollateral") collateralAfter = collateral + amount;
      if (action.type === "withdrawCollateral") collateralAfter = Math.max(0, collateral - amount);
      if (action.type === "borrow") debtAfter = debt + amount;
      const pay = Math.min(amount, debt);
      if (action.type === "repay") debtAfter = amount >= debt - 1e-9 ? 0 : debt - pay;

      const before = healthOf(collateral, debt);
      const after = healthOf(collateralAfter, debtAfter);
      const asset = market.asset;

      if (action.type === "supplyCollateral") preview.gives = [{ asset, amount }];
      if (action.type === "withdrawCollateral") preview.gets = [{ asset, amount }];
      if (action.type === "borrow") preview.gets = [{ asset: "ETH", amount }];
      if (action.type === "repay") preview.gives = [{ asset: "ETH", amount: pay }];

      preview.changes = [
        ...(action.type === "supplyCollateral" || action.type === "withdrawCollateral"
          ? [{ label: "Collateral", before: amountOf(collateral, asset), after: amountOf(collateralAfter, asset) }]
          : [{ label: "Debt", before: amountOf(debt, "ETH"), after: amountOf(debtAfter, "ETH") }]),
        { label: "Health factor", before: health(before), after: health(after), tone: healthTone(after) },
        { label: "Borrowing power", before: amountOf(borrowableOf(collateral, debt), "ETH"), after: amountOf(borrowableOf(collateralAfter, debtAfter), "ETH") },
      ];
      const liquidationPrice = debtAfter > 0 && collateralAfter > 0 ? debtAfter / ((collateralAfter * rules.liquidationThresholdPct) / 100) : null;
      preview.conditions = [
        { label: "Market", value: `${market.name} → ETH` },
        { label: "Max LTV", value: formatPercent(rules.maxLtvPct, 0) },
        { label: "Liquidation threshold", value: formatPercent(rules.liquidationThresholdPct, 0) },
        { label: "Oracle", value: market.params.oracle, hint: market.params.oracleFormula },
        ...(action.type === "borrow" || action.type === "repay"
          ? [
              { label: "Borrow rate", value: `${formatPercent(market.borrowRatePct)} a year, variable` },
              { label: "Liquidation penalty", value: formatPercent(rules.penaltyPct, 0) },
            ]
          : []),
        ...(action.type === "borrow" ? [{ label: "Available to borrow", value: amountOf(market.liquidity, "ETH", 2) }] : []),
        ...(liquidationPrice !== null ? [{ label: "Liquidation price", value: `${fmt(liquidationPrice)} ETH per ${asset}` }] : []),
      ];
      if (action.type === "borrow") preview.warnings.push({ level: "info", text: "Interest accrues continuously at a variable rate that follows utilisation." });
      if (Number.isFinite(after) && after < HEALTH_CAUTION && after >= 1)
        preview.warnings.push({ level: "danger", text: `Your health factor would be ${health(after)}. If the ${asset} price falls or the debt grows, the position can be liquidated.` });

      const verb = { supplyCollateral: "Supply collateral", withdrawCollateral: "Withdraw collateral", borrow: "Borrow ETH", repay: debtAfter === 0 ? "Repay all" : "Repay ETH" }[action.type];
      preview.steps = action.type === "supplyCollateral" ? [{ label: `Approve ${asset}`, kind: "signature" }, { label: verb, kind: "transaction" }] : [{ label: verb, kind: "transaction" }];
      preview.contract = { name: "Borrowing markets", address: null, method: { supplyCollateral: "supplyCollateral", withdrawCollateral: "withdrawCollateral", borrow: "borrow", repay: "repay" }[action.type] };

      const walletAsset = account ? account.balances[asset as "osETH" | "aEthosETH"] : Infinity;
      preview.problem = firstProblem(
        gated,
        market.status !== "active" && (action.type === "supplyCollateral" || action.type === "borrow") && { code: "paused", message: "This market is paused. Repayments and collateral top-ups stay open." },
        !(amount > 0) && { code: "invalid", message: "Enter an amount above zero." },
        action.type === "supplyCollateral" && amount > walletAsset + 1e-12 && { code: "balance", message: `That is more than the ${asset} in your wallet.` },
        action.type === "supplyCollateral" &&
          market.totalSupplied + amount > market.params.supplyCap && { code: "supplyCap", message: "This would take the market past its supply cap." },
        action.type === "withdrawCollateral" && amount > collateral + 1e-12 && { code: "invalid", message: "That is more than your collateral." },
        action.type === "withdrawCollateral" &&
          debtAfter > 0 &&
          after < 1 && { code: "healthFactor", message: "Withdrawing this would take your health factor below 1, so the position could be liquidated." },
        action.type === "borrow" && collateral <= 0 && { code: "invalid", message: "Supply collateral first." },
        action.type === "borrow" &&
          debtAfter > (collateral * price * rules.maxLtvPct) / 100 + 1e-12 && {
            code: "healthFactor",
            message: `That is more than you can borrow at the ${formatPercent(rules.maxLtvPct, 0)} maximum LTV. You can borrow up to ${amountOf(borrowableOf(collateral, debt), "ETH")}.`,
          },
        action.type === "borrow" && amount > market.liquidity && { code: "liquidity", message: `The markets have ${amountOf(market.liquidity, "ETH", 2)} available to borrow right now.` },
        action.type === "borrow" && market.totalBorrowed + amount > market.params.borrowCap && { code: "borrowCap", message: "This would take the market past its borrow cap." },
        action.type === "repay" && !(debt > 0) && { code: "invalid", message: "There is no debt to repay." },
        action.type === "repay" ? ethProblem(account, pay, TX_FEE) : ethProblem(account, 0, TX_FEE),
      );
      return preview;
    }

    case "supplyEth":
    case "withdrawEth": {
      const market = readMarkets(world).find((item) => item.id === "eth")!;
      const supplied = account?.lend.supplied ?? 0;
      const { amount } = action;
      const supplying = action.type === "supplyEth";
      if (supplying) preview.gives = [{ asset: "ETH", amount }];
      else preview.gets = [{ asset: "ETH", amount }];
      preview.changes = [{ label: "Supplied", before: amountOf(supplied, "ETH"), after: amountOf(supplying ? supplied + amount : Math.max(0, supplied - amount), "ETH") }];
      preview.conditions = [
        { label: "Supply rate", value: `${formatPercent(market.supplyRatePct)} a year, variable`, hint: "Before the 75 / 25 split" },
        { label: "Allocated to you", value: "75% of the interest attributable to you" },
        { label: "Allocated to Definica", value: "25%" },
        { label: "Utilisation", value: formatPercent(market.utilisationPct, 1) },
        { label: supplying ? "Withdrawals" : "Withdrawable now", value: supplying ? "Up to the unborrowed liquidity at the time" : amountOf(Math.min(supplied, market.liquidity), "ETH") },
      ];
      if (supplying) preview.warnings = [{ level: "caution", text: "Lending losses can reduce what you get back, and at high utilisation withdrawals wait for repayments." }];
      preview.steps = [{ label: supplying ? "Supply ETH" : "Withdraw ETH", kind: "transaction" }];
      preview.contract = { name: "Borrowing markets", address: null, method: supplying ? "supply" : "withdraw" };
      preview.problem = firstProblem(
        gated,
        supplying && market.status !== "active" && { code: "paused", message: "This market is paused. Withdrawals of unborrowed ETH stay open." },
        !(amount > 0) && { code: "invalid", message: "Enter an amount above zero." },
        supplying ? ethProblem(account, amount, TX_FEE) : ethProblem(account, 0, TX_FEE),
        supplying && market.totalSupplied + amount > market.params.supplyCap && { code: "supplyCap", message: "This would take the ETH supply past its cap." },
        !supplying && amount > supplied + 1e-12 && { code: "invalid", message: "That is more than you have supplied." },
        !supplying &&
          amount > market.liquidity && { code: "liquidity", message: `Utilisation is high: ${amountOf(market.liquidity, "ETH", 2)} can be withdrawn right now.` },
      );
      return preview;
    }
  }
}

/** Why a transaction reverted in the preview, in the words the contracts would use. */
export function revertReason(action: Action) {
  switch (action.type) {
    case "stake":
      return "The Vault filled up while your transaction was pending, so nothing was deposited. Only the network fee was spent.";
    case "commit":
      return "Aave's osETH reserve reached its supply cap while your transaction was pending, so nothing was committed. Only the network fee was spent.";
    case "borrow":
      return "The market reached its borrow cap while your transaction was pending, so nothing was borrowed. Only the network fee was spent.";
    case "withdrawCollateral":
      return "The osETH rate moved while your transaction was pending, and the withdrawal would have put your health factor below 1, so nothing changed. Only the network fee was spent.";
    default:
      return "It didn't go through onchain, so nothing changed. Only the network fee was spent.";
  }
}

/** Applies a confirmed action to the world. */
export function applyAction(world: World, account: AccountState, action: Action, now: number, hash: Hash, fee: number) {
  account.balances.ETH = Math.max(0, account.balances.ETH - fee);
  const vault = world.vault;

  switch (action.type) {
    case "stake": {
      const shares = action.amount / vault.sharePriceEth;
      account.balances.ETH -= action.amount;
      account.depositedEth += action.amount;
      account.shares += shares;
      vault.totalShares += shares;
      account.shareEvents.push({ t: now, shares: account.shares });
      record(world, account, "deposit", now, action.amount, "ETH", `${formatAmount(shares)} Vault shares`, hash);
      return;
    }
    case "requestExit": {
      const estimate = action.shares * vault.sharePriceEth;
      const fromLiquidity = Math.min(estimate, vault.withdrawableEth);
      vault.withdrawableEth -= fromLiquidity;
      const nextHarvest = vault.lastHarvestAt + HARVEST_INTERVAL;
      const schedule = [] as { at: number; eth: number }[];
      if (fromLiquidity > 0) schedule.push({ at: nextHarvest + CLAIM_DELAY, eth: fromLiquidity });
      if (estimate - fromLiquidity > 1e-12) schedule.push({ at: now + 3 * DAY + CLAIM_DELAY, eth: estimate - fromLiquidity });
      account.exits.push({
        id: nextId(world, "exit"),
        shares: action.shares,
        ethEstimate: estimate,
        route: action.route,
        requestedAt: now,
        schedule,
        claimedEth: 0,
        claimedAt: null,
        ticket: `${200 + world.idCount} ${String(now % 1000).padStart(3, "0")} ${String(world.txCount * 37).padStart(3, "0").slice(-3)}`,
      });
      record(world, account, "exit-request", now, estimate, "ETH", `${formatAmount(action.shares)} shares · ${action.route === "core" ? "through Definica" : "at the Vault"}`, hash);
      return;
    }
    case "claimExits": {
      let paid = 0;
      for (const exit of account.exits.filter((item) => action.ids.includes(item.id))) {
        const claimable = readExit(exit, now).claimableEth;
        if (claimable <= 0) continue;
        const burned = exit.shares * (claimable / exit.ethEstimate);
        exit.claimedEth += claimable;
        if (exit.claimedEth >= exit.ethEstimate - 1e-9) exit.claimedAt = now;
        account.shares = Math.max(0, account.shares - burned);
        vault.totalShares = Math.max(0, vault.totalShares - burned);
        paid += claimable;
      }
      account.balances.ETH += paid;
      account.claimedEth += paid;
      account.shareEvents.push({ t: now, shares: account.shares });
      record(world, account, "exit-claim", now, paid, "ETH", action.ids.length > 1 ? `${action.ids.length} exits` : null, hash);
      return;
    }
    case "createLock": {
      account.locks.push({ id: nextId(world, "lock"), shares: action.shares, days: action.days, startedAt: now, maturesAt: now + action.days * DAY, releasedAt: null });
      record(world, account, "lock", now, action.shares, "shares", `${action.days}-day share lock`, hash);
      return;
    }
    case "releaseLocks": {
      let shares = 0;
      for (const lock of account.locks.filter((item) => action.ids.includes(item.id))) {
        lock.releasedAt = now;
        shares += lock.shares;
      }
      record(world, account, "lock-release", now, shares, "shares", action.ids.length > 1 ? `${action.ids.length} locks released` : null, hash);
      return;
    }
    case "commit": {
      const loan = action.financing ?? 0;
      account.balances[action.source] -= action.amount;
      if (action.source === "osETH") world.module.reserveSupplied += action.amount;
      world.module.committed += action.amount;
      account.commitments.push({
        id: nextId(world, "commit"),
        amount: action.amount,
        source: action.source,
        days: action.days,
        startedAt: now,
        maturesAt: now + action.days * DAY,
        releasedAt: null,
        debt: loan,
        borrowedAt: loan > 0 ? now : null,
        lent: loan,
      });
      if (loan > 0) {
        world.module.financingBorrowed += loan;
        world.pool.supplied += loan;
      }
      const locked = account.commitments.filter((item) => item.releasedAt === null).reduce((sum, item) => sum + item.amount, 0);
      account.lockedEvents.push({ t: now, locked });
      record(world, account, "commit", now, action.amount, "aEthosETH", `${action.source === "osETH" ? "osETH supplied to Aave V3" : "aEthosETH receipt"} · ${action.days} days`, hash);
      if (loan > 0) record(world, account, "funding-borrow", now, loan, "WETH", "Funding loan supplied to the borrowing markets", hash);
      return;
    }
    case "releaseCommitment": {
      const commitment = account.commitments.find((item) => item.id === action.id);
      if (!commitment) return;
      commitment.releasedAt = now;
      world.module.committed = Math.max(0, world.module.committed - commitment.amount);
      if (commitment.debt <= 0) account.balances.aEthosETH += commitment.amount;
      const locked = account.commitments.filter((item) => item.releasedAt === null).reduce((sum, item) => sum + item.amount, 0);
      account.lockedEvents.push({ t: now, locked });
      record(world, account, "commit-release", now, commitment.amount, "aEthosETH", commitment.debt > 0 ? "Held until the funding loan is repaid" : "Returned to your wallet", hash);
      return;
    }
    case "repayFunding": {
      const commitment = account.commitments.find((item) => item.id === action.id);
      if (!commitment) return;
      const pay = Math.min(action.amount, commitment.debt);
      const full = action.amount >= commitment.debt - 1e-9;
      account.balances.ETH -= pay;
      commitment.debt = full ? 0 : commitment.debt - pay;
      world.module.financingBorrowed = Math.max(0, world.module.financingBorrowed - pay);
      if (full) {
        world.pool.supplied = Math.max(0, world.pool.supplied - commitment.lent);
        commitment.lent = 0;
        if (commitment.releasedAt !== null) account.balances.aEthosETH += commitment.amount;
      }
      record(world, account, "funding-repay", now, pay, "WETH", full ? "Funding loan repaid" : null, hash);
      return;
    }
    case "withdrawToOseth": {
      account.balances.aEthosETH -= action.amount;
      account.balances.osETH += action.amount;
      world.module.reserveSupplied = Math.max(0, world.module.reserveSupplied - action.amount);
      world.module.reserveUnborrowed = Math.max(0, world.module.reserveUnborrowed - action.amount);
      record(world, account, "aave-withdraw", now, action.amount, "osETH", "aEthosETH withdrawn from Aave V3", hash);
      return;
    }
    case "supplyCollateral":
    case "withdrawCollateral":
    case "borrow":
    case "repay": {
      const id = action.marketId as CollateralMarket;
      const position = account.borrow[id];
      const asset = id === "oseth" ? "osETH" : "aEthosETH";
      const note = `${asset} market`;
      if (action.type === "supplyCollateral") {
        account.balances[asset] -= action.amount;
        position.collateral += action.amount;
        world.pool.collateral[id] += action.amount;
        record(world, account, "collateral-supply", now, action.amount, asset, note, hash);
      } else if (action.type === "withdrawCollateral") {
        account.balances[asset] += action.amount;
        position.collateral = Math.max(0, position.collateral - action.amount);
        world.pool.collateral[id] = Math.max(0, world.pool.collateral[id] - action.amount);
        record(world, account, "collateral-withdraw", now, action.amount, asset, note, hash);
      } else if (action.type === "borrow") {
        account.balances.ETH += action.amount;
        position.debt += action.amount;
        world.pool.borrowed[id] += action.amount;
        record(world, account, "borrow", now, action.amount, "ETH", note, hash);
      } else {
        const pay = Math.min(action.amount, position.debt);
        const full = action.amount >= position.debt - 1e-9;
        account.balances.ETH -= pay;
        position.debt = full ? 0 : position.debt - pay;
        world.pool.borrowed[id] = Math.max(0, world.pool.borrowed[id] - pay);
        record(world, account, "repay", now, pay, "ETH", full ? `${note} · repaid in full` : note, hash);
      }
      return;
    }
    case "supplyEth": {
      account.balances.ETH -= action.amount;
      account.lend.supplied += action.amount;
      world.pool.supplied += action.amount;
      record(world, account, "eth-supply", now, action.amount, "ETH", "ETH supply", hash);
      return;
    }
    case "withdrawEth": {
      account.balances.ETH += action.amount;
      account.lend.supplied = Math.max(0, account.lend.supplied - action.amount);
      world.pool.supplied = Math.max(0, world.pool.supplied - action.amount);
      let note = "ETH supply";
      if (account.lend.supplied <= 1e-12) {
        account.balances.ETH += account.lend.income;
        note = `ETH supply · ${formatAmount(account.lend.income)} ETH interest paid out`;
        account.lend = { supplied: 0, income: 0 };
      }
      record(world, account, "eth-withdraw", now, action.amount, "ETH", note, hash);
      return;
    }
  }
}

/** Shares an account has in open exit requests (for the reads that need it outside `reads.ts`). */
export const openExitShares = (account: AccountState) => account.exits.filter((exit) => exit.claimedAt === null).reduce((sum, exit) => sum + exitSharesLeft(exit), 0);
