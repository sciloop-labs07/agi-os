import type { RuleForgeMemory } from "@/ruleforge/types";

const globalForRuleForge = globalThis as unknown as { ruleForgeMemory?: RuleForgeMemory };

export function getRuleForgeMemory(): RuleForgeMemory {
  if (!globalForRuleForge.ruleForgeMemory) {
    globalForRuleForge.ruleForgeMemory = {
      rawObservations: [],
      extractedClaims: [],
      symbolicGraphs: [],
      candidateRules: [],
      activeRules: [],
      rejectedRules: [],
      ruleEvolutionHistory: [],
      sourceReliabilityHistory: [],
      contradictionHistory: [],
      discoveredLaws: [],
      auditLog: []
    };
  }

  return globalForRuleForge.ruleForgeMemory;
}

export function rememberUnique<T extends { id?: string; rule_id?: string }>(items: T[], nextItems: T[], maxItems = 80) {
  const keyFor = (item: T) => item.id ?? item.rule_id ?? JSON.stringify(item);
  const seen = new Set(items.map(keyFor));
  for (const item of nextItems) {
    if (!seen.has(keyFor(item))) {
      items.unshift(item);
      seen.add(keyFor(item));
    }
  }
  items.splice(maxItems);
}
