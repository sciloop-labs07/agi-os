import type { MetaTheorem, RewriteRule, TheoremGraph, TheoremNode } from "@/math-ai/types";

export function applyMetaTheorems(
  graph: TheoremGraph,
  rewriteHistory: Array<{ ruleId?: string; after?: string; before?: string }>,
  proofHistory: Array<{ theoremId: string; status: string; ruleId?: string }>,
  metaTheorems: MetaTheorem[] = []
) {
  const metaInsights: string[] = [];
  const graphActions: string[] = [];
  const ruleActions: Array<{ ruleId: string; action: "promote" | "penalize" | "disable"; reason: string }> = [];
  const proposedNewRules: Partial<RewriteRule>[] = [];
  const proposedNewTheorems: Partial<TheoremNode>[] = [];

  const repeatedSkeletons = findRepeatedProofSkeletons(graph);
  if (repeatedSkeletons.length > 0) {
    const meta = metaTheorems.find((item) => item.purpose === "compression");
    metaInsights.push(`${meta?.name ?? "Meta abstraction"} detected repeated proof skeletons.`);
    graphActions.push("create abstraction candidate nodes");
    for (const skeleton of repeatedSkeletons) {
      proposedNewTheorems.push({
        id: `meta-abstraction-${skeleton.slice(0, 20).replace(/\W+/g, "-")}`,
        title: "Meta-Abstraction Candidate",
        statement: `A repeated proof skeleton may define a higher-level theorem pattern: ${skeleton}`,
        proofStatus: "candidate"
      });
    }
  }

  const successByRule = new Map<string, number>();
  const failByRule = new Map<string, number>();
  for (const item of proofHistory) {
    if (!item.ruleId) continue;
    if (item.status === "verified") successByRule.set(item.ruleId, (successByRule.get(item.ruleId) ?? 0) + 1);
    if (item.status === "failed") failByRule.set(item.ruleId, (failByRule.get(item.ruleId) ?? 0) + 1);
  }
  for (const [ruleId, success] of successByRule) {
    if (success >= 2) ruleActions.push({ ruleId, action: "promote", reason: "Repeated proof-checkable success." });
  }
  for (const [ruleId, failures] of failByRule) {
    if (failures >= 2) ruleActions.push({ ruleId, action: "disable", reason: "Repeated failed proof candidates." });
  }

  const repeatedRewrite = findRepeatedRewriteShape(rewriteHistory);
  if (repeatedRewrite) {
    proposedNewRules.push({
      id: `experimental-${slug(repeatedRewrite.before)}-${slug(repeatedRewrite.after)}`,
      name: "Observed Rewrite Pattern",
      lhsPattern: repeatedRewrite.before,
      rhsPattern: repeatedRewrite.after,
      status: "experimental",
      safetyLevel: 1,
      preservesTruth: false,
      inventedBy: "meta_engine"
    });
    metaInsights.push("Observed repeated rewrite shape. Experimental rule proposal created.");
  }

  return {
    metaInsights,
    graphActions,
    ruleActions,
    proposedNewRules,
    proposedNewTheorems
  };
}

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 28) || "rewrite";
}

function findRepeatedProofSkeletons(graph: TheoremGraph) {
  const counts = new Map<string, number>();
  for (const node of graph.nodes) {
    const skeleton = node.proofSketch.toLowerCase().replace(/\b[a-z]\b/g, "x").slice(0, 36);
    counts.set(skeleton, (counts.get(skeleton) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, count]) => count >= 2).map(([key]) => key);
}

function findRepeatedRewriteShape(history: Array<{ before?: string; after?: string }>) {
  const counts = new Map<string, number>();
  for (const item of history) {
    if (!item.before || !item.after) continue;
    const key = `${item.before}->${item.after}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
    if ((counts.get(key) ?? 0) >= 2) return { before: item.before, after: item.after };
  }
  return null;
}
