import type { SciLoopEdge, SciLoopNode, SciLoopNodeType } from "@/lib/sciloop-flow";

export const resultGroups = ["Learning", "Attention", "Prediction Engine", "Emotion", "Interaction", "Efficiency", "Quality", "System", "Overall"] as const;
export type ResultGroup = (typeof resultGroups)[number];

export type ResultMetric = {
  id: string;
  group: ResultGroup;
  label: string;
  description: string;
  value: number;
};

export type SimulationResults = {
  metrics: ResultMetric[];
  groupScores: Record<ResultGroup, number>;
  overallScore: number;
  inputSummary: {
    nodes: number;
    connections: number;
    branches: number;
    experiments: number;
    feedback: number;
    loops: number;
  };
};

type SimulationContext = {
  nodes: SciLoopNode[];
  edges: SciLoopEdge[];
  count: (type: SciLoopNodeType) => number;
  has: (type: SciLoopNodeType) => boolean;
  branches: number;
  experiments: number;
  feedback: number;
  loops: number;
  actionDensity: number;
  structure: number;
  diversity: number;
  complexity: number;
  exploration: number;
  prediction: number;
  observation: number;
  completion: number;
  feedbackLoop: number;
  connectionDensity: number;
};

const clamp = (value: number) => Math.round(Math.min(100, Math.max(0, value)) * 10) / 10;
const average = (...values: number[]) => values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;
const inverse = (value: number) => 100 - value;

function makeContext(nodes: SciLoopNode[], edges: SciLoopEdge[]): SimulationContext {
  const count = (type: SciLoopNodeType) => nodes.filter((node) => node.data.nodeType === type).length;
  const has = (type: SciLoopNodeType) => count(type) > 0;
  const branches = new Set(edges.filter((edge) => edge.label === "if true" || edge.label === "if false").map((edge) => edge.source)).size;
  const experiments = count("Experiment") + count("Simulation");
  const feedback = count("Feedback") + count("Observation") + edges.filter((edge) => edge.label === "if true" || edge.label === "if false").length;
  const loops = edges.filter((edge) => edge.label === "repeat" || edge.animated).length;
  const actionDensity = clamp((count("User Action") + count("Experiment") + count("Simulation")) / Math.max(nodes.length, 1) * 180);
  const structure = clamp(edges.length / Math.max(nodes.length - 1, 1) * 100);
  const diversity = clamp(new Set(nodes.map((node) => node.data.nodeType)).size / 10 * 100);
  const complexity = clamp(nodes.length * 3.2 + edges.length * 1.7 + branches * 8 + diversity * .16);
  const exploration = clamp(count("Curiosity") * 22 + count("Challenge") * 18 + count("Unknown") * 12 + loops * 10);
  const prediction = clamp(count("Prediction") * 26 + count("Hypothesis") * 20 + branches * 16 + count("Rule") * 10);
  const observation = clamp(count("Observation") * 25 + count("Simulation") * 16 + count("Experience") * 9);
  const completion = clamp(count("Mastery") * 45 + count("Explanation") * 22 + count("Rule") * 16 + (nodes.length > 10 ? 17 : nodes.length * 1.4));
  const feedbackLoop = clamp(feedback * 11 + loops * 18 + branches * 10);
  const connectionDensity = clamp(edges.length / Math.max(nodes.length * 1.35, 1) * 100);
  return { nodes, edges, count, has, branches, experiments, feedback, loops, actionDensity, structure, diversity, complexity, exploration, prediction, observation, completion, feedbackLoop, connectionDensity };
}

type Formula = (context: SimulationContext, groupScores: Partial<Record<ResultGroup, number>>) => number;

const metricDefinitions: Array<{ id: string; group: ResultGroup; label: string; description: string; formula: Formula }> = [
  { id: "understanding-level", group: "Learning", label: "Understanding Level", description: "Depth of the current concept-building path.", formula: (c) => average(c.observation, c.prediction, c.completion, c.feedbackLoop) },
  { id: "concept-retention", group: "Learning", label: "Concept Retention", description: "How many reinforcing passes the flow creates.", formula: (c) => average(c.feedbackLoop, c.completion, c.loops * 22 + c.observation) },
  { id: "long-term-memory", group: "Learning", label: "Long-term Memory", description: "Heuristic memory support from repetition and explanation.", formula: (c) => average(c.loops * 24, c.feedbackLoop, c.count("Explanation") * 32, c.count("Mastery") * 38) },
  { id: "recall-speed", group: "Learning", label: "Recall Speed", description: "Expected retrieval ease from compact connected representations.", formula: (c) => clamp(76 - c.complexity * .35 + c.connectionDensity * .22 + c.count("Rule") * 7) },
  { id: "transfer-learning", group: "Learning", label: "Transfer Learning", description: "Evidence that a rule can move into a new situation.", formula: (c) => average(c.count("Rule") * 34, c.count("Explanation") * 24, c.count("User Action") * 18, c.completion) },
  { id: "concept-connection", group: "Learning", label: "Concept Connection Score", description: "Breadth and density of meaningful links.", formula: (c) => average(c.connectionDensity, c.diversity, c.structure) },
  { id: "knowledge-compression", group: "Learning", label: "Knowledge Compression", description: "How much experience is condensed into reusable rules.", formula: (c) => clamp(c.count("Rule") * 31 + c.count("Explanation") * 19 + c.count("Pattern") * 14 + c.count("Mastery") * 18) },
  { id: "mental-model-quality", group: "Learning", label: "Mental Model Quality", description: "Coherence between prediction, simulation, observation, and rule.", formula: (c) => average(c.prediction, c.observation, c.count("Rule") * 30, c.count("Explanation") * 24) },
  { id: "misconception-probability", group: "Learning", label: "Misconception Probability", description: "Risk rises when predictions lack feedback or observation.", formula: (c) => clamp(58 - c.feedbackLoop * .32 - c.observation * .28 + c.complexity * .26) },

  { id: "curiosity-level", group: "Attention", label: "Curiosity Level", description: "Open questions and unresolved contrast in the path.", formula: (c) => clamp(c.exploration + c.count("Prediction") * 7) },
  { id: "attention-retention", group: "Attention", label: "Attention Retention", description: "Expected ability to remain with the loop.", formula: (c) => average(c.exploration, c.feedbackLoop, c.actionDensity, c.completion) },
  { id: "cognitive-load", group: "Attention", label: "Cognitive Load", description: "Load produced by depth, branching, and node density.", formula: (c) => clamp(c.complexity * .82 + c.branches * 4) },
  { id: "mental-fatigue", group: "Attention", label: "Mental Fatigue", description: "Estimated fatigue from long or highly branching paths.", formula: (c) => clamp(c.complexity * .68 + c.nodes.length * 1.1 - c.loops * 5) },
  { id: "boredom-probability", group: "Attention", label: "Boredom Probability", description: "Risk of low novelty or low participation.", formula: (c) => clamp(70 - c.exploration * .52 - c.actionDensity * .26) },
  { id: "engagement", group: "Attention", label: "Engagement", description: "Expected pull created by challenge and agency.", formula: (c) => average(c.exploration, c.actionDensity, c.feedbackLoop, inverse(c.complexity) + 42) },
  { id: "focus-stability", group: "Attention", label: "Focus Stability", description: "Continuity of the learning loop over time.", formula: (c) => average(c.structure, c.feedbackLoop, inverse(c.complexity) + 40) },
  { id: "drop-off-probability", group: "Attention", label: "Drop-off Probability", description: "Risk that a learner exits before mastery.", formula: (c) => clamp(72 - c.feedbackLoop * .35 - c.actionDensity * .24 + c.complexity * .3) },

  { id: "prediction-accuracy", group: "Prediction Engine", label: "Prediction Accuracy", description: "Expected quality of falsifiable predictions.", formula: (c) => average(c.prediction, c.observation, c.feedbackLoop) },
  { id: "prediction-error", group: "Prediction Engine", label: "Prediction Error", description: "Expected error before feedback corrects the model.", formula: (c) => clamp(100 - average(c.prediction, c.observation, c.feedbackLoop) + c.complexity * .15) },
  { id: "surprise-level", group: "Prediction Engine", label: "Surprise Level", description: "Potential for informative mismatch and discovery.", formula: (c) => clamp(c.exploration * .48 + c.branches * 13 + c.count("Unknown") * 14) },
  { id: "discovery-rate", group: "Prediction Engine", label: "Discovery Rate", description: "Expected rate of new patterns becoming explicit.", formula: (c) => average(c.exploration, c.count("Pattern") * 34, c.count("Observation") * 25, c.loops * 20) },
  { id: "hypothesis-quality", group: "Prediction Engine", label: "Hypothesis Quality", description: "Strength of the bridge from pattern to testable claim.", formula: (c) => average(c.count("Pattern") * 30, c.count("Hypothesis") * 38, c.count("Experiment") * 24, c.feedbackLoop) },
  { id: "experiment-frequency", group: "Prediction Engine", label: "Experiment Frequency", description: "How often the flow asks reality a question.", formula: (c) => clamp(c.experiments * 30 + c.count("User Action") * 18 + c.loops * 8) },

  { id: "motivation", group: "Emotion", label: "Motivation", description: "Expected willingness to continue the loop.", formula: (c) => average(c.exploration, c.completion, c.feedbackLoop) },
  { id: "confidence", group: "Emotion", label: "Confidence", description: "Confidence produced by evidence-backed wins.", formula: (c) => average(c.count("Feedback") * 30, c.count("Rule") * 25, c.count("Mastery") * 36, c.prediction) },
  { id: "frustration", group: "Emotion", label: "Frustration", description: "Estimated friction from complexity and failed branches.", formula: (c) => clamp(c.complexity * .48 + c.branches * 8 - c.feedbackLoop * .18) },
  { id: "reward-feeling", group: "Emotion", label: "Reward Feeling", description: "Reward moments implied by discovery and mastery.", formula: (c) => average(c.count("Feedback") * 24, c.count("Mastery") * 40, c.count("Pattern") * 10, c.completion) },
  { id: "flow-state-probability", group: "Emotion", label: "Flow State Probability", description: "Chance that challenge and feedback stay balanced.", formula: (c) => clamp(90 - Math.abs(c.actionDensity - c.complexity) * .45 + c.feedbackLoop * .16) },
  { id: "satisfaction", group: "Emotion", label: "Satisfaction", description: "Expected sense of closure and progress.", formula: (c) => average(c.completion, c.feedbackLoop, c.count("Mastery") * 32, inverse(c.complexity * .5)) },

  { id: "user-participation", group: "Interaction", label: "User Participation", description: "How many decisions and actions belong to the learner.", formula: (c) => clamp(c.count("User Action") * 26 + c.experiments * 18 + c.count("Challenge") * 14) },
  { id: "interaction-rate", group: "Interaction", label: "Interaction Rate", description: "Density of active operations in the flow.", formula: (c) => c.actionDensity },
  { id: "exploration-rate", group: "Interaction", label: "Exploration Rate", description: "Expected movement through alternatives and unknowns.", formula: (c) => c.exploration },
  { id: "experimentation-score", group: "Interaction", label: "Experimentation Score", description: "Breadth of test-and-retry behavior.", formula: (c) => average(c.experiments * 27, c.count("Hypothesis") * 18, c.loops * 24) },
  { id: "retry-probability", group: "Interaction", label: "Retry Probability", description: "Likelihood that a mismatch creates another useful attempt.", formula: (c) => average(c.loops * 32, c.count("Curiosity") * 20, c.feedbackLoop) },
  { id: "time-on-task", group: "Interaction", label: "Time on Task", description: "Expected sustained time available for learning work.", formula: (c) => average(c.structure, c.completion, c.actionDensity) },

  { id: "learning-speed", group: "Efficiency", label: "Learning Speed", description: "Expected progress per flow pass.", formula: (c) => clamp(78 - c.complexity * .28 + c.feedbackLoop * .24 + c.structure * .16) },
  { id: "time-to-mastery", group: "Efficiency", label: "Time to Mastery", description: "Inverse estimate of effort required to reach mastery.", formula: (c) => clamp(100 - c.completion + c.complexity * .2) },
  { id: "information-density", group: "Efficiency", label: "Information Density", description: "Meaningful signals per node and connection.", formula: (c) => average(c.diversity, c.connectionDensity, c.prediction) },
  { id: "attention-efficiency", group: "Efficiency", label: "Attention Efficiency", description: "Learning signal relative to cognitive load.", formula: (c) => clamp(100 - c.complexity * .4 + c.feedbackLoop * .3 + c.actionDensity * .22) },
  { id: "understanding-per-minute", group: "Efficiency", label: "Understanding per Minute", description: "Placeholder throughput estimate for comprehension.", formula: (c) => average(c.observation, c.feedbackLoop, inverse(c.complexity) + 45) },
  { id: "memory-per-minute", group: "Efficiency", label: "Memory per Minute", description: "Placeholder throughput estimate for durable memory.", formula: (c) => average(c.loops * 22, c.count("Rule") * 24, c.feedbackLoop, inverse(c.complexity) + 42) },

  { id: "clarity", group: "Quality", label: "Clarity", description: "How directly each step communicates its role.", formula: (c) => clamp(88 - c.complexity * .34 + c.structure * .18) },
  { id: "visual-simplicity", group: "Quality", label: "Visual Simplicity", description: "How easy the shape is to scan at a glance.", formula: (c) => clamp(94 - c.complexity * .52 + c.structure * .12) },
  { id: "ambiguity", group: "Quality", label: "Ambiguity", description: "Risk that a step or arrow admits multiple interpretations.", formula: (c) => clamp(65 - c.count("Explanation") * 13 - c.count("Rule") * 10 + c.complexity * .22) },
  { id: "explainability", group: "Quality", label: "Explainability", description: "How well the learning mechanism can be narrated.", formula: (c) => average(c.count("Explanation") * 27, c.count("Rule") * 25, c.structure, c.feedbackLoop) },
  { id: "intuitiveness", group: "Quality", label: "Intuitiveness", description: "Expected ease of following the causal sequence.", formula: (c) => average(c.structure, inverse(c.complexity) + 45, c.observation) },
  { id: "consistency", group: "Quality", label: "Consistency", description: "Regularity of the flow grammar and connection semantics.", formula: (c) => average(c.structure, c.connectionDensity, inverse(c.complexity) + 48) },

  { id: "complexity-score", group: "System", label: "Complexity Score", description: "Structural complexity of the current combo.", formula: (c) => c.complexity },
  { id: "scalability-score", group: "System", label: "Scalability Score", description: "How well the model can accept more nodes and branches.", formula: (c) => clamp(92 - c.complexity * .28 + c.structure * .18) },
  { id: "adaptability", group: "System", label: "Adaptability", description: "Capacity to revise beliefs through feedback.", formula: (c) => average(c.feedbackLoop, c.exploration, c.branches * 24) },
  { id: "robustness", group: "System", label: "Robustness", description: "Resilience when one prediction or path fails.", formula: (c) => average(c.branches * 30, c.loops * 25, c.feedbackLoop, c.structure) },
  { id: "personalization-quality", group: "System", label: "Personalization Quality", description: "Room for user actions, choices, and adaptive paths.", formula: (c) => average(c.count("User Action") * 24, c.branches * 24, c.count("Feedback") * 27, c.exploration) },
  { id: "accessibility", group: "System", label: "Accessibility", description: "Placeholder for multi-modal and low-friction access.", formula: (c) => clamp(82 - c.complexity * .24 + c.count("Explanation") * 8 + c.count("Observation") * 5) },

  { id: "learning-effectiveness", group: "Overall", label: "Learning Effectiveness", description: "Composite learning outcome estimate.", formula: (c, scores) => average(scores.Learning ?? 0, scores.Efficiency ?? 0, scores.Quality ?? 0) },
  { id: "teaching-effectiveness", group: "Overall", label: "Teaching Effectiveness", description: "Composite teaching system estimate.", formula: (c, scores) => average(scores.Learning ?? 0, scores.Attention ?? 0, scores.Quality ?? 0, scores.System ?? 0) },
  { id: "user-success-probability", group: "Overall", label: "User Success Probability", description: "Probability that a learner reaches a useful outcome.", formula: (c, scores) => average(scores.Learning ?? 0, scores.Emotion ?? 0, scores.Interaction ?? 0) },
  { id: "mastery-probability", group: "Overall", label: "Mastery Probability", description: "Probability of durable independent performance.", formula: (c, scores) => average(c.completion, scores.Learning ?? 0, scores.Efficiency ?? 0) },
  { id: "recommendation-score", group: "Overall", label: "Recommendation Score", description: "Placeholder decision score for selecting this combo.", formula: (c, scores) => average(scores.Overall ?? 0, scores.System ?? 0, scores.Quality ?? 0) },
  { id: "overall-engine-score", group: "Overall", label: "Overall Engine Score", description: "One placeholder score for the current learning engine.", formula: (c, scores) => average(scores.Learning ?? 0, scores.Attention ?? 0, scores["Prediction Engine"] ?? 0, scores.Emotion ?? 0, scores.Interaction ?? 0, scores.Efficiency ?? 0, scores.Quality ?? 0, scores.System ?? 0) }
];

export function simulateFlow(nodes: SciLoopNode[], edges: SciLoopEdge[]): SimulationResults {
  const context = makeContext(nodes, edges);
  const groupScores = {} as Record<ResultGroup, number>;
  const metrics: ResultMetric[] = [];

  for (const group of resultGroups) {
    if (group === "Overall") continue;
    const groupDefinitions = metricDefinitions.filter((definition) => definition.group === group);
    const groupValues = groupDefinitions.map((definition) => clamp(definition.formula(context, groupScores)));
    groupScores[group] = clamp(average(...groupValues));
    groupDefinitions.forEach((definition, index) => metrics.push({ id: definition.id, group, label: definition.label, description: definition.description, value: groupValues[index] }));
  }

  const overallDefinitions = metricDefinitions.filter((definition) => definition.group === "Overall");
  const overallValues = overallDefinitions.map((definition) => clamp(definition.formula(context, groupScores)));
  groupScores.Overall = clamp(average(...overallValues));
  overallDefinitions.forEach((definition, index) => metrics.push({ id: definition.id, group: "Overall", label: definition.label, description: definition.description, value: overallValues[index] }));

  return {
    metrics,
    groupScores,
    overallScore: groupScores.Overall,
    inputSummary: { nodes: nodes.length, connections: edges.length, branches: context.branches, experiments: context.experiments, feedback: context.feedback, loops: context.loops }
  };
}

export function metricsForGroup(results: SimulationResults, group: ResultGroup) {
  return results.metrics.filter((metric) => metric.group === group);
}
