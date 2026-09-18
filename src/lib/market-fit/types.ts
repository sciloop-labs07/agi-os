export type MarketScenarioId = "conservative" | "base" | "optimistic";
export type EvidenceStatus = "assumption" | "simulated" | "measured" | "validated" | "rejected" | "needs-evidence";

export interface MarketAssumption<T extends string | number> {
  id: string;
  label: string;
  value: T;
  unit: string;
  status: EvidenceStatus;
  source: string;
  confidence: "low" | "medium" | "high";
  invalidationCondition: string;
}

export interface MarketScenario {
  id: MarketScenarioId;
  label: string;
  assumptions: {
    monthlyImpressions: number;
    visitRate: number;
    signupRate: number;
    activationRate: number;
    repeatSessionRate: number;
    paidConversionRate: number;
    monthlyChurnRate: number;
    proMonthlyPriceUsd: number;
    annualDiscountRate: number;
    freeVisualsPerUser: number;
    paidVisualsPerUser: number;
    requestsPerVisual: number;
    infrastructurePerUserUsd: number;
    supportPerPaidUserUsd: number;
    paymentFeeRate: number;
    cacUsd: number;
    monthlyOperatingBudgetUsd: number;
  };
}

export interface CostCatalogEntry {
  id: string;
  provider: string;
  model: string;
  currency: "USD";
  inputPricePerMillionTokensUsd: number | null;
  outputPricePerMillionTokensUsd: number | null;
  cachedInputPricePerMillionTokensUsd: number | null;
  embeddingPricePerMillionTokensUsd: number | null;
  imagePricePerGenerationUsd: number | null;
  sourceUrl: string | null;
  effectiveDate: string | null;
  lastVerifiedAt: string | null;
  status: "unverified" | "verified" | "retired";
}

export interface MarketFitOutputs {
  visits: number;
  signups: number;
  activatedUsers: number;
  repeatUsers: number;
  paidUsers: number;
  monthlyRevenueUsd: number;
  annualizedRevenueUsd: number;
  freeVisuals: number;
  paidVisuals: number;
  infrastructureCostUsd: number;
  supportCostUsd: number;
  paymentFeesUsd: number;
  acquisitionCostUsd: number;
  operatingBudgetUsd: number;
  verifiedApiCostUsd: number | null;
  totalKnownCostUsd: number;
  grossProfitUsd: number | null;
  grossMarginPercent: number | null;
  ltvUsd: number | null;
  ltvToCac: number | null;
  cacPaybackMonths: number | null;
  breakEvenMonths: number | null;
  apiCostStatus: "unavailable" | "available";
}

export interface MarketExperiment {
  id: string;
  name: string;
  hypothesis: string;
  target: string;
  successMetric: string;
  guardrailMetric: string;
  status: "planned" | "running" | "complete";
  evidenceStatus: EvidenceStatus;
}

export interface DistributionChannel {
  id: string;
  label: string;
  audience: string;
  format: string;
  learningSpeed: "fast" | "medium" | "slow";
  paidAcquisitionAllowed: false;
  nextTest: string;
}

export interface MarketFitReviewFinding {
  severity: "blocking" | "warning" | "info";
  message: string;
  action: string;
}

export interface MarketValidationIssue {
  field: string;
  message: string;
}

import type { EconomyInputs, EconomyOutput } from "../money-universe";

export type SimulationMode = "base" | "coupled";
export type ApiPriceStatus = "unverified" | "verified" | "retired";

export interface ApiCostModelEntry {
  id: string;
  provider: string;
  model: string;
  mixPercent: number;
  inputTokensPerVisual: number;
  outputTokensPerVisual: number;
  cachedInputTokensPerVisual: number;
  embeddingTokensPerVisual: number;
  imageGenerationsPerVisual: number;
  inputPricePerMillionTokensUsd: number | null;
  outputPricePerMillionTokensUsd: number | null;
  cachedInputPricePerMillionTokensUsd: number | null;
  embeddingPricePerMillionTokensUsd: number | null;
  imagePricePerGenerationUsd: number | null;
  storagePerVisualUsd: number;
  bandwidthPerVisualUsd: number;
  observabilityPerVisualUsd: number;
  sourceUrl: string | null;
  effectiveDate: string | null;
  verificationDate: string | null;
  currency: "USD";
  confidence: "low" | "medium" | "high";
  status: ApiPriceStatus;
}

export interface MacroBridgePolicy {
  demandTrustWeight: number;
  demandTradeWeight: number;
  demandStabilityWeight: number;
  demandMultiplierMin: number;
  demandMultiplierMax: number;
  retentionMultiplierMin: number;
  retentionMultiplierMax: number;
  costMultiplierMax: number;
  priceCapacityMultiplierMin: number;
  priceCapacityMultiplierMax: number;
  version: string;
}

export interface IntegratedMarketScenario {
  id: MarketScenarioId;
  label: string;
  macroInputs: EconomyInputs;
  productScenario: MarketScenario;
  apiCostInputs: { models: ApiCostModelEntry[] };
  bridgePolicy: MacroBridgePolicy;
  horizon: number;
  evidenceMetadata: { status: EvidenceStatus; source: string; confidence: "low" | "medium" | "high"; owner: string; date: string; invalidationCondition: string };
}

export interface MacroModifiers {
  demandIndex: number;
  demandMultiplier: number;
  retentionMultiplier: number;
  costMultiplier: number;
  priceCapacityMultiplier: number;
}

export interface SkyloopEconomicOverlay {
  adoptionSignal: number;
  knowledgeProductivitySignal: number;
  trustSignal: number;
  revenueSignal: number | null;
  costPressureSignal: number | null;
  confidence: "low" | "medium" | "high";
}

export interface ApiCostResult {
  available: boolean;
  reason: string | null;
  costPerVisualUsd: number | null;
  modelBreakdown: Array<{ model: string; weightedCostUsd: number; status: ApiPriceStatus }>;
}

export interface IntegratedMonthlySnapshot {
  month: number;
  macroInputs: EconomyInputs;
  macroOutputs: EconomyOutput;
  derivedMacroInputs: EconomyInputs;
  modifiers: MacroModifiers;
  product: MarketFitOutputs & { activeUsers: number; activePaidUsers: number; newPaidUsers: number; churnedUsers: number };
  apiCost: ApiCostResult;
  totalCostUsd: number | null;
  revenueUsd: number;
  grossProfitUsd: number | null;
  grossMarginPercent: number | null;
  ltvUsd: number | null;
  ltvToCac: number | null;
  cacPaybackMonths: number | null;
  runwayMonths: number | null;
  overlay: SkyloopEconomicOverlay;
  evidenceStatus: EvidenceStatus;
  warnings: string[];
}

export interface IntegratedSimulationResult {
  scenario: IntegratedMarketScenario;
  mode: SimulationMode;
  snapshots: IntegratedMonthlySnapshot[];
  findings: MarketFitReviewFinding[];
}

export interface IntegratedSensitivityResult {
  parameter: string;
  impact: number;
  direction: "positive" | "negative" | "mixed";
  metric: "grossProfitUsd" | "activePaidUsers";
}

export type MarketOptimizationParameter = "activationRate" | "repeatSessionRate" | "paidConversionRate" | "monthlyChurnRate" | "proMonthlyPriceUsd" | "freeVisualsPerUser" | "paidVisualsPerUser" | "requestsPerVisual" | "infrastructurePerUserUsd" | "supportPerPaidUserUsd" | "cacUsd" | "monthlyOperatingBudgetUsd" | "inputTokensPerVisual" | "outputTokensPerVisual" | "trust" | "productivity" | "resources" | "inflationSensitivity";

export interface MarketOptimizationParameters {
  activationRate: number;
  repeatSessionRate: number;
  paidConversionRate: number;
  monthlyChurnRate: number;
  proMonthlyPriceUsd: number;
  freeVisualsPerUser: number;
  paidVisualsPerUser: number;
  requestsPerVisual: number;
  infrastructurePerUserUsd: number;
  supportPerPaidUserUsd: number;
  cacUsd: number;
  monthlyOperatingBudgetUsd: number;
  inputTokensPerVisual: number;
  outputTokensPerVisual: number;
  trust: number;
  productivity: number;
  resources: number;
  inflationSensitivity: number;
}

export interface MarketObjectiveWeights {
  activation: number;
  retention: number;
  paidConversion: number;
  grossMargin: number;
  runway: number;
  apiEfficiency: number;
  evidenceQuality: number;
  assumptionRisk: number;
}

export type MarketCandidateStatus = "candidate" | "needs-evidence" | "rejected";

export interface MarketOptimizationConfig {
  populationSize: number;
  maxGenerations: number;
  maxSimulations: number;
  targetScore: number;
  patience: number;
  mutationStep: number;
  objectiveWeights: MarketObjectiveWeights;
}

export interface MarketOptimizationCandidate {
  id: string;
  parentId: string | null;
  scenarioId: MarketScenarioId;
  generation: number;
  parameters: MarketOptimizationParameters;
  mode: SimulationMode;
  status: MarketCandidateStatus;
  score: number;
  objectiveScores: MarketObjectiveWeights;
  summary: { finalActiveUsers: number; finalPaidUsers: number; finalRevenueUsd: number; finalGrossProfitUsd: number | null; apiCostAvailable: boolean; evidenceStatus: EvidenceStatus };
  constraintViolations: string[];
  rejectionReasons: string[];
  lineage: { source: "maths-ai-bounded-search"; createdAt: string; deterministicSeed: number };
}

export interface MarketOptimizationReport {
  scenarioId: MarketScenarioId;
  mode: SimulationMode;
  status: "idle" | "running" | "paused" | "completed" | "stopped";
  generation: number;
  simulations: number;
  best: MarketOptimizationCandidate | null;
  ranked: MarketOptimizationCandidate[];
  rejected: MarketOptimizationCandidate[];
  history: Array<{ generation: number; bestScore: number; averageScore: number; rejected: number }>;
  stopReason: string;
}
