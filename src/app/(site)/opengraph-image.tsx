import { OG_CONTENT_TYPE, OG_SIZE, shareImage } from "@/lib/og";

export const alt = "Definica — Stake ETH. Unlock utility.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return shareImage({
    title: "Stake ETH.\nUnlock utility.",
    text: "Pooled ETH staking, committed liquidity and borrowing, in three phases.",
    graphic: "mark",
  });
}
