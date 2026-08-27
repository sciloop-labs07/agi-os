import { AppShell } from "@/components/app-shell";
import { SelfEvolvingEngine } from "@/components/sciloop-flow/self-evolving-engine";

export default function SelfEvolvingEnginePage() {
  return <AppShell active="/self-evolving-engine"><SelfEvolvingEngine /></AppShell>;
}
