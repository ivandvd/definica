import { HomePage } from "@/components/sites/ctrl-xyz-d5a73559/root-8a5edab2/HomePage";
import { AppFooter } from "@/components/sites/ctrl-xyz-d5a73559/shared/AppFooter";
import { AppHeader } from "@/components/sites/ctrl-xyz-d5a73559/shared/AppHeader";
import { AppShell } from "@/components/sites/ctrl-xyz-d5a73559/shared/AppShell";

export default function Home() {
  return (
    <AppShell header={<AppHeader />} footer={<AppFooter />}>
      <HomePage />
    </AppShell>
  );
}
