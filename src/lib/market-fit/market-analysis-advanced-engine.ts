import { createDefaultIntegratedMarketScenario, simulateIntegratedScenario } from "./integrated";
import { calculateMarketAnalysis, validateMarketEvidence, validateMarketSegment } from "./market-analysis-engine";
import type { MarketAnalysisInputs, MarketCompetitionRecord, MarketEvidenceRecord, MarketSegment } from "./market-analysis-types";
import { MARKET_ANALYSIS_PARAMETER_DEFINITIONS } from "./market-analysis-advanced-fixtures";
import type { AdvancedMarketAnalysisInputs, AdvancedMarketAnalysisResult, AdvancedMarketParameterKey, AdvancedMarketParameterSet, AdvancedMonthlyMarketSnapshot, MarketFormulaTrace } from "./market-analysis-advanced-types";
import type { MarketScenario } from "./types";

const round = (value: number) => Math.round(value * 100) / 100;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const integer = (value: number) => Math.max(0, Math.floor(value));
const fractionFields = new Set(MARKET_ANALYSIS_PARAMETER_DEFINITIONS.filter((definition) => definition.kind === "fraction").map((definition) => definition.key));
const scoreFields = new Set(MARKET_ANALYSIS_PARAMETER_DEFINITIONS.filter((definition) => definition.kind === "score").map((definition) => definition.key));
const groupBy = <T,>(items: T[], key: (item: T) => string) => items.reduce<Record<string, T[]>>((groups, item) => { const group = key(item); (groups[group] ??= []).push(item); return groups; }, {});

export function validateAdvancedMarketParameters(parameters: AdvancedMarketParameterSet): string[] {
  const issues: string[] = [];
  for (const definition of MARKET_ANALYSIS_PARAMETER_DEFINITIONS) {
    const value = parameters[definition.key];
    if (!Number.isFinite(value)) issues.push(`${definition.label} must be a finite number.`);
    else if (value < definition.min || value > definition.max) issues.push(`${definition.label} must be between ${definition.min} and ${definition.max} ${definition.unit}.`);
    if (fractionFields.has(definition.key) && (value < 0 || value > 1)) issues.push(`${definition.label} must be a fraction between 0 and 1.`);
    if (scoreFields.has(definition.key) && (value < 0 || value > 100)) issues.push(`${definition.label} must be a score between 0 and 100.`);
  }
  const mix = parameters.modelMixLow + parameters.modelMixStandard + parameters.modelMixPremium;
  if (Math.abs(mix - 1) > 0.0001) issues.push(`Model mix must total 100%; current total is ${round(mix * 100)}%.`);
  return [...new Set(issues)];
}

function applyAdvancedParametersToScenario(inputs: AdvancedMarketAnalysisInputs): MarketScenario {
  const source = createDefaultIntegratedMarketScenario(inputs.scenarioId).productScenario;
  const p = inputs.parameters;
  return { ...source, assumptions: { ...source.assumptions, monthlyImpressions: p.monthlyImpressions, visitRate: p.visitRate, signupRate: p.signupRate, activationRate: p.activationRate, repeatSessionRate: p.repeatSessionRate, paidConversionRate: p.paidConversionRate, monthlyChurnRate: p.monthlyChurnRate, proMonthlyPriceUsd: p.proMonthlyPriceUsd, annualDiscountRate: p.annualDiscountRate, freeVisualsPerUser: p.freeVisualsPerUser, paidVisualsPerUser: p.paidVisualsPerUser, requestsPerVisual: p.requestsPerVisual, infrastructurePerUserUsd: p.infrastructurePerUserUsd, paymentFeeRate: p.paymentFeeRate, cacUsd: p.cacUsd, monthlyOperatingBudgetUsd: p.monthlyOperatingBudgetUsd } };
}

function createLegacyInputs(inputs: AdvancedMarketAnalysisInputs): MarketAnalysisInputs {
  const p = inputs.parameters;
  return { geography: inputs.geography, segmentId: inputs.segmentId, mode: inputs.mode, scenarioId: inputs.scenarioId, sourceStrictness: inputs.sourceStrictness, freshnessThresholdDays: p.freshnessThresholdDays, sourceIds: inputs.sourceIds, assumptions: { population: p.population, targetSegmentShare: p.targetSegmentShare * p.educationStageShare, internetAccess: p.internetAccess, languageFit: p.languageFit, deviceFit: p.deviceFit, geographicAvailability: p.geographicAvailability, problemIncidence: p.problemIncidence, alternativeGap: p.alternativeGap, demandStrength: clamp((p.searchSignal + p.urgency) / 2, 0, 100), accessFeasibility: clamp((p.internetAccess + p.deviceFit + p.languageFit) / 3 * 100, 0, 100), problemIntensity: p.problemIntensity, repeatUsePotential: p.repeatUsePotential, willingnessToPay: p.willingnessToPay, distributionFeasibility: p.distributionReach, competitionPressure: p.competitionPressure, acquisitionDifficulty: p.acquisitionDifficulty, evidenceRisk: p.evidenceRisk } };
}

function createTrace(p: AdvancedMarketParameterSet): MarketFormulaTrace {
  return { eligiblePopulation: `${p.population} × ${p.educationStageShare} × ${p.targetSegmentShare}`, reachablePopulation: `eligible × ${p.internetAccess} × ${p.languageFit} × ${p.deviceFit} × ${p.geographicAvailability}`, serviceablePopulation: `reachable × ${p.problemIncidence} × ${p.alternativeGap}`, activatedUsers: `serviceable × visitRate(${p.visitRate}) × signupRate(${p.signupRate}) × activationRate(${p.activationRate})`, paidUsers: `activated × repeatSessionRate(${p.repeatSessionRate}) × paidConversionRate(${p.paidConversionRate})` };
}

function emptySnapshot(month: number, status: "blocked" | "needs-evidence"): AdvancedMonthlyMarketSnapshot {
  return { month, macroDemandMultiplier: 1, macroRetentionMultiplier: 1, costMultiplier: 1, impressions: null, visits: null, signups: null, activatedUsers: null, repeatUsers: null, newPaidUsers: null, activePaidUsers: null, churnedUsers: null, revenueUsd: null, apiCostUsd: null, knownCostUsd: null, grossProfitUsd: null, grossMarginPercent: null, runwayMonths: null, evidenceStatus: status };
}

function calculateOpportunity(inputs: AdvancedMarketAnalysisInputs, sources: MarketEvidenceRecord[], segments: MarketSegment[], competition: MarketCompetitionRecord[], scenario: MarketScenario, now: string) {
  const legacy = calculateMarketAnalysis(createLegacyInputs(inputs), sources, segments, competition, scenario, now);
  return legacy.outputs;
}

export function simulateAdvancedMarketAnalysis(inputs: AdvancedMarketAnalysisInputs, sources: MarketEvidenceRecord[], segments: MarketSegment[], competition: MarketCompetitionRecord[], now = "2026-09-18"): AdvancedMarketAnalysisResult {
  const segment = segments.find((item) => item.id === inputs.segmentId) ?? null;
  const validationIssues = validateAdvancedMarketParameters(inputs.parameters);
  const sourceIssues = sources.filter((source) => inputs.sourceIds.includes(source.id)).flatMap((source) => validateMarketEvidence(source, now, inputs.parameters.freshnessThresholdDays).map((issue) => `${source.metric}: ${issue}`));
  const segmentIssues = validateMarketSegment(segment);
  const selectedSources = sources.filter((source) => inputs.sourceIds.includes(source.id));
  const legacyScenario = applyAdvancedParametersToScenario(inputs);
  const legacyOutputs = calculateOpportunity(inputs, sources, segments, competition, legacyScenario, now);
  const findings = [...validationIssues, ...sourceIssues, ...segmentIssues];
  if (competition.every((item) => item.status !== "validated" || !item.sourceUrl)) findings.push("competition: first-party evidence is required");
  if (inputs.mode === "evidence-only") selectedSources.filter((source) => source.status === "assumption" || source.status === "needs-evidence" || !source.publicationDate).forEach((source) => findings.push(`${source.metric}: evidence-only mode requires a dated imported or validated source`));
  const blocked = inputs.sourceStrictness === "strict" && findings.length > 0 || inputs.mode === "evidence-only" && findings.length > 0;
  const macroScenario = createDefaultIntegratedMarketScenario(inputs.scenarioId);
  const macroSnapshots = simulateIntegratedScenario(macroScenario, inputs.simulationMode).snapshots;
  const p = inputs.parameters;
  const snapshots: AdvancedMonthlyMarketSnapshot[] = [];
  let activePaid = 0;
  let runway = p.monthlyOperatingBudgetUsd > 0 ? 1 : null;
  const horizon = inputs.horizon as number;
  for (let month = 1; month <= horizon; month += 1) {
    if (blocked) { snapshots.push(emptySnapshot(month, "blocked")); continue; }
    const macro = macroSnapshots[Math.min(month - 1, macroSnapshots.length - 1)];
    const demandMultiplier = inputs.simulationMode === "coupled" ? macro.modifiers.demandMultiplier : 1;
    const retentionMultiplier = inputs.simulationMode === "coupled" ? macro.modifiers.retentionMultiplier : 1;
    const costMultiplier = inputs.simulationMode === "coupled" ? macro.modifiers.costMultiplier : 1;
    const impressions = integer(p.monthlyImpressions * demandMultiplier * Math.pow(1 + p.referralRate * 0.05, month - 1));
    const visits = integer(impressions * p.visitRate);
    const signups = integer(visits * p.signupRate);
    const activatedUsers = integer(signups * p.activationRate);
    const repeatUsers = integer(activatedUsers * clamp(p.repeatSessionRate * retentionMultiplier, 0, 1));
    const newPaidUsers = integer(repeatUsers * p.paidConversionRate);
    const churnedUsers = integer(activePaid * p.monthlyChurnRate);
    activePaid = Math.max(0, activePaid + newPaidUsers - churnedUsers);
    const revenueUsd = round(activePaid * p.proMonthlyPriceUsd);
    const knownCostUsd = round((signups * p.infrastructurePerUserUsd + activePaid * 1.25 + revenueUsd * p.paymentFeeRate + signups * p.cacUsd + p.monthlyOperatingBudgetUsd + (activatedUsers * p.observabilityPerVisualUsd)) * costMultiplier);
    const apiCostUsd = null;
    const status = inputs.mode === "evidence-only" ? "needs-evidence" : "simulated";
    const grossProfitUsd = null;
    const grossMarginPercent = null;
    runway = revenueUsd > knownCostUsd ? null : runway;
    snapshots.push({ month, macroDemandMultiplier: round(demandMultiplier), macroRetentionMultiplier: round(retentionMultiplier), costMultiplier: round(costMultiplier), impressions, visits, signups, activatedUsers, repeatUsers, newPaidUsers, activePaidUsers: activePaid, churnedUsers, revenueUsd, apiCostUsd, knownCostUsd, grossProfitUsd, grossMarginPercent, runwayMonths: runway, evidenceStatus: status });
  }
  const output = blocked ? { ...legacyOutputs, eligiblePopulation: null, reachablePopulation: null, serviceablePopulation: null, potentialActivatedUsers: null, potentialPaidUsers: null, opportunityScore: null, uncertaintyRange: { low: null, high: null }, blocked: true } : legacyOutputs;
  return { inputs, segment, sources: selectedSources, competition, formulaTrace: createTrace(p), monthlySnapshots: snapshots, outputs: { ...output, strongestAssumption: output.strongestAssumption as AdvancedMarketParameterKey | null, missingEvidence: [...new Set([...output.missingEvidence, ...findings])], warnings: [...output.warnings, "Monthly results are simulated and API profitability remains blocked until verified prices are supplied."], blocked } };
}

export function serializeAdvancedMarketAnalysis(result: AdvancedMarketAnalysisResult): string {
  const sort = (value: unknown): unknown => Array.isArray(value) ? value.map(sort) : value && typeof value === "object" ? Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, child]) => [key, sort(child)])) : value;
  return JSON.stringify(sort(result));
}

export function parameterGroups() { return groupBy(MARKET_ANALYSIS_PARAMETER_DEFINITIONS, (definition) => definition.group); }
