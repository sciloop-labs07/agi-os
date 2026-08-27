"use client";

import { ClipboardCheck, FileText, Lock, Play, Plus, Save, ShieldCheck } from "lucide-react";
import type { Candidate } from "@/lib/cognitive-lab/types";
import { protocolStepLabels, type ExperimentProtocolState, type ExperimentMetadata, type ProtocolStep, type ResearchNotes } from "@/lib/experiments/types";
import styles from "./cognitive-engine-laboratory.module.css";

type ProtocolPanelProps = {
  protocol: ExperimentProtocolState;
  candidates: Candidate[];
  onMetadata: (changes: Partial<ExperimentMetadata>) => void;
  onCandidates: (candidateIds: string[]) => void;
  onStep: (step: ProtocolStep) => void;
  onStatus: (status: ExperimentMetadata["status"]) => void;
  onNotes: (changes: Partial<ResearchNotes>) => void;
  onFreeze: (candidate: Candidate) => void;
  onRun: (candidate: Candidate) => void;
  onReport: () => void;
  onNextCandidate: () => void;
};

const noteFields: Array<{ key: keyof ResearchNotes; label: string; placeholder: string }> = [
  { key: "objective", label: "Objective", placeholder: "What is this study trying to learn?" },
  { key: "observation", label: "Observation", placeholder: "What did you notice?" },
  { key: "expectedOutcome", label: "Expected outcome", placeholder: "What should happen if the hypothesis is useful?" },
  { key: "actualOutcome", label: "Actual outcome", placeholder: "What happened in the recorded evidence?" },
  { key: "insights", label: "Insights", placeholder: "What pattern is becoming visible?" },
  { key: "futureQuestions", label: "Future questions", placeholder: "What remains unknown?" }
];

export function ProtocolPanel({ protocol, candidates, onMetadata, onCandidates, onStep, onStatus, onNotes, onFreeze, onRun, onReport, onNextCandidate }: ProtocolPanelProps) {
  const selected = candidates.filter((candidate) => protocol.metadata.candidateIds.includes(candidate.id));
  const selectedFrozen = selected.length > 0 && selected.every((candidate) => candidate.freezeState === "frozen");
  const report = protocol.report;
  return <section className={styles.protocolPanel} aria-label="Experimental Protocol">
    <header className={styles.protocolHeader}><div className={styles.regionHeading}><span>EXPERIMENTAL PROTOCOL</span><strong><ClipboardCheck className="size-3.5" /> {protocol.metadata.status}</strong></div><small>Step {protocol.currentStep} of 8</small></header>
    <div className={styles.protocolLifecycle}>{protocolStepLabels.map((item) => <button type="button" key={item.step} className={protocol.currentStep === item.step ? styles.protocolStepActive : protocol.currentStep > item.step ? styles.protocolStepDone : ""} onClick={() => onStep(item.step)} title={item.detail}><b>{item.step}</b><span>{item.label}</span></button>)}</div>
    <div className={styles.protocolBody}>
      <div className={styles.protocolSection}><label>Experiment name<input value={protocol.metadata.name} onChange={(event) => onMetadata({ name: event.target.value })} /></label><label>Research goal<textarea value={protocol.metadata.researchGoal} onChange={(event) => onMetadata({ researchGoal: event.target.value })} /></label><label>Hypothesis<textarea value={protocol.metadata.hypothesis} onChange={(event) => onMetadata({ hypothesis: event.target.value })} placeholder="State one specific expected difference." /></label></div>
      <div className={styles.protocolReference}><span>Shared problem</span><strong>{protocol.metadata.problemTitle}</strong><small>Every selected engine is compared against this same reference.</small></div>
      <div className={styles.protocolSection}><div className={styles.protocolSectionTitle}><b>Candidate engines</b><small>Explicit selection only</small></div><div className={styles.protocolCandidates}>{candidates.map((candidate) => <label key={candidate.id} className={protocol.metadata.candidateIds.includes(candidate.id) ? styles.protocolCandidateSelected : ""}><input type="checkbox" checked={protocol.metadata.candidateIds.includes(candidate.id)} onChange={(event) => onCandidates(event.target.checked ? [...protocol.metadata.candidateIds, candidate.id] : protocol.metadata.candidateIds.filter((id) => id !== candidate.id))} /><span><b>{candidate.name}</b><small>{candidate.graph.metadata.nodeCount} nodes · {candidate.graph.metadata.connectionCount} links · {candidate.freezeState}</small></span></label>)}</div></div>
      <div className={styles.protocolActions}>{protocol.currentStep === 3 && <button type="button" onClick={() => selected.forEach(onFreeze)} disabled={!selected.length || selectedFrozen}><Lock className="size-3.5" /> Freeze selected</button>}{protocol.currentStep === 5 && <><button type="button" onClick={() => onStatus("running")} disabled={!selectedFrozen}><Play className="size-3.5" /> Start protocol run</button>{selected.map((candidate) => <button type="button" key={candidate.id} onClick={() => onRun(candidate)} disabled={!selectedFrozen || candidate.runState === "running"}><Play className="size-3.5" /> Run {candidate.name}</button>)}</>}{protocol.currentStep === 6 && <button type="button" onClick={onReport} disabled={!selected.length}><ShieldCheck className="size-3.5" /> Generate evidence report</button>}{protocol.currentStep === 8 && <button type="button" onClick={onNextCandidate}><Plus className="size-3.5" /> Create next candidate</button>}</div>
      <div className={styles.protocolSection}><div className={styles.protocolSectionTitle}><b>Research notebook</b><small>Structured evidence notes</small></div>{noteFields.map((field) => <label key={field.key}>{field.label}<textarea value={protocol.metadata.researcherNotes[field.key]} onChange={(event) => onNotes({ [field.key]: event.target.value })} placeholder={field.placeholder} /></label>)}</div>
      {report && <div className={styles.protocolReport}><div className={styles.protocolSectionTitle}><b><FileText className="size-3.5" /> Observed evidence</b><small>{new Date(report.generatedAt).toLocaleString()}</small></div><p>{report.overview}</p><div className={styles.protocolEvidenceGrid}>{report.evidence.map((item) => <article key={item.candidateId}><strong>{item.candidateName}</strong><span>{item.graphSize.nodes} nodes · {item.graphSize.connections} links</span><small>{item.metrics.filter((metric) => metric.score !== null).length} structural measurements</small></article>)}</div><label>Conclusion<textarea value={report.conclusions} readOnly /></label><label>Open questions<textarea value={report.openQuestions} readOnly /></label><button type="button" onClick={onNextCandidate}><Save className="size-3.5" /> Continue to next candidate</button></div>}
      <div className={styles.protocolLibrary}><div className={styles.protocolSectionTitle}><b>Experiment library</b><small>{protocol.library.length} recorded {protocol.library.length === 1 ? "study" : "studies"}</small></div>{protocol.library.length ? protocol.library.map((item) => <div key={item.experimentId}><strong>{item.overview}</strong><small>{new Date(item.generatedAt).toLocaleDateString()} · {item.evidence.length} candidates</small></div>) : <p>No completed protocol reports yet. Finish a study to create the first record.</p>}</div>
    </div>
  </section>;
}
