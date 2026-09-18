# Skyloop Market Fit: Market Analysis

The private Market Analysis module converts curated market evidence into transparent, scenario-based planning outputs. It does not claim true market size, product-market fit, or a launch decision.

## Boundary

Market Analysis is upstream of the existing revenue, Money Universe, and Maths AI layers. It supplies approved segments and evidence packages; it does not mutate those engines, create billing, ingest customer data, or add a public route. Distribution and networking remain downstream contracts and are not implemented here.

V1 uses local, versioned fixture records. The links are original official sources, but the numeric values in the fixtures are explicitly marked `assumption` until a dated observation is imported and reviewed.

## Source tiers

Tier 1 is authoritative public data: World Bank Indicators API, World Bank Education Statistics, ITU ICT Statistics, UNESCO AI and education resources, U.S. Census International Database, and OECD Education Data. Tier 2 is first-party market evidence such as official pricing, documentation, terms, and regulatory disclosures. Tier 3 is discovery-only and cannot establish a final estimate.

Every record carries its URL, publisher, metric, unit, geography, segment, dates, methodology, license, status, confidence, owner, and invalidation condition. Missing URL, publication date, geography, unit, or freshness evidence is surfaced as a review finding. `evidence-only` mode blocks unsupported outputs instead of silently substituting assumptions.

## Calculation contract

```text
eligible = population × targetSegmentShare
reachable = eligible × internetAccess × languageFit × deviceFit × geographicAvailability
serviceable = reachable × problemIncidence × alternativeGap
activated = serviceable × visitRate × signupRate × activationRate
paid = activated × repeatSessionRate × paidConversionRate
```

The UI shows each intermediate value and labels it as simulated. Opportunity scoring uses normalized component scores for demand, access, problem intensity, repeat use, willingness to pay, distribution feasibility, competition pressure, acquisition difficulty, and evidence risk. A high score never approves a launch.

## Human review workflow

```text
curated source → immutable evidence record → segment/geography → unit/date/provenance gate
→ market funnel → scenario comparison → uncertainty → human review → export package
```

The export is a local JSON evidence package. It can be attached to a future experiment or review decision, but no value is automatically promoted to a public product or a financial forecast.

## Future contracts

Distribution will consume approved segments and add channel, audience, message, reach, cost, activation, retention, CAC, evidence references, and next experiment. Networking will consume approved segments and add organization, relationship type, strategic value, access path, probability, expected impact, owner, next action, and evidence references. These are reserved, not implemented in this phase.

## Remaining blockers

- Replace planning fixtures with dated, source-specific observations.
- Collect primary willingness-to-pay and competitor evidence.
- Calibrate geography-specific access and demand values.
- Run consented experiments before treating any output as measured.
- Complete protected browser review and human scientific/business sign-off.

## Advanced workbench

The private workbench is organized into Overview, Guided Setup, 54 Parameters, Evidence, Simulation, Optimizer, and Review & Export tabs. Guided Setup exposes the highest-leverage controls; the expert view exposes the complete typed parameter catalog with units, bounds, explanations, and source hints.

The 54 controls are grouped as follows: 9 market-context/access, 8 demand/problem, 8 funnel/retention, 8 pricing/unit-economics, 10 API/infrastructure, 6 competition/distribution, and 5 evidence/review controls. The supported deterministic horizons are 12, 24, 36, and 60 months.

The workbench supports reviewed JSON/CSV evidence import, local browser drafts, versioned JSON export, accessible chart data tables, and a bounded Maths AI optimizer. Candidate application is explicit and changes only the private preview state. Imported records are rejected as a batch when required provenance is invalid.

The optimizer ranks market opportunity, activation, retention, conversion, margin availability, acquisition feasibility, evidence quality, and assumption safety. It preserves candidate lineage and marks unsupported or blocked candidates as `needs-evidence`; it cannot publish, bill, launch campaigns, or claim product-market fit.
