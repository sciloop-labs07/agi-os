import type { RewriteRule, TheoremGraph, TheoremNode } from "@/math-ai/types";

export function synthesizeRewriteRules(
  history: Array<{ before?: string; after?: string; ruleId?: string }>,
  graph: TheoremGraph,
  verifiedTheorems: TheoremNode[]
) {
  const proposedRules: RewriteRule[] = [];
  const evidence: string[] = [];

  const verifiedStatements = new Set(verifiedTheorems.map((theorem) => theorem.statement));
  for (const theorem of graph.nodes) {
    if (theorem.proofStatus !== "verified" || !verifiedStatements.has(theorem.statement)) continue;
    const [lhs, rhs] = theorem.statement.includes(" rewrites to ")
      ? theorem.statement.split(" rewrites to ")
      : theorem.statement.includes("=")
        ? theorem.statement.split("=")
        : [];
    if (lhs && rhs) {
      proposedRules.push({
        id: `synth-${theorem.id}`,
        name: `Experimental rule from ${theorem.title}`,
        lhsPattern: lhs.trim(),
        rhsPattern: rhs.trim(),
        conditions: theorem.assumptions,
        domain: theorem.domainTags[0] ?? "general",
        ruleType: "meta_rewrite",
        safetyLevel: 1,
        preservesTruth: false,
        reducesComplexity: false,
        usageCount: 0,
        successCount: 0,
        failureCount: 0,
        inventedBy: "meta_engine",
        status: "experimental"
      });
      evidence.push(`Verified theorem pair suggested ${lhs.trim()} -> ${rhs.trim()}.`);
    }
  }

  const repeated = repeatedHistory(history);
  if (repeated) {
    proposedRules.push({
      id: `synth-history-${slug(repeated.before)}-${slug(repeated.after)}`,
      name: "Experimental repeated rewrite",
      lhsPattern: repeated.before,
      rhsPattern: repeated.after,
      conditions: ["observed repeated rewrite"],
      domain: "general",
      ruleType: "meta_rewrite",
      safetyLevel: 1,
      preservesTruth: false,
      reducesComplexity: false,
      usageCount: 0,
      successCount: 0,
      failureCount: 0,
      inventedBy: "meta_engine",
      status: "experimental"
    });
    evidence.push("Repeated rewrite history suggested an experimental rule.");
  }

  return {
    proposedRules: dedupeRules(proposedRules).slice(0, 3),
    evidence,
    riskLevel: proposedRules.length > 0 ? "medium" : "low",
    requiresHumanApproval: true
  };
}

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 28) || "rewrite";
}

function repeatedHistory(history: Array<{ before?: string; after?: string }>) {
  const seen = new Map<string, number>();
  for (const item of history) {
    if (!item.before || !item.after) continue;
    const key = `${item.before}->${item.after}`;
    seen.set(key, (seen.get(key) ?? 0) + 1);
    if ((seen.get(key) ?? 0) > 1) return { before: item.before, after: item.after };
  }
  return null;
}

function dedupeRules(rules: RewriteRule[]) {
  const seen = new Set<string>();
  return rules.filter((rule) => {
    const key = `${rule.lhsPattern}->${rule.rhsPattern}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
