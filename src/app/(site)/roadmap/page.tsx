import type { Metadata } from "next";
import { roadmap } from "@/components/sites/definica/roadmap/content";
import { RoadmapPage } from "@/components/sites/definica/roadmap/RoadmapPage";
import { AppFooter } from "@/components/sites/definica/shared/AppFooter";
import { AppHeader } from "@/components/sites/definica/shared/AppHeader";
import { AppShell } from "@/components/sites/definica/shared/AppShell";

const SEO = "/sites/definica/shared/seo";
const { title, description } = roadmap.seo;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, siteName: "Definica", locale: "en_GB", images: `${SEO}/og-image.png` },
  twitter: { card: "summary_large_image", title, description, images: `${SEO}/og-image.png` },
};

export default function Roadmap() {
  return (
    <AppShell header={<AppHeader />} footer={<AppFooter />}>
      <RoadmapPage />
    </AppShell>
  );
}
