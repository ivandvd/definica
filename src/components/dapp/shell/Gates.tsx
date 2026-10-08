"use client";

import { LogOut, ShieldOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useDevTools } from "../lib/devtools";
import { useDapp } from "../providers/DappProvider";
import { Button } from "../ui/Button";
import { ResponsiveSheet } from "../ui/Dialog";
import { LINKS } from "./nav";

/**
 * Full stops: an address that failed screening sees only this, with Disconnect (fail closed); an
 * address that hasn't accepted the current Terms is asked to before it can do anything.
 */
export function Gates() {
  const { env, connected, data, disconnect, acceptTerms } = useDapp();
  const devTools = useDevTools();
  const [ticked, setTicked] = useState(false);
  const [saving, setSaving] = useState(false);
  const eligibility = data.eligibility;

  if (connected && eligibility?.status === "blocked") {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-canvas/95 p-4 backdrop-blur-sm" role="alertdialog" aria-modal="true" aria-labelledby="blocked-title">
        <div className="w-full max-w-md rounded-sheet bg-card p-6 text-center shadow-pop">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-soft text-red">
            <ShieldOff className="size-6" aria-hidden="true" />
          </span>
          <h2 id="blocked-title" className="mt-4 text-xl font-extrabold">
            This address can&apos;t use Definica
          </h2>
          <p className="mt-2 text-sm leading-5 text-ink-2">
            It did not pass the screening every address goes through. If you think this is a mistake, contact the team through the official channels.
          </p>
          <Button className="mt-5" block size="lg" icon={<LogOut />} onClick={() => void disconnect()}>
            Disconnect
          </Button>
          {env.preview && devTools ? (
            <button type="button" onClick={() => env.preview?.setSim({ restriction: "ok" })} className="mt-3 text-[13px] font-semibold text-ink-2 underline-offset-4 hover:text-ink hover:underline">
              Developer tools: lift the restriction
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  const needsTerms = connected && eligibility !== null && eligibility.status !== "blocked" && eligibility.acceptedTermsVersion !== eligibility.termsVersion;
  return (
    <ResponsiveSheet
      open={needsTerms}
      onOpenChange={() => undefined}
      dismissible={false}
      title={eligibility?.acceptedTermsVersion ? "The Terms have changed" : "Before you continue"}
      description="Accept the Terms for this address. You only do this once per version."
    >
      <label className="flex cursor-pointer gap-3 rounded-[16px] bg-card p-4 text-[13px] leading-5 text-ink-2">
        <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-[#0f0f0f]" checked={ticked} onChange={(event) => setTicked(event.target.checked)} />
        <span>
          I am 18 or over, not subject to sanctions, not in a region where Definica is restricted and not using a VPN to get round a restriction. I accept the{" "}
          <Link href={LINKS.terms} target="_blank" className="font-semibold text-ink underline">
            Terms
          </Link>{" "}
          (version {eligibility?.termsVersion}) and have read the{" "}
          <Link href={LINKS.privacy} target="_blank" className="font-semibold text-ink underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      <div className="mt-4 flex flex-col gap-2">
        <Button
          size="lg"
          block
          disabled={!ticked}
          loading={saving}
          onClick={() => {
            setSaving(true);
            void acceptTerms().finally(() => setSaving(false));
          }}
        >
          Accept and continue
        </Button>
        <Button size="lg" block variant="secondary" onClick={() => void disconnect()}>
          Disconnect
        </Button>
      </div>
    </ResponsiveSheet>
  );
}
