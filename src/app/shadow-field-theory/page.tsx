import { AppShell } from "@/components/app-shell";
import { ShadowFieldTheoryLab } from "@/components/shadow-field-theory-lab";

export default function ShadowFieldTheoryPage() {
  return (
    <AppShell active="/shadow-field-theory">
      <ShadowFieldTheoryLab />
    </AppShell>
  );
}

