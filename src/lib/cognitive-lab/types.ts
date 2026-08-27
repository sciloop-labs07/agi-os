import type { ReasoningCategory, ReasoningNodeKind, ReasoningNodeType } from "@/lib/engine/node-registry";
import type { ValidationSeverity } from "@/lib/engine/semantic-validation";
import type { CandidateEvaluationHistory } from "@/lib/evaluation/types";
import type { LineageMetadata } from "@/lib/evolution/types";
import type { EvolutionState } from "@/lib/evolution/types";
import type { ExperimentProtocolState } from "@/lib/experiments/types";

export type CandidateStatus = "draft" | "frozen" | "running" | "completed";
export type CandidateRunState = "idle" | "running" | "completed";
export type CognitiveNodeExecutionState = "waiting" | "running" | "completed";

export type Problem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

export type NodeMetadata = {
  nodeType: ReasoningNodeType;
  category: ReasoningCategory;
  kind: ReasoningNodeKind;
  description: string;
  inputs: number;
  outputs: number;
};

export type CognitiveNode = {
  id: string;
  label: string;
  metadata: NodeMetadata;
  position: { x: number; y: number };
  createdAt: string;
  updatedAt: string;
  executionState: CognitiveNodeExecutionState;
};

export type Connection = {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  createdAt: string;
  validation?: { severity: ValidationSeverity; message: string };
};

export type GraphMetadata = {
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
  connectionCount: number;
};

export type CandidateGraph = {
  id: string;
  nodes: CognitiveNode[];
  connections: Connection[];
  metadata: GraphMetadata;
};

export type ImportedFlowNode = {
  id: string;
  label: string;
  nodeType: ReasoningNodeType;
  position: { x: number; y: number };
};

export type ImportedFlowConnection = {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
};

export type Candidate = {
  id: string;
  experimentId: string;
  name: string;
  description: string;
  color: string;
  status: CandidateStatus;
  createdAt: string;
  frozenAt?: string;
  freezeState: "editable" | "frozen";
  runState: CandidateRunState;
  graph: CandidateGraph;
  lineage: LineageMetadata;
};

export type HistorySnapshot = {
  graph: CandidateGraph;
  timestamp: string;
};

export type CandidateHistory = {
  past: HistorySnapshot[];
  future: HistorySnapshot[];
};

export type Experiment = {
  id: string;
  problem: Problem;
  candidates: Candidate[];
  createdAt: string;
  updatedAt: string;
};

export type ExperimentLogEntry = {
  id: string;
  candidateId: string;
  candidateName: string;
  type: "candidate_created" | "candidate_deleted" | "node_added" | "connection_created" | "flow_imported" | "candidate_started" | "node_executed" | "candidate_finished" | "candidate_frozen";
  message: string;
  timestamp: string;
};

export type ExecutionTraceStep = {
  nodeId: string;
  delayMs: number;
};

export type CognitiveLabState = {
  experiment: Experiment;
  activeCandidateId: string;
  console: ExperimentLogEntry[];
  execution: Record<string, Record<string, CognitiveNodeExecutionState>>;
  history: Record<string, CandidateHistory>;
  selectedNodeId?: string;
  evaluationHistory: Record<string, CandidateEvaluationHistory>;
  evolution: EvolutionState;
  protocol: ExperimentProtocolState;
  ui: LabUiState;
};

export type LabPanelTab = "properties" | "evaluation" | "evolution" | "history" | "protocol" | "settings";
export type LabUiState = {
  activePanel: LabPanelTab;
  rightPanelCollapsed: boolean;
  viewport: { x: number; y: number; zoom: number };
};
