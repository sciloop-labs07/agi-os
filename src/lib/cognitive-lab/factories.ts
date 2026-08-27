import { nodeRegistry, type ReasoningNodeType } from "@/lib/engine/node-registry";
import type { Candidate, CandidateGraph, CognitiveNode, Experiment, Problem } from "./types";

const candidateColors = ["#48e5ff", "#b6ff61", "#f4d35e", "#bc92ff", "#ff7e5c", "#76c4ff"];
const now = () => new Date().toISOString();
const token = () => Math.random().toString(36).slice(2, 9);

export function createProblem(title = "Gravity"): Problem {
  return { id: `problem-${token()}`, title, description: "The single root object for this experiment.", createdAt: now() };
}

export function createCandidateGraph(): CandidateGraph {
  const createdAt = now();
  return { id: `graph-${token()}`, nodes: [], connections: [], metadata: { createdAt, updatedAt: createdAt, nodeCount: 0, connectionCount: 0 } };
}

export function createCandidate(experimentId: string, index: number): Candidate {
  const createdAt = now();
  const id = `candidate-${token()}`;
  return { id, experimentId, name: `Candidate ${String.fromCharCode(65 + index)}`, description: "Independent reasoning-engine hypothesis.", color: candidateColors[index % candidateColors.length], status: "draft", createdAt, freezeState: "editable", runState: "idle", graph: createCandidateGraph(), lineage: { generation: 1, rootCandidateId: id, branchId: `branch-${id}`, branchName: "Original" } };
}

export function createExperiment(problem = createProblem()): Experiment {
  const createdAt = now();
  const experimentId = `experiment-${token()}`;
  return { id: experimentId, problem, candidates: [createCandidate(experimentId, 0)], createdAt, updatedAt: createdAt };
}

export function createCognitiveNode(nodeType: ReasoningNodeType, index: number): CognitiveNode {
  const definition = nodeRegistry[nodeType];
  const createdAt = now();
  return {
    id: `node-${token()}`,
    label: definition.displayName,
    metadata: { nodeType, category: definition.category, kind: definition.kind, description: definition.description, inputs: definition.inputs.length, outputs: definition.outputs.length },
    position: { x: 56 + (index % 4) * 190, y: 92 + Math.floor(index / 4) * 132 },
    createdAt,
    updatedAt: createdAt,
    executionState: "waiting"
  };
}

export function cloneCandidate(candidate: Candidate, index: number, lineage?: Partial<Candidate["lineage"]>): Candidate {
  const cloned = createCandidate(candidate.experimentId, index);
  const nodes = candidate.graph.nodes.map((node) => ({ ...node, id: `node-${token()}`, position: { ...node.position }, metadata: { ...node.metadata }, executionState: "waiting" as const }));
  const idMap = new Map(candidate.graph.nodes.map((node, nodeIndex) => [node.id, nodes[nodeIndex].id]));
  return { ...cloned, name: `${candidate.name} copy`, description: candidate.description, lineage: { ...candidate.lineage, generation: candidate.lineage.generation + 1, parentCandidateId: candidate.id, ...lineage }, graph: { ...cloned.graph, nodes, connections: candidate.graph.connections.map((connection) => ({ ...connection, id: `connection-${token()}`, sourceId: idMap.get(connection.sourceId) ?? connection.sourceId, targetId: idMap.get(connection.targetId) ?? connection.targetId })), metadata: { ...cloned.graph.metadata, nodeCount: nodes.length, connectionCount: candidate.graph.connections.length } } };
}
