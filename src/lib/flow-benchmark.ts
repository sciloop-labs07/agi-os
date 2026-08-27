import { analyzeReasoningGraph } from "@/lib/engine/graph-analytics";
import { scoreEngine } from "@/lib/engine-optimizer/scoring";
import type { NodeParameters } from "@/lib/engine-optimizer/types";
import { simulateFlow } from "@/lib/simulation-result-engine";
import type { SciLoopEdge, SciLoopNode, SciLoopNodeType, SciLoopConnectionLabel } from "@/lib/sciloop-flow";
import { validateReasoningGraph } from "@/lib/engine/semantic-validation";

export type FlowVariant = {
  id: string;
  name: string;
  thesis: string;
  stages: SciLoopNodeType[];
  loop?: boolean;
  branch?: boolean;
};

export type FlowBenchmarkResult = FlowVariant & {
  nodes: SciLoopNode[];
  edges: SciLoopEdge[];
  reasoningScore: number;
  cognitiveScore: number;
  visualScore: number;
  totalScore: number;
  issueCount: number;
  cognitiveLoad: number;
  strengths: string[];
};

export const flowVariants: FlowVariant[] = [
  { id: "minimal-prediction", name: "Minimal Prediction Loop", thesis: "Fastest path from experience to a falsifiable prediction and feedback.", stages: ["Experience", "Curiosity", "Prediction", "User Action", "Simulation", "Observation", "Feedback", "Mastery"] },
  { id: "discovery-loop", name: "Scientific Discovery Loop", thesis: "Adds pattern, hypothesis, and experiment before compressing knowledge into a rule.", stages: ["Experience", "Curiosity", "Prediction", "User Action", "Simulation", "Observation", "Pattern", "Hypothesis", "Experiment", "Rule", "Explanation", "Challenge", "Mastery"], loop: true },
  { id: "discovery-feedback", name: "Discovery + Feedback Loop", thesis: "Keeps explicit confidence updates after testing while preserving the discovery and transfer stages.", stages: ["Experience", "Curiosity", "Prediction", "User Action", "Simulation", "Observation", "Pattern", "Hypothesis", "Experiment", "Feedback", "Rule", "Explanation", "Challenge", "Mastery"], loop: true },
  { id: "transfer-loop", name: "Transfer Loop", thesis: "Tests whether a discovered rule survives a new situation before mastery.", stages: ["Experience", "Curiosity", "Prediction", "User Action", "Simulation", "Observation", "Pattern", "Hypothesis", "Experiment", "Rule", "Explanation", "User Action", "Challenge", "Mastery"], loop: true, branch: true },
  { id: "full-sci-loop", name: "Full SciLoop Loop", thesis: "The current broad learning architecture with discovery, generalization, application, and mastery.", stages: ["Experience", "Curiosity", "Prediction", "User Action", "Simulation", "Observation", "Challenge", "Feedback", "Curiosity", "Pattern", "Hypothesis", "Experiment", "Rule", "Explanation", "User Action", "Mastery"], loop: true, branch: true },
  { id: "explanation-first", name: "Explanation-First Baseline", thesis: "A conventional explanation path used as a control condition.", stages: ["Experience", "Explanation", "Observation", "User Action", "Feedback", "Mastery"] },
];

const labels: Partial<Record<SciLoopNodeType, string>> = {
  Experience: "Encounter reality", Curiosity: "Open question", Prediction: "Commit prediction", "User Action": "Manipulate variable", Simulation: "Run model", Observation: "Observe result", Challenge: "Transfer challenge", Feedback: "Update confidence", Pattern: "Find pattern", Hypothesis: "Build hypothesis", Experiment: "Test again", Rule: "Discover rule", Explanation: "Compress explanation", Mastery: "Independent mastery"
};
const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value * 10) / 10));

function buildVariant(variant: FlowVariant) {
  const nodes: SciLoopNode[] = variant.stages.map((nodeType, index) => ({ id: `${variant.id}-${index}`, type: "sciloop", position: { x: (index % 3) * 250, y: Math.floor(index / 3) * 130 }, data: { nodeType, label: labels[nodeType] ?? nodeType } }));
  const edges: SciLoopEdge[] = nodes.slice(0, -1).map((node, index) => ({ id: `${node.id}-${nodes[index + 1].id}`, source: node.id, target: nodes[index + 1].id, type: "labeled", label: "leads to", data: { label: "leads to" as SciLoopConnectionLabel } }));
  if (variant.loop && nodes.length > 6) { const loopSource = nodes[nodes.length - 2]; edges.push({ id: `${loopSource.id}-${nodes[1].id}`, source: loopSource.id, target: nodes[1].id, type: "labeled", label: "repeat", animated: true, data: { label: "repeat" } }); }
  if (variant.branch && nodes.length > 10) edges.push({ id: `${nodes[5].id}-${nodes[nodes.length - 2].id}`, source: nodes[5].id, target: nodes[nodes.length - 2].id, type: "labeled", label: "if true", data: { label: "if true" } });
  return { nodes, edges };
}

function parametersFor(nodes: SciLoopNode[]): Record<string, NodeParameters> {
  return Object.fromEntries(nodes.map((node) => [node.id, { intensity: 50, novelty: node.data.nodeType === "Curiosity" ? 72 : 50, challenge: node.data.nodeType === "Challenge" ? 68 : 50, repetition: node.data.nodeType === "Experiment" ? 64 : 50 }]));
}

export function benchmarkFlowVariants(): FlowBenchmarkResult[] {
  return flowVariants.map((variant) => {
    const { nodes, edges } = buildVariant(variant);
    const analytics = analyzeReasoningGraph(nodes, edges);
    const issues = validateReasoningGraph(nodes, edges);
    const cognitive = simulateFlow(nodes, edges);
    const visual = scoreEngine(nodes, edges, parametersFor(nodes));
    const reasoning = clamp(analytics.validationCoverage * .35 + analytics.knowledgeScore * .25 + Math.min(100, analytics.reasoningDepth * 7) * .15 + (issues.length ? Math.max(0, 25 - issues.length * 4) : 25));
    const cognitiveLoad = cognitive.metrics.find((metric) => metric.label === "Cognitive Load")?.value ?? 0;
    const total = clamp(cognitive.overallScore * .36 + visual.overall * .34 + reasoning * .3 - Math.max(0, cognitiveLoad - 60) * .08);
    const strengths = [
      visual.transferLearning >= 65 ? "strong transfer signal" : "limited transfer signal",
      cognitive.groupScores["Prediction Engine"] >= 60 ? "prediction loop is active" : "prediction loop is weak",
      reasoning >= 65 ? "reasoning graph is structurally coherent" : "needs structural validation"
    ];
    return { ...variant, nodes, edges, reasoningScore: reasoning, cognitiveScore: cognitive.overallScore, visualScore: visual.overall, totalScore: total, issueCount: issues.length, cognitiveLoad, strengths };
  }).sort((a, b) => b.totalScore - a.totalScore);
}
