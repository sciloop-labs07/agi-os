import { applyMetaTheorems } from "@/math-ai/meta/metaTheoremEngine";
import { previewProofAdapter } from "@/math-ai/proof/proofAdapter";
import { rewriteTheoremGraph } from "@/math-ai/rewrite/graphRewriteEngine";
import { checkConfluence, checkTerminationState, detectCriticalPairs, recommendedDisabledRules } from "@/math-ai/rewrite/rewriteStabilityEngine";
import { synthesizeRewriteRules } from "@/math-ai/rewrite/ruleSynthesisEngine";
import { rewriteExpression } from "@/math-ai/rewrite/termRewriteEngine";
import { rewriteTheorem } from "@/math-ai/rewrite/theoremRewriteEngine";
import { STARTER_EXPRESSIONS, STARTER_GRAPH, STARTER_META_THEOREMS, STARTER_RULES } from "@/math-ai/seed";
import type {
  GraphRewriteResult,
  MathExpression,
  MetaTheorem,
  ProofResult,
  RewriteOptions,
  RewriteRule,
  RewriteTraceStep,
  TermRewriteResult,
  TheoremGraph,
  TheoremNode,
  TheoremRewriteResult
} from "@/math-ai/types";
import { clone, createExpression } from "@/math-ai/utils";

export type RewriteCognitionSettings = RewriteOptions & {
  maxGraphNodes: number;
  maxGraphEdges: number;
  seed: number;
};

export type RewriteCognitionState = {
  tick: number;
  expressions: MathExpression[];
  graph: TheoremGraph;
  rules: RewriteRule[];
  metaTheorems: MetaTheorem[];
  settings: RewriteCognitionSettings;
  rewriteHistory: RewriteTraceStep[];
  proofHistory: Array<{ theoremId: string; status: ProofResult["status"]; ruleId?: string; notes: string }>;
  latest?: {
    activeTheorem?: TheoremNode;
    activeExpression?: MathExpression;
    termResult?: TermRewriteResult;
    theoremResult?: TheoremRewriteResult;
    graphResult?: GraphRewriteResult;
    metaResult?: ReturnType<typeof applyMetaTheorems>;
    synthesisResult?: ReturnType<typeof synthesizeRewriteRules>;
    proofResult?: ProofResult;
    stability?: Omit<ReturnType<typeof checkConfluence>, "criticalPairs"> & {
      terminationWarnings: string[];
      criticalPairs: ReturnType<typeof detectCriticalPairs>;
      recommendedDisabledRules: string[];
      fuelRemaining: number;
      recursionDepth: number;
    };
    tickTrace: string[];
    discoveries: string[];
    warnings: string[];
  };
};

export function createInitialRewriteCognitionState(seed = 17): RewriteCognitionState {
  return {
    tick: 0,
    expressions: clone(STARTER_EXPRESSIONS),
    graph: clone(STARTER_GRAPH),
    rules: clone(STARTER_RULES),
    metaTheorems: clone(STARTER_META_THEOREMS),
    settings: {
      maxDepth: 3,
      maxBranching: 3,
      fuel: 12,
      complexityLimit: 72,
      maxGraphNodes: 42,
      maxGraphEdges: 88,
      seed
    },
    rewriteHistory: [],
    proofHistory: []
  };
}

export async function runRewriteCognitionTick(state: RewriteCognitionState): Promise<{
  newState: RewriteCognitionState;
  tickTrace: string[];
  discoveries: string[];
  warnings: string[];
}> {
  const next = clone(state);
  next.tick += 1;

  const tickTrace: string[] = [];
  const discoveries: string[] = [];
  const warnings: string[] = [];
  const activeTheorem = selectActiveTheorem(next.graph.nodes, next.tick);
  const options = next.settings;

  if (!activeTheorem) {
    warnings.push("No theorem nodes available for rewriting.");
    return { newState: { ...next, latest: { tickTrace, discoveries, warnings } }, tickTrace, discoveries, warnings };
  }

  tickTrace.push(`Selected theorem node: ${activeTheorem.title}.`);

  const activeExpression =
    activeTheorem.expressionIds.map((id) => next.expressions.find((expression) => expression.id === id)).find(Boolean) ??
    createExpression(`expr-from-${activeTheorem.id}`, activeTheorem.statement, activeTheorem.domainTags[0] ?? "general", "unknown");

  const safeRules = next.rules.filter((rule) => rule.status === "active" || rule.status === "experimental");
  const termResult = rewriteExpression(activeExpression, safeRules, options);
  next.rewriteHistory.push(...termResult.rewriteTrace);
  next.rewriteHistory = next.rewriteHistory.slice(-80);
  next.expressions = mergeExpressions(next.expressions, termResult.candidates);

  if (termResult.rewriteTrace[0]) {
    const step = termResult.rewriteTrace[0];
    tickTrace.push(`Expression rewrite: ${step.before} -> ${step.after} using ${step.ruleName}.`);
  } else {
    tickTrace.push(`Expression rewrite stopped: ${termResult.stoppedReason}.`);
  }

  const theoremResult = rewriteTheorem(activeTheorem, safeRules, options);
  const candidateTheorems = theoremResult.candidateTheorems.slice(0, 2).map((candidate, index) => ({
    ...candidate,
    id: `${candidate.id}-tick-${next.tick}-${index}`,
    proofStatus: candidate.proofStatus === "verified" ? "candidate" : candidate.proofStatus
  }));

  if (candidateTheorems.length > 0) {
    tickTrace.push(`Theorem rewrite produced ${candidateTheorems.length} candidate node(s).`);
    next.graph.nodes = mergeTheorems(next.graph.nodes, candidateTheorems, options.maxGraphNodes);
    next.graph.edges = [
      ...next.graph.edges,
      ...candidateTheorems.map((candidate) => ({
        from: activeTheorem.id,
        to: candidate.id,
        relationType: "rewritten_from" as const,
        ruleId: candidate.relatedRuleIds.at(-1),
        weight: 0.48,
        confidence: Math.max(0.24, candidate.confidenceScore)
      }))
    ].slice(0, options.maxGraphEdges);
  } else {
    tickTrace.push("Theorem rewrite produced no candidate this tick.");
  }

  const graphResult = rewriteTheoremGraph(next.graph, next.metaTheorems, next.rules, options);
  next.graph = graphResult.rewrittenGraph;
  discoveries.push(...graphResult.emergentPatterns);
  if (graphResult.proposedBridgeTheorems.length > 0) {
    discoveries.push(`Bridge candidates proposed: ${graphResult.proposedBridgeTheorems.length}.`);
  }

  const metaResult = applyMetaTheorems(next.graph, next.rewriteHistory, next.proofHistory, next.metaTheorems);
  applyRuleActions(next.rules, metaResult.ruleActions);
  discoveries.push(...metaResult.metaInsights);

  const synthesisResult = synthesizeRewriteRules(
    next.rewriteHistory,
    next.graph,
    next.graph.nodes.filter((theorem) => theorem.proofStatus === "verified")
  );
  addNewExperimentalRules(next.rules, synthesisResult.proposedRules);
  if (synthesisResult.proposedRules.length > 0) {
    discoveries.push(`Experimental rewrite rules proposed: ${synthesisResult.proposedRules.length}. Human approval required.`);
  }

  const proofTarget = candidateTheorems[0];
  let proofResult: ProofResult | undefined;
  if (proofTarget) {
    proofResult = await previewProofAdapter.verify(proofTarget);
    next.proofHistory.push({
      theoremId: proofTarget.id,
      status: proofResult.status,
      ruleId: proofTarget.relatedRuleIds.at(-1),
      notes: proofResult.notes
    });
    updateProofStatus(next.graph.nodes, proofTarget.id, proofResult);
    tickTrace.push(`Proof adapter returned ${proofResult.status}: ${proofResult.notes}`);
  }

  const confluence = checkConfluence(
    next.rewriteHistory.map((step) => ({
      start: step.before,
      end: step.after,
      path: [step.ruleName]
    }))
  );
  const termination = checkTerminationState({
    depth: activeTheorem.generationDepth,
    steps: next.rewriteHistory.length,
    fuel: Math.max(0, options.fuel - termResult.rewriteTrace.length),
    graph: next.graph,
    options
  });
  const criticalPairs = detectCriticalPairs(next.rewriteHistory);
  const disabledRecommendations = recommendedDisabledRules(next.rewriteHistory, next.rules);
  warnings.push(...termination.warnings);
  if (criticalPairs.length > 0) warnings.push(`${criticalPairs.length} critical rewrite pair(s) require confluence review.`);
  if (disabledRecommendations.length > 0) warnings.push(`Recommended rule quarantine: ${disabledRecommendations.join(", ")}.`);

  next.latest = {
    activeTheorem,
    activeExpression,
    termResult,
    theoremResult,
    graphResult,
    metaResult,
    synthesisResult,
    proofResult,
    stability: {
      ...confluence,
      terminationWarnings: termination.warnings,
      criticalPairs,
      recommendedDisabledRules: disabledRecommendations,
      fuelRemaining: Math.max(0, options.fuel - termResult.rewriteTrace.length),
      recursionDepth: activeTheorem.generationDepth
    },
    tickTrace,
    discoveries,
    warnings
  };

  return { newState: next, tickTrace, discoveries, warnings };
}

function selectActiveTheorem(nodes: TheoremNode[], tick: number) {
  const candidates = nodes.filter((node) => node.proofStatus !== "failed" && !node.domainTags.includes("meta"));
  return candidates[(tick - 1) % Math.max(1, candidates.length)];
}

function mergeExpressions(existing: MathExpression[], candidates: MathExpression[]) {
  const byId = new Map(existing.map((expression) => [expression.id, expression]));
  for (const candidate of candidates) {
    if (!byId.has(candidate.id)) byId.set(candidate.id, candidate);
  }
  return [...byId.values()].slice(-50);
}

function mergeTheorems(existing: TheoremNode[], candidates: TheoremNode[], maxGraphNodes: number) {
  const byId = new Map(existing.map((theorem) => [theorem.id, theorem]));
  for (const candidate of candidates) {
    if (!byId.has(candidate.id)) byId.set(candidate.id, candidate);
  }
  return [...byId.values()].slice(0, maxGraphNodes);
}

function applyRuleActions(
  rules: RewriteRule[],
  actions: Array<{ ruleId: string; action: "promote" | "penalize" | "disable"; reason: string }>
) {
  for (const action of actions) {
    const rule = rules.find((item) => item.id === action.ruleId);
    if (!rule) continue;
    if (action.action === "promote" && rule.status === "experimental") rule.status = "active";
    if (action.action === "disable") rule.status = "disabled";
    if (action.action === "penalize") rule.failureCount += 1;
  }
}

function addNewExperimentalRules(rules: RewriteRule[], proposedRules: RewriteRule[]) {
  for (const proposed of proposedRules) {
    const exists = rules.some((rule) => rule.lhsPattern === proposed.lhsPattern && rule.rhsPattern === proposed.rhsPattern);
    if (!exists) rules.push(proposed);
  }
}

function updateProofStatus(nodes: TheoremNode[], theoremId: string, proofResult: ProofResult) {
  const theorem = nodes.find((node) => node.id === theoremId);
  if (!theorem) return;
  if (proofResult.status === "verified") {
    theorem.proofStatus = "verified";
    theorem.confidenceScore = Math.min(1, theorem.confidenceScore + 0.2);
  } else if (proofResult.status === "failed") {
    theorem.proofStatus = "failed";
    theorem.confidenceScore = Math.max(0.05, theorem.confidenceScore - 0.4);
  } else {
    theorem.proofStatus = "candidate";
  }
}
