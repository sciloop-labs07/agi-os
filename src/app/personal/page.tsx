import { AppShell } from "@/components/app-shell";
import { PersonalMonitoringPortal } from "@/components/personal/personal-monitoring-portal";
import { listPersonalEvents } from "@/lib/personal/event-engine";
import { buildPersonalProjection } from "@/lib/personal/projections";

export default function PersonalPage() {
  const events = listPersonalEvents({ limit: 80 });
  const projection = buildPersonalProjection(listPersonalEvents({ limit: 500 }));

  return (
    <AppShell active="/personal">
      <PersonalMonitoringPortal initialEvents={events} initialProjection={projection} />
    </AppShell>
  );
}
