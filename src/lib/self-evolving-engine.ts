export type Difficulty = "easy" | "medium" | "complex";
export type PredictionOption = { id: string; label: string; beginnerLabel: string; symbol: string };
export type ExampleVariable = { id: string; label: string; beginnerLabel: string; meaning: string; min: number; max: number; step: number; unit: string; initial: number };

export type EngineExample = {
  id: string;
  title: string;
  domain: string;
  difficulty: Difficulty;
  description: string;
  beginnerDescription: string;
  question: string;
  beginnerQuestion: string;
  whyItMatters: string;
  transferPrompt: string;
  variables: ExampleVariable[];
  options: PredictionOption[];
  primitives: string[];
  caveat: string;
};

export type ExampleResult = {
  outcome: string;
  outcomeLabel: string;
  explanation: string;
  signal: number;
  correct: boolean;
  error: number;
  plainExplanation: string;
  cause: string;
  change: string;
  result: string;
  beginnerResult: string;
};

export type EngineRun = { id: string; exampleId: string; prediction: string; outcome: string; correct: boolean; error: number; generation: number; timestamp: string };
export type SelfEvolvingState = {
  generation: number;
  totalRuns: number;
  correctRuns: number;
  mastery: Record<string, number>;
  challenge: number;
  explanationDepth: number;
  contrastMode: boolean;
  runs: EngineRun[];
};

export const selfEvolvingExamples: EngineExample[] = [
  {
    id: "gravity", title: "Gravity", domain: "Physics", difficulty: "easy",
    description: "A single force changes the trajectory of an object.", beginnerDescription: "Earth is quietly pulling on everything. Let’s see what happens when a ball is released.", question: "Release the sphere. What will it do next?", beginnerQuestion: "The ball is in the air. What do you think it will do next?",
    whyItMatters: "Gravity is the invisible pull that makes dropped things fall and keeps us on the ground.", transferPrompt: "Where else can you see gravity? Try dropping a pencil or bouncing a ball.",
    variables: [{ id: "gravity", label: "Gravity", beginnerLabel: "Earth’s pull", meaning: "How strongly Earth pulls the ball", min: 0, max: 20, step: .1, unit: "m/s²", initial: 9.8 }, { id: "height", label: "Release height", beginnerLabel: "Starting height", meaning: "How high the ball begins", min: 1, max: 12, step: 1, unit: "m", initial: 6 }],
    options: [{ id: "down", label: "Accelerate downward", beginnerLabel: "It falls down", symbol: "↓" }, { id: "float", label: "Stay suspended", beginnerLabel: "It stays there", symbol: "·" }, { id: "up", label: "Accelerate upward", beginnerLabel: "It goes up", symbol: "↑" }],
    primitives: ["Object", "Position", "Force", "Time", "Causality", "Prediction Error"], caveat: "Toy model: air resistance and rotation are omitted."
  },
  {
    id: "ecosystem", title: "Predator–Prey", domain: "Biology", difficulty: "medium",
    description: "Population pressure creates a delayed feedback loop between prey and predators.", beginnerDescription: "Rabbits need food, while foxes need rabbits. Let’s watch how the two groups affect each other.", question: "Given this balance, what happens to the prey population next?", beginnerQuestion: "With these rabbits, foxes, and food, what happens to the rabbits next?",
    whyItMatters: "Ecosystems are connected: a change in food or one animal can ripple through the whole living community.", transferPrompt: "What might happen if the rabbits suddenly had much less food? Make a guess before changing the slider.",
    variables: [{ id: "prey", label: "Prey", beginnerLabel: "Rabbits", meaning: "The animals being hunted", min: 10, max: 100, step: 1, unit: "agents", initial: 62 }, { id: "predators", label: "Predators", beginnerLabel: "Foxes", meaning: "The animals doing the hunting", min: 1, max: 80, step: 1, unit: "agents", initial: 24 }, { id: "food", label: "Food supply", beginnerLabel: "Available food", meaning: "How much food the rabbits can find", min: 10, max: 100, step: 1, unit: "%", initial: 70 }],
    options: [{ id: "rise", label: "Prey rises", beginnerLabel: "More rabbits", symbol: "↗" }, { id: "stable", label: "Prey stabilizes", beginnerLabel: "About the same", symbol: "→" }, { id: "fall", label: "Prey falls", beginnerLabel: "Fewer rabbits", symbol: "↘" }],
    primitives: ["Entities", "Quantity", "Relationship", "Feedback", "Delay", "State Change"], caveat: "Toy model: it demonstrates feedback, not a population forecast."
  },
  {
    id: "climate", title: "Climate Energy Balance", domain: "Earth Systems", difficulty: "complex",
    description: "Several coupled variables shift the energy balance of a simplified planet.", beginnerDescription: "The Sun adds warmth, bright surfaces bounce some light away, and invisible gases can hold heat in.", question: "What is the next net temperature tendency?", beginnerQuestion: "When these three things work together, does the planet get warmer, cooler, or stay close to the same?",
    whyItMatters: "Earth’s temperature is a balance between energy arriving, energy reflected, and heat held in the air.", transferPrompt: "What else might bounce sunlight away—ice, clouds, or a dark road? Predict first, then test the reflectivity.",
    variables: [{ id: "co2", label: "CO₂", beginnerLabel: "Heat-holding gas", meaning: "A gas that can keep heat from escaping", min: 280, max: 620, step: 10, unit: "ppm", initial: 430 }, { id: "albedo", label: "Reflectivity", beginnerLabel: "Sunlight bounce", meaning: "How much sunlight the planet sends back", min: .1, max: .8, step: .01, unit: "ratio", initial: .32 }, { id: "solar", label: "Solar input", beginnerLabel: "Sun strength", meaning: "How much energy arrives from the Sun", min: .8, max: 1.2, step: .01, unit: "×", initial: 1.02 }],
    options: [{ id: "warming", label: "Net warming", beginnerLabel: "It gets warmer", symbol: "↗" }, { id: "balanced", label: "Near balance", beginnerLabel: "About the same", symbol: "≈" }, { id: "cooling", label: "Net cooling", beginnerLabel: "It gets cooler", symbol: "↘" }],
    primitives: ["System", "Energy", "Flow", "Probability", "Coupling", "Scale", "Uncertainty"], caveat: "Toy model: it exposes coupled variables, not a climate prediction."
  }
];

export const defaultSelfEvolvingState = (): SelfEvolvingState => ({ generation: 0, totalRuns: 0, correctRuns: 0, mastery: Object.fromEntries(selfEvolvingExamples.map((example) => [example.id, 0])), challenge: 1, explanationDepth: 0, contrastMode: false, runs: [] });

export function evaluateExample(example: EngineExample, values: Record<string, number>, prediction: string): ExampleResult {
  if (example.id === "gravity") {
    const signal = values.gravity * Math.max(values.height, 1) / 20;
    const outcome = signal < .2 ? "float" : "down";
    const result = outcome === "float" ? "The sphere stays nearly suspended." : "The sphere accelerates downward.";
    return { outcome, outcomeLabel: result, beginnerResult: outcome === "float" ? "The ball stays there." : "The ball falls down.", explanation: `The downward force is ${values.gravity.toFixed(1)} m/s² across ${values.height.toFixed(0)} m of release height.`, plainExplanation: outcome === "float" ? "The pull is too gentle to make the ball move much." : "Earth is pulling the ball down, so its position changes faster and faster.", cause: "Earth pulls the ball", change: "The ball changes position", result, signal, correct: prediction === outcome, error: prediction === outcome ? 0 : 1 };
  }
  if (example.id === "ecosystem") {
    const pressure = values.predators / Math.max(values.prey, 1);
    const foodEffect = (values.food - 50) / 100;
    const signal = pressure - foodEffect * .35;
    const outcome = signal > .48 ? "fall" : signal < .16 ? "rise" : "stable";
    const result = outcome === "fall" ? "Predation pressure overwhelms replacement." : outcome === "rise" ? "Food support exceeds predation pressure." : "The populations enter a balancing band.";
    return { outcome, outcomeLabel: result, beginnerResult: outcome === "fall" ? "Fewer rabbits." : outcome === "rise" ? "More rabbits." : "About the same number of rabbits.", explanation: `Predator/prey pressure is ${(pressure * 100).toFixed(0)}%; food support shifts the balance by ${(foodEffect * 35).toFixed(0)} points.`, plainExplanation: "Foxes take rabbits away, while food helps rabbits replace their numbers. The balance between those two forces decides what happens next.", cause: "Foxes and food affect rabbits", change: "The balance between them shifts", result, signal, correct: prediction === outcome, error: prediction === outcome ? 0 : Math.min(1, Math.abs(signal - (outcome === "fall" ? .48 : outcome === "rise" ? .16 : .32)) + .25) };
  }
  const forcing = ((values.co2 - 280) / 340) * .62 + (0.35 - values.albedo) * 1.15 + (values.solar - 1) * 1.7;
  const outcome = forcing > .28 ? "warming" : forcing < -.12 ? "cooling" : "balanced";
  const result = outcome === "warming" ? "Incoming energy exceeds outgoing balance." : outcome === "cooling" ? "Reflection and lower input dominate." : "The simplified system is near energy balance.";
  return { outcome, outcomeLabel: result, beginnerResult: outcome === "warming" ? "The planet gets warmer." : outcome === "cooling" ? "The planet gets cooler." : "The planet stays about the same.", explanation: `Combined forcing signal: ${forcing.toFixed(2)} from greenhouse, reflectivity, and solar terms.`, plainExplanation: "Some energy arrives from the Sun, some bounces away, and some is held in the air. The winner decides whether the planet warms or cools next.", cause: "Sunlight, reflection, and trapped heat interact", change: "The planet’s energy balance shifts", result, signal: forcing, correct: prediction === outcome, error: prediction === outcome ? 0 : Math.min(1, Math.abs(forcing) + .22) };
}

export function evolveState(current: SelfEvolvingState, exampleId: string, result: ExampleResult, prediction: string): SelfEvolvingState {
  const priorMastery = current.mastery[exampleId] ?? 0;
  const nextMastery = Math.max(0, Math.min(100, priorMastery + (result.correct ? 14 : 5) - (result.correct ? 0 : result.error * 4)));
  const nextRuns = [{ id: `${exampleId}-${Date.now()}`, exampleId, prediction, outcome: result.outcome, correct: result.correct, error: result.error, generation: current.generation + 1, timestamp: new Date().toISOString() }, ...current.runs].slice(0, 40);
  const correctRuns = current.correctRuns + (result.correct ? 1 : 0);
  const totalRuns = current.totalRuns + 1;
  return { ...current, generation: current.generation + 1, totalRuns, correctRuns, mastery: { ...current.mastery, [exampleId]: nextMastery }, challenge: Math.max(1, Math.min(5, 1 + Math.floor((correctRuns / Math.max(totalRuns, 1)) * 4))), explanationDepth: result.correct ? Math.max(0, current.explanationDepth - 1) : Math.min(4, current.explanationDepth + 1), contrastMode: !result.correct || current.contrastMode && !result.correct, runs: nextRuns };
}
