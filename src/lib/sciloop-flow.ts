import type { Edge, Node } from "reactflow";
import { MarkerType } from "reactflow";
import { reasoningNodeTypeIds, type ReasoningNodeType } from "./engine/node-registry";

export const sciloopNodeTypes = reasoningNodeTypeIds;

export type SciLoopNodeType = ReasoningNodeType;

export const sciloopConnectionLabels = ["causes", "depends on", "leads to", "repeat", "if true", "if false"] as const;
export type SciLoopConnectionLabel = (typeof sciloopConnectionLabels)[number];

export type SciLoopNodeData = {
  label: string;
  nodeType: SciLoopNodeType;
  name?: string;
  description?: string;
  purpose?: string;
  category?: string;
  confidence?: number;
  status?: "draft" | "ready" | "blocked" | "deprecated";
  executionState?: "waiting" | "running" | "completed" | "failed" | "skipped";
  notes?: string;
  customProperties?: Record<string, string | number | boolean>;
  metadata?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  connections?: string[];
  note?: string;
  optimizer?: {
    intensity: number;
    novelty: number;
    challenge: number;
    repetition: number;
  };
};

export type SciLoopNode = Node<SciLoopNodeData>;
export type SciLoopEdge = Edge<{ label: SciLoopConnectionLabel }>;

export const nodePalette: Record<SciLoopNodeType, { fill: string; border: string; text: string; accent: string }> = {
  Experience: { fill: "rgba(72,229,255,.12)", border: "rgba(72,229,255,.52)", text: "#dffbff", accent: "#48e5ff" },
  Curiosity: { fill: "rgba(255,196,94,.14)", border: "rgba(255,196,94,.56)", text: "#fff2cf", accent: "#ffc45e" },
  Prediction: { fill: "rgba(182,255,97,.12)", border: "rgba(182,255,97,.52)", text: "#efffd8", accent: "#b6ff61" },
  "User Action": { fill: "rgba(255,107,138,.13)", border: "rgba(255,107,138,.54)", text: "#ffe0e9", accent: "#ff6b8a" },
  Simulation: { fill: "rgba(142,183,255,.14)", border: "rgba(142,183,255,.54)", text: "#e5edff", accent: "#8eb7ff" },
  Observation: { fill: "rgba(72,229,255,.15)", border: "rgba(72,229,255,.62)", text: "#e6fcff", accent: "#48e5ff" },
  Pattern: { fill: "rgba(188,146,255,.14)", border: "rgba(188,146,255,.54)", text: "#f0e5ff", accent: "#bc92ff" },
  Hypothesis: { fill: "rgba(255,168,94,.14)", border: "rgba(255,168,94,.56)", text: "#ffead8", accent: "#ffa85e" },
  Rule: { fill: "rgba(244,211,94,.15)", border: "rgba(244,211,94,.6)", text: "#fff8d5", accent: "#f4d35e" },
  Explanation: { fill: "rgba(122,214,196,.14)", border: "rgba(122,214,196,.54)", text: "#ddfff8", accent: "#7ad6c4" },
  Experiment: { fill: "rgba(255,95,143,.15)", border: "rgba(255,95,143,.6)", text: "#ffe3ec", accent: "#ff5f8f" },
  Challenge: { fill: "rgba(255,126,92,.15)", border: "rgba(255,126,92,.58)", text: "#ffe5dc", accent: "#ff7e5c" },
  Mastery: { fill: "rgba(182,255,97,.2)", border: "rgba(182,255,97,.72)", text: "#f2ffdf", accent: "#b6ff61" },
  Feedback: { fill: "rgba(118,196,255,.14)", border: "rgba(118,196,255,.58)", text: "#e3f4ff", accent: "#76c4ff" },
  Unknown: { fill: "rgba(148,163,184,.13)", border: "rgba(148,163,184,.46)", text: "#e2e8f0", accent: "#94a3b8" }
  ,Goal: { fill: "rgba(232,121,249,.14)", border: "rgba(232,121,249,.54)", text: "#fbe5ff", accent: "#e879f9" }
  ,Constraint: { fill: "rgba(251,113,133,.14)", border: "rgba(251,113,133,.54)", text: "#ffe2e8", accent: "#fb7185" }
  ,Decision: { fill: "rgba(192,132,252,.14)", border: "rgba(192,132,252,.54)", text: "#f2e6ff", accent: "#c084fc" }
  ,Optimization: { fill: "rgba(34,211,238,.14)", border: "rgba(34,211,238,.54)", text: "#dffcff", accent: "#22d3ee" }
};

const initialNodes: Array<[string, SciLoopNodeType, string, number, number]> = [
  ["start", "Experience", "Encounter reality", 30, 30],
  ["curiosity", "Curiosity", "Open question", 300, 30],
  ["prediction", "Prediction", "Commit prediction", 30, 165],
  ["commit", "User Action", "Manipulate variable", 300, 165],
  ["simulation", "Simulation", "Run model", 30, 300],
  ["observe", "Observation", "Observe result", 300, 300],
  ["pattern", "Pattern", "Find pattern", 30, 435],
  ["hypothesis", "Hypothesis", "Build hypothesis", 300, 435],
  ["test", "Experiment", "Test again", 30, 570],
  ["feedback", "Feedback", "Update confidence", 300, 570],
  ["rule", "Rule", "Discover rule", 30, 705],
  ["explain", "Explanation", "Compress explanation", 300, 705],
  ["challenge", "Challenge", "Transfer challenge", 30, 840],
  ["mastery", "Mastery", "Independent mastery", 300, 840]
];

export const initialSciLoopNodes: SciLoopNode[] = initialNodes.map(([id, nodeType, label, x, y]) => ({
  id,
  type: "sciloop",
  position: { x, y },
  data: { label, nodeType },
  draggable: true
}));

const initialConnections: Array<[string, string, string, SciLoopConnectionLabel]> = [
  ["start-curiosity", "start", "curiosity", "causes"],
  ["curiosity-prediction", "curiosity", "prediction", "leads to"],
  ["prediction-commit", "prediction", "commit", "leads to"],
  ["commit-simulation", "commit", "simulation", "causes"],
  ["simulation-observe", "simulation", "observe", "leads to"],
  ["observe-pattern", "observe", "pattern", "leads to"],
  ["pattern-hypothesis", "pattern", "hypothesis", "leads to"],
  ["hypothesis-test", "hypothesis", "test", "causes"],
  ["test-feedback", "test", "feedback", "leads to"],
  ["feedback-rule", "feedback", "rule", "leads to"],
  ["rule-explain", "rule", "explain", "leads to"],
  ["explain-challenge", "explain", "challenge", "leads to"],
  ["challenge-mastery", "challenge", "mastery", "leads to"],
  ["challenge-curiosity", "challenge", "curiosity", "repeat"]
];

export const initialSciLoopEdges: SciLoopEdge[] = initialConnections.map(([id, source, target, label]) => ({
  id,
  source,
  target,
  type: "labeled",
  animated: label === "repeat" || label === "if false",
  label,
  data: { label },
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { stroke: "#48e5ff", strokeWidth: 1.7 },
  labelStyle: { fill: "#cbd5e1", fontSize: 10, fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace" },
  labelBgStyle: { fill: "#07111c", fillOpacity: 0.94, color: "#07111c" },
  labelBgPadding: [5, 3],
  labelBgBorderRadius: 3
}));

export const initialSciLoopNotes = "Start with experience, make the learner predict, run a safe simulation, observe the error, discover a pattern, test a hypothesis, compress the rule, and transfer it to a new situation.";
