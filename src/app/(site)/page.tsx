import { HomePage } from "@/components/sites/definica/root-8a5edab2/HomePage";
import { AppFooter } from "@/components/sites/definica/shared/AppFooter";
import { AppHeader } from "@/components/sites/definica/shared/AppHeader";
import { AppShell } from "@/components/sites/definica/shared/AppShell";

export default function Home() {
  return (
    <AppShell header={<AppHeader />} footer={<AppFooter />}>
      <HomePage />
    </AppShell>
  );
}
