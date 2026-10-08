import type { Metadata, Viewport } from "next";
import "./dapp.css";
import { DappProvider } from "@/components/dapp/providers/DappProvider";
import { AppShell } from "@/components/dapp/shell/AppShell";
import { MARK_D, MARK_SLASH } from "@/components/dapp/ui/brand";
import { INDEXABLE, SITE_URL } from "@/lib/site";

const description = "Stake ETH in the Definica Vault, follow every layer of your position, and unstake when you choose.";

/* Icons, the manifest and share images come from the file conventions in app/ (shared with the site). */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Definica App", template: "%s — Definica App" },
  description,
  applicationName: "Definica",
  alternates: { canonical: "/app" },
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { title: "Definica App", description, siteName: "Definica", locale: "en_GB", type: "website", url: "/app" },
  twitter: { card: "summary_large_image", title: "Definica App", description, site: "@definicacom" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f1f3f1",
};

/**
 * Arriving from Launch App on the site (a flag in this tab's storage, or `?launch=1` from another
 * host): mark the page before it paints, so the launch curtain is up from the first frame and
 * lifts with CSS. Runs once, before hydration.
 */
const LAUNCH_SCRIPT = `try{var d=document.documentElement,s=window.sessionStorage,t=s.getItem("definica:launch"),u=new URL(window.location.href);if((t&&Date.now()-Number(t)<10000)||u.searchParams.get("launch")==="1"){d.setAttribute("data-launch","")}s.removeItem("definica:launch");if(u.searchParams.has("launch")){u.searchParams.delete("launch");history.replaceState(null,"",u.pathname+u.search+u.hash)}}catch(e){}`;

/** Root layout of the app (the `(dapp)` route group has its own, separate from the landing site's). */
export default function DappRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className="dapp" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: LAUNCH_SCRIPT }} />
        <div className="launch-curtain" aria-hidden="true">
          <div className="launch-lime" />
          <div className="launch-ink">
            <svg className="launch-mark" viewBox="-0.6 0 22.6 24" focusable="false">
              <path fillRule="evenodd" clipRule="evenodd" d={MARK_D} fill="#d1f500" />
              <path d={MARK_SLASH} fill="#d1f500" />
            </svg>
          </div>
        </div>
        <DappProvider>
          <AppShell>{children}</AppShell>
        </DappProvider>
      </body>
    </html>
  );
}
