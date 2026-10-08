import type { Metadata } from "next";
import { roadmap } from "@/components/sites/definica/roadmap/content";
import { RoadmapPage } from "@/components/sites/definica/roadmap/RoadmapPage";
import { AppFooter } from "@/components/sites/definica/shared/AppFooter";
import { AppHeader } from "@/components/sites/definica/shared/AppHeader";
import { AppShell } from "@/components/sites/definica/shared/AppShell";

const { title, description } = roadmap.seo;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/roadmap" },
  openGraph: { title: `${title} — Definica`, description, siteName: "Definica", locale: "en_GB", type: "website", url: "/roadmap" },
  twitter: { card: "summary_large_image", title: `${title} — Definica`, description, site: "@definicacom" },
};

export default function Roadmap() {
  return (
    <AppShell header={<AppHeader />} footer={<AppFooter />}>
      <RoadmapPage />
    </AppShell>
  );
}
