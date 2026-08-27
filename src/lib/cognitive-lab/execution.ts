import type { Candidate, ExecutionTraceStep, ExperimentLogEntry } from "./types";

const timestamp = () => new Date().toISOString();
const id = () => `log-${Math.random().toString(36).slice(2, 10)}`;

export function buildExecutionTrace(candidate: Candidate, speed = 1): ExecutionTraceStep[] {
  return candidate.graph.nodes.map((node, index) => ({ nodeId: node.id, delayMs: Math.max(120, Math.round((index + 1) * 360 / speed)) }));
}

export function createExperimentLog(candidate: Candidate, type: ExperimentLogEntry["type"], nodeLabel?: string): ExperimentLogEntry {
  const messages: Record<ExperimentLogEntry["type"], string> = {
    candidate_created: `${candidate.name} created`,
    candidate_deleted: `${candidate.name} deleted`,
    node_added: `${candidate.name}: ${nodeLabel ?? "node"} added`,
    connection_created: `${candidate.name}: connection created`,
    flow_imported: `${candidate.name}: complete flow imported from SciLoop Designer`,
    candidate_started: `${candidate.name} started`,
    node_executed: `${candidate.name}: ${nodeLabel ?? "node"} executed`,
    candidate_finished: `${candidate.name} finished`,
    candidate_frozen: `${candidate.name} frozen as an experimental snapshot`
  };
  return { id: id(), candidateId: candidate.id, candidateName: candidate.name, type, message: messages[type], timestamp: timestamp() };
}
