export type MetricKey =
  | "energyEfficiency"
  | "computeDensity"
  | "scalability"
  | "hardwareMaturity"
  | "agiPotential"
  | "asiPotential"
  | "learningEfficiency"
  | "adaptability"
  | "safety"
  | "economicFeasibility"
  | "physicsLimits"
  | "reasoningCapability"
  | "realWorldInteraction";

export type KnowledgeItem = {
  title: string;
  body: string;
};

export type EquationItem = {
  label: string;
  expression: string;
  explanation: string;
};

export type ScoredItem = KnowledgeItem & {
  score: number;
};

export type Paradigm = {
  slug: string;
  name: string;
  family: string;
  summary: string;
  thesis: string;
  horizon: string;
  maturity: number;
  metrics: Record<MetricKey, number>;
  principles: KnowledgeItem[];
  mechanism: KnowledgeItem[];
  equations: EquationItem[];
  advantages: KnowledgeItem[];
  disadvantages: KnowledgeItem[];
  bottlenecks: ScoredItem[];
  opportunities: ScoredItem[];
  roadmap: string[];
  companies: string[];
  researchers: string[];
  risks: KnowledgeItem[];
  alignment: string;
  timeline: { year: number; confidence: number; statement: string }[];
};

export type GraphNode = {
  id: string;
  label: string;
  type: "paradigm" | "concept" | "bottleneck" | "opportunity" | "hardware";
  description: string;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
  weight: number;
};

export type FrontierSourceKind =
  | "paper"
  | "code"
  | "model"
  | "lab"
  | "news"
  | "patent"
  | "funding"
  | "benchmark";

export type FrontierSource = {
  id: string;
  name: string;
  kind: FrontierSourceKind;
  url: string;
  cadence: "hourly" | "daily" | "weekly";
  monitorStrategy: "rss" | "api" | "web" | "manual";
  focus: string[];
};

export type CredibilityScore = {
  evidenceStrength: number;
  reproducibilityLikelihood: number;
  hypeScore: number;
  experimentalValidation: number;
  engineeringFeasibility: number;
  thermodynamicFeasibility: number;
  scalabilityFeasibility: number;
  timelineRealism: number;
};

export type FrontierItem = {
  id: string;
  title: string;
  sourceId: string;
  sourceName: string;
  sourceKind: FrontierSourceKind;
  url: string;
  publishedAt: string;
  paradigms: string[];
  claims: string[];
  mechanisms: string[];
  bottlenecks: string[];
  contradictions: string[];
  convergenceSignals: string[];
  innovationOpportunities: string[];
  importance: number;
  credibility: CredibilityScore;
  status: "theoretical" | "simulated" | "experimentally_demonstrated" | "commercializing";
};

export type BottleneckMapItem = {
  id: string;
  category:
    | "compute"
    | "memory"
    | "energy"
    | "bandwidth"
    | "training"
    | "embodiment"
    | "scaling-laws"
    | "fabrication";
  title: string;
  severity: number;
  trend: "worsening" | "stable" | "improving";
  affectedParadigms: string[];
  evidence: string[];
  possibleResolutions: string[];
};

export type HybridArchitecture = {
  id: string;
  name: string;
  components: string[];
  thesis: string;
  strengths: string[];
  weaknesses: string[];
  requiredBreakthroughs: string[];
  estimatedTimeline: string;
  feasibility: CredibilityScore;
  civilizationImpact: string;
};

export type PhysicsValidation = {
  architectureId: string;
  verdict: "theoretically_possible" | "experimentally_demonstrated" | "economically_scalable" | "physically_unrealistic";
  thermodynamics: number;
  informationTheory: number;
  memoryBandwidth: number;
  energyEfficiency: number;
  fabricationFeasibility: number;
  communicationLatency: number;
  scalingLimits: number;
  notes: string[];
};

export type ResearchCompression = {
  conciseInsights: string[];
  causalMap: { cause: string; effect: string; confidence: number }[];
  bottleneckTree: { root: string; children: string[] }[];
  strategicExecutionPlan: string[];
};

export type IdeaMutation = {
  id: string;
  seedIdeas: string[];
  mutatedHypothesis: string;
  unexploredIntersection: string;
  testPathway: string[];
  expectedBreakthroughIfTrue: string;
  risk: string;
};
