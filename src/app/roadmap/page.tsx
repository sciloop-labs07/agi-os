import { AppShell } from "@/components/app-shell";
import { Kicker, Panel } from "@/components/ui/panel";

const phases = [
  ["Foundation Map", "Index paradigms, metrics, causal dependencies, safety surfaces, and core bottlenecks."],
  ["Simulation Layer", "Model compute scaling, energy constraints, hardware maturity, and capability timelines."],
  ["Experiment Engine", "Convert opportunities into protocols, benchmarks, hardware requirements, and reproducibility tracks."],
  ["Hybrid Architecture Lab", "Prototype routed systems across digital models, agents, robotics, photonic/analog accelerators, and human institutions."],
  ["Governed RSI Track", "Study recursive improvement under verification gates, capability evaluations, and shutdown-ready controls."]
];

export default function RoadmapPage() {
  return (
    <AppShell active="/roadmap">
      <Kicker>AGI Roadmap</Kicker>
      <h1 className="mt-3 text-3xl font-semibold text-white">Missing technologies and execution order</h1>
      <div className="mt-6 grid gap-4">
        {phases.map(([title, body], index) => (
          <Panel key={title} className="grid gap-4 md:grid-cols-[90px_1fr_220px] md:items-center">
            <div className="font-mono text-3xl text-cyan-signal">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-center font-mono text-xs uppercase tracking-[0.18em] text-lime-signal">
              {index < 2 ? "active" : "queued"}
            </div>
          </Panel>
        ))}
      </div>
    </AppShell>
  );
}
