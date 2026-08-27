export type TruthStatus = "unknown" | "candidate" | "verified" | "rejected";
export type ProofStatus = "unverified" | "candidate" | "lean_pending" | "verified" | "failed";

export type RuleType =
  | "algebraic"
  | "logical"
  | "equivalence"
  | "implication"
  | "specialization"
  | "generalization"
  | "duality"
  | "normalization"
  | "graph_rewrite"
  | "meta_rewrite";

export type GraphRelationType =
  | "implies"
  | "generalizes"
  | "specializes"
  | "equivalent_to"
  | "dual_of"
  | "contradicts"
  | "analogous_to"
  | "generated_by"
  | "rewritten_from"
  | "proof_depends_on";

export type MetaPurpose =
  | "stability"
  | "compression"
  | "generalization"
  | "confluence"
  | "termination"
  | "proof_guidance"
  | "rule_discovery";

export type MathExpression = {
  id: string;
  rawText: string;
  ast: string[];
  variables: string[];
  domain: string;
  complexityScore: number;
  normalForm: string;
  truthStatus: TruthStatus;
};

export type TheoremNode = {
  id: string;
  title: string;
  statement: string;
  expressionIds: string[];
  assumptions: string[];
  conclusions: string[];
  proofSketch: string;
  proofStatus: ProofStatus;
  confidenceScore: number;
  generationDepth: number;
  parentTheoremIds: string[];
  childTheoremIds: string[];
  relatedRuleIds: string[];
  domainTags: string[];
};

export type RewriteRule = {
  id: string;
  name: string;
  lhsPattern: string;
  rhsPattern: string;
  conditions: string[];
  domain: string;
  ruleType: RuleType;
  safetyLevel: 1 | 2 | 3 | 4 | 5;
  preservesTruth: boolean;
  reducesComplexity: boolean;
  usageCount: number;
  successCount: number;
  failureCount: number;
  inventedBy: "system" | "meta_engine" | "user";
  status: "active" | "experimental" | "disabled";
};

export type TheoremGraphEdge = {
  from: string;
  to: string;
  relationType: GraphRelationType;
  ruleId?: string;
  weight: number;
  confidence: number;
};

export type TheoremGraph = {
  nodes: TheoremNode[];
  edges: TheoremGraphEdge[];
};

export type MetaTheorem = {
  id: string;
  name: string;
  description: string;
  appliesToRuleTypes: RuleType[];
  graphPattern: string;
  rewriteAction: string;
  purpose: MetaPurpose;
};

export type RewriteTraceStep = {
  ruleId: string;
  ruleName: string;
  before: string;
  after: string;
  complexityDelta: number;
  depth: number;
  safetyNotes: string[];
};

export type RewriteOptions = {
  maxDepth: number;
  maxBranching: number;
  fuel: number;
  complexityLimit: number;
};

export type TermRewriteResult = {
  originalExpression: MathExpression;
  candidates: MathExpression[];
  rewriteTrace: RewriteTraceStep[];
  stoppedReason: string;
};

export type TheoremRewriteResult = {
  originalTheorem: TheoremNode;
  candidateTheorems: TheoremNode[];
  rewriteTrace: RewriteTraceStep[];
  riskLevel: "low" | "medium" | "high";
  needsProofVerification: boolean;
};

export type GraphRewriteTrace = {
  graphPatternDetected: string;
  metaTheoremApplied: string;
  nodesAffected: string[];
  edgesAffected: string[];
  reason: string;
  confidence: number;
};

export type GraphRewriteResult = {
  originalGraphSnapshot: TheoremGraph;
  rewrittenGraph: TheoremGraph;
  graphRewriteTrace: GraphRewriteTrace[];
  emergentPatterns: string[];
  proposedBridgeTheorems: TheoremNode[];
  stabilityScore: number;
};

export type ProofResult = {
  status: "verified" | "failed" | "unknown" | "timeout";
  proofObject?: string;
  counterexample?: string;
  engineUsed: string;
  notes: string;
};

export type ProofAdapter = {
  name: string;
  supportedDomains: string[];
  verify(theoremNode: TheoremNode): Promise<ProofResult>;
};
