"use client";

import { BarChart3, CheckCircle2, GitBranch, X } from "lucide-react";
import { benchmarkFlowVariants, type FlowBenchmarkResult } from "@/lib/flow-benchmark";
import styles from "./sciloop-flow-designer.module.css";

type FlowBenchmarkPanelProps = { onApply: (result: FlowBenchmarkResult) => void; onClose: () => void };

export function FlowBenchmarkPanel({ onApply, onClose }: FlowBenchmarkPanelProps) {
  const results = benchmarkFlowVariants();
  const best = results[0];
  return <section className={styles.benchmarkPanel} aria-label="Flow topology benchmark">
    <header className={styles.benchmarkHeader}><div><div className={styles.kicker}><BarChart3 className="size-4" /> TOPOLOGY BENCHMARK</div><h2>Which learning loop should SciLoop ship?</h2><p>Five representative flow shapes are scored across reasoning coherence, cognitive learning signal, and visual-engine readiness. These are structural estimates—not human evidence.</p></div><button type="button" className={styles.closeReasoningButton} aria-label="Close topology benchmark" onClick={onClose}><X className="size-4" /></button></header>
    <div className={styles.benchmarkDecision}><CheckCircle2 className="size-4" /><span>Current recommendation:</span><strong>{best.name}</strong><small>{best.thesis}</small><button type="button" className={styles.executionButton} onClick={() => onApply(best)}>Apply top flow</button></div>
    <div className={styles.benchmarkTableWrap}><table className={styles.benchmarkTable}><thead><tr><th>Rank</th><th>Flow</th><th>Reasoning</th><th>Cognitive</th><th>Visual</th><th>Total</th><th>Load</th><th /></tr></thead><tbody>{results.map((result, index) => <tr key={result.id} className={index === 0 ? styles.benchmarkBest : ""}><td>{index + 1}</td><td><b>{result.name}</b><small>{result.nodes.length} nodes · {result.edges.length} links</small></td><td>{result.reasoningScore.toFixed(1)}</td><td>{result.cognitiveScore.toFixed(1)}</td><td>{result.visualScore.toFixed(1)}</td><td className={styles.benchmarkTotal}>{result.totalScore.toFixed(1)}</td><td>{result.cognitiveLoad.toFixed(1)}</td><td><button type="button" className={styles.benchmarkApply} onClick={() => onApply(result)}><GitBranch className="size-3" /> Apply</button></td></tr>)}</tbody></table></div>
    <div className={styles.benchmarkFootnote}><span>Weighted total: 36% cognitive · 34% visual · 30% reasoning · load penalty above 60.</span><span>Next validation: run the top two in Cognitive Lab with the same gravity problem.</span></div>
  </section>;
}
