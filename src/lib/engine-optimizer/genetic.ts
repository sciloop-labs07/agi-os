import type { SciLoopEdge, SciLoopNode } from "@/lib/sciloop-flow";
import { crossoverEngines } from "./crossover";
import { mutateEngine } from "./mutation";
import { scoreEngine } from "./scoring";
import type { EngineGenome, GenerationSnapshot, NodeParameters, OptimizerConfig, OptimizationReport, OptimizerScores } from "./types";

const blankScores = (): OptimizerScores => ({ understanding: 0, curiosity: 0, attention: 0, retention: 0, recall: 0, learningSpeed: 0, cognitiveLoad: 0, engagement: 0, motivation: 0, confidence: 0, predictionAccuracy: 0, discoveryRate: 0, interactionQuality: 0, simplicity: 0, informationDensity: 0, transferLearning: 0, masteryProbability: 0, overall: 0 });
const baseParameters = (nodes: SciLoopNode[]) => Object.fromEntries(nodes.map((node) => [node.id, { intensity: 50, novelty: node.data.nodeType === "Curiosity" ? 72 : 50, challenge: node.data.nodeType === "Challenge" ? 68 : 50, repetition: node.data.nodeType === "Experiment" ? 64 : 50 } satisfies NodeParameters]));
const nextId = (counter: { value: number }) => `C${String(counter.value++).padStart(4, "0")}`;
const cloneFlow = (nodes: SciLoopNode[], edges: SciLoopEdge[]) => ({ nodes: nodes.map((node) => ({ ...node, data: { ...node.data } })), edges: edges.map((edge) => ({ ...edge, data: edge.data ? { ...edge.data } : undefined })) });

export function createInitialPopulation(nodes: SciLoopNode[], edges: SciLoopEdge[], config: OptimizerConfig, counter: { value: number }, seed?: Record<string, NodeParameters>): EngineGenome[] {
  return Array.from({ length: config.populationSize }, (_, index) => {
    const flow = cloneFlow(nodes, edges);
    const parameters = Object.fromEntries(Object.entries(seed ?? baseParameters(flow.nodes)).map(([nodeId, value]) => [nodeId, { ...value }]));
    Object.values(parameters).forEach((parameter, parameterIndex) => { parameter.intensity = Math.max(0, Math.min(100, parameter.intensity + (index - parameterIndex) * 3)); });
    return { id: nextId(counter), nodes: flow.nodes, edges: flow.edges, parameters, scores: blankScores(), generation: 0 };
  });
}

export function evaluatePopulation(population: EngineGenome[]): EngineGenome[] {
  return population.map((engine) => ({ ...engine, scores: scoreEngine(engine.nodes, engine.edges, engine.parameters) })).sort((a, b) => b.scores.overall - a.scores.overall);
}

export function evolvePopulation(ranked: EngineGenome[], generation: number, config: OptimizerConfig, counter: { value: number }): EngineGenome[] {
  const eliteCount = Math.max(1, Math.ceil(config.populationSize * .1));
  const elites = ranked.slice(0, eliteCount).map((engine) => ({ ...engine, id: nextId(counter), generation }));
  const children: EngineGenome[] = [];
  while (elites.length + children.length < config.populationSize) {
    const first = ranked[Math.floor(Math.random() * Math.max(ranked.length, 1))] ?? ranked[0];
    const second = ranked[Math.floor(Math.random() * Math.max(ranked.length, 1))] ?? ranked[0];
    const child = mutateEngine(crossoverEngines(first, second, generation), generation);
    children.push({ ...child, id: nextId(counter) });
  }
  return [...elites, ...children];
}

export function generationSnapshot(ranked: EngineGenome[], generation: number): GenerationSnapshot {
  const scores = ranked.map((engine) => engine.scores.overall);
  return { generation, best: scores[0] ?? 0, average: scores.reduce((sum, value) => sum + value, 0) / Math.max(scores.length, 1), worst: scores[scores.length - 1] ?? 0 };
}

export function makeReport(history: GenerationSnapshot[], finalPopulation: EngineGenome[], totalSimulations: number, searchTimeMs: number): OptimizationReport {
  const topEngines = [...finalPopulation].sort((a, b) => b.scores.overall - a.scores.overall).slice(0, 10);
  const best = topEngines[0] ?? null;
  return { totalSimulations, totalGenerations: history.length, searchTimeMs, best, topEngines, distribution: finalPopulation.map((engine) => engine.scores.overall), history, recommendation: best ? `Prefer ${best.id}: it balances ${best.scores.understanding.toFixed(0)} understanding with ${best.scores.masteryProbability.toFixed(0)} mastery probability. Validate this candidate with real learner data before promoting it.` : "Run the optimizer to generate a recommendation." };
}
