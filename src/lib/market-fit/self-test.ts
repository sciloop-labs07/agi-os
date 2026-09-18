import { calculateMarketFitScenario, createMarketFitReviewFindings, marketCostCatalog, marketScenarios, serializeMarketFitScenario, validateMarketScenario } from "./index";

const assert = (condition: boolean, message: string) => { if (!condition) throw new Error(message); };

export function runMarketFitSelfTest() {
  const base = marketScenarios.base;
  const outputs = calculateMarketFitScenario(base, marketCostCatalog);
  assert(outputs.visits === 1200, "Funnel visits must be deterministic.");
  assert(outputs.activatedUsers === 82, "Activation must follow the canonical funnel.");
  assert(outputs.monthlyRevenueUsd === outputs.paidUsers * base.assumptions.proMonthlyPriceUsd, "Revenue must equal paid users multiplied by plan price.");
  assert(outputs.apiCostStatus === "unavailable" && outputs.grossProfitUsd === null, "Unverified API prices must block profitability claims.");
  assert(createMarketFitReviewFindings(base, marketCostCatalog, outputs).some((finding) => finding.severity === "blocking"), "Missing cost evidence must create a blocking finding.");
  assert(serializeMarketFitScenario(base) === serializeMarketFitScenario({ ...base, assumptions: { ...base.assumptions } }), "Scenario serialization must be stable.");
  const invalid = { ...base, assumptions: { ...base.assumptions, signupRate: 2 } };
  assert(validateMarketScenario(invalid).some((issue) => issue.field === "signupRate"), "Impossible rates must be blocked.");
  console.log("Market Fit self-test passed: funnel/revenue/cost gate/determinism/invalid-input validation");
}

if (typeof process !== "undefined" && process.argv[1]?.endsWith("market-fit/self-test.ts")) runMarketFitSelfTest();

