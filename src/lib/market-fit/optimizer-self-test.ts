import { applyOptimizationParameters, DEFAULT_MARKET_OPTIMIZATION_CONFIG, evaluateMarketCandidate, optimizeMarketScenario, parametersFromScenario, serializeMarketOptimizationCandidate, validateOptimizationCandidate } from "./optimizer";
import { createDefaultIntegratedMarketScenario } from "./integrated";

export async function runMarketOptimizationSelfTest() {
  const scenario = createDefaultIntegratedMarketScenario("base");
  const original = JSON.stringify(scenario);
  const parameters = parametersFromScenario(scenario);
  const candidate = evaluateMarketCandidate(scenario, parameters, "M0001", null, 0, "coupled");
  if (candidate.status !== "needs-evidence") throw new Error("unverified pricing should produce a needs-evidence candidate");
  if (validateOptimizationCandidate(scenario, { ...parameters, activationRate: 2 }).length === 0) throw new Error("invalid rates must be rejected");
  const mutated = { ...parameters, activationRate: 0.5 };
  const isolated = applyOptimizationParameters(scenario, mutated);
  if (JSON.stringify(scenario) !== original || isolated.productScenario.assumptions.activationRate === scenario.productScenario.assumptions.activationRate) throw new Error("candidate application must be isolated");
  const report = await optimizeMarketScenario(scenario, "coupled", { ...DEFAULT_MARKET_OPTIMIZATION_CONFIG, populationSize: 4, maxGenerations: 2, maxSimulations: 12 });
  if (!report.ranked.length || report.history.length === 0) throw new Error("optimizer did not produce a ranked history");
  if (serializeMarketOptimizationCandidate(report.ranked[0]) !== serializeMarketOptimizationCandidate(structuredClone(report.ranked[0]))) throw new Error("candidate serialization is not deterministic");
  return true;
}
