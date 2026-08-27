import { EmergenceMapFlow } from "@/components/emergence-map-flow";
import { AppShell } from "@/components/app-shell";
import { Kicker, Panel } from "@/components/ui/panel";
import { emergenceEdges, emergenceNodes, emergenceSources } from "@/lib/emergence-map";

export default function EmergenceMapPage() {
  const weakPoints = emergenceNodes.filter((node) => node.kind === "weak-point").length;
  const innovationZones = emergenceNodes.filter((node) => node.innovation || node.kind === "innovation").length;

  return (
    <AppShell active="/emergence-map">
      <div className="mb-6 grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(72,229,255,0.12),rgba(255,95,143,0.08))] p-6">
          <Kicker>Interactive AGI Emergence Map</Kicker>
          <h1 className="mt-3 text-4xl font-semibold text-white">How intelligence becomes AGI, then ASI</h1>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">
            A structured causal map from raw signals to representation, learning, memory, world models, reasoning,
            agency, embodiment, compute substrate, alignment, AGI, recursive self-improvement, and ASI. Red nodes are weak
            points; green and cyan nodes show emergence milestones and innovation zones.
          </p>
        </section>
        <Panel>
          <Kicker>Map Density</Kicker>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Stat label="variables" value={emergenceNodes.length} />
            <Stat label="relations" value={emergenceEdges.length} />
            <Stat label="weak points" value={weakPoints} tone="red" />
            <Stat label="innovation" value={innovationZones} tone="lime" />
          </div>
        </Panel>
      </div>

      <EmergenceMapFlow />

      <Panel className="mt-6">
        <Kicker>Research Sources</Kicker>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {emergenceSources.map((source) => (
            <a key={source.url} href={source.url} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300 transition hover:border-cyan-signal/35 hover:text-cyan-signal">
              {source.title}
            </a>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}

function Stat({ label, value, tone = "cyan" }: { label: string; value: number; tone?: "cyan" | "red" | "lime" }) {
  const color = tone === "red" ? "text-rose-signal" : tone === "lime" ? "text-lime-signal" : "text-cyan-signal";
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className={`font-mono text-2xl ${color}`}>{value}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
    </div>
  );
}
