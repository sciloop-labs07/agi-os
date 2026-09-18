export type NetworkingGoalType = "customer" | "investor" | "talent" | "expert" | "community" | "peer";

export type RelationshipKind = "direct" | "introduced-by" | "shared-context" | "community";

export type TouchpointKind = "value-share" | "meeting" | "introduction" | "follow-up" | "message" | "note";

export type NetworkingScenarioId = "warm-introduction" | "dormant-recovery" | "weak-tie-discovery";

export type NetworkingTab = "command" | "graph" | "simulator" | "workflow" | "rules";

export type NetworkPerson = {
  id: string;
  name: string;
  role: string;
  organization: string;
  kind: NetworkingGoalType;
  tags: string[];
  source: "local" | "founder-net";
  trust: number;
  relevance: number;
  reciprocity: number;
  strength: number;
  lastTouchDays: number;
  responseRate: number;
  preferredPath: "direct" | "warm-intro" | "community";
  notes: string;
};

export type RelationshipEdge = {
  id: string;
  sourceId: string;
  targetId: string;
  kind: RelationshipKind;
  strength: number;
  trust: number;
  reciprocity: number;
  pathLength: number;
  lastTouchDays: number;
};

export type NetworkingGoal = {
  id: string;
  title: string;
  type: NetworkingGoalType;
  desiredOutcome: string;
  priority: number;
  horizonDays: number;
  createdAt: string;
};

export type NetworkingTouchpoint = {
  id: string;
  personId: string;
  kind: TouchpointKind;
  valueOffered: string;
  asking: string;
  outcome: "planned" | "positive" | "neutral" | "no-response" | "declined";
  loggedAt: string;
  nextAction?: string;
};

export type NetworkingControls = {
  goalClarity: number;
  relationshipStrength: number;
  trust: number;
  reciprocity: number;
  timing: number;
  followUpConsistency: number;
  warmPathAvailability: number;
  concentrationRisk: number;
  valueBeforeAsk: number;
};

export type NetworkingScenario = {
  id: NetworkingScenarioId;
  label: string;
  description: string;
  focus: string;
  defaultControls: NetworkingControls;
};

export type NetworkingState = {
  version: 1;
  userLabel: string;
  selectedGoalId: string;
  people: NetworkPerson[];
  edges: RelationshipEdge[];
  goals: NetworkingGoal[];
  touchpoints: NetworkingTouchpoint[];
  controls: NetworkingControls;
};

export type NetworkingMove = {
  id: string;
  personId: string;
  title: string;
  score: number;
  reason: string;
  valueOffer: string;
  nextAction: string;
  path: string;
};

export type NetworkingSimulationResult = {
  scenarioId: NetworkingScenarioId;
  label: "Local simulation";
  responseProbability: number;
  trustMovement: number;
  relationshipHealthChange: number;
  opportunityAccess: number;
  networkResilience: number;
  bottlenecks: string[];
  nextActions: string[];
  steps: Array<{ label: string; value: number; explanation: string }>;
};

export type NetworkingProjection = {
  networkHealth: number;
  freshness: number;
  trust: number;
  reciprocity: number;
  diversity: number;
  activeGoal: NetworkingGoal;
  topMoves: NetworkingMove[];
  graphSummary: { people: number; edges: number; dormant: number; touchpoints: number };
  simulation: NetworkingSimulationResult;
};
