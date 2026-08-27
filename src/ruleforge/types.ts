export type SourceRecord = {
  id: string;
  url: string;
  title: string;
  author: string;
  publishedAt: string;
  domain: string;
  credibilityScore: number;
  readStatus: "live" | "fallback";
};

export type ExtractedClaim = {
  id: string;
  kind: "fact" | "definition" | "causal_relation" | "equation" | "example" | "contradiction" | "prediction" | "mechanism";
  text: string;
  logicForm: string;
  atoms: string[];
  sourceIds: string[];
  supportCount: number;
  contradictionCount: number;
};

export type SymbolicNode = {
  id: string;
  label: string;
  nodeType: "atom" | "concept" | "relation" | "rule" | "evidence" | "contradiction";
  binaryState: 0 | 1;
  weight: number;
};

export type SymbolicEdge = {
  from: string;
  to: string;
  relation: "causes" | "supports" | "contradicts" | "rewrites" | "predicts" | "depends_on";
  weight: number;
};

export type SymbolicGraph = {
  nodes: SymbolicNode[];
  edges: SymbolicEdge[];
};

export type CandidateRule = {
  rule_id: string;
  rule_name: string;
  input_pattern: string;
  output_transformation: string;
  evidence_sources: string[];
  confidence_score: number;
  stability_score: number;
  prediction_score: number;
  compression_score: number;
  contradiction_score: number;
  novelty_score: number;
  version_number: number;
  parent_rules: string[];
  mutation_history: string[];
  status: "candidate" | "active" | "rejected" | "needs_human_approval";
};

export type SandboxResult = {
  ruleId: string;
  decision: "accepted" | "rejected" | "needs_human_approval";
  tests: Array<{ name: string; passed: boolean; detail: string }>;
  score: number;
  reason: string;
};

export type RuleForgeMemory = {
  rawObservations: SourceRecord[];
  extractedClaims: ExtractedClaim[];
  symbolicGraphs: SymbolicGraph[];
  candidateRules: CandidateRule[];
  activeRules: CandidateRule[];
  rejectedRules: CandidateRule[];
  ruleEvolutionHistory: string[];
  sourceReliabilityHistory: Array<{ domain: string; credibilityScore: number; reason: string }>;
  contradictionHistory: ExtractedClaim[];
  discoveredLaws: CandidateRule[];
  auditLog: string[];
};

export type RuleForgeTask = {
  id: string;
  objective: string;
  assignedAt: string;
  status: "assigned" | "running" | "completed";
  safetyNote: string;
};

export type RuleForgeRun = {
  cycleId: string;
  assignedTask?: RuleForgeTask;
  loop: string[];
  source: SourceRecord;
  claims: ExtractedClaim[];
  graph: SymbolicGraph;
  candidateRules: CandidateRule[];
  sandboxResults: SandboxResult[];
  acceptedRules: CandidateRule[];
  rejectedRules: CandidateRule[];
  metaRules: string[];
  memory: RuleForgeMemory;
  safety: {
    maxRecursionDepth: number;
    maxRulesPerCycle: number;
    maxInternetReadsPerCycle: number;
    maxGraphSize: number;
    humanApprovalRequiredForHighImpact: boolean;
    sandboxOnlyTesting: boolean;
  };
};
