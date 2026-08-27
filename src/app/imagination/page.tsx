import { AppShell } from "@/components/app-shell";
import { ImaginationLab } from "@/components/imagination-lab";

export default function ImaginationPage() {
  return (
    <AppShell active="/imagination">
      <ImaginationLab />
    </AppShell>
  );
}
