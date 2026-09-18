import { networkingScenarios } from "./seed";
import type { NetworkPerson, NetworkingControls, NetworkingGoal, NetworkingMove, NetworkingProjection, NetworkingScenarioId, NetworkingSimulationResult, NetworkingState, NetworkingTouchpoint } from "./types";

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)));
const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

export function validateNetworkingState(state: NetworkingState): string[] {
  const issues: string[] = [];
  if (state.version !== 1) issues.push("Unsupported Networking state version.");
  if (!state.people.length) issues.push("Add at least one person before simulating.");
  if (!state.goals.length) issues.push("Create one goal before scoring next moves.");
  if (state.goals.length && !state.goals.some((goal) => goal.id === state.selectedGoalId)) issues.push("Selected goal is missing.");
  for (const person of state.people) {
    for (const [key, value] of Object.entries({ trust: person.trust, relevance: person.relevance, reciprocity: person.reciprocity, strength: person.strength, responseRate: person.responseRate })) {
      if (value < 0 || value > 100) issues.push(`${person.name}.${key} must be between 0 and 100.`);
    }
  }
  return issues;
}

function goalFit(personKind: string, goal: NetworkingGoal) {
  if (personKind === goal.type) return 100;
  if ((goal.type === "expert" || goal.type === "peer") && (personKind === "expert" || personKind === "peer")) return 82;
  if (goal.type === "community" && (personKind === "community" || personKind === "peer")) return 84;
  return 56;
}

function freshness(lastTouchDays: number) {
  return clamp(100 - lastTouchDays * 2.1);
}

export function scoreNetworkingMoves(state: NetworkingState): NetworkingMove[] {
  const goal = state.goals.find((item) => item.id === state.selectedGoalId) ?? state.goals[0];
  if (!goal) return [];
  return state.people.map((person) => {
    const freshnessScore = freshness(person.lastTouchDays);
    const pathScore = person.preferredPath === "warm-intro" ? 92 : person.preferredPath === "direct" ? 72 : 64;
    const score = clamp(
      goalFit(person.kind, goal) * 0.26 +
      person.trust * 0.18 +
      person.relevance * 0.18 +
      person.reciprocity * 0.16 +
      freshnessScore * 0.1 +
      person.responseRate * 0.07 +
      pathScore * 0.05
    );
    const dormant = person.lastTouchDays > 45;
    const path = person.preferredPath === "warm-intro" ? "warm path" : person.preferredPath === "community" ? "contribute in context" : "direct context";
    return {
      id: `move-${person.id}`,
      personId: person.id,
      title: dormant ? `Re-open context with ${person.name}` : `Offer a useful next step to ${person.name}`,
      score,
      reason: `${person.name} matches the ${goal.type} goal at ${goalFit(person.kind, goal)}%, with ${person.trust}% trust and ${person.reciprocity}% reciprocity. ${dormant ? "Freshness is the main risk." : "Momentum is available now."}`,
      valueOffer: person.kind === "customer" ? "Share a short synthesis of the problem you are investigating." : person.kind === "expert" ? "Send a precise artifact and ask for one bounded critique." : "Offer a useful introduction, insight, or resource before requesting time.",
      nextAction: dormant ? "Draft a low-pressure value-share and set one follow-up date." : "Draft a specific conversation brief with one clear outcome.",
      path
    } satisfies NetworkingMove;
  }).sort((a, b) => b.score - a.score);
}

export function simulateNetworkingScenario(state: NetworkingState, scenarioId: NetworkingScenarioId, controls: NetworkingControls = state.controls): NetworkingSimulationResult {
  const scenario = networkingScenarios.find((item) => item.id === scenarioId) ?? networkingScenarios[0];
  const goal = state.goals.find((item) => item.id === state.selectedGoalId) ?? state.goals[0];
  const bestMove = scoreNetworkingMoves(state)[0];
  const person = state.people.find((item) => item.id === bestMove?.personId);
  const relationshipBaseline = person ? average([person.trust, person.reciprocity, person.strength]) : 40;
  const scenarioModifier = scenario.id === "warm-introduction" ? controls.warmPathAvailability * 0.12 : scenario.id === "dormant-recovery" ? controls.valueBeforeAsk * 0.1 : (100 - controls.concentrationRisk) * 0.08;
  const responseProbability = clamp(controls.goalClarity * 0.18 + controls.relationshipStrength * 0.15 + controls.trust * 0.16 + controls.reciprocity * 0.14 + controls.timing * 0.1 + controls.followUpConsistency * 0.08 + controls.valueBeforeAsk * 0.09 + scenarioModifier + (person?.responseRate ?? 50) * 0.1);
  const trustMovement = clamp((controls.valueBeforeAsk - 50) * 0.28 + (controls.reciprocity - 50) * 0.24 + (controls.followUpConsistency - 50) * 0.16 - controls.concentrationRisk * 0.1, -25, 25);
  const relationshipHealthChange = clamp(trustMovement + (controls.timing - 50) * 0.12, -30, 30);
  const opportunityAccess = clamp(responseProbability * 0.45 + controls.warmPathAvailability * 0.2 + controls.goalClarity * 0.18 + relationshipBaseline * 0.17);
  const networkResilience = clamp((100 - controls.concentrationRisk) * 0.38 + controls.reciprocity * 0.24 + controls.followUpConsistency * 0.18 + (state.people.length > 5 ? 20 : 8));
  const bottlenecks = [
    controls.goalClarity < 60 ? "The ask is too vague for a high-signal response." : "Goal is specific enough to create a useful conversation.",
    controls.valueBeforeAsk < 65 ? "Value-before-ask is weak; the interaction may feel extractive." : "Value is visible before the request.",
    controls.concentrationRisk > 55 ? "Too much network value is concentrated in one cluster." : "Network concentration is within a manageable range.",
    controls.followUpConsistency < 60 ? "Follow-through is the hidden failure mode." : "Follow-through is strong enough to compound trust."
  ].filter((item) => item.includes("weak") || item.includes("vague") || item.includes("concentrated") || item.includes("failure"));
  const steps = [
    { label: "Goal clarity", value: controls.goalClarity, explanation: `A clear desired outcome gives the ${goal?.type ?? "selected"} conversation a reason to exist.` },
    { label: "Relationship quality", value: clamp(relationshipBaseline), explanation: "Trust, reciprocity, and existing strength create the initial probability floor." },
    { label: "Value before ask", value: controls.valueBeforeAsk, explanation: "Useful context reduces social friction and makes the request easier to answer." },
    { label: "Path and timing", value: clamp((controls.warmPathAvailability + controls.timing) / 2), explanation: `${scenario.focus} determine whether the right person sees the opportunity at the right moment.` },
    { label: "Compounding follow-through", value: controls.followUpConsistency, explanation: "A network becomes durable when good interactions produce reliable next steps." }
  ];
  return { scenarioId: scenario.id, label: "Local simulation", responseProbability, trustMovement, relationshipHealthChange, opportunityAccess, networkResilience, bottlenecks, nextActions: [bestMove?.nextAction ?? "Choose a goal and score your first relationship.", "Write one value-first sentence before drafting the ask.", "Schedule the next touchpoint while the context is still fresh."], steps };
}

export function buildNetworkingProjection(state: NetworkingState): NetworkingProjection {
  const goal = state.goals.find((item) => item.id === state.selectedGoalId) ?? state.goals[0];
  const freshnessScores = state.people.map((person) => freshness(person.lastTouchDays));
  const trust = clamp(average(state.people.map((person) => person.trust)));
  const reciprocity = clamp(average(state.people.map((person) => person.reciprocity)));
  const freshnessValue = clamp(average(freshnessScores));
  const kinds = new Set(state.people.map((person) => person.kind));
  const diversity = clamp((kinds.size / 6) * 100);
  const networkHealth = clamp(trust * 0.28 + reciprocity * 0.25 + freshnessValue * 0.2 + diversity * 0.15 + Math.min(100, state.people.length * 8) * 0.12);
  return {
    networkHealth,
    freshness: freshnessValue,
    trust,
    reciprocity,
    diversity,
    activeGoal: goal,
    topMoves: scoreNetworkingMoves(state).slice(0, 4),
    graphSummary: { people: state.people.length, edges: state.edges.length, dormant: state.people.filter((person) => person.lastTouchDays > 45).length, touchpoints: state.touchpoints.length },
    simulation: simulateNetworkingScenario(state, "warm-introduction")
  };
}

export function buildPersonalTouchpointEvent(person: NetworkPerson, touchpoint: NetworkingTouchpoint) {
  return {
    type: "networking.touchpoint.logged" as const,
    module: "networking" as const,
    source: "manual" as const,
    entityType: "network-person",
    entityId: person.id,
    payload: {
      personId: person.id,
      personName: person.name,
      kind: touchpoint.kind,
      valueOffered: touchpoint.valueOffered,
      asking: touchpoint.asking,
      outcome: touchpoint.outcome,
      localSimulation: true
    },
    metadata: { importance: 76, tags: ["networking", "local-portal", touchpoint.kind] }
  };
}
