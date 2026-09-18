import type { MarketCompetitionRecord, MarketEvidenceRecord, MarketSegment } from "./market-analysis-types";

const retrievedAt = "2026-09-18";
const assumption = (id: string, sourceName: string, sourceUrl: string, publisher: string, metric: string, value: number, unit: string, geography = "global", segment = "global-English-self-directed"): MarketEvidenceRecord => ({
  id, sourceName, sourceTier: "tier-1-authoritative", sourceUrl, publisher, metric, value, unit, geography, segment, language: "English", periodStart: null, periodEnd: null, retrievedAt, publicationDate: null, methodology: "Curated planning fixture; not a live import.", license: "Verify source terms before redistribution.", status: "assumption", confidence: "low", owner: "Skyloop Market Fit", invalidationCondition: "Replace with a dated, source-specific observation before release decisions.", notes: "URL is authoritative context; the local value is an explicit assumption and must not be presented as measured."
});

export const marketEvidenceRegistry: MarketEvidenceRecord[] = [
  assumption("world-bank-population", "World Bank Indicators API", "https://datahelpdesk.worldbank.org/knowledgebase/articles/889392", "World Bank", "population", 8000000000, "people"),
  assumption("world-bank-education", "World Bank Education Statistics", "https://databank.worldbank.org/databases/education", "World Bank", "target education-stage share", 0.2, "fraction"),
  assumption("itu-connectivity", "ITU ICT Statistics", "https://www.itu.int/en/ITU-D/Statistics/pages/stat/default.aspx", "International Telecommunication Union", "internet access", 0.68, "fraction"),
  assumption("unesco-ai-education", "UNESCO AI and education resources", "https://www.unesco.org/en/artificial-intelligence/resources", "UNESCO", "visual-learning problem incidence", 0.35, "fraction"),
  assumption("census-idb", "U.S. Census International Database", "https://www.census.gov/programs-surveys/international-programs/about/idb.html", "U.S. Census Bureau", "demographic context", 1, "index", "United States"),
  assumption("oecd-education", "OECD Education Data", "https://www.oecd.org/en/topics/education.html", "OECD", "education access context", 1, "index", "OECD"),
  { id: "market-unknown-wtp", sourceName: "Willingness-to-pay evidence", sourceTier: "tier-2-primary", sourceUrl: null, publisher: "Not collected", metric: "willingness to pay", value: null, unit: "status", geography: "global", segment: "global-English-self-directed", language: "English", periodStart: null, periodEnd: null, retrievedAt, publicationDate: null, methodology: "Requires interviews or pricing experiment.", license: "N/A", status: "needs-evidence", confidence: "low", owner: "Skyloop Market Fit", invalidationCondition: "Collect consented primary evidence.", notes: "No pricing conclusion is allowed from this placeholder." }
];

export const marketSegments: MarketSegment[] = [
  { id: "global-English-self-directed", audience: "Self-directed learners", geography: "global", language: "English", educationStage: "secondary, university, independent", deviceProfile: "mobile and desktop web", connectivityProfile: "consumer internet", jobToBeDone: "Understand difficult scientific concepts visually", problemIntensity: 55, accessConstraints: ["language fit", "connectivity", "accessibility"], willingnessToPayStatus: "needs-evidence", evidenceRefs: ["world-bank-population", "world-bank-education", "itu-connectivity"] },
  { id: "united-states-self-directed", audience: "Self-directed learners", geography: "United States", language: "English", educationStage: "secondary, university, independent", deviceProfile: "mobile and desktop web", connectivityProfile: "consumer internet", jobToBeDone: "Understand difficult scientific concepts visually", problemIntensity: 60, accessConstraints: ["price sensitivity", "accessibility"], willingnessToPayStatus: "needs-evidence", evidenceRefs: ["census-idb", "oecd-education"] },
  { id: "india-self-directed", audience: "Self-directed learners", geography: "India", language: "English", educationStage: "secondary, university, independent", deviceProfile: "mobile-first web", connectivityProfile: "consumer internet", jobToBeDone: "Understand difficult scientific concepts visually", problemIntensity: 64, accessConstraints: ["language fit", "device constraints", "price sensitivity"], willingnessToPayStatus: "needs-evidence", evidenceRefs: ["world-bank-population", "itu-connectivity"] },
  { id: "science-educators", audience: "Science educators", geography: "global", language: "English", educationStage: "professional", deviceProfile: "desktop and classroom display", connectivityProfile: "institutional internet", jobToBeDone: "Explain complex concepts with trustworthy visual evidence", problemIntensity: 68, accessConstraints: ["curriculum fit", "procurement"], willingnessToPayStatus: "needs-evidence", evidenceRefs: ["unesco-ai-education"] },
  { id: "researchers", audience: "Researchers", geography: "global", language: "English", educationStage: "professional", deviceProfile: "desktop web", connectivityProfile: "institutional internet", jobToBeDone: "Communicate models and evidence clearly", problemIntensity: 52, accessConstraints: ["scientific review", "workflow fit"], willingnessToPayStatus: "needs-evidence", evidenceRefs: ["unesco-ai-education"] }
];

export const marketCompetition: MarketCompetitionRecord[] = [
  { id: "competitor-evidence-needed", name: "Competitor evidence queue", category: "primary-market research", sourceUrl: null, priceUsd: null, capability: "Collect first-party pricing and capability evidence before comparison.", audience: "All segments", status: "needs-evidence", evidenceRefs: [], notes: "No competitor claim is made without an original source." }
];

