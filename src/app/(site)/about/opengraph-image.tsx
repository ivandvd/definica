import { OG_CONTENT_TYPE, OG_SIZE, shareImage } from "@/lib/og";

export const alt = "About Definica — No hidden mechanics.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return shareImage({
    eyebrow: "About",
    title: "No hidden\nmechanics.",
    text: "Staking, liquidity and borrowing on Ethereum, every layer shown on its own.",
    graphic: "mark",
  });
}
