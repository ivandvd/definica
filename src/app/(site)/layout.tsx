import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import { INDEXABLE, SITE_URL } from "@/lib/site";
import "../globals.css";
import "@/styles/sites/definica/site.css";
import "@/styles/sites/definica/definica.css";

const title = "Definica — Stake ETH. Unlock Utility. Earn Multi-Layer Rewards.";
const description =
  "Definica pools ETH in a dedicated StakeWise Vault, commits osETH liquidity through Aave V3 and opens borrowing against ETH-correlated collateral.";

/*
 * Shared by every page of the site: pages set their own `title` (shown as "Title — Definica"),
 * description and canonical path. Icons, the manifest and the share images come from the file
 * conventions (app/icon.svg, apple-icon.png, manifest.ts, opengraph-image.tsx).
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: "%s — Definica" },
  description,
  applicationName: "Definica",
  alternates: { canonical: "/" },
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { title, description, siteName: "Definica", locale: "en_GB", type: "website", url: "/" },
  twitter: { card: "summary_large_image", title, description, site: "@definicacom" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The body text weight: fetched with the page instead of after the stylesheet.
  preload("/sites/definica/shared/fonts/TomatoGrotesk-Medium.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return (
    // Lenis and the app shell set classes / CSS variables on <html> at runtime.
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
