import type { Metadata } from "next";
import { about } from "@/components/sites/definica/about/content";
import { AboutPage } from "@/components/sites/definica/about/AboutPage";
import { AppFooter } from "@/components/sites/definica/shared/AppFooter";
import { AppHeader } from "@/components/sites/definica/shared/AppHeader";
import { AppShell } from "@/components/sites/definica/shared/AppShell";

const { title, description } = about.seo;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: `${title} — Definica`, description, siteName: "Definica", locale: "en_GB", type: "website", url: "/about" },
  twitter: { card: "summary_large_image", title: `${title} — Definica`, description, site: "@definicacom" },
};

export default function About() {
  return (
    <AppShell header={<AppHeader />} footer={<AppFooter />}>
      <AboutPage />
    </AppShell>
  );
}
