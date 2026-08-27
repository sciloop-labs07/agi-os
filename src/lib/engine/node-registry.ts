export const reasoningNodeTypeIds = [
  "Experience", "Curiosity", "Prediction", "User Action", "Simulation", "Observation", "Pattern", "Hypothesis", "Rule", "Explanation", "Experiment", "Challenge", "Mastery", "Feedback", "Unknown", "Goal", "Constraint", "Decision", "Optimization"
] as const;

export type ReasoningNodeType = (typeof reasoningNodeTypeIds)[number];
export type ReasoningCategory = "Reality" | "Intelligence" | "Validation" | "Knowledge" | "Control";
export type ReasoningNodeKind = "State" | "Process" | "Reasoning" | "Validation" | "Knowledge" | "Control" | "Learning";
export type NodeExecutionType = "capture" | "question" | "infer" | "predict" | "simulate" | "act" | "validate" | "explain" | "store" | "decide" | "optimize" | "challenge";
export type NodeProperty = { id: string; label: string; type: "text" | "number" | "boolean" | "select"; defaultValue: string | number | boolean; options?: string[] };
export type NodeFutureAIHooks = { evidence: boolean; confidence: boolean; knowledgeGraph: boolean; userTelemetry: boolean };
export type NodeVisualStyle = { icon: string; accent: string; animation: NodeMetadata["animation"] };
export type NodePort = { id: string; label: string; direction: "input" | "output"; accepts?: ReasoningNodeType[] };
export type NodeMetadata = {
  id: ReasoningNodeType;
  displayName: string;
  description: string;
  category: ReasoningCategory;
  kind: ReasoningNodeKind;
  icon: string;
  accent: string;
  inputs: NodePort[];
  outputs: NodePort[];
  validation: string[];
  defaultSize: { width: number; height: number };
  animation: "pulse" | "flow" | "spark" | "none";
  purpose: string;
  requiredInputs: string[];
  producedOutputs: string[];
  validPreviousNodes: ReasoningNodeType[];
  validNextNodes: ReasoningNodeType[];
  executionType: NodeExecutionType;
  properties: NodeProperty[];
  futureAIHooks: NodeFutureAIHooks;
  visualStyle: NodeVisualStyle;
};

const definitions: Record<ReasoningNodeType, Omit<NodeMetadata, "id" | "purpose" | "requiredInputs" | "producedOutputs" | "validPreviousNodes" | "validNextNodes" | "executionType" | "properties" | "futureAIHooks" | "visualStyle">> = {
  Experience: { displayName: "Experience", description: "A concrete encounter with reality.", category: "Reality", kind: "State", icon: "◌", accent: "#48e5ff", inputs: [], outputs: [{ id: "experience", label: "experience", direction: "output" }], validation: [], defaultSize: { width: 196, height: 92 }, animation: "pulse" },
  Curiosity: { displayName: "Curiosity", description: "An unresolved question or information gap.", category: "Intelligence", kind: "Reasoning", icon: "?", accent: "#ffc45e", inputs: [{ id: "stimulus", label: "stimulus", direction: "input" }], outputs: [{ id: "question", label: "question", direction: "output" }], validation: [], defaultSize: { width: 196, height: 92 }, animation: "spark" },
  Prediction: { displayName: "Prediction", description: "A falsifiable expectation about what happens next.", category: "Intelligence", kind: "Reasoning", icon: "↗", accent: "#b6ff61", inputs: [{ id: "question", label: "question", direction: "input" }], outputs: [{ id: "claim", label: "claim", direction: "output" }], validation: ["requires an observable consequence"], defaultSize: { width: 196, height: 92 }, animation: "flow" },
  "User Action": { displayName: "User Action", description: "A deliberate intervention by the learner.", category: "Validation", kind: "Process", icon: "⌁", accent: "#ff6b8a", inputs: [{ id: "intent", label: "intent", direction: "input" }], outputs: [{ id: "action", label: "action", direction: "output" }], validation: [], defaultSize: { width: 196, height: 92 }, animation: "flow" },
  Simulation: { displayName: "Simulation", description: "A controlled model of a possible outcome.", category: "Validation", kind: "Validation", icon: "◎", accent: "#8eb7ff", inputs: [{ id: "claim", label: "claim", direction: "input", accepts: ["Prediction", "Hypothesis", "Rule"] }], outputs: [{ id: "result", label: "result", direction: "output" }], validation: ["requires a prediction or hypothesis"], defaultSize: { width: 196, height: 92 }, animation: "flow" },
  Observation: { displayName: "Observation", description: "Evidence captured from reality or a simulation.", category: "Reality", kind: "State", icon: "◉", accent: "#48e5ff", inputs: [{ id: "result", label: "result", direction: "input" }], outputs: [{ id: "evidence", label: "evidence", direction: "output" }], validation: ["requires evidence source"], defaultSize: { width: 196, height: 92 }, animation: "pulse" },
  Pattern: { displayName: "Pattern", description: "A repeated or meaningful structure in observations.", category: "Intelligence", kind: "Reasoning", icon: "⌘", accent: "#bc92ff", inputs: [{ id: "evidence", label: "evidence", direction: "input", accepts: ["Observation"] }], outputs: [{ id: "pattern", label: "pattern", direction: "output" }], validation: ["requires observations"], defaultSize: { width: 196, height: 92 }, animation: "spark" },
  Hypothesis: { displayName: "Hypothesis", description: "A model proposed for testing.", category: "Intelligence", kind: "Reasoning", icon: "◇", accent: "#ffa85e", inputs: [{ id: "pattern", label: "pattern", direction: "input" }], outputs: [{ id: "model", label: "model", direction: "output" }], validation: ["requires a pattern or question"], defaultSize: { width: 196, height: 92 }, animation: "spark" },
  Rule: { displayName: "Rule", description: "A reusable relationship extracted from evidence.", category: "Knowledge", kind: "Knowledge", icon: "≡", accent: "#f4d35e", inputs: [{ id: "evidence", label: "evidence", direction: "input" }], outputs: [{ id: "rule", label: "rule", direction: "output" }], validation: ["requires evidence or a tested hypothesis"], defaultSize: { width: 196, height: 92 }, animation: "pulse" },
  Explanation: { displayName: "Explanation", description: "A compact account of why an outcome occurs.", category: "Intelligence", kind: "Reasoning", icon: "≋", accent: "#7ad6c4", inputs: [{ id: "rule", label: "rule", direction: "input" }], outputs: [{ id: "model", label: "model", direction: "output" }], validation: [], defaultSize: { width: 196, height: 92 }, animation: "flow" },
  Experiment: { displayName: "Experiment", description: "A repeatable test that distinguishes models.", category: "Validation", kind: "Validation", icon: "✳", accent: "#ff5f8f", inputs: [{ id: "hypothesis", label: "hypothesis", direction: "input" }], outputs: [{ id: "evidence", label: "evidence", direction: "output" }], validation: ["requires a hypothesis or prediction"], defaultSize: { width: 196, height: 92 }, animation: "flow" },
  Challenge: { displayName: "Challenge", description: "A deliberate test of learner understanding.", category: "Control", kind: "Learning", icon: "!", accent: "#ff7e5c", inputs: [{ id: "model", label: "model", direction: "input" }], outputs: [{ id: "response", label: "response", direction: "output" }], validation: [], defaultSize: { width: 196, height: 92 }, animation: "pulse" },
  Mastery: { displayName: "Mastery", description: "Reliable transfer of a model to a new situation.", category: "Knowledge", kind: "Learning", icon: "✓", accent: "#b6ff61", inputs: [{ id: "model", label: "model", direction: "input" }], outputs: [], validation: ["requires tested knowledge"], defaultSize: { width: 196, height: 92 }, animation: "pulse" },
  Feedback: { displayName: "Feedback", description: "A signal that updates confidence or strategy.", category: "Validation", kind: "Learning", icon: "↺", accent: "#76c4ff", inputs: [{ id: "result", label: "result", direction: "input" }], outputs: [{ id: "update", label: "update", direction: "output" }], validation: [], defaultSize: { width: 196, height: 92 }, animation: "flow" },
  Unknown: { displayName: "Unknown", description: "A known gap or unmodeled possibility.", category: "Reality", kind: "State", icon: "?", accent: "#94a3b8", inputs: [], outputs: [{ id: "question", label: "question", direction: "output" }], validation: [], defaultSize: { width: 196, height: 92 }, animation: "spark" },
  Goal: { displayName: "Goal", description: "The outcome the reasoning graph is trying to reach.", category: "Control", kind: "Control", icon: "◎", accent: "#e879f9", inputs: [], outputs: [{ id: "intent", label: "intent", direction: "output" }], validation: [], defaultSize: { width: 196, height: 92 }, animation: "pulse" },
  Constraint: { displayName: "Constraint", description: "A rule that limits valid paths or solutions.", category: "Control", kind: "Control", icon: "⊣", accent: "#fb7185", inputs: [], outputs: [{ id: "limit", label: "limit", direction: "output" }], validation: [], defaultSize: { width: 196, height: 92 }, animation: "none" },
  Decision: { displayName: "Decision", description: "A branching choice based on evidence or a rule.", category: "Control", kind: "Control", icon: "⑂", accent: "#c084fc", inputs: [{ id: "evidence", label: "evidence", direction: "input" }], outputs: [{ id: "true", label: "if true", direction: "output" }, { id: "false", label: "if false", direction: "output" }], validation: ["requires decision criterion"], defaultSize: { width: 196, height: 92 }, animation: "flow" },
  Optimization: { displayName: "Optimization", description: "A search over configurations for a better outcome.", category: "Control", kind: "Process", icon: "⌁", accent: "#22d3ee", inputs: [{ id: "candidate", label: "candidate", direction: "input" }], outputs: [{ id: "best", label: "best", direction: "output" }], validation: ["requires a measurable score"], defaultSize: { width: 196, height: 92 }, animation: "flow" }
};

const semanticContracts: Record<ReasoningNodeType, Pick<NodeMetadata, "purpose" | "validPreviousNodes" | "validNextNodes" | "executionType">> = {
  Experience: { purpose: "Ground the engine in a concrete encounter.", validPreviousNodes: ["Unknown", "Goal"], validNextNodes: ["Observation", "Curiosity", "Pattern"], executionType: "capture" },
  Curiosity: { purpose: "Turn a gap or stimulus into a question worth investigating.", validPreviousNodes: ["Experience", "Unknown", "Observation", "Feedback"], validNextNodes: ["Prediction", "Hypothesis", "User Action", "Experiment"], executionType: "question" },
  Prediction: { purpose: "State an observable expectation that can be checked.", validPreviousNodes: ["Curiosity", "Hypothesis", "Rule", "Feedback"], validNextNodes: ["Simulation", "Experiment", "User Action", "Observation", "Feedback"], executionType: "predict" },
  "User Action": { purpose: "Let the learner or operator intervene in the problem.", validPreviousNodes: ["Curiosity", "Prediction", "Challenge", "Goal"], validNextNodes: ["Observation", "Feedback", "Simulation"], executionType: "act" },
  Simulation: { purpose: "Produce a controlled outcome for a claim or model.", validPreviousNodes: ["Prediction", "Hypothesis", "Rule", "User Action"], validNextNodes: ["Observation", "Feedback", "Pattern", "Experiment"], executionType: "simulate" },
  Observation: { purpose: "Capture evidence from reality, action, or simulation.", validPreviousNodes: ["Experience", "Simulation", "Experiment", "User Action", "Feedback"], validNextNodes: ["Pattern", "Hypothesis", "Rule", "Feedback", "Explanation"], executionType: "capture" },
  Pattern: { purpose: "Compress multiple observations into a meaningful structure.", validPreviousNodes: ["Observation", "Experience", "Feedback"], validNextNodes: ["Hypothesis", "Rule", "Explanation", "Prediction"], executionType: "infer" },
  Hypothesis: { purpose: "Propose a model that can explain and be tested.", validPreviousNodes: ["Curiosity", "Pattern", "Observation", "Feedback"], validNextNodes: ["Simulation", "Experiment", "Prediction", "Explanation", "Rule"], executionType: "infer" },
  Rule: { purpose: "Store a reusable relationship supported by evidence.", validPreviousNodes: ["Observation", "Pattern", "Hypothesis", "Explanation"], validNextNodes: ["Prediction", "Explanation", "Mastery", "Decision", "Simulation"], executionType: "store" },
  Explanation: { purpose: "Make the causal account understandable and inspectable.", validPreviousNodes: ["Rule", "Hypothesis", "Pattern", "Observation"], validNextNodes: ["Challenge", "Mastery", "Prediction", "Feedback"], executionType: "explain" },
  Experiment: { purpose: "Distinguish competing models through a repeatable test.", validPreviousNodes: ["Curiosity", "Prediction", "Hypothesis", "Goal"], validNextNodes: ["Observation", "Feedback", "Pattern", "Rule"], executionType: "validate" },
  Challenge: { purpose: "Test whether a learner can use the model independently.", validPreviousNodes: ["Explanation", "Rule", "Mastery", "Goal"], validNextNodes: ["User Action", "Feedback", "Mastery", "Curiosity"], executionType: "challenge" },
  Mastery: { purpose: "Mark reliable transfer of understanding to a new situation.", validPreviousNodes: ["Explanation", "Rule", "Challenge", "Feedback"], validNextNodes: ["Goal", "User Action"], executionType: "validate" },
  Feedback: { purpose: "Update confidence, strategy, or the next question from a result.", validPreviousNodes: ["Observation", "Simulation", "Experiment", "Challenge", "User Action"], validNextNodes: ["Hypothesis", "Prediction", "Curiosity", "Rule", "Mastery"], executionType: "validate" },
  Unknown: { purpose: "Represent an explicit gap, uncertainty, or unmodeled possibility.", validPreviousNodes: ["Goal", "Observation", "Experience", "Mastery"], validNextNodes: ["Curiosity", "Observation", "Hypothesis"], executionType: "question" },
  Goal: { purpose: "Declare the outcome the reasoning engine is trying to reach.", validPreviousNodes: [], validNextNodes: ["Experience", "Curiosity", "Challenge", "Decision", "Optimization"], executionType: "capture" },
  Constraint: { purpose: "Make rules and limits visible to every later operation.", validPreviousNodes: ["Goal", "Observation", "Rule"], validNextNodes: ["Prediction", "Decision", "Experiment", "Optimization"], executionType: "validate" },
  Decision: { purpose: "Branch the engine using an explicit criterion.", validPreviousNodes: ["Observation", "Rule", "Constraint", "Feedback"], validNextNodes: ["User Action", "Simulation", "Experiment", "Goal"], executionType: "decide" },
  Optimization: { purpose: "Search candidate configurations for a better defined outcome.", validPreviousNodes: ["Goal", "Constraint", "Decision", "Feedback"], validNextNodes: ["Experiment", "Challenge", "Mastery"], executionType: "optimize" }
};

const defaultProperties: NodeProperty[] = [
  { id: "notes", label: "Notes", type: "text", defaultValue: "" },
  { id: "confidence", label: "Confidence", type: "number", defaultValue: 50 }
];
const futureAIHooks: NodeFutureAIHooks = { evidence: true, confidence: true, knowledgeGraph: true, userTelemetry: true };

export const nodeRegistry: Record<ReasoningNodeType, NodeMetadata> = Object.fromEntries(Object.entries(definitions).map(([id, metadata]) => {
  const nodeType = id as ReasoningNodeType;
  const contract = semanticContracts[nodeType];
  return [nodeType, { id: nodeType, ...metadata, ...contract, requiredInputs: metadata.inputs.map((port) => port.label), producedOutputs: metadata.outputs.map((port) => port.label), properties: defaultProperties.map((property) => ({ ...property })), futureAIHooks, visualStyle: { icon: metadata.icon, accent: metadata.accent, animation: metadata.animation } }];
})) as Record<ReasoningNodeType, NodeMetadata>;
export const nodeRegistryGroups: Array<{ label: ReasoningCategory; nodeTypes: ReasoningNodeType[] }> = [
  { label: "Reality", nodeTypes: ["Unknown", "Observation", "Experience"] },
  { label: "Intelligence", nodeTypes: ["Curiosity", "Pattern", "Prediction", "Hypothesis", "Explanation"] },
  { label: "Validation", nodeTypes: ["Simulation", "Experiment", "User Action", "Feedback"] },
  { label: "Knowledge", nodeTypes: ["Rule", "Mastery"] },
  { label: "Control", nodeTypes: ["Goal", "Constraint", "Decision", "Optimization", "Challenge"] }
];
