import { getMetaObserverTimeline, rememberMetaObserverDecision } from "@/metaobserver/memory";
import type { MetaObserverDecision, MetaObserverInput, MetaObserverScores } from "@/metaobserver/types";
import { getRuleForgeMemory } from "@/ruleforge/memory";
import type { CandidateRule, RuleForgeMemory, RuleForgeRun, SandboxResult } from "@/ruleforge/types";

export function analyzeRuleForge(input: MetaObserverInput = {}) {
  const memory = getRuleForgeMemory();
  const run = isRuleForgeRunLike(input.run) ? input.run : undefined;
  const candidateRules = arrayOr(run?.candidateRules, memory.candidateRules.slice(0, 6));
  const activeRules = arrayOr(run?.acceptedRules, memory.activeRules.slice(0, 6));
  const rejectedRules = arrayOr(run?.rejectedRules, memory.rejectedRules.slice(0, 6));
  const sandboxResults = arrayOr(run?.sandboxResults, []);
  const claims = arrayOr(run?.claims, []);
  const contradictions = claims.filter((claim) => claim.contradictionCount > 0).length || memory.contradictionHistory.length;
  const graphNodes = arrayOr(run?.graph?.nodes, memory.symbolicGraphs[0]?.nodes ?? []).length;
  const graphEdges = arrayOr(run?.graph?.edges, memory.symbolicGraphs[0]?.edges ?? []).length;

  const scores = scoreSystem({
    memory,
    run,
    candidateRules,
    activeRules,
    rejectedRules,
    sandboxResults,
    contradictions,
    graphNodes,
    graphEdges
  });

  const mainDetectedPattern = detectPattern(scores, candidateRules, activeRules, rejectedRules, sandboxResults);
  const mainDanger = detectDanger(scores, rejectedRules, contradictions, graphNodes);
  const mainOpportunity = detectOpportunity(scores, candidateRules, activeRules, memory);
  const recommendedNextAction = recommendAction(scores, candidateRules, activeRules, rejectedRules, contradictions);
  const currentSystemState = describeState(run, memory, candidateRules, activeRules, rejectedRules);
  const reason = explainRecommendation(scores, recommendedNextAction);

  const decision: MetaObserverDecision = {
    id: `metaobserver-${run?.cycleId ?? "memory"}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    currentSystemState,
    mainDetectedPattern,
    mainDanger,
    mainOpportunity,
    recommendedNextAction,
    reason,
    confidenceScore: confidence(scores, sandboxResults),
    scores,
    dangerWarnings: dangerWarnings(scores, rejectedRules, contradictions),
    breakthroughSignals: breakthroughSignals(scores, activeRules, candidateRules),
    strategicQuestions: strategicAnswers(scores, candidateRules, activeRules, rejectedRules, memory),
    observedCycleId: run?.cycleId
  };

  const timeline = rememberMetaObserverDecision(decision);
  return { decision, timeline };
}

function scoreSystem(payload: {
  memory: RuleForgeMemory;
  run?: RuleForgeRun;
  candidateRules: CandidateRule[];
  activeRules: CandidateRule[];
  rejectedRules: CandidateRule[];
  sandboxResults: SandboxResult[];
  contradictions: number;
  graphNodes: number;
  graphEdges: number;
}): MetaObserverScores {
  const { memory, candidateRules, activeRules, rejectedRules, sandboxResults, contradictions, graphNodes, graphEdges } = payload;
  const totalRules = Math.max(1, candidateRules.length + activeRules.length + rejectedRules.length);
  const acceptanceRate = activeRules.length / totalRules;
  const rejectionRate = rejectedRules.length / totalRules;
  const meanRuleStability = mean(candidateRules.concat(activeRules).map((rule) => rule.stability_score));
  const meanPrediction = mean(candidateRules.concat(activeRules).map((rule) => rule.prediction_score));
  const meanNovelty = mean(candidateRules.concat(activeRules).map((rule) => rule.novelty_score));
  const sandboxPassRate = sandboxResults.length ? mean(sandboxResults.map((result) => result.score)) : acceptanceRate;
  const contradictionScore = clamp(contradictions / Math.max(1, memory.extractedClaims.length || payload.run?.claims.length || 5));
  const graphPressure = clamp((graphNodes + graphEdges * 0.45) / 96);
  const repeatedFailures = memory.ruleEvolutionHistory.filter((item) => item.startsWith("REJECTED")).length;
  const chaos = clamp(rejectionRate * 0.35 + contradictionScore * 0.32 + graphPressure * 0.22 + repeatedFailures / 80);
  const stability = clamp(meanRuleStability * 0.45 + sandboxPassRate * 0.35 + acceptanceRate * 0.2 - contradictionScore * 0.22);
  const learning = clamp((memory.extractedClaims.length > 0 ? 0.18 : 0) + sandboxPassRate * 0.28 + meanPrediction * 0.27 + acceptanceRate * 0.18 + memory.rawObservations.length / 60);
  const intelligenceGrowth = clamp(learning * 0.42 + stability * 0.34 + meanPrediction * 0.24 - chaos * 0.24);
  const explorationVsExploitation = clamp(meanNovelty * 0.55 + (1 - acceptanceRate) * 0.25 + candidateRules.length / 16);

  return {
    learning_progress_score: round(learning),
    chaos_score: round(chaos),
    novelty_score: round(meanNovelty),
    stability_score: round(stability),
    contradiction_score: round(contradictionScore),
    intelligence_growth_score: round(intelligenceGrowth),
    exploration_vs_exploitation_score: round(explorationVsExploitation)
  };
}

function detectPattern(scores: MetaObserverScores, candidates: CandidateRule[], active: CandidateRule[], rejected: CandidateRule[], results: SandboxResult[]) {
  if (active.length > 0 && scores.stability_score > 0.62) return "Evidence-weighted rules are beginning to survive sandbox pressure.";
  if (rejected.length > active.length && scores.chaos_score > 0.45) return "The system is generating more rules than it can stabilize.";
  if (results.some((result) => result.decision === "needs_human_approval")) return "Several rules are promising but blocked by human-approval safety gates.";
  if (candidates.length > 0) return "RuleForge is extracting structured claims and converting them into testable rule candidates.";
  return "RuleForge is waiting for stronger observations before meaningful rule evolution can begin.";
}

function detectDanger(scores: MetaObserverScores, rejected: CandidateRule[], contradictions: number, graphNodes: number) {
  if (scores.chaos_score > 0.62) return "Symbolic chaos is rising; too many weak or contradictory rules may pollute memory.";
  if (contradictions > 2) return "Contradiction pressure is high; internet claims need cross-checking before wider rule generation.";
  if (rejected.length > 2) return "Repeated sandbox rejection suggests the current extraction pattern is too broad.";
  if (graphNodes > 52) return "Graph pressure is approaching the safe MVP boundary.";
  return "No immediate runaway signal; the main danger is over-trusting single-source evidence.";
}

function detectOpportunity(scores: MetaObserverScores, candidates: CandidateRule[], active: CandidateRule[], memory: RuleForgeMemory) {
  const best = candidates.concat(active).sort((a, b) => b.prediction_score + b.stability_score - (a.prediction_score + a.stability_score))[0];
  if (best) return `Deep-test the candidate "${best.rule_name}" because it has the strongest stability/prediction profile.`;
  if (memory.sourceReliabilityHistory.length > 1) return "Compare repeated source reliability history and specialize learning toward the most stable domain.";
  if (scores.novelty_score > 0.65) return "Novel symbolic structures are appearing; preserve them but demand counterexamples.";
  return "Run one constrained science/technology source cycle and collect enough claims for a stable baseline.";
}

function recommendAction(scores: MetaObserverScores, candidates: CandidateRule[], active: CandidateRule[], rejected: CandidateRule[], contradictions: number) {
  if (scores.chaos_score > 0.62) return "Reduce mutation pressure, limit new rules to one domain, and cross-check claims before generating more candidates.";
  if (contradictions > 1) return "Run contradiction search before accepting new laws; prioritize sources that can confirm or refute the disputed claims.";
  if (active.length === 0 && candidates.length > 0) return "Select the highest-stability candidate for deeper sandbox testing instead of widening exploration.";
  if (active.length > 0 && rejected.length <= active.length) return "Exploit the surviving rule pattern: run a nearby domain experiment and test whether prediction accuracy transfers.";
  return "Run a narrow trusted-source observation cycle, then generate only three candidate rules and score them conservatively.";
}

function describeState(run: RuleForgeRun | undefined, memory: RuleForgeMemory, candidates: CandidateRule[], active: CandidateRule[], rejected: CandidateRule[]) {
  const source = run?.source.domain ?? memory.rawObservations[0]?.domain ?? "no source yet";
  return `RuleForge is observing ${source}, has ${candidates.length} candidate rule(s), ${active.length} accepted sandbox law(s), and ${rejected.length} rejected rule(s) in the current strategic window.`;
}

function explainRecommendation(scores: MetaObserverScores, action: string) {
  return `${action} This recommendation follows from learning=${scores.learning_progress_score}, stability=${scores.stability_score}, chaos=${scores.chaos_score}, contradiction=${scores.contradiction_score}, and intelligence-growth=${scores.intelligence_growth_score}. MetaObserver recommends only; human approval is required before RuleForge behavior changes.`;
}

function confidence(scores: MetaObserverScores, results: SandboxResult[]) {
  return round(clamp(0.42 + scores.stability_score * 0.24 + scores.learning_progress_score * 0.18 + Math.min(results.length, 3) * 0.05 - scores.chaos_score * 0.12));
}

function dangerWarnings(scores: MetaObserverScores, rejected: CandidateRule[], contradictions: number) {
  const warnings: string[] = [];
  if (scores.chaos_score > 0.5) warnings.push("Chaos rising: restrict branching and graph growth.");
  if (scores.contradiction_score > 0.2 || contradictions > 0) warnings.push("Contradiction pressure detected: require cross-source verification.");
  if (rejected.length > 1) warnings.push("Repeated rejection pattern: mutate by adding conditions, not by broadening rules.");
  if (!warnings.length) warnings.push("Safety posture stable: keep sandbox-only testing and human approval gates active.");
  return warnings;
}

function breakthroughSignals(scores: MetaObserverScores, active: CandidateRule[], candidates: CandidateRule[]) {
  const signals: string[] = [];
  if (active.length > 0) signals.push("At least one rule survived sandbox scoring and can be deeper-tested.");
  if (scores.intelligence_growth_score > 0.55) signals.push("Intelligence-growth score is positive: learning, stability, and prediction are aligned.");
  const best = candidates.concat(active).sort((a, b) => b.compression_score - a.compression_score)[0];
  if (best && best.compression_score > 0.58) signals.push(`Compression signal: "${best.rule_name}" may simplify future symbolic memory.`);
  if (!signals.length) signals.push("No breakthrough yet; collect cleaner evidence before rule evolution.");
  return signals;
}

function strategicAnswers(scores: MetaObserverScores, candidates: CandidateRule[], active: CandidateRule[], rejected: CandidateRule[], memory: RuleForgeMemory) {
  const best = candidates.concat(active).sort((a, b) => b.stability_score + b.prediction_score - (a.stability_score + a.prediction_score))[0];
  const harmful = rejected.sort((a, b) => b.contradiction_score - a.contradiction_score)[0];
  return [
    { question: "Is it learning or looping?", answer: scores.learning_progress_score > 0.45 ? "Learning, but still MVP-level and evidence-limited." : "At risk of looping; it needs cleaner source diversity." },
    { question: "Stable or chaotic?", answer: scores.stability_score >= scores.chaos_score ? "More stable than chaotic right now." : "Chaos exceeds stability; slow down rule creation." },
    { question: "Which rule improves intelligence?", answer: best ? best.rule_name : "No rule deserves promotion yet." },
    { question: "Which rule is harmful?", answer: harmful ? harmful.rule_name : "No harmful rule has dominated yet." },
    { question: "What domain next?", answer: nextDomain(memory) },
    { question: "What experiment next?", answer: best ? `Run cross-source examples against "${best.rule_name}".` : "Run one more trusted-source cycle before mutation." },
    { question: "Safest next step?", answer: "Keep all changes advisory, sandboxed, and behind human approval." }
  ];
}

function nextDomain(memory: RuleForgeMemory) {
  const recent = memory.sourceReliabilityHistory[0]?.domain ?? "";
  if (recent.includes("mit")) return "AI benchmarks or arXiv papers on verification, to test whether extracted rules transfer.";
  if (recent.includes("arxiv")) return "MIT or Stanford explanatory sources, to cross-check paper claims against institutional summaries.";
  return "A narrow verification or benchmark source, because RuleForge needs predictive tests more than novelty.";
}

function mean(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function getMetaObserverState() {
  return { timeline: getMetaObserverTimeline() };
}

function arrayOr<T>(value: T[] | undefined, fallback: T[]) {
  return Array.isArray(value) ? value : fallback;
}

function isRuleForgeRunLike(value: unknown): value is RuleForgeRun {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<RuleForgeRun>;
  return (
    Array.isArray(candidate.candidateRules) ||
    Array.isArray(candidate.acceptedRules) ||
    Array.isArray(candidate.rejectedRules) ||
    Array.isArray(candidate.sandboxResults) ||
    Array.isArray(candidate.claims) ||
    Boolean(candidate.graph && Array.isArray(candidate.graph.nodes) && Array.isArray(candidate.graph.edges))
  );
}
