import { AppShell } from "@/components/app-shell";
import { NetworkingPortal } from "@/components/networking/networking-portal";

export default function NetworkingPage() {
  return (
    <AppShell active="/networking">
      <NetworkingPortal />
    </AppShell>
  );
}
