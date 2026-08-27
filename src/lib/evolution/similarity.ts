import type { Candidate } from "@/lib/cognitive-lab/types";
import type { SimilarityResult } from "./types";

export function structuralSimilarity(left: Candidate, right: Candidate): SimilarityResult {
  const leftTypes = new Set(left.graph.nodes.map((node) => node.metadata.nodeType));
  const rightTypes = new Set(right.graph.nodes.map((node) => node.metadata.nodeType));
  const sharedNodeTypes = [...leftTypes].filter((type) => rightTypes.has(type));
  const maxConnections = Math.max(left.graph.connections.length, right.graph.connections.length, 1);
  const nodeScore = sharedNodeTypes.length / Math.max(leftTypes.size, rightTypes.size, 1);
  const connectionScore = 1 - Math.abs(left.graph.connections.length - right.graph.connections.length) / maxConnections;
  const orderScore = left.graph.nodes.map((node) => node.metadata.nodeType).join("|") === right.graph.nodes.map((node) => node.metadata.nodeType).join("|") ? 1 : 0.5;
  return { score: Math.round((nodeScore * 55 + connectionScore * 25 + orderScore * 20)), sharedNodeTypes, sharedConnections: Math.min(left.graph.connections.length, right.graph.connections.length), explanation: `${sharedNodeTypes.length} node types and ${Math.min(left.graph.connections.length, right.graph.connections.length)} connection positions overlap structurally.` };
}
