import type { Metadata } from "next";
import { AppFooter } from "@/components/sites/definica/shared/AppFooter";
import { AppHeader } from "@/components/sites/definica/shared/AppHeader";
import { AppShell } from "@/components/sites/definica/shared/AppShell";
import { staking } from "@/components/sites/definica/staking/content";
import { StakingPage } from "@/components/sites/definica/staking/StakingPage";

const { title, description } = staking.seo;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/staking" },
  openGraph: { title: `${title} — Definica`, description, siteName: "Definica", locale: "en_GB", type: "website", url: "/staking" },
  twitter: { card: "summary_large_image", title: `${title} — Definica`, description, site: "@definicacom" },
};

export default function Staking() {
  return (
    <AppShell header={<AppHeader />} footer={<AppFooter />}>
      <StakingPage />
    </AppShell>
  );
}
