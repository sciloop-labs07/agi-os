import type { GraphRewriteResult, MetaTheorem, RewriteRule, TheoremGraph, TheoremNode } from "@/math-ai/types";
import { clone, clamp } from "@/math-ai/utils";

export function rewriteTheoremGraph(
  graph: TheoremGraph,
  metaTheorems: MetaTheorem[],
  rules: RewriteRule[],
  options: { maxGraphNodes?: number; maxGraphEdges?: number } = {}
): GraphRewriteResult {
  const originalGraphSnapshot = clone(graph);
  const rewrittenGraph = clone(graph);
  const graphRewriteTrace = [];
  const emergentPatterns: string[] = [];
  const proposedBridgeTheorems: TheoremNode[] = [];
  const maxGraphNodes = options.maxGraphNodes ?? 40;
  const maxGraphEdges = options.maxGraphEdges ?? 80;

  const proofGroups = groupBy(rewrittenGraph.nodes, (node) => proofSkeleton(node.proofSketch));
  for (const [skeleton, nodes] of Object.entries(proofGroups)) {
    if (nodes.length >= 2 && rewrittenGraph.nodes.length < maxGraphNodes) {
      const meta = metaTheorems.find((item) => item.purpose === "compression");
      const abstraction: TheoremNode = {
        id: `abstraction-${skeleton.replace(/\W+/g, "-").slice(0, 28)}`,
        title: "Abstraction Candidate",
        statement: `Repeated proof skeleton detected: ${skeleton}`,
        expressionIds: [],
        assumptions: ["shared proof structure"],
        conclusions: ["possible abstraction theorem candidate"],
        proofSketch: "Meta-theorem created this as an abstraction candidate. It is not verified.",
        proofStatus: "candidate",
        confidenceScore: 0.42,
        generationDepth: 1,
        parentTheoremIds: nodes.map((node) => node.id),
        childTheoremIds: [],
        relatedRuleIds: [],
        domainTags: ["meta"]
      };
      if (!rewrittenGraph.nodes.some((node) => node.id === abstraction.id)) {
        rewrittenGraph.nodes.push(abstraction);
        for (const node of nodes) {
          if (rewrittenGraph.edges.length < maxGraphEdges) {
            rewrittenGraph.edges.push({ from: abstraction.id, to: node.id, relationType: "generated_by", weight: 0.44, confidence: 0.48 });
          }
        }
        emergentPatterns.push(`Shared proof skeleton: ${skeleton}`);
        graphRewriteTrace.push({
          graphPatternDetected: "shared proof skeleton cluster",
          metaTheoremApplied: meta?.name ?? "Shared Proof Skeleton Abstraction",
          nodesAffected: nodes.map((node) => node.id),
          edgesAffected: [],
          reason: "Multiple theorem nodes use similar proof sketches.",
          confidence: 0.58
        });
      }
    }
  }

  const domains = new Map<string, TheoremNode[]>();
  for (const node of rewrittenGraph.nodes) {
    for (const tag of node.domainTags) domains.set(tag, [...(domains.get(tag) ?? []), node]);
  }
  const domainEntries = [...domains.entries()].filter(([, nodes]) => nodes.length > 0);
  for (let i = 0; i < domainEntries.length - 1; i += 1) {
    const [domainA, nodesA] = domainEntries[i];
    const [domainB, nodesB] = domainEntries[i + 1];
    const confidence = sharedTokenRatio(nodesA[0].statement, nodesB[0].statement);
    if (confidence > 0.18 && rewrittenGraph.edges.length < maxGraphEdges) {
      rewrittenGraph.edges.push({ from: nodesA[0].id, to: nodesB[0].id, relationType: "analogous_to", weight: confidence, confidence });
      proposedBridgeTheorems.push({
        id: `bridge-${domainA}-${domainB}`,
        title: `${domainA} to ${domainB} Bridge Candidate`,
        statement: `Possible analogy bridge between ${nodesA[0].title} and ${nodesB[0].title}`,
        expressionIds: [],
        assumptions: ["structural analogy detected", "human/proof adapter review required"],
        conclusions: ["candidate bridge theorem"],
        proofSketch: "Graph rewrite detected similar theorem graph structure across domains.",
        proofStatus: "candidate",
        confidenceScore: confidence,
        generationDepth: 1,
        parentTheoremIds: [nodesA[0].id, nodesB[0].id],
        childTheoremIds: [],
        relatedRuleIds: rules.filter((rule) => rule.status === "active").slice(0, 2).map((rule) => rule.id),
        domainTags: [domainA, domainB, "bridge"]
      });
      graphRewriteTrace.push({
        graphPatternDetected: "cross-domain analogy",
        metaTheoremApplied: "Analogy bridge detection",
        nodesAffected: [nodesA[0].id, nodesB[0].id],
        edgesAffected: [],
        reason: "Theorem statements share symbolic structure across domains.",
        confidence
      });
    }
  }

  const contradictionEdges = rewrittenGraph.edges.filter((edge) => edge.relationType === "contradicts").length;
  const stabilityScore = clamp(1 - contradictionEdges * 0.18 - Math.max(0, rewrittenGraph.nodes.length - maxGraphNodes) * 0.02);

  return {
    originalGraphSnapshot,
    rewrittenGraph,
    graphRewriteTrace,
    emergentPatterns,
    proposedBridgeTheorems,
    stabilityScore
  };
}

function groupBy<T>(items: T[], keyer: (item: T) => string) {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = keyer(item);
    acc[key] = [...(acc[key] ?? []), item];
    return acc;
  }, {});
}

function proofSkeleton(text: string) {
  return text.toLowerCase().replace(/\b[a-z]\b/g, "x").replace(/\s+/g, " ").slice(0, 44);
}

function sharedTokenRatio(a: string, b: string) {
  const aa = new Set(a.toLowerCase().split(/\W+/).filter(Boolean));
  const bb = new Set(b.toLowerCase().split(/\W+/).filter(Boolean));
  const shared = [...aa].filter((token) => bb.has(token)).length;
  return shared / Math.max(1, Math.min(aa.size, bb.size));
}
