# Skyloop Market Fit Portal — Phase 1

## Purpose

`/market-fit` is a local, private AGI OS decision laboratory for testing Skyloop’s Version 1 market assumptions before real billing, acquisition spend, or external data ingestion.

## Current capabilities

- Conservative, base, and optimistic scenario selection.
- Deterministic visitor → signup → activation → repeat → paid funnel calculation.
- Simulated MRR, ARR, known operating cost, LTV, CAC, and payback outputs.
- Value-based free-tier operation counts.
- Dated cost-catalog contract with an intentionally unverified placeholder.
- Profitability gate: gross profit and margin remain unavailable until official provider pricing is verified.
- Review-copilot findings for missing cost evidence, impossible assumptions, and simulated-versus-measured boundaries.
- Initial experiment queue and learning-first distribution planner.
- Explicit release gate that does not claim product-market fit from simulation alone.

## Important boundary

Phase 1 does not process payments, store payment credentials, launch campaigns, ingest customer data, call external pricing APIs, or migrate the database. All numeric scenario values are simulated assumptions and must be replaced or supplemented by measured experiments.

## Cost verification contract

Before profitability is used for a release decision, enter a versioned `CostCatalogEntry` with provider, model, input/output rates, source URL, effective date, verification date, and status `verified`. The calculator will then include verified API cost in gross profit and margin. Unverified or missing prices intentionally block those outputs.

## Next phases

1. Collect first-understanding, retention, pricing, and cost-optimization experiment results.
2. Add authenticated persistence only after the local contracts are reviewed.
3. Add manually approved provider-price ingestion.
4. Add consented product analytics and measured funnel observations.
5. Conduct founder review before any billing or paid acquisition work.

