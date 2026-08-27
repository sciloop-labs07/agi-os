import { paradigms } from "@/lib/paradigms";

export type ParadigmMapNodeKind =
  | "substrate"
  | "signal"
  | "representation"
  | "learning"
  | "memory"
  | "architecture"
  | "bottleneck"
  | "innovation"
  | "agi"
  | "asi"
  | "safety";

export type ParadigmMapNode = {
  id: string;
  label: string;
  kind: ParadigmMapNodeKind;
  stage: number;
  summary: string;
  weakPoint?: string;
  innovation?: string;
  variables: string[];
};

export type ParadigmMapEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
  risk?: "low" | "medium" | "high";
};

export type ParadigmEmergenceMap = {
  slug: string;
  name: string;
  thesis: string;
  color: string;
  nodes: ParadigmMapNode[];
  edges: ParadigmMapEdge[];
};

const baseNodes = (slug: string, name: string): ParadigmMapNode[] => [
  {
    id: `${slug}-substrate`,
    label: "Physical substrate",
    kind: "substrate",
    stage: 1,
    summary: `${name} begins with a specific physical medium that determines speed, cost, energy, latency, and noise.`,
    variables: ["energy per operation", "latency", "noise", "manufacturing maturity", "interface cost"]
  },
  {
    id: `${slug}-signals`,
    label: "Signal encoding",
    kind: "signal",
    stage: 2,
    summary: "The substrate turns observations into computable signals: bits, photons, spikes, amplitudes, molecules, actions, or social traces.",
    variables: ["signal fidelity", "bandwidth", "precision", "sparsity", "conversion loss"]
  },
  {
    id: `${slug}-representation`,
    label: "Representation",
    kind: "representation",
    stage: 3,
    summary: "Signals become internal variables that can support abstraction, prediction, memory, and control.",
    variables: ["feature quality", "causal grounding", "latent geometry", "compression", "OOD robustness"]
  },
  {
    id: `${slug}-learning`,
    label: "Learning loop",
    kind: "learning",
    stage: 4,
    summary: "The system improves through prediction, reward, evolution, plasticity, gradient descent, search, or interaction.",
    variables: ["objective quality", "feedback latency", "sample efficiency", "stability", "credit assignment"]
  },
  {
    id: `${slug}-architecture`,
    label: "System architecture",
    kind: "architecture",
    stage: 5,
    summary: "Computation becomes an organized stack: model, memory, tools, sensors, actuators, evaluators, and deployment constraints.",
    variables: ["module interfaces", "routing", "state management", "verification", "scalability"]
  },
  {
    id: `${slug}-bottleneck`,
    label: "Weak point",
    kind: "bottleneck",
    stage: 6,
    summary: "Every paradigm has a failure mode that blocks the transition from narrow capability to general intelligence.",
    weakPoint: "Needs paradigm-specific validation before scaling.",
    variables: ["failure severity", "measurement quality", "scaling uncertainty", "economic pressure"]
  },
  {
    id: `${slug}-innovation`,
    label: "Innovation zone",
    kind: "innovation",
    stage: 7,
    summary: "The highest leverage research area is where the paradigm's physical advantage meets a current AGI bottleneck.",
    innovation: "Combine with complementary paradigms instead of forcing one substrate to solve everything.",
    variables: ["hybrid compatibility", "benchmark leverage", "tooling maturity", "capital efficiency"]
  },
  {
    id: `${slug}-agi`,
    label: "AGI contribution",
    kind: "agi",
    stage: 8,
    summary: `${name} contributes to AGI if it improves generalization, long-horizon agency, world modeling, energy scalability, or grounded interaction.`,
    variables: ["cross-domain transfer", "agency reliability", "world model quality", "safety envelope"]
  },
  {
    id: `${slug}-asi`,
    label: "ASI pressure",
    kind: "asi",
    stage: 9,
    summary: "The paradigm contributes to ASI only if it can compound scientific discovery, scale physically, and remain governable.",
    variables: ["recursive improvement", "scientific automation", "physical scale", "alignment stability"]
  }
];

const baseEdges = (slug: string): ParadigmMapEdge[] => [
  { id: `${slug}-e1`, source: `${slug}-substrate`, target: `${slug}-signals`, label: "produces" },
  { id: `${slug}-e2`, source: `${slug}-signals`, target: `${slug}-representation`, label: "compresses into" },
  { id: `${slug}-e3`, source: `${slug}-representation`, target: `${slug}-learning`, label: "optimized by" },
  { id: `${slug}-e4`, source: `${slug}-learning`, target: `${slug}-architecture`, label: "organized into" },
  { id: `${slug}-e5`, source: `${slug}-architecture`, target: `${slug}-bottleneck`, label: "limited by", risk: "high" },
  { id: `${slug}-e6`, source: `${slug}-bottleneck`, target: `${slug}-innovation`, label: "unlocked through", risk: "medium" },
  { id: `${slug}-e7`, source: `${slug}-innovation`, target: `${slug}-agi`, label: "may enable" },
  { id: `${slug}-e8`, source: `${slug}-agi`, target: `${slug}-asi`, label: "could accelerate", risk: "high" }
];

type NodeOverride = Partial<ParadigmMapNode> & { id: string };

const custom: Record<string, Partial<Omit<ParadigmEmergenceMap, "nodes">> & { nodes?: NodeOverride[] }> = {
  "electronic-ai": {
    thesis: "Electronic AI turns digital scale, software tooling, memory, and datacenter economics into the current dominant path toward AGI.",
    nodes: [
      { id: "electronic-ai-substrate", summary: "CMOS chips, GPUs, TPUs, HBM, interconnects, storage, and datacenter orchestration form the execution substrate.", variables: ["FLOPs", "HBM bandwidth", "network fabric", "power", "cooling"] },
      { id: "electronic-ai-bottleneck", weakPoint: "Memory bandwidth, energy, data quality, long-horizon reliability, and alignment are the main weak points.", variables: ["memory wall", "KV-cache cost", "agent reliability", "eval gaming", "power availability"] },
      { id: "electronic-ai-innovation", innovation: "Energy-aware model routing, verified agents, memory-native architectures, optical interconnects, and process-level oversight." }
    ]
  },
  "photonic-ai": {
    thesis: "Photonic AI uses light for bandwidth, low-latency communication, and fast linear operations, most plausibly as a hybrid accelerator.",
    nodes: [
      { id: "photonic-ai-substrate", summary: "Photons, waveguides, modulators, interferometers, optical memory interfaces, and co-packaged optics.", variables: ["wavelength multiplexing", "modulator efficiency", "conversion loss", "thermal drift"] },
      { id: "photonic-ai-bottleneck", weakPoint: "Nonlinearity, memory, training, calibration, and opto-electronic conversion can erase theoretical gains.", variables: ["nonlinear activation", "state storage", "DAC/ADC overhead", "packaging"] },
      { id: "photonic-ai-innovation", innovation: "Use photonics first for interconnects, memory movement, reservoir computing, and hybrid optical-electronic inference." }
    ]
  },
  "neuromorphic-ai": {
    thesis: "Neuromorphic AI turns sparse spikes, locality, and event-driven computation into low-power adaptive intelligence.",
    nodes: [
      { id: "neuromorphic-ai-signals", summary: "Signals are represented as spikes and temporal events rather than dense synchronous tensors.", variables: ["spike timing", "event sparsity", "plasticity", "sensor coupling"] },
      { id: "neuromorphic-ai-bottleneck", weakPoint: "Training methods, software tooling, benchmark comparability, and high-level reasoning remain weak.", variables: ["surrogate gradients", "developer tools", "reasoning stack", "benchmark fairness"] },
      { id: "neuromorphic-ai-innovation", innovation: "Pair neuromorphic perception with digital planners and robotics control loops for embodied low-power intelligence." }
    ]
  },
  "quantum-ai": {
    thesis: "Quantum AI may matter where amplitude dynamics, sampling, chemistry, optimization, or quantum simulation give real advantage.",
    nodes: [
      { id: "quantum-ai-substrate", summary: "Qubits, amplitudes, entanglement, gates, annealers, measurement, and error correction.", variables: ["qubit quality", "coherence", "gate fidelity", "measurement noise"] },
      { id: "quantum-ai-bottleneck", weakPoint: "Useful quantum advantage for general AI is unproven; error correction and data loading are major barriers.", variables: ["error correction overhead", "QRAM", "noise", "algorithmic advantage"] },
      { id: "quantum-ai-innovation", innovation: "Use quantum systems for specialized sampling, materials, chemistry, and optimization inside hybrid scientific agents." }
    ]
  },
  "embodied-robotics-ai": {
    thesis: "Embodied Robotics AI grounds intelligence through perception, action, world models, affordances, and physical feedback.",
    nodes: [
      { id: "embodied-robotics-ai-signals", summary: "Vision, touch, proprioception, force, audio, spatial maps, and action outcomes become learning signals.", variables: ["sensor fusion", "control frequency", "data collection", "safety envelope"] },
      { id: "embodied-robotics-ai-bottleneck", weakPoint: "Physical data is slow, costly, safety-bound, and hard to transfer from simulation to reality.", variables: ["sim-to-real", "hardware reliability", "sample cost", "long-horizon manipulation"] },
      { id: "embodied-robotics-ai-innovation", innovation: "World models, teleoperation data, robot fleets, event-driven sensors, and verified action policies." }
    ]
  },
  "recursive-self-improving-ai": {
    thesis: "Recursive self-improving AI is the transition from static models to systems that improve their own tools, memory, code, evaluations, and architecture.",
    nodes: [
      { id: "recursive-self-improving-ai-learning", summary: "Learning happens through self-critique, code editing, experiment design, eval generation, memory updates, and architecture search.", variables: ["self-evaluation", "tool creation", "rollback", "sandboxing", "improvement proof"] },
      { id: "recursive-self-improving-ai-bottleneck", weakPoint: "Unverified self-improvement can amplify misalignment, eval gaming, hidden capabilities, and irreversible tool misuse.", variables: ["corrigibility", "deception", "verification", "privilege control"] },
      { id: "recursive-self-improving-ai-innovation", innovation: "Verified recursive loops with formal checks, audit trails, adversarial evaluators, and human approval gates." }
    ]
  },
  "hybrid-intelligence-systems": {
    thesis: "Hybrid Intelligence Systems are the likely practical AGI path: route tasks to the substrate, agent, human, or tool best suited to each bottleneck.",
    nodes: [
      { id: "hybrid-intelligence-systems-architecture", summary: "A router coordinates digital models, humans, robots, photonic/analog accelerators, symbolic tools, memory, and validators.", variables: ["routing policy", "trust boundary", "cost model", "module contracts"] },
      { id: "hybrid-intelligence-systems-bottleneck", weakPoint: "Integration complexity, verification across modules, governance, and interface failures become the major weak points.", variables: ["interface reliability", "auditability", "module drift", "security"] },
      { id: "hybrid-intelligence-systems-innovation", innovation: "Build an intelligence operating system that routes by reliability, energy, latency, privacy, and proof requirements." }
    ]
  },
  "maths-ai": {
    thesis: "Maths AI emerges as a self-evolving local cognitive civilization: agents mutate reasoning strategies, but proof, code, simulation, and benchmark reality gates decide what survives.",
    nodes: [
      { id: "maths-ai-substrate", label: "Local laptop ecosystem", summary: "A local LLM, agent orchestrator, filesystem memory, code runner, theorem tools, benchmark harness, and simulation layer.", variables: ["local LLM", "CPU/GPU budget", "filesystem memory", "sandbox", "tool permissions"] },
      { id: "maths-ai-signals", label: "Problems + attempts", summary: "Inputs are theorem statements, code tasks, simulations, failed attempts, proofs, critiques, examples, and generated variants.", variables: ["problem quality", "attempt traces", "counterexamples", "benchmark feedback", "proof status"] },
      { id: "maths-ai-representation", label: "Abstractions + invariants", summary: "The ecosystem compresses attempts into lemmas, invariants, transformation rules, concept hierarchies, and reusable proof schemas.", variables: ["invariants", "lemmas", "abstraction hierarchy", "minimum description length", "transferability"] },
      { id: "maths-ai-learning", label: "Recursive agent debate", summary: "Math, Logic, Physics, Critic, Compression, Explorer, Memory, and Teacher agents challenge and improve each other.", variables: ["agent diversity", "critique quality", "teaching loops", "contradiction detection", "self-correction"] },
      { id: "maths-ai-architecture", label: "Cognitive civilization", summary: "Independent memories, variant lineages, proof graphs, failed archives, and evaluator pathways form an internal scientific society.", variables: ["theorem graph", "reasoning lineage", "variant registry", "memory schema", "evaluation pathways"] },
      { id: "maths-ai-bottleneck", label: "Weak: self-confirming recursion", weakPoint: "The largest danger is agents agreeing with each other without external proof, executable tests, simulations, or empirical checks.", summary: "Recursive cognition can become a hallucination amplifier if reality gates are too weak.", variables: ["hallucination loops", "evaluator gaming", "false proofs", "memory corruption", "benchmark overfitting"] },
      { id: "maths-ai-innovation", label: "Innovation: reality-gated evolution", innovation: "Make self-improvement compete through theorem proving, code tests, simulations, compression gains, failed-attempt review, and rollback-safe lineage.", summary: "The breakthrough is not bigger scale; it is disciplined evolution under reality constraints.", variables: ["proof-carrying variants", "property tests", "simulation validation", "fitness function", "rollback"] },
      { id: "maths-ai-agi", label: "AGI contribution", summary: "Maths AI contributes to AGI by discovering reasoning structures that transfer across math, physics, code, and scientific abstraction.", variables: ["autonomous abstraction", "cross-domain transfer", "proof generation", "scientific hypothesis search"] },
      { id: "maths-ai-asi", label: "ASI pressure", summary: "If safely scaled, the ecosystem could recursively improve scientific discovery and cognitive architecture design.", variables: ["recursive research", "architecture discovery", "alignment control", "civilization-scale science"] }
    ]
  }
};

export const paradigmEmergenceMaps: ParadigmEmergenceMap[] = paradigms.map((paradigm, index) => {
  const overrides = custom[paradigm.slug];
  const nodes = baseNodes(paradigm.slug, paradigm.name).map((node) => {
    const nodeOverride = overrides?.nodes?.find((item) => item.id === node.id);
    return { ...node, ...nodeOverride };
  });

  return {
    slug: paradigm.slug,
    name: paradigm.name,
    thesis: overrides?.thesis ?? `${paradigm.name} becomes AGI-relevant when its substrate advantage strengthens representation, learning, agency, scalability, or safety better than the digital baseline.`,
    color: ["#48e5ff", "#b6ff61", "#ff5f8f", "#f8fafc", "#a78bfa"][index % 5],
    nodes,
    edges: baseEdges(paradigm.slug)
  };
});

export function paradigmEmergenceMapBySlug(slug: string) {
  return paradigmEmergenceMaps.find((map) => map.slug === slug);
}
