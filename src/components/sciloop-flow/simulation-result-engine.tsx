"use client";

import { Activity, BrainCircuit, Gauge, Play, Radar, RefreshCw, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { metricsForGroup, resultGroups, simulateFlow, type ResultGroup, type SimulationResults } from "@/lib/simulation-result-engine";
import type { SciLoopEdge, SciLoopNode } from "@/lib/sciloop-flow";
import styles from "./sciloop-flow-designer.module.css";

type SimulationResultEngineProps = {
  nodes: SciLoopNode[];
  edges: SciLoopEdge[];
  isSimulated: boolean;
  runToken: number;
  onSimulate: () => void;
  onClose: () => void;
};

const radarGroups = resultGroups.filter((group) => group !== "Overall");
const allGroup = "All" as const;

function scoreLabel(value: number, isSimulated: boolean) {
  return isSimulated ? Math.round(value) : "--";
}

function GaugeRing({ value, isSimulated }: { value: number; isSimulated: boolean }) {
  const radius = 47;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (isSimulated ? value / 100 : 0) * circumference;
  return (
    <svg className={styles.resultGauge} viewBox="0 0 120 120" role="img" aria-label={isSimulated ? `Overall engine score ${Math.round(value)} out of 100` : "Overall engine score not simulated"}>
      <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(148,163,184,.14)" strokeWidth="8" />
      <circle className={styles.gaugeProgress} cx="60" cy="60" r={radius} fill="none" stroke="#f4d35e" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} transform="rotate(-90 60 60)" />
      <text x="60" y="57" textAnchor="middle" className={styles.gaugeValue}>{scoreLabel(value, isSimulated)}</text>
      <text x="60" y="74" textAnchor="middle" className={styles.gaugeUnit}>/ 100</text>
    </svg>
  );
}

function RadarChart({ results, isSimulated }: { results: SimulationResults; isSimulated: boolean }) {
  const center = 120;
  const radius = 82;
  const point = (index: number, value: number, scale = radius) => {
    const angle = (-Math.PI / 2) + index * (Math.PI * 2 / radarGroups.length);
    const ratio = (isSimulated ? value : 0) / 100;
    return { x: center + Math.cos(angle) * scale * ratio, y: center + Math.sin(angle) * scale * ratio };
  };
  const labelPoint = (index: number) => {
    const angle = (-Math.PI / 2) + index * (Math.PI * 2 / radarGroups.length);
    return { x: center + Math.cos(angle) * 106, y: center + Math.sin(angle) * 106 };
  };
  const polygon = radarGroups.map((group, index) => { const p = point(index, results.groupScores[group]); return `${p.x},${p.y}`; }).join(" ");
  return (
    <svg className={styles.radarChart} viewBox="0 0 240 240" role="img" aria-label="Radar chart of simulation result group scores">
      {[25, 50, 75, 100].map((level) => <polygon key={level} points={radarGroups.map((_, index) => { const p = point(index, level, radius); return `${p.x},${p.y}`; }).join(" ")} fill="none" stroke="rgba(148,163,184,.16)" strokeWidth="1" />)}
      {radarGroups.map((group, index) => { const end = point(index, 100, radius); const label = labelPoint(index); return <g key={group}><line x1={center} y1={center} x2={end.x} y2={end.y} stroke="rgba(148,163,184,.14)" strokeWidth="1" /><text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" className={styles.radarLabel}>{group.replace("Prediction Engine", "Prediction")}</text></g>; })}
      <polygon className={styles.radarPolygon} points={polygon} />
      {radarGroups.map((group, index) => { const p = point(index, results.groupScores[group]); return <circle key={group} cx={p.x} cy={p.y} r="3.5" fill="#48e5ff" />; })}
      <circle cx={center} cy={center} r="3" fill="#f4d35e" />
    </svg>
  );
}

function MetricRow({ label, value, description, isSimulated }: { label: string; value: number; description: string; isSimulated: boolean }) {
  return (
    <div className={styles.metricRow}>
      <div className={styles.metricRowHead}><span>{label}</span><strong>{scoreLabel(value, isSimulated)}</strong></div>
      <div className={styles.metricTrack}><i style={{ width: `${isSimulated ? value : 0}%` }} /></div>
      <p>{description}</p>
    </div>
  );
}

export function SimulationResultEngine({ nodes, edges, isSimulated, runToken, onSimulate, onClose }: SimulationResultEngineProps) {
  const [selectedGroup, setSelectedGroup] = useState<ResultGroup | "All">(allGroup);
  const results = useMemo(() => {
    void runToken;
    return simulateFlow(nodes, edges) as SimulationResults;
  }, [edges, nodes, runToken]);
  const visibleMetrics = selectedGroup === allGroup ? results.metrics : metricsForGroup(results, selectedGroup);

  return (
    <section className={styles.resultEngine} aria-label="Simulation Result Engine">
      <header className={styles.resultEngineHeader}>
        <div>
          <div className={styles.kicker}><Sparkles className="size-4" /> RESULT COMPUTATION LAYER</div>
          <h2>Simulation Result Engine</h2>
          <p>Placeholder formulas convert the current flow combo into predicted learning experience outcomes.</p>
        </div>
        <div className={styles.resultHeaderActions}>
          <span className={styles.formulaBadge}><SlidersHorizontal className="size-3.5" /> HEURISTIC V0</span>
          <button type="button" className={styles.closeResultButton} onClick={onClose} aria-label="Hide Simulation Result Engine"><X className="size-4" /></button>
        </div>
      </header>

      <div className={styles.resultControls}>
        <button type="button" className={styles.simulateButton} onClick={onSimulate}><Play className="size-4" /> Simulate Combo</button>
        <span className={styles.recomputeNote}><RefreshCw className="size-3.5" /> Metrics recompute automatically when nodes or connections change.</span>
        <div className={styles.inputSummary}><span>{results.inputSummary.nodes} nodes</span><span>{results.inputSummary.connections} connections</span><span>{results.inputSummary.branches} branches</span><span>{results.inputSummary.experiments} experiments</span></div>
      </div>

      {!isSimulated && <div className={styles.simulationPrompt}><Gauge className="size-5" /><strong>Ready to simulate this combo</strong><span>Run the engine to populate all learning, attention, prediction, emotion, interaction, efficiency, quality, system, and overall metrics.</span></div>}

      <div className={`${styles.resultTopGrid} ${!isSimulated ? styles.resultDimmed : ""}`}>
        <div className={styles.overallScorePanel}>
          <div className={styles.resultPanelKicker}>OVERALL ENGINE SCORE</div>
          <GaugeRing value={results.overallScore} isSimulated={isSimulated} />
          <strong className={styles.overallCaption}>{isSimulated ? "Learning combo quality" : "Awaiting simulation"}</strong>
          <span className={styles.overallSubcaption}>{results.metrics.length} predicted outcome metrics</span>
        </div>
        <div className={styles.radarPanel}><div className={styles.resultPanelKicker}><Radar className="size-4" /> GROUP RADAR</div><RadarChart results={results} isSimulated={isSimulated} /></div>
        <div className={styles.groupScorePanel}><div className={styles.resultPanelKicker}><Activity className="size-4" /> GROUP SCORES</div><div className={styles.groupScoreList}>{resultGroups.map((group) => <div className={styles.groupScoreRow} key={group}><span>{group}</span><strong>{scoreLabel(results.groupScores[group], isSimulated)}</strong><div><i style={{ width: `${isSimulated ? results.groupScores[group] : 0}%` }} /></div></div>)}</div></div>
      </div>

      <div className={styles.metricSectionHeader}><div><span className={styles.resultPanelKicker}><BrainCircuit className="size-4" /> PREDICTED OUTCOMES</span><h3>Metric matrix</h3></div><span className={styles.metricCount}>{visibleMetrics.length} metrics visible</span></div>
      <div className={styles.groupTabs} role="tablist" aria-label="Metric groups">
        <button type="button" role="tab" aria-selected={selectedGroup === allGroup} onClick={() => setSelectedGroup(allGroup)}>All metrics</button>
        {resultGroups.map((group) => <button key={group} type="button" role="tab" aria-selected={selectedGroup === group} onClick={() => setSelectedGroup(group)}>{group}</button>)}
      </div>
      <div className={styles.metricsGrid}>{visibleMetrics.map((metric) => <MetricRow key={metric.id} label={metric.label} value={metric.value} description={metric.description} isSimulated={isSimulated} />)}</div>
    </section>
  );
}
