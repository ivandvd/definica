import type { Address } from "./types";

export type WalletStatus = "disconnected" | "connecting" | "connected";

export interface WalletConnector {
  id: string;
  name: string;
  description: string;
}

export interface WalletAccount {
  address: Address;
  label: string;
  /** What this account shows in the preview (its story), for the account switcher. */
  description?: string;
}

/** Definica runs on Ethereum mainnet; anything else is the wrong network. */
export const SUPPORTED_CHAIN_ID = 1;

export const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  11155111: "Sepolia",
  8453: "Base",
  42161: "Arbitrum One",
};

export const chainName = (chainId: number) => CHAIN_NAMES[chainId] ?? `Chain ${chainId}`;

export interface WalletState {
  status: WalletStatus;
  address: Address | null;
  ensName: string | null;
  chainId: number;
  connectorId: string | null;
  /** A request is waiting in the wallet (connecting, switching network, signing). */
  busy: boolean;
}

export const DISCONNECTED_WALLET: WalletState = {
  status: "disconnected",
  address: null,
  ensName: null,
  chainId: SUPPORTED_CHAIN_ID,
  connectorId: null,
  busy: false,
};

/**
 * The wallet the app talks to, as an external store. The preview wallet serves sample accounts; a
 * wagmi adapter implements the same surface in production (EIP-6963 browser wallets,
 * WalletConnect, Coinbase Wallet).
 */
export interface WalletAdapter {
  readonly connectors: WalletConnector[];
  /** Accounts the adapter can switch between, when it offers that (the preview does). */
  readonly accounts: WalletAccount[];
  getState(): WalletState;
  subscribe(listener: () => void): () => void;
  connect(connectorId: string): Promise<void>;
  disconnect(): Promise<void>;
  switchAccount(address: Address): Promise<void>;
  switchChain(chainId: number): Promise<void>;
  /** Re-establishes a previous session, if any; called once on the client after mount. */
  restore(): void;
}
