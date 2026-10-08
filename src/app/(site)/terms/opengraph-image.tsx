import { OG_CONTENT_TYPE, OG_SIZE, shareImage } from "@/lib/og";
import { terms } from "@/data/sites/definica/legal/terms";

export const alt = "Definica Terms of Service";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return shareImage({
    eyebrow: "Legal",
    title: "Terms of\nService.",
    text: terms.description,
    graphic: "mark",
  });
}
