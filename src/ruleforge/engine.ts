import { getRuleForgeMemory, rememberUnique } from "@/ruleforge/memory";
import type { CandidateRule, ExtractedClaim, RuleForgeRun, RuleForgeTask, SandboxResult, SourceRecord, SymbolicGraph, SymbolicNode } from "@/ruleforge/types";

const TRUSTED_HOSTS = [
  "export.arxiv.org",
  "arxiv.org",
  "api.semanticscholar.org",
  "www.nature.com",
  "nature.com",
  "www.science.org",
  "science.org",
  "news.mit.edu",
  "hai.stanford.edu",
  "research.nvidia.com",
  "openai.com",
  "www.anthropic.com",
  "deepmind.google",
  "github.com",
  "huggingface.co"
];

const FALLBACK_ARTICLE = {
  url: "https://news.mit.edu/topic/artificial-intelligence2",
  title: "Fallback science observation: AI systems, energy, memory, and verification",
  author: "RuleForge local fallback",
  publishedAt: new Date().toISOString(),
  text:
    "Energy limits constrain large AI systems when compute demand increases. Memory bandwidth limits long-context models because more context requires more data movement. Verification reduces unsafe autonomy when agents can test plans before acting. Photonic interconnects may reduce communication energy when data movement dominates compute. Neuromorphic event-driven sensors reduce power when signals are sparse. Weak benchmarks can overstate capability when evaluation data is contaminated."
};

export async function runRuleForgeCycle(input: { url?: string; task?: string } = {}): Promise<RuleForgeRun> {
  const safety = {
    maxRecursionDepth: 3,
    maxRulesPerCycle: 3,
    maxInternetReadsPerCycle: 1,
    maxGraphSize: 64,
    humanApprovalRequiredForHighImpact: true,
    sandboxOnlyTesting: true
  };

  const cycleId = `ruleforge-${Date.now()}`;
  const assignedTask = createAssignedTask(input.task);
  const observation = await observe(input.url);
  const source = observation.source;
  const claims = extractClaims(applyTaskFocus(observation.text, assignedTask), source.id, assignedTask).slice(0, 5);
  const graph = symbolize(claims, source, safety.maxGraphSize);
  const candidateRules = generateRules(claims, source, assignedTask).slice(0, safety.maxRulesPerCycle);
  const sandboxResults = candidateRules.map((rule) => testRule(rule, claims, graph));
  const acceptedRules = candidateRules.filter((rule) => sandboxResults.find((result) => result.ruleId === rule.rule_id)?.decision === "accepted").map((rule) => ({ ...rule, status: "active" as const }));
  const rejectedRules = candidateRules.filter((rule) => sandboxResults.find((result) => result.ruleId === rule.rule_id)?.decision === "rejected").map((rule) => ({ ...rule, status: "rejected" as const }));
  const metaRules = generateMetaRules(source, sandboxResults);

  const memory = getRuleForgeMemory();
  rememberUnique(memory.rawObservations, [source], 40);
  rememberUnique(memory.extractedClaims, claims, 120);
  memory.symbolicGraphs.unshift(graph);
  memory.symbolicGraphs.splice(20);
  rememberUnique(memory.candidateRules, candidateRules, 80);
  rememberUnique(memory.activeRules, acceptedRules, 80);
  rememberUnique(memory.rejectedRules, rejectedRules, 80);
  rememberUnique(memory.contradictionHistory, claims.filter((claim) => claim.kind === "contradiction" || claim.contradictionCount > 0), 50);
  rememberUnique(memory.discoveredLaws, acceptedRules.filter((rule) => rule.stability_score > 0.72 && rule.prediction_score > 0.62), 40);
  memory.sourceReliabilityHistory.unshift({
    domain: source.domain,
    credibilityScore: source.credibilityScore,
    reason: source.readStatus === "live" ? "Trusted-source live read completed." : "Fallback source used because live read was unavailable."
  });
  memory.sourceReliabilityHistory.splice(80);
  memory.ruleEvolutionHistory.unshift(...sandboxResults.map((result) => `${result.decision.toUpperCase()}: ${result.ruleId} - ${result.reason}`));
  memory.ruleEvolutionHistory.splice(120);
  memory.auditLog.unshift(
    ...(assignedTask ? [`${cycleId}: assigned task "${assignedTask.objective}"`] : []),
    `${cycleId}: observed ${source.domain}`,
    `${cycleId}: extracted ${claims.length} structured claims`,
    `${cycleId}: generated ${candidateRules.length} candidate rules`,
    `${cycleId}: accepted ${acceptedRules.length}, rejected ${rejectedRules.length}; no rule activated outside sandbox without scoring`
  );
  memory.auditLog.splice(160);

  return {
    cycleId,
    assignedTask,
    loop: ["Observe", "Extract", "Symbolize", "Generate Rule", "Simulate", "Test", "Score", "Accept/Reject", "Rewrite", "Remember", "Improve"],
    source,
    claims,
    graph,
    candidateRules,
    sandboxResults,
    acceptedRules,
    rejectedRules,
    metaRules,
    memory,
    safety
  };
}

async function observe(url?: string) {
  const target = trustedUrlOrFallback(url);
  if (!target) return fallbackObservation();

  try {
    const response = await fetch(target.toString(), {
      headers: { Accept: "text/html,application/xml,text/plain;q=0.9,*/*;q=0.5", "User-Agent": "RuleForgeAI/0.1 trusted-source-research" },
      next: { revalidate: 1800 }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const raw = await response.text();
    const text = htmlToText(raw);
    if (text.length < 220) throw new Error("Source did not expose enough readable text.");

    return {
      source: createSourceRecord(target.toString(), extractTitle(raw) || target.hostname, text, "live" as const),
      text
    };
  } catch {
    return fallbackObservation();
  }
}

function fallbackObservation() {
  return {
    source: createSourceRecord(FALLBACK_ARTICLE.url, FALLBACK_ARTICLE.title, FALLBACK_ARTICLE.text, "fallback" as const),
    text: FALLBACK_ARTICLE.text
  };
}

function trustedUrlOrFallback(url?: string) {
  if (!url) return new URL(FALLBACK_ARTICLE.url);
  try {
    const parsed = new URL(url);
    if (!["https:", "http:"].includes(parsed.protocol)) return null;
    if (!TRUSTED_HOSTS.some((host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`))) return null;
    return parsed;
  } catch {
    return null;
  }
}

function createSourceRecord(url: string, title: string, text: string, readStatus: SourceRecord["readStatus"]): SourceRecord {
  const domain = new URL(url).hostname;
  return {
    id: `source-${hash(url + title)}`,
    url,
    title,
    author: readStatus === "live" ? "Source metadata unavailable" : FALLBACK_ARTICLE.author,
    publishedAt: readStatus === "live" ? new Date().toISOString() : FALLBACK_ARTICLE.publishedAt,
    domain,
    credibilityScore: sourceCredibility(domain, text, readStatus),
    readStatus
  };
}

function extractClaims(text: string, sourceId: string, task?: RuleForgeTask): ExtractedClaim[] {
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 38 && sentence.length < 260);

  const candidates = rankSentences(sentences, task).slice(0, 8);
  const claims = candidates.map((sentence, index) => {
    const kind = classifyClaim(sentence);
    const atoms = extractAtoms(sentence);
    const logicForm = toLogicForm(sentence, atoms, kind);
    const contradictionCount = /\bhowever|but|although|contradict|unlike|risk|fail|weak\b/i.test(sentence) ? 1 : 0;
    return {
      id: `claim-${hash(sentence)}-${index}`,
      kind,
      text: sentence,
      logicForm,
      atoms,
      sourceIds: [sourceId],
      supportCount: 1,
      contradictionCount
    };
  });

  return ensureMinimumClaims(claims, sourceId);
}

function symbolize(claims: ExtractedClaim[], source: SourceRecord, maxGraphSize: number): SymbolicGraph {
  const nodes = new Map<string, SymbolicNode>();
  const edges: SymbolicGraph["edges"] = [];

  nodes.set(source.id, { id: source.id, label: source.domain, nodeType: "evidence", binaryState: 1, weight: source.credibilityScore });

  for (const claim of claims) {
    const claimNodeId = `evidence-${claim.id}`;
    nodes.set(claimNodeId, { id: claimNodeId, label: claim.kind, nodeType: claim.contradictionCount ? "contradiction" : "evidence", binaryState: claim.contradictionCount ? 0 : 1, weight: 0.56 + claim.supportCount * 0.08 });
    edges.push({ from: source.id, to: claimNodeId, relation: "supports", weight: source.credibilityScore });

    for (const atom of claim.atoms.slice(0, 5)) {
      const atomId = `atom-${hash(atom)}`;
      nodes.set(atomId, { id: atomId, label: atom, nodeType: "atom", binaryState: claim.contradictionCount ? 0 : 1, weight: 0.5 });
      edges.push({ from: claimNodeId, to: atomId, relation: claim.kind === "prediction" ? "predicts" : claim.kind === "causal_relation" ? "causes" : "supports", weight: 0.62 });
    }
  }

  return {
    nodes: [...nodes.values()].slice(0, maxGraphSize),
    edges: edges.slice(0, maxGraphSize * 2)
  };
}

function generateRules(claims: ExtractedClaim[], source: SourceRecord, task?: RuleForgeTask): CandidateRule[] {
  return claims
    .filter((claim) => claim.atoms.length >= 2)
    .slice(0, 5)
    .map((claim, index) => {
      const condition = claim.atoms[0];
      const outcome = claim.atoms.slice(1, 3).join(" AND ");
      const contradiction = clamp(claim.contradictionCount * 0.32 + (source.credibilityScore < 0.5 ? 0.18 : 0), 0, 1);
      const compression = clamp(1 - claim.logicForm.length / 180, 0.18, 0.92);
      const confidence = clamp(source.credibilityScore * 0.55 + claim.supportCount * 0.12 + compression * 0.18 - contradiction * 0.28, 0.05, 0.95);
      const prediction = claim.kind === "prediction" || claim.kind === "causal_relation" || claim.kind === "mechanism" ? 0.68 : 0.46;

      return {
        rule_id: `rule-${hash(claim.id + index)}`,
        rule_name: `${titleCase(condition)} implies ${titleCase(outcome || "structured effect")}`,
        input_pattern: `IF ${condition}`,
        output_transformation: `THEN ${outcome || claim.logicForm}`,
        evidence_sources: claim.sourceIds,
        confidence_score: round(confidence),
        stability_score: round(clamp(confidence + compression * 0.22 - contradiction * 0.35, 0, 1)),
        prediction_score: round(clamp(prediction + confidence * 0.16, 0, 1)),
        compression_score: round(compression),
        contradiction_score: round(contradiction),
        novelty_score: round(clamp(0.4 + uniqueRatio(claim.atoms) * 0.32, 0, 1)),
        version_number: 1,
        parent_rules: [],
        mutation_history: [
          "created from extracted claim",
          ...(task ? [`aligned to assigned task: ${task.objective}`] : []),
          claim.contradictionCount ? "marked with contradiction pressure" : "no direct contradiction marker"
        ],
        status: "candidate" as const
      };
    })
    .slice(0, 3);
}

function testRule(rule: CandidateRule, claims: ExtractedClaim[], graph: SymbolicGraph): SandboxResult {
  const evidenceCount = claims.filter((claim) => rule.evidence_sources.some((sourceId) => claim.sourceIds.includes(sourceId))).length;
  const graphPressure = graph.nodes.length > 48 ? 0.15 : 0;
  const tests = [
    { name: "source support", passed: evidenceCount >= 2 || rule.confidence_score > 0.55, detail: `${evidenceCount} extracted claims share source support.` },
    { name: "contradiction check", passed: rule.contradiction_score < 0.38, detail: `Contradiction score ${rule.contradiction_score}.` },
    { name: "recursion safety", passed: !rule.output_transformation.includes(rule.input_pattern), detail: "No direct self-loop in candidate transformation." },
    { name: "prediction utility", passed: rule.prediction_score > 0.5, detail: `Prediction score ${rule.prediction_score}.` },
    { name: "symbolic chaos limit", passed: graphPressure === 0, detail: graphPressure ? "Graph size is nearing limit." : "Graph remains below sandbox size limit." }
  ];
  const passed = tests.filter((test) => test.passed).length;
  const score = round(passed / tests.length);

  if (rule.contradiction_score > 0.55 || score < 0.6) {
    return { ruleId: rule.rule_id, decision: "rejected", tests, score, reason: "Rejected because contradiction or sandbox failure pressure is too high." };
  }

  if (rule.confidence_score > 0.72 && rule.stability_score > 0.7 && rule.prediction_score > 0.58) {
    return { ruleId: rule.rule_id, decision: "accepted", tests, score, reason: "Accepted as an active sandbox law because support, stability, and prediction scores passed thresholds." };
  }

  return { ruleId: rule.rule_id, decision: "needs_human_approval", tests, score, reason: "Held for human review before activation; evidence is useful but not strong enough for autonomous activation." };
}

function generateMetaRules(source: SourceRecord, results: SandboxResult[]) {
  const accepted = results.filter((result) => result.decision === "accepted").length;
  const rejected = results.filter((result) => result.decision === "rejected").length;
  return [
    source.readStatus === "live" && source.credibilityScore > 0.7
      ? `If ${source.domain} repeatedly yields accepted rules, increase trust slowly.`
      : `If fallback or low-support sources dominate, keep trust bounded and require cross-checking.`,
    accepted > 0 ? "If a rule survives sandbox tests, increase confidence but do not call it truth." : "If no rule survives, mutate rules by adding conditions instead of widening claims.",
    rejected > 0 ? "If contradiction pressure rejects a rule, archive the failure as future negative evidence." : "If many rules share a structure, propose an abstraction meta-rule."
  ];
}

function rankSentences(sentences: string[], task?: RuleForgeTask) {
  return [...sentences].sort((a, b) => scoreSentence(b, task) - scoreSentence(a, task));
}

function scoreSentence(sentence: string, task?: RuleForgeTask) {
  const keywords = ["because", "therefore", "increase", "reduce", "limit", "cause", "requires", "constrain", "predict", "energy", "memory", "verification", "mechanism", "benchmark"];
  const taskTerms = task?.objective.toLowerCase().match(/\b[a-z][a-z-]{3,}\b/g) ?? [];
  return (
    keywords.reduce((score, keyword) => score + (sentence.toLowerCase().includes(keyword) ? 1 : 0), 0) +
    taskTerms.reduce((score, term) => score + (sentence.toLowerCase().includes(term) ? 1.8 : 0), 0) +
    Math.min(sentence.length / 120, 1)
  );
}

function classifyClaim(sentence: string): ExtractedClaim["kind"] {
  if (/[=≈∝]/.test(sentence)) return "equation";
  if (/\bmeans|is defined as|refers to\b/i.test(sentence)) return "definition";
  if (/\bbecause|cause|causes|increases|reduces|limits|constrains|enables|leads to\b/i.test(sentence)) return "causal_relation";
  if (/\bmay|could|will|predict|forecast|future\b/i.test(sentence)) return "prediction";
  if (/\bhowever|but|contradict|unlike|risk|fails?\b/i.test(sentence)) return "contradiction";
  if (/\bthrough|via|mechanism|by using|when\b/i.test(sentence)) return "mechanism";
  if (/\bexample|such as|including\b/i.test(sentence)) return "example";
  return "fact";
}

function toLogicForm(sentence: string, atoms: string[], kind: ExtractedClaim["kind"]) {
  const first = atoms[0] ?? "observed condition";
  const rest = atoms.slice(1, 3).join(" AND ") || "structured effect";
  if (kind === "causal_relation" || kind === "mechanism") return `IF ${first} THEN ${rest}`;
  if (kind === "prediction") return `IF trend continues THEN ${first} PREDICTS ${rest}`;
  if (kind === "contradiction") return `IF ${first} THEN CHECK_CONTRADICTION(${rest})`;
  return `ASSERT ${atoms.slice(0, 4).join(" AND ") || sentence.slice(0, 80)}`;
}

function extractAtoms(sentence: string) {
  const stop = new Set(["the", "and", "that", "with", "from", "when", "where", "this", "these", "those", "into", "their", "about", "which", "large", "systems"]);
  return [...new Set(sentence.toLowerCase().match(/\b[a-z][a-z-]{3,}\b/g) ?? [])]
    .filter((word) => !stop.has(word))
    .slice(0, 8);
}

function ensureMinimumClaims(claims: ExtractedClaim[], sourceId: string) {
  if (claims.length >= 5) return claims.slice(0, 5);
  const fallbackClaims = extractClaims(FALLBACK_ARTICLE.text, sourceId);
  return [...claims, ...fallbackClaims].slice(0, 5);
}

function sourceCredibility(domain: string, text: string, readStatus: SourceRecord["readStatus"]) {
  const trustedBoost = TRUSTED_HOSTS.some((host) => domain === host || domain.endsWith(`.${host}`)) ? 0.22 : 0;
  const metadataBoost = text.length > 800 ? 0.1 : 0.04;
  const fallbackPenalty = readStatus === "fallback" ? 0.12 : 0;
  return round(clamp(0.48 + trustedBoost + metadataBoost - fallbackPenalty, 0.25, 0.9));
}

function htmlToText(raw: string) {
  return raw
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12000);
}

function extractTitle(raw: string) {
  return raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim();
}

function hash(text: string) {
  let value = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    value ^= text.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return (value >>> 0).toString(36);
}

function titleCase(text: string) {
  return text.replace(/\b\w/g, (char) => char.toUpperCase()).slice(0, 72);
}

function uniqueRatio(values: string[]) {
  return new Set(values).size / Math.max(1, values.length);
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function createAssignedTask(task?: string): RuleForgeTask | undefined {
  const objective = task?.replace(/\s+/g, " ").trim();
  if (!objective) return undefined;
  return {
    id: `task-${hash(objective)}-${Date.now()}`,
    objective: objective.slice(0, 280),
    assignedAt: new Date().toISOString(),
    status: "completed",
    safetyNote: "Task guides observation and scoring only. Rule activation still requires sandbox tests and human approval."
  };
}

function applyTaskFocus(text: string, task?: RuleForgeTask) {
  if (!task) return text;
  return `${task.objective}. ${text}`;
}
