import { marketCompetition, marketEvidenceRegistry, marketSegments } from "./market-analysis-fixtures";
import { MARKET_ANALYSIS_PARAMETER_DEFINITIONS, createDefaultAdvancedInputs } from "./market-analysis-advanced-fixtures";
import { serializeAdvancedMarketAnalysis, simulateAdvancedMarketAnalysis, validateAdvancedMarketParameters } from "./market-analysis-advanced-engine";
import { DEFAULT_MARKET_ANALYSIS_OPTIMIZER_CONFIG, optimizeAdvancedMarketAnalysis } from "./market-analysis-optimizer";

export async function runAdvancedMarketAnalysisSelfTest() {
  if (MARKET_ANALYSIS_PARAMETER_DEFINITIONS.length !== 54) throw new Error(`expected 54 parameters, received ${MARKET_ANALYSIS_PARAMETER_DEFINITIONS.length}`);
  const inputs = { ...createDefaultAdvancedInputs("base"), sourceIds: marketEvidenceRegistry.map((source) => source.id) };
  const result12 = simulateAdvancedMarketAnalysis({ ...inputs, horizon: 12 }, marketEvidenceRegistry, marketSegments, marketCompetition);
  const result60 = simulateAdvancedMarketAnalysis({ ...inputs, horizon: 60 }, marketEvidenceRegistry, marketSegments, marketCompetition);
  if (result12.monthlySnapshots.length !== 12 || result60.monthlySnapshots.length !== 60) throw new Error("supported horizons must produce exact monthly snapshots");
  if (serializeAdvancedMarketAnalysis(result12) !== serializeAdvancedMarketAnalysis(simulateAdvancedMarketAnalysis({ ...inputs, horizon: 12 }, marketEvidenceRegistry, marketSegments, marketCompetition))) throw new Error("advanced serialization must be deterministic");
  if (!validateAdvancedMarketParameters({ ...inputs.parameters, activationRate: 2 }).some((issue) => issue.includes("Activation rate"))) throw new Error("invalid fractions must be rejected");
  if (!validateAdvancedMarketParameters({ ...inputs.parameters, modelMixLow: 0.5 }).some((issue) => issue.includes("Model mix"))) throw new Error("model mixes must total 100%");
  const evidenceOnly = simulateAdvancedMarketAnalysis({ ...inputs, mode: "evidence-only" }, marketEvidenceRegistry, marketSegments, marketCompetition);
  if (!evidenceOnly.outputs.blocked || evidenceOnly.monthlySnapshots.some((snapshot) => snapshot.evidenceStatus !== "blocked")) throw new Error("evidence-only mode must block unsupported outputs");
  const original = JSON.stringify(inputs);
  simulateAdvancedMarketAnalysis(inputs, marketEvidenceRegistry, marketSegments, marketCompetition);
  if (JSON.stringify(inputs) !== original) throw new Error("simulation mutated inputs");
  const optimizer = await optimizeAdvancedMarketAnalysis(inputs, { ...DEFAULT_MARKET_ANALYSIS_OPTIMIZER_CONFIG, populationSize: 3, maxGenerations: 2, maxSimulations: 8 });
  if (!optimizer.ranked.length || !optimizer.history.length) throw new Error("advanced optimizer did not produce ranked history");
  return { ok: true, checks: ["54 parameter definitions", "12/60 month horizons", "deterministic serialization", "validation gates", "evidence-only blocking", "input isolation", "optimizer ranking"] };
}

