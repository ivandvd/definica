import { ACTION_PHASE, ProtocolError, type Action, type ActionPreview, type OnTxProgress, type ProtocolClient } from "../protocol";
import type { ActivityItem, Address, Balances, Eligibility, TxReceipt } from "../types";
import { applyAction, previewAction, revertReason } from "./actions";
import {
  readActivity,
  readAppStatus,
  readBorrowPositions,
  readExits,
  readLendPosition,
  readLiquidity,
  readLiquidityPosition,
  readLocks,
  readMarkets,
  readPhases,
  readPosition,
  readVault,
  TERMS_VERSION,
} from "./reads";
import type { WalletRequest } from "./wallet";
import { blockAt, catchUp, clearWorld, DAY, loadWorld, nextHash, nextId, saveWorld, seedWorld, worldNow, type SimSettings, type World } from "./world";

/** How long the preview takes to read and to "mine", so every loading state shows. Signing waits for you. */
const READ_DELAY = 180;
const MINING_DELAY = 2_400;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const EMPTY_BALANCES: Balances = { ETH: 0, osETH: 0, aEthosETH: 0, WETH: 0 };

/** The preview's own controls: what Settings → Preview tools drives. */
export interface PreviewControls {
  getSim(): SimSettings;
  setSim(patch: Partial<SimSettings>): void;
  /** Moves the clock forward, applying every harvest on the way. */
  advance(days: number): void;
  /** Throws the preview world away and starts again from the seed. */
  reset(): void;
}

/**
 * The preview protocol: a simulated chain (world.ts) with realistic delays, so every screen, state
 * and transaction flow can be exercised before any contract address is published.
 */
/** Asks the preview wallet to sign a step; resolves with the user's answer. */
export type Approver = (request: Omit<WalletRequest, "id">) => Promise<boolean>;

export class PreviewProtocolClient implements ProtocolClient, PreviewControls {
  readonly mode = "preview" as const;
  private state: World | null = null;
  private readonly listeners = new Set<() => void>();

  constructor(private readonly approve: Approver) {}

  /** The world, loaded (or seeded) on first use in the browser and caught up to the clock. */
  private get world(): World {
    if (!this.state) {
      this.state = loadWorld() ?? seedWorld(Date.now());
      catchUp(this.state, worldNow(this.state));
      saveWorld(this.state);
    }
    return this.state;
  }

  private changed() {
    saveWorld(this.world);
    this.listeners.forEach((listener) => listener());
  }

  private account(address: Address | null) {
    return address ? (this.world.accounts[address] ?? null) : null;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  now() {
    return worldNow(this.world);
  }

  /* ---------- preview controls ---------- */

  getSim() {
    return this.world.sim;
  }

  setSim(patch: Partial<SimSettings>) {
    this.world.sim = { ...this.world.sim, ...patch, phases: { ...this.world.sim.phases, ...patch.phases } };
    this.changed();
  }

  advance(days: number) {
    this.world.clockOffset += days * DAY;
    catchUp(this.world, worldNow(this.world));
    this.changed();
  }

  reset() {
    clearWorld();
    this.state = seedWorld(Date.now());
    this.changed();
  }

  /* ---------- reads ---------- */

  async getAppStatus() {
    await wait(READ_DELAY / 2);
    return readAppStatus(this.world);
  }

  async getPhases() {
    return readPhases(this.world);
  }

  async getVault() {
    await wait(READ_DELAY);
    return readVault(this.world, this.now());
  }

  async getLiquidity() {
    await wait(READ_DELAY);
    return readLiquidity(this.world);
  }

  async getMarkets() {
    await wait(READ_DELAY);
    return readMarkets(this.world);
  }

  async getEligibility(address: Address): Promise<Eligibility> {
    await wait(READ_DELAY / 2);
    return { status: this.world.sim.restriction, termsVersion: TERMS_VERSION, acceptedTermsVersion: this.account(address)?.termsAccepted ?? null };
  }

  async acceptTerms(address: Address, version: string) {
    const account = this.account(address);
    if (!account) return;
    account.termsAccepted = version;
    this.changed();
  }

  async getBalances(address: Address) {
    await wait(READ_DELAY / 2);
    return { ...(this.account(address)?.balances ?? EMPTY_BALANCES) };
  }

  async getPosition(address: Address) {
    await wait(READ_DELAY);
    const account = this.account(address);
    return account ? readPosition(this.world, account, this.now()) : null;
  }

  async getExitRequests(address: Address) {
    await wait(READ_DELAY);
    const account = this.account(address);
    return account ? readExits(account, this.now()) : [];
  }

  async getLocks(address: Address) {
    await wait(READ_DELAY);
    const account = this.account(address);
    return account ? readLocks(account, this.now()) : [];
  }

  async getLiquidityPosition(address: Address) {
    await wait(READ_DELAY);
    const account = this.account(address);
    return account
      ? readLiquidityPosition(this.world, account, this.now())
      : { locked: 0, lockedValueEth: 0, commitments: [], returns: [], obligations: [], history: [] };
  }

  async getBorrowPositions(address: Address) {
    await wait(READ_DELAY);
    const account = this.account(address);
    return account ? readBorrowPositions(this.world, account) : [];
  }

  async getLendPosition(address: Address) {
    await wait(READ_DELAY);
    const account = this.account(address);
    return account ? readLendPosition(this.world, account) : null;
  }

  async getActivity(address: Address): Promise<ActivityItem[]> {
    await wait(READ_DELAY);
    const account = this.account(address);
    return account ? readActivity(account) : [];
  }

  /* ---------- actions ---------- */

  async preview(address: Address | null, action: Action): Promise<ActionPreview> {
    return previewAction(this.world, this.account(address), action, this.now());
  }

  async execute(address: Address, action: Action, onProgress: OnTxProgress): Promise<TxReceipt> {
    const account = this.account(address);
    if (!account) throw new ProtocolError("This wallet has no account here.", "invalid");
    const preview = previewAction(this.world, account, action, this.now());
    if (preview.problem) throw new ProtocolError(preview.problem.message, preview.problem.code);

    // The preview tools can make this one transaction fail; the setting resets once used.
    const outcome = this.world.sim.nextTx;
    if (outcome !== "succeed") this.setSim({ nextTx: "succeed" });

    const { steps } = preview;
    const hashes: TxReceipt["hashes"] = [];
    const lastTx = steps.map((step) => step.kind).lastIndexOf("transaction");
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      onProgress({ phase: "wallet", step: i + 1, total: steps.length, label: step.label });
      // The preview wallet shows the request; nothing moves until it's confirmed there.
      const approved = await this.approve({
        kind: step.kind,
        label: step.label,
        action: steps[lastTx]?.label ?? step.label,
        step: i + 1,
        total: steps.length,
        contract: preview.contract.name,
        method: preview.contract.method,
        sends: i === lastTx ? preview.gives : [],
        feeEth: step.kind === "transaction" ? preview.networkFeeEth : 0,
      });
      if (!approved) throw new ProtocolError("You rejected the request in your wallet. Nothing was sent.", "rejected");
      if (step.kind !== "transaction") continue;
      const hash = nextHash(this.world);
      onProgress({ phase: "pending", step: i + 1, total: steps.length, label: step.label, hash });
      await wait(MINING_DELAY);
      hashes.push(hash);
      if (outcome === "revert") {
        const now = this.now();
        account.balances.ETH = Math.max(0, account.balances.ETH - preview.networkFeeEth);
        account.activity.push({
          id: nextId(this.world, "act"),
          kind: KIND_OF[action.type],
          phase: ACTION_PHASE[action.type],
          at: now,
          amount: preview.gives[0]?.amount ?? preview.gets[0]?.amount ?? null,
          asset: preview.gives[0]?.asset ?? preview.gets[0]?.asset ?? null,
          direction: "none",
          status: "failed",
          hash,
          note: "Nothing moved · network fee spent",
          block: blockAt(now),
          feeEth: preview.networkFeeEth,
        });
        this.changed();
        throw new ProtocolError(revertReason(action), "reverted");
      }
    }

    const now = this.now();
    const hash = hashes[hashes.length - 1];
    applyAction(this.world, account, action, now, hash, preview.networkFeeEth);
    for (const item of account.activity) if (item.hash === hash) item.feeEth = preview.networkFeeEth;
    this.changed();
    return { hash, hashes, at: now };
  }
}

const KIND_OF: Record<Action["type"], ActivityItem["kind"]> = {
  stake: "deposit",
  requestExit: "exit-request",
  claimExits: "exit-claim",
  createLock: "lock",
  releaseLocks: "lock-release",
  commit: "commit",
  releaseCommitment: "commit-release",
  repayFunding: "funding-repay",
  withdrawToOseth: "aave-withdraw",
  supplyCollateral: "collateral-supply",
  withdrawCollateral: "collateral-withdraw",
  borrow: "borrow",
  repay: "repay",
  supplyEth: "eth-supply",
  withdrawEth: "eth-withdraw",
};
