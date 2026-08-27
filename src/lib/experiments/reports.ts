import type { Candidate } from "@/lib/cognitive-lab/types";
import type { ExperimentMetadata, ProtocolEvidenceInput, ProtocolReport, ResearchNotes } from "./types";

export function buildProtocolReport(metadata: ExperimentMetadata, candidates: Candidate[], evidence: ProtocolEvidenceInput[], notes: ResearchNotes, conclusions: string, openQuestions: string): ProtocolReport {
  const comparison = new Map<string, { metricId: string; label: string; values: Array<{ candidateId: string; candidateName: string; score: number | null }> }>();
  evidence.forEach(({ candidateId, candidateName, evaluation }) => evaluation.metrics.forEach((metric) => {
    const item = comparison.get(metric.id) ?? { metricId: metric.id, label: metric.label, values: [] };
    item.values.push({ candidateId, candidateName, score: metric.score });
    comparison.set(metric.id, item);
  }));
  return {
    experimentId: metadata.id,
    generatedAt: new Date().toISOString(),
    overview: `${metadata.name} examined ${evidence.length} candidate engine${evidence.length === 1 ? "" : "s"} against ${metadata.problemTitle}. Evidence is presented for researcher interpretation.`,
    candidateIds: metadata.candidateIds,
    evidence: evidence.map(({ candidateId, candidateName, evaluation }) => ({ candidateId, candidateName, graphSize: { nodes: evaluation.graphSummary.nodes, connections: evaluation.graphSummary.connections }, metrics: evaluation.metrics.map((metric) => ({ id: metric.id, label: metric.label, score: metric.score, status: metric.status })), strengths: evaluation.strengths, weaknesses: evaluation.weaknesses })),
    comparison: [...comparison.values()],
    notes,
    conclusions,
    openQuestions
  };
}
