"use client";

import { ChevronRight, Globe, QrCode, Wallet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDapp } from "../providers/DappProvider";
import { ResponsiveSheet } from "../ui/Dialog";
import { LINKS } from "./nav";

const CONNECTOR_ICONS = {
  injected: Globe,
  walletconnect: QrCode,
  coinbase: Wallet,
} as const;

/**
 * The wallet chooser. Connecting needs the Terms first: 18 or over, not sanctioned, not in a
 * restricted region, no VPN to get round one. The acceptance is recorded per address and asked for
 * again when the Terms change.
 */
export function ConnectDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { env, connect } = useDapp();
  const [accepted, setAccepted] = useState(false);

  return (
    <ResponsiveSheet open={open} onOpenChange={onOpenChange} title="Connect a wallet" description="Definica never asks for your seed phrase or private key.">
      <label
        className={cn(
          "flex cursor-pointer gap-3 rounded-[16px] bg-card p-4 text-[13px] leading-5 text-ink-2 transition-shadow",
          accepted && "shadow-[inset_0_0_0_1.5px_var(--color-ink)]",
        )}
      >
        <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-[#0f0f0f]" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
        <span>
          I am 18 or over, not subject to sanctions, not in a region where Definica is restricted and not using a VPN to get round a restriction. I accept the{" "}
          <Link href={LINKS.terms} className="font-semibold text-ink underline" target="_blank">
            Terms
          </Link>{" "}
          and have read the{" "}
          <Link href={LINKS.privacy} className="font-semibold text-ink underline" target="_blank">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      <div className="mt-3 flex flex-col gap-2" role="list">
        {env.wallet.connectors.map((connector) => {
          const Icon = CONNECTOR_ICONS[connector.id as keyof typeof CONNECTOR_ICONS] ?? Wallet;
          return (
            <button
              key={connector.id}
              type="button"
              role="listitem"
              disabled={!accepted}
              onClick={() => {
                onOpenChange(false);
                void connect(connector.id, { acceptTerms: true });
              }}
              className="group flex items-center gap-4 rounded-[16px] bg-card p-3.5 text-left transition-[box-shadow,opacity] hover:shadow-[inset_0_0_0_1.5px_var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:shadow-none"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-canvas transition-colors group-enabled:group-hover:bg-lime">
                <Icon className="size-5 text-ink" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{connector.name}</span>
                <span className="block text-xs text-ink-2">{connector.description}</span>
              </span>
              <ChevronRight className="size-4 text-ink-3" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      {!accepted ? <p className="mt-3 text-center text-xs text-ink-3">Tick the box above to choose a wallet.</p> : null}

    </ResponsiveSheet>
  );
}
