import type { MetaTheorem, RewriteRule, TheoremGraph, TheoremNode } from "@/math-ai/types";
import { createExpression } from "@/math-ai/utils";

export const STARTER_EXPRESSIONS = [
  createExpression("expr-bool-1", "¬¬A", "boolean", "verified"),
  createExpression("expr-bool-2", "A ∧ B", "boolean", "verified"),
  createExpression("expr-bool-3", "A → B", "boolean", "verified"),
  createExpression("expr-alg-1", "a * (b + c)", "algebra", "verified"),
  createExpression("expr-set-1", "A ∪ B", "set", "verified"),
  createExpression("expr-graph-1", "path(u,v) ∧ path(v,w)", "graph", "candidate")
];

export const STARTER_THEOREMS: TheoremNode[] = [
  {
    id: "thm-double-negation",
    title: "Double Negation Elimination",
    statement: "¬¬A rewrites to A in classical Boolean logic",
    expressionIds: ["expr-bool-1"],
    assumptions: ["classical logic"],
    conclusions: ["A"],
    proofSketch: "Use truth-table equivalence for A and ¬¬A.",
    proofStatus: "verified",
    confidenceScore: 0.98,
    generationDepth: 0,
    parentTheoremIds: [],
    childTheoremIds: [],
    relatedRuleIds: ["rule-double-negation"],
    domainTags: ["boolean", "logic"]
  },
  {
    id: "thm-demorgan-and",
    title: "De Morgan And",
    statement: "¬(A ∧ B) rewrites to ¬A ∨ ¬B",
    expressionIds: [],
    assumptions: ["classical logic"],
    conclusions: ["¬A ∨ ¬B"],
    proofSketch: "Use truth table over A and B.",
    proofStatus: "verified",
    confidenceScore: 0.97,
    generationDepth: 0,
    parentTheoremIds: [],
    childTheoremIds: [],
    relatedRuleIds: ["rule-demorgan-and"],
    domainTags: ["boolean", "logic"]
  },
  {
    id: "thm-implication-form",
    title: "Implication Elimination Form",
    statement: "A → B rewrites to ¬A ∨ B",
    expressionIds: ["expr-bool-3"],
    assumptions: ["classical logic", "well-formed propositions"],
    conclusions: ["¬A ∨ B"],
    proofSketch: "Use truth-table equivalence between implication and disjunction.",
    proofStatus: "verified",
    confidenceScore: 0.97,
    generationDepth: 0,
    parentTheoremIds: [],
    childTheoremIds: [],
    relatedRuleIds: ["rule-implication-elim"],
    domainTags: ["boolean", "logic"]
  },
  {
    id: "thm-distributive-algebra",
    title: "Algebraic Distributivity",
    statement: "a * (b + c) rewrites to a*b + a*c",
    expressionIds: ["expr-alg-1"],
    assumptions: ["ring-like algebraic structure"],
    conclusions: ["a*b + a*c"],
    proofSketch: "Use distributive axiom.",
    proofStatus: "verified",
    confidenceScore: 0.95,
    generationDepth: 0,
    parentTheoremIds: [],
    childTheoremIds: [],
    relatedRuleIds: ["rule-alg-distribute"],
    domainTags: ["algebra"]
  },
  {
    id: "thm-set-union-comm",
    title: "Union Commutativity",
    statement: "A ∪ B rewrites to B ∪ A",
    expressionIds: ["expr-set-1"],
    assumptions: ["well-defined sets"],
    conclusions: ["B ∪ A"],
    proofSketch: "Element membership equivalence in both directions.",
    proofStatus: "verified",
    confidenceScore: 0.96,
    generationDepth: 0,
    parentTheoremIds: [],
    childTheoremIds: [],
    relatedRuleIds: ["rule-set-union-comm"],
    domainTags: ["set"]
  },
  {
    id: "thm-path-composition",
    title: "Path Composition Candidate",
    statement: "path(u,v) and path(v,w) suggests path(u,w)",
    expressionIds: ["expr-graph-1"],
    assumptions: ["directed graph", "composable paths"],
    conclusions: ["path(u,w)"],
    proofSketch: "Concatenate paths if endpoint and startpoint align.",
    proofStatus: "candidate",
    confidenceScore: 0.62,
    generationDepth: 0,
    parentTheoremIds: [],
    childTheoremIds: [],
    relatedRuleIds: ["rule-graph-path-compose"],
    domainTags: ["graph"]
  }
];

export const STARTER_RULES: RewriteRule[] = [
  {
    id: "rule-double-negation",
    name: "Double Negation",
    lhsPattern: "¬¬A",
    rhsPattern: "A",
    conditions: ["classical logic"],
    domain: "boolean",
    ruleType: "logical",
    safetyLevel: 5,
    preservesTruth: true,
    reducesComplexity: true,
    usageCount: 0,
    successCount: 0,
    failureCount: 0,
    inventedBy: "system",
    status: "active"
  },
  {
    id: "rule-implication-elim",
    name: "Implication Elimination",
    lhsPattern: "A → B",
    rhsPattern: "¬A ∨ B",
    conditions: ["classical logic"],
    domain: "boolean",
    ruleType: "equivalence",
    safetyLevel: 5,
    preservesTruth: true,
    reducesComplexity: false,
    usageCount: 0,
    successCount: 0,
    failureCount: 0,
    inventedBy: "system",
    status: "active"
  },
  {
    id: "rule-demorgan-and",
    name: "De Morgan And",
    lhsPattern: "¬(A ∧ B)",
    rhsPattern: "¬A ∨ ¬B",
    conditions: ["classical logic"],
    domain: "boolean",
    ruleType: "logical",
    safetyLevel: 5,
    preservesTruth: true,
    reducesComplexity: false,
    usageCount: 0,
    successCount: 0,
    failureCount: 0,
    inventedBy: "system",
    status: "active"
  },
  {
    id: "rule-idempotent-and",
    name: "And Idempotence",
    lhsPattern: "A ∧ A",
    rhsPattern: "A",
    conditions: ["classical logic"],
    domain: "boolean",
    ruleType: "normalization",
    safetyLevel: 5,
    preservesTruth: true,
    reducesComplexity: true,
    usageCount: 0,
    successCount: 0,
    failureCount: 0,
    inventedBy: "system",
    status: "active"
  },
  {
    id: "rule-alg-distribute",
    name: "Distribute Multiplication",
    lhsPattern: "a * (b + c)",
    rhsPattern: "a*b + a*c",
    conditions: ["ring-like algebraic structure"],
    domain: "algebra",
    ruleType: "algebraic",
    safetyLevel: 4,
    preservesTruth: true,
    reducesComplexity: false,
    usageCount: 0,
    successCount: 0,
    failureCount: 0,
    inventedBy: "system",
    status: "active"
  },
  {
    id: "rule-set-union-comm",
    name: "Union Commutativity",
    lhsPattern: "A ∪ B",
    rhsPattern: "B ∪ A",
    conditions: ["well-defined sets"],
    domain: "set",
    ruleType: "equivalence",
    safetyLevel: 5,
    preservesTruth: true,
    reducesComplexity: false,
    usageCount: 0,
    successCount: 0,
    failureCount: 0,
    inventedBy: "system",
    status: "active"
  },
  {
    id: "rule-graph-path-compose",
    name: "Path Composition",
    lhsPattern: "path(u,v) ∧ path(v,w)",
    rhsPattern: "path(u,w)",
    conditions: ["composable graph paths"],
    domain: "graph",
    ruleType: "graph_rewrite",
    safetyLevel: 3,
    preservesTruth: false,
    reducesComplexity: true,
    usageCount: 0,
    successCount: 0,
    failureCount: 0,
    inventedBy: "system",
    status: "experimental"
  }
];

export const STARTER_GRAPH: TheoremGraph = {
  nodes: STARTER_THEOREMS,
  edges: [
    { from: "thm-double-negation", to: "thm-demorgan-and", relationType: "analogous_to", ruleId: "rule-double-negation", weight: 0.54, confidence: 0.72 },
    { from: "thm-demorgan-and", to: "thm-implication-form", relationType: "proof_depends_on", ruleId: "rule-implication-elim", weight: 0.44, confidence: 0.6 },
    { from: "thm-distributive-algebra", to: "thm-set-union-comm", relationType: "analogous_to", weight: 0.38, confidence: 0.48 },
    { from: "thm-path-composition", to: "thm-distributive-algebra", relationType: "analogous_to", ruleId: "rule-graph-path-compose", weight: 0.31, confidence: 0.42 }
  ]
};

export const STARTER_META_THEOREMS: MetaTheorem[] = [
  {
    id: "meta-shared-proof-skeleton",
    name: "Shared Proof Skeleton Abstraction",
    description: "If many theorem nodes share a proof skeleton, create a higher-level abstraction theorem.",
    appliesToRuleTypes: ["logical", "equivalence", "algebraic"],
    graphPattern: "three nodes with overlapping proofSketch tokens",
    rewriteAction: "create abstraction theorem node",
    purpose: "compression"
  },
  {
    id: "meta-confluence-check",
    name: "Critical Pair Confluence Check",
    description: "If two rewrite paths from one theorem diverge, reduce them to normal forms and mark critical pairs.",
    appliesToRuleTypes: ["logical", "equivalence", "normalization"],
    graphPattern: "one source with multiple rewrite children",
    rewriteAction: "compare normal forms",
    purpose: "confluence"
  },
  {
    id: "meta-rule-promotion",
    name: "Evidence-Weighted Rule Promotion",
    description: "Rules that repeatedly create lower-complexity proof-checkable results gain priority.",
    appliesToRuleTypes: ["logical", "algebraic", "normalization"],
    graphPattern: "rule success count exceeds failure count",
    rewriteAction: "increase confidence / keep active",
    purpose: "rule_discovery"
  },
  {
    id: "meta-rule-quarantine",
    name: "Failed Candidate Quarantine",
    description: "Rules that repeatedly create failed proof candidates are disabled or penalized.",
    appliesToRuleTypes: ["generalization", "graph_rewrite", "meta_rewrite"],
    graphPattern: "rule failure count high",
    rewriteAction: "disable experimental rule",
    purpose: "stability"
  }
];
