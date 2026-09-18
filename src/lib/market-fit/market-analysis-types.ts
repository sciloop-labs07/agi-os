import type { MarketScenarioId } from "./types";

export type MarketSourceTier = "tier-1-authoritative" | "tier-2-primary" | "tier-3-discovery";
export type MarketEvidenceStatus = "assumption" | "imported" | "measured" | "validated" | "rejected" | "needs-evidence" | "stale";
export type MarketAnalysisMode = "conservative" | "base" | "optimistic" | "evidence-only";

export interface MarketEvidenceRecord {
  id: string;
  sourceName: string;
  sourceTier: MarketSourceTier;
  sourceUrl: string | null;
  publisher: string;
  metric: string;
  value: number | null;
  unit: string;
  geography: string;
  segment: string;
  language: string;
  periodStart: string | null;
  periodEnd: string | null;
  retrievedAt: string;
  publicationDate: string | null;
  methodology: string;
  license: string;
  status: MarketEvidenceStatus;
  confidence: "low" | "medium" | "high";
  owner: string;
  invalidationCondition: string;
  notes: string;
}

export interface MarketSegment {
  id: string;
  audience: string;
  geography: string;
  language: string;
  educationStage: string;
  deviceProfile: string;
  connectivityProfile: string;
  jobToBeDone: string;
  problemIntensity: number;
  accessConstraints: string[];
  willingnessToPayStatus: MarketEvidenceStatus;
  evidenceRefs: string[];
}

export interface MarketCompetitionRecord {
  id: string;
  name: string;
  category: string;
  sourceUrl: string | null;
  priceUsd: number | null;
  capability: string;
  audience: string;
  status: MarketEvidenceStatus;
  evidenceRefs: string[];
  notes: string;
}

export interface MarketAnalysisInputs {
  geography: string;
  segmentId: string;
  mode: MarketAnalysisMode;
  scenarioId: MarketScenarioId;
  sourceStrictness: "standard" | "strict";
  freshnessThresholdDays: number;
  sourceIds: string[];
  assumptions: {
    population: number;
    targetSegmentShare: number;
    internetAccess: number;
    languageFit: number;
    deviceFit: number;
    geographicAvailability: number;
    problemIncidence: number;
    alternativeGap: number;
    demandStrength: number;
    accessFeasibility: number;
    problemIntensity: number;
    repeatUsePotential: number;
    willingnessToPay: number;
    distributionFeasibility: number;
    competitionPressure: number;
    acquisitionDifficulty: number;
    evidenceRisk: number;
  };
}

export interface MarketAnalysisOutputs {
  eligiblePopulation: number | null;
  reachablePopulation: number | null;
  serviceablePopulation: number | null;
  potentialActivatedUsers: number | null;
  potentialPaidUsers: number | null;
  opportunityScore: number | null;
  opportunityComponents: Array<{ id: string; label: string; score: number | null; direction: "positive" | "negative"; reason: string; evidenceRefs: string[] }>;
  confidence: "low" | "medium" | "high";
  uncertaintyRange: { low: number | null; high: number | null };
  missingEvidence: string[];
  warnings: string[];
  strongestAssumption: string | null;
  largestUncertainty: string | null;
  blocked: boolean;
}

export interface MarketAnalysisResult {
  inputs: MarketAnalysisInputs;
  segment: MarketSegment | null;
  outputs: MarketAnalysisOutputs;
  sources: MarketEvidenceRecord[];
  competition: MarketCompetitionRecord[];
}

