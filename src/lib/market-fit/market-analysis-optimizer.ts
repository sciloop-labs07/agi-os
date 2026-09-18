import { marketCompetition, marketEvidenceRegistry, marketSegments } from "./market-analysis-fixtures";
import { serializeAdvancedMarketAnalysis, simulateAdvancedMarketAnalysis, validateAdvancedMarketParameters } from "./market-analysis-advanced-engine";
import type { AdvancedMarketAnalysisInputs, AdvancedMarketParameterKey, AdvancedMarketParameterSet, MarketAnalysisCandidate, MarketAnalysisObjectiveWeights, MarketAnalysisOptimizationReport, MarketAnalysisOptimizerConfig } from "./market-analysis-advanced-types";

export const DEFAULT_MARKET_ANALYSIS_OPTIMIZER_CONFIG: MarketAnalysisOptimizerConfig = {
  populationSize: 8, maxGenerations: 8, maxSimulations: 64, targetScore: 75, patience: 3, mutationStep: 0.08,
  objectiveWeights: { marketOpportunity: 0.2, activation: 0.14, retention: 0.14, paidConversion: 0.1, margin: 0.12, acquisitionFeasibility: 0.1, evidenceQuality: 0.1, assumptionSafety: 0.1 },
  mutableParameters: ["targetSegmentShare", "internetAccess", "languageFit", "problemIncidence", "alternativeGap", "activationRate", "repeatSessionRate", "paidConversionRate", "monthlyChurnRate", "proMonthlyPriceUsd", "distributionReach", "acquisitionDifficulty"]
};

const round = (value: number) => Math.round(value * 100) / 100;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const seedValue = (seed: number) => ((seed * 9301 + 49297) % 233280) / 233280;

function objectiveScores(candidate: MarketAnalysisCandidate["result"]): MarketAnalysisObjectiveWeights {
  const output = candidate.outputs;
  const summary = candidate.monthlySnapshots.at(-1);
  return {
    marketOpportunity: output.opportunityScore === null ? 0 : output.opportunityScore / 100,
    activation: summary?.activatedUsers ? clamp(summary.activatedUsers / Math.max(summary.signups ?? 1, 1), 0, 1) : 0,
    retention: summary?.activePaidUsers ? clamp((summary.activePaidUsers ?? 0) / Math.max(summary.newPaidUsers ?? 1, 1) / 10, 0, 1) : 0,
    paidConversion: clamp((summary?.newPaidUsers ?? 0) / Math.max(summary?.repeatUsers ?? 1, 1), 0, 1),
    margin: summary?.grossMarginPercent === null || summary?.grossMarginPercent === undefined ? 0 : clamp(summary.grossMarginPercent / 100, 0, 1),
    acquisitionFeasibility: clamp((100 - candidate.inputs.parameters.acquisitionDifficulty) / 100, 0, 1),
    evidenceQuality: clamp((100 - candidate.inputs.parameters.evidenceRisk) / 100, 0, 1),
    assumptionSafety: clamp(candidate.inputs.parameters.researchCompleteness / 100, 0, 1)
  };
}

function weightedScore(scores: MarketAnalysisObjectiveWeights, weights: MarketAnalysisObjectiveWeights) {
  return round((Object.keys(weights) as Array<keyof MarketAnalysisObjectiveWeights>).reduce((total, key) => total + scores[key] * weights[key], 0) * 100);
}

function mutate(parameters: AdvancedMarketParameterSet, keys: AdvancedMarketParameterKey[], seed: number, step: number): AdvancedMarketParameterSet {
  const next = { ...parameters };
  keys.forEach((key, index) => {
    if ((seed + index) % 3 !== 0) return;
    const direction = seedValue(seed + index * 17) > 0.5 ? 1 : -1;
    const value = next[key];
    const scale = key.includes("Rate") || key.includes("Share") || key.includes("Fit") || key.includes("Gap") || key.includes("Access") || key.includes("Availability") || key.includes("Mix") ? step : Math.max(1, Math.abs(value) * step);
    next[key] = value + direction * scale;
  });
  return next;
}

function candidateFrom(inputs: AdvancedMarketAnalysisInputs, parameters: AdvancedMarketParameterSet, id: string, parentId: string | null, generation: number, config: MarketAnalysisOptimizerConfig, seed: number): MarketAnalysisCandidate {
  const candidateInputs = { ...inputs, parameters };
  const rejectionReasons = validateAdvancedMarketParameters(parameters);
  const result = simulateAdvancedMarketAnalysis(candidateInputs, marketEvidenceRegistry, marketSegments, marketCompetition);
  const scores = objectiveScores(result);
  const status = rejectionReasons.length > 0 ? "rejected" : result.outputs.blocked || result.outputs.missingEvidence.length > 0 ? "needs-evidence" : "candidate";
  return { id, parentId, generation, parameters, status, score: weightedScore(scores, config.objectiveWeights), objectiveScores: scores, result, rejectionReasons: [...rejectionReasons, ...(result.outputs.blocked ? result.outputs.missingEvidence.slice(0, 4) : [])], lineage: { source: "maths-ai-bounded-search", deterministicSeed: seed } };
}

export async function optimizeAdvancedMarketAnalysis(inputs: AdvancedMarketAnalysisInputs, config: MarketAnalysisOptimizerConfig = DEFAULT_MARKET_ANALYSIS_OPTIMIZER_CONFIG, hooks?: { onProgress?: (report: MarketAnalysisOptimizationReport) => void; shouldStop?: () => boolean; waitIfPaused?: () => Promise<void> }): Promise<MarketAnalysisOptimizationReport> {
  let simulations = 0;
  let population = Array.from({ length: config.populationSize }, (_, index) => candidateFrom(inputs, index === 0 ? inputs.parameters : mutate(inputs.parameters, config.mutableParameters, index + 1, config.mutationStep), `MA-${String(index + 1).padStart(4, "0")}`, null, 0, config, index + 1));
  simulations = population.length;
  let best = [...population].sort((a, b) => b.score - a.score)[0] ?? null;
  const history: MarketAnalysisOptimizationReport["history"] = [];
  let stagnant = 0;
  for (let generation = 1; generation <= config.maxGenerations && simulations < config.maxSimulations; generation += 1) {
    if (hooks?.shouldStop?.()) break;
    await hooks?.waitIfPaused?.();
    const base = best ?? population[0];
    population = population.map((candidate, index) => index === 0 ? candidate : candidateFrom(inputs, mutate(base.parameters, config.mutableParameters, generation * 100 + index, config.mutationStep / (generation + 1)), `MA-${String(simulations + index + 1).padStart(4, "0")}`, base.id, generation, config, generation * 100 + index));
    simulations += population.length;
    const ranked = [...population].sort((a, b) => b.score - a.score);
    const nextBest = ranked[0] ?? best;
    if (nextBest && (!best || nextBest.score > best.score)) { best = nextBest; stagnant = 0; } else stagnant += 1;
    const report: MarketAnalysisOptimizationReport = { status: "running", generation, simulations, best, ranked, rejected: population.filter((candidate) => candidate.status === "rejected"), history, stopReason: "search in progress" };
    history.push({ generation, bestScore: best?.score ?? 0, averageScore: round(population.reduce((sum, candidate) => sum + candidate.score, 0) / Math.max(population.length, 1)), rejected: report.rejected.length });
    hooks?.onProgress?.(report);
    if ((best?.score ?? 0) >= config.targetScore) break;
    if (stagnant >= config.patience) break;
  }
  const ranked = [...population].sort((a, b) => b.score - a.score);
  const stopped = hooks?.shouldStop?.() ?? false;
  return { status: stopped ? "stopped" : "completed", generation: history.at(-1)?.generation ?? 0, simulations, best, ranked, rejected: population.filter((candidate) => candidate.status === "rejected"), history, stopReason: stopped ? "stopped by user" : (best?.score ?? 0) >= config.targetScore ? "target score reached" : "search budget or stagnation reached" };
}

export function serializeMarketAnalysisCandidate(candidate: MarketAnalysisCandidate) { return serializeAdvancedMarketAnalysis(candidate.result); }
