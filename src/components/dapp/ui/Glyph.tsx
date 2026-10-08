import { Check, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DefinicaMark } from "./brand";
import type { ActivityStatus, Asset } from "../lib/types";

/* The landing page's wheel glyphs in coloured, ink-outlined circles: the walkthrough's badges. */

export type GlyphName =
  | "aave-v3"
  | "aethoseth"
  | "borrowing-markets"
  | "definica-core"
  | "ethereum"
  | "exit-queue"
  | "keeper"
  | "liquidity-module"
  | "oseth"
  | "share-locks"
  | "stakewise-vault"
  | "treasury"
  | "validators"
  | "vault-shares";

export const glyphSrc = (glyph: GlyphName) => `/sites/definica/root-8a5edab2/glyphs/${glyph}.svg`;

/** Each glyph's tone, as on the landing page. */
export const GLYPH_TONES: Record<GlyphName, string> = {
  "aave-v3": "#9dc4f5",
  aethoseth: "#9dc4f5",
  "borrowing-markets": "#9ca69e",
  "definica-core": "#d1f500",
  ethereum: "#9dc4f5",
  "exit-queue": "#ffcadc",
  keeper: "#e2f2e5",
  "liquidity-module": "#ff5a4d",
  oseth: "#e2f2e5",
  "share-locks": "#fbe74e",
  "stakewise-vault": "#ffcadc",
  treasury: "#d1f500",
  validators: "#e2f2e5",
  "vault-shares": "#fbe74e",
};

/** A glyph in its tone circle. Sizes are in px, as the walkthrough's. */
export function GlyphBadge({ glyph, size = 32, tone, className }: { glyph: GlyphName; size?: number; tone?: string; className?: string }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full border border-[#0f0f0f]", className)}
      style={{ width: size, height: size, background: tone ?? GLYPH_TONES[glyph] }}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny decorative svg, no optimisation needed */}
      <img src={glyphSrc(glyph)} alt="" draggable={false} className="block h-[46%] w-[46%] object-contain" />
    </span>
  );
}

/*
 * Token icons. Sources and licences:
 * - eth.svg: spothq/cryptocurrency-icons, svg/color/eth.svg (CC0-1.0).
 * - oseth.svg: StakeWise's own osETH icon (stakewise/vault-interface, MIT; the same file as their brand pack).
 * - weth.png: trustwallet/assets, the WETH logo (MIT).
 * - aEthosETH: no file. Drawn as Aave's interface draws aTokens: the underlying icon inside a
 *   #b6509e → #2ebac6 ring, 5.36% of the diameter thick.
 */
const TOKENS = "/sites/definica/app/tokens";

/** The osETH diamond within a round box (the official art has no disc). */
function OsEthArt({ inset = false }: { inset?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny local svg, no optimisation needed
    <img
      src={`${TOKENS}/oseth.svg`}
      alt=""
      draggable={false}
      className="absolute block"
      style={inset ? { left: "13.36%", top: "6.7%", width: "73.28%", height: "86.6%" } : { left: "10%", top: "2%", width: "80%", height: "96%" }}
    />
  );
}

/** The right icon for each asset: the real token icons, and the Definica mark for Vault shares. */
export function TokenIcon({ asset, size = 32, className }: { asset: Asset; size?: number; className?: string }) {
  const box = { width: size, height: size };
  if (asset === "shares") {
    return (
      <span className={cn("inline-flex shrink-0 items-center justify-center rounded-full bg-ink", className)} style={box} aria-hidden="true">
        <DefinicaMark className="h-[52%] w-[52%]" color="#d1f500" accent={null} />
      </span>
    );
  }
  if (asset === "osETH") {
    return (
      <span className={cn("relative inline-block shrink-0", className)} style={box} aria-hidden="true">
        <OsEthArt />
      </span>
    );
  }
  if (asset === "aEthosETH") {
    return (
      <span className={cn("relative inline-block shrink-0", className)} style={box} aria-hidden="true">
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(220.3deg, #b6509e 14.5%, #2ebac6 84.4%)",
            mask: "radial-gradient(farthest-side, transparent 89.286%, #000 89.286%)",
            WebkitMask: "radial-gradient(farthest-side, transparent 89.286%, #000 89.286%)",
          }}
        />
        <OsEthArt inset />
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny local icon, no optimisation needed
    <img
      src={asset === "WETH" ? `${TOKENS}/weth.png` : `${TOKENS}/eth.svg`}
      alt=""
      aria-hidden="true"
      draggable={false}
      width={size}
      height={size}
      className={cn("inline-block shrink-0 rounded-full", className)}
      style={box}
    />
  );
}

/** Kept for the existing call sites: an asset's icon. */
export const AssetBadge = TokenIcon;

/**
 * A transaction's status on its badge's corner: a green check, a spinner on lemonade, or a coral
 * "!". Place it inside a `relative` wrapper around the badge.
 */
export function StatusMark({ status, size = 24 }: { status: ActivityStatus; size?: number }) {
  const icon = Math.round(size * 0.58);
  return (
    <span
      className={cn(
        "absolute -right-1 -bottom-1 flex items-center justify-center rounded-full border-[1.5px] border-ink ring-[2.5px] ring-card",
        status === "confirmed" ? "bg-green text-white" : status === "pending" ? "bg-lemonade text-ink" : "bg-coral text-ink",
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {status === "confirmed" ? (
        <Check style={{ width: icon, height: icon }} strokeWidth={3} />
      ) : status === "pending" ? (
        <LoaderCircle className="animate-spin" style={{ width: icon, height: icon }} strokeWidth={2.6} />
      ) : (
        <svg viewBox="0 0 12 12" style={{ width: icon * 0.86, height: icon * 0.86 }}>
          <path d="M6 2v4.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="6" cy="9.6" r="1.25" fill="currentColor" />
        </svg>
      )}
    </span>
  );
}
