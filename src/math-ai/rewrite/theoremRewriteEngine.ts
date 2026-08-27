import type { RewriteOptions, RewriteRule, TheoremNode, TheoremRewriteResult } from "@/math-ai/types";
import { estimateComplexity } from "@/math-ai/utils";

export function rewriteTheorem(
  theoremNode: TheoremNode,
  rules: RewriteRule[],
  options: Partial<RewriteOptions> = {}
): TheoremRewriteResult {
  const maxBranching = options.maxBranching ?? 4;
  const applicable = rules
    .filter((rule) => rule.status !== "disabled")
    .filter((rule) => theoremNode.domainTags.includes(rule.domain) || theoremNode.statement.includes(rule.lhsPattern))
    .slice(0, maxBranching);

  const candidateTheorems: TheoremNode[] = [];
  const rewriteTrace = [];
  let highRisk = false;

  for (const rule of applicable) {
    const before = theoremNode.statement;
    const after = before.includes(rule.lhsPattern)
      ? before.replace(rule.lhsPattern, rule.rhsPattern)
      : applyTheoremLevelRewrite(before, rule);
    const complexityDelta = estimateComplexity(after) - estimateComplexity(before);
    const proofStatus = rule.preservesTruth ? "candidate" : "candidate";

    if (!rule.preservesTruth || rule.safetyLevel <= 2) highRisk = true;

    const candidate: TheoremNode = {
      ...theoremNode,
      id: `${theoremNode.id}-candidate-${rule.id}`,
      title: `${rewriteLabel(rule.ruleType)} Candidate: ${theoremNode.title}`,
      statement: after,
      assumptions: rewriteAssumptions(theoremNode.assumptions, rule),
      conclusions: theoremNode.conclusions.map((item) => item.replace(rule.lhsPattern, rule.rhsPattern)),
      proofSketch: `Candidate produced by ${rule.name}. ${rule.preservesTruth ? "Still requires proof adapter confirmation." : "Non-truth-preserving rewrite; proof verification required."}`,
      proofStatus,
      confidenceScore: Math.max(0.05, theoremNode.confidenceScore - (rule.preservesTruth ? 0.12 : 0.34)),
      generationDepth: theoremNode.generationDepth + 1,
      parentTheoremIds: [...theoremNode.parentTheoremIds, theoremNode.id],
      childTheoremIds: [],
      relatedRuleIds: [...new Set([...theoremNode.relatedRuleIds, rule.id])]
    };

    candidateTheorems.push(candidate);
    rewriteTrace.push({
      ruleId: rule.id,
      ruleName: rule.name,
      before,
      after,
      complexityDelta,
      depth: candidate.generationDepth,
      safetyNotes: [
        rule.preservesTruth ? "equivalence-like rewrite" : "truth may not be preserved",
        rule.ruleType,
        `safety level ${rule.safetyLevel}`
      ]
    });
  }

  return {
    originalTheorem: theoremNode,
    candidateTheorems,
    rewriteTrace,
    riskLevel: highRisk ? "high" : candidateTheorems.length > 1 ? "medium" : "low",
    needsProofVerification: candidateTheorems.length > 0
  };
}

function applyTheoremLevelRewrite(statement: string, rule: RewriteRule) {
  if (rule.ruleType === "specialization") return statement.replace("For all", "For all specialized");
  if (rule.ruleType === "generalization") return statement.replace("real numbers", "ordered fields");
  if (rule.ruleType === "duality") return `Dual form of (${statement})`;
  if (rule.ruleType === "graph_rewrite") return `Graph rewrite candidate: ${statement}`;
  return `${statement} rewritten via ${rule.name}`;
}

function rewriteAssumptions(assumptions: string[], rule: RewriteRule) {
  if (rule.ruleType === "specialization") return [...assumptions, `specialized by ${rule.name}`];
  if (rule.ruleType === "generalization") return assumptions.filter((_, index) => index !== 0).concat(`generalized by ${rule.name}`);
  if (!rule.preservesTruth) return [...assumptions, "proof verification required"];
  return assumptions;
}

function rewriteLabel(type: RewriteRule["ruleType"]) {
  if (type === "specialization") return "Specialization";
  if (type === "generalization") return "Generalization";
  if (type === "duality") return "Dual";
  return "Rewrite";
}
