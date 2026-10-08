"use client";

import { Toast } from "@base-ui/react/toast";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPreviewEnvironment, type DappEnvironment } from "../lib/environment";
import { preferencesStore, type Preferences } from "../lib/preferences";
import { ProtocolError, type Action, type ProtocolErrorCode } from "../lib/protocol";
import type {
  ActivityItem,
  Address,
  AppStatus,
  Balances,
  BorrowPosition,
  Eligibility,
  ExitRequest,
  Hash,
  LendPosition,
  LiquidityInfo,
  LiquidityPosition,
  LockPosition,
  Market,
  PhaseInfo,
  Position,
  TxReceipt,
  VaultInfo,
} from "../lib/types";
import { DISCONNECTED_WALLET, SUPPORTED_CHAIN_ID, type WalletState } from "../lib/wallet";

/* ---------- data ---------- */

interface PublicData {
  status: AppStatus;
  phases: PhaseInfo[];
  vault: VaultInfo;
  liquidity: LiquidityInfo;
  markets: Market[];
  now: number;
  /** When it was read (real time), for "updated N s ago". */
  readAt: number;
}

interface AccountData {
  address: Address;
  eligibility: Eligibility;
  balances: Balances;
  position: Position | null;
  exits: ExitRequest[];
  locks: LockPosition[];
  liquidityPosition: LiquidityPosition;
  borrowPositions: BorrowPosition[];
  lendPosition: LendPosition | null;
  activity: ActivityItem[];
  now: number;
}

export interface DappData {
  status: AppStatus | null;
  phases: PhaseInfo[];
  vault: VaultInfo | null;
  liquidity: LiquidityInfo | null;
  markets: Market[];
  eligibility: Eligibility | null;
  balances: Balances | null;
  position: Position | null;
  exits: ExitRequest[];
  locks: LockPosition[];
  liquidityPosition: LiquidityPosition | null;
  borrowPositions: BorrowPosition[];
  lendPosition: LendPosition | null;
  activity: ActivityItem[];
  /** The protocol's clock when the data was read: durations and countdowns measure from it. */
  now: number;
  readAt: number;
}

/* ---------- transactions ---------- */

export interface TxLabels {
  /** The review's title, and the record's name in toasts and the activity list: "Stake ETH". */
  title: string;
  /** The outcome: "Staked". */
  successTitle: string;
  /** One sentence on what happens next. */
  successText: string;
}

export type TxStatus = "wallet" | "pending" | "updating" | "confirmed" | "failed";

export interface TxError {
  code: ProtocolErrorCode | "unknown";
  message: string;
}

export interface TxRecord {
  id: string;
  address: Address;
  action: Action;
  labels: TxLabels;
  status: TxStatus;
  step: number;
  total: number;
  stepLabel: string;
  hash: Hash | null;
  hashes: Hash[];
  startedAt: number;
  finishedAt: number | null;
  receipt: TxReceipt | null;
  error: TxError | null;
}

/** How long "Updating your position" shows at least, so the moment between pending and done reads. */
const UPDATING_MIN_MS = 650;

const toTxError = (error: unknown): TxError =>
  error instanceof ProtocolError
    ? { code: error.code, message: error.message }
    : { code: "unknown", message: error instanceof Error && error.message ? error.message : "The transaction could not be completed." };

/* ---------- context ---------- */

export interface DappContextValue {
  env: DappEnvironment;
  wallet: WalletState;
  /** Connected to an account (on any network). */
  connected: boolean;
  /** Connected, but on a network other than Ethereum. */
  wrongNetwork: boolean;
  data: DappData;
  /** Protocol-wide figures have not arrived yet. */
  publicLoading: boolean;
  /** The connected account's figures have not arrived yet. */
  accountLoading: boolean;
  loadError: string | null;
  refresh: () => Promise<void>;
  connect: (connectorId: string, options?: { acceptTerms?: boolean }) => Promise<void>;
  disconnect: () => Promise<void>;
  switchToEthereum: () => Promise<void>;
  acceptTerms: () => Promise<void>;
  preferences: Preferences;
  setPreferences: (patch: Partial<Preferences>) => void;
  txs: TxRecord[];
  runTx: (action: Action, labels: TxLabels) => string;
  /** Marks a transaction as on screen, so its outcome doesn't also raise a toast. */
  watchTx: (id: string) => () => void;
  clearTx: (id: string) => void;
  /** The transaction whose receipt is open (by hash), and how to open or close it. */
  receipt: Hash | null;
  openReceipt: (hash: Hash) => void;
  closeReceipt: () => void;
  toasts: ReturnType<typeof Toast.createToastManager>;
}

const DappContext = createContext<DappContextValue | null>(null);

const getDisconnected = () => DISCONNECTED_WALLET;
const REFRESH_INTERVAL = 60_000;

/** Holds the wallet, the protocol client, everything loaded from them and the transactions in flight. */
export function DappProvider({ children, environment }: { children: ReactNode; environment?: DappEnvironment }) {
  const [env] = useState(() => environment ?? createPreviewEnvironment());
  const [toasts] = useState(() => Toast.createToastManager());
  const wallet = useSyncExternalStore(env.wallet.subscribe, env.wallet.getState, getDisconnected);
  const preferences = useSyncExternalStore(preferencesStore.subscribe, preferencesStore.get, preferencesStore.getServer);
  const [publicData, setPublicData] = useState<PublicData | null>(null);
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [txs, setTxs] = useState<TxRecord[]>([]);
  const [receipt, setReceipt] = useState<Hash | null>(null);
  const openReceipt = useCallback((hash: Hash) => setReceipt(hash), []);
  const closeReceipt = useCallback(() => setReceipt(null), []);
  const publicLoad = useRef(0);
  const accountLoad = useRef(0);
  const txSeq = useRef(0);
  const txHashes = useRef(new Map<string, Hash>());
  const hashOf = (id: string) => txHashes.current.get(id) ?? null;
  const watched = useRef(new Set<string>());
  const termsOnConnect = useRef(false);
  const previousStatus = useRef(wallet.status);

  const address = wallet.status === "connected" ? wallet.address : null;

  useEffect(() => {
    env.wallet.restore();
  }, [env]);

  const refreshPublic = useCallback(() => {
    const id = ++publicLoad.current;
    const { protocol } = env;
    return Promise.all([protocol.getAppStatus(), protocol.getPhases(), protocol.getVault(), protocol.getLiquidity(), protocol.getMarkets()])
      .then(([status, phases, vault, liquidity, markets]) => {
        if (id !== publicLoad.current) return;
        setPublicData({ status, phases, vault, liquidity, markets, now: protocol.now(), readAt: Date.now() });
        setLoadError(null);
      })
      .catch(() => {
        if (id === publicLoad.current) setLoadError("The app couldn't read the protocol. Check your connection and try again.");
      });
  }, [env]);

  const refreshAccount = useCallback(() => {
    const id = ++accountLoad.current;
    if (!address) return Promise.resolve();
    const { protocol } = env;
    return Promise.all([
      protocol.getEligibility(address),
      protocol.getBalances(address),
      protocol.getPosition(address),
      protocol.getExitRequests(address),
      protocol.getLocks(address),
      protocol.getLiquidityPosition(address),
      protocol.getBorrowPositions(address),
      protocol.getLendPosition(address),
      protocol.getActivity(address),
    ])
      .then(([eligibility, balances, position, exits, locks, liquidityPosition, borrowPositions, lendPosition, activity]) => {
        if (id !== accountLoad.current) return;
        setAccount({ address, eligibility, balances, position, exits, locks, liquidityPosition, borrowPositions, lendPosition, activity, now: protocol.now() });
        setLoadError(null);
      })
      .catch(() => {
        if (id === accountLoad.current) setLoadError("The app couldn't read your position. Check your connection and try again.");
      });
  }, [env, address]);

  const refresh = useCallback(() => Promise.all([refreshPublic(), refreshAccount()]).then(() => undefined), [refreshPublic, refreshAccount]);

  useEffect(() => {
    void refreshPublic();
  }, [refreshPublic]);

  useEffect(() => {
    void refreshAccount();
  }, [refreshAccount]);

  // Data that changes without a transaction (a harvest, the preview controls) reloads everything.
  useEffect(() => env.protocol.subscribe(() => void refresh()), [env, refresh]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, REFRESH_INTERVAL);
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  // The Terms ticked in the connect dialog are recorded once the connection completes.
  useEffect(() => {
    const before = previousStatus.current;
    previousStatus.current = wallet.status;
    if (before !== "connected" && wallet.status === "connected" && wallet.address) {
      if (termsOnConnect.current) {
        termsOnConnect.current = false;
        const target = wallet.address;
        void env.protocol
          .getEligibility(target)
          .then((eligibility) => env.protocol.acceptTerms(target, eligibility.termsVersion))
          .then(() => refreshAccount());
      }
    }
  }, [wallet.status, wallet.address, env, refreshAccount]);

  const connect = useCallback(
    (connectorId: string, options?: { acceptTerms?: boolean }) => {
      termsOnConnect.current = Boolean(options?.acceptTerms);
      return env.wallet.connect(connectorId);
    },
    [env],
  );

  const acceptTerms = useCallback(async () => {
    if (!address) return;
    const eligibility = await env.protocol.getEligibility(address);
    await env.protocol.acceptTerms(address, eligibility.termsVersion);
    await refreshAccount();
  }, [env, address, refreshAccount]);

  const watchTx = useCallback((id: string) => {
    watched.current.add(id);
    return () => {
      watched.current.delete(id);
    };
  }, []);

  const clearTx = useCallback((id: string) => setTxs((list) => list.filter((record) => record.id !== id)), []);

  const runTx = useCallback(
    (action: Action, labels: TxLabels) => {
      if (!address) throw new Error("Connect a wallet first.");
      const id = `tx-${++txSeq.current}`;
      const startedAt = Date.now();
      const update = (patch: Partial<TxRecord>) => setTxs((list) => list.map((record) => (record.id === id ? { ...record, ...patch } : record)));
      setTxs((list) =>
        [
          {
            id,
            address,
            action,
            labels,
            status: "wallet" as const,
            step: 1,
            total: 1,
            stepLabel: "",
            hash: null,
            hashes: [],
            startedAt,
            finishedAt: null,
            receipt: null,
            error: null,
          },
          ...list,
        ].slice(0, 20),
      );

      env.protocol
        .execute(address, action, (progress) => {
          if (progress.phase === "wallet") update({ status: "wallet", step: progress.step, total: progress.total, stepLabel: progress.label });
          else txHashes.current.set(id, progress.hash);
          if (progress.phase === "pending")
            setTxs((list) =>
              list.map((record) =>
                record.id === id
                  ? { ...record, status: "pending", step: progress.step, total: progress.total, stepLabel: progress.label, hash: progress.hash, hashes: [...record.hashes, progress.hash] }
                  : record,
              ),
            );
        })
        .then(async (receipt) => {
          update({ status: "updating", receipt, hash: receipt.hash, hashes: receipt.hashes });
          // If only this read fails, the transaction still succeeded: say so, so nobody sends it twice.
          // The read can be instant; the check landing on the block still gets its moment.
          await Promise.all([refresh().catch(() => undefined), new Promise((resolve) => window.setTimeout(resolve, UPDATING_MIN_MS))]);
          update({ status: "confirmed", finishedAt: Date.now() });
          const onScreen = watched.current.has(id);
          // On a phone the result fills the screen, and a toast would only cover its picture.
          if (!onScreen || window.matchMedia("(min-width: 1024px)").matches)
            toasts.add({
              title: labels.successTitle,
              description: onScreen ? "Confirmed on Ethereum." : labels.successText,
              type: "success",
              timeout: 6000,
              actionProps: { children: "View transaction", onClick: () => setReceipt(receipt.hash) },
            });
        })
        .catch((error: unknown) => {
          const txError = toTxError(error);
          update({ status: "failed", error: txError, finishedAt: Date.now() });
          if (txError.code === "reverted") void refresh();
          // On screen, the flow shows the failure itself; otherwise say so here.
          if (!watched.current.has(id))
            toasts.add({
              title: txError.code === "rejected" ? "Request rejected" : `${labels.title} failed`,
              description: txError.message,
              type: "error",
              priority: "high",
              actionProps: txError.code === "reverted" && hashOf(id) ? { children: "View transaction", onClick: () => setReceipt(hashOf(id)!) } : undefined,
            });
        });
      return id;
    },
    [env, address, refresh, toasts],
  );

  const current = account && account.address === address ? account : null;

  const data = useMemo<DappData>(
    () => ({
      status: publicData?.status ?? null,
      phases: publicData?.phases ?? [],
      vault: publicData?.vault ?? null,
      liquidity: publicData?.liquidity ?? null,
      markets: publicData?.markets ?? [],
      eligibility: current?.eligibility ?? null,
      balances: current?.balances ?? null,
      position: current?.position ?? null,
      exits: current?.exits ?? [],
      locks: current?.locks ?? [],
      liquidityPosition: current?.liquidityPosition ?? null,
      borrowPositions: current?.borrowPositions ?? [],
      lendPosition: current?.lendPosition ?? null,
      activity: current?.activity ?? [],
      now: Math.max(current?.now ?? 0, publicData?.now ?? 0),
      readAt: publicData?.readAt ?? 0,
    }),
    [publicData, current],
  );

  const value = useMemo<DappContextValue>(
    () => ({
      env,
      wallet,
      connected: address !== null,
      wrongNetwork: address !== null && wallet.chainId !== SUPPORTED_CHAIN_ID,
      data,
      publicLoading: publicData === null,
      accountLoading: address !== null && current === null,
      loadError,
      refresh,
      connect,
      disconnect: () => env.wallet.disconnect(),
      switchToEthereum: () => env.wallet.switchChain(SUPPORTED_CHAIN_ID),
      acceptTerms,
      preferences,
      setPreferences: preferencesStore.set,
      txs: txs.filter((record) => record.address === address),
      runTx,
      watchTx,
      clearTx,
      toasts,
      receipt,
      openReceipt,
      closeReceipt,
    }),
    [env, wallet, address, data, publicData, current, loadError, refresh, connect, acceptTerms, preferences, txs, runTx, watchTx, clearTx, toasts, receipt, openReceipt, closeReceipt],
  );

  return (
    <Toast.Provider toastManager={toasts} limit={3}>
      <DappContext.Provider value={value}>{children}</DappContext.Provider>
    </Toast.Provider>
  );
}

export function useDapp() {
  const context = useContext(DappContext);
  if (!context) throw new Error("useDapp must be used inside <DappProvider>");
  return context;
}

export const useDappData = () => useDapp().data;
export const usePreferences = () => useDapp().preferences;
