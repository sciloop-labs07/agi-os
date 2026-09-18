import { calculateApiCostPerVisual, calculateMacroModifiers, createDefaultIntegratedMarketScenario, serializeIntegratedScenario, simulateIntegratedScenario } from "./integrated";
import type { ApiCostModelEntry } from "./types";

const verified = (id: string, mixPercent: number): ApiCostModelEntry => ({ id, provider: "Test", model: id, mixPercent, inputTokensPerVisual: 1000, outputTokensPerVisual: 1000, cachedInputTokensPerVisual: 200, embeddingTokensPerVisual: 100, imageGenerationsPerVisual: 0, inputPricePerMillionTokensUsd: 1, outputPricePerMillionTokensUsd: 2, cachedInputPricePerMillionTokensUsd: 0.5, embeddingPricePerMillionTokensUsd: 0.1, imagePricePerGenerationUsd: 0, storagePerVisualUsd: 0.001, bandwidthPerVisualUsd: 0.001, observabilityPerVisualUsd: 0.001, sourceUrl: "https://example.test", effectiveDate: "2026-01-01", verificationDate: "2026-01-02", currency: "USD", confidence: "high", status: "verified" });

export function runIntegratedMarketFitSelfTest() {
  const scenario = createDefaultIntegratedMarketScenario("base");
  const original = JSON.stringify(scenario.macroInputs);
  const blocked = simulateIntegratedScenario(scenario, "coupled");
  if (blocked.snapshots.length !== 36 || blocked.snapshots.some((snapshot) => snapshot.grossProfitUsd !== null)) throw new Error("unverified API pricing must block profit");
  if (JSON.stringify(scenario.macroInputs) !== original) throw new Error("macro inputs were mutated");
  const base = simulateIntegratedScenario(scenario, "base");
  if (JSON.stringify(base.snapshots.at(-1)?.derivedMacroInputs) === JSON.stringify(blocked.snapshots.at(-1)?.derivedMacroInputs)) throw new Error("base and coupled modes should diverge");
  const verifiedScenario = structuredClone(scenario);
  verifiedScenario.apiCostInputs.models = [verified("low", 0.7), verified("standard", 0.2), verified("premium", 0.1)];
  const cost = calculateApiCostPerVisual(verifiedScenario.apiCostInputs);
  if (!cost.available || cost.costPerVisualUsd === null) throw new Error("verified model mix should calculate API cost");
  if (simulateIntegratedScenario(verifiedScenario).snapshots.some((snapshot) => snapshot.grossProfitUsd === null)) throw new Error("verified prices should unlock profit");
  if (serializeIntegratedScenario(scenario) !== serializeIntegratedScenario(structuredClone(scenario))) throw new Error("serialization is not deterministic");
  const modifiers = calculateMacroModifiers({ inflation: 10, trade: 60, stability: 70, wealth: 50, inequality: 30, diagnosis: "" });
  if (modifiers.costMultiplier !== 1.1) throw new Error("cost multiplier formula changed");
  return true;
}
