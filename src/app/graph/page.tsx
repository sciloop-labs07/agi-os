import { KnowledgeGraph } from "@/components/knowledge-graph";
import { AppShell } from "@/components/app-shell";
import { Kicker, Panel } from "@/components/ui/panel";
import { graphEdges, graphNodes } from "@/lib/graph";

export default function GraphPage() {
  return (
    <AppShell active="/graph">
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Kicker>Knowledge Graph</Kicker>
          <h1 className="mt-3 text-3xl font-semibold text-white">Causal architecture map</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            Connects paradigms, bottlenecks, hardware dependencies, safety surfaces, and innovation pathways.
          </p>
        </div>
        <Panel className="grid grid-cols-2 gap-5 p-4 text-center sm:w-72">
          <div><div className="font-mono text-2xl text-cyan-signal">{graphNodes.length}</div><div className="text-xs text-slate-500">nodes</div></div>
          <div><div className="font-mono text-2xl text-lime-signal">{graphEdges.length}</div><div className="text-xs text-slate-500">relations</div></div>
        </Panel>
      </div>
      <KnowledgeGraph />
    </AppShell>
  );
}
