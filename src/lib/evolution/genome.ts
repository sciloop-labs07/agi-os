import type { Candidate, CandidateGraph } from "@/lib/cognitive-lab/types";
import type { EngineGenome } from "./types";

export function createEngineGenome(candidate: Candidate): EngineGenome {
  return { version: 1, graph: structuredClone(candidate.graph), orderedNodeIds: candidate.graph.nodes.map((node) => node.id), structuralSignature: candidate.graph.nodes.map((node) => node.metadata.nodeType).join(" → ") };
}

export function cloneGenome(genome: EngineGenome): EngineGenome { return { ...genome, graph: structuredClone(genome.graph), orderedNodeIds: [...genome.orderedNodeIds] }; }
export function genomeFromGraph(graph: CandidateGraph): EngineGenome { return createEngineGenome({ graph } as Candidate); }
