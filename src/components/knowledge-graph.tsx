"use client";

import ReactFlow, { Background, Controls, MiniMap, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";
import { graphEdges, graphNodes } from "@/lib/graph";

const nodes: Node[] = graphNodes.map((node, index) => ({
  id: node.id,
  position: {
    x: Math.cos(index * 0.74) * (260 + (index % 4) * 35) + 420,
    y: Math.sin(index * 0.74) * (220 + (index % 3) * 45) + 300
  },
  data: { label: node.label },
  style: {
    background: node.type === "paradigm" ? "rgba(72,229,255,0.12)" : "rgba(255,255,255,0.06)",
    border: "1px solid rgba(72,229,255,0.35)",
    color: "#e2e8f0",
    borderRadius: 8,
    fontSize: 12,
    width: node.type === "paradigm" ? 170 : 150
  }
}));

const edges: Edge[] = graphEdges.map((edge) => ({
  id: edge.id,
  source: edge.source,
  target: edge.target,
  label: edge.label,
  animated: edge.weight > 84,
  style: { stroke: edge.weight > 84 ? "#b6ff61" : "#48e5ff", opacity: 0.68 },
  labelStyle: { fill: "#cbd5e1", fontSize: 10 }
}));

export function KnowledgeGraph() {
  return (
    <div className="h-[680px] overflow-hidden rounded-lg border border-white/10 bg-slate-950/70">
      <ReactFlow nodes={nodes} edges={edges} fitView minZoom={0.35} maxZoom={1.6}>
        <Background color="rgba(72,229,255,0.18)" gap={28} />
        <MiniMap nodeColor="#48e5ff" maskColor="rgba(2,6,23,0.72)" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
