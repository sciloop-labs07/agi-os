import type { CandidateEvaluation } from "@/lib/evaluation/types";

export type ProtocolStatus = "draft" | "configured" | "running" | "completed" | "archived" | "cancelled";
export type ProtocolStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type ResearchNotes = {
  objective: string;
  observation: string;
  expectedOutcome: string;
  actualOutcome: string;
  insights: string;
  futureQuestions: string;
};

export type ExperimentMetadata = {
  id: string;
  name: string;
  problemId: string;
  problemTitle: string;
  researchGoal: string;
  hypothesis: string;
  candidateIds: string[];
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  status: ProtocolStatus;
  tags: string[];
  researcherNotes: ResearchNotes;
};

export type ProtocolReport = {
  experimentId: string;
  generatedAt: string;
  overview: string;
  candidateIds: string[];
  evidence: Array<{
    candidateId: string;
    candidateName: string;
    graphSize: { nodes: number; connections: number };
    metrics: Array<{ id: string; label: string; score: number | null; status: string }>;
    strengths: string[];
    weaknesses: string[];
  }>;
  comparison: Array<{ metricId: string; label: string; values: Array<{ candidateId: string; candidateName: string; score: number | null }> }>;
  notes: ResearchNotes;
  conclusions: string;
  openQuestions: string;
};

export type ExperimentProtocolState = {
  metadata: ExperimentMetadata;
  currentStep: ProtocolStep;
  report?: ProtocolReport;
  library: ProtocolReport[];
};

export const protocolStepLabels: Array<{ step: ProtocolStep; label: string; detail: string }> = [
  { step: 1, label: "Select problem", detail: "Set the shared reference" },
  { step: 2, label: "Select engines", detail: "Choose explicit participants" },
  { step: 3, label: "Freeze candidates", detail: "Lock the snapshots" },
  { step: 4, label: "Review configuration", detail: "Check the study design" },
  { step: 5, label: "Run experiment", detail: "Execute the selected evidence" },
  { step: 6, label: "Review evidence", detail: "Inspect measured structure" },
  { step: 7, label: "Record conclusion", detail: "Write what the evidence says" },
  { step: 8, label: "Generate next candidate", detail: "Continue the research" }
];

export const emptyResearchNotes: ResearchNotes = { objective: "", observation: "", expectedOutcome: "", actualOutcome: "", insights: "", futureQuestions: "" };

export function createProtocolState(problem: { id: string; title: string }): ExperimentProtocolState {
  const now = new Date().toISOString();
  return { metadata: { id: `protocol-${Math.random().toString(36).slice(2, 10)}`, name: `${problem.title} comparison`, problemId: problem.id, problemTitle: problem.title, researchGoal: "Compare reasoning engines on the same problem.", hypothesis: "", candidateIds: [], createdAt: now, updatedAt: now, status: "draft", tags: [], researcherNotes: { ...emptyResearchNotes } }, currentStep: 1, library: [] };
}

export type ProtocolEvidenceInput = { candidateId: string; candidateName: string; evaluation: CandidateEvaluation };
