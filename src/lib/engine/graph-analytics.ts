import type { SciLoopEdge, SciLoopNode } from "@/lib/sciloop-flow";

export type GraphAnalytics = { nodes: number; connections: number; cycles: number; reasoningDepth: number; executionTime: number; complexity: number; knowledgeScore: number; validationCoverage: number; unknowns: number; rules: number; hypotheses: number };

export function analyzeReasoningGraph(nodes: SciLoopNode[], edges: SciLoopEdge[]): GraphAnalytics {
  const adjacency = new Map(nodes.map((node) => [node.id, edges.filter((edge) => edge.source === node.id).map((edge) => edge.target)]));
  const visit = (id: string, stack: Set<string>, seen: Set<string>): number => {
    if (stack.has(id)) return 1;
    if (seen.has(id)) return 0;
    seen.add(id); stack.add(id);
    const depth = Math.max(0, ...(adjacency.get(id) ?? []).map((target) => visit(target, stack, seen))) + 1;
    stack.delete(id);
    return depth;
  };
  const seen = new Set<string>();
  const depths = nodes.map((node) => visit(node.id, new Set(), seen));
  const validations = nodes.filter((node) => ["Simulation", "Experiment", "Observation", "Feedback"].includes(node.data.nodeType)).length;
  return { nodes: nodes.length, connections: edges.length, cycles: edges.filter((edge) => edge.label === "repeat" || edge.animated).length, reasoningDepth: Math.max(0, ...depths), executionTime: Math.round(nodes.length * 85 + edges.length * 24), complexity: Math.round(nodes.length * 3.2 + edges.length * 1.7), knowledgeScore: Math.min(100, Math.round((nodes.filter((node) => ["Pattern", "Hypothesis", "Rule", "Explanation", "Mastery"].includes(node.data.nodeType)).length / Math.max(nodes.length, 1)) * 140)), validationCoverage: Math.min(100, Math.round(validations / Math.max(nodes.length, 1) * 100)), unknowns: nodes.filter((node) => node.data.nodeType === "Unknown").length, rules: nodes.filter((node) => node.data.nodeType === "Rule").length, hypotheses: nodes.filter((node) => node.data.nodeType === "Hypothesis").length };
}
