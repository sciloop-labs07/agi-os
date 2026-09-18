import { validateMarketEvidence } from "./market-analysis-engine";
import type { MarketEvidenceRecord } from "./market-analysis-types";

const fields = ["id", "sourceName", "sourceTier", "sourceUrl", "publisher", "metric", "value", "unit", "geography", "segment", "language", "periodStart", "periodEnd", "retrievedAt", "publicationDate", "methodology", "license", "status", "confidence", "owner", "invalidationCondition", "notes"] as const;

function csvRows(text: string): string[][] {
  return text.trim().split(/\r?\n/).map((line) => line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, "")));
}

export function parseMarketEvidenceImport(text: string, filename = "evidence.json", now = "2026-09-18"): { records: MarketEvidenceRecord[]; errors: string[] } {
  try {
    const raw = filename.toLowerCase().endsWith(".csv") ? (() => { const rows = csvRows(text); const headers = rows[0] ?? []; return rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]))); })() : JSON.parse(text);
    const candidates: Array<Record<string, unknown>> = Array.isArray(raw) ? raw : Array.isArray(raw?.sources) ? raw.sources : [];
    const records = candidates.map((candidate) => ({ ...candidate, value: candidate.value === "" || candidate.value === undefined ? null : Number(candidate.value) })) as unknown as MarketEvidenceRecord[];
    const errors = records.flatMap((record, index) => validateMarketEvidence(record, now).map((error) => `record ${index + 1}: ${error}`));
    const missingSchemaFields = records.flatMap((record, index) => fields.filter((field) => record[field] === undefined || record[field] === null || (typeof record[field] === "string" && record[field].trim() === "")).map((field) => `record ${index + 1}: missing ${field}`));
    if (missingSchemaFields.length > 0) return { records: [], errors: missingSchemaFields };
    return { records, errors };
  } catch { return { records: [], errors: ["The evidence file is not valid JSON or CSV."] }; }
}
