import { AppShell } from "@/components/app-shell";
import { SciLoopSynthesisDashboard } from "@/components/sciloop-synthesis-dashboard";

export default function SciLoopSynthesisPage() {
  return <AppShell active="/sciloop"><SciLoopSynthesisDashboard /></AppShell>;
}
