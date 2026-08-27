import { AppShell } from "@/components/app-shell";
import { MoneyUniversePortal } from "@/components/money-universe/money-universe-portal";

export default function MoneyUniversePage() {
  return (
    <AppShell active="/money-universe">
      <MoneyUniversePortal />
    </AppShell>
  );
}
