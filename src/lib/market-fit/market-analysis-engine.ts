import type { MarketScenario } from "./types";
import type { MarketAnalysisInputs, MarketAnalysisOutputs, MarketAnalysisResult, MarketCompetitionRecord, MarketEvidenceRecord, MarketSegment } from "./market-analysis-types";

const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));
const round = (value: number) => Math.round(value * 100) / 100;
const daysBetween = (a: string, b: string) => Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
const evidenceReady = (record: MarketEvidenceRecord, now: string, threshold: number) => ["imported", "measured", "validated"].includes(record.status) && Boolean(record.sourceUrl && record.publicationDate) && daysBetween(record.publicationDate!, now) <= threshold;

export function validateMarketEvidence(record: MarketEvidenceRecord, now = "2026-09-18", freshnessThresholdDays = 730): string[] {
  const issues: string[] = [];
  if (!record.sourceUrl || !/^https?:\/\//.test(record.sourceUrl)) issues.push("original source URL is required");
  if (!record.publicationDate) issues.push("publication date is required");
  if (!record.geography) issues.push("geography is required");
  if (!record.unit) issues.push("unit is required");
  if (record.value === null && record.status !== "needs-evidence") issues.push("numeric value is required for a numeric record");
  if (record.publicationDate && daysBetween(record.publicationDate, now) > freshnessThresholdDays) issues.push("source is stale");
  return issues;
}

export function validateMarketSegment(segment: MarketSegment | null): string[] {
  if (!segment) return ["market segment is required"];
  const issues: string[] = [];
  if (!segment.geography) issues.push("segment geography is required");
  if (!segment.language) issues.push("segment language is required");
  if (segment.evidenceRefs.length === 0) issues.push("segment source references are required");
  return issues;
}

function normalizeScore(value: number) { return round(clamp(value, 0, 100)); }

export function calculateMarketAnalysis(inputs: MarketAnalysisInputs, sources: MarketEvidenceRecord[], segments: MarketSegment[], competition: MarketCompetitionRecord[], scenario: MarketScenario, now = "2026-09-18"): MarketAnalysisResult {
  const segment = segments.find((item) => item.id === inputs.segmentId) ?? null;
  const selectedSources = sources.filter((source) => inputs.sourceIds.includes(source.id));
  const missingEvidence = new Set<string>([...validateMarketSegment(segment)]);
  selectedSources.forEach((source) => validateMarketEvidence(source, now, inputs.freshnessThresholdDays).forEach((issue) => missingEvidence.add(`${source.metric}: ${issue}`)));
  const assumptionEntries = Object.entries(inputs.assumptions);
  const fractionFields = new Set(["targetSegmentShare", "internetAccess", "languageFit", "deviceFit", "geographicAvailability", "problemIncidence", "alternativeGap"]);
  const invalid = assumptionEntries.filter(([key, value]) => !Number.isFinite(value) || value < 0 || (fractionFields.has(key) && value > 1));
  if (invalid.length > 0) invalid.forEach(([key]) => missingEvidence.add(`${key}: invalid value`));
  if (inputs.mode === "evidence-only") selectedSources.filter((source) => !evidenceReady(source, now, inputs.freshnessThresholdDays)).forEach((source) => missingEvidence.add(`${source.metric}: evidence-only mode requires a dated verified source`));
  if (competition.every((item) => item.status !== "validated" || !item.sourceUrl)) missingEvidence.add("competition: first-party evidence is required");

  const a = inputs.assumptions;
  const isBlockedForEvidence = (inputs.mode === "evidence-only" || inputs.sourceStrictness === "strict") && missingEvidence.size > 0;
  const eligiblePopulation = isBlockedForEvidence ? null : Math.floor(a.population * a.targetSegmentShare);
  const reachablePopulation = eligiblePopulation === null ? null : Math.floor(eligiblePopulation * a.internetAccess * a.languageFit * a.deviceFit * a.geographicAvailability);
  const serviceablePopulation = reachablePopulation === null ? null : Math.floor(reachablePopulation * a.problemIncidence * a.alternativeGap);
  const potentialActivatedUsers = serviceablePopulation === null ? null : Math.floor(serviceablePopulation * scenario.assumptions.visitRate * scenario.assumptions.signupRate * scenario.assumptions.activationRate);
  const potentialPaidUsers = potentialActivatedUsers === null ? null : Math.floor(potentialActivatedUsers * scenario.assumptions.repeatSessionRate * scenario.assumptions.paidConversionRate);
  const components = [
    { id: "demandStrength", label: "Demand strength", score: normalizeScore(a.demandStrength), direction: "positive" as const, reason: "Problem demand and first-understanding need.", evidenceRefs: ["unesco-ai-education"] },
    { id: "accessFeasibility", label: "Access feasibility", score: normalizeScore(a.accessFeasibility), direction: "positive" as const, reason: "Connectivity, language, device, and geography fit.", evidenceRefs: ["itu-connectivity"] },
    { id: "problemIntensity", label: "Problem intensity", score: normalizeScore(a.problemIntensity), direction: "positive" as const, reason: "How painful the learning problem is for the selected segment.", evidenceRefs: segment?.evidenceRefs ?? [] },
    { id: "repeatUsePotential", label: "Repeat-use potential", score: normalizeScore(a.repeatUsePotential), direction: "positive" as const, reason: "Likelihood that a first explanation leads to another experiment.", evidenceRefs: [] },
    { id: "willingnessToPay", label: "Willingness to pay", score: inputs.mode === "evidence-only" ? null : normalizeScore(a.willingnessToPay), direction: "positive" as const, reason: "Requires primary interviews or pricing experiments.", evidenceRefs: ["market-unknown-wtp"] },
    { id: "distributionFeasibility", label: "Distribution feasibility", score: normalizeScore(a.distributionFeasibility), direction: "positive" as const, reason: "A planning assumption reserved for downstream channel tests.", evidenceRefs: [] },
    { id: "competitionPressure", label: "Competition pressure", score: normalizeScore(a.competitionPressure), direction: "negative" as const, reason: "Blocked until first-party competitor evidence is collected.", evidenceRefs: [] },
    { id: "acquisitionDifficulty", label: "Acquisition difficulty", score: normalizeScore(a.acquisitionDifficulty), direction: "negative" as const, reason: "CAC and channel evidence are not yet measured.", evidenceRefs: [] },
    { id: "evidenceRisk", label: "Evidence risk", score: normalizeScore(a.evidenceRisk), direction: "negative" as const, reason: "Missing, stale, or assumption-only sources widen uncertainty.", evidenceRefs: selectedSources.map((source) => source.id) }
  ];
  const positive = components.filter((item) => item.direction === "positive" && item.score !== null).reduce((sum, item) => sum + (item.score ?? 0), 0);
  const negative = components.filter((item) => item.direction === "negative" && item.score !== null).reduce((sum, item) => sum + (item.score ?? 0), 0);
  const positiveAverage = positive / Math.max(components.filter((item) => item.direction === "positive" && item.score !== null).length, 1);
  const negativeAverage = negative / Math.max(components.filter((item) => item.direction === "negative" && item.score !== null).length, 1);
  const opportunityScore = isBlockedForEvidence ? null : normalizeScore(positiveAverage - negativeAverage * 0.6);
  const confidence = missingEvidence.size === 0 ? "high" : missingEvidence.size <= 3 ? "medium" : "low";
  const uncertainty = opportunityScore === null ? { low: null, high: null } : { low: normalizeScore(opportunityScore - missingEvidence.size * 4), high: normalizeScore(opportunityScore + missingEvidence.size * 4) };
  const warnings = ["All market outputs are simulations, not observed market size or product-market fit.", ...(inputs.mode === "evidence-only" ? ["Evidence-only mode blocks unsupported calculations."] : ["Assumption-inclusive mode requires human review before any decision."] )];
  const strongestAssumption = assumptionEntries.sort(([, left], [, right]) => Math.abs(right - 0.5) - Math.abs(left - 0.5))[0]?.[0] ?? null;
  const largestUncertainty = missingEvidence.size > 0 ? [...missingEvidence][0] : null;
  const outputs: MarketAnalysisOutputs = { eligiblePopulation, reachablePopulation, serviceablePopulation, potentialActivatedUsers, potentialPaidUsers, opportunityScore, opportunityComponents: components, confidence, uncertaintyRange: uncertainty, missingEvidence: [...missingEvidence], warnings, strongestAssumption, largestUncertainty, blocked: isBlockedForEvidence };
  return { inputs, segment, outputs, sources: selectedSources, competition };
}

export function serializeMarketAnalysisResult(result: MarketAnalysisResult): string {
  const sort = (value: unknown): unknown => Array.isArray(value) ? value.map(sort) : value && typeof value === "object" ? Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, child]) => [key, sort(child)])) : value;
  return JSON.stringify(sort(result));
}
