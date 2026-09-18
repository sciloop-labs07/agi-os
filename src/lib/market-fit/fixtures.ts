import type { CostCatalogEntry, DistributionChannel, MarketExperiment, MarketScenario, MarketScenarioId } from "./types";

const shared = { monthlyImpressions: 10000, visitRate: 0.12, signupRate: 0.18, activationRate: 0.38, repeatSessionRate: 0.42, paidConversionRate: 0.06, monthlyChurnRate: 0.08, proMonthlyPriceUsd: 12, annualDiscountRate: 0.15, freeVisualsPerUser: 8, paidVisualsPerUser: 45, requestsPerVisual: 3, infrastructurePerUserUsd: 0.12, supportPerPaidUserUsd: 1.25, paymentFeeRate: 0.03, cacUsd: 0, monthlyOperatingBudgetUsd: 1200 };

export const marketScenarios: Record<MarketScenarioId, MarketScenario> = {
  conservative: { id: "conservative", label: "Conservative", assumptions: { ...shared, monthlyImpressions: 6000, activationRate: 0.25, repeatSessionRate: 0.3, paidConversionRate: 0.03, monthlyChurnRate: 0.14, proMonthlyPriceUsd: 9, monthlyOperatingBudgetUsd: 1500 } },
  base: { id: "base", label: "Base", assumptions: shared },
  optimistic: { id: "optimistic", label: "Optimistic", assumptions: { ...shared, monthlyImpressions: 25000, visitRate: 0.16, signupRate: 0.22, activationRate: 0.52, repeatSessionRate: 0.58, paidConversionRate: 0.1, monthlyChurnRate: 0.05, proMonthlyPriceUsd: 15, freeVisualsPerUser: 10, paidVisualsPerUser: 60, monthlyOperatingBudgetUsd: 2500 } }
};

export const marketCostCatalog: CostCatalogEntry[] = [{ id: "provider-pricing-pending", provider: "Provider catalog", model: "Awaiting official verification", currency: "USD", inputPricePerMillionTokensUsd: null, outputPricePerMillionTokensUsd: null, cachedInputPricePerMillionTokensUsd: null, embeddingPricePerMillionTokensUsd: null, imagePricePerGenerationUsd: null, sourceUrl: null, effectiveDate: null, lastVerifiedAt: null, status: "unverified" }];

export const marketExperiments: MarketExperiment[] = [
  { id: "first-understanding", name: "First visual understanding", hypothesis: "A guided visual explanation creates a successful first session faster than a text-first introduction.", target: "Self-directed learners", successMetric: "First-understanding completion", guardrailMetric: "Fallback and accessibility completion", status: "planned", evidenceStatus: "needs-evidence" },
  { id: "free-cap", name: "Value-based free cap", hypothesis: "A complete free learning outcome plus capped advanced usage improves trust and conversion.", target: "Activated free users", successMetric: "Week-4 retained conversion", guardrailMetric: "Free-user activation", status: "planned", evidenceStatus: "needs-evidence" },
  { id: "pricing-sensitivity", name: "Pro pricing sensitivity", hypothesis: "A low-friction Pro plan is more compelling after repeated experiments than after the first visit.", target: "Repeat users", successMetric: "Upgrade intent and paid conversion", guardrailMetric: "Refund or abandonment rate", status: "planned", evidenceStatus: "needs-evidence" },
  { id: "api-efficiency", name: "API-cost optimization", hypothesis: "Recipe reuse and smaller model routing reduce cost without lowering understanding quality.", target: "Visual generation requests", successMetric: "Verified cost per successful explanation", guardrailMetric: "Human clarity score", status: "planned", evidenceStatus: "needs-evidence" }
];

export const distributionChannels: DistributionChannel[] = [
  { id: "direct-outreach", label: "Direct founder outreach", audience: "Curious learners and science educators", format: "Personal demo and interview", learningSpeed: "fast", paidAcquisitionAllowed: false, nextTest: "Run 10 qualitative interviews around the first-understanding moment." },
  { id: "visual-content", label: "Short-form visual demonstrations", audience: "Science and learning audiences", format: "Before/after concept visual", learningSpeed: "medium", paidAcquisitionAllowed: false, nextTest: "Compare explanation-first versus spectacle-first creative." },
  { id: "communities", label: "Educational communities", audience: "Students, teachers, and builders", format: "Guided experiment and feedback request", learningSpeed: "medium", paidAcquisitionAllowed: false, nextTest: "Recruit a small consented pilot group." },
  { id: "seo", label: "Search and evergreen explanations", audience: "People searching for difficult concepts", format: "Text plus interactive visual", learningSpeed: "slow", paidAcquisitionAllowed: false, nextTest: "Measure search-to-activation rather than visits alone." }
];

