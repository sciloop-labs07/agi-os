import type { SciLoopEdge, SciLoopNode } from "@/lib/sciloop-flow";

export type ExecutionFrame = { nodeId: string; state: "waiting" | "running" | "completed" | "failed" | "skipped"; order: number };

export function createExecutionPlan(nodes: SciLoopNode[], edges: SciLoopEdge[]): ExecutionFrame[] {
  const incoming = new Map(nodes.map((node) => [node.id, edges.filter((edge) => edge.target === node.id).length]));
  const queue = nodes.filter((node) => (incoming.get(node.id) ?? 0) === 0).map((node) => node.id);
  const order: string[] = [];
  while (queue.length) {
    const id = queue.shift();
    if (!id || order.includes(id)) continue;
    order.push(id);
    edges.filter((edge) => edge.source === id).forEach((edge) => { const next = (incoming.get(edge.target) ?? 1) - 1; incoming.set(edge.target, next); if (next <= 0) queue.push(edge.target); });
  }
  nodes.forEach((node) => { if (!order.includes(node.id)) order.push(node.id); });
  return order.map((nodeId, index) => ({ nodeId, state: "waiting", order: index }));
}
