import { AppShell } from "@/components/app-shell";
import { SciLoopFlowDesigner } from "@/components/sciloop-flow/sciloop-flow-designer";

export default function SciLoopFlowDesignerPage() {
  return (
    <AppShell active="/sciloop-flow-designer">
      <SciLoopFlowDesigner />
    </AppShell>
  );
}
