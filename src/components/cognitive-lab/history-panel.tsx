import { History, RotateCcw } from "lucide-react";
import type { Candidate } from "@/lib/cognitive-lab/types";
import type { CandidateEvaluationHistory } from "@/lib/evaluation/types";
import type { EvolutionEvent } from "@/lib/evolution/types";
import styles from "./cognitive-engine-laboratory.module.css";

type HistoryPanelProps = { candidate: Candidate; evaluationHistory?: CandidateEvaluationHistory; events: EvolutionEvent[] };

export function HistoryPanel({ candidate, evaluationHistory, events }: HistoryPanelProps) {
  const runs = evaluationHistory?.runs ?? [];
  const candidateEvents = events.filter((event) => event.candidateId === candidate.id || event.parentCandidateId === candidate.id);
  return <section className={styles.historyPanel} aria-label="History Panel"><div className={styles.regionHeading}><span>HISTORY</span><strong><History className="size-3.5" /> Reproducible record</strong></div><p className={styles.regionCopy}>Every run and evolution decision remains available for review.</p><div className={styles.historyGroup}><b>Evaluation runs</b>{runs.length ? runs.slice().reverse().map((run) => <div key={run.id} className={styles.historyRow}><span>Run {run.runNumber}</span><small>{new Date(run.executedAt).toLocaleString()}</small><strong>{run.evaluation.graphSummary.nodes} nodes · {run.evaluation.metrics.filter((metric) => metric.status === "estimated").length} estimates</strong></div>) : <p className={styles.historyEmpty}>This engine has not been evaluated. Run the frozen candidate to create an experiment record.</p>}</div><div className={styles.historyGroup}><b>Evolution events</b>{candidateEvents.length ? candidateEvents.slice().reverse().map((event) => <div key={event.id} className={styles.historyRow}><span>G{event.generation} · {event.status}</span><small>{event.explanation}</small><strong>{event.expectedImprovement}</strong></div>) : <p className={styles.historyEmpty}><RotateCcw className="size-3.5" /> No evolution events for this candidate.</p>}</div></section>;
}
