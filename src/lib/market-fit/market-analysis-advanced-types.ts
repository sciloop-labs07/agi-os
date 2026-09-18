import type { MarketAnalysisMode, MarketCompetitionRecord, MarketEvidenceRecord, MarketSegment } from "./market-analysis-types";
import type { MarketScenarioId, SimulationMode } from "./types";

export type MarketAnalysisHorizon = 12 | 24 | 36 | 60;
export type AdvancedParameterKind = "fraction" | "score" | "count" | "currency" | "integer" | "days";

export type AdvancedMarketParameterKey =
  | "population" | "educationStageShare" | "targetSegmentShare" | "internetAccess" | "mobileAccess" | "desktopAccess" | "languageFit" | "deviceFit" | "geographicAvailability"
  | "problemIncidence" | "problemIntensity" | "searchSignal" | "alternativeGap" | "urgency" | "repeatUsePotential" | "willingnessToPay" | "willingnessToPayConfidence"
  | "monthlyImpressions" | "visitRate" | "signupRate" | "activationRate" | "repeatSessionRate" | "paidConversionRate" | "monthlyChurnRate" | "referralRate"
  | "proMonthlyPriceUsd" | "annualDiscountRate" | "freeVisualsPerUser" | "paidVisualsPerUser" | "requestsPerVisual" | "cacUsd" | "paymentFeeRate" | "monthlyOperatingBudgetUsd"
  | "modelMixLow" | "modelMixStandard" | "modelMixPremium" | "inputTokensPerVisual" | "outputTokensPerVisual" | "cachedInputTokensPerVisual" | "embeddingTokensPerVisual" | "mediaGenerationsPerVisual" | "infrastructurePerUserUsd" | "observabilityPerVisualUsd"
  | "competitionPressure" | "switchingFriction" | "competitorPriceRangeUsd" | "distributionReach" | "channelActivationRate" | "acquisitionDifficulty"
  | "freshnessThresholdDays" | "minimumConfidenceScore" | "evidenceRisk" | "sourceStrictnessScore" | "researchCompleteness";

export type AdvancedParameterGroup = "market-context" | "demand" | "funnel" | "pricing" | "api" | "competition" | "evidence";

export interface AdvancedParameterDefinition {
  key: AdvancedMarketParameterKey;
  label: string;
  group: AdvancedParameterGroup;
  kind: AdvancedParameterKind;
  unit: string;
  min: number;
  max: number;
  step: number;
  description: string;
  sourceHint: string;
}

export type AdvancedMarketParameterSet = Record<AdvancedMarketParameterKey, number>;

export interface AdvancedMarketAnalysisInputs {
  schemaVersion: "market-analysis-v2";
  geography: string;
  segmentId: string;
  scenarioId: MarketScenarioId;
  mode: MarketAnalysisMode;
  simulationMode: SimulationMode;
  horizon: MarketAnalysisHorizon;
  sourceStrictness: "standard" | "strict";
  sourceIds: string[];
  parameters: AdvancedMarketParameterSet;
}

export interface MarketFormulaTrace {
  eligiblePopulation: string;
  reachablePopulation: string;
  serviceablePopulation: string;
  activatedUsers: string;
  paidUsers: string;
}

export interface AdvancedMonthlyMarketSnapshot {
  month: number;
  macroDemandMultiplier: number;
  macroRetentionMultiplier: number;
  costMultiplier: number;
  impressions: number | null;
  visits: number | null;
  signups: number | null;
  activatedUsers: number | null;
  repeatUsers: number | null;
  newPaidUsers: number | null;
  activePaidUsers: number | null;
  churnedUsers: number | null;
  revenueUsd: number | null;
  apiCostUsd: number | null;
  knownCostUsd: number | null;
  grossProfitUsd: number | null;
  grossMarginPercent: number | null;
  runwayMonths: number | null;
  evidenceStatus: "simulated" | "needs-evidence" | "blocked";
}

export interface AdvancedMarketAnalysisResult {
  inputs: AdvancedMarketAnalysisInputs;
  segment: MarketSegment | null;
  sources: MarketEvidenceRecord[];
  competition: MarketCompetitionRecord[];
  formulaTrace: MarketFormulaTrace;
  monthlySnapshots: AdvancedMonthlyMarketSnapshot[];
  outputs: {
    eligiblePopulation: number | null;
    reachablePopulation: number | null;
    serviceablePopulation: number | null;
    potentialActivatedUsers: number | null;
    potentialPaidUsers: number | null;
    opportunityScore: number | null;
    uncertaintyRange: { low: number | null; high: number | null };
    confidence: "low" | "medium" | "high";
    strongestAssumption: AdvancedMarketParameterKey | null;
    largestUncertainty: string | null;
    missingEvidence: string[];
    warnings: string[];
    blocked: boolean;
  };
}

export type MarketAnalysisCandidateStatus = "candidate" | "needs-evidence" | "rejected";

export interface MarketAnalysisObjectiveWeights {
  marketOpportunity: number;
  activation: number;
  retention: number;
  paidConversion: number;
  margin: number;
  acquisitionFeasibility: number;
  evidenceQuality: number;
  assumptionSafety: number;
}

export interface MarketAnalysisOptimizerConfig {
  populationSize: number;
  maxGenerations: number;
  maxSimulations: number;
  targetScore: number;
  patience: number;
  mutationStep: number;
  objectiveWeights: MarketAnalysisObjectiveWeights;
  mutableParameters: AdvancedMarketParameterKey[];
}

export interface MarketAnalysisCandidate {
  id: string;
  parentId: string | null;
  generation: number;
  parameters: AdvancedMarketParameterSet;
  status: MarketAnalysisCandidateStatus;
  score: number;
  objectiveScores: MarketAnalysisObjectiveWeights;
  result: AdvancedMarketAnalysisResult;
  rejectionReasons: string[];
  lineage: { source: "maths-ai-bounded-search"; deterministicSeed: number };
}

export interface MarketAnalysisOptimizationReport {
  status: "idle" | "running" | "paused" | "completed" | "stopped";
  generation: number;
  simulations: number;
  best: MarketAnalysisCandidate | null;
  ranked: MarketAnalysisCandidate[];
  rejected: MarketAnalysisCandidate[];
  history: Array<{ generation: number; bestScore: number; averageScore: number; rejected: number }>;
  stopReason: string;
}

export interface MarketAnalysisEvidencePackage {
  schemaVersion: "market-analysis-package-v2";
  savedAt: string;
  inputs: AdvancedMarketAnalysisInputs;
  sources: MarketEvidenceRecord[];
  result: AdvancedMarketAnalysisResult;
  reviewNotes: string[];
}

