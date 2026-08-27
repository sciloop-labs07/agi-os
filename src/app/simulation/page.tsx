import { AppShell } from "@/components/app-shell";
import { Kicker, MetricBar, Panel } from "@/components/ui/panel";

const scenarios = [
  ["Compute scaling", 82, "Frontier digital systems continue rapid inference and memory optimization."],
  ["Energy bottleneck", 68, "Power availability and cooling shape datacenter expansion and hardware routing."],
  ["Robotics grounding", 57, "Embodied learning improves real-world causal models, but safety cost remains high."],
  ["Recursive acceleration", 44, "Self-improvement loops become useful only under strong verification and evaluation gates."]
];

export default function SimulationPage() {
  return (
    <AppShell active="/simulation">
      <Kicker>Future Simulation</Kicker>
      <h1 className="mt-3 text-3xl font-semibold text-white">Timeline and bottleneck scenario lab</h1>
      <div className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <Panel>
          <Kicker>Controls</Kicker>
          <div className="mt-5 space-y-5">
            <MetricBar label="Compute growth" value={78} />
            <MetricBar label="Energy abundance" value={52} />
            <MetricBar label="Safety governance" value={61} />
            <MetricBar label="Hardware breakthrough rate" value={46} />
          </div>
        </Panel>
        <Panel>
          <Kicker>Projected Pathways</Kicker>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {scenarios.map(([title, score, body]) => (
              <div key={title} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-white">{title}</h2>
                  <span className="font-mono text-cyan-signal">{score}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
