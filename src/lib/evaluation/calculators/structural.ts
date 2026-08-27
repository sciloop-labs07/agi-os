import type { Candidate, CognitiveNode } from "@/lib/cognitive-lab/types";
import type { MetricContext, MetricEvidence } from "../types";

export const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
export const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
export const nodeTypes = (context: MetricContext) => context.graph.nodes.map((node) => node.metadata.nodeType);
export const has = (context: MetricContext, type: string) => nodeTypes(context).includes(type as never);
export const count = (context: MetricContext, type: string) => nodeTypes(context).filter((item) => item === type).length;

export function longestPath(context: MetricContext): number {
  const adjacency = new Map<string, string[]>();
  context.graph.connections.forEach((connection) => adjacency.set(connection.sourceId, [...(adjacency.get(connection.sourceId) ?? []), connection.targetId]));
  const memo = new Map<string, number>();
  const visit = (nodeId: string, active: Set<string>): number => {
    if (active.has(nodeId)) return 0;
    if (memo.has(nodeId)) return memo.get(nodeId) ?? 0;
    const next = new Set(active).add(nodeId);
    const depth = 1 + Math.max(0, ...(adjacency.get(nodeId) ?? []).map((targetId) => visit(targetId, next)));
    memo.set(nodeId, depth);
    return depth;
  };
  return Math.max(0, ...context.graph.nodes.map((node) => visit(node.id, new Set())));
}

export function evidence(kind: MetricEvidence["kind"], text: string): MetricEvidence { return { kind, text }; }
export function nodeLabel(context: MetricContext, type: string) { return context.graph.nodes.find((node) => node.metadata.nodeType === type)?.label ?? type; }
export function stageEvidence(context: MetricContext, stages: string[]): MetricEvidence[] { return stages.map((stage) => has(context, stage) ? evidence("support", `${stage} exists`) : evidence("missing", `${stage} is missing`)); }
export function connectedTypes(context: MetricContext): Set<string> {
  const ids = new Set<string>();
  context.graph.connections.forEach((connection) => { ids.add(connection.sourceId); ids.add(connection.targetId); });
  return new Set(context.graph.nodes.filter((node) => ids.has(node.id)).map((node) => node.metadata.nodeType));
}
export function signature(candidate: Candidate): string { return candidate.graph.nodes.map((node) => node.metadata.nodeType).join(" → "); }
export function uniqueStructuralNodes(context: MetricContext): CognitiveNode[] { return context.graph.nodes.filter((node, index, nodes) => nodes.findIndex((item) => item.metadata.nodeType === node.metadata.nodeType) === index); }
