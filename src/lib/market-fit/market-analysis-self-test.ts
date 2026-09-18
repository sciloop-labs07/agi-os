import { marketCompetition, marketEvidenceRegistry, marketSegments } from "./market-analysis-fixtures";
import { marketScenarios } from "./fixtures";
import { calculateMarketAnalysis, serializeMarketAnalysisResult, validateMarketEvidence } from "./market-analysis-engine";
import type { MarketAnalysisInputs } from "./market-analysis-types";

const baseInputs: MarketAnalysisInputs = {
  geography: "global", segmentId: "global-English-self-directed", mode: "base", scenarioId: "base", sourceStrictness: "standard", freshnessThresholdDays: 730,
  sourceIds: marketEvidenceRegistry.map((source) => source.id),
  assumptions: { population: 8000000000, targetSegmentShare: 0.2, internetAccess: 0.68, languageFit: 0.2, deviceFit: 0.9, geographicAvailability: 1, problemIncidence: 0.35, alternativeGap: 0.3, demandStrength: 55, accessFeasibility: 60, problemIntensity: 55, repeatUsePotential: 42, willingnessToPay: 35, distributionFeasibility: 40, competitionPressure: 60, acquisitionDifficulty: 55, evidenceRisk: 75 }
};

export function runMarketAnalysisSelfTest() {
  const first = calculateMarketAnalysis(baseInputs, marketEvidenceRegistry, marketSegments, marketCompetition, marketScenarios.base);
  const second = calculateMarketAnalysis(baseInputs, marketEvidenceRegistry, marketSegments, marketCompetition, marketScenarios.base);
  if (serializeMarketAnalysisResult(first) !== serializeMarketAnalysisResult(second)) throw new Error("market analysis serialization is not deterministic");
  if (first.outputs.reachablePopulation === null || first.outputs.potentialPaidUsers === null) throw new Error("base analysis should calculate simulated funnel outputs");
  const evidenceOnly = calculateMarketAnalysis({ ...baseInputs, mode: "evidence-only" }, marketEvidenceRegistry, marketSegments, marketCompetition, marketScenarios.base);
  if (!evidenceOnly.outputs.blocked || evidenceOnly.outputs.potentialPaidUsers !== null) throw new Error("evidence-only mode must block unsupported evidence");
  if (validateMarketEvidence({ ...marketEvidenceRegistry[0], sourceUrl: null, publicationDate: null }, "2026-09-18").length < 2) throw new Error("missing provenance was not blocked");
  const before = JSON.stringify(baseInputs);
  calculateMarketAnalysis(baseInputs, marketEvidenceRegistry, marketSegments, marketCompetition, marketScenarios.optimistic);
  if (JSON.stringify(baseInputs) !== before) throw new Error("market analysis mutated inputs");
  if (marketSegments.length < 2) throw new Error("segments must remain independently selectable");
  return { ok: true, checks: ["deterministic formulas", "evidence-only blocking", "provenance gates", "scenario isolation", "segment separation"] };
}
