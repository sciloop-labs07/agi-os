import type { CostCatalogEntry, MarketAssumption, MarketFitOutputs, MarketScenario, MarketFitReviewFinding, MarketValidationIssue } from "./types";

const round = (value: number) => Math.round(value * 100) / 100;
const nonNegative = (value: number) => Math.max(0, value);

export function calculateMarketFitScenario(scenario: MarketScenario, costCatalog: CostCatalogEntry[]): MarketFitOutputs {
  const a = scenario.assumptions;
  const visits = Math.floor(a.monthlyImpressions * a.visitRate);
  const signups = Math.floor(visits * a.signupRate);
  const activatedUsers = Math.floor(signups * a.activationRate);
  const repeatUsers = Math.floor(activatedUsers * a.repeatSessionRate);
  const paidUsers = Math.floor(repeatUsers * a.paidConversionRate);
  const monthlyRevenueUsd = paidUsers * a.proMonthlyPriceUsd;
  const freeVisuals = nonNegative(signups - paidUsers) * a.freeVisualsPerUser;
  const paidVisuals = paidUsers * a.paidVisualsPerUser;
  const infrastructureCostUsd = signups * a.infrastructurePerUserUsd;
  const supportCostUsd = paidUsers * a.supportPerPaidUserUsd;
  const paymentFeesUsd = monthlyRevenueUsd * a.paymentFeeRate;
  const acquisitionCostUsd = signups * a.cacUsd;
  const operatingBudgetUsd = a.monthlyOperatingBudgetUsd;
  const verifiedEntry = costCatalog.find((entry) => entry.status === "verified" && entry.inputPricePerMillionTokensUsd !== null && entry.outputPricePerMillionTokensUsd !== null);
  const verifiedApiCostUsd = verifiedEntry ? round((freeVisuals + paidVisuals) * a.requestsPerVisual * ((verifiedEntry.inputPricePerMillionTokensUsd! + verifiedEntry.outputPricePerMillionTokensUsd!) / 1_000_000)) : null;
  const totalKnownCostUsd = infrastructureCostUsd + supportCostUsd + paymentFeesUsd + acquisitionCostUsd + operatingBudgetUsd;
  const grossProfitUsd = verifiedApiCostUsd === null ? null : round(monthlyRevenueUsd - totalKnownCostUsd - verifiedApiCostUsd);
  const grossMarginPercent = grossProfitUsd === null || monthlyRevenueUsd === 0 ? null : round((grossProfitUsd / monthlyRevenueUsd) * 100);
  const ltvUsd = a.monthlyChurnRate > 0 ? round((a.proMonthlyPriceUsd * (1 - a.paymentFeeRate)) / a.monthlyChurnRate) : null;
  const ltvToCac = ltvUsd === null || a.cacUsd <= 0 ? null : round(ltvUsd / a.cacUsd);
  const cacPaybackMonths = monthlyRevenueUsd <= 0 ? null : round((paidUsers * a.cacUsd) / Math.max(monthlyRevenueUsd - paymentFeesUsd - supportCostUsd, 0.01));
  const breakEvenMonths = grossProfitUsd === null || grossProfitUsd <= 0 ? null : round(operatingBudgetUsd / grossProfitUsd);
  return { visits, signups, activatedUsers, repeatUsers, paidUsers, monthlyRevenueUsd: round(monthlyRevenueUsd), annualizedRevenueUsd: round(monthlyRevenueUsd * 12), freeVisuals: round(freeVisuals), paidVisuals: round(paidVisuals), infrastructureCostUsd: round(infrastructureCostUsd), supportCostUsd: round(supportCostUsd), paymentFeesUsd: round(paymentFeesUsd), acquisitionCostUsd: round(acquisitionCostUsd), operatingBudgetUsd: round(operatingBudgetUsd), verifiedApiCostUsd, totalKnownCostUsd: round(totalKnownCostUsd), grossProfitUsd, grossMarginPercent, ltvUsd, ltvToCac, cacPaybackMonths, breakEvenMonths, apiCostStatus: verifiedApiCostUsd === null ? "unavailable" : "available" };
}

export function createMarketFitReviewFindings(scenario: MarketScenario, costCatalog: CostCatalogEntry[], outputs: MarketFitOutputs): MarketFitReviewFinding[] {
  const findings: MarketFitReviewFinding[] = [];
  for (const issue of validateMarketScenario(scenario)) findings.push({ severity: "blocking", message: issue.message, action: `Correct ${issue.field} before using this scenario.` });
  if (costCatalog.every((entry) => entry.status !== "verified")) findings.push({ severity: "blocking", message: "Verified API pricing is missing, so gross margin and break-even are not calculable.", action: "Import a dated provider price entry from an official source before using profitability outputs." });
  if (outputs.activatedUsers === 0) findings.push({ severity: "blocking", message: "The scenario produces no activated users.", action: "Test the onboarding and first-understanding experience before modeling conversion." });
  if (scenario.assumptions.paidConversionRate > 0.2) findings.push({ severity: "warning", message: "Paid conversion is a high-confidence-looking assumption without measured evidence.", action: "Run a pricing and upgrade-trigger experiment." });
  if (scenario.assumptions.monthlyChurnRate <= 0) findings.push({ severity: "warning", message: "Churn is zero or missing; LTV would be overstated.", action: "Collect retention evidence before treating LTV as a forecast." });
  findings.push({ severity: "info", message: "All numeric scenario values are simulated assumptions, not product-market-fit evidence.", action: "Replace assumptions with measured experiment observations as they become available." });
  return findings;
}

export function validateMarketScenario(scenario: MarketScenario): MarketValidationIssue[] {
  const a = scenario.assumptions;
  const rateFields = ["visitRate", "signupRate", "activationRate", "repeatSessionRate", "paidConversionRate", "monthlyChurnRate", "paymentFeeRate"] as const;
  const issues: MarketValidationIssue[] = rateFields.filter((field) => a[field] < 0 || a[field] > 1).map((field) => ({ field, message: `${field} must be between 0 and 1.` }));
  const nonNegativeFields = ["monthlyImpressions", "proMonthlyPriceUsd", "freeVisualsPerUser", "paidVisualsPerUser", "requestsPerVisual", "infrastructurePerUserUsd", "supportPerPaidUserUsd", "cacUsd", "monthlyOperatingBudgetUsd"] as const;
  issues.push(...nonNegativeFields.filter((field) => a[field] < 0).map((field) => ({ field, message: `${field} cannot be negative.` })));
  return issues;
}

export function serializeMarketFitScenario(scenario: MarketScenario): string {
  return JSON.stringify({ ...scenario, assumptions: Object.fromEntries(Object.entries(scenario.assumptions).sort(([a], [b]) => a.localeCompare(b))) });
}

export function createMarketAssumptions(scenario: MarketScenario): MarketAssumption<number>[] {
  return Object.entries(scenario.assumptions).map(([id, value]) => ({ id, label: id, value, unit: id.includes("Rate") ? "%" : "simulated", status: "simulated", source: "local V1 fixture", confidence: "low", invalidationCondition: "Replace after a measured experiment." }));
}
