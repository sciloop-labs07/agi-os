import { createInitialCognitiveLabState } from "./lab-state";
import type { Candidate, CognitiveLabState, LabPanelTab } from "./types";

const STORAGE_KEY = "sciloop:cognitive-lab:v1";
const tabs: LabPanelTab[] = ["properties", "evaluation", "evolution", "history", "protocol", "settings"];

function normalizeCandidate(candidate: Candidate): Candidate {
  return { ...candidate, lineage: candidate.lineage ?? { generation: 1, rootCandidateId: candidate.id, branchId: `branch-${candidate.id}`, branchName: "Original" } };
}

export function loadCognitiveLabState(): CognitiveLabState {
  const fallback = createInitialCognitiveLabState();
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<CognitiveLabState>;
    if (!parsed.experiment?.candidates?.length) return fallback;
    const candidates = parsed.experiment.candidates.map(normalizeCandidate);
    const activeCandidateId = candidates.some((candidate) => candidate.id === parsed.activeCandidateId) ? parsed.activeCandidateId! : candidates[0].id;
    return {
      ...fallback,
      ...parsed,
      experiment: { ...fallback.experiment, ...parsed.experiment, candidates },
      activeCandidateId,
      history: parsed.history ?? {},
      evaluationHistory: parsed.evaluationHistory ?? {},
      evolution: parsed.evolution ?? { events: [] },
      protocol: parsed.protocol ?? fallback.protocol,
      ui: { ...fallback.ui, ...(parsed.ui ?? {}), activePanel: tabs.includes(parsed.ui?.activePanel as LabPanelTab) ? parsed.ui!.activePanel! : "properties" }
    };
  } catch {
    return fallback;
  }
}

export function saveCognitiveLabState(state: CognitiveLabState): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Storage is optional and may be unavailable in private browsing. */ }
}

export function clearCognitiveLabState(): void {
  if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
}
