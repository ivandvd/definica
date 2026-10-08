"use client";

import { Popover } from "@base-ui/react/popover";
import { ArrowUpRight, Check, ChevronDown, Copy, LogOut, Repeat, Settings, Wallet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FEATURES } from "../lib/features";
import { shortAddress } from "../lib/format";
import type { Asset } from "../lib/types";
import { chainName } from "../lib/wallet";
import { useDevTools } from "../lib/devtools";
import { useDapp } from "../providers/DappProvider";
import { Amount } from "../ui/Amount";
import { AddressAvatar } from "../ui/brand";
import { Button } from "../ui/Button";
import { Sheet } from "../ui/Dialog";
import { AssetBadge } from "../ui/Glyph";
import { useIsDesktop } from "../ui/useMediaQuery";
import { ConnectDialog } from "./ConnectDialog";

const EXPLORER_ADDRESS = "https://etherscan.io/address/";

const rowClass =
  "flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-sm font-medium text-ink transition-colors hover:bg-canvas disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-ink-3";

/** The connected account: balances, network and what can be done with the connection. */
function WalletPanel({ onDone }: { onDone: () => void }) {
  const { env, wallet, data, disconnect, wrongNetwork, switchToEthereum } = useDapp();
  const [copied, setCopied] = useState(false);
  const devTools = useDevTools();
  if (!wallet.address) return null;
  const account = env.wallet.accounts.find((item) => item.address === wallet.address);
  // The other test accounts, with the developer tools on.
  const others = devTools ? env.wallet.accounts.filter((item) => item.address !== wallet.address) : [];
  const balances = data.balances;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address ?? "");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be refused; the address stays visible above.
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 px-1 pb-3">
        <AddressAvatar address={wallet.address} className="size-11" />
        <div className="min-w-0">
          <div className="text-sm font-bold">{wallet.ensName ?? account?.label ?? "Connected"}</div>
          <div className="text-xs text-ink-2 tabular">{shortAddress(wallet.address, 6)}</div>
        </div>
      </div>

      <div className="rounded-[14px] bg-canvas p-3">
        <div className="mb-2 flex items-center justify-between text-xs text-ink-2">
          <span>Wallet</span>
          <span className={cn("flex items-center gap-1.5 font-semibold", wrongNetwork ? "text-red" : "text-ink")}>
            <span className={cn("size-1.5 rounded-full", wrongNetwork ? "bg-red" : "bg-green")} aria-hidden="true" />
            {chainName(wallet.chainId)}
          </span>
        </div>
        {(FEATURES.liquidity || FEATURES.borrowing ? (["ETH", "osETH", "aEthosETH"] as Asset[]) : (["ETH"] as Asset[])).map((asset) => (
          <div key={asset} className="flex items-center justify-between py-1 text-sm">
            <span className="flex items-center gap-2">
              <AssetBadge asset={asset} size={22} />
              {asset}
            </span>
            {balances ? <Amount value={balances[asset as keyof typeof balances]} className="font-semibold" /> : <span className="skeleton h-4 w-14" />}
          </div>
        ))}
      </div>

      {wrongNetwork ? (
        <Button block className="mt-2" loading={wallet.busy} onClick={() => void switchToEthereum()}>
          Switch to Ethereum
        </Button>
      ) : null}

      <div className="mt-2 flex flex-col">
        <button type="button" className={rowClass} onClick={() => void copy()}>
          {copied ? <Check className="!text-green-ink" /> : <Copy />}
          {copied ? "Copied" : "Copy address"}
        </button>
        <a className={rowClass} href={`${EXPLORER_ADDRESS}${wallet.address}`} target="_blank" rel="noreferrer">
          <ArrowUpRight />
          View on Etherscan
        </a>
        <Link className={rowClass} href="/app/settings" onClick={onDone}>
          <Settings />
          Settings
        </Link>
      </div>

      {others.length ? (
        <div className="mt-1 border-t border-line-soft pt-1">
          <div className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-ink-3 uppercase">Test accounts</div>
          {others.map((item) => (
            <button
              key={item.address}
              type="button"
              className={rowClass}
              disabled={wallet.busy}
              onClick={() => {
                onDone();
                void env.wallet.switchAccount(item.address);
              }}
            >
              <Repeat />
              <span className="min-w-0 flex-1">
                <span className="block truncate">Switch to {item.label}</span>
                {item.description ? <span className="block truncate text-xs font-normal text-ink-3">{item.description}</span> : null}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-1 border-t border-line-soft pt-1">
        <button
          type="button"
          className={cn(rowClass, "text-red [&_svg]:text-red")}
          onClick={() => {
            onDone();
            void disconnect();
          }}
        >
          <LogOut />
          Disconnect
        </button>
      </div>
    </div>
  );
}

/** Connect, or the connected account with its menu (a popover in the wide layout, a sheet on phones). */
export function WalletButton() {
  const { wallet, connected, data } = useDapp();
  const desktop = useIsDesktop();
  const [chooser, setChooser] = useState(false);
  const [open, setOpen] = useState(false);

  if (!connected || !wallet.address) {
    const connecting = wallet.status === "connecting";
    return (
      <>
        <Button icon={<Wallet />} loading={connecting} onClick={() => setChooser(true)}>
          <span className="hidden sm:inline">{connecting ? "Connecting…" : "Connect wallet"}</span>
          <span className="sm:hidden">{connecting ? "Connecting" : "Connect"}</span>
        </Button>
        <ConnectDialog open={chooser} onOpenChange={setChooser} />
      </>
    );
  }

  const trigger = (
    <>
      <AddressAvatar address={wallet.address} className="size-7" />
      <span className="hidden tabular xl:inline">
        {data.balances ? <Amount value={data.balances.ETH} asset="ETH" digits={2} /> : null}
      </span>
      <span className="hidden text-ink-2 tabular sm:inline">{wallet.ensName ?? shortAddress(wallet.address)}</span>
      <ChevronDown className="hidden size-4 text-ink-3 sm:block" aria-hidden="true" />
    </>
  );
  const triggerClass =
    "flex h-10 items-center gap-2 rounded-control bg-card pr-1.5 pl-1.5 text-sm font-semibold text-ink shadow-[inset_0_0_0_1px_var(--color-line)] transition-colors hover:bg-canvas-2 data-[popup-open]:bg-canvas-2 sm:pr-2.5";

  if (desktop) {
    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger className={triggerClass} aria-label="Wallet">
          {trigger}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={8} align="end" className="z-50">
            <Popover.Popup className="w-[320px] rounded-[20px] bg-card p-3 shadow-pop outline-none transition-[opacity,scale] duration-150 data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0">
              <WalletPanel onDone={() => setOpen(false)} />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    );
  }

  return (
    <>
      <button type="button" className={triggerClass} onClick={() => setOpen(true)} aria-label="Wallet">
        {trigger}
      </button>
      <Sheet open={open} onOpenChange={setOpen} title="Wallet" surface="card">
        <WalletPanel onDone={() => setOpen(false)} />
      </Sheet>
    </>
  );
}
