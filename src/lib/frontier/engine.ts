import { paradigms } from "@/lib/paradigms";
import type {
  BottleneckMapItem,
  CredibilityScore,
  FrontierItem,
  HybridArchitecture,
  IdeaMutation,
  PhysicsValidation,
  ResearchCompression
} from "@/lib/types";
import { frontierSources } from "./sources";

const today = "2026-05-11";

const credibility = (
  evidenceStrength: number,
  reproducibilityLikelihood: number,
  hypeScore: number,
  experimentalValidation: number,
  engineeringFeasibility: number,
  thermodynamicFeasibility: number,
  scalabilityFeasibility: number,
  timelineRealism: number
): CredibilityScore => ({
  evidenceStrength,
  reproducibilityLikelihood,
  hypeScore,
  experimentalValidation,
  engineeringFeasibility,
  thermodynamicFeasibility,
  scalabilityFeasibility,
  timelineRealism
});

export const frontierItems: FrontierItem[] = [
  {
    id: "frontier-001",
    title: "Optical interconnects move from accelerator novelty to datacenter bottleneck strategy",
    sourceId: "photonic-companies",
    sourceName: "Photonic Computing Companies",
    sourceKind: "news",
    url: "https://www.lightmatter.co/news",
    publishedAt: today,
    paradigms: ["photonic-ai", "electronic-ai", "hybrid-intelligence-systems"],
    claims: ["Bandwidth and energy constraints increasingly favor optical links around electronic accelerators."],
    mechanisms: ["Replace high-energy electrical movement with wavelength-division multiplexed optical communication."],
    bottlenecks: ["Packaging", "thermal stability", "digital-to-optical conversion overhead"],
    contradictions: ["Pure photonic compute remains harder than photonic interconnect acceleration."],
    convergenceSignals: ["electronic + optical interconnects", "datacenter energy pressure", "memory wall"],
    innovationOpportunities: ["Benchmark optical links by intelligence-per-joule rather than raw bandwidth."],
    importance: 88,
    credibility: credibility(76, 69, 38, 64, 72, 82, 68, 70),
    status: "commercializing"
  },
  {
    id: "frontier-002",
    title: "Spiking edge systems reveal a path for embodied low-power perception",
    sourceId: "neuromorphic-startups",
    sourceName: "Neuromorphic Startups",
    sourceKind: "news",
    url: "https://www.synsense.ai/news/",
    publishedAt: today,
    paradigms: ["neuromorphic-ai", "embodied-robotics-ai", "swarm-intelligence"],
    claims: ["Event-driven sensing can reduce latency and power for robotics workloads."],
    mechanisms: ["Sparse spikes propagate only when sensory changes occur, reducing wasted computation."],
    bottlenecks: ["Training methods", "software ecosystem", "benchmark comparability"],
    contradictions: ["Energy gains do not automatically translate into high-level reasoning gains."],
    convergenceSignals: ["neuromorphic + robotics", "event cameras", "edge autonomy"],
    innovationOpportunities: ["Create robotics benchmarks where energy, latency, and recovery matter equally."],
    importance: 81,
    credibility: credibility(70, 66, 42, 71, 63, 86, 59, 65),
    status: "experimentally_demonstrated"
  },
  {
    id: "frontier-003",
    title: "Agent benchmarks expose a gap between tool use and reliable long-horizon execution",
    sourceId: "benchmarks",
    sourceName: "AI Benchmark Releases",
    sourceKind: "benchmark",
    url: "https://paperswithcode.com/sota",
    publishedAt: today,
    paradigms: ["multi-agent-intelligence-systems", "recursive-self-improving-ai", "electronic-ai"],
    claims: ["Long-horizon autonomy is constrained by memory, verification, and compounding error."],
    mechanisms: ["Agents decompose tasks, call tools, write memory, and self-evaluate against partial observations."],
    bottlenecks: ["Error accumulation", "weak evals", "unsafe tool boundaries", "context drift"],
    contradictions: ["Demo performance often overstates reproducible autonomy."],
    convergenceSignals: ["agents + verification", "workspace memory", "automated evaluation"],
    innovationOpportunities: ["Build agent institutions with typed roles, audit trails, and adversarial monitors."],
    importance: 92,
    credibility: credibility(82, 77, 55, 73, 78, 74, 71, 69),
    status: "experimentally_demonstrated"
  },
  {
    id: "frontier-004",
    title: "Biological computation remains energy-compelling but validation-sparse",
    sourceId: "nature",
    sourceName: "Nature",
    sourceKind: "paper",
    url: "https://www.nature.com/search",
    publishedAt: today,
    paradigms: ["synthetic-biological-intelligence", "physics-native-intelligence"],
    claims: ["Living substrates offer adaptation and energy efficiency but lack controllable programming abstractions."],
    mechanisms: ["Cells and neural cultures process signals through biochemical and electrophysiological dynamics."],
    bottlenecks: ["Measurement", "control", "reproducibility", "ethics", "containment"],
    contradictions: ["Energy efficiency is plausible; scalable engineering remains mostly unproven."],
    convergenceSignals: ["wetware + closed-loop training", "biosecurity governance"],
    innovationOpportunities: ["Develop non-sentient biological reservoirs for safe adaptive control experiments."],
    importance: 70,
    credibility: credibility(52, 38, 66, 35, 28, 89, 24, 31),
    status: "theoretical"
  }
];

export const bottleneckMap: BottleneckMapItem[] = [
  {
    id: "b-memory-wall",
    category: "memory",
    title: "The memory wall dominates frontier model economics",
    severity: 91,
    trend: "worsening",
    affectedParadigms: ["electronic-ai", "multi-agent-intelligence-systems", "recursive-self-improving-ai"],
    evidence: ["Inference cost shifts toward memory bandwidth and KV-cache movement.", "Long-context systems increase state movement pressure."],
    possibleResolutions: ["Optical interconnects", "in-memory compute", "retrieval compression", "state-space and sparse architectures"]
  },
  {
    id: "b-energy",
    category: "energy",
    title: "Energy supply and cooling constrain datacenter-scale intelligence",
    severity: 88,
    trend: "worsening",
    affectedParadigms: ["electronic-ai", "photonic-ai", "analog-computing-ai"],
    evidence: ["Training and inference demand increasingly compete for power availability.", "Physical efficiency gains are uneven across workloads."],
    possibleResolutions: ["Photonic links", "analog acceleration", "sparsity", "routing models", "heat-aware scheduling"]
  },
  {
    id: "b-embodiment",
    category: "embodiment",
    title: "Robust physical grounding lags language and software intelligence",
    severity: 82,
    trend: "stable",
    affectedParadigms: ["embodied-robotics-ai", "swarm-intelligence", "hybrid-intelligence-systems"],
    evidence: ["Real-world data collection is slow and safety-bound.", "Simulation transfer remains brittle."],
    possibleResolutions: ["World models", "teleoperation data", "sim-to-real validation", "event-driven sensors"]
  },
  {
    id: "b-fabrication",
    category: "fabrication",
    title: "Novel substrates face packaging and manufacturing bottlenecks",
    severity: 84,
    trend: "stable",
    affectedParadigms: ["photonic-ai", "neuromorphic-ai", "quantum-ai", "analog-computing-ai"],
    evidence: ["Lab prototypes often hide yield, packaging, calibration, and interface costs."],
    possibleResolutions: ["Chiplet integration", "standardized benchmarking", "co-packaged optics", "foundry partnerships"]
  }
];

export const hybridArchitectures: HybridArchitecture[] = [
  {
    id: "hybrid-photonic-neuromorphic",
    name: "Photonic + Neuromorphic Perception Fabric",
    components: ["Photonic interconnects", "event-driven sensors", "spiking processors", "digital planner"],
    thesis: "Use photons for high-bandwidth movement and spikes for low-power embodied sensing, with electronic models handling planning.",
    strengths: ["Low-latency perception", "energy-efficient edge autonomy", "strong robotics fit"],
    weaknesses: ["Difficult training stack", "limited high-level reasoning", "hardware integration risk"],
    requiredBreakthroughs: ["Common compiler for optical/spiking pipelines", "robotics benchmark suite", "robust sensor fusion"],
    estimatedTimeline: "2028-2036",
    feasibility: credibility(72, 64, 44, 63, 58, 88, 61, 66),
    civilizationImpact: "Could unlock large-scale autonomous infrastructure, disaster response, and distributed sensing."
  },
  {
    id: "hybrid-electronic-optical",
    name: "Electronic Foundation Model + Optical Memory Fabric",
    components: ["GPUs/TPUs", "optical interconnects", "retrieval memory", "agent runtime"],
    thesis: "Keep digital training and reasoning while attacking the memory and communication wall with optical data movement.",
    strengths: ["Near-term deployability", "clear datacenter value", "strong compatibility with current models"],
    weaknesses: ["Still power hungry", "depends on packaging economics", "not a new learning paradigm alone"],
    requiredBreakthroughs: ["Co-packaged optics at scale", "memory-aware model architectures", "routing by energy cost"],
    estimatedTimeline: "2026-2032",
    feasibility: credibility(84, 76, 36, 74, 81, 82, 77, 78),
    civilizationImpact: "Could materially extend scaling by lowering inference and memory movement costs."
  },
  {
    id: "hybrid-embodied-multi-agent",
    name: "Embodied Multi-Agent Research Civilization",
    components: ["Robotics", "multi-agent systems", "human institutions", "simulation worlds", "verification agents"],
    thesis: "Treat AGI as an institution of embodied and digital agents with roles, checks, experiments, and causal world models.",
    strengths: ["Real-world grounding", "organizational scalability", "safety through role separation"],
    weaknesses: ["Coordination failures", "hard governance", "slow physical iteration"],
    requiredBreakthroughs: ["Reliable agent protocols", "robotics data engines", "formal audit trails", "human-AI governance"],
    estimatedTimeline: "2027-2040",
    feasibility: credibility(78, 70, 48, 66, 72, 70, 68, 64),
    civilizationImpact: "Could become a practical civilization-scale intelligence infrastructure."
  },
  {
    id: "hybrid-rsi-verified-agents",
    name: "Verified Recursive Self-Improving Agent Lab",
    components: ["code agents", "formal verification", "eval harnesses", "sandboxed tools", "human approval gates"],
    thesis: "Permit self-improvement only through bounded proposals, reproducible tests, formal checks, and rollback-ready deployment.",
    strengths: ["Direct path to accelerated R&D", "auditable improvement loop", "can compound software progress"],
    weaknesses: ["Highest alignment burden", "eval gaming", "tool boundary risk"],
    requiredBreakthroughs: ["Capability-control evals", "verified code generation", "corrigible agent protocols"],
    estimatedTimeline: "2026-2035",
    feasibility: credibility(69, 61, 72, 54, 67, 75, 62, 50),
    civilizationImpact: "Could accelerate science dramatically if controlled, or amplify failure modes if governance is weak."
  }
];

export const physicsValidations: PhysicsValidation[] = hybridArchitectures.map((architecture) => {
  const average = Math.round(
    (architecture.feasibility.thermodynamicFeasibility +
      architecture.feasibility.engineeringFeasibility +
      architecture.feasibility.scalabilityFeasibility +
      architecture.feasibility.timelineRealism) /
      4
  );

  return {
    architectureId: architecture.id,
    verdict:
      average > 76
        ? "economically_scalable"
        : average > 62
          ? "experimentally_demonstrated"
          : average > 40
            ? "theoretically_possible"
            : "physically_unrealistic",
    thermodynamics: architecture.feasibility.thermodynamicFeasibility,
    informationTheory: architecture.feasibility.evidenceStrength,
    memoryBandwidth: architecture.components.some((item) => item.toLowerCase().includes("optical")) ? 82 : 58,
    energyEfficiency: architecture.feasibility.thermodynamicFeasibility,
    fabricationFeasibility: architecture.feasibility.engineeringFeasibility,
    communicationLatency: architecture.components.some((item) => item.toLowerCase().includes("photonic") || item.toLowerCase().includes("optical")) ? 84 : 60,
    scalingLimits: architecture.feasibility.scalabilityFeasibility,
    notes: [
      "Verdict is generated from thermodynamic, engineering, bandwidth, latency, and scale constraints.",
      "Production validation should attach citations, benchmark data, manufacturing assumptions, and cost curves."
    ]
  };
});

export const researchCompression: ResearchCompression = {
  conciseInsights: [
    "The memory wall is becoming the central bottleneck for electronic AGI scaling.",
    "Photonic technologies are most credible near-term as interconnect and memory movement infrastructure.",
    "Neuromorphic systems look strongest in embodied, sparse, low-power perception rather than general reasoning.",
    "Recursive self-improvement needs verification infrastructure before it should be treated as an execution accelerator."
  ],
  causalMap: [
    { cause: "Longer context and agents", effect: "Higher memory bandwidth pressure", confidence: 86 },
    { cause: "Energy scarcity", effect: "Demand for photonic, analog, sparse, and routed architectures", confidence: 82 },
    { cause: "Weak reproducibility", effect: "Higher hype score and lower strategic reliability", confidence: 78 }
  ],
  bottleneckTree: [
    { root: "AGI scaling", children: ["compute supply", "memory movement", "data quality", "agent reliability", "alignment verification"] },
    { root: "New substrates", children: ["fabrication yield", "programming model", "benchmark legitimacy", "digital interface cost"] }
  ],
  strategicExecutionPlan: [
    "Instrument every research item with credibility and physics validation.",
    "Prioritize hybrid electronic-optical infrastructure for near-term scaling leverage.",
    "Build agent evaluation harnesses before recursive improvement workflows.",
    "Create embodied energy-latency benchmarks for neuromorphic and robotics convergence."
  ]
};

export const ideaMutations: IdeaMutation[] = [
  {
    id: "idea-001",
    seedIdeas: ["mechanistic interpretability", "photonic interconnects", "agent audit trails"],
    mutatedHypothesis: "Use optical memory movement to maintain always-on interpretability traces for large agent teams.",
    unexploredIntersection: "High-bandwidth observability infrastructure for agentic systems.",
    testPathway: ["Log agent state transitions", "Compress traces into causal summaries", "Benchmark audit latency under load"],
    expectedBreakthroughIfTrue: "Real-time oversight of large AI institutions without prohibitive memory cost.",
    risk: "Trace compression may hide rare catastrophic decisions."
  },
  {
    id: "idea-002",
    seedIdeas: ["event cameras", "world models", "swarm robotics"],
    mutatedHypothesis: "Train swarms on event-driven world-model deltas instead of dense video state.",
    unexploredIntersection: "Sparse embodied learning for distributed agents.",
    testPathway: ["Build simulator", "Compare event-delta and dense-frame training", "Transfer to small robot swarm"],
    expectedBreakthroughIfTrue: "Lower-power distributed autonomy with better reaction latency.",
    risk: "Sparse observations may miss slow-changing strategic context."
  }
];

export function generateFrontierSnapshot() {
  const sourceCoverage = frontierSources.length;
  const meanImportance = Math.round(frontierItems.reduce((sum, item) => sum + item.importance, 0) / frontierItems.length);
  const strongestHybrid = [...hybridArchitectures].sort(
    (a, b) => b.feasibility.engineeringFeasibility + b.feasibility.timelineRealism - (a.feasibility.engineeringFeasibility + a.feasibility.timelineRealism)
  )[0];
  const highestRisk = [...bottleneckMap].sort((a, b) => b.severity - a.severity)[0];
  const paradigmCoverage = new Set(frontierItems.flatMap((item) => item.paradigms)).size;

  return {
    sourceCoverage,
    monitoredParadigms: paradigms.length,
    liveParadigmCoverage: paradigmCoverage,
    meanImportance,
    strongestHybrid,
    highestRisk,
    generatedAt: new Date().toISOString()
  };
}
