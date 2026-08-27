"use client";

import { GitBranch, GitCompareArrows, History, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import { buildLineage, compareEngines, lineagePath } from "@/lib/evolution";
import { mutationTypes } from "@/lib/evolution/mutation";
import type { EvolutionEvent, EvolutionEventStatus, MutationType } from "@/lib/evolution/types";
import type { Candidate } from "@/lib/cognitive-lab/types";
import styles from "./cognitive-engine-laboratory.module.css";

type EvolutionPanelProps = { candidates: Candidate[]; activeCandidate: Candidate; events: EvolutionEvent[]; onMutate: (mutationType: MutationType) => void; onRestore: (candidateId: string) => void; onSetStatus: (eventId: string, status: EvolutionEventStatus) => void };

export function EvolutionPanel({ candidates, activeCandidate, events, onMutate, onRestore, onSetStatus }: EvolutionPanelProps) {
  const [selectedMutation, setSelectedMutation] = useState<MutationType>("insert_node");
  const [selectedReplay, setSelectedReplay] = useState(activeCandidate.id);
  const parent = activeCandidate.lineage.parentCandidateId ? candidates.find((candidate) => candidate.id === activeCandidate.lineage.parentCandidateId) : undefined;
  const diff = parent ? compareEngines(parent, activeCandidate) : undefined;
  const lineage = lineagePath(activeCandidate.id, candidates);
  const lineageNodes = buildLineage(candidates);
  const activeBranches = new Set(candidates.map((candidate) => candidate.lineage.branchId)).size;
  const successful = events.filter((event) => event.status === "accepted").length;
  const rejected = events.filter((event) => event.status === "rejected").length;
  return <section className={styles.evolutionPanel} aria-label="Evolution Engine">
    <header className={styles.evolutionHeader}><div className={styles.regionHeading}><span>EVOLUTION ENGINE</span><strong><GitBranch className="size-3.5" /> Versioned research</strong></div><span className={styles.evaluationRuns}>{events.length} mutations</span></header>
    <div className={styles.evolutionStats}><span>Generations <b>{Math.max(...candidates.map((candidate) => candidate.lineage.generation))}</b></span><span>Branches <b>{activeBranches}</b></span><span>Accepted <b>{successful}</b></span><span>Rejected <b>{rejected}</b></span></div>
    <div className={styles.evolutionAction}><label>Mutation<select value={selectedMutation} onChange={(event) => setSelectedMutation(event.target.value as MutationType)}>{mutationTypes.map((mutation) => <option key={mutation.id} value={mutation.id}>{mutation.label}</option>)}</select></label><button type="button" onClick={() => onMutate(selectedMutation)} title="Create mutation"><Play className="size-3.5" /> Evolve</button></div>
    <p className={styles.evolutionHint}>{mutationTypes.find((mutation) => mutation.id === selectedMutation)?.description} Every mutation creates a new candidate and preserves its parent.</p>
    <div className={styles.evolutionSection}><div className={styles.evaluationSectionTitle}><GitBranch className="size-3.5" /> Active lineage</div><div className={styles.lineagePath}>{lineage.map((candidate, index) => <span key={candidate.id}><b>{candidate.name}</b><small>G{candidate.lineage.generation} · {candidate.lineage.branchName}</small>{index < lineage.length - 1 && <i>↓</i>}</span>)}</div></div>
    {diff && <div className={styles.evolutionSection}><div className={styles.evaluationSectionTitle}><GitCompareArrows className="size-3.5" /> Difference viewer</div><div className={styles.diffFacts}><span>Added nodes <b>{diff.addedNodes.length}</b></span><span>Removed nodes <b>{diff.removedNodes.length}</b></span><span>Connections <b>{diff.addedConnections.length + diff.removedConnections.length}</b></span><span>Order changed <b>{diff.changedOrder ? "Yes" : "No"}</b></span></div>{diff.addedNodes.map((node) => <p key={`added-${node.id}`} className={styles.diffAdded}>+ Added {node.label}</p>)}{diff.removedNodes.map((node) => <p key={`removed-${node.id}`} className={styles.diffRemoved}>− Removed {node.label}</p>)}</div>}
    <div className={styles.evolutionSection}><div className={styles.evaluationSectionTitle}><History className="size-3.5" /> Evolution journal</div>{events.length ? events.slice(-5).reverse().map((event) => <div key={event.id} className={styles.journalEntry}><span>G{event.generation} · {event.mutationType.replaceAll("_", " ")} · {event.status}</span><b>{event.explanation}</b><small>{event.expectedImprovement}</small>{event.status === "proposed" && <div className={styles.journalActions}><button type="button" onClick={() => onSetStatus(event.id, "accepted")}>Keep</button><button type="button" onClick={() => onSetStatus(event.id, "rejected")}>Reject</button></div>}</div>) : <p className={styles.reportLine}>No mutations yet. The original candidate is the root of the lineage.</p>}</div>
    <div className={styles.evolutionSection}><div className={styles.evaluationSectionTitle}><RotateCcw className="size-3.5" /> Replay generation</div><div className={styles.evolutionAction}><label>Snapshot<select value={selectedReplay} onChange={(event) => setSelectedReplay(event.target.value)}>{lineage.map((item) => <option key={item.id} value={item.id}>G{item.lineage.generation} · {item.name}</option>)}</select></label><button type="button" onClick={() => onRestore(selectedReplay)} title="Restore snapshot"><RotateCcw className="size-3.5" /> Restore</button></div><p className={styles.reportLine}>Restoring creates a new candidate and never changes the selected generation or its descendants.</p><small className={styles.lineageCount}>{lineageNodes.length} lineage snapshots available</small></div>
  </section>;
}
