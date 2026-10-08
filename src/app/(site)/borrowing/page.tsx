import type { Metadata } from "next";
import { BorrowingPage } from "@/components/sites/definica/borrowing/BorrowingPage";
import { borrowing } from "@/components/sites/definica/borrowing/content";
import { AppFooter } from "@/components/sites/definica/shared/AppFooter";
import { AppHeader } from "@/components/sites/definica/shared/AppHeader";
import { AppShell } from "@/components/sites/definica/shared/AppShell";

const { title, description } = borrowing.seo;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/borrowing" },
  openGraph: { title: `${title} — Definica`, description, siteName: "Definica", locale: "en_GB", type: "website", url: "/borrowing" },
  twitter: { card: "summary_large_image", title: `${title} — Definica`, description, site: "@definicacom" },
};

export default function Borrowing() {
  return (
    <AppShell header={<AppHeader />} footer={<AppFooter />}>
      <BorrowingPage />
    </AppShell>
  );
}
