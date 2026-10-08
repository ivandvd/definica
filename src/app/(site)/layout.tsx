import type { Metadata, Viewport } from "next";
import "../globals.css";
import "@/styles/sites/definica/site.css";
import "@/styles/sites/definica/definica.css";

const SEO = "/sites/definica/shared/seo";
const title = "Definica — Stake ETH. Unlock Utility. Earn Multi-Layer Rewards.";
const description =
  "Definica is a hybrid Ethereum-native staking, liquidity, and collateralized borrowing protocol designed around StakeWise-compatible ETH staking infrastructure, osETH composability, Aave-compatible osETH flows, and fixed-duration aEthosETH lock-ups.";

export const metadata: Metadata = {
  title,
  description,
  robots: "noindex",
  icons: {
    icon: [
      { url: `${SEO}/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
      { url: `${SEO}/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
    ],
    shortcut: `${SEO}/favicon.ico`,
    apple: { url: `${SEO}/apple-touch-icon.png`, sizes: "180x180" },
  },
  openGraph: { title, description, siteName: "Definica", locale: "en_GB", images: `${SEO}/og-image.png` },
  twitter: { card: "summary_large_image", title, description, images: `${SEO}/og-image.png` },
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
  return (
    // Lenis and the app shell set classes / CSS variables on <html> at runtime.
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
