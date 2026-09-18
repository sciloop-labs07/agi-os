import type { AdvancedMarketAnalysisInputs, AdvancedMarketAnalysisResult, MarketAnalysisEvidencePackage } from "./market-analysis-advanced-types";

const STORAGE_KEY = "skyloop-market-analysis-v2";

export function createMarketAnalysisPackage(inputs: AdvancedMarketAnalysisInputs, result: AdvancedMarketAnalysisResult, reviewNotes: string[] = []): MarketAnalysisEvidencePackage {
  return { schemaVersion: "market-analysis-package-v2", savedAt: "2026-09-18", inputs, sources: result.sources, result, reviewNotes };
}

export function saveMarketAnalysisDraft(packageData: MarketAnalysisEvidencePackage): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(packageData)); } catch { /* Local persistence is optional. */ }
}

export function loadMarketAnalysisDraft(): MarketAnalysisEvidencePackage | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MarketAnalysisEvidencePackage;
    return parsed?.schemaVersion === "market-analysis-package-v2" ? parsed : null;
  } catch { return null; }
}

export function clearMarketAnalysisDraft(): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* Local persistence is optional. */ }
}

