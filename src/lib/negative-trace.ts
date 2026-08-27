export type TraceLevel = "WEAK TRACE" | "USEFUL TRACE" | "STRONG HIDDEN SIGNAL" | "CRITICAL INTELLIGENCE GAP";

export type NegativeTraceInput = {
  expected: number;
  observed: number;
  uncertainty: number;
  missing: number;
  contradiction: number;
  failures: number;
  delay: number;
};

export type NTIEvent = {
  hesitation: boolean;
  missingData: boolean;
  contradiction: boolean;
  failedAttempt: boolean;
  skippedStep: boolean;
  lowConfidence: boolean;
};

export type NTIDatasetRow = {
  input: string;
  expected: string;
  actual: string;
  missing: string;
  failures: string;
  contradictions: string;
  label: string;
  improved: string;
};

export type FailureInsightInput = {
  goal: string;
  method: string;
  expected: string;
  actual: string;
  whyFailed: string;
  hiddenConstraint: string;
  newRule: string;
};

export type NTIEvolutionEntry = {
  title: string;
  type: "theorem" | "experiment" | "dataset idea" | "failed hypothesis" | "AI architecture idea" | "mathematical upgrade" | "application" | "AI principle";
  description: string;
  confidence: number;
  status: "idea" | "testing" | "prototype" | "validated" | "rejected" | "upgraded";
  date: string;
};

export function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number.isFinite(Number(n)) ? Number(n) : 0));
}

export function levelFromScore(score: number): TraceLevel {
  const value = clamp(score);
  if (value <= 20) return "WEAK TRACE";
  if (value <= 45) return "USEFUL TRACE";
  if (value <= 70) return "STRONG HIDDEN SIGNAL";
  return "CRITICAL INTELLIGENCE GAP";
}

export function hashTrace(input: unknown) {
  const str = JSON.stringify(input);
  let hash = 0;
  for (let index = 0; index < str.length; index += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).toUpperCase().slice(0, 6).padEnd(6, "0");
}

export function calculateNegativeTrace(input: NegativeTraceInput) {
  const E = Number(input.expected) || 0;
  const O = Number(input.observed) || 0;
  const basicTrace = Math.abs(E - O);
  const normalizedGap = clamp((basicTrace / Math.max(Math.abs(E), 1)) * 100);
  const failureScore = clamp((Number(input.failures) || 0) * 12);
  const totalScore = clamp(
    normalizedGap * 0.3 +
      clamp(input.uncertainty) * 0.16 +
      clamp(input.missing) * 0.18 +
      clamp(input.contradiction) * 0.18 +
      failureScore * 0.1 +
      clamp(input.delay) * 0.08
  );
  const level = levelFromScore(totalScore);

  return {
    basicTrace,
    normalizedGap,
    totalScore,
    level,
    traceId: `NTI-${level.replaceAll(" ", "-")}-${hashTrace(input)}`,
    interpretation:
      totalScore > 70
        ? "Critical gap: the AI should not ignore this. Absence, error, contradiction, or missing context is a major learning signal."
        : totalScore > 45
          ? "Strong hidden signal: the gap between expectation and observation can improve reasoning."
          : totalScore > 20
            ? "Useful trace: the difference is meaningful enough to store as learning memory."
            : "Weak trace: visible data mostly matches expectation."
  };
}

export function runNTIAnalysis(event: NTIEvent) {
  const traces: string[] = [];
  if (event.hesitation) traces.push("Delay trace: user hesitation suggests uncertainty or hidden decision pressure.");
  if (event.missingData) traces.push("Missing-context trace: required data is absent.");
  if (event.contradiction) traces.push("Contradiction trace: user/system behavior conflicts with expectation.");
  if (event.failedAttempt) traces.push("Failure trace: previous attempt did not produce expected result.");
  if (event.skippedStep) traces.push("Unchosen-path trace: a normal step was skipped.");
  if (event.lowConfidence) traces.push("Uncertainty trace: confidence is low, so hidden context may exist.");

  const score = clamp(
    (event.hesitation ? 15 : 0) +
      (event.missingData ? 25 : 0) +
      (event.contradiction ? 25 : 0) +
      (event.failedAttempt ? 20 : 0) +
      (event.skippedStep ? 15 : 0) +
      (event.lowConfidence ? 20 : 0)
  );

  return {
    visibleInterpretation: "Visible-only AI sees the direct request and tries to respond immediately.",
    negativeTraces: traces.length ? traces : ["No major negative trace detected."],
    hiddenContext:
      traces.length > 2
        ? "The situation contains hidden context. The AI should slow down, check assumptions, and produce a safer answer."
        : "The hidden context is limited. The AI can respond normally but still track uncertainty.",
    improvedAction:
      score > 60
        ? "Ask for missing data, expose assumptions, generate a partial answer, and mark uncertainty clearly."
        : score > 30
          ? "Proceed with answer but include assumptions and one clarification path."
          : "Proceed normally.",
    confidenceChange: score > 60 ? "-35% confidence until context is resolved" : score > 30 ? "-15% confidence" : "No major confidence penalty",
    learningGain: score
  };
}

export function buildFailureInsight(input: FailureInsightInput) {
  const trace = calculateNegativeTrace({
    expected: String(input.expected || "").length,
    observed: String(input.actual || "").length,
    uncertainty: input.hiddenConstraint ? 45 : 20,
    missing: input.hiddenConstraint ? 60 : 25,
    contradiction: input.whyFailed ? 45 : 15,
    failures: 1,
    delay: 20
  });

  return {
    failure_type: input.whyFailed ? "explainable failure" : "unknown failure",
    negative_trace: `Expected "${input.expected}" but observed "${input.actual}".`,
    hidden_constraint: input.hiddenConstraint || "Hidden constraint not identified yet.",
    reusable_rule: input.newRule || "Convert this failure into a reusable rule after more testing.",
    next_experiment: `Try a modified method for goal: ${input.goal || "unknown goal"}`,
    score: trace.totalScore,
    level: trace.level
  };
}

export function detectHiddenAssumptions(claim: string) {
  const text = String(claim || "").toLowerCase();
  const assumptions: string[] = [];

  if (text.includes("conscious")) assumptions.push("Assumes consciousness can be measured or operationally defined.");
  if (text.includes("ai")) assumptions.push("Assumes AI can represent the required variables.");
  if (text.includes("shadow") || text.includes("negative")) assumptions.push("Assumes absence or shadow can be converted into measurable features.");
  if (text.includes("math")) assumptions.push("Assumes the idea can be formalized with variables and functions.");
  if (text.includes("learn")) assumptions.push("Assumes the trace improves learning, not just noise.");
  if (!assumptions.length) assumptions.push("Assumes the claim has measurable inputs, outputs, and test conditions.");

  return {
    visibleClaim: claim || "No claim entered.",
    hiddenAssumptions: assumptions,
    missingEvidence: [
      "Need a measurable dataset.",
      "Need baseline AI performance.",
      "Need NTI-enhanced AI performance.",
      "Need comparison between visible-only learning and trace-based learning."
    ],
    contradictionRisks: [
      "Negative trace may be noise rather than signal.",
      "Missing context may be caused by privacy boundaries.",
      "Improved prediction may not imply safer behavior."
    ],
    testableVersion: "Does adding negative-trace features improve prediction, reasoning, safety, or personalization compared to visible-only features?",
    variables: [
      "E = expected pattern",
      "O = observed pattern",
      "M = missing context",
      "C = contradiction",
      "F = failure count",
      "U = uncertainty",
      "NTS = negative trace score"
    ]
  };
}

export function analyzeContradiction(statementA: string, statementB: string) {
  const joined = `${statementA} ${statementB}`.toLowerCase();
  const type = joined.includes("measure") || joined.includes("number")
    ? "measurement contradiction"
    : joined.includes("cause")
      ? "causal contradiction"
      : joined.includes("data")
        ? "data contradiction"
        : joined.includes("expect")
          ? "expectation contradiction"
          : "reality-model contradiction";

  const trace = calculateNegativeTrace({
    expected: String(statementA || "").length,
    observed: String(statementB || "").length,
    uncertainty: 48,
    missing: 52,
    contradiction: 82,
    failures: 1,
    delay: 18
  });

  return {
    type,
    score: trace.totalScore,
    negativeTrace: "The difference between these two statements becomes a research object instead of a discardable error.",
    possibleResolution: "Define terms, identify measurement boundaries, and test which model predicts better under controlled cases.",
    hiddenLayer: "The contradiction may hide a missing variable, scale mismatch, semantic ambiguity, or unmeasured context.",
    researchQuestion: "What extra variable would make both statements partially true under different conditions?"
  };
}

export const defaultNTIDataset: NTIDatasetRow[] = [
  {
    input: "Student failed exam",
    expected: "Student did not study",
    actual: "Student studied but had weak basics",
    missing: "language barrier, time pressure",
    failures: "revision method failed",
    contradictions: "effort high but score low",
    label: "hidden learning gap",
    improved: "create basics-first revision plan"
  },
  {
    input: "User abandoned checkout",
    expected: "user not interested",
    actual: "user checked price twice",
    missing: "budget concern",
    failures: "checkout persuasion failed",
    contradictions: "interest high but purchase absent",
    label: "value hesitation",
    improved: "show comparison, discount, trust proof"
  },
  {
    input: "AI gave wrong answer",
    expected: "model knew topic",
    actual: "missing latest data",
    missing: "outdated knowledge",
    failures: "retrieval not used",
    contradictions: "confident output but stale facts",
    label: "freshness gap",
    improved: "browse or ask for updated source"
  },
  {
    input: "Hacker login attempt",
    expected: "normal login",
    actual: "abnormal rhythm and location",
    missing: "identity hidden",
    failures: "password guessing",
    contradictions: "valid-looking route but abnormal behavior",
    label: "cyber behavior shadow",
    improved: "trigger verification"
  }
];

export const defaultNTIEvolution: NTIEvolutionEntry[] = [
  {
    title: "Absence is Information",
    type: "theorem",
    description: "Missing expected behavior can be treated as a learnable signal.",
    confidence: 85,
    status: "testing",
    date: "2026-06-07"
  },
  {
    title: "Error Should Become Memory",
    type: "AI principle",
    description: "Error is not only minimized; it is stored as a knowledge object.",
    confidence: 82,
    status: "testing",
    date: "2026-06-07"
  },
  {
    title: "Contradiction Reveals Hidden Structure",
    type: "theorem",
    description: "Two incompatible models may point to a missing layer or variable.",
    confidence: 78,
    status: "testing",
    date: "2026-06-07"
  },
  {
    title: "NTI Dataset Format",
    type: "dataset idea",
    description: "Input, expected output, actual output, missing context, failed attempts, contradictions, trace label, improved output.",
    confidence: 75,
    status: "prototype",
    date: "2026-06-07"
  },
  {
    title: "Failure-to-Insight Engine",
    type: "application",
    description: "Failed attempts become reusable rules and next experiments.",
    confidence: 80,
    status: "prototype",
    date: "2026-06-07"
  }
];

