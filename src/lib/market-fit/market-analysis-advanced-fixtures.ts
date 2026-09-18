import type { MarketScenarioId } from "./types";
import type { AdvancedParameterDefinition, AdvancedMarketParameterKey, AdvancedMarketParameterSet, AdvancedParameterGroup, MarketAnalysisHorizon } from "./market-analysis-advanced-types";
import { marketScenarios } from "./fixtures";
import { marketEvidenceRegistry } from "./market-analysis-fixtures";

type DefinitionTuple = [AdvancedMarketParameterKey, string, AdvancedParameterGroup, "fraction" | "score" | "count" | "currency" | "integer" | "days", string, number, number, number, string, string];

const definitions: DefinitionTuple[] = [
  ["population", "Population", "market-context", "count", "people", 0, 100000000000, 1000, "Total population in the selected geography.", "Official demographic dataset"],
  ["educationStageShare", "Education-stage share", "market-context", "fraction", "fraction", 0, 1, 0.01, "Share matching the selected education stage.", "Education statistics"],
  ["targetSegmentShare", "Target segment share", "market-context", "fraction", "fraction", 0, 1, 0.01, "Share of the education stage matching the audience.", "Segment evidence"],
  ["internetAccess", "Internet access", "market-context", "fraction", "fraction", 0, 1, 0.01, "Internet access fit for the geography.", "ICT statistics"],
  ["mobileAccess", "Mobile access", "market-context", "fraction", "fraction", 0, 1, 0.01, "Mobile access fit.", "ICT statistics"],
  ["desktopAccess", "Desktop access", "market-context", "fraction", "fraction", 0, 1, 0.01, "Desktop access fit.", "ICT statistics"],
  ["languageFit", "Language fit", "market-context", "fraction", "fraction", 0, 1, 0.01, "Language match between product and audience.", "Language evidence"],
  ["deviceFit", "Device fit", "market-context", "fraction", "fraction", 0, 1, 0.01, "Combined device compatibility.", "Device evidence"],
  ["geographicAvailability", "Geographic availability", "market-context", "fraction", "fraction", 0, 1, 0.01, "Availability of the product in the selected geography.", "Product availability"],
  ["problemIncidence", "Problem incidence", "demand", "fraction", "fraction", 0, 1, 0.01, "Share experiencing the target problem.", "Primary problem research"],
  ["problemIntensity", "Problem intensity", "demand", "score", "0–100", 0, 100, 1, "Severity of the problem for the segment.", "Interviews and experiments"],
  ["searchSignal", "Search or discovery signal", "demand", "score", "0–100", 0, 100, 1, "Observed or assumed discovery signal.", "Search or discovery evidence"],
  ["alternativeGap", "Alternative gap", "demand", "fraction", "fraction", 0, 1, 0.01, "Share not adequately served by alternatives.", "Alternative research"],
  ["urgency", "Urgency", "demand", "score", "0–100", 0, 100, 1, "Urgency to solve the problem.", "Primary problem research"],
  ["repeatUsePotential", "Repeat-use potential", "demand", "score", "0–100", 0, 100, 1, "Likelihood of repeated use after activation.", "Retention evidence"],
  ["willingnessToPay", "Willingness to pay", "demand", "score", "0–100", 0, 100, 1, "Pricing signal, never inferred from population alone.", "Pricing experiment"],
  ["willingnessToPayConfidence", "Willingness-to-pay confidence", "demand", "score", "0–100", 0, 100, 1, "Confidence in the pricing signal.", "Pricing experiment"],
  ["monthlyImpressions", "Monthly impressions", "funnel", "count", "impressions", 0, 1000000000, 100, "Monthly addressable impressions for the scenario.", "Channel measurement"],
  ["visitRate", "Visit rate", "funnel", "fraction", "fraction", 0, 1, 0.01, "Impression-to-visit rate.", "Funnel measurement"],
  ["signupRate", "Signup rate", "funnel", "fraction", "fraction", 0, 1, 0.01, "Visit-to-signup rate.", "Funnel measurement"],
  ["activationRate", "Activation rate", "funnel", "fraction", "fraction", 0, 1, 0.01, "Signup-to-first-understanding rate.", "Activation experiment"],
  ["repeatSessionRate", "Repeat-session rate", "funnel", "fraction", "fraction", 0, 1, 0.01, "Activated users returning.", "Retention measurement"],
  ["paidConversionRate", "Paid conversion", "funnel", "fraction", "fraction", 0, 1, 0.01, "Repeat users converting to paid.", "Pricing experiment"],
  ["monthlyChurnRate", "Monthly churn", "funnel", "fraction", "fraction", 0, 1, 0.01, "Monthly paid-user churn.", "Retention measurement"],
  ["referralRate", "Referral rate", "funnel", "fraction", "fraction", 0, 1, 0.01, "Users producing qualified referrals.", "Referral experiment"],
  ["proMonthlyPriceUsd", "Pro monthly price", "pricing", "currency", "USD/month", 0, 10000, 0.5, "Monthly Pro price assumption.", "Pricing experiment"],
  ["annualDiscountRate", "Annual discount", "pricing", "fraction", "fraction", 0, 1, 0.01, "Discount for annual payment.", "Pricing policy"],
  ["freeVisualsPerUser", "Free visuals per user", "pricing", "count", "visuals/user", 0, 100000, 1, "Free visual allowance.", "Free-tier experiment"],
  ["paidVisualsPerUser", "Paid visuals per user", "pricing", "count", "visuals/user", 0, 1000000, 1, "Paid visual usage.", "Usage measurement"],
  ["requestsPerVisual", "Requests per visual", "pricing", "count", "requests/visual", 0, 100, 1, "Requests needed to produce one visual.", "Runtime measurement"],
  ["cacUsd", "Customer acquisition cost", "pricing", "currency", "USD/user", 0, 100000, 0.1, "Acquisition cost assumption.", "Channel experiment"],
  ["paymentFeeRate", "Payment fee rate", "pricing", "fraction", "fraction", 0, 1, 0.001, "Payment processing fee.", "Payment provider terms"],
  ["monthlyOperatingBudgetUsd", "Monthly operating budget", "pricing", "currency", "USD/month", 0, 100000000, 10, "Budget available for the scenario.", "Founder planning input"],
  ["modelMixLow", "Low-cost model mix", "api", "fraction", "fraction", 0, 1, 0.01, "Share routed to low-cost models.", "Verified cost catalog"],
  ["modelMixStandard", "Standard model mix", "api", "fraction", "fraction", 0, 1, 0.01, "Share routed to standard models.", "Verified cost catalog"],
  ["modelMixPremium", "Premium model mix", "api", "fraction", "fraction", 0, 1, 0.01, "Share routed to premium models.", "Verified cost catalog"],
  ["inputTokensPerVisual", "Input tokens per visual", "api", "count", "tokens/visual", 0, 10000000, 100, "Input-token volume.", "Runtime measurement"],
  ["outputTokensPerVisual", "Output tokens per visual", "api", "count", "tokens/visual", 0, 10000000, 100, "Output-token volume.", "Runtime measurement"],
  ["cachedInputTokensPerVisual", "Cached input tokens", "api", "count", "tokens/visual", 0, 10000000, 100, "Cached input volume.", "Runtime measurement"],
  ["embeddingTokensPerVisual", "Embedding tokens", "api", "count", "tokens/visual", 0, 10000000, 100, "Embedding volume.", "Runtime measurement"],
  ["mediaGenerationsPerVisual", "Media generations", "api", "count", "generations/visual", 0, 100, 1, "Media generations per visual.", "Runtime measurement"],
  ["infrastructurePerUserUsd", "Infrastructure per user", "api", "currency", "USD/user", 0, 100000, 0.01, "Hosting and compute cost per user.", "Infrastructure measurement"],
  ["observabilityPerVisualUsd", "Observability per visual", "api", "currency", "USD/visual", 0, 1000, 0.001, "Logging and monitoring cost.", "Infrastructure measurement"],
  ["competitionPressure", "Competition pressure", "competition", "score", "0–100", 0, 100, 1, "Pressure from evidenced alternatives.", "First-party competitor evidence"],
  ["switchingFriction", "Switching friction", "competition", "score", "0–100", 0, 100, 1, "Difficulty of changing from an alternative.", "Interview evidence"],
  ["competitorPriceRangeUsd", "Competitor price range", "competition", "currency", "USD/month", 0, 100000, 0.5, "Observed competitor price reference.", "First-party pricing"],
  ["distributionReach", "Distribution reach", "competition", "score", "0–100", 0, 100, 1, "Reach available through selected channels.", "Channel experiment"],
  ["channelActivationRate", "Channel activation", "competition", "fraction", "fraction", 0, 1, 0.01, "Activation from the selected channel.", "Channel experiment"],
  ["acquisitionDifficulty", "Acquisition difficulty", "competition", "score", "0–100", 0, 100, 1, "Difficulty of acquiring the target audience.", "Channel evidence"],
  ["freshnessThresholdDays", "Freshness threshold", "evidence", "days", "days", 1, 3650, 1, "Maximum acceptable source age.", "Evidence policy"],
  ["minimumConfidenceScore", "Minimum confidence", "evidence", "score", "0–100", 0, 100, 1, "Minimum confidence for strict conclusions.", "Evidence policy"],
  ["evidenceRisk", "Evidence risk", "evidence", "score", "0–100", 0, 100, 1, "Risk caused by assumptions and missing sources.", "Evidence review"],
  ["sourceStrictnessScore", "Source strictness", "evidence", "score", "0–100", 0, 100, 1, "How strongly unsupported values are blocked.", "Evidence policy"],
  ["researchCompleteness", "Research completeness", "evidence", "score", "0–100", 0, 100, 1, "Completeness of the current research package.", "Review checklist"]
];

export const MARKET_ANALYSIS_PARAMETER_DEFINITIONS: AdvancedParameterDefinition[] = definitions.map(([key, label, group, kind, unit, min, max, step, description, sourceHint]) => ({ key, label, group, kind, unit, min, max, step, description, sourceHint }));
export const MARKET_ANALYSIS_PARAMETER_GROUPS: Array<{ id: AdvancedParameterGroup; label: string; description: string }> = [
  { id: "market-context", label: "Market context and access", description: "Population, education, connectivity, language, device, and availability." },
  { id: "demand", label: "Demand and problem strength", description: "Problem intensity, alternatives, urgency, and willingness to pay." },
  { id: "funnel", label: "Funnel and retention", description: "Visits, activation, repeat use, conversion, churn, and referrals." },
  { id: "pricing", label: "Pricing and unit economics", description: "Plans, free value, acquisition, fees, and operating budget." },
  { id: "api", label: "API and infrastructure", description: "Model mix, token volume, runtime usage, and operational costs." },
  { id: "competition", label: "Competition and distribution", description: "Alternatives, switching friction, channel reach, and acquisition difficulty." },
  { id: "evidence", label: "Evidence and review controls", description: "Freshness, confidence, strictness, risk, and research completeness." }
];

const scenarioOverrides: Record<MarketScenarioId, Partial<AdvancedMarketParameterSet>> = {
  conservative: { monthlyImpressions: 6000, activationRate: 0.25, repeatSessionRate: 0.3, paidConversionRate: 0.03, monthlyChurnRate: 0.14, proMonthlyPriceUsd: 9, researchCompleteness: 15 },
  base: { researchCompleteness: 20 },
  optimistic: { monthlyImpressions: 25000, visitRate: 0.16, signupRate: 0.22, activationRate: 0.52, repeatSessionRate: 0.58, paidConversionRate: 0.1, monthlyChurnRate: 0.05, proMonthlyPriceUsd: 15, researchCompleteness: 25 }
};

export function createDefaultAdvancedParameters(scenarioId: MarketScenarioId = "base"): AdvancedMarketParameterSet {
  const assumptions = marketScenarios[scenarioId].assumptions;
  const values: AdvancedMarketParameterSet = {
    population: 8000000000, educationStageShare: 0.2, targetSegmentShare: 0.2, internetAccess: 0.68, mobileAccess: 0.75, desktopAccess: 0.55, languageFit: 0.2, deviceFit: 0.9, geographicAvailability: 1,
    problemIncidence: 0.35, problemIntensity: 55, searchSignal: 45, alternativeGap: 0.3, urgency: 42, repeatUsePotential: 42, willingnessToPay: 35, willingnessToPayConfidence: 10,
    monthlyImpressions: assumptions.monthlyImpressions, visitRate: assumptions.visitRate, signupRate: assumptions.signupRate, activationRate: assumptions.activationRate, repeatSessionRate: assumptions.repeatSessionRate, paidConversionRate: assumptions.paidConversionRate, monthlyChurnRate: assumptions.monthlyChurnRate, referralRate: 0.05,
    proMonthlyPriceUsd: assumptions.proMonthlyPriceUsd, annualDiscountRate: assumptions.annualDiscountRate, freeVisualsPerUser: assumptions.freeVisualsPerUser, paidVisualsPerUser: assumptions.paidVisualsPerUser, requestsPerVisual: assumptions.requestsPerVisual, cacUsd: assumptions.cacUsd, paymentFeeRate: assumptions.paymentFeeRate, monthlyOperatingBudgetUsd: assumptions.monthlyOperatingBudgetUsd,
    modelMixLow: 0.7, modelMixStandard: 0.2, modelMixPremium: 0.1, inputTokensPerVisual: 2500, outputTokensPerVisual: 1800, cachedInputTokensPerVisual: 500, embeddingTokensPerVisual: 300, mediaGenerationsPerVisual: 0, infrastructurePerUserUsd: assumptions.infrastructurePerUserUsd, observabilityPerVisualUsd: 0.002,
    competitionPressure: 60, switchingFriction: 45, competitorPriceRangeUsd: 12, distributionReach: 40, channelActivationRate: 0.08, acquisitionDifficulty: 55,
    freshnessThresholdDays: 730, minimumConfidenceScore: 70, evidenceRisk: 75, sourceStrictnessScore: 70, researchCompleteness: 20
  };
  return { ...values, ...scenarioOverrides[scenarioId] };
}

export function createDefaultAdvancedInputs(scenarioId: MarketScenarioId = "base"): import("./market-analysis-advanced-types").AdvancedMarketAnalysisInputs {
  return { schemaVersion: "market-analysis-v2", geography: "global", segmentId: "global-English-self-directed", scenarioId, mode: "base", simulationMode: "coupled", horizon: 36 as MarketAnalysisHorizon, sourceStrictness: "standard", sourceIds: marketEvidenceRegistry.map((source) => source.id), parameters: createDefaultAdvancedParameters(scenarioId) };
}
