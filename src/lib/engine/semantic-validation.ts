import type { SciLoopEdge, SciLoopNode } from "@/lib/sciloop-flow";
import { nodeRegistry, type ReasoningNodeType } from "./node-registry";

export type ValidationSeverity = "error" | "warning" | "info";
export type GraphValidation = { id: string; severity: ValidationSeverity; message: string; source?: string; target?: string };

export type TransitionValidation = { severity: ValidationSeverity; message: string };

export function validateTransition(sourceType: ReasoningNodeType, targetType: ReasoningNodeType): TransitionValidation {
  const source = nodeRegistry[sourceType];
  const target = nodeRegistry[targetType];
  if (source.validNextNodes.includes(targetType)) return { severity: "info", message: `${source.displayName} → ${target.displayName} is a supported reasoning transition.` };
  return { severity: "warning", message: `${source.displayName} → ${target.displayName} is outside the strongest semantic path. ${source.displayName} usually produces ${source.producedOutputs.join(", ") || "a terminal state"}; this connection may weaken reasoning clarity.` };
}

export function validateReasoningGraph(nodes: SciLoopNode[], edges: SciLoopEdge[]): GraphValidation[] {
  const issues: GraphValidation[] = [];
  const byId = new Map(nodes.map((node) => [node.id, node]));
  edges.forEach((edge) => {
    const source = byId.get(edge.source);
    const target = byId.get(edge.target);
    if (!source || !target) return;
    const sourceType = source.data.nodeType;
    const targetType = target.data.nodeType;
    const transition = validateTransition(sourceType, targetType);
    if (transition.severity !== "info" || !nodeRegistry[sourceType].validNextNodes.includes(targetType)) issues.push({ id: `edge-${edge.id}`, severity: transition.severity, message: transition.message, source: source.id, target: target.id });
  });
  nodes.forEach((node) => {
    const incoming = edges.filter((edge) => edge.target === node.id).length;
    const outgoing = edges.filter((edge) => edge.source === node.id).length;
    if (node.data.nodeType !== "Experience" && incoming === 0) issues.push({ id: `dead-start-${node.id}`, severity: "warning", message: `${node.data.label} has no incoming reasoning signal.`, source: node.id });
    if (node.data.nodeType !== "Mastery" && outgoing === 0) issues.push({ id: `dead-end-${node.id}`, severity: "warning", message: `${node.data.label} is a dead end. Add a next operation or mark it as a deliberate stopping point.`, source: node.id });
  });
  if (!nodes.some((node) => node.data.nodeType === "Simulation" || node.data.nodeType === "Experiment")) issues.push({ id: "missing-validation", severity: "error", message: "No validation node exists. Add a Simulation or Experiment before trusting the graph." });
  if (!nodes.some((node) => node.data.nodeType === "Rule")) issues.push({ id: "missing-rule", severity: "warning", message: "No reusable Rule is extracted yet. Connect evidence to a Rule for knowledge compression." });
  return issues;
}
