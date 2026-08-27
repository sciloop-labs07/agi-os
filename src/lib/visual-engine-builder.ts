import type { SciLoopNode } from "@/lib/sciloop-flow";
import type { EngineGenome, OptimizerScores } from "@/lib/engine-optimizer/types";

export type KnowledgeEntity = { id: string; kind: "Object" | "Property" | "Relation" | "Rule" | "Process" | "Variable" | "Unknown"; label: string; confidence: number };
export type VisualMapping = { source: string; primitive: "Object" | "Motion" | "Time" | "Relationship" | "Force" | "Energy" | "Probability" | "Interaction" | "Context"; behavior: string };
export type EngineVersion = { id: string; version: number; promotedAt: string; score: number; engine: EngineGenome; concept: string; telemetry: { predicted: number; human: number } };

export const visualPrimitives: VisualMapping["primitive"][] = ["Object", "Motion", "Time", "Relationship", "Force", "Energy", "Probability", "Interaction", "Context"];

export function extractKnowledge(concept: string): KnowledgeEntity[] {
  const clean = concept.trim() || "New concept";
  const words = clean.split(/\s+/).filter(Boolean);
  const subject = words.slice(0, 3).join(" ");
  return [
    { id: "object", kind: "Object", label: subject, confidence: 92 },
    { id: "property", kind: "Property", label: `${subject} characteristics`, confidence: 76 },
    { id: "relation", kind: "Relation", label: `${subject} connections`, confidence: 69 },
    { id: "process", kind: "Process", label: `${subject} changes over time`, confidence: 73 },
    { id: "variable", kind: "Variable", label: "Observable variables", confidence: 64 },
    { id: "rule", kind: "Rule", label: "Testable rule to discover", confidence: 58 },
    { id: "unknown", kind: "Unknown", label: "Open question", confidence: 41 }
  ];
}

export function mapKnowledgeToVisuals(entities: KnowledgeEntity[]): VisualMapping[] {
  return entities.map((entity, index) => ({ source: entity.label, primitive: visualPrimitives[index % visualPrimitives.length], behavior: entity.kind === "Unknown" ? "Invite a prediction" : `Represent ${entity.kind.toLowerCase()} as an observable change` }));
}

export function stateMachine(nodes: SciLoopNode[]) {
  return nodes.map((node, index) => ({ state: `S${String(index + 1).padStart(2, "0")}`, label: node.data.label, type: node.data.nodeType, transition: index < nodes.length - 1 ? "advance / observe" : "mastery / transfer" }));
}

export function simulationStages(nodes: SciLoopNode[]) {
  return ["Initialize learner state", ...nodes.filter((node) => ["Prediction", "Simulation", "Observation", "Experiment", "Feedback"].includes(node.data.nodeType)).map((node) => node.data.label), "Evaluate telemetry", "Compare predicted vs human results"];
}

export function scoreLabels(scores: OptimizerScores) {
  return [
    ["Understanding", scores.understanding], ["Retention", scores.retention], ["Attention", scores.attention], ["Prediction accuracy", scores.predictionAccuracy], ["Transfer learning", scores.transferLearning], ["Mastery probability", scores.masteryProbability], ["Overall engine score", scores.overall]
  ] as Array<[string, number]>;
}
