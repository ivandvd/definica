import { PreviewProtocolClient, type PreviewControls } from "./mock/client";
import { PreviewWalletAdapter, type WalletRequest } from "./mock/wallet";
import type { ProtocolClient } from "./protocol";
import type { WalletAdapter } from "./wallet";

/** What the app runs on: a wallet, a protocol client and, in the preview, the preview's own controls. */
export interface PreviewWallet {
  setWalletChain: (chainId: number) => void;
  /** The request waiting in the preview wallet, for its confirm window. */
  getRequest: () => WalletRequest | null;
  subscribeRequests: (listener: () => void) => () => void;
  respond: (approved: boolean) => void;
}

export interface DappEnvironment {
  wallet: WalletAdapter;
  protocol: ProtocolClient;
  preview: (PreviewControls & PreviewWallet) | null;
}

/**
 * The preview environment: sample accounts on a simulated chain. Nothing reaches a network. An
 * onchain environment (wagmi + viem with the published addresses) returns the same shape with
 * `preview: null`.
 */
export function createPreviewEnvironment(): DappEnvironment {
  const wallet = new PreviewWalletAdapter();
  const protocol = new PreviewProtocolClient((request) => wallet.requestApproval(request));
  return {
    wallet,
    protocol,
    preview: {
      getSim: () => protocol.getSim(),
      setSim: (patch) => protocol.setSim(patch),
      advance: (days) => protocol.advance(days),
      reset: () => protocol.reset(),
      setWalletChain: (chainId) => wallet.setWalletChain(chainId),
      getRequest: wallet.getRequest,
      subscribeRequests: wallet.subscribeRequests,
      respond: wallet.respond,
    },
  };
}
