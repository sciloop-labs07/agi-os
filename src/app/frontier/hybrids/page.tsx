import { CredibilityGrid } from "@/components/credibility-grid";
import { AppShell } from "@/components/app-shell";
import { Kicker, Panel } from "@/components/ui/panel";
import { hybridArchitectures } from "@/lib/frontier/engine";

export default function HybridArchitecturesPage() {
  return (
    <AppShell active="/frontier">
      <Kicker>Hybrid AGI Architecture Generator</Kicker>
      <h1 className="mt-3 text-3xl font-semibold text-white">Generated architecture candidates</h1>
      <div className="mt-6 grid gap-5">
        {hybridArchitectures.map((architecture) => (
          <Panel key={architecture.id}>
            <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
              <div>
                <Kicker>{architecture.estimatedTimeline}</Kicker>
                <h2 className="mt-2 text-2xl font-semibold text-white">{architecture.name}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{architecture.thesis}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {architecture.components.map((component) => (
                    <span key={component} className="rounded-md border border-cyan-signal/20 bg-cyan-signal/8 px-2 py-1 text-xs text-cyan-signal">{component}</span>
                  ))}
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <ListBlock title="Strengths" values={architecture.strengths} />
                  <ListBlock title="Weaknesses" values={architecture.weaknesses} />
                  <ListBlock title="Breakthroughs" values={architecture.requiredBreakthroughs} />
                </div>
                <div className="mt-5 rounded-lg border border-lime-signal/20 bg-lime-signal/5 p-4 text-sm leading-6 text-slate-300">
                  {architecture.civilizationImpact}
                </div>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                <h3 className="mb-4 text-sm font-semibold text-white">Feasibility vector</h3>
                <CredibilityGrid score={architecture.feasibility} />
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </AppShell>
  );
}

function ListBlock({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-3 space-y-2">
        {values.map((value) => <li key={value} className="text-xs leading-5 text-slate-400">{value}</li>)}
      </ul>
    </div>
  );
}
