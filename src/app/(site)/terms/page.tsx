import type { Metadata } from "next";
import { LegalPage } from "@/components/sites/definica/legal/LegalPage";
import { AppFooter } from "@/components/sites/definica/shared/AppFooter";
import { AppHeader } from "@/components/sites/definica/shared/AppHeader";
import { AppShell } from "@/components/sites/definica/shared/AppShell";
import { terms } from "@/data/sites/definica/legal/terms";

export const metadata: Metadata = {
  title: terms.title,
  description: terms.description,
  alternates: { canonical: "/terms" },
  openGraph: { title: `${terms.title} — Definica`, description: terms.description, url: "/terms" },
};

export default function Terms() {
  return (
    <AppShell header={<AppHeader />} footer={<AppFooter />}>
      <LegalPage doc={terms} surtitle="Legal" />
    </AppShell>
  );
}
