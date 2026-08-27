import { AppShell } from "@/components/app-shell";
import { NegativeTraceIntelligenceLab } from "@/components/negative-trace-intelligence-lab";

export default function NegativeTraceIntelligencePage() {
  return (
    <AppShell active="/negative-trace-intelligence">
      <NegativeTraceIntelligenceLab />
    </AppShell>
  );
}
