import { OG_CONTENT_TYPE, OG_SIZE, shareImage } from "@/lib/og";

export const alt = "Definica staking — One Vault, your share.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return shareImage({
    eyebrow: "Staking",
    title: "One Vault,\nyour share.",
    text: "ETH pooled in a dedicated StakeWise Vault, with your proportional share recorded onchain.",
    graphic: "vault",
  });
}
