import { AppShell } from "@/components/app-shell";
import { BackendLaunchGate } from "@/components/backend-launch-gate";
import { ParadigmCard } from "@/components/paradigm-card";
import { Kicker } from "@/components/ui/panel";
import { paradigms } from "@/lib/paradigms";

export default function ExplorerPage() {
  return (
    <AppShell active="/explorer">
      <Kicker>Paradigm Explorer</Kicker>
      <h1 className="mt-3 text-3xl font-semibold text-white">AI architecture portals</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
        Each portal is structured around mechanisms, mathematical models, advantages, bottlenecks, timelines, risks,
        and execution opportunities.
      </p>
      <BackendLaunchGate />
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {paradigms.map((paradigm) => <ParadigmCard key={paradigm.slug} paradigm={paradigm} />)}
      </div>
    </AppShell>
  );
}
