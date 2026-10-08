import { OG_CONTENT_TYPE, OG_SIZE, shareImage } from "@/lib/og";

export const alt = "The Definica roadmap — Stake, lock, borrow.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return shareImage({
    eyebrow: "Roadmap",
    title: "Stake, lock,\nborrow.",
    text: "Three phases, each creating the conditions for the next.",
    graphic: "road",
  });
}
