import type { Metadata } from "next";
import { LegalPage } from "@/components/sites/definica/legal/LegalPage";
import { AppFooter } from "@/components/sites/definica/shared/AppFooter";
import { AppHeader } from "@/components/sites/definica/shared/AppHeader";
import { AppShell } from "@/components/sites/definica/shared/AppShell";
import { privacy } from "@/data/sites/definica/legal/privacy";

export const metadata: Metadata = {
  title: privacy.title,
  description: privacy.description,
  alternates: { canonical: "/privacy" },
  openGraph: { title: `${privacy.title} — Definica`, description: privacy.description, url: "/privacy" },
};

export default function Privacy() {
  return (
    <AppShell header={<AppHeader />} footer={<AppFooter />}>
      <LegalPage doc={privacy} surtitle="Legal" />
    </AppShell>
  );
}
