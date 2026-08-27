export const mathsAgents = [
  { name: "Math Agent", role: "Generates conjectures, proofs, counterexamples, symbolic transformations, and theorem-solving strategies.", priority: "formal correctness" },
  { name: "Logic Agent", role: "Checks inference validity, assumptions, contradiction chains, and proof structure.", priority: "consistency" },
  { name: "Physics Agent", role: "Tests ideas against simulation, dimensional analysis, conservation laws, and empirical constraints.", priority: "reality fit" },
  { name: "Critic Agent", role: "Attacks weak assumptions, detects hallucinations, finds benchmark loopholes, and demands evidence.", priority: "falsification" },
  { name: "Compression Agent", role: "Turns long reasoning into compact abstractions, invariants, reusable lemmas, and concept hierarchies.", priority: "minimum description length" },
  { name: "Explorer Agent", role: "Searches weird intersections, mutates hypotheses, proposes new agent variants, and opens research branches.", priority: "novelty" },
  { name: "Memory Agent", role: "Maintains theorem graph, failed attempts, lineage, invariant database, and evolving abstraction tree.", priority: "cumulative learning" },
  { name: "Teacher Agent", role: "Explains discoveries back to other agents, creates curricula, and converts failures into training examples.", priority: "transfer" }
];

export const mathsRealityGates = [
  "Executable Python tests",
  "Unit tests and property-based tests",
  "Symbolic algebra checks",
  "Theorem prover hooks",
  "Simulation harnesses",
  "Dimensional analysis",
  "Benchmark suites",
  "Consistency verification",
  "Failed-attempt archive review"
];

export const mathsMemoryStructures = [
  { name: "Theorem graph", body: "Claims, lemmas, proof dependencies, counterexamples, and proof status." },
  { name: "Abstraction hierarchy", body: "Compressed concepts arranged from concrete examples to reusable transformations." },
  { name: "Invariant database", body: "Stable patterns that survive mutation, testing, and domain transfer." },
  { name: "Failed attempts archive", body: "Rejected proofs, broken simulations, bad variants, and why they failed." },
  { name: "Concept evolution tree", body: "How an idea changed across debate, mutation, critique, and validation." },
  { name: "Reasoning lineage", body: "Which agent, prompt variant, benchmark, and proof path produced an accepted result." }
];

export const mathsSelectionMetrics = [
  "correctness",
  "abstraction power",
  "prediction quality",
  "compression efficiency",
  "theorem solving",
  "coding ability",
  "transfer learning",
  "energy efficiency",
  "hallucination resistance"
];

export const mathsPrototypePlan = [
  { phase: "0.1 Local model", body: "Run a local LLM through Ollama or LM Studio and expose it to a TypeScript orchestration layer." },
  { phase: "0.1 Agent society", body: "Instantiate 8 specialized agents with independent memory and explicit evaluation roles." },
  { phase: "0.1 Reality gate", body: "Use Python execution, tests, symbolic checks, and theorem-prover hooks before accepting claims." },
  { phase: "0.1 Mutation loop", body: "Mutate prompts, heuristics, memory schemas, and abstraction methods under bounded permissions." },
  { phase: "0.1 Selection", body: "Rank variants by correctness, compression, transfer, proof success, and energy cost." },
  { phase: "0.1 Lineage", body: "Persist every accepted idea, failed attempt, proof path, mutation, and benchmark result." }
];
