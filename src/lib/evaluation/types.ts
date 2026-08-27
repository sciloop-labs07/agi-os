import type { Candidate, CandidateGraph, Experiment } from "@/lib/cognitive-lab/types";

export type MetricType = "structural" | "empirical";
export type MetricDirection = "higher" | "lower";
export type MetricStatus = "estimated" | "not_measured";

export type MetricEvidence = {
  kind: "support" | "limitation" | "missing";
  text: string;
};

export type MetricResult = {
  id: string;
  label: string;
  metricType: MetricType;
  direction: MetricDirection;
  score: number | null;
  status: MetricStatus;
  explanation: string;
  evidence: MetricEvidence[];
};

export type MetricContext = {
  candidate: Candidate;
  graph: CandidateGraph;
  allCandidates: Candidate[];
};

export type MetricDefinition = {
  id: string;
  label: string;
  group: "Understanding" | "Structure" | "Transfer" | "Quality";
  metricType: MetricType;
  direction: MetricDirection;
  description: string;
  calculate: (context: MetricContext) => MetricResult;
};

export type CandidateEvaluation = {
  candidateId: string;
  evaluatedAt: string;
  metrics: MetricResult[];
  strengths: string[];
  weaknesses: string[];
  missingStages: string[];
  improvementSuggestions: string[];
  graphSummary: {
    nodes: number;
    connections: number;
    depth: number;
    density: number;
  };
};

export type EvaluationRun = {
  id: string;
  runNumber: number;
  executedAt: string;
  evaluation: CandidateEvaluation;
};

export type CandidateEvaluationHistory = {
  runs: EvaluationRun[];
};

export type ComparisonStanding = "best" | "worst" | "similar" | "missing";

export type MetricComparison = {
  metricId: string;
  values: Array<{
    candidateId: string;
    candidateName: string;
    score: number | null;
    standing: ComparisonStanding;
  }>;
};

export type EvaluationComparison = {
  problemTitle: string;
  candidateIds: string[];
  metrics: MetricComparison[];
};

export type EvaluationReport = {
  candidateId: string;
  generatedAt: string;
  graphSummary: CandidateEvaluation["graphSummary"];
  strengths: string[];
  weaknesses: string[];
  missingStages: string[];
  improvementSuggestions: string[];
  metricExplanations: MetricResult[];
};

export type EvaluationExperimentInput = Pick<Experiment, "problem" | "candidates">;
