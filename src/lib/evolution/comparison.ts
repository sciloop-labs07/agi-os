import type { Candidate } from "@/lib/cognitive-lab/types";
import type { StructuralDiff } from "./types";

export function compareEngines(before: Candidate, after: Candidate): StructuralDiff {
  const beforeNodes = new Map(before.graph.nodes.map((node) => [node.id, node]));
  const afterNodes = new Map(after.graph.nodes.map((node) => [node.id, node]));
  const addedNodes = after.graph.nodes.filter((node) => !beforeNodes.has(node.id));
  const removedNodes = before.graph.nodes.filter((node) => !afterNodes.has(node.id));
  const beforeConnections = new Map(before.graph.connections.map((connection) => [`${connection.sourceId}:${connection.targetId}:${connection.label}`, connection]));
  const afterConnections = new Map(after.graph.connections.map((connection) => [`${connection.sourceId}:${connection.targetId}:${connection.label}`, connection]));
  const addedConnections = after.graph.connections.filter((connection) => !beforeConnections.has(`${connection.sourceId}:${connection.targetId}:${connection.label}`));
  const removedConnections = before.graph.connections.filter((connection) => !afterConnections.has(`${connection.sourceId}:${connection.targetId}:${connection.label}`));
  const modifiedConnections = before.graph.connections.flatMap((connection) => { const replacement = after.graph.connections.find((item) => item.id === connection.id); return replacement && JSON.stringify(connection) !== JSON.stringify(replacement) ? [{ before: connection, after: replacement }] : []; });
  const changedCategories = after.graph.nodes.flatMap((node) => { const previous = beforeNodes.get(node.id); return previous && previous.metadata.category !== node.metadata.category ? [{ nodeId: node.id, before: previous.metadata.category, after: node.metadata.category }] : []; });
  return { addedNodes, removedNodes, modifiedConnections, addedConnections, removedConnections, changedOrder: before.graph.nodes.map((node) => node.metadata.nodeType).join("|") !== after.graph.nodes.map((node) => node.metadata.nodeType).join("|"), changedCategories, executionDifferences: [] };
}
