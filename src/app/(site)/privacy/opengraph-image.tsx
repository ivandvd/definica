import { OG_CONTENT_TYPE, OG_SIZE, shareImage } from "@/lib/og";
import { privacy } from "@/data/sites/definica/legal/privacy";

export const alt = "Definica Privacy Policy";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return shareImage({
    eyebrow: "Legal",
    title: "Privacy\nPolicy.",
    text: privacy.description,
    graphic: "mark",
  });
}
