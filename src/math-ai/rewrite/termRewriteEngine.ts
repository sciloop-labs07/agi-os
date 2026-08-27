import type { MathExpression, RewriteOptions, RewriteRule, RewriteTraceStep, TermRewriteResult } from "@/math-ai/types";
import { createExpression, estimateComplexity, normalizeExpression } from "@/math-ai/utils";

const DEFAULT_OPTIONS: RewriteOptions = {
  maxDepth: 4,
  maxBranching: 4,
  fuel: 16,
  complexityLimit: 80
};

export function rewriteExpression(
  expression: MathExpression,
  rules: RewriteRule[],
  options: Partial<RewriteOptions> = {}
): TermRewriteResult {
  const settings = { ...DEFAULT_OPTIONS, ...options };
  const queue = [{ expression, depth: 0 }];
  const candidates: MathExpression[] = [];
  const rewriteTrace: RewriteTraceStep[] = [];
  const visited = new Set([expression.normalForm]);
  let fuel = settings.fuel;
  let stoppedReason = "fuel exhausted";

  while (queue.length > 0 && fuel > 0) {
    const current = queue.shift();
    if (!current) break;
    if (current.depth >= settings.maxDepth) {
      stoppedReason = "maxDepth reached";
      continue;
    }

    const applicable = rules
      .filter((rule) => rule.status !== "disabled")
      .filter((rule) => rule.domain === current.expression.domain || rule.domain === "meta")
      .filter((rule) => current.expression.rawText.includes(rule.lhsPattern))
      .slice(0, settings.maxBranching);

    if (applicable.length === 0) {
      stoppedReason = "no applicable rules";
    }

    for (const rule of applicable) {
      if (fuel <= 0) break;
      fuel -= 1;
      rule.usageCount += 1;

      const before = current.expression.rawText;
      const after = normalizeExpression(before.replace(rule.lhsPattern, rule.rhsPattern));
      const complexity = estimateComplexity(after);
      const delta = complexity - current.expression.complexityScore;

      const safetyNotes = [
        rule.preservesTruth ? "truth-preserving rule" : "non-truth-preserving: proof required",
        rule.reducesComplexity || delta < 0 ? "reduces or may reduce complexity" : "may increase complexity"
      ];

      rewriteTrace.push({
        ruleId: rule.id,
        ruleName: rule.name,
        before,
        after,
        complexityDelta: delta,
        depth: current.depth + 1,
        safetyNotes
      });

      if (complexity > settings.complexityLimit) {
        rule.failureCount += 1;
        stoppedReason = "expressionComplexityLimit reached";
        continue;
      }

      const candidate = createExpression(
        `${expression.id}-rw-${rewriteTrace.length}`,
        after,
        expression.domain,
        rule.preservesTruth && expression.truthStatus === "verified" ? "candidate" : "unknown"
      );

      if (visited.has(candidate.normalForm)) {
        stoppedReason = "cycle detected";
        continue;
      }

      visited.add(candidate.normalForm);
      candidates.push(candidate);
      rule.successCount += delta <= 0 || rule.preservesTruth ? 1 : 0;
      queue.push({ expression: candidate, depth: current.depth + 1 });
      stoppedReason = "completed bounded rewrite";
    }
  }

  return {
    originalExpression: expression,
    candidates,
    rewriteTrace,
    stoppedReason
  };
}
