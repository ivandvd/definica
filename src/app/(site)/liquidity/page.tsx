import type { Metadata } from "next";
import { liquidity } from "@/components/sites/definica/liquidity/content";
import { LiquidityPage } from "@/components/sites/definica/liquidity/LiquidityPage";
import { AppFooter } from "@/components/sites/definica/shared/AppFooter";
import { AppHeader } from "@/components/sites/definica/shared/AppHeader";
import { AppShell } from "@/components/sites/definica/shared/AppShell";

const { title, description } = liquidity.seo;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/liquidity" },
  openGraph: { title: `${title} — Definica`, description, siteName: "Definica", locale: "en_GB", type: "website", url: "/liquidity" },
  twitter: { card: "summary_large_image", title: `${title} — Definica`, description, site: "@definicacom" },
};

export default function Liquidity() {
  return (
    <AppShell header={<AppHeader />} footer={<AppFooter />}>
      <LiquidityPage />
    </AppShell>
  );
}
