import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/styles/sites/ctrl-xyz-d5a73559/site.css";

const SEO = "/sites/ctrl-xyz-d5a73559/shared/seo";
const title = "Secure and powerful crypto wallet | Ctrl Wallet";
const description =
  "Ctrl is the world's most powerful crypto wallet. Secure, easy-to-use and supports more than 2,500 blockchains. One wallet for all your crypto. Take Control.  ";

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
  openGraph: { title, description, siteName: title, locale: "en_gb", images: `${SEO}/og-image.png` },
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
    <html lang="en-gb" dir="ltr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
