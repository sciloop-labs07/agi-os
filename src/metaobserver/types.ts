import type { RuleForgeRun } from "@/ruleforge/types";

export type MetaObserverScores = {
  learning_progress_score: number;
  chaos_score: number;
  novelty_score: number;
  stability_score: number;
  contradiction_score: number;
  intelligence_growth_score: number;
  exploration_vs_exploitation_score: number;
};

export type MetaObserverDecision = {
  id: string;
  createdAt: string;
  currentSystemState: string;
  mainDetectedPattern: string;
  mainDanger: string;
  mainOpportunity: string;
  recommendedNextAction: string;
  reason: string;
  confidenceScore: number;
  scores: MetaObserverScores;
  dangerWarnings: string[];
  breakthroughSignals: string[];
  strategicQuestions: Array<{ question: string; answer: string }>;
  observedCycleId?: string;
};

export type MetaObserverInput = {
  run?: RuleForgeRun;
};
