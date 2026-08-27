export type ImaginationMode = "world" | "invention" | "strategy" | "safety";

export type ImaginationInput = {
  seed: string;
  mode: ImaginationMode;
  horizon: number;
  novelty: number;
  constraints: string[];
};

export type ImaginationResult = {
  title: string;
  premise: string;
  mentalScene: string;
  counterfactuals: string[];
  hypotheses: string[];
  experiments: string[];
  risks: string[];
  nextActions: string[];
  scoreVector: {
    novelty: number;
    plausibility: number;
    leverage: number;
    safety: number;
  };
};

const modeProfiles: Record<ImaginationMode, { title: string; frame: string; tension: string }> = {
  world: {
    title: "Possible World",
    frame: "a coherent future world where the seed idea has become infrastructure",
    tension: "what new bottleneck appears after the obvious bottleneck is solved"
  },
  invention: {
    title: "Invention Sketch",
    frame: "a concrete machine, protocol, interface, or research instrument",
    tension: "what physical or informational constraint the invention must respect"
  },
  strategy: {
    title: "Strategic Path",
    frame: "a staged execution path from weak signal to deployable research program",
    tension: "which decision creates the largest option value under uncertainty"
  },
  safety: {
    title: "Safety Simulation",
    frame: "a failure-aware imagined system with controls, audits, and reversibility",
    tension: "which capability becomes dangerous if it scales faster than oversight"
  }
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function cleanSeed(seed: string) {
  return seed.trim().replace(/\s+/g, " ");
}

export function buildImaginationSystemPrompt() {
  return [
    "You are the Imagination Engine inside an AGI research operating system.",
    "Imagine rigorously: create vivid possible worlds, but ground every leap in physics, computation, incentives, and testable evidence.",
    "Return only JSON with title, premise, mentalScene, counterfactuals, hypotheses, experiments, risks, nextActions, and scoreVector.",
    "Each array must contain 4 concise strings. scoreVector values must be integers from 0 to 100."
  ].join(" ");
}

export function buildImaginationPrompt(input: ImaginationInput) {
  const profile = modeProfiles[input.mode];
  const constraints = input.constraints.length ? input.constraints.join("; ") : "No extra constraints supplied.";
  return [
    `Seed: ${cleanSeed(input.seed)}`,
    `Mode: ${profile.title}`,
    `Frame: Imagine ${profile.frame}.`,
    `Core tension: Explore ${profile.tension}.`,
    `Time horizon: ${input.horizon} years.`,
    `Novelty target: ${input.novelty}/100.`,
    `Constraints: ${constraints}`,
    "Make the imagination useful for research: include what to test next, what could falsify it, and where safety risk enters."
  ].join("\n");
}

export function generateLocalImagination(input: ImaginationInput): ImaginationResult {
  const seed = cleanSeed(input.seed);
  const profile = modeProfiles[input.mode];
  const constraints = input.constraints.length ? input.constraints : ["energy", "memory", "evaluation", "human oversight"];
  const primaryConstraint = constraints[0] ?? "evaluation";
  const secondaryConstraint = constraints[1] ?? "scalability";
  const horizonBand = input.horizon <= 3 ? "near-term" : input.horizon <= 10 ? "mid-horizon" : "long-horizon";

  return {
    title: `${profile.title}: ${seed.slice(0, 68)}`,
    premise: `Imagine ${seed} as a ${horizonBand} research system, not a slogan. The system earns power only when it can predict, simulate, critique, and revise its own imagined futures under ${primaryConstraint} constraints.`,
    mentalScene: `A command room shows many translucent futures for "${seed}". Each future is a runnable sketch: assumptions glow in cyan, broken constraints flash amber, and the strongest path keeps changing as new evidence arrives. The AI does not merely answer; it rehearses worlds, then compresses them into experiments.`,
    counterfactuals: [
      `If ${primaryConstraint} becomes abundant, the bottleneck moves to ${secondaryConstraint} and evaluation quality.`,
      `If the imagined system fails, the likely cause is not lack of ideas but weak grounding between simulation and measured reality.`,
      `If humans can steer the imagination loop directly, the platform becomes a research co-pilot rather than an autonomous oracle.`,
      `If novelty is pushed too high, the system must add stronger plausibility filters before acting on its own sketches.`
    ],
    hypotheses: [
      `An imagination loop improves research speed when every generated world produces at least one falsifiable test.`,
      `Counterfactual branching is most useful when it exposes hidden bottlenecks before resources are committed.`,
      `The best imagined architectures will combine symbolic constraints, simulation, retrieval, and generative exploration.`,
      `Safety improves when the AI labels confidence, missing evidence, and irreversible actions before recommending execution.`
    ],
    experiments: [
      `Run three imagined futures for "${seed}" with different constraints and compare which bottlenecks repeat.`,
      `Convert the strongest mental scene into a small simulation or prototype with measurable success criteria.`,
      `Ask a critique pass to attack the premise and list what evidence would make the idea collapse.`,
      `Store each imagination result in the workspace as a hypothesis, then revisit it after new frontier signals arrive.`
    ],
    risks: [
      `Speculative fluency can feel like evidence unless every scene is tied to tests.`,
      `Over-optimistic timelines may hide compute, energy, fabrication, or coordination limits.`,
      `Recursive idea generation can amplify unsafe goals if critique and human approval are skipped.`,
      `A vivid imagined world can anchor researchers too strongly around one path.`
    ],
    nextActions: [
      `Choose one counterfactual and build a minimal simulation for it.`,
      `Add two real papers, benchmarks, or engineering constraints that support or weaken the premise.`,
      `Turn the riskiest assumption into an evaluation gate.`,
      `Compare this imagined path against the platform roadmap and frontier intelligence modules.`
    ],
    scoreVector: {
      novelty: clampScore(input.novelty),
      plausibility: clampScore(86 - input.novelty * 0.28 + constraints.length * 2),
      leverage: clampScore(52 + input.horizon * 2.2 + input.novelty * 0.18),
      safety: clampScore(input.mode === "safety" ? 88 : 72 - input.novelty * 0.12 + constraints.length * 2)
    }
  };
}

