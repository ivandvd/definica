import { FEATURES } from "../features";
import type { Address, AssetAmount } from "../types";
import { DISCONNECTED_WALLET, SUPPORTED_CHAIN_ID, type WalletAccount, type WalletAdapter, type WalletConnector, type WalletState } from "../wallet";
import { PREVIEW_ADDRESSES } from "./world";

const STORAGE_KEY = "definica.app.wallet";

const CONNECTORS: WalletConnector[] = [
  { id: "injected", name: "Browser wallet", description: "MetaMask, Rabby or another extension" },
  { id: "walletconnect", name: "WalletConnect", description: "Scan a code with a mobile wallet" },
  { id: "coinbase", name: "Coinbase Wallet", description: "The Coinbase Wallet app or extension" },
];

export const PREVIEW_ACCOUNTS: WalletAccount[] = [
  { address: PREVIEW_ADDRESSES.full, label: "Main account", description: "A staked position with exits and locks waiting" },
  { address: PREVIEW_ADDRESSES.fresh, label: "New account", description: "1.25 ETH and no position yet" },
  { address: PREVIEW_ADDRESSES.locked, label: "All locks in use", description: "Ten lock positions open, two matured" },
  ...(FEATURES.borrowing ? [{ address: PREVIEW_ADDRESSES.atRisk, label: "Borrower at risk", description: "A loan close to its liquidation threshold" }] : []),
];

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** What the preview wallet shows before you sign: the request, as a browser wallet would. */
export interface WalletRequest {
  id: number;
  kind: "signature" | "transaction";
  /** The step's own label ("Approve osETH", "Stake ETH") and the action it belongs to. */
  label: string;
  action: string;
  step: number;
  total: number;
  contract: string;
  method: string;
  /** What leaves the wallet with this request, if anything. */
  sends: AssetAmount[];
  feeEth: number;
}

interface Session {
  address: Address;
  connectorId: string;
  chainId: number;
}

/** A wallet that connects to nothing: it switches between the preview accounts and remembers the session. */
export class PreviewWalletAdapter implements WalletAdapter {
  readonly connectors = CONNECTORS;
  readonly accounts = PREVIEW_ACCOUNTS;
  private state: WalletState = DISCONNECTED_WALLET;
  private readonly listeners = new Set<() => void>();
  private lastAddress: Address = PREVIEW_ACCOUNTS[0].address;
  private pending: { request: WalletRequest; resolve: (approved: boolean) => void } | null = null;
  private requestSeq = 0;
  private readonly requestListeners = new Set<() => void>();

  getState = () => this.state;

  /* ---------- requests (preview only) ---------- */

  getRequest = () => this.pending?.request ?? null;

  subscribeRequests = (listener: () => void) => {
    this.requestListeners.add(listener);
    return () => {
      this.requestListeners.delete(listener);
    };
  };

  /** Shows a request in the preview wallet and resolves with the user's answer. */
  requestApproval(request: Omit<WalletRequest, "id">): Promise<boolean> {
    this.pending?.resolve(false);
    return new Promise<boolean>((resolve) => {
      this.pending = { request: { ...request, id: ++this.requestSeq }, resolve };
      this.requestListeners.forEach((listener) => listener());
    });
  }

  respond = (approved: boolean) => {
    const pending = this.pending;
    if (!pending) return;
    this.pending = null;
    this.requestListeners.forEach((listener) => listener());
    pending.resolve(approved);
  };

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  restore = () => {
    const session = this.read();
    if (!session || !this.accounts.some((account) => account.address === session.address)) return;
    this.lastAddress = session.address;
    this.set({ status: "connected", address: session.address, ensName: null, chainId: session.chainId, connectorId: session.connectorId, busy: false });
  };

  async connect(connectorId: string) {
    if (this.state.status === "connecting") return;
    this.set({ ...DISCONNECTED_WALLET, status: "connecting", connectorId, busy: true });
    await wait(900);
    this.set({ status: "connected", address: this.lastAddress, ensName: null, chainId: SUPPORTED_CHAIN_ID, connectorId, busy: false });
    this.persist();
  }

  async disconnect() {
    this.respond(false);
    await wait(150);
    this.set(DISCONNECTED_WALLET);
    this.write(null);
  }

  async switchAccount(address: Address) {
    if (this.state.status !== "connected" || !this.accounts.some((account) => account.address === address)) return;
    this.set({ ...this.state, busy: true });
    await wait(350);
    this.lastAddress = address;
    this.set({ ...this.state, address, busy: false });
    this.persist();
  }

  async switchChain(chainId: number) {
    if (this.state.status !== "connected") return;
    this.set({ ...this.state, busy: true });
    await wait(900);
    this.set({ ...this.state, chainId, busy: false });
    this.persist();
  }

  /** Preview only: the network changing on the wallet's side, as when someone switches in MetaMask. */
  setWalletChain(chainId: number) {
    if (this.state.status !== "connected") return;
    this.set({ ...this.state, chainId });
    this.persist();
  }

  private set(next: WalletState) {
    this.state = next;
    this.listeners.forEach((listener) => listener());
  }

  private persist() {
    const { address, connectorId, chainId } = this.state;
    if (address && connectorId) this.write({ address, connectorId, chainId });
  }

  private read(): Session | null {
    if (typeof window === "undefined") return null;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Session) : null;
    } catch {
      return null;
    }
  }

  private write(session: Session | null) {
    if (typeof window === "undefined") return;
    try {
      if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage can be unavailable (private mode); the session is simply not remembered.
    }
  }
}
