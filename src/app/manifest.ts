import type { MetadataRoute } from "next";

const ICONS = "/sites/definica/shared/seo";

/** Web app manifest: the name and icons used when Definica is saved to a home screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Definica",
    short_name: "Definica",
    description: "Pooled ETH staking, committed liquidity and borrowing, in three phases.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: `${ICONS}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${ICONS}/icon-512.png`, sizes: "512x512", type: "image/png" },
      { src: `${ICONS}/icon-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
