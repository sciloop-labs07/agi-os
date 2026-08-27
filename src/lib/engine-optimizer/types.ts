import type { SciLoopEdge, SciLoopNode } from "@/lib/sciloop-flow";

export const optimizerMetricKeys = [
  "understanding", "curiosity", "attention", "retention", "recall", "learningSpeed", "cognitiveLoad", "engagement", "motivation", "confidence", "predictionAccuracy", "discoveryRate", "interactionQuality", "simplicity", "informationDensity", "transferLearning", "masteryProbability", "overall"
] as const;
export type OptimizerMetricKey = (typeof optimizerMetricKeys)[number];
export type OptimizerScores = Record<OptimizerMetricKey, number>;
export type NodeParameters = { intensity: number; novelty: number; challenge: number; repetition: number };
export type EngineGenome = {
  id: string;
  nodes: SciLoopNode[];
  edges: SciLoopEdge[];
  parameters: Record<string, NodeParameters>;
  scores: OptimizerScores;
  generation: number;
};
export type OptimizerConfig = {
  populationSize: number;
  targetScore: number;
  maxGenerations: number;
  maxSimulations: number;
  patience: number;
};
export type OptimizationStatus = "idle" | "running" | "paused" | "completed" | "stopped";
export type GenerationSnapshot = { generation: number; best: number; average: number; worst: number };
export type OptimizationReport = {
  totalSimulations: number;
  totalGenerations: number;
  searchTimeMs: number;
  best: EngineGenome | null;
  topEngines: EngineGenome[];
  distribution: number[];
  history: GenerationSnapshot[];
  recommendation: string;
};
