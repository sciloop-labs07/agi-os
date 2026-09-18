# Integrated Money Universe + Skyloop Market Fit Simulator

The private `/market-fit` portal contains an additive local-only 36-month simulator. Money Universe remains authoritative for macro calculations through `simulateEconomy`; Market Fit remains authoritative for product funnel and unit economics. The bridge never mutates either source model.

`IntegratedMarketScenario` contains macro inputs, the Market Fit scenario, a dated model-cost catalog, versioned bridge policy, horizon, and evidence metadata. Each monthly snapshot records macro inputs and outputs, bounded modifiers, product funnel results, API cost status, revenue, costs, profit, overlay signals, warnings, and derived next-month context.

Base mode holds macro inputs constant. Coupled mode applies the explicit Skyloop overlay to next-month trust and productivity. Both modes are deterministic and comparable. All fixture values are simulated. Missing or unverified required provider prices block API cost, gross profit, margin, and break-even. No billing, payment credentials, external ingestion, database migration, deployment, or customer data is involved.
