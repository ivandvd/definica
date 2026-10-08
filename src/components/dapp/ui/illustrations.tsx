"use client";

import type { CSSProperties } from "react";
import { STICKERS } from "@/components/sites/definica/root-8a5edab2/phone/stickers";
import { cn } from "@/lib/utils";
import { DefinicaMark, EthDiamond } from "./brand";

/* The walkthrough's pictures, as live components: the coin card, the padlock, the sticker burst. */

const COINS = [
  { fill: "#fbe74e", edge: "#d9c22c", left: 26, top: 21 },
  { fill: "#ffcadc", edge: "#e7a3ba", left: 70, top: 21 },
  { fill: "#5ccf55", edge: "#3aa834", left: 114, top: 21 },
  { fill: "#e8f6ea", edge: "#bfd6c3", left: 26, top: 65 },
  { fill: "#ff5a4d", edge: "#d63b2f", left: 70, top: 65 },
  { fill: "#3462d8", edge: "#2445a6", left: 114, top: 65 },
];

/**
 * The blue card of six ETH coins from the walkthrough's Stake screen. The coins turn edge-on in a
 * loop; `pooled` gathers them into one stack in the middle, as when a stake goes through.
 */
export function CoinCard({ pooled = false, className }: { pooled?: boolean; className?: string }) {
  return (
    <div className={cn("relative h-[122px] w-[176px] rounded-[16px] border-[1.5px] border-[#0f0f0f] bg-[#a7c5f4]", className)} aria-hidden="true">
      {COINS.map((coin, i) => {
        const style = {
          left: coin.left,
          top: coin.top,
          transform: pooled ? `translate(${70 - coin.left}px, ${52 - i * 4 - coin.top}px)` : "translate(0, 0)",
          transitionDelay: `${i * 35}ms`,
          zIndex: pooled ? i + 1 : undefined,
        } satisfies CSSProperties;
        return (
          <span key={i} className="absolute size-9 transition-transform duration-[550ms] ease-[cubic-bezier(0.65,0,0.35,1)]" style={style}>
            <span
              className="absolute inset-0 rounded-full border-[1.5px] border-[#0f0f0f]"
              style={{ background: coin.edge, animation: pooled ? undefined : `coin-edge 3.6s ease-in-out ${0.15 + i * 0.12}s infinite` }}
            />
            <span
              className="absolute inset-0 flex items-center justify-center rounded-full border-[1.5px] border-[#0f0f0f]"
              style={{ background: coin.fill, animation: pooled ? undefined : `coin-flip 3.6s ease-in-out ${0.15 + i * 0.12}s infinite` }}
            >
              <EthDiamond className="h-[18px] w-[11px]" color="#0f0f0f" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

/** The walkthrough's padlock: the shackle drops shut and the body turns lime when locked. */
export function Padlock({ locked, size = 38, className }: { locked: boolean; size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 38 38" aria-hidden="true" focusable="false">
      <path
        d="M12.5 17.5v-4a6.5 6.5 0 0 1 13 0v4"
        fill="none"
        stroke="#0f0f0f"
        strokeWidth="2.6"
        strokeLinecap="round"
        style={{ transform: locked ? undefined : "translateY(-4.5px)", animation: locked ? "shackle-close 0.45s cubic-bezier(0.34,1.56,0.64,1) both" : undefined }}
      />
      <rect
        x="8"
        y="16.5"
        width="22"
        height="17"
        rx="4.5"
        fill={locked ? "#d1f500" : "#ffffff"}
        stroke="#0f0f0f"
        strokeWidth="2.6"
        style={{ animation: locked ? "padlock-fill 0.35s ease-out 0.25s both" : undefined }}
      />
      <circle cx="19" cy="24" r="2.3" fill="#0f0f0f" />
      <path d="M19 25.2v3.3" stroke="#0f0f0f" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The walkthrough's intro: the Definica mark with the brand stickers around it. They pop out on
 * mount and then drift gently. Decorative.
 */
export function StickerBurst({ className, scale = 1 }: { className?: string; scale?: number }) {
  return (
    <div className={cn("relative", className)} aria-hidden="true">
      <div className="absolute top-1/2 left-1/2" style={{ transform: `scale(${scale})` }}>
        {STICKERS.map(({ Component, angle, distance, rotation }, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * distance;
          const y = Math.sin(rad) * distance;
          return (
            <div
              key={i}
              className="absolute top-0 left-0"
              style={{ transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rotation}deg)` }}
            >
              <div className="animate-pop" style={{ animationDelay: `${120 + i * 45}ms` }}>
                <div style={{ animation: `drift ${5 + (i % 4)}s ease-in-out ${i * 0.3}s infinite` }}>
                  <Component />
                </div>
              </div>
            </div>
          );
        })}
        <div className="absolute -top-10 -left-9 flex h-20 w-[72px] animate-pop items-center justify-center">
          <DefinicaMark className="h-20 w-[72px]" color="#0f0f0f" />
        </div>
      </div>
    </div>
  );
}
