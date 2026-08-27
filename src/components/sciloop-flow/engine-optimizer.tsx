"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, BarChart3, CheckCircle2, ChevronDown, FastForward, Pause, Play, RotateCcw, Square, Target, X } from "lucide-react";
import type { SciLoopEdge, SciLoopNode } from "@/lib/sciloop-flow";
import { createInitialPopulation, evaluatePopulation, evolvePopulation, generationSnapshot, makeReport } from "@/lib/engine-optimizer/genetic";
import type { EngineGenome, GenerationSnapshot, NodeParameters, OptimizationReport, OptimizerConfig, OptimizationStatus } from "@/lib/engine-optimizer/types";
import styles from "./sciloop-flow-designer.module.css";

type EngineOptimizerProps = { nodes: SciLoopNode[]; edges: SciLoopEdge[]; onApplyEngine: (engine: EngineGenome) => void; onClose: () => void };
const metricLabels: Array<[keyof EngineGenome["scores"], string]> = [["understanding", "Understanding"], ["retention", "Retention"], ["curiosity", "Curiosity"], ["attention", "Attention"], ["masteryProbability", "Mastery Probability"]];
const defaultParameter = (): NodeParameters => ({ intensity: 50, novelty: 50, challenge: 50, repetition: 50 });
const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export function EngineOptimizer({ nodes, edges, onApplyEngine, onClose }: EngineOptimizerProps) {
  const [status, setStatus] = useState<OptimizationStatus>("idle");
  const [generation, setGeneration] = useState(0);
  const [population, setPopulation] = useState<EngineGenome[]>([]);
  const [history, setHistory] = useState<GenerationSnapshot[]>([]);
  const [report, setReport] = useState<OptimizationReport | null>(null);
  const [simulations, setSimulations] = useState(0);
  const [config, setConfig] = useState<OptimizerConfig>({ populationSize: 24, targetScore: 90, maxGenerations: 30, maxSimulations: 500, patience: 6 });
  const [selectedNodeId, setSelectedNodeId] = useState(nodes[0]?.id ?? "");
  const [seedParameters, setSeedParameters] = useState<Record<string, NodeParameters>>(() => Object.fromEntries(nodes.map((node) => [node.id, node.data.optimizer ?? defaultParameter()])));
  const counterRef = useRef({ value: 1 });
  const stopRef = useRef(false);
  const pauseRef = useRef(false);
  const runStartedRef = useRef(0);
  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? nodes[0];
  const selectedParameters = seedParameters[selectedNode?.id ?? ""] ?? defaultParameter();
  const ranked = useMemo(() => [...population].sort((a, b) => b.scores.overall - a.scores.overall), [population]);
  const best = ranked[0] ?? report?.best ?? null;
  const average = ranked.length ? ranked.reduce((sum, engine) => sum + engine.scores.overall, 0) / ranked.length : 0;
  const worst = ranked.at(-1)?.scores.overall ?? 0;
  const progress = config.maxGenerations ? Math.min(100, generation / config.maxGenerations * 100) : 0;

  useEffect(() => () => { stopRef.current = true; }, []);

  const updateConfig = (key: keyof OptimizerConfig, value: string) => setConfig((current) => ({ ...current, [key]: Number(value) }));
  const updateParameter = (key: keyof NodeParameters, value: string) => setSeedParameters((current) => ({ ...current, [selectedNode?.id ?? ""]: { ...selectedParameters, [key]: Number(value) } }));

  const run = async (resume = false) => {
    if (status === "running") return;
    stopRef.current = false;
    pauseRef.current = false;
    setStatus("running");
    const started = resume ? runStartedRef.current : performance.now();
    if (!resume) {
      runStartedRef.current = started;
      setReport(null); setGeneration(0); setSimulations(0); setHistory([]);
    }
    let current = resume && population.length ? population : createInitialPopulation(nodes, edges, config, counterRef.current, seedParameters);
    let currentGeneration = resume && generation ? generation : 0;
    let total = resume ? simulations : 0;
    let stagnant = 0;
    let previousBest = 0;
    while (!stopRef.current && currentGeneration < config.maxGenerations && total < config.maxSimulations) {
      while (pauseRef.current && !stopRef.current) await wait(120);
      if (stopRef.current) break;
      const evaluated = evaluatePopulation(current);
      total += evaluated.length;
      const snapshot = generationSnapshot(evaluated, currentGeneration + 1);
      const nextHistory = [...(resume ? history : []), snapshot];
      setPopulation(evaluated); setGeneration(currentGeneration + 1); setSimulations(total); setHistory(nextHistory);
      if (snapshot.best <= previousBest + .05) stagnant += 1; else stagnant = 0;
      previousBest = Math.max(previousBest, snapshot.best);
      currentGeneration += 1;
      if (snapshot.best >= config.targetScore || stagnant >= config.patience || currentGeneration >= config.maxGenerations || total >= config.maxSimulations) {
        const finalReport = makeReport(nextHistory, evaluated, total, performance.now() - started);
        setReport(finalReport); setStatus("completed"); return;
      }
      current = evolvePopulation(evaluated, currentGeneration, config, counterRef.current);
      await wait(80);
    }
    const finalReport = makeReport(history, population, total, performance.now() - started);
    setReport(finalReport); setStatus(stopRef.current ? "stopped" : "completed");
  };
  const pause = () => { pauseRef.current = true; setStatus("paused"); };
  const resume = () => { pauseRef.current = false; setStatus("running"); };
  const stop = () => { stopRef.current = true; pauseRef.current = false; setStatus("stopped"); };
  const reset = () => { stopRef.current = true; pauseRef.current = false; setStatus("idle"); setGeneration(0); setSimulations(0); setPopulation([]); setHistory([]); setReport(null); };

  return <section className={styles.optimizerPanel} aria-label="Engine Optimizer">
    <header className={styles.optimizerHeader}>
      <div><div className={styles.kicker}><Activity className="size-4" /> ENGINE / GENETIC SEARCH</div><h2>Engine Optimizer</h2><p>Searches the current learning graph for a stronger parameterized engine.</p></div>
      <div className={styles.optimizerHeaderActions}><span className={`${styles.optimizerStatus} ${styles[`optimizerStatus${status}`]}`}>{status}</span><button type="button" className={styles.closeResultButton} aria-label="Close Engine Optimizer" onClick={onClose}><X className="size-4" /></button></div>
    </header>
    <div className={styles.optimizerControls}>
      {status === "idle" || status === "completed" || status === "stopped" ? <button type="button" className={styles.optimizerStart} onClick={() => void run()}><Play className="size-4" /> Start Optimization</button> : null}
      {status === "running" ? <button type="button" className={styles.optimizerControl} onClick={pause}><Pause className="size-4" /> Pause</button> : null}
      {status === "paused" ? <button type="button" className={styles.optimizerStart} onClick={resume}><Play className="size-4" /> Resume</button> : null}
      {status === "running" || status === "paused" ? <button type="button" className={styles.optimizerControl} onClick={stop}><Square className="size-4" /> Stop</button> : null}
      <button type="button" className={styles.optimizerControl} onClick={reset}><RotateCcw className="size-4" /> Reset</button>
      <span className={styles.optimizerPipeline}><b>Genetic Algorithm</b><span>select top 10%</span><ChevronDown className="size-3" /><span>crossover</span><ChevronDown className="size-3" /><span>mutate</span><ChevronDown className="size-3" /><span>repeat</span></span>
    </div>
    <div className={styles.optimizerWorkspace}>
      <aside className={styles.optimizerConfig}>
        <div className={styles.panelHeading}><span>SEARCH CONTROLS</span><strong>Stopping conditions</strong></div>
        {([["populationSize", "Population", 8, 80], ["targetScore", "Target score", 50, 100], ["maxGenerations", "Max generations", 3, 100], ["maxSimulations", "Max simulations", 24, 3000], ["patience", "No improvement", 1, 30]] as Array<[keyof OptimizerConfig, string, number, number]>).map(([key, label, min, max]) => <label key={key} className={styles.optimizerField}>{label}<input type="number" min={min} max={max} value={config[key]} onChange={(event) => updateConfig(key, event.target.value)} /></label>)}
        <div className={styles.panelHeading}><span>NODE PARAMETERS</span><strong>Configurable genes</strong></div>
        <label className={styles.optimizerField}>Learning block<select value={selectedNode?.id ?? ""} onChange={(event) => setSelectedNodeId(event.target.value)}>{nodes.map((node) => <option key={node.id} value={node.id}>{node.data.nodeType}: {node.data.label}</option>)}</select></label>
        {(["intensity", "novelty", "challenge", "repetition"] as Array<keyof NodeParameters>).map((key) => <label key={key} className={styles.rangeField}><span>{key}<b>{selectedParameters[key]}</b></span><input type="range" min="0" max="100" value={selectedParameters[key]} onChange={(event) => updateParameter(key, event.target.value)} /></label>)}
        <div className={styles.optimizerHint}><Target className="size-4" /> Each candidate receives a unique C-series ID and keeps the current graph topology.</div>
      </aside>
      <div className={styles.optimizerMain}>
        <div className={styles.optimizerStatGrid}><div><span>Current generation</span><strong>{generation}</strong></div><div><span>Population size</span><strong>{ranked.length || config.populationSize}</strong></div><div><span>Current best</span><strong>{best?.id ?? "—"}</strong></div><div><span>Best score</span><strong>{best?.scores.overall.toFixed(1) ?? "—"}</strong></div><div><span>Average score</span><strong>{average.toFixed(1)}</strong></div><div><span>Worst score</span><strong>{worst.toFixed(1)}</strong></div></div>
        <div className={styles.optimizerProgress}><div><span>Optimization progress</span><b>{Math.round(progress)}%</b></div><i style={{ width: `${progress}%` }} /></div>
        <div className={styles.optimizerCharts}><div className={styles.optimizerChart}><div className={styles.panelHeading}><span>IMPROVEMENT GRAPH</span><strong>Best / average / worst</strong></div><svg viewBox="0 0 600 190" role="img" aria-label="Optimization improvement graph"><polyline points={history.map((point, index) => `${index / Math.max(history.length - 1, 1) * 580 + 10},${180 - point.best * 1.55}`).join(" ")} fill="none" stroke="#b6ff61" strokeWidth="3" /><polyline points={history.map((point, index) => `${index / Math.max(history.length - 1, 1) * 580 + 10},${180 - point.average * 1.55}`).join(" ")} fill="none" stroke="#48e5ff" strokeWidth="2" /><line x1="10" y1="180" x2="590" y2="180" stroke="rgba(148,163,184,.2)" /></svg></div><div className={styles.optimizerChart}><div className={styles.panelHeading}><span>GENERATION GRAPH</span><strong>Population score bands</strong></div><div className={styles.generationBars}>{history.map((point) => <i key={point.generation} style={{ height: `${Math.max(4, point.best)}%` }} title={`Generation ${point.generation}: ${point.best.toFixed(1)}`} />)}</div></div></div>
        <section className={styles.topEngines}><div className={styles.optimizerSectionTitle}><div><span className={styles.resultPanelKicker}><BarChart3 className="size-3.5" /> TOP ENGINES</span><h3>Ranked candidates</h3></div><span>{ranked.length} candidates evaluated</span></div><div className={styles.engineTableWrap}><table className={styles.engineTable}><thead><tr><th>Rank</th><th>Engine ID</th><th>Overall</th>{metricLabels.map(([, label]) => <th key={label}>{label}</th>)}</tr></thead><tbody>{ranked.slice(0, 10).map((engine, index) => <tr key={engine.id} onClick={() => onApplyEngine(engine)} tabIndex={0} title="Apply this engine to the canvas"><td>{index + 1}</td><td><b>{engine.id}</b><small>gen {engine.generation}</small></td><td className={styles.scoreCell}>{engine.scores.overall.toFixed(1)}</td>{metricLabels.map(([key]) => <td key={key}>{engine.scores[key].toFixed(0)}</td>)}</tr>)}</tbody></table></div></section>
      </div>
    </div>
    {report && <section className={styles.optimizerReport}><div className={styles.optimizerSectionTitle}><div><span className={styles.resultPanelKicker}><CheckCircle2 className="size-3.5" /> FINAL REPORT</span><h3>Optimization complete</h3></div><span>{(report.searchTimeMs / 1000).toFixed(1)}s search</span></div><div className={styles.reportGrid}><div><span>Total simulations</span><strong>{report.totalSimulations}</strong></div><div><span>Total generations</span><strong>{report.totalGenerations}</strong></div><div><span>Best engine</span><strong>{report.best?.id ?? "—"}</strong></div><div><span>Best score</span><strong>{report.best?.scores.overall.toFixed(1) ?? "—"}</strong></div></div><p className={styles.recommendation}>{report.recommendation}</p><div className={styles.reportDistribution}>{report.distribution.map((score, index) => <i key={`${score}-${index}`} style={{ height: `${Math.max(4, score)}%` }} />)}</div><button type="button" className={styles.optimizerStart} disabled={!report.best} onClick={() => report.best && onApplyEngine(report.best)}><FastForward className="size-4" /> Reconstruct best learning flow</button></section>}
  </section>;
}
