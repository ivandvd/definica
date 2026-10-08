"use client";

import { ArrowUpRight, Check, Copy, FlaskConical, LogOut, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useDevTools } from "../lib/devtools";
import { FEATURES } from "../lib/features";
import type { SimSettings } from "../lib/mock/world";
import { preferencesStore } from "../lib/preferences";
import { shortAddress } from "../lib/format";
import { chainName } from "../lib/wallet";
import { useDapp } from "../providers/DappProvider";
import { LINKS } from "../shell/nav";
import { ArtSettings } from "../ui/art";
import { AddressAvatar } from "../ui/brand";
import { Button } from "../ui/Button";
import { Card, CardHeader } from "../ui/Card";
import { ResponsiveSheet } from "../ui/Dialog";
import { PageHeader } from "../ui/PageHeader";
import { Segmented } from "../ui/Segmented";
import { Switch } from "../ui/Switch";
import { ConnectButton } from "./shared";

function SettingRow({ label, description, children }: { label: string; description?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="text-sm font-semibold">{label}</div>
        {description ? <div className="mt-0.5 text-[13px] leading-5 text-ink-2">{description}</div> : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function AccountCard() {
  const { env, wallet, connected, data, disconnect } = useDapp();
  const [copied, setCopied] = useState(false);
  if (!connected || !wallet.address) {
    return (
      <Card className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-semibold">Wallet</h2>
          <p className="mt-0.5 text-[13px] text-ink-2">Connect to see your account here.</p>
        </div>
        <ConnectButton size="md" />
      </Card>
    );
  }
  const account = env.wallet.accounts.find((item) => item.address === wallet.address);
  const connector = env.wallet.connectors.find((item) => item.id === wallet.connectorId);
  return (
    <Card>
      <CardHeader title="Wallet" />
      <div className="flex flex-wrap items-center gap-4">
        <AddressAvatar address={wallet.address} className="size-12" />
        <div className="min-w-0 flex-1">
          <div className="text-base font-bold">{wallet.ensName ?? account?.label ?? "Connected"}</div>
          <div className="flex items-center gap-1 text-[13px] text-ink-2 tabular">
            {shortAddress(wallet.address, 6)}
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-canvas hover:text-ink"
              aria-label="Copy address"
              onClick={() => {
                void navigator.clipboard.writeText(wallet.address ?? "").then(() => {
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1400);
                });
              }}
            >
              {copied ? <Check className="size-3.5 text-green-ink" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
            </button>
          </div>
        </div>
        <Button variant="secondary" icon={<LogOut />} onClick={() => void disconnect()}>
          Disconnect
        </Button>
      </div>
      <div className="row-divide mt-4">
        <SettingRow label="Network">
          <span className="text-sm font-semibold">{chainName(wallet.chainId)}</span>
        </SettingRow>
        <SettingRow label="Connected with">
          <span className="text-sm font-semibold">{connector?.name ?? "Wallet"}</span>
        </SettingRow>
        <SettingRow label="Terms" description="Accepted for this address. You're asked again if they change.">
          <span className="text-sm font-semibold">{data.eligibility?.acceptedTermsVersion ? `Version ${data.eligibility.acceptedTermsVersion}` : "Not yet accepted"}</span>
        </SettingRow>
      </div>
    </Card>
  );
}

function DisplayCard() {
  const { preferences, setPreferences } = useDapp();
  return (
    <Card>
      <CardHeader title="Display" hint="Kept on this device only." />
      <div className="row-divide">
        <div className="py-4">
          <Switch checked={preferences.hideBalances} onCheckedChange={(next) => setPreferences({ hideBalances: next })} label="Hide balances" description="Masks every amount of your own. The eye on your position card does the same." />
        </div>
        <SettingRow label="Decimals" description="How many places amounts show.">
          <Segmented
            size="sm"
            value={String(preferences.precision) as "2" | "4"}
            onChange={(next) => setPreferences({ precision: next === "2" ? 2 : 4 })}
            options={[
              { value: "2", label: "2" },
              { value: "4", label: "4" },
            ]}
            aria-label="Decimals"
          />
        </SettingRow>
        <SettingRow label="Your position in" description="The headline figure on Home.">
          <Segmented
            size="sm"
            value={preferences.positionUnit}
            onChange={(next) => setPreferences({ positionUnit: next })}
            options={[
              { value: "eth", label: "ETH" },
              { value: "shares", label: "Vault shares" },
            ]}
            aria-label="Position unit"
          />
        </SettingRow>
        {FEATURES.liquidity ? (
          <div className="py-4">
            <Switch checked={preferences.showLayers} onCheckedChange={(next) => setPreferences({ showLayers: next })} label="Show each layer separately" description="Lists every source of return under the Liquidity Module total." />
          </div>
        ) : null}
      </div>
    </Card>
  );
}

const HELP = [
  { label: "Documentation", href: LINKS.docs, external: false },
  { label: "How to use the app", href: LINKS.docsApp, external: false },
  { label: "Risks", href: LINKS.docsRisks, external: false },
  { label: "Roadmap", href: LINKS.roadmap, external: false },
  { label: "Telegram", href: LINKS.telegram, external: true },
  { label: "X", href: LINKS.x, external: true },
  { label: "Terms", href: LINKS.terms, external: false },
  { label: "Privacy Policy", href: LINKS.privacy, external: false },
];

function HelpCard() {
  return (
    <Card>
      <CardHeader title="Help and legal" />
      <ul className="grid gap-2 sm:grid-cols-2">
        {HELP.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              className="group flex items-center justify-between rounded-[14px] bg-canvas px-4 py-3 text-sm font-semibold transition-colors hover:bg-chip"
            >
              {item.label}
              <ArrowUpRight className="size-4 text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ClearDataCard() {
  const { disconnect } = useDapp();
  const [confirming, setConfirming] = useState(false);
  return (
    <Card className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <h2 className="text-[15px] font-semibold">Clear data on this device</h2>
        <p className="mt-0.5 text-[13px] leading-5 text-ink-2">Forgets your display choices and the remembered wallet connection. Your position is untouched.</p>
      </div>
      <Button variant="danger" icon={<Trash2 />} onClick={() => setConfirming(true)}>
        Clear data
      </Button>
      <ResponsiveSheet open={confirming} onOpenChange={setConfirming} title="Clear data on this device?" description="You'll need to connect your wallet again.">
        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            variant="danger"
            block
            onClick={() => {
              preferencesStore.clear();
              void disconnect().then(() => setConfirming(false));
            }}
          >
            Clear data
          </Button>
          <Button size="lg" variant="secondary" block onClick={() => setConfirming(false)}>
            Cancel
          </Button>
        </div>
      </ResponsiveSheet>
    </Card>
  );
}

/* ---------- developer tools (?devtools=1) ---------- */

const noopSubscribe = () => () => undefined;

function DevTools() {
  const { env, wallet, connected, toasts } = useDapp();
  const preview = env.preview;
  // Re-read the settings whenever the protocol says something changed.
  const sim = useSyncExternalStore(
    preview ? (listener) => env.protocol.subscribe(listener) : noopSubscribe,
    () => (preview ? preview.getSim() : null),
    () => null,
  );
  if (!preview || !sim) return null;
  const set = (patch: Partial<SimSettings>, message?: string) => {
    preview.setSim(patch);
    if (message) toasts.add({ title: message, type: "info", timeout: 2500 });
  };

  return (
    <Card id="devtools" className="scroll-mt-28 shadow-[inset_0_0_0_1.5px_var(--color-lemonade)]">
      <CardHeader
        title="Developer tools"
        hint="Try every state of the app: accounts, wallet network, failures, time and Vault states. Changes apply at once, on this device only."
        icon={
          <span className="flex size-9 items-center justify-center rounded-full bg-lemonade">
            <FlaskConical className="size-4" aria-hidden="true" />
          </span>
        }
      />
      <div className="row-divide">
        <div className="py-4">
          <div className="text-sm font-semibold">Account</div>
          <div className="mt-0.5 text-[13px] text-ink-2">{connected ? "Switch between test accounts." : "Connect first, then switch between test accounts."}</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {env.wallet.accounts.map((account) => {
              const current = wallet.address === account.address;
              return (
                <button
                  key={account.address}
                  type="button"
                  disabled={!connected || current || wallet.busy}
                  onClick={() => void env.wallet.switchAccount(account.address)}
                  className={cn(
                    "rounded-[14px] bg-canvas p-3 text-left transition-[box-shadow,opacity] enabled:hover:shadow-[inset_0_0_0_1.5px_var(--color-ink)] disabled:cursor-default",
                    current && "shadow-[inset_0_0_0_1.5px_var(--color-ink)]",
                    !connected && "opacity-50",
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    {current ? <Check className="size-3.5 text-green-ink" aria-hidden="true" /> : null}
                    {account.label}
                  </span>
                  <span className="mt-0.5 block text-xs leading-4 text-ink-2">{account.description}</span>
                </button>
              );
            })}
          </div>
        </div>
        <SettingRow label="Wallet network" description="As if you switched networks in your wallet.">
          <Segmented
            size="sm"
            value={String(wallet.chainId) as "1" | "11155111" | "8453"}
            onChange={(next) => preview.setWalletChain(Number(next))}
            options={[
              { value: "1", label: "Ethereum", disabled: !connected },
              { value: "11155111", label: "Sepolia", disabled: !connected },
              { value: "8453", label: "Base", disabled: !connected },
            ]}
            aria-label="Wallet network"
          />
        </SettingRow>
        <SettingRow label="Next transaction" description="Rejecting is up to you in the wallet window; a revert happens onchain. Goes back to Succeeds after one use.">
          <Segmented
            size="sm"
            value={sim.nextTx}
            onChange={(next) => set({ nextTx: next }, next === "succeed" ? undefined : "The next transaction will revert onchain")}
            options={[
              { value: "succeed", label: "Succeeds" },
              { value: "revert", label: "Reverts" },
            ]}
            aria-label="Next transaction"
          />
        </SettingRow>
        <SettingRow label="Skip ahead" description="Harvests apply, exits get processed and locks mature.">
          <div className="flex gap-2">
            {[
              { days: 1, label: "1 day" },
              { days: 7, label: "1 week" },
              { days: 30, label: "1 month" },
            ].map((option) => (
              <Button
                key={option.days}
                size="sm"
                variant="soft"
                onClick={() => {
                  preview.advance(option.days);
                  toasts.add({ title: `Moved ahead ${option.label}`, description: "Rewards, exits and lock maturities have caught up.", type: "info", timeout: 2500 });
                }}
              >
                +{option.label}
              </Button>
            ))}
          </div>
        </SettingRow>
        <SettingRow label="Vault" description="Capacity and activation states.">
          <Segmented
            size="sm"
            value={sim.vault}
            onChange={(next) => set({ vault: next })}
            options={[
              { value: "open", label: "Open" },
              { value: "nearlyFull", label: "Nearly full" },
              { value: "full", label: "Full" },
              { value: "notActivated", label: "Activating" },
            ]}
            aria-label="Vault state"
          />
        </SettingRow>
        <SettingRow label="Access" description="A regional restriction or a failed screening.">
          <Segmented
            size="sm"
            value={sim.restriction}
            onChange={(next) => set({ restriction: next })}
            options={[
              { value: "ok", label: "Open" },
              { value: "region", label: "Region" },
              { value: "blocked", label: "Blocked" },
            ]}
            aria-label="Access"
          />
        </SettingRow>
        <div className="py-4">
          <Switch checked={sim.incident} onCheckedChange={(next) => set({ incident: next })} label="Incident notice" description="A banner the team can raise across the app." />
        </div>
        <div className="py-4">
          <Switch checked={sim.stale} onCheckedChange={(next) => set({ stale: next })} label="Out-of-date figures" description="Confirming pauses until fresh data arrives." />
        </div>
        <SettingRow label="Start over" description="Back to the test accounts as they began.">
          <Button
            size="sm"
            variant="secondary"
            icon={<RotateCcw />}
            onClick={() => {
              preview.reset();
              toasts.add({ title: "Back to the start", description: "Every test account is where it began.", type: "info", timeout: 2500 });
            }}
          >
            Start over
          </Button>
        </SettingRow>
      </div>
    </Card>
  );
}

/** Settings: the wallet, how figures show, help, local data, and (with ?devtools=1) the developer tools. */
export function SettingsScreen() {
  const { env } = useDapp();
  const devTools = useDevTools();
  return (
    <>
      <PageHeader title="Settings" description="Your wallet, how figures show, and where to get help." actions={<ArtSettings className="hidden w-[120px] lg:block" />} />
      <div className="grid gap-4 xl:grid-cols-2 xl:items-start xl:gap-5">
        <div className="flex flex-col gap-4 lg:gap-5">
          <AccountCard />
          <DisplayCard />
          <ClearDataCard />
        </div>
        <div className="flex flex-col gap-4 lg:gap-5">
          {env.preview && devTools ? <DevTools /> : null}
          <HelpCard />
          <p className="px-1 text-xs text-ink-3">
            Definica app ·{" "}
            <Link href="/" className="underline-offset-4 hover:underline">
              definica.com
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
