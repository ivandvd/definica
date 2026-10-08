import { OG_CONTENT_TYPE, OG_SIZE, shareImage } from "@/lib/og";

export const alt = "Definica's borrowing markets — Borrow with the rules up front.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return shareImage({
    eyebrow: "Borrowing markets",
    title: "Borrow with the\nrules up front.",
    text: "osETH as the primary collateral, every market's rules shown before you confirm.",
    graphic: "gauge",
  });
}
