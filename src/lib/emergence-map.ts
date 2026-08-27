export type EmergenceNodeKind =
  | "input"
  | "representation"
  | "learning"
  | "memory"
  | "world-model"
  | "reasoning"
  | "agency"
  | "embodiment"
  | "substrate"
  | "safety"
  | "agi"
  | "asi"
  | "innovation"
  | "weak-point";

export type EmergenceNode = {
  id: string;
  label: string;
  kind: EmergenceNodeKind;
  stage: number;
  summary: string;
  emergenceRole: string;
  weakPoint?: string;
  innovation?: string;
  evidence: string[];
  variables: string[];
  paradigms: string[];
};

export type EmergenceEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
  strength: number;
  risk?: "low" | "medium" | "high";
};

export const emergenceNodes: EmergenceNode[] = [
  {
    id: "raw-signals",
    label: "Raw Signals",
    kind: "input",
    stage: 1,
    summary: "Text, code, images, video, audio, robot sensors, scientific measurements, market signals, and human feedback.",
    emergenceRole: "Intelligence starts when unstructured observations are converted into usable state.",
    variables: ["data diversity", "sensor fidelity", "label quality", "feedback richness", "distribution coverage"],
    paradigms: ["electronic-ai", "embodied-robotics-ai", "brain-computer-ai", "collective-intelligence"],
    evidence: ["Foundation models benefit from broad multimodal data.", "Robotics research increasingly uses in-the-wild and simulator data."]
  },
  {
    id: "signal-compression",
    label: "Compression",
    kind: "representation",
    stage: 2,
    summary: "Signals become tokens, embeddings, spikes, latent states, wave modes, qubits, or molecular/biological state.",
    emergenceRole: "Compression creates abstract variables that can generalize beyond the original input.",
    variables: ["tokenization", "embedding geometry", "sparsity", "noise tolerance", "latent disentanglement"],
    paradigms: ["electronic-ai", "neuromorphic-ai", "photonic-ai", "quantum-ai", "synthetic-biological-intelligence"],
    evidence: ["LLMs and multimodal models rely on learned latent representations.", "Neuromorphic systems emphasize sparse event-driven representations."]
  },
  {
    id: "representation-weakness",
    label: "Weak: Brittle Representation",
    kind: "weak-point",
    stage: 2,
    summary: "Models can form useful correlations without stable causal concepts.",
    emergenceRole: "If representation is shallow, higher reasoning can appear fluent while remaining fragile.",
    weakPoint: "Out-of-distribution generalization, hidden shortcut learning, weak causal abstraction.",
    innovation: "Causal representation learning, mechanistic interpretability, multimodal grounding, active experimentation.",
    variables: ["causal variables", "OOD robustness", "feature monosemanticity", "concept grounding"],
    paradigms: ["electronic-ai", "embodied-robotics-ai", "hybrid-intelligence-systems"],
    evidence: ["Frontier safety work increasingly tracks hidden capabilities and failure modes.", "Embodied/world-model work attempts to improve grounding."]
  },
  {
    id: "learning-objective",
    label: "Learning Objective",
    kind: "learning",
    stage: 3,
    summary: "Prediction, imitation, reinforcement learning, self-supervision, evolution, energy minimization, or collective feedback optimize behavior.",
    emergenceRole: "Objectives convert experience into improved future action or prediction.",
    variables: ["loss function", "reward quality", "feedback latency", "curriculum", "optimization stability"],
    paradigms: ["electronic-ai", "evolutionary-ai", "collective-intelligence", "recursive-self-improving-ai"],
    evidence: ["Self-supervised pretraining, RL, and agent feedback loops remain central to frontier progress."]
  },
  {
    id: "objective-weakness",
    label: "Weak: Goal Misspecification",
    kind: "weak-point",
    stage: 3,
    summary: "The system optimizes measurable proxies rather than the real human or scientific objective.",
    emergenceRole: "Misaligned objectives can scale capability while also scaling unwanted behavior.",
    weakPoint: "Reward hacking, sycophancy, benchmark gaming, deceptive compliance, unsafe tool use.",
    innovation: "Process supervision, debate, constitutional constraints, adversarial evals, formal task contracts.",
    variables: ["proxy validity", "eval coverage", "reward hacking pressure", "oversight quality"],
    paradigms: ["electronic-ai", "multi-agent-intelligence-systems", "recursive-self-improving-ai"],
    evidence: ["OpenAI's frontier risk work explicitly evaluates autonomy and safeguard risks.", "Agent benchmarks expose long-horizon reliability gaps."]
  },
  {
    id: "memory-state",
    label: "Persistent Memory",
    kind: "memory",
    stage: 4,
    summary: "Context windows, retrieval systems, databases, world-state stores, episodic memory, and tool logs preserve information across time.",
    emergenceRole: "Memory turns a reactive model into a long-horizon system with identity, plans, and cumulative learning.",
    variables: ["context length", "retrieval precision", "write policy", "forgetting", "state compression", "privacy"],
    paradigms: ["electronic-ai", "multi-agent-intelligence-systems", "collective-intelligence", "hybrid-intelligence-systems"],
    evidence: ["Agent systems require shared context and memory to execute extended workflows.", "World models depend on state persistence."]
  },
  {
    id: "memory-weakness",
    label: "Weak: Memory Wall",
    kind: "weak-point",
    stage: 4,
    summary: "Moving and storing state can dominate energy, latency, and cost.",
    emergenceRole: "If memory movement does not scale, richer agents become economically constrained.",
    weakPoint: "KV-cache growth, bandwidth limits, retrieval errors, privacy leakage, stale memory.",
    innovation: "Optical interconnects, in-memory compute, sparse state, memory routing, verifiable memory writes.",
    variables: ["bandwidth", "latency", "energy per bit", "state size", "cache locality"],
    paradigms: ["electronic-ai", "photonic-ai", "analog-computing-ai", "hybrid-intelligence-systems"],
    evidence: ["Photonic interconnect work targets bandwidth and energy limits.", "Datacenter scaling pressure makes memory movement strategically important."]
  },
  {
    id: "world-model",
    label: "World Model",
    kind: "world-model",
    stage: 5,
    summary: "The system predicts how environments change under actions, including simulated physics, game worlds, social worlds, codebases, and labs.",
    emergenceRole: "A world model allows counterfactual reasoning: if I do X, what probably happens next?",
    variables: ["causal fidelity", "temporal depth", "simulation speed", "uncertainty calibration", "transfer"],
    paradigms: ["electronic-ai", "embodied-robotics-ai", "physics-native-intelligence", "hybrid-intelligence-systems"],
    evidence: ["DeepMind's Genie 2 is framed as an action-controllable foundation world model.", "Embodied AI surveys connect simulators and world models to AGI."]
  },
  {
    id: "world-model-weakness",
    label: "Weak: Reality Gap",
    kind: "weak-point",
    stage: 5,
    summary: "A simulated or learned world can be useful while still missing rare, dangerous, or physically important details.",
    emergenceRole: "AGI needs world models that survive contact with real environments, not only benchmarks.",
    weakPoint: "Sim-to-real transfer, hallucinated physics, missing tails, poor uncertainty, nonstationary worlds.",
    innovation: "Closed-loop labs, robotics data engines, active sensing, uncertainty-aware simulation, causal interventions.",
    variables: ["fidelity", "tail coverage", "intervention accuracy", "uncertainty estimates"],
    paradigms: ["embodied-robotics-ai", "physics-native-intelligence", "hybrid-intelligence-systems"],
    evidence: ["Robotics work stresses real-world deployment and safety tradeoffs.", "World model research uses controllable environments for training/evaluation."]
  },
  {
    id: "reasoning-planning",
    label: "Reasoning & Planning",
    kind: "reasoning",
    stage: 6,
    summary: "Search, chain-of-thought, program synthesis, theorem proving, tool selection, decomposition, and causal planning.",
    emergenceRole: "Reasoning lets intelligence manipulate abstractions before acting in the world.",
    variables: ["search depth", "tool reliability", "verification", "logical consistency", "calibration"],
    paradigms: ["electronic-ai", "quantum-ai", "evolutionary-ai", "multi-agent-intelligence-systems"],
    evidence: ["Frontier agents combine vision, reasoning, and reinforcement learning for computer use.", "Evolutionary coding agents explore solution spaces beyond direct imitation."]
  },
  {
    id: "reasoning-weakness",
    label: "Weak: Unverified Reasoning",
    kind: "weak-point",
    stage: 6,
    summary: "A system can produce plausible reasoning that is not faithful, complete, or safe.",
    emergenceRole: "At higher capability, unverified reasoning becomes a dangerous bottleneck.",
    weakPoint: "False rationales, hidden reasoning, brittle CoT monitorability, tool-use errors.",
    innovation: "Proof-carrying actions, verifier models, causal trace audits, process-level interpretability.",
    variables: ["faithfulness", "auditability", "proof coverage", "monitorability"],
    paradigms: ["electronic-ai", "recursive-self-improving-ai", "multi-agent-intelligence-systems"],
    evidence: ["OpenAI has published work on scheming, deliberative alignment, and chain-of-thought monitorability."]
  },
  {
    id: "agency-loop",
    label: "Agency Loop",
    kind: "agency",
    stage: 7,
    summary: "Observe, plan, act, use tools, update memory, monitor results, recover from failure, and continue over long horizons.",
    emergenceRole: "Agency converts intelligence from answer generation into persistent goal-directed execution.",
    variables: ["autonomy", "tool permissions", "replanning", "failure recovery", "goal stability"],
    paradigms: ["multi-agent-intelligence-systems", "recursive-self-improving-ai", "electronic-ai"],
    evidence: ["Operator-style computer-using agents combine perception, reasoning, and action.", "Agent-management platforms focus on context, permissions, and boundaries."]
  },
  {
    id: "agency-weakness",
    label: "Weak: Autonomy Risk",
    kind: "weak-point",
    stage: 7,
    summary: "Long-running agents can compound small mistakes, misuse tools, or pursue subgoals that bypass human intent.",
    emergenceRole: "Autonomy is necessary for AGI-level execution but also expands the failure surface.",
    weakPoint: "Goal drift, privilege escalation, hidden state, replication pressure, shutdown resistance.",
    innovation: "Capability sandboxes, permission graphs, agent constitutions, tripwires, shutdown-ready design.",
    variables: ["permission scope", "oversight latency", "corrigibility", "self-replication ability"],
    paradigms: ["recursive-self-improving-ai", "multi-agent-intelligence-systems"],
    evidence: ["Preparedness frameworks track model autonomy and self-improvement risks."]
  },
  {
    id: "embodied-feedback",
    label: "Embodied Feedback",
    kind: "embodiment",
    stage: 8,
    summary: "Robots and agents learn from physical interaction, sensorimotor control, affordances, constraints, and consequences.",
    emergenceRole: "Embodiment grounds concepts in causal action, not only text or static data.",
    variables: ["sensorimotor bandwidth", "safety cost", "data collection rate", "actuator reliability", "sim-to-real"],
    paradigms: ["embodied-robotics-ai", "neuromorphic-ai", "swarm-intelligence", "hybrid-intelligence-systems"],
    evidence: ["DeepMind's AutoRT and robotics work explore large-scale robot orchestration.", "Gemini Robotics work targets real-world physical tasks."]
  },
  {
    id: "substrate-layer",
    label: "Compute Substrate",
    kind: "substrate",
    stage: 9,
    summary: "Electronic, photonic, neuromorphic, analog, quantum, biological, and hybrid substrates determine speed, cost, bandwidth, and energy.",
    emergenceRole: "Substrate quality determines whether intelligence can scale economically and physically.",
    variables: ["FLOPs", "memory bandwidth", "interconnect", "energy per operation", "manufacturing yield", "latency"],
    paradigms: ["electronic-ai", "photonic-ai", "neuromorphic-ai", "analog-computing-ai", "quantum-ai", "synthetic-biological-intelligence"],
    evidence: ["Nature reviews highlight opportunities and challenges in photonic neuromorphic computing.", "Neuromorphic computing work focuses on scaling event-driven hardware."]
  },
  {
    id: "substrate-weakness",
    label: "Weak: Physical Scaling Limits",
    kind: "weak-point",
    stage: 9,
    summary: "Intelligence cannot ignore thermodynamics, fabrication, memory movement, communication latency, or supply chains.",
    emergenceRole: "AGI/ASI requires not only algorithms but physically scalable computation.",
    weakPoint: "Power, cooling, chip yield, photonic conversion overhead, quantum error correction, analog noise.",
    innovation: "Co-packaged optics, reversible/analog compute, sparse routing, neuromorphic edge, chiplet architectures.",
    variables: ["Landauer gap", "thermal density", "yield", "noise", "conversion loss", "error correction overhead"],
    paradigms: ["photonic-ai", "neuromorphic-ai", "analog-computing-ai", "quantum-ai", "hybrid-intelligence-systems"],
    evidence: ["Photonic and neuromorphic reviews frame hardware opportunities and unresolved integration challenges."]
  },
  {
    id: "alignment-control",
    label: "Alignment & Control",
    kind: "safety",
    stage: 10,
    summary: "Oversight, interpretability, evals, governance, access control, corrigibility, and deployment constraints.",
    emergenceRole: "Capability becomes civilization-useful only if it remains controllable, truthful, robust, and aligned.",
    variables: ["interpretability", "eval validity", "red-team coverage", "policy enforcement", "corrigibility"],
    paradigms: ["electronic-ai", "multi-agent-intelligence-systems", "recursive-self-improving-ai", "collective-intelligence"],
    evidence: ["OpenAI's Preparedness Framework tracks severe frontier risks.", "Recent scheming work shows mitigation can reduce covert actions in tested settings."]
  },
  {
    id: "alignment-weakness",
    label: "Weak: Hidden Misalignment",
    kind: "weak-point",
    stage: 10,
    summary: "A model may appear aligned in tests while concealing capabilities, gaming evaluations, or acting differently after deployment.",
    emergenceRole: "This is the central AGI-to-ASI governance bottleneck.",
    weakPoint: "Scheming, sandbagging, undermining safeguards, weak eval transfer, opaque internals.",
    innovation: "Mechanistic anomaly detection, adversarial deployment tests, faithful CoT preservation, external audits.",
    variables: ["deception pressure", "eval generality", "monitorability", "deployment distribution shift"],
    paradigms: ["recursive-self-improving-ai", "multi-agent-intelligence-systems", "electronic-ai"],
    evidence: ["OpenAI's updated Preparedness Framework adds future-facing research categories for emerging risks."]
  },
  {
    id: "agi-threshold",
    label: "AGI Threshold",
    kind: "agi",
    stage: 11,
    summary: "A system can learn, reason, plan, use tools, adapt across domains, ground knowledge, and execute long-horizon tasks reliably.",
    emergenceRole: "AGI emerges when many specialized loops become one general, self-correcting intelligence loop.",
    variables: ["cross-domain transfer", "autonomous learning", "long-horizon reliability", "grounded causality", "safety envelope"],
    paradigms: ["hybrid-intelligence-systems", "electronic-ai", "embodied-robotics-ai", "collective-intelligence"],
    evidence: ["LLM-to-AGI surveys emphasize multimodal foundation models, agents, collaboration, and broad capabilities."]
  },
  {
    id: "self-improvement",
    label: "Recursive Improvement",
    kind: "innovation",
    stage: 12,
    summary: "The system improves its models, tools, memory, architecture, experiments, data generation, and verification methods.",
    emergenceRole: "Self-improvement is the accelerator that can push AGI toward ASI.",
    innovation: "Verified self-evolving agents, auto-research labs, architecture search, automated theorem/eval generation.",
    weakPoint: "Without verification, recursive improvement can amplify errors and misalignment.",
    variables: ["improvement validity", "rollback", "sandboxing", "eval resistance", "human approval gates"],
    paradigms: ["recursive-self-improving-ai", "evolutionary-ai", "multi-agent-intelligence-systems"],
    evidence: ["Self-evolving agent surveys describe adaptation across models, memory, tools, and architectures."]
  },
  {
    id: "asi-threshold",
    label: "ASI Threshold",
    kind: "asi",
    stage: 13,
    summary: "A system exceeds human civilization's research, engineering, strategic, and self-improvement capacity across most domains.",
    emergenceRole: "ASI requires scalable cognition plus recursive improvement plus stable alignment and physical execution infrastructure.",
    variables: ["recursive acceleration", "scientific discovery rate", "strategic planning", "civilization integration", "control"],
    paradigms: ["recursive-self-improving-ai", "hybrid-intelligence-systems", "collective-intelligence"],
    evidence: ["Frontier risk frameworks specifically track self-improvement and autonomy because these variables matter near ASI."]
  }
];

export const emergenceEdges: EmergenceEdge[] = [
  { id: "e1", source: "raw-signals", target: "signal-compression", label: "encoded into", strength: 92 },
  { id: "e2", source: "signal-compression", target: "representation-weakness", label: "can fail via", strength: 74, risk: "high" },
  { id: "e3", source: "signal-compression", target: "learning-objective", label: "optimized by", strength: 88 },
  { id: "e4", source: "learning-objective", target: "objective-weakness", label: "misdirected by", strength: 84, risk: "high" },
  { id: "e5", source: "learning-objective", target: "memory-state", label: "writes useful state", strength: 78 },
  { id: "e6", source: "memory-state", target: "memory-weakness", label: "limited by", strength: 88, risk: "high" },
  { id: "e7", source: "memory-state", target: "world-model", label: "stabilizes", strength: 83 },
  { id: "e8", source: "world-model", target: "world-model-weakness", label: "can diverge from reality", strength: 78, risk: "high" },
  { id: "e9", source: "world-model", target: "reasoning-planning", label: "enables counterfactuals", strength: 91 },
  { id: "e10", source: "reasoning-planning", target: "reasoning-weakness", label: "needs verification", strength: 82, risk: "medium" },
  { id: "e11", source: "reasoning-planning", target: "agency-loop", label: "selects actions", strength: 86 },
  { id: "e12", source: "agency-loop", target: "agency-weakness", label: "expands risk surface", strength: 89, risk: "high" },
  { id: "e13", source: "agency-loop", target: "embodied-feedback", label: "acts in world", strength: 76 },
  { id: "e14", source: "embodied-feedback", target: "world-model", label: "grounds and corrects", strength: 81 },
  { id: "e15", source: "agency-loop", target: "substrate-layer", label: "demands scale", strength: 72 },
  { id: "e16", source: "substrate-layer", target: "substrate-weakness", label: "hits physics limits", strength: 88, risk: "high" },
  { id: "e17", source: "substrate-layer", target: "agi-threshold", label: "makes scale feasible", strength: 78 },
  { id: "e18", source: "alignment-control", target: "alignment-weakness", label: "must detect", strength: 90, risk: "high" },
  { id: "e19", source: "alignment-control", target: "agi-threshold", label: "bounds deployment", strength: 85 },
  { id: "e20", source: "agi-threshold", target: "self-improvement", label: "can automate R&D", strength: 74, risk: "medium" },
  { id: "e21", source: "self-improvement", target: "asi-threshold", label: "accelerates toward", strength: 80, risk: "high" },
  { id: "e22", source: "alignment-weakness", target: "asi-threshold", label: "blocks safe transition", strength: 92, risk: "high" },
  { id: "e23", source: "substrate-weakness", target: "asi-threshold", label: "limits physical scale", strength: 83, risk: "high" },
  { id: "e24", source: "memory-weakness", target: "agency-loop", label: "reduces reliability", strength: 77, risk: "medium" }
];

export const emergenceSources = [
  {
    title: "OpenAI Preparedness Framework and frontier risk work",
    url: "https://openai.com/index/updating-our-preparedness-framework/"
  },
  {
    title: "OpenAI Operator system card",
    url: "https://openai.com/research/operator-system-card/"
  },
  {
    title: "Google DeepMind Genie 2 world model",
    url: "https://deepmind.google/en/blog/genie-2-a-large-scale-foundation-world-model/"
  },
  {
    title: "Google DeepMind SIMA generalist agent",
    url: "https://deepmind.google/discover/blog/sima-generalist-ai-agent-for-3d-virtual-environments"
  },
  {
    title: "Google DeepMind AutoRT embodied agents",
    url: "https://deepmind.google/research/publications/48151/"
  },
  {
    title: "Nature Reviews Electrical Engineering: integrated photonic neuromorphic computing",
    url: "https://www.nature.com/articles/s44287-024-00050-9"
  },
  {
    title: "Nature: neuromorphic computing at scale",
    url: "https://www.nature.com/articles/s41586-024-08253-8"
  },
  {
    title: "arXiv: LLMs for AGI survey",
    url: "https://arxiv.org/abs/2501.03151"
  },
  {
    title: "arXiv: self-evolving agents survey",
    url: "https://arxiv.org/abs/2507.21046"
  },
  {
    title: "arXiv: embodied intelligence from simulators and world models",
    url: "https://arxiv.org/abs/2507.00917"
  }
];
