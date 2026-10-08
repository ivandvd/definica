import { OG_CONTENT_TYPE, OG_SIZE, shareImage } from "@/lib/og";

export const alt = "The Definica app: stake ETH, follow every layer of your position and unstake when you choose.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return shareImage({
    eyebrow: "App",
    title: "Stake ETH,\nput it to work.",
    text: "Pooled in a dedicated StakeWise Vault: no validator to run, rewards at every harvest, every layer of your position on its own.",
    graphic: "app",
  });
}
