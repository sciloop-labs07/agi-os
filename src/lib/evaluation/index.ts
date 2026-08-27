import type { Candidate } from "@/lib/cognitive-lab/types";
import { calculateMetrics } from "./metrics";
import type { CandidateEvaluation, EvaluationReport, EvaluationComparison, MetricComparison } from "./types";
import { clamp, longestPath } from "./calculators/structural";

export * from "./types";
export { metricRegistry, calculateMetrics } from "./metrics";

export function evaluateCandidate(candidate: Candidate, allCandidates: Candidate[]): CandidateEvaluation {
  const context = { candidate, graph: candidate.graph, allCandidates };
  const metrics = calculateMetrics(context);
  const missingStages = metrics.find((metric) => metric.id === "completeness")?.evidence.filter((item) => item.kind === "missing").map((item) => item.text) ?? [];
  const strengths = metrics.filter((metric) => metric.score !== null && ((metric.direction === "higher" && metric.score >= 70) || (metric.direction === "lower" && metric.score <= 35))).map((metric) => `${metric.label}: ${metric.explanation}`);
  const weaknesses = metrics.filter((metric) => metric.score !== null && ((metric.direction === "higher" && metric.score < 55) || (metric.direction === "lower" && metric.score > 65))).map((metric) => `${metric.label}: ${metric.explanation}`);
  const improvementSuggestions = metrics.filter((metric) => metric.evidence.some((item) => item.kind === "missing" || item.kind === "limitation")).slice(0, 4).map((metric) => `Review ${metric.label}: ${metric.explanation}`);
  return { candidateId: candidate.id, evaluatedAt: new Date().toISOString(), metrics, strengths, weaknesses, missingStages, improvementSuggestions, graphSummary: { nodes: candidate.graph.nodes.length, connections: candidate.graph.connections.length, depth: longestPath(context), density: clamp(candidate.graph.connections.length / Math.max(1, candidate.graph.nodes.length) * 100) } };
}

export function compareCandidates(candidates: Candidate[], evaluations: CandidateEvaluation[], problemTitle = ""): EvaluationComparison {
  const metrics = new Map<string, MetricComparison>();
  evaluations.forEach((evaluation) => evaluation.metrics.forEach((metric) => {
    const values = metrics.get(metric.id) ?? { metricId: metric.id, values: [] };
    values.values.push({ candidateId: evaluation.candidateId, candidateName: candidates.find((candidate) => candidate.id === evaluation.candidateId)?.name ?? evaluation.candidateId, score: metric.score, standing: "similar" });
    metrics.set(metric.id, values);
  }));
  metrics.forEach((comparison) => {
    const available = comparison.values.filter((value) => value.score !== null) as Array<{ candidateId: string; candidateName: string; score: number; standing: "similar" | "best" | "worst" | "missing" }>;
    if (!available.length) { comparison.values.forEach((value) => { value.standing = "missing"; }); return; }
    const min = Math.min(...available.map((value) => value.score)); const max = Math.max(...available.map((value) => value.score));
    comparison.values.forEach((value) => { if (value.score === null) value.standing = "missing"; else if (max === min) value.standing = "similar"; else if (value.score === max) value.standing = "best"; else if (value.score === min) value.standing = "worst"; });
  });
  return { problemTitle, candidateIds: candidates.map((candidate) => candidate.id), metrics: [...metrics.values()] };
}

export function createEvaluationReport(evaluation: CandidateEvaluation): EvaluationReport { return { candidateId: evaluation.candidateId, generatedAt: new Date().toISOString(), graphSummary: evaluation.graphSummary, strengths: evaluation.strengths, weaknesses: evaluation.weaknesses, missingStages: evaluation.missingStages, improvementSuggestions: evaluation.improvementSuggestions, metricExplanations: evaluation.metrics }; }
