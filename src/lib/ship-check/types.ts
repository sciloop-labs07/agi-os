export type EvidenceClass = "OBSERVED" | "MEASURED" | "INFERRED" | "SIMULATED" | "HYPOTHESIS" | "UNKNOWN";
export type TestCategory = "HAPPY_PATH" | "EDGE_CASE" | "AMBIGUOUS_INPUT" | "ADVERSARIAL_INPUT" | "TOOL_FAILURE" | "TIMEOUT" | "RETRY" | "CONTEXT_DEGRADATION" | "GOAL_DRIFT" | "PERMISSION_AUTHORIZATION" | "PROMPT_INJECTION" | "DATA_LEAKAGE" | "COST_LOOP_AMPLIFICATION" | "RECOVERY_FAILURE_HANDLING";
export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

export type DemoId = "customer-support" | "rag-knowledge" | "coding-developer";

export interface SystemInput {
  name: string;
  description: string;
  source: "LOCAL_FIXTURE" | "ENDPOINT" | "REPOSITORY" | "DOCUMENTATION";
  availableEvidence: string[];
  unavailableEvidence: string[];
}

export interface TestCase {
  testId: string;
  category: TestCategory;
  scenario: string;
  input: string;
  expectedBehavior: string;
  failureCondition: string;
  severityCriteria: string;
}

export interface ExecutionTrace {
  executionId: string;
  testId: string;
  startedAt: string;
  finishedAt: string;
  input: string;
  output: string;
  status: "PASSED" | "FAILED" | "UNABLE_TO_TEST";
  classification: EvidenceClass;
  latencyMs: number;
  toolCalls: number;
  modelCalls: number;
}

export interface EvidenceItem {
  evidenceId: string;
  label: string;
  value: string;
  classification: EvidenceClass;
  sourceId: string;
}

export interface Failure {
  failureId: string;
  testId: string;
  executionId: string;
  category: TestCategory;
  scenario: string;
  expectedBehavior: string;
  observedBehavior: string;
  severity: Severity;
  evidenceIds: string[];
  reproducibility: "YES" | "NO" | "NOT_RUN";
  rootCause: string;
  impact: string;
  recommendation: string;
  regressionTestId: string;
  status: "OPEN" | "VERIFIED" | "UNKNOWN";
}

export interface RemediationTask {
  taskId: string;
  objective: string;
  problem: string;
  evidenceIds: string[];
  likelyRootCause: string;
  recommendedImplementation: string;
  acceptanceCriteria: string[];
  regressionTestId: string;
}

export interface ReadinessDimension {
  name: string;
  value: number | null;
  classification: EvidenceClass;
  explanation: string;
}

export interface ShipCheckResult {
  checkId: string;
  createdAt: string;
  system: SystemInput;
  tests: TestCase[];
  executions: ExecutionTrace[];
  evidence: EvidenceItem[];
  failures: Failure[];
  remediations: RemediationTask[];
  dimensions: ReadinessDimension[];
  readiness: "SHIP" | "CONDITIONAL_SHIP" | "NO_SHIP" | "INSUFFICIENT_EVIDENCE";
  readinessReason: string;
  unknowns: string[];
}
