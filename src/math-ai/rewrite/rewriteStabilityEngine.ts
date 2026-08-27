import type { RewriteOptions, RewriteRule, RewriteTraceStep, TheoremGraph } from "@/math-ai/types";
import { normalizeExpression, clamp } from "@/math-ai/utils";

export function checkTerminationState(state: {
  depth: number;
  steps: number;
  fuel: number;
  graph: TheoremGraph;
  options: RewriteOptions & { maxGraphNodes?: number; maxGraphEdges?: number };
}) {
  const warnings: string[] = [];
  if (state.depth >= state.options.maxDepth) warnings.push("max recursion depth reached");
  if (state.steps >= state.options.fuel) warnings.push("rewrite fuel exhausted");
  if (state.fuel <= 0) warnings.push("fuel counter depleted");
  if (state.graph.nodes.length > (state.options.maxGraphNodes ?? 40)) warnings.push("max graph nodes exceeded");
  if (state.graph.edges.length > (state.options.maxGraphEdges ?? 80)) warnings.push("max graph edges exceeded");
  return { terminated: warnings.length > 0, warnings };
}

export function checkConfluence(rewritePaths: Array<{ start: string; end: string; path: string[] }>) {
  const byStart = new Map<string, string[]>();
  for (const path of rewritePaths) {
    byStart.set(path.start, [...(byStart.get(path.start) ?? []), normalizeExpression(path.end)]);
  }
  const nonConvergentBranches = [];
  for (const [start, ends] of byStart) {
    if (new Set(ends).size > 1) nonConvergentBranches.push({ start, normalForms: [...new Set(ends)] });
  }
  return {
    isStable: nonConvergentBranches.length === 0,
    criticalPairs: nonConvergentBranches,
    nonConvergentBranches,
    recommendedDisabledRules: [] as string[],
    stabilityScore: clamp(1 - nonConvergentBranches.length * 0.22)
  };
}

export function detectCriticalPairs(rewriteHistory: RewriteTraceStep[]) {
  const seen = new Map<string, Set<string>>();
  for (const step of rewriteHistory) {
    const set = seen.get(step.before) ?? new Set<string>();
    set.add(step.after);
    seen.set(step.before, set);
  }
  return [...seen.entries()]
    .filter(([, outputs]) => outputs.size > 1)
    .map(([before, outputs]) => ({ before, outputs: [...outputs] }));
}

export function recommendedDisabledRules(history: RewriteTraceStep[], rules: RewriteRule[]) {
  const critical = detectCriticalPairs(history);
  const riskyRuleIds = new Set<string>();
  for (const pair of critical) {
    for (const step of history) {
      if (step.before === pair.before) riskyRuleIds.add(step.ruleId);
    }
  }
  return rules.filter((rule) => riskyRuleIds.has(rule.id) && rule.safetyLevel <= 2).map((rule) => rule.id);
}
