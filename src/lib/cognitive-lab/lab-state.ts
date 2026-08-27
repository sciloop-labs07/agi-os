import { nodeRegistry, type ReasoningNodeType } from "@/lib/engine/node-registry";
import { validateTransition } from "@/lib/engine/semantic-validation";
import { cloneCandidate, createCandidate, createCognitiveNode, createExperiment } from "./factories";
import { createExperimentLog } from "./execution";
import { evaluateCandidate } from "@/lib/evaluation";
import { applyMutation } from "@/lib/evolution/mutation";
import type { EvolutionEventStatus, MutationParameters, MutationType } from "@/lib/evolution/types";
import type { Candidate, CandidateGraph, CognitiveLabState, ExperimentLogEntry, HistorySnapshot, ImportedFlowConnection, ImportedFlowNode, LabUiState } from "./types";
import { createProtocolState } from "@/lib/experiments/types";
import type { ExperimentMetadata, ProtocolReport, ProtocolStep, ResearchNotes } from "@/lib/experiments/types";

type LabAction =
  | { type: "hydrate"; state: CognitiveLabState }
  | { type: "update_protocol_metadata"; changes: Partial<ExperimentMetadata> }
  | { type: "set_protocol_candidates"; candidateIds: string[] }
  | { type: "set_protocol_step"; step: ProtocolStep }
  | { type: "set_protocol_status"; status: ExperimentMetadata["status"] }
  | { type: "update_protocol_notes"; changes: Partial<ResearchNotes> }
  | { type: "save_protocol_report"; report: ProtocolReport }
  | { type: "select_candidate"; candidateId: string }
  | { type: "select_node"; nodeId?: string }
  | { type: "create_candidate" }
  | { type: "duplicate_candidate"; candidateId: string }
  | { type: "evolve_candidate"; candidateId: string; mutationType: MutationType; parameters: MutationParameters; branchName?: string }
  | { type: "restore_candidate"; sourceCandidateId: string; targetCandidateId: string }
  | { type: "select_evolution_event"; eventId?: string }
  | { type: "set_evolution_status"; eventId: string; status: EvolutionEventStatus }
  | { type: "set_ui"; changes: Partial<LabUiState> }
  | { type: "delete_candidate"; candidateId: string }
  | { type: "update_candidate"; candidateId: string; changes: Pick<Candidate, "name" | "description" | "color"> }
  | { type: "add_node"; candidateId: string; nodeType: ReasoningNodeType }
  | { type: "import_flow"; candidateId: string; nodes: ImportedFlowNode[]; connections: ImportedFlowConnection[] }
  | { type: "update_node"; candidateId: string; nodeId: string; label: string }
  | { type: "delete_node"; candidateId: string; nodeId: string }
  | { type: "connect_last_nodes"; candidateId: string }
  | { type: "undo"; candidateId: string }
  | { type: "redo"; candidateId: string }
  | { type: "toggle_freeze"; candidateId: string }
  | { type: "start_run"; candidateId: string }
  | { type: "complete_node"; candidateId: string; nodeId: string }
  | { type: "finish_run"; candidateId: string }
  | { type: "append_log"; entry: ExperimentLogEntry };

const updateCandidate = (state: CognitiveLabState, candidateId: string, update: (candidate: Candidate) => Candidate): CognitiveLabState => ({ ...state, experiment: { ...state.experiment, updatedAt: new Date().toISOString(), candidates: state.experiment.candidates.map((candidate) => candidate.id === candidateId ? update(candidate) : candidate) } });
const cloneGraph = (graph: CandidateGraph): CandidateGraph => structuredClone(graph);
const snapshot = (graph: CandidateGraph): HistorySnapshot => ({ graph: cloneGraph(graph), timestamp: new Date().toISOString() });
const remember = (state: CognitiveLabState, candidateId: string, graph: CandidateGraph): CognitiveLabState => ({ ...state, history: { ...state.history, [candidateId]: { past: [...(state.history[candidateId]?.past ?? []), snapshot(graph)].slice(-50), future: [] } } });
const log = (state: CognitiveLabState, candidate: Candidate, type: ExperimentLogEntry["type"], label?: string): CognitiveLabState => ({ ...state, console: [createExperimentLog(candidate, type, label), ...state.console].slice(0, 150) });

export function createInitialCognitiveLabState(): CognitiveLabState {
  const experiment = createExperiment();
  return { experiment, activeCandidateId: experiment.candidates[0].id, console: [], execution: {}, history: {}, evaluationHistory: {}, evolution: { events: [] }, protocol: createProtocolState(experiment.problem), ui: { activePanel: "properties", rightPanelCollapsed: false, viewport: { x: 0, y: 0, zoom: 1 } } };
}

export function cognitiveLabReducer(state: CognitiveLabState, action: LabAction): CognitiveLabState {
  switch (action.type) {
    case "hydrate": return action.state;
    case "update_protocol_metadata": return { ...state, protocol: { ...state.protocol, metadata: { ...state.protocol.metadata, ...action.changes, updatedAt: new Date().toISOString() } } };
    case "set_protocol_candidates": return { ...state, protocol: { ...state.protocol, metadata: { ...state.protocol.metadata, candidateIds: action.candidateIds, status: action.candidateIds.length >= 2 ? "configured" : "draft", updatedAt: new Date().toISOString() }, currentStep: action.candidateIds.length >= 1 ? Math.max(state.protocol.currentStep, 2) as ProtocolStep : state.protocol.currentStep } };
    case "set_protocol_step": return { ...state, protocol: { ...state.protocol, currentStep: action.step, metadata: { ...state.protocol.metadata, status: action.step >= 4 ? "configured" : state.protocol.metadata.status, updatedAt: new Date().toISOString() } } };
    case "set_protocol_status": return { ...state, protocol: { ...state.protocol, metadata: { ...state.protocol.metadata, status: action.status, startedAt: action.status === "running" ? new Date().toISOString() : state.protocol.metadata.startedAt, updatedAt: new Date().toISOString() } } };
    case "update_protocol_notes": return { ...state, protocol: { ...state.protocol, metadata: { ...state.protocol.metadata, researcherNotes: { ...state.protocol.metadata.researcherNotes, ...action.changes }, updatedAt: new Date().toISOString() } } };
    case "save_protocol_report": return { ...state, protocol: { ...state.protocol, report: action.report, library: [action.report, ...state.protocol.library.filter((report) => report.experimentId !== action.report.experimentId)].slice(0, 50), currentStep: 6, metadata: { ...state.protocol.metadata, status: "completed", completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } } };
    case "select_candidate": return { ...state, activeCandidateId: action.candidateId, selectedNodeId: undefined };
    case "select_node": return { ...state, selectedNodeId: action.nodeId };
    case "create_candidate": {
      const candidate = createCandidate(state.experiment.id, state.experiment.candidates.length);
      const next = { ...state, experiment: { ...state.experiment, updatedAt: new Date().toISOString(), candidates: [...state.experiment.candidates, candidate] }, activeCandidateId: candidate.id };
      return log({ ...next, evaluationHistory: { ...state.evaluationHistory, [candidate.id]: { runs: [] } } }, candidate, "candidate_created");
    }
    case "duplicate_candidate": {
      const source = state.experiment.candidates.find((candidate) => candidate.id === action.candidateId);
      if (!source) return state;
      const candidate = cloneCandidate(source, state.experiment.candidates.length);
      const next = { ...state, experiment: { ...state.experiment, updatedAt: new Date().toISOString(), candidates: [...state.experiment.candidates, candidate] }, activeCandidateId: candidate.id };
      return log({ ...next, evaluationHistory: { ...state.evaluationHistory, [candidate.id]: { runs: [] } } }, candidate, "candidate_created");
    }
    case "evolve_candidate": {
      const parent = state.experiment.candidates.find((candidate) => candidate.id === action.candidateId);
      if (!parent) return state;
      const child = cloneCandidate(parent, state.experiment.candidates.length, { branchName: action.branchName ?? parent.lineage.branchName, branchId: action.branchName ? `branch-${action.branchName.toLowerCase().replaceAll(" ", "-")}` : parent.lineage.branchId });
      const mutation = applyMutation(child.graph, action.mutationType, action.parameters);
      child.name = `${parent.name} · ${action.mutationType.replaceAll("_", " ")}`;
      child.graph = mutation.graph;
      const event = { id: `evolution-${Math.random().toString(36).slice(2, 10)}`, candidateId: child.id, parentCandidateId: parent.id, generation: child.lineage.generation, mutationType: action.mutationType, parameters: action.parameters, changes: mutation.changes, explanation: mutation.explanation, expectedImprovement: mutation.expectedImprovement, status: "proposed" as const, createdAt: new Date().toISOString() };
      const next = { ...state, experiment: { ...state.experiment, updatedAt: new Date().toISOString(), candidates: [...state.experiment.candidates, child] }, activeCandidateId: child.id, selectedNodeId: undefined, evaluationHistory: { ...state.evaluationHistory, [child.id]: { runs: [] } }, evolution: { events: [...state.evolution.events, event], selectedEventId: event.id } };
      return log(next, child, "candidate_created");
    }
    case "select_evolution_event": return { ...state, evolution: { ...state.evolution, selectedEventId: action.eventId } };
    case "set_evolution_status": return { ...state, evolution: { ...state.evolution, events: state.evolution.events.map((event) => event.id === action.eventId ? { ...event, status: action.status } : event) } };
    case "set_ui": return { ...state, ui: { ...state.ui, ...action.changes, viewport: { ...state.ui.viewport, ...(action.changes.viewport ?? {}) } } };
    case "restore_candidate": {
      const source = state.experiment.candidates.find((candidate) => candidate.id === action.sourceCandidateId);
      const target = state.experiment.candidates.find((candidate) => candidate.id === action.targetCandidateId);
      if (!source || !target) return state;
      const child = cloneCandidate(source, state.experiment.candidates.length, { parentCandidateId: target.id, generation: target.lineage.generation + 1, branchName: `${source.lineage.branchName} replay`, branchId: `branch-replay-${source.id}` });
      child.name = `${source.name} replay`;
      const event = { id: `evolution-${Math.random().toString(36).slice(2, 10)}`, candidateId: child.id, parentCandidateId: target.id, generation: child.lineage.generation, mutationType: "restore_generation" as const, parameters: { seed: Date.now() }, changes: [], explanation: `Restored ${source.name} as a new immutable candidate snapshot.`, expectedImprovement: "Revisit an earlier research direction without altering lineage.", status: "proposed" as const, createdAt: new Date().toISOString() };
      return { ...state, experiment: { ...state.experiment, updatedAt: new Date().toISOString(), candidates: [...state.experiment.candidates, child] }, activeCandidateId: child.id, selectedNodeId: undefined, evaluationHistory: { ...state.evaluationHistory, [child.id]: { runs: [] } }, evolution: { events: [...state.evolution.events, event], selectedEventId: event.id } };
    }
    case "delete_candidate": {
      if (state.experiment.candidates.length <= 1) return state;
      const candidate = state.experiment.candidates.find((item) => item.id === action.candidateId);
      if (!candidate) return state;
      const candidates = state.experiment.candidates.filter((item) => item.id !== action.candidateId);
      const activeCandidateId = state.activeCandidateId === action.candidateId ? candidates[0].id : state.activeCandidateId;
      const next = { ...state, experiment: { ...state.experiment, updatedAt: new Date().toISOString(), candidates }, activeCandidateId, selectedNodeId: undefined };
      const history = { ...next.history }; delete history[action.candidateId];
      const evaluationHistory = { ...next.evaluationHistory }; delete evaluationHistory[action.candidateId];
      return log({ ...next, history, evaluationHistory }, candidate, "candidate_deleted");
    }
    case "update_candidate": return updateCandidate(state, action.candidateId, (candidate) => ({ ...candidate, ...action.changes }));
    case "add_node": {
      const candidate = state.experiment.candidates.find((item) => item.id === action.candidateId);
      if (!candidate || candidate.freezeState === "frozen") return state;
      const nextState = remember(state, action.candidateId, candidate.graph);
      const next = updateCandidate(nextState, action.candidateId, () => {
      if (candidate.freezeState === "frozen") return candidate;
      const node = createCognitiveNode(action.nodeType, candidate.graph.nodes.length);
      const nodes = [...candidate.graph.nodes, node];
      return { ...candidate, graph: { ...candidate.graph, nodes, metadata: { ...candidate.graph.metadata, updatedAt: node.updatedAt, nodeCount: nodes.length } } };
      });
      const added = next.experiment.candidates.find((item) => item.id === action.candidateId);
      return added ? { ...log(next, added, "node_added", added.graph.nodes.at(-1)?.label), selectedNodeId: added.graph.nodes.at(-1)?.id } : next;
    }
    case "import_flow": {
      const candidate = state.experiment.candidates.find((item) => item.id === action.candidateId);
      if (!candidate || candidate.freezeState === "frozen" || !action.nodes.length) return state;
      const nextState = remember(state, action.candidateId, candidate.graph);
      const createdAt = new Date().toISOString();
      const nodes = action.nodes.map((node) => {
        const definition = nodeRegistry[node.nodeType];
        return { id: `node-${Math.random().toString(36).slice(2, 10)}`, label: node.label || definition.displayName, metadata: { nodeType: node.nodeType, category: definition.category, kind: definition.kind, description: definition.description, inputs: definition.inputs.length, outputs: definition.outputs.length }, position: { ...node.position }, createdAt, updatedAt: createdAt, executionState: "waiting" as const };
      });
      const idMap = new Map(action.nodes.map((node, index) => [node.id, nodes[index].id]));
      const connections = action.connections.filter((connection) => idMap.has(connection.sourceId) && idMap.has(connection.targetId)).map((connection) => ({ id: `connection-${Math.random().toString(36).slice(2, 10)}`, sourceId: idMap.get(connection.sourceId)!, targetId: idMap.get(connection.targetId)!, label: connection.label, createdAt }));
      const graph = { ...candidate.graph, nodes, connections, metadata: { ...candidate.graph.metadata, updatedAt: createdAt, nodeCount: nodes.length, connectionCount: connections.length } };
      const next = updateCandidate(nextState, action.candidateId, (current) => ({ ...current, graph }));
      const imported = next.experiment.candidates.find((item) => item.id === action.candidateId);
      return imported ? { ...log(next, imported, "flow_imported"), selectedNodeId: nodes[0]?.id } : next;
    }
    case "update_node": {
      const candidate = state.experiment.candidates.find((item) => item.id === action.candidateId);
      if (!candidate || candidate.freezeState === "frozen") return state;
      const node = candidate.graph.nodes.find((item) => item.id === action.nodeId);
      if (!node) return state;
      const nextState = remember(state, action.candidateId, candidate.graph);
      return updateCandidate(nextState, action.candidateId, (current) => ({ ...current, graph: { ...current.graph, nodes: current.graph.nodes.map((item) => item.id === action.nodeId ? { ...item, label: action.label, updatedAt: new Date().toISOString() } : item) } }));
    }
    case "delete_node": {
      const candidate = state.experiment.candidates.find((item) => item.id === action.candidateId);
      if (!candidate || candidate.freezeState === "frozen" || !candidate.graph.nodes.some((node) => node.id === action.nodeId)) return state;
      const nextState = remember(state, action.candidateId, candidate.graph);
      const next = updateCandidate(nextState, action.candidateId, (current) => {
        const nodes = current.graph.nodes.filter((node) => node.id !== action.nodeId);
        const connections = current.graph.connections.filter((connection) => connection.sourceId !== action.nodeId && connection.targetId !== action.nodeId);
        return { ...current, graph: { ...current.graph, nodes, connections, metadata: { ...current.graph.metadata, updatedAt: new Date().toISOString(), nodeCount: nodes.length, connectionCount: connections.length } } };
      });
      return { ...next, selectedNodeId: undefined };
    }
    case "connect_last_nodes": {
      const candidate = state.experiment.candidates.find((item) => item.id === action.candidateId);
      if (!candidate || candidate.freezeState === "frozen" || candidate.graph.nodes.length < 2) return state;
      const source = candidate.graph.nodes.at(-2);
      const target = candidate.graph.nodes.at(-1);
      if (!source || !target || candidate.graph.connections.some((connection) => connection.sourceId === source.id && connection.targetId === target.id)) return state;
      const nextState = remember(state, action.candidateId, candidate.graph);
      const next = updateCandidate(nextState, action.candidateId, () => {
      if (candidate.freezeState === "frozen" || candidate.graph.nodes.length < 2) return candidate;
      const source = candidate.graph.nodes.at(-2);
      const target = candidate.graph.nodes.at(-1);
      if (!source || !target || candidate.graph.connections.some((connection) => connection.sourceId === source.id && connection.targetId === target.id)) return candidate;
      const createdAt = new Date().toISOString();
      const validation = validateTransition(source.metadata.nodeType, target.metadata.nodeType);
      const connections = [...candidate.graph.connections, { id: `connection-${Math.random().toString(36).slice(2, 9)}`, sourceId: source.id, targetId: target.id, label: "leads to", createdAt, validation }];
      return { ...candidate, graph: { ...candidate.graph, connections, metadata: { ...candidate.graph.metadata, updatedAt: createdAt, connectionCount: connections.length } } };
      });
      const updated = next.experiment.candidates.find((item) => item.id === action.candidateId);
      return updated ? log(next, updated, "connection_created") : next;
    }
    case "undo": {
      const history = state.history[action.candidateId];
      const candidate = state.experiment.candidates.find((item) => item.id === action.candidateId);
      if (!candidate || !history?.past.length || candidate.freezeState === "frozen") return state;
      const previous = history.past.at(-1);
      if (!previous) return state;
      const past = history.past.slice(0, -1);
      const next = updateCandidate(state, action.candidateId, (current) => ({ ...current, graph: cloneGraph(previous.graph) }));
      return { ...next, history: { ...state.history, [action.candidateId]: { past, future: [snapshot(candidate.graph), ...history.future].slice(0, 50) } } };
    }
    case "redo": {
      const history = state.history[action.candidateId];
      const candidate = state.experiment.candidates.find((item) => item.id === action.candidateId);
      if (!candidate || !history?.future.length || candidate.freezeState === "frozen") return state;
      const nextSnapshot = history.future[0];
      const next = updateCandidate(state, action.candidateId, (current) => ({ ...current, graph: cloneGraph(nextSnapshot.graph) }));
      return { ...next, history: { ...state.history, [action.candidateId]: { past: [...history.past, snapshot(candidate.graph)].slice(-50), future: history.future.slice(1) } } };
    }
    case "toggle_freeze": return updateCandidate(state, action.candidateId, (candidate) => {
      const frozen = candidate.freezeState === "editable";
      return { ...candidate, freezeState: frozen ? "frozen" : "editable", status: frozen ? "frozen" : "draft", frozenAt: frozen ? new Date().toISOString() : undefined };
    });
    case "start_run": return { ...updateCandidate(state, action.candidateId, (candidate) => ({ ...candidate, status: candidate.freezeState === "frozen" ? "frozen" : "running", runState: "running" })), execution: { ...state.execution, [action.candidateId]: Object.fromEntries((state.experiment.candidates.find((candidate) => candidate.id === action.candidateId)?.graph.nodes ?? []).map((node) => [node.id, "waiting"])) } };
    case "complete_node": return { ...state, execution: { ...state.execution, [action.candidateId]: { ...state.execution[action.candidateId], [action.nodeId]: "completed" } } };
    case "finish_run": {
      const next = updateCandidate(state, action.candidateId, (candidate) => ({ ...candidate, status: candidate.freezeState === "frozen" ? "frozen" : "completed", runState: "completed" }));
      const candidate = next.experiment.candidates.find((item) => item.id === action.candidateId);
      if (!candidate) return next;
      const evaluation = evaluateCandidate(candidate, next.experiment.candidates);
      const previousRuns = next.evaluationHistory[action.candidateId]?.runs ?? [];
      const run = { id: `evaluation-${Math.random().toString(36).slice(2, 10)}`, runNumber: previousRuns.length + 1, executedAt: evaluation.evaluatedAt, evaluation };
      return { ...next, evaluationHistory: { ...next.evaluationHistory, [action.candidateId]: { runs: [...previousRuns, run].slice(-50) } } };
    }
    case "append_log": return { ...state, console: [action.entry, ...state.console].slice(0, 150) };
  }
}

export type { LabAction };
