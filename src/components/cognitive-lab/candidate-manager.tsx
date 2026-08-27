"use client";

import { Copy, Lock, Play, Plus, Snowflake, Trash2 } from "lucide-react";
import type { Candidate } from "@/lib/cognitive-lab/types";
import styles from "./cognitive-engine-laboratory.module.css";

type CandidateManagerProps = {
  candidates: Candidate[];
  activeCandidateId: string;
  onSelect: (candidateId: string) => void;
  onCreate: () => void;
  onDuplicate: (candidateId: string) => void;
  onDelete: (candidateId: string) => void;
  onUpdate: (candidate: Candidate) => void;
  onToggleFreeze: (candidate: Candidate) => void;
  onRun: (candidate: Candidate) => void;
};

export function CandidateManager({ candidates, activeCandidateId, onSelect, onCreate, onDuplicate, onDelete, onUpdate, onToggleFreeze, onRun }: CandidateManagerProps) {
  return <aside className={styles.candidateManager} aria-label="Candidate Manager">
    <div className={styles.managerHeader}><div className={styles.regionHeading}><span>CANDIDATE MANAGER</span><strong>Independent hypotheses</strong></div><button type="button" className={styles.addCandidateButton} onClick={onCreate} title="Create candidate"><Plus className="size-4" /></button></div>
    <p className={styles.regionCopy}>Each candidate owns an independent graph, execution trace, metadata, and history.</p>
    <div className={styles.candidateList}>{candidates.map((candidate) => <article key={candidate.id} className={`${styles.candidateCard} ${candidate.id === activeCandidateId ? styles.candidateActive : ""}`} style={{ "--candidate-color": candidate.color } as React.CSSProperties}>
      <button type="button" className={styles.candidateSelect} onClick={() => onSelect(candidate.id)}><i /><span><b>{candidate.name}</b><small>{candidate.status}</small></span><strong>{candidate.graph.metadata.nodeCount}</strong></button>
      {candidate.id === activeCandidateId && <div className={styles.candidateDetails}>
        <label>Name<input value={candidate.name} disabled={candidate.freezeState === "frozen"} onChange={(event) => onUpdate({ ...candidate, name: event.target.value })} /></label>
        <label>Description<textarea value={candidate.description} disabled={candidate.freezeState === "frozen"} onChange={(event) => onUpdate({ ...candidate, description: event.target.value })} /></label>
        <label>Color<input type="color" value={candidate.color} disabled={candidate.freezeState === "frozen"} onChange={(event) => onUpdate({ ...candidate, color: event.target.value })} /></label>
        <div className={styles.candidateFacts}><span>Generation <b>{candidate.lineage.generation}</b></span><span>Branch <b>{candidate.lineage.branchName}</b></span><span>Nodes <b>{candidate.graph.metadata.nodeCount}</b></span><span>Links <b>{candidate.graph.metadata.connectionCount}</b></span><span>Run <b>{candidate.runState}</b></span><span>Freeze <b>{candidate.freezeState}</b></span></div>
        <div className={styles.candidateActions}><button type="button" title={candidate.freezeState === "frozen" ? "Make this snapshot editable again" : "Freeze this candidate as an experimental snapshot"} onClick={() => onToggleFreeze(candidate)}><Snowflake className="size-3.5" /> {candidate.freezeState === "frozen" ? "Unfreeze" : "Freeze"}</button><button type="button" title="Run this candidate's nodes in sequence" onClick={() => onRun(candidate)} disabled={candidate.runState === "running" || !candidate.graph.nodes.length}><Play className="size-3.5" /> Run</button><button type="button" onClick={() => onDuplicate(candidate.id)} title="Duplicate this candidate into a new version"><Copy className="size-3.5" /></button><button type="button" onClick={() => onDelete(candidate.id)} disabled={candidates.length <= 1} title="Delete this candidate"><Trash2 className="size-3.5" /></button></div>
        {candidate.freezeState === "frozen" && <p className={styles.freezeNote}><Lock className="size-3.5" /> Frozen candidates are experimental snapshots.</p>}
      </div>}
    </article>)}</div>
  </aside>;
}
