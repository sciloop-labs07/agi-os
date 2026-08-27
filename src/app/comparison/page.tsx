import { ComparisonMatrix } from "@/components/comparison-matrix";
import { AppShell } from "@/components/app-shell";
import { Kicker, Panel } from "@/components/ui/panel";
import { paradigms } from "@/lib/paradigms";

export default function ComparisonPage() {
  const leaders = [...paradigms]
    .sort((a, b) => b.metrics.agiPotential + b.metrics.energyEfficiency - (a.metrics.agiPotential + a.metrics.energyEfficiency))
    .slice(0, 5);

  return (
    <AppShell active="/comparison">
      <Kicker>Comparison Engine</Kicker>
      <h1 className="mt-3 text-3xl font-semibold text-white">Paradigm capability matrix</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
        Compare substrates by energy efficiency, compute density, scalability, hardware maturity, AGI potential, safety, and economics.
      </p>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <Panel>
          <ComparisonMatrix />
        </Panel>
        <Panel>
          <Kicker>Strategic Leaders</Kicker>
          <div className="mt-4 space-y-3">
            {leaders.map((leader, index) => (
              <div key={leader.slug} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-white">{index + 1}. {leader.name}</h2>
                  <span className="font-mono text-cyan-signal">{leader.metrics.agiPotential}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">{leader.thesis}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
