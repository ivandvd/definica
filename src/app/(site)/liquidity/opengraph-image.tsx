import { OG_CONTENT_TYPE, OG_SIZE, shareImage } from "@/lib/og";

export const alt = "Definica's Main Liquidity Module — Commit osETH, see every line.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return shareImage({
    eyebrow: "Main Liquidity Module",
    title: "Commit osETH,\nsee every line.",
    text: "osETH supplied to Aave V3, committed as aEthosETH, every return and debt on its own line.",
    graphic: "commit",
  });
}
