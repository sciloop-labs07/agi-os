import { calculateIntegratedSensitivity, simulateIntegratedScenario } from "./integrated";
import { validateMarketScenario } from "./engine";
import type { EvidenceStatus, IntegratedMarketScenario, MarketCandidateStatus, MarketObjectiveWeights, MarketOptimizationCandidate, MarketOptimizationConfig, MarketOptimizationParameters, MarketOptimizationReport, SimulationMode } from "./types";

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));
const round = (value: number) => Math.round(value * 100) / 100;
const DEFAULT_WEIGHTS: MarketObjectiveWeights = { activation: 0.16, retention: 0.16, paidConversion: 0.12, grossMargin: 0.16, runway: 0.1, apiEfficiency: 0.1, evidenceQuality: 0.12, assumptionRisk: 0.08 };
export const DEFAULT_MARKET_OPTIMIZATION_CONFIG: MarketOptimizationConfig = { populationSize: 12, maxGenerations: 8, maxSimulations: 144, targetScore: 85, patience: 3, mutationStep: 0.08, objectiveWeights: DEFAULT_WEIGHTS };

export function parametersFromScenario(scenario: IntegratedMarketScenario): MarketOptimizationParameters {
  const a = scenario.productScenario.assumptions;
  const model = scenario.apiCostInputs.models[0];
  return { activationRate: a.activationRate, repeatSessionRate: a.repeatSessionRate, paidConversionRate: a.paidConversionRate, monthlyChurnRate: a.monthlyChurnRate, proMonthlyPriceUsd: a.proMonthlyPriceUsd, freeVisualsPerUser: a.freeVisualsPerUser, paidVisualsPerUser: a.paidVisualsPerUser, requestsPerVisual: a.requestsPerVisual, infrastructurePerUserUsd: a.infrastructurePerUserUsd, supportPerPaidUserUsd: a.supportPerPaidUserUsd, cacUsd: a.cacUsd, monthlyOperatingBudgetUsd: a.monthlyOperatingBudgetUsd, inputTokensPerVisual: model?.inputTokensPerVisual ?? 1200, outputTokensPerVisual: model?.outputTokensPerVisual ?? 900, trust: scenario.macroInputs.trust, productivity: scenario.macroInputs.productivity, resources: scenario.macroInputs.resources, inflationSensitivity: 1 };
}

export function applyOptimizationParameters(scenario: IntegratedMarketScenario, parameters: MarketOptimizationParameters): IntegratedMarketScenario {
  const next = structuredClone(scenario);
  Object.assign(next.productScenario.assumptions, { activationRate: parameters.activationRate, repeatSessionRate: parameters.repeatSessionRate, paidConversionRate: parameters.paidConversionRate, monthlyChurnRate: parameters.monthlyChurnRate, proMonthlyPriceUsd: parameters.proMonthlyPriceUsd, freeVisualsPerUser: parameters.freeVisualsPerUser, paidVisualsPerUser: parameters.paidVisualsPerUser, requestsPerVisual: parameters.requestsPerVisual, infrastructurePerUserUsd: parameters.infrastructurePerUserUsd, supportPerPaidUserUsd: parameters.supportPerPaidUserUsd, cacUsd: parameters.cacUsd, monthlyOperatingBudgetUsd: parameters.monthlyOperatingBudgetUsd });
  next.macroInputs.trust = parameters.trust;
  next.macroInputs.productivity = parameters.productivity;
  next.macroInputs.resources = parameters.resources;
  next.apiCostInputs.models = next.apiCostInputs.models.map((model) => ({ ...model, inputTokensPerVisual: parameters.inputTokensPerVisual, outputTokensPerVisual: parameters.outputTokensPerVisual }));
  return next;
}

function mutate(base: MarketOptimizationParameters, index: number, step: number): MarketOptimizationParameters {
  const direction = index % 2 === 0 ? 1 : -1;
  const factor = 1 + direction * step * (1 + (index % 3) * 0.35);
  const next = { ...base };
  const key = (["activationRate", "repeatSessionRate", "paidConversionRate", "monthlyChurnRate", "proMonthlyPriceUsd", "freeVisualsPerUser", "paidVisualsPerUser", "requestsPerVisual"] as const)[index % 8];
  next[key] = key.includes("Rate") ? clamp(next[key] * factor, 0, 1) : Math.max(0, next[key] * factor);
  if (index % 5 === 0) next.trust = clamp(next.trust + direction * 4, 0, 100);
  if (index % 7 === 0) next.productivity = clamp(next.productivity + direction * 4, 0, 100);
  return next;
}

function objectiveScore(scenario: IntegratedMarketScenario, mode: SimulationMode, parameters: MarketOptimizationParameters, weights: MarketObjectiveWeights) {
  const result = simulateIntegratedScenario(applyOptimizationParameters(scenario, parameters), mode);
  const final = result.snapshots.at(-1)!;
  const activation = clamp(final.product.activatedUsers / Math.max(final.product.visits, 1) * 1000);
  const retention = clamp(final.product.repeatUsers / Math.max(final.product.activatedUsers, 1) * 100);
  const paidConversion = clamp(final.product.newPaidUsers / Math.max(final.product.repeatUsers, 1) * 1000);
  const grossMargin = final.grossMarginPercent === null ? 0 : clamp(final.grossMarginPercent);
  const runway = final.grossProfitUsd === null ? 0 : final.grossProfitUsd >= 0 ? 100 : clamp(100 - (final.runwayMonths ?? 100));
  const apiEfficiency = final.apiCost.costPerVisualUsd === null ? 0 : clamp(100 - final.apiCost.costPerVisualUsd * 1000);
  const evidenceQuality = final.apiCost.available ? 100 : 0;
  const assumptionRisk = clamp(parameters.paidConversionRate * 250 + (parameters.monthlyChurnRate < 0.03 ? 30 : 0) + (parameters.cacUsd === 0 ? 10 : 0));
  const scores: MarketObjectiveWeights = { activation: round(activation), retention: round(retention), paidConversion: round(paidConversion), grossMargin: round(grossMargin), runway: round(runway), apiEfficiency: round(apiEfficiency), evidenceQuality, assumptionRisk: round(100 - assumptionRisk) };
  const score = round(Object.entries(weights).reduce((sum, [key, weight]) => sum + scores[key as keyof MarketObjectiveWeights] * weight, 0));
  return { result, scores, score };
}

export function validateOptimizationCandidate(scenario: IntegratedMarketScenario, parameters: MarketOptimizationParameters): string[] {
  const candidate = applyOptimizationParameters(scenario, parameters);
  const issues = validateMarketScenario(candidate.productScenario).map((issue) => issue.message);
  if (parameters.trust < 0 || parameters.trust > 100 || parameters.productivity < 0 || parameters.productivity > 100 || parameters.resources <= 0) issues.push("Macro values must remain within valid bounds.");
  if (candidate.apiCostInputs.models.reduce((sum, model) => sum + model.mixPercent, 0) < 0.999) issues.push("Model mix must total 100%.");
  return issues;
}

export function evaluateMarketCandidate(scenario: IntegratedMarketScenario, parameters: MarketOptimizationParameters, id: string, parentId: string | null, generation: number, mode: SimulationMode, weights = DEFAULT_WEIGHTS): MarketOptimizationCandidate {
  const violations = validateOptimizationCandidate(scenario, parameters);
  const evaluated = objectiveScore(scenario, mode, parameters, weights);
  const evidenceBlocked = !evaluated.result.snapshots.at(-1)!.apiCost.available;
  const status: MarketCandidateStatus = violations.length ? "rejected" : evidenceBlocked ? "needs-evidence" : "candidate";
  const evidenceStatus: EvidenceStatus = evidenceBlocked ? "needs-evidence" : "simulated";
  return { id, parentId, scenarioId: scenario.id, generation, parameters: { ...parameters }, mode, status, score: evaluated.score, objectiveScores: evaluated.scores, summary: { finalActiveUsers: evaluated.result.snapshots.at(-1)!.product.activeUsers, finalPaidUsers: evaluated.result.snapshots.at(-1)!.product.activePaidUsers, finalRevenueUsd: evaluated.result.snapshots.at(-1)!.revenueUsd, finalGrossProfitUsd: evaluated.result.snapshots.at(-1)!.grossProfitUsd, apiCostAvailable: evaluated.result.snapshots.at(-1)!.apiCost.available, evidenceStatus }, constraintViolations: violations, rejectionReasons: evidenceBlocked ? ["Verified API pricing is required before profitability claims can be scored."] : [], lineage: { source: "maths-ai-bounded-search", createdAt: "2026-09-18", deterministicSeed: generation * 1000 + id.length } };
}

export async function optimizeMarketScenario(scenario: IntegratedMarketScenario, mode: SimulationMode, config: MarketOptimizationConfig = DEFAULT_MARKET_OPTIMIZATION_CONFIG, hooks?: { onProgress?: (report: MarketOptimizationReport) => void; shouldStop?: () => boolean; waitIfPaused?: () => Promise<void> }): Promise<MarketOptimizationReport> {
  const base = parametersFromScenario(scenario);
  let population = Array.from({ length: config.populationSize }, (_, index) => evaluateMarketCandidate(scenario, index === 0 ? base : mutate(base, index, config.mutationStep), `M${String(index + 1).padStart(4, "0")}`, null, 0, mode, config.objectiveWeights));
  let best = population.slice().sort((a, b) => b.score - a.score)[0] ?? null;
  const history: MarketOptimizationReport["history"] = [];
  let simulations = population.length;
  let stagnant = 0;
  for (let generation = 1; generation <= config.maxGenerations && simulations < config.maxSimulations; generation += 1) {
    if (hooks?.shouldStop?.()) break;
    await hooks?.waitIfPaused?.();
    population = population.map((candidate, index) => index === 0 ? candidate : evaluateMarketCandidate(scenario, mutate(base, index + generation, config.mutationStep / (generation + 1)), `M${String(simulations + index + 1).padStart(4, "0")}`, candidate.id, generation, mode, config.objectiveWeights));
    simulations += population.length;
    const ranked = population.slice().sort((a, b) => b.score - a.score);
    const generationBest = ranked[0] ?? null;
    if (generationBest && (!best || generationBest.score > best.score)) { best = generationBest; stagnant = 0; } else stagnant += 1;
    history.push({ generation, bestScore: best?.score ?? 0, averageScore: round(population.reduce((sum, item) => sum + item.score, 0) / Math.max(population.length, 1)), rejected: population.filter((item) => item.status === "rejected").length });
    const report: MarketOptimizationReport = { scenarioId: scenario.id, mode, status: "running", generation, simulations, best, ranked, rejected: population.filter((item) => item.status === "rejected"), history, stopReason: "search in progress" };
    hooks?.onProgress?.(report);
    if (best && best.score >= config.targetScore) return { ...report, status: "completed", stopReason: "target score reached" };
    if (stagnant >= config.patience) return { ...report, status: "completed", stopReason: "stagnation limit reached" };
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }
  const ranked = population.slice().sort((a, b) => b.score - a.score);
  return { scenarioId: scenario.id, mode, status: hooks?.shouldStop?.() ? "stopped" : "completed", generation: history.at(-1)?.generation ?? 0, simulations, best, ranked, rejected: population.filter((item) => item.status === "rejected"), history, stopReason: hooks?.shouldStop?.() ? "stopped by user" : "maximum search budget reached" };
}

export function serializeMarketOptimizationCandidate(candidate: MarketOptimizationCandidate): string { return JSON.stringify(candidate, Object.keys(candidate).sort()); }

export function candidateSensitivity(scenario: IntegratedMarketScenario, candidate: MarketOptimizationCandidate): Array<{ parameter: string; impact: number }> {
  const baseline = simulateIntegratedScenario(applyOptimizationParameters(scenario, candidate.parameters), candidate.mode).snapshots.at(-1)!;
  return calculateIntegratedSensitivity(applyOptimizationParameters(scenario, candidate.parameters), candidate.mode).map((item) => ({ parameter: item.parameter, impact: item.impact + (baseline.product.activePaidUsers * 0) }));
}
