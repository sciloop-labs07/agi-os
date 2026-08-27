import type { Candidate } from "@/lib/cognitive-lab/types";
import type { LineageNode } from "./types";

export function buildLineage(candidates: Candidate[]): LineageNode[] {
  return candidates.map((candidate) => ({ candidateId: candidate.id, candidateName: candidate.name, generation: candidate.lineage.generation, parentCandidateId: candidate.lineage.parentCandidateId, branchName: candidate.lineage.branchName, children: candidates.filter((child) => child.lineage.parentCandidateId === candidate.id).map((child) => child.id) }));
}

export function lineagePath(candidateId: string, candidates: Candidate[]): Candidate[] {
  const path: Candidate[] = [];
  let current = candidates.find((candidate) => candidate.id === candidateId);
  while (current) { path.unshift(current); current = current.lineage.parentCandidateId ? candidates.find((candidate) => candidate.id === current?.lineage.parentCandidateId) : undefined; }
  return path;
}
