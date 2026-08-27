"use client";

import { useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, MiniMap, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";
import { emergenceEdges, emergenceNodes, type EmergenceNodeKind } from "@/lib/emergence-map";
import { Kicker, MetricBar } from "@/components/ui/panel";

const kindStyles: Record<EmergenceNodeKind, { bg: string; border: string; color: string }> = {
  input: { bg: "rgba(148,163,184,0.14)", border: "rgba(148,163,184,0.34)", color: "#e2e8f0" },
  representation: { bg: "rgba(72,229,255,0.12)", border: "rgba(72,229,255,0.38)", color: "#48e5ff" },
  learning: { bg: "rgba(72,229,255,0.12)", border: "rgba(72,229,255,0.38)", color: "#48e5ff" },
  memory: { bg: "rgba(72,229,255,0.12)", border: "rgba(72,229,255,0.38)", color: "#48e5ff" },
  "world-model": { bg: "rgba(182,255,97,0.12)", border: "rgba(182,255,97,0.4)", color: "#b6ff61" },
  reasoning: { bg: "rgba(182,255,97,0.12)", border: "rgba(182,255,97,0.4)", color: "#b6ff61" },
  agency: { bg: "rgba(182,255,97,0.12)", border: "rgba(182,255,97,0.4)", color: "#b6ff61" },
  embodiment: { bg: "rgba(255,255,255,0.08)", border: "rgba(255,255,255,0.18)", color: "#e2e8f0" },
  substrate: { bg: "rgba(255,255,255,0.08)", border: "rgba(255,255,255,0.18)", color: "#e2e8f0" },
  safety: { bg: "rgba(255,95,143,0.12)", border: "rgba(255,95,143,0.38)", color: "#ff9ab8" },
  agi: { bg: "rgba(182,255,97,0.18)", border: "rgba(182,255,97,0.7)", color: "#b6ff61" },
  asi: { bg: "rgba(255,255,255,0.16)", border: "rgba(255,255,255,0.55)", color: "#ffffff" },
  innovation: { bg: "rgba(72,229,255,0.18)", border: "rgba(72,229,255,0.65)", color: "#48e5ff" },
  "weak-point": { bg: "rgba(255,95,143,0.18)", border: "rgba(255,95,143,0.72)", color: "#ff5f8f" }
};

const filters: Array<{ id: "all" | "weak" | "innovation" | "agi"; label: string }> = [
  { id: "all", label: "All variables" },
  { id: "weak", label: "Weak points" },
  { id: "innovation", label: "Innovation zones" },
  { id: "agi", label: "AGI/ASI path" }
];

export function EmergenceMapFlow() {
  const [selectedId, setSelectedId] = useState("agi-threshold");
  const [filter, setFilter] = useState<"all" | "weak" | "innovation" | "agi">("all");

  const selected = emergenceNodes.find((node) => node.id === selectedId) ?? emergenceNodes[0];
  const visibleIds = useMemo(() => {
    if (filter === "all") return new Set(emergenceNodes.map((node) => node.id));
    if (filter === "weak") return new Set(emergenceNodes.filter((node) => node.kind === "weak-point").map((node) => node.id));
    if (filter === "innovation") return new Set(emergenceNodes.filter((node) => node.innovation || node.kind === "innovation").map((node) => node.id));
    return new Set(["world-model", "reasoning-planning", "agency-loop", "alignment-control", "agi-threshold", "self-improvement", "asi-threshold"]);
  }, [filter]);

  const nodes: Node[] = useMemo(() => {
    const stageCounts = new Map<number, number>();
    return emergenceNodes
      .filter((node) => visibleIds.has(node.id))
      .map((node) => {
        const count = stageCounts.get(node.stage) ?? 0;
        stageCounts.set(node.stage, count + 1);
        const style = kindStyles[node.kind];
        const x = (node.stage - 1) * 255;
        const y = count * 136 + (node.kind === "weak-point" ? 56 : 0);
        return {
          id: node.id,
          position: { x, y },
          data: {
            label: (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">S{node.stage} / {node.kind.replace("-", " ")}</div>
                <div className="mt-1 text-sm font-semibold">{node.label}</div>
              </div>
            )
          },
          style: {
            width: 214,
            minHeight: 78,
            borderRadius: 8,
            border: `1px solid ${style.border}`,
            background: style.bg,
            color: style.color,
            boxShadow: node.id === selectedId ? `0 0 0 2px ${style.border}, 0 0 32px ${style.border}` : "none"
          }
        };
      });
  }, [selectedId, visibleIds]);

  const edges: Edge[] = useMemo(() => {
    return emergenceEdges
      .filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target))
      .map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: edge.risk === "high" || edge.strength >= 88,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: {
          stroke: edge.risk === "high" ? "#ff5f8f" : edge.risk === "medium" ? "#b6ff61" : "#48e5ff",
          strokeWidth: Math.max(1.4, edge.strength / 36),
          opacity: 0.78
        },
        labelStyle: { fill: "#cbd5e1", fontSize: 10 },
        labelBgStyle: { fill: "#07111c", fillOpacity: 0.8 }
      }));
  }, [visibleIds]);

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_390px]">
      <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/72">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-3">
          {filters.map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`rounded-md border px-3 py-1.5 text-xs transition ${
                filter === item.id
                  ? "border-cyan-signal/40 bg-cyan-signal/12 text-cyan-signal"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="h-[760px]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            minZoom={0.18}
            maxZoom={1.4}
            onNodeClick={(_, node) => setSelectedId(node.id)}
          >
            <Background color="rgba(72,229,255,0.18)" gap={30} />
            <MiniMap nodeColor={(node) => {
              const source = emergenceNodes.find((item) => item.id === node.id);
              return source ? kindStyles[source.kind].color : "#48e5ff";
            }} maskColor="rgba(2,6,23,0.76)" />
            <Controls />
          </ReactFlow>
        </div>
      </div>

      <aside className="rounded-lg border border-white/10 bg-panel/86 p-5 shadow-glow">
        <Kicker>Selected Variable</Kicker>
        <h2 className="mt-3 text-2xl font-semibold text-white">{selected.label}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">{selected.summary}</p>
        <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-4">
          <h3 className="text-sm font-semibold text-cyan-signal">How intelligence emerges here</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">{selected.emergenceRole}</p>
        </div>
        {selected.weakPoint && (
          <div className="mt-4 rounded-lg border border-rose-signal/30 bg-rose-signal/8 p-4">
            <h3 className="text-sm font-semibold text-rose-signal">Weak point</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{selected.weakPoint}</p>
          </div>
        )}
        {selected.innovation && (
          <div className="mt-4 rounded-lg border border-lime-signal/30 bg-lime-signal/8 p-4">
            <h3 className="text-sm font-semibold text-lime-signal">Innovation opportunity</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{selected.innovation}</p>
          </div>
        )}
        <div className="mt-5 space-y-3">
          <MetricBar label="Stage depth" value={Math.round((selected.stage / 13) * 100)} />
          <MetricBar label="Variable density" value={Math.min(100, selected.variables.length * 14)} />
          <MetricBar label="Paradigm spread" value={Math.min(100, selected.paradigms.length * 17)} />
        </div>
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-white">Variables</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {selected.variables.map((variable) => (
              <span key={variable} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-slate-300">{variable}</span>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-white">Relevant paradigms</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {selected.paradigms.map((paradigm) => (
              <span key={paradigm} className="rounded-md border border-cyan-signal/20 bg-cyan-signal/8 px-2 py-1 font-mono text-[10px] uppercase text-cyan-signal">{paradigm}</span>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-white">Evidence signals</h3>
          <ul className="mt-3 space-y-2">
            {selected.evidence.map((item) => (
              <li key={item} className="text-sm leading-6 text-slate-400">{item}</li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
