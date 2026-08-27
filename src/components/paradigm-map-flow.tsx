"use client";

import { useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MarkerType, MiniMap, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";
import type { ParadigmEmergenceMap, ParadigmMapNodeKind } from "@/lib/paradigm-emergence-maps";
import { Kicker, MetricBar } from "@/components/ui/panel";

const styles: Record<ParadigmMapNodeKind, { bg: string; border: string; text: string }> = {
  substrate: { bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.35)", text: "#e2e8f0" },
  signal: { bg: "rgba(72,229,255,0.12)", border: "rgba(72,229,255,0.38)", text: "#48e5ff" },
  representation: { bg: "rgba(72,229,255,0.12)", border: "rgba(72,229,255,0.38)", text: "#48e5ff" },
  learning: { bg: "rgba(182,255,97,0.11)", border: "rgba(182,255,97,0.38)", text: "#b6ff61" },
  memory: { bg: "rgba(72,229,255,0.12)", border: "rgba(72,229,255,0.38)", text: "#48e5ff" },
  architecture: { bg: "rgba(255,255,255,0.08)", border: "rgba(255,255,255,0.18)", text: "#f8fafc" },
  bottleneck: { bg: "rgba(255,95,143,0.18)", border: "rgba(255,95,143,0.72)", text: "#ff5f8f" },
  innovation: { bg: "rgba(182,255,97,0.14)", border: "rgba(182,255,97,0.56)", text: "#b6ff61" },
  agi: { bg: "rgba(72,229,255,0.18)", border: "rgba(72,229,255,0.65)", text: "#48e5ff" },
  asi: { bg: "rgba(255,255,255,0.16)", border: "rgba(255,255,255,0.54)", text: "#ffffff" },
  safety: { bg: "rgba(255,95,143,0.12)", border: "rgba(255,95,143,0.42)", text: "#ff9ab8" }
};

export function ParadigmMapFlow({ map }: { map: ParadigmEmergenceMap }) {
  const [selectedId, setSelectedId] = useState(`${map.slug}-bottleneck`);
  const selected = map.nodes.find((node) => node.id === selectedId) ?? map.nodes[0];

  const nodes: Node[] = useMemo(
    () =>
      map.nodes.map((node) => {
        const style = styles[node.kind];
        return {
          id: node.id,
          position: {
            x: (node.stage - 1) * 240,
            y: node.kind === "bottleneck" ? 120 : node.kind === "innovation" ? 250 : 0
          },
          data: {
            label: (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">S{node.stage} / {node.kind}</div>
                <div className="mt-1 text-sm font-semibold">{node.label}</div>
              </div>
            )
          },
          style: {
            width: 205,
            minHeight: 78,
            borderRadius: 8,
            background: style.bg,
            border: `1px solid ${style.border}`,
            color: style.text,
            boxShadow: selectedId === node.id ? `0 0 0 2px ${style.border}, 0 0 34px ${style.border}` : undefined
          }
        };
      }),
    [map.nodes, selectedId]
  );

  const edges: Edge[] = useMemo(
    () =>
      map.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: edge.risk === "high",
        markerEnd: { type: MarkerType.ArrowClosed },
        style: {
          stroke: edge.risk === "high" ? "#ff5f8f" : edge.risk === "medium" ? "#b6ff61" : map.color,
          strokeWidth: edge.risk === "high" ? 2.7 : 1.8,
          opacity: 0.78
        },
        labelStyle: { fill: "#cbd5e1", fontSize: 10 },
        labelBgStyle: { fill: "#07111c", fillOpacity: 0.82 }
      })),
    [map.color, map.edges]
  );

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
      <div className="h-[640px] overflow-hidden rounded-lg border border-white/10 bg-slate-950/72">
        <ReactFlow nodes={nodes} edges={edges} fitView minZoom={0.2} maxZoom={1.5} onNodeClick={(_, node) => setSelectedId(node.id)}>
          <Background color="rgba(72,229,255,0.18)" gap={30} />
          <MiniMap
            nodeColor={(node) => {
              const source = map.nodes.find((item) => item.id === node.id);
              return source ? styles[source.kind].text : map.color;
            }}
            maskColor="rgba(2,6,23,0.76)"
          />
          <Controls />
        </ReactFlow>
      </div>

      <aside className="rounded-lg border border-white/10 bg-panel/86 p-5 shadow-glow">
        <Kicker>{map.name}</Kicker>
        <h2 className="mt-3 text-2xl font-semibold text-white">{selected.label}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">{selected.summary}</p>
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
          <MetricBar label="Emergence depth" value={Math.round((selected.stage / 9) * 100)} />
          <MetricBar label="Variable density" value={Math.min(100, selected.variables.length * 16)} />
        </div>
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-white">Variables</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {selected.variables.map((variable) => (
              <span key={variable} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-slate-300">
                {variable}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
