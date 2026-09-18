import { simulateEconomy, type EconomyInputs, type EconomyOutput } from "../money-universe";
import { calculateMarketFitScenario, validateMarketScenario } from "./engine";
import { marketScenarios } from "./fixtures";
import type { ApiCostModelEntry, ApiCostResult, IntegratedMarketScenario, IntegratedMonthlySnapshot, IntegratedSensitivityResult, IntegratedSimulationResult, MacroBridgePolicy, MacroModifiers, MarketFitOutputs, MarketFitReviewFinding, MarketScenarioId, SimulationMode, SkyloopEconomicOverlay } from "./types";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round = (value: number) => Math.round(value * 100) / 100;
const DEFAULT_POLICY: MacroBridgePolicy = { demandTrustWeight: 0.4, demandTradeWeight: 0.35, demandStabilityWeight: 0.25, demandMultiplierMin: 0.75, demandMultiplierMax: 1.25, retentionMultiplierMin: 0.85, retentionMultiplierMax: 1.15, costMultiplierMax: 1.8, priceCapacityMultiplierMin: 0.85, priceCapacityMultiplierMax: 1.15, version: "bridge-v1" };

const unverifiedModel = (id: string, model: string, mixPercent: number): ApiCostModelEntry => ({ id, provider: "Provider catalog", model, mixPercent, inputTokensPerVisual: 1200, outputTokensPerVisual: 900, cachedInputTokensPerVisual: 0, embeddingTokensPerVisual: 0, imageGenerationsPerVisual: 0, inputPricePerMillionTokensUsd: null, outputPricePerMillionTokensUsd: null, cachedInputPricePerMillionTokensUsd: null, embeddingPricePerMillionTokensUsd: null, imagePricePerGenerationUsd: null, storagePerVisualUsd: 0.001, bandwidthPerVisualUsd: 0.001, observabilityPerVisualUsd: 0.001, sourceUrl: null, effectiveDate: null, verificationDate: null, currency: "USD", confidence: "low", status: "unverified" });

export function createDefaultIntegratedMarketScenario(id: MarketScenarioId = "base"): IntegratedMarketScenario {
  return { id, label: marketScenarios[id].label, macroInputs: { population: 72, resources: 68, trust: 58, productivity: 62, moneySupply: 70, taxRate: 24 }, productScenario: structuredClone(marketScenarios[id]), apiCostInputs: { models: [unverifiedModel("pending-low", "Awaiting official verification", 1)] }, bridgePolicy: { ...DEFAULT_POLICY }, horizon: 36, evidenceMetadata: { status: "simulated", source: "local deterministic fixture", confidence: "low", owner: "Skyloop research", date: "2026-09-18", invalidationCondition: "Replace with reviewed macro, product, and provider observations." } };
}

export function calculateMacroModifiers(output: EconomyOutput, policy: MacroBridgePolicy = DEFAULT_POLICY, trust = output.stability): MacroModifiers {
  const demandIndex = clamp((policy.demandTrustWeight * trust + policy.demandTradeWeight * output.trade + policy.demandStabilityWeight * output.stability) / 100, 0, 1);
  return { demandIndex: round(demandIndex), demandMultiplier: round(clamp(0.75 + demandIndex * 0.5, policy.demandMultiplierMin, policy.demandMultiplierMax)), retentionMultiplier: round(clamp(0.85 + output.stability / 100 * 0.3, policy.retentionMultiplierMin, policy.retentionMultiplierMax)), costMultiplier: round(clamp(1 + Math.max(output.inflation, 0) * 0.01, 1, policy.costMultiplierMax)), priceCapacityMultiplier: round(clamp(0.85 + output.wealth / 100 * 0.3, policy.priceCapacityMultiplierMin, policy.priceCapacityMultiplierMax)) };
}

function modelCost(model: ApiCostModelEntry): number | null {
  const required = [model.inputPricePerMillionTokensUsd, model.outputPricePerMillionTokensUsd, model.cachedInputPricePerMillionTokensUsd, model.embeddingPricePerMillionTokensUsd, model.imagePricePerGenerationUsd];
  if (model.status !== "verified" || required.some((value) => value === null) || model.mixPercent < 0) return null;
  const uncached = Math.max(model.inputTokensPerVisual - model.cachedInputTokensPerVisual, 0);
  return round(uncached * model.inputPricePerMillionTokensUsd! / 1_000_000 + model.cachedInputTokensPerVisual * model.cachedInputPricePerMillionTokensUsd! / 1_000_000 + model.outputTokensPerVisual * model.outputPricePerMillionTokensUsd! / 1_000_000 + model.embeddingTokensPerVisual * model.embeddingPricePerMillionTokensUsd! / 1_000_000 + model.imageGenerationsPerVisual * model.imagePricePerGenerationUsd! + model.storagePerVisualUsd + model.bandwidthPerVisualUsd + model.observabilityPerVisualUsd);
}

export function calculateApiCostPerVisual(inputs: { models: ApiCostModelEntry[] }): ApiCostResult {
  const totalMix = inputs.models.reduce((sum, model) => sum + model.mixPercent, 0);
  if (!inputs.models.length || Math.abs(totalMix - 1) > 0.001) return { available: false, reason: "Model mix must contain entries totaling 100%.", costPerVisualUsd: null, modelBreakdown: inputs.models.map((model) => ({ model: model.model, weightedCostUsd: 0, status: model.status })) };
  const breakdown = inputs.models.map((model) => { const cost = modelCost(model); return { model: model.model, weightedCostUsd: cost === null ? 0 : round(cost * model.mixPercent), status: model.status }; });
  const missing = inputs.models.find((model) => modelCost(model) === null);
  if (missing) return { available: false, reason: `Verified pricing is missing for ${missing.model}.`, costPerVisualUsd: null, modelBreakdown: breakdown };
  return { available: true, reason: null, costPerVisualUsd: round(breakdown.reduce((sum, item) => sum + item.weightedCostUsd, 0)), modelBreakdown: breakdown };
}

function adjustedProduct(scenario: IntegratedMarketScenario, modifiers: MacroModifiers): MarketFitOutputs {
  const base = scenario.productScenario;
  const a = base.assumptions;
  const adjusted = { ...base, assumptions: { ...a, monthlyImpressions: a.monthlyImpressions * modifiers.demandMultiplier, repeatSessionRate: clamp(a.repeatSessionRate * modifiers.retentionMultiplier, 0, 1), paidConversionRate: clamp(a.paidConversionRate * modifiers.priceCapacityMultiplier, 0, 1), infrastructurePerUserUsd: a.infrastructurePerUserUsd * modifiers.costMultiplier, supportPerPaidUserUsd: a.supportPerPaidUserUsd * modifiers.costMultiplier, monthlyOperatingBudgetUsd: a.monthlyOperatingBudgetUsd * modifiers.costMultiplier } };
  return calculateMarketFitScenario(adjusted, []);
}

export function simulateIntegratedScenario(scenario: IntegratedMarketScenario, mode: SimulationMode = "coupled"): IntegratedSimulationResult {
  const snapshots: IntegratedMonthlySnapshot[] = [];
  let current: EconomyInputs = { ...scenario.macroInputs };
  let activeUsers = 0;
  let activePaidUsers = 0;
  for (let month = 1; month <= scenario.horizon; month += 1) {
    const macroOutputs = simulateEconomy(current);
    const modifiers = calculateMacroModifiers(macroOutputs, scenario.bridgePolicy, current.trust);
    const product = adjustedProduct(scenario, modifiers);
    const apiCost = calculateApiCostPerVisual(scenario.apiCostInputs);
    const newPaidUsers = product.paidUsers;
    const churnedUsers = Math.floor(activeUsers * scenario.productScenario.assumptions.monthlyChurnRate);
    activeUsers = Math.max(0, activeUsers + product.activatedUsers - churnedUsers);
    activePaidUsers = Math.max(0, activePaidUsers + newPaidUsers - Math.floor(activePaidUsers * scenario.productScenario.assumptions.monthlyChurnRate));
    const apiTotal = apiCost.costPerVisualUsd === null ? null : round((product.freeVisuals + product.paidVisuals) * scenario.productScenario.assumptions.requestsPerVisual * apiCost.costPerVisualUsd);
    const totalCostUsd = apiTotal === null ? null : round(product.totalKnownCostUsd + apiTotal);
    const grossProfitUsd = totalCostUsd === null ? null : round(product.monthlyRevenueUsd - totalCostUsd);
    const grossMarginPercent = grossProfitUsd === null || product.monthlyRevenueUsd === 0 ? null : round(grossProfitUsd / product.monthlyRevenueUsd * 100);
    const retentionRate = product.activatedUsers === 0 ? 0 : product.repeatUsers / product.activatedUsers;
    const overlay: SkyloopEconomicOverlay = { adoptionSignal: round(product.activatedUsers / Math.max(scenario.productScenario.assumptions.monthlyImpressions, 1)), knowledgeProductivitySignal: round(clamp(product.activatedUsers / Math.max(scenario.productScenario.assumptions.monthlyImpressions, 1) * 10, 0, 10)), trustSignal: round(clamp(retentionRate * 10 - scenario.productScenario.assumptions.monthlyChurnRate * 5, -10, 10)), revenueSignal: grossProfitUsd === null ? null : round(clamp(grossProfitUsd / Math.max(product.operatingBudgetUsd, 1), -10, 10)), costPressureSignal: apiCost.costPerVisualUsd === null ? null : round(clamp(apiCost.costPerVisualUsd * 10, 0, 10)), confidence: apiCost.available ? "medium" : "low" };
    const derivedMacroInputs: EconomyInputs = { ...current, productivity: clamp(current.productivity + overlay.knowledgeProductivitySignal, 0, 100), trust: clamp(current.trust + overlay.trustSignal, 0, 100) };
    const warnings = apiCost.available ? ["All outputs remain simulated; API prices are verified only for this local fixture."] : [apiCost.reason ?? "API pricing is unavailable.", "Gross profit and break-even are blocked until every required price is verified."];
    snapshots.push({ month, macroInputs: { ...current }, macroOutputs, derivedMacroInputs, modifiers, product: { ...product, verifiedApiCostUsd: apiTotal, apiCostStatus: apiCost.available ? "available" : "unavailable", activeUsers, activePaidUsers, newPaidUsers, churnedUsers }, apiCost, totalCostUsd, revenueUsd: product.monthlyRevenueUsd, grossProfitUsd, grossMarginPercent, ltvUsd: product.ltvUsd, ltvToCac: product.ltvToCac, cacPaybackMonths: product.cacPaybackMonths, runwayMonths: grossProfitUsd === null ? null : grossProfitUsd >= 0 ? null : round(product.operatingBudgetUsd / Math.abs(grossProfitUsd)), overlay, evidenceStatus: apiCost.available ? "simulated" : "needs-evidence", warnings });
    current = mode === "coupled" ? derivedMacroInputs : { ...scenario.macroInputs };
  }
  return { scenario, mode, snapshots, findings: createIntegratedReviewFindings(scenario, snapshots) };
}

export function createIntegratedReviewFindings(scenario: IntegratedMarketScenario, snapshots: IntegratedMonthlySnapshot[]): MarketFitReviewFinding[] {
  const findings: MarketFitReviewFinding[] = [];
  const apiBlocked = snapshots.some((snapshot) => !snapshot.apiCost.available);
  if (validateMarketScenario(scenario.productScenario).length) findings.push({ severity: "blocking", message: "Product inputs contain invalid values.", action: "Correct rates and non-negative assumptions." });
  if (apiBlocked) findings.push({ severity: "blocking", message: "Unverified API pricing blocks gross profit, margin, and break-even claims.", action: "Add dated official provider prices and verify every model in the mix." });
  if (scenario.horizon !== 36) findings.push({ severity: "warning", message: "The integrated horizon is not the Version 1 standard of 36 months.", action: "Use 36 monthly snapshots for comparable decisions." });
  findings.push({ severity: "info", message: "Money Universe remains the macro source of truth; the Skyloop overlay is simulated and reversible.", action: "Replace assumptions with measured observations through human review." });
  return findings;
}

export function calculateIntegratedSensitivity(scenario: IntegratedMarketScenario, mode: SimulationMode = "coupled"): IntegratedSensitivityResult[] {
  const baseline = simulateIntegratedScenario(scenario, mode).snapshots.at(-1)!;
  const fields = ["activationRate", "repeatSessionRate", "paidConversionRate", "monthlyChurnRate", "proMonthlyPriceUsd", "freeVisualsPerUser", "paidVisualsPerUser", "monthlyOperatingBudgetUsd"] as const;
  return fields.map((parameter) => { const next = structuredClone(scenario); const value = next.productScenario.assumptions[parameter]; next.productScenario.assumptions[parameter] = parameter === "monthlyChurnRate" ? Math.max(0, value * 0.9) : value * 1.1; const changed = simulateIntegratedScenario(next, mode).snapshots.at(-1)!; const metric = baseline.grossProfitUsd !== null && changed.grossProfitUsd !== null ? "grossProfitUsd" : "activePaidUsers"; const before = metric === "grossProfitUsd" ? baseline.grossProfitUsd! : baseline.product.activePaidUsers; const after = metric === "grossProfitUsd" ? changed.grossProfitUsd! : changed.product.activePaidUsers; return { parameter, impact: round(after - before), direction: after > before ? "positive" : after < before ? "negative" : "mixed", metric }; });
}

export function serializeIntegratedScenario(scenario: IntegratedMarketScenario): string {
  const sort = (value: unknown): unknown => Array.isArray(value) ? value.map(sort) : value && typeof value === "object" ? Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, sort(item)])) : value;
  return JSON.stringify(sort(scenario));
}
