import { AppShell } from "@/components/app-shell";
import { FounderNetworkPortal } from "@/components/founder-network/founder-network-portal";
import { buildFounderNetworkProjection } from "@/lib/founder-network/intelligence";

export default function FounderNetworkPage() {
  return (
    <AppShell active="/founder-network">
      <FounderNetworkPortal initialProjection={buildFounderNetworkProjection()} />
    </AppShell>
  );
}
