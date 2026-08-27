"use client";

import { BarChart3, CircleHelp, FileText, FlaskConical } from "lucide-react";
import { compareCandidates, createEvaluationReport } from "@/lib/evaluation";
import type { Candidate } from "@/lib/cognitive-lab/types";
import type { CandidateEvaluation, CandidateEvaluationHistory } from "@/lib/evaluation/types";
import styles from "./cognitive-engine-laboratory.module.css";

type EvaluationPanelProps = { problemTitle: string; candidates: Candidate[]; evaluation: CandidateEvaluation; evaluations: CandidateEvaluation[]; history?: CandidateEvaluationHistory };

export function EvaluationPanel({ problemTitle, candidates, evaluation, evaluations, history }: EvaluationPanelProps) {
  const report = createEvaluationReport(evaluation);
  const comparison = compareCandidates(candidates, evaluations, problemTitle);
  return <section className={styles.evaluationPanel} aria-label="Evaluation Panel">
    <header className={styles.evaluationHeader}><div className={styles.regionHeading}><span>EVALUATION PANEL</span><strong><BarChart3 className="size-3.5" /> Evidence, not verdicts</strong></div><span className={styles.evaluationRuns}>{history?.runs.length ?? 0} runs</span></header>
    <div className={styles.evaluationNotice}><FlaskConical className="size-3.5" /><span>Structural estimates are not empirical user evidence.</span></div>
    <div className={styles.metricList}>{evaluation.metrics.map((metric) => <details key={metric.id} className={styles.metricCard}><summary><span><b>{metric.label}</b><small className={metric.metricType === "structural" ? styles.structuralBadge : styles.empiricalBadge}>{metric.metricType}</small></span><strong className={metric.direction === "lower" ? styles.lowerScore : ""}>{metric.score === null ? "—" : metric.score}</strong></summary><div className={styles.metricExplanation}><p>{metric.explanation}</p>{metric.evidence.map((item, index) => <span key={`${metric.id}-${index}`} className={item.kind === "support" ? styles.evidenceSupport : item.kind === "missing" ? styles.evidenceMissing : styles.evidenceLimit}>{item.kind === "support" ? "✓" : item.kind === "missing" ? "!" : "•"} {item.text}</span>)}</div></details>)}</div>
    <div className={styles.evaluationSection}><div className={styles.evaluationSectionTitle}><CircleHelp className="size-3.5" /> Current evidence summary</div><div className={styles.evaluationFacts}><span>Nodes <b>{report.graphSummary.nodes}</b></span><span>Links <b>{report.graphSummary.connections}</b></span><span>Depth <b>{report.graphSummary.depth}</b></span><span>Density <b>{report.graphSummary.density}</b></span></div>{report.missingStages.slice(0, 3).map((item) => <p key={item} className={styles.evaluationMissing}>{item}</p>)}</div>
    {candidates.length > 1 && <div className={styles.evaluationSection}><div className={styles.evaluationSectionTitle}><BarChart3 className="size-3.5" /> Candidate comparison</div><div className={styles.comparisonList}>{comparison.metrics.slice(0, 6).map((metric) => <div key={metric.metricId}><span>{evaluation.metrics.find((item) => item.id === metric.metricId)?.label ?? metric.metricId}</span><span>{metric.values.map((value) => <i key={value.candidateId} className={value.standing === "best" ? styles.comparisonBest : value.standing === "worst" ? styles.comparisonWorst : ""}>{value.candidateName}: {value.score ?? "—"}</i>)}</span></div>)}</div></div>}
    <div className={styles.evaluationSection}><div className={styles.evaluationSectionTitle}><FileText className="size-3.5" /> Report structure</div><p className={styles.reportLine}>{report.strengths.length} strengths · {report.weaknesses.length} weaknesses · {report.improvementSuggestions.length} review suggestions</p></div>
  </section>;
}
