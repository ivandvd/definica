"use client";

import { Lock } from "lucide-react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { formatAmount, shortAddress } from "../lib/format";
import type { WalletRequest } from "../lib/mock/wallet";
import { useDapp } from "../providers/DappProvider";
import { AddressAvatar } from "../ui/brand";
import { Button } from "../ui/Button";
import { TokenIcon } from "../ui/Glyph";
import { RequestGlyph } from "../ui/txart";

const noop = () => () => undefined;
const none = () => null;

/**
 * The wallet window: every request the app makes waits here for you, as it would in a browser
 * wallet, with what it does, what it sends and the fee. Confirm signs; Reject (or Escape)
 * refuses. An onchain build uses the real wallet instead, so this renders nothing there.
 */
export function WalletPrompt() {
  const { env, wallet } = useDapp();
  const preview = env.preview;
  const request: WalletRequest | null = useSyncExternalStore(preview ? preview.subscribeRequests : noop, preview ? preview.getRequest : none, none);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const windowRef = useRef<HTMLElement>(null);

  // A click beside the window doesn't answer for you: the wallet stays, with a small shake.
  const nudge = () => {
    confirmRef.current?.focus({ preventScroll: true });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    windowRef.current?.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(5px)" }, { transform: "translateX(-3px)" }, { transform: "translateX(0)" }],
      { duration: 360, easing: "ease-out" },
    );
  };

  useEffect(() => {
    if (!request) return;
    confirmRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") preview?.respond(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [request, preview]);

  if (!preview || !request) return null;
  const signature = request.kind === "signature";
  // Named after the wallet chosen at connect, as its own window would be.
  const walletName = env.wallet.connectors.find((item) => item.id === wallet.connectorId)?.name ?? "Your wallet";

  // Its own node on <body>: a sheet open underneath hides the app from assistive tech, not this.
  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[80] flex items-end justify-center lg:items-start lg:justify-end lg:p-5 lg:pt-[78px]">
      <div className="pointer-events-auto absolute inset-0 animate-fade bg-[rgba(15,15,15,0.18)] lg:bg-transparent" onClick={nudge} aria-hidden="true" />
      <section
        key={request.id}
        ref={windowRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-request-title"
        className="pointer-events-auto relative w-full animate-[wallet-in_0.4s_var(--ease-out-soft)_both] rounded-t-[26px] bg-card p-5 pb-[max(20px,env(safe-area-inset-bottom))] shadow-pop lg:w-[372px] lg:rounded-[24px] lg:pb-5"
      >
        <header className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-[12px] bg-coral">
            <span className="h-3.5 w-5 rounded-[4px] border-[1.5px] border-ink bg-lime" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">{walletName}</span>
            <span className="flex items-center gap-1.5 text-xs text-ink-2">
              {wallet.address ? <AddressAvatar address={wallet.address} className="size-3.5 ring-0" /> : null}
              {wallet.address ? shortAddress(wallet.address) : null}
            </span>
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold">
            <span className="size-1.5 rounded-full bg-green" aria-hidden="true" />
            Ethereum
          </span>
        </header>

        <div className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-canvas py-1.5 text-xs text-ink-2">
          <Lock className="size-3" aria-hidden="true" />
          definica.com
        </div>

        <div className="mt-4 text-center">
          <RequestGlyph signature={signature} className="mx-auto" />
          <h2 id="wallet-request-title" className="mt-3 text-lg font-extrabold">
            {signature ? "Signature request" : "Confirm transaction"}
          </h2>
          <p className="mt-0.5 text-[13px] text-ink-2">
            {request.label}
            {request.total > 1 ? ` · step ${request.step} of ${request.total}` : ""}
          </p>
        </div>

        <div className="mt-4 rounded-[16px] bg-canvas px-4 py-1 text-sm">
          {request.sends.length ? (
            request.sends.map((item) => (
              <div key={item.asset} className="flex items-center justify-between gap-3 border-b border-line-soft py-3">
                <span className="text-ink-2">You send</span>
                <span className="figure flex items-center gap-2 font-extrabold">
                  {formatAmount(item.amount)} {item.asset === "shares" ? "shares" : item.asset}
                  <TokenIcon asset={item.asset} size={20} />
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-between gap-3 border-b border-line-soft py-3">
              <span className="text-ink-2">{signature ? "Permission" : "You send"}</span>
              <span className="font-semibold">{signature ? "Allow this exact amount" : "Nothing"}</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-3 border-b border-line-soft py-3">
            <span className="text-ink-2">Interacting with</span>
            <span className="font-semibold">Definica</span>
          </div>
          <div className="flex items-center justify-between gap-3 py-3">
            <span className="text-ink-2">Network fee</span>
            <span className="font-semibold">{signature ? "None, a signature" : `≈ ${formatAmount(request.feeEth)} ETH`}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button size="lg" variant="secondary" onClick={() => preview.respond(false)}>
            Reject
          </Button>
          <Button ref={confirmRef} size="lg" onClick={() => preview.respond(true)}>
            {signature ? "Sign" : "Confirm"}
          </Button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
