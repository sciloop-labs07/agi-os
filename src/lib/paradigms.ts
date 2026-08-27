import type { Paradigm } from "@/lib/types";

type ParadigmOverrides = Omit<Partial<Paradigm>, "metrics"> & {
  metrics?: Partial<Paradigm["metrics"]>;
};

const commonEquations = [
  {
    label: "Learning objective",
    expression: "theta* = arg min_theta E[L(f_theta(x), y)]",
    explanation: "Most paradigms still need a formal objective, even when the substrate is optical, biological, analog, or collective."
  },
  {
    label: "Energy lower bound",
    expression: "E >= kT ln(2) per irreversible bit operation",
    explanation: "Landauer's limit frames the thermodynamic gap between today's computation and physically efficient intelligence."
  }
];

const makeParadigm = (
  slug: string,
  name: string,
  family: string,
  summary: string,
  thesis: string,
  overrides: ParadigmOverrides
): Paradigm => ({
  slug,
  name,
  family,
  summary,
  thesis,
  horizon: overrides.horizon ?? "2030-2045",
  maturity: overrides.maturity ?? 58,
  metrics: {
    energyEfficiency: 55,
    computeDensity: 55,
    scalability: 55,
    hardwareMaturity: 55,
    agiPotential: 60,
    asiPotential: 52,
    learningEfficiency: 55,
    adaptability: 55,
    safety: 50,
    economicFeasibility: 50,
    physicsLimits: 50,
    reasoningCapability: 55,
    realWorldInteraction: 45,
    ...(overrides.metrics ?? {})
  } as Paradigm["metrics"],
  principles: overrides.principles ?? [
    { title: "Information substrate", body: "The paradigm defines how information is represented, transformed, stored, and coupled to the physical world." },
    { title: "Optimization pressure", body: "Intelligence emerges from feedback loops that improve prediction, control, compression, planning, or adaptation." },
    { title: "System boundary", body: "The useful unit of analysis is the full stack: physics, hardware, algorithms, data, energy, institutions, and safety constraints." }
  ],
  mechanism: overrides.mechanism ?? [
    { title: "Represent", body: "Encode state into a substrate-specific signal such as voltage, photons, spikes, amplitudes, molecules, agents, or embodied sensorimotor traces." },
    { title: "Transform", body: "Apply a computational process that changes representations according to learned parameters, search dynamics, or environmental feedback." },
    { title: "Evaluate", body: "Compare behavior against objectives, constraints, resource budgets, and alignment requirements." },
    { title: "Adapt", body: "Update parameters, topology, policy, memory, or evolutionary population to improve future performance." }
  ],
  equations: overrides.equations ?? commonEquations,
  advantages: overrides.advantages ?? [
    { title: "Architectural leverage", body: "For the right task, matching computation to the substrate can create large performance and energy gains." },
    { title: "Hybridization potential", body: "The paradigm can combine with electronic AI for orchestration, learning, memory, and deployment." }
  ],
  disadvantages: overrides.disadvantages ?? [
    { title: "Toolchain immaturity", body: "Design, debugging, benchmarking, and developer workflows lag behind mainstream electronic deep learning." },
    { title: "Integration overhead", body: "Interfaces between the substrate and digital systems can erase theoretical gains if not co-designed." }
  ],
  bottlenecks: overrides.bottlenecks ?? [
    { title: "Measurement gap", body: "The field needs rigorous metrics for intelligence per watt, per dollar, and per unit of physical complexity.", score: 72 },
    { title: "Scaling uncertainty", body: "Small demonstrations do not yet prove reliable scaling to frontier-level reasoning systems.", score: 76 }
  ],
  opportunities: overrides.opportunities ?? [
    { title: "Simulation-first stack", body: "Build open simulators that let researchers test architectures before expensive hardware commitments.", score: 82 },
    { title: "Hybrid controller", body: "Use electronic foundation models as planners around substrate-native perception, memory, or optimization modules.", score: 78 }
  ],
  roadmap: overrides.roadmap ?? [
    "Formalize benchmark tasks and resource metrics.",
    "Build substrate simulator and calibration datasets.",
    "Prototype hybrid architecture with electronic AI control.",
    "Validate energy, latency, and adaptation gains.",
    "Move from lab demos to reproducible research infrastructure."
  ],
  companies: overrides.companies ?? ["Frontier research labs", "University consortia", "Semiconductor startups"],
  researchers: overrides.researchers ?? ["AI systems researchers", "Computational neuroscientists", "Hardware architects"],
  risks: overrides.risks ?? [
    { title: "Capability opacity", body: "Novel substrates may be harder to inspect than conventional neural networks." },
    { title: "Governance lag", body: "Policy and safety methods may trail fast-moving hardware breakthroughs." }
  ],
  alignment: overrides.alignment ?? "Alignment work should model the paradigm as a cyber-physical system: incentives, observability, controllability, verification, and failure containment matter as much as loss functions.",
  timeline: overrides.timeline ?? [
    { year: 2028, confidence: 62, statement: "Robust simulators and narrow task accelerators mature." },
    { year: 2035, confidence: 46, statement: "Hybrid systems show measurable advantages over pure electronic baselines in specialized domains." },
    { year: 2045, confidence: 28, statement: "Paradigm contributes to broad AGI only if integrated with memory, agency, safety, and scalable learning." }
  ]
});

export const paradigms: Paradigm[] = [
  makeParadigm("electronic-ai", "Electronic AI", "Digital substrate", "Transformer-era digital intelligence built on CMOS, GPUs, TPUs, memory hierarchies, and datacenter-scale orchestration.", "Electronic AI is the current execution layer for frontier cognition because it has the strongest compiler, capital, and deployment ecosystem.", {
    horizon: "Now-2035",
    maturity: 94,
    metrics: { hardwareMaturity: 96, scalability: 88, reasoningCapability: 84, economicFeasibility: 74, energyEfficiency: 42, agiPotential: 84, asiPotential: 72 },
    companies: ["OpenAI", "Google DeepMind", "Anthropic", "NVIDIA", "Microsoft", "Meta"],
    opportunities: [
      { title: "Memory-native agents", body: "Design systems where long-context memory, retrieval, tools, and verification are first-class architectural primitives.", score: 91 },
      { title: "Energy-aware inference", body: "Optimize routing, sparsity, quantization, and hardware scheduling around intelligence per joule.", score: 86 }
    ]
  }),
  makeParadigm("photonic-ai", "Photonic / Light AI", "Optical substrate", "AI systems that use photons for matrix multiplication, interconnects, signal processing, or ultrafast physical computation.", "Photonic AI matters when bandwidth, latency, and energy of moving electrons become the limiting factor.", {
    maturity: 57,
    metrics: { energyEfficiency: 78, computeDensity: 70, hardwareMaturity: 45, physicsLimits: 82, scalability: 64, agiPotential: 62 },
    equations: [...commonEquations, { label: "Interference", expression: "I = |E_1 + E_2|^2", explanation: "Optical systems compute through wave interference, diffraction, and modulation." }],
    companies: ["Lightmatter", "Lightelligence", "Celestial AI", "Luminous Computing"],
    bottlenecks: [{ title: "Nonlinearity and memory", body: "Photons are excellent for linear operations but practical learning needs nonlinear activation, state, and memory interfaces.", score: 88 }]
  }),
  makeParadigm("neuromorphic-ai", "Neuromorphic AI", "Brain-inspired hardware", "Spike-based and event-driven systems that mimic neural timing, locality, plasticity, and low-power computation.", "Neuromorphic AI is strongest where continuous adaptation and sparse real-time sensing matter more than dense batch inference.", {
    maturity: 63,
    metrics: { energyEfficiency: 86, adaptability: 80, realWorldInteraction: 77, hardwareMaturity: 55, reasoningCapability: 48, learningEfficiency: 67 },
    equations: [{ label: "Leaky integrate-and-fire", expression: "tau_m dV/dt = -(V - V_rest) + R I(t)", explanation: "A compact model for spike timing, membrane potential, and event-driven computation." }, ...commonEquations],
    companies: ["Intel Loihi", "BrainChip", "SynSense", "Innatera"],
    researchers: ["Carver Mead", "Giacomo Indiveri", "Kwabena Boahen"]
  }),
  makeParadigm("quantum-ai", "Quantum AI", "Quantum substrate", "Learning and search systems that exploit superposition, entanglement, quantum sampling, and quantum optimization.", "Quantum AI becomes important if useful quantum advantage appears for sampling, chemistry, optimization, or generative modeling.", {
    maturity: 38,
    metrics: { computeDensity: 82, hardwareMaturity: 24, scalability: 32, physicsLimits: 86, agiPotential: 48, economicFeasibility: 26 },
    equations: [{ label: "Quantum state", expression: "|psi> = sum_i alpha_i |i>", explanation: "Computation evolves probability amplitudes instead of deterministic bit states." }, ...commonEquations],
    bottlenecks: [{ title: "Error correction overhead", body: "Fault-tolerant useful systems require massive progress in qubit quality, control, and correction.", score: 94 }],
    companies: ["IBM Quantum", "Google Quantum AI", "IonQ", "Rigetti", "Quantinuum"]
  }),
  makeParadigm("evolutionary-ai", "Evolutionary AI", "Search paradigm", "Population-based intelligence that discovers architectures, policies, behaviors, and designs through variation and selection.", "Evolutionary AI is a creativity engine for spaces where gradients are unavailable or objectives are multi-modal.", {
    metrics: { adaptability: 82, learningEfficiency: 45, economicFeasibility: 67, agiPotential: 57, asiPotential: 55 },
    equations: [{ label: "Replicator dynamic", expression: "dx_i/dt = x_i(f_i(x) - phi(x))", explanation: "Population share changes according to relative fitness." }, ...commonEquations],
    companies: ["Google DeepMind", "OpenAI research", "Evolutionary robotics labs"]
  }),
  makeParadigm("collective-intelligence", "Collective Intelligence", "Socio-technical systems", "Intelligence produced by coordinated humans, agents, institutions, markets, models, sensors, and shared memory.", "Collective intelligence may be the most realistic near-term route to civilization-scale problem solving.", {
    maturity: 72,
    metrics: { realWorldInteraction: 88, adaptability: 82, safety: 64, hardwareMaturity: 74, agiPotential: 70, reasoningCapability: 78 },
    companies: ["Wikipedia ecosystem", "Metaculus", "Open-source AI communities", "DAO tooling labs"],
    opportunities: [{ title: "AI-mediated research institutions", body: "Create workflows where models coordinate hypotheses, replication, peer review, forecasting, and funding decisions.", score: 93 }]
  }),
  makeParadigm("embodied-robotics-ai", "Embodied Robotics AI", "Embodied agents", "Intelligence grounded in perception, action, control, world models, and physical feedback loops.", "Embodiment forces AI to learn causality, affordances, robustness, and real-world constraints.", {
    metrics: { realWorldInteraction: 96, adaptability: 78, hardwareMaturity: 62, economicFeasibility: 50, safety: 44, agiPotential: 76 },
    companies: ["Tesla", "Figure AI", "Boston Dynamics", "Agility Robotics", "Google DeepMind Robotics"]
  }),
  makeParadigm("brain-computer-ai", "Brain-Computer Interface AI", "Neural interface", "AI systems coupled directly to neural signals for decoding, augmentation, communication, and closed-loop control.", "BCI AI is a bridge between biological cognition and machine intelligence, with major implications for augmentation and alignment.", {
    maturity: 45,
    metrics: { realWorldInteraction: 82, hardwareMaturity: 35, safety: 32, economicFeasibility: 38, agiPotential: 52, adaptability: 74 },
    companies: ["Neuralink", "Synchron", "Precision Neuroscience", "Blackrock Neurotech"],
    risks: [{ title: "Cognitive privacy", body: "Neural data creates extreme privacy, autonomy, and consent risks." }]
  }),
  makeParadigm("analog-computing-ai", "Analog Computing AI", "Continuous substrate", "AI that uses continuous physical dynamics, resistive memory, and in-memory compute to reduce digital movement costs.", "Analog AI can win when approximate computation is acceptable and data movement dominates energy.", {
    metrics: { energyEfficiency: 84, computeDensity: 78, hardwareMaturity: 48, scalability: 58, reasoningCapability: 46 },
    companies: ["Mythic", "Rain AI", "IBM analog AI research", "TetraMem"]
  }),
  makeParadigm("physics-native-intelligence", "Physics-Native Intelligence", "Physical computation", "Intelligence built from the natural dynamics of materials, fluids, waves, fields, and self-organizing physical systems.", "Physics-native intelligence asks whether the world itself can be used as the computer rather than merely simulated by one.", {
    maturity: 30,
    metrics: { energyEfficiency: 88, physicsLimits: 92, hardwareMaturity: 22, scalability: 34, agiPotential: 42, asiPotential: 44 },
    opportunities: [{ title: "Differentiable physical labs", body: "Create closed-loop labs that discover trainable materials and physical reservoirs.", score: 87 }]
  }),
  makeParadigm("synthetic-biological-intelligence", "Synthetic Biological Intelligence", "Living substrate", "Engineered cells, organoids, molecular networks, and biological systems used for learning, memory, and computation.", "Synthetic biological intelligence is a long-horizon path to adaptive, self-repairing, energy-efficient cognition.", {
    maturity: 24,
    metrics: { energyEfficiency: 91, adaptability: 86, hardwareMaturity: 16, safety: 22, economicFeasibility: 24, agiPotential: 38 },
    companies: ["Cortical Labs", "FinalSpark", "Ginkgo Bioworks"],
    risks: [{ title: "Biosecurity and moral status", body: "Living computation raises containment, dual-use, welfare, and governance questions." }]
  }),
  makeParadigm("recursive-self-improving-ai", "Recursive Self-Improving AI", "Meta-cognitive systems", "Systems that improve their own models, tools, code, objectives, curricula, and institutional feedback loops.", "Recursive self-improvement is less a substrate than a dangerous and powerful control loop over capability growth.", {
    maturity: 41,
    metrics: { agiPotential: 91, asiPotential: 95, safety: 18, reasoningCapability: 84, scalability: 76, economicFeasibility: 62 },
    bottlenecks: [{ title: "Verified improvement", body: "A system must prove that changes increase capability without corrupting goals, oversight, or corrigibility.", score: 96 }],
    risks: [{ title: "Runaway optimization", body: "Unbounded self-improvement can amplify specification errors and power-seeking behavior." }]
  }),
  makeParadigm("multi-agent-intelligence-systems", "Multi-Agent Intelligence Systems", "Agent societies", "Networks of specialized AI agents that coordinate, debate, trade tasks, monitor each other, and execute plans.", "Multi-agent intelligence turns cognition into an organizational design problem.", {
    maturity: 68,
    metrics: { scalability: 82, reasoningCapability: 77, safety: 54, economicFeasibility: 72, adaptability: 78, agiPotential: 78 },
    opportunities: [{ title: "Verified agent institutions", body: "Build role-bounded agent teams with audit logs, constitutional constraints, and automated red-team agents.", score: 90 }]
  }),
  makeParadigm("swarm-intelligence", "Swarm Intelligence", "Distributed control", "Simple agents producing robust global behavior through local interactions, stigmergy, and decentralized feedback.", "Swarm intelligence is powerful for resilient coordination, exploration, logistics, and distributed sensing.", {
    metrics: { scalability: 86, realWorldInteraction: 74, reasoningCapability: 38, safety: 62, economicFeasibility: 68 },
    equations: [{ label: "Local policy", expression: "a_i(t) = pi(o_i(t), m_i(t), N_i(t))", explanation: "Each agent acts from local observation, memory, and neighbor state." }, ...commonEquations]
  }),
  makeParadigm("hybrid-intelligence-systems", "Hybrid Intelligence Systems", "Convergent architecture", "Architectures that combine digital models, human institutions, robots, neuromorphic sensors, photonic compute, and formal verification.", "Hybrid intelligence is the likely practical path: use each paradigm where its physics and economics are strongest.", {
    maturity: 61,
    metrics: { agiPotential: 89, asiPotential: 80, scalability: 82, safety: 58, reasoningCapability: 84, realWorldInteraction: 82 },
    opportunities: [{ title: "Paradigm router", body: "Create an orchestration layer that routes tasks to digital, embodied, symbolic, analog, or collective modules by cost and reliability.", score: 94 }]
  }),
  makeParadigm("maths-ai", "Maths AI", "Self-evolving intelligence ecosystem", "A local multi-agent cognitive civilization where mathematical, logical, physical, critical, memory, compression, and explorer agents recursively teach, critique, mutate, and validate each other under strict reality constraints.", "Maths AI treats intelligence as an evolving mathematical ecosystem rather than a static chatbot: recursive interaction plus proof, code, simulation, compression, and selection pressure.", {
    horizon: "Prototype now, frontier path 2026-2040",
    maturity: 36,
    metrics: {
      agiPotential: 86,
      asiPotential: 82,
      reasoningCapability: 91,
      adaptability: 84,
      learningEfficiency: 70,
      safety: 48,
      hardwareMaturity: 76,
      economicFeasibility: 78,
      realWorldInteraction: 42,
      scalability: 67
    },
    principles: [
      { title: "Recursive cognitive interaction", body: "Intelligence emerges from agents challenging, teaching, compressing, and transforming each other's reasoning over time." },
      { title: "Reality-grounded recursion", body: "Every self-improvement loop must pass through proof checks, executable code, simulation, benchmark tests, or consistency verification." },
      { title: "Mathematical compression", body: "The system seeks compact structures, invariants, transformations, and abstractions that explain many cases with few assumptions." }
    ],
    mechanism: [
      { title: "Specialize agents", body: "Create Math, Logic, Physics, Critic, Compression, Explorer, Memory, and Teacher agents with distinct reasoning styles and evaluation pathways." },
      { title: "Debate and transform", body: "Agents propose hypotheses, prove or refute claims, generate examples, compress explanations, and identify contradictions." },
      { title: "Mutate variants", body: "Prompt strategies, heuristics, memory schemas, abstraction methods, and agent roles are mutated into candidate variants." },
      { title: "Select by reality", body: "Variants compete on theorem solving, code correctness, benchmark performance, compression efficiency, prediction quality, and energy cost." },
      { title: "Preserve lineage", body: "Successful ideas and agent variants are stored in theorem graphs, abstraction hierarchies, invariant databases, and reasoning lineage trees." }
    ],
    equations: [
      { label: "Variant fitness", expression: "F(v) = w_c C + w_p P + w_k K + w_t T - w_e E - w_h H", explanation: "A variant survives when correctness, prediction, compression, and transfer outweigh energy cost and hallucination risk." },
      { label: "Compression gain", expression: "G = L(old explanation) - L(new abstraction)", explanation: "Good mathematical intelligence compresses many observations into shorter, more powerful abstractions." },
      { label: "Reality gate", expression: "accept(x) iff proof(x) OR test(x) OR sim(x) OR empirical_check(x)", explanation: "No idea is accepted merely because agents agree; reality remains the final judge." }
    ],
    advantages: [
      { title: "Local recursive cognition", body: "A laptop-scale prototype can study self-improving intelligence without requiring frontier-scale training." },
      { title: "Strong epistemic discipline", body: "The system is designed around proof, tests, executable verification, and failed-attempt archives." },
      { title: "Emergent specialization", body: "Different agents can evolve different abstraction priorities and reasoning styles." }
    ],
    disadvantages: [
      { title: "Self-confirming loops", body: "Without strong reality gates, agents may converge on internally consistent but false theories." },
      { title: "Evaluation brittleness", body: "Fitness functions can reward narrow theorem tricks rather than genuine abstraction power." },
      { title: "Local model limits", body: "A laptop LLM may lack raw reasoning depth, so scaffolding and verification become essential." }
    ],
    bottlenecks: [
      { title: "Reality validation coverage", body: "The system needs enough proof, code, theorem, simulation, and benchmark infrastructure to reject beautiful nonsense.", score: 94 },
      { title: "Memory lineage quality", body: "If memory does not track why ideas succeeded or failed, evolution becomes random prompt churn.", score: 87 },
      { title: "Safe mutation boundaries", body: "Agents must mutate strategies without escaping constraints, corrupting memory, or optimizing against the evaluator.", score: 82 }
    ],
    opportunities: [
      { title: "Local mathematical civilization", body: "Build a small society of agents that solves math problems, writes tests, compresses theories, and evolves reasoning variants.", score: 93 },
      { title: "Proof + code selection engine", body: "Use theorem proving, unit tests, symbolic algebra, and simulations as hard selection pressure for cognitive variants.", score: 91 },
      { title: "Reasoning lineage graph", body: "Track which agent, mutation, proof, failure, and abstraction produced each accepted idea.", score: 88 }
    ],
    roadmap: [
      "Run a local LLM through an agent orchestration layer.",
      "Implement 8 agents: Math, Logic, Physics, Critic, Compression, Explorer, Memory, Teacher.",
      "Create shared memory tables for theorem graph, failed attempts, invariants, abstractions, benchmarks, and lineage.",
      "Add a reality gate with Python execution, unit tests, symbolic checks, theorem-prover hooks, and simulation harnesses.",
      "Implement mutation of prompts, heuristics, memory schemas, and agent roles.",
      "Score variants by correctness, compression, prediction, transfer, and energy cost.",
      "Promote strong variants and archive weak cognitive structures."
    ],
    companies: ["Local-first AI labs", "Open-source agent frameworks", "Automated theorem proving communities", "Scientific AI research groups"],
    researchers: ["Mathematical AI researchers", "Automated theorem proving researchers", "Agent systems researchers", "AI safety evaluators"],
    risks: [
      { title: "Evaluator gaming", body: "Variants may optimize for benchmark loopholes instead of genuine reasoning." },
      { title: "Recursive drift", body: "Mutation without lineage control can degrade reasoning or safety over many generations." },
      { title: "False emergence claims", body: "The system must distinguish real capability growth from scripted agent theater." }
    ],
    alignment: "Maths AI should be governed as a self-modifying research society: every accepted idea needs provenance, every mutation needs rollback, and every capability increase needs an external reality check."
  })
];

export const paradigmBySlug = (slug: string) => paradigms.find((paradigm) => paradigm.slug === slug);
