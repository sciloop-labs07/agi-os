import type { CandidateGraph, CognitiveNode, Connection } from "@/lib/cognitive-lab/types";
import type { ReasoningNodeType } from "@/lib/engine/node-registry";

export type MutationType = "insert_node" | "remove_node" | "swap_nodes" | "replace_node" | "add_validation" | "add_feedback_loop" | "split_path" | "merge_paths";
export type EvolutionEventStatus = "proposed" | "accepted" | "rejected";

export type EngineGenome = {
  version: 1;
  graph: CandidateGraph;
  orderedNodeIds: string[];
  structuralSignature: string;
};

export type LineageMetadata = {
  generation: number;
  parentCandidateId?: string;
  rootCandidateId: string;
  branchId: string;
  branchName: string;
};

export type MutationParameters = {
  sourceNodeId?: string;
  targetNodeId?: string;
  nodeType?: ReasoningNodeType;
  insertedNodeType?: ReasoningNodeType;
  seed: number;
};

export type MutationChange = {
  kind: "added_node" | "removed_node" | "reordered_nodes" | "replaced_node" | "added_connection" | "removed_connection" | "changed_category";
  before?: string;
  after?: string;
  explanation: string;
};

export type EvolutionEvent = {
  id: string;
  candidateId: string;
  parentCandidateId?: string;
  generation: number;
  mutationType: MutationType | "restore_generation";
  parameters: MutationParameters;
  changes: MutationChange[];
  explanation: string;
  expectedImprovement: string;
  actualOutcome?: string;
  status: EvolutionEventStatus;
  createdAt: string;
};

export type LineageNode = {
  candidateId: string;
  candidateName: string;
  generation: number;
  parentCandidateId?: string;
  branchName: string;
  children: string[];
};

export type StructuralDiff = {
  addedNodes: CognitiveNode[];
  removedNodes: CognitiveNode[];
  modifiedConnections: Array<{ before: Connection; after: Connection }>;
  addedConnections: Connection[];
  removedConnections: Connection[];
  changedOrder: boolean;
  changedCategories: Array<{ nodeId: string; before: string; after: string }>;
  executionDifferences: string[];
};

export type SimilarityResult = { score: number; sharedNodeTypes: string[]; sharedConnections: number; explanation: string };

export type EvolutionState = {
  events: EvolutionEvent[];
  selectedEventId?: string;
  replayGeneration?: number;
};
