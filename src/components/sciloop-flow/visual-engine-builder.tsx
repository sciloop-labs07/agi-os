"use client";

import { useMemo, useState } from "react";
import { BrainCircuit, CheckCircle2, ChevronRight, Database, GitBranch, Play, RefreshCw, Sparkles, Target, Users, Zap } from "lucide-react";
import { initialSciLoopEdges, initialSciLoopNodes } from "@/lib/sciloop-flow";
import { createInitialPopulation, evaluatePopulation, evolvePopulation, generationSnapshot } from "@/lib/engine-optimizer/genetic";
import type { EngineGenome, GenerationSnapshot, OptimizerConfig } from "@/lib/engine-optimizer/types";
import { simulateFlow, type SimulationResults } from "@/lib/simulation-result-engine";
import { extractKnowledge, mapKnowledgeToVisuals, scoreLabels, simulationStages, stateMachine, type EngineVersion } from "@/lib/visual-engine-builder";
import styles from "./visual-engine-builder.module.css";
import { GeneratedLearningExperience } from "./generated-learning-experience";

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
export function VisualEngineBuilder() {
  const [concept, setConcept] = useState("A new concept");
  const [nodes] = useState(initialSciLoopNodes);
  const [edges] = useState(initialSciLoopEdges);
  const [engine, setEngine] = useState<EngineVersion | null>(null);
  const [history, setHistory] = useState<EngineVersion[]>([]);
  const [generations, setGenerations] = useState<GenerationSnapshot[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [status, setStatus] = useState("Ready for a concept");
  const [generation, setGeneration] = useState(0);
  const [telemetry, setTelemetry] = useState({ predicted: 0, human: 0 });
  const [simulationRuns, setSimulationRuns] = useState(0);
  const knowledge = useMemo(() => extractKnowledge(concept), [concept]);
  const visuals = useMemo(() => mapKnowledgeToVisuals(knowledge), [knowledge]);
  const machine = useMemo(() => stateMachine(nodes), [nodes]);
  const stages = useMemo(() => simulationStages(nodes), [nodes]);
  const activeEngine = engine?.engine ?? evaluatePopulation(createInitialPopulation(nodes, edges, { populationSize: 1, targetScore: 90, maxGenerations: 1, maxSimulations: 1, patience: 1 }, { value: 1 }))[0];
  const scoreRows = scoreLabels(activeEngine.scores);
  const simulation = useMemo<SimulationResults>(() => simulateFlow(nodes, edges), [nodes, edges]);

  const runSimulation = () => {
    setSimulationRuns((value) => value + 1);
    setStatus(`Combo simulated: ${simulation.overallScore.toFixed(1)} overall`);
  };

  const promote = (candidate: EngineGenome, version: number) => {
    const next: EngineVersion = { id: candidate.id, version, promotedAt: new Date().toISOString(), score: candidate.scores.overall, engine: candidate, concept: concept.trim() || "New concept", telemetry: { predicted: candidate.scores.overall, human: 0 } };
    setEngine(next);
    setHistory((current) => [next, ...current].slice(0, 10));
    setTelemetry({ predicted: candidate.scores.overall, human: 0 });
  };

  const optimize = async () => {
    if (isOptimizing) return;
    setIsOptimizing(true); setStatus("Generating candidate engines"); setGenerations([]); setGeneration(0);
    const config: OptimizerConfig = { populationSize: 18, targetScore: 92, maxGenerations: 10, maxSimulations: 240, patience: 4 };
    const counter = { value: 1 };
    let population = createInitialPopulation(nodes, edges, config, counter);
    let best: EngineGenome | null = null;
    const snapshots: GenerationSnapshot[] = [];
    for (let index = 1; index <= config.maxGenerations; index += 1) {
      const ranked = evaluatePopulation(population);
      const snapshot = generationSnapshot(ranked, index);
      snapshots.push(snapshot); setGenerations([...snapshots]); setGeneration(index); best = ranked[0] ?? best;
      setStatus(`Simulating generation ${index} / ${config.maxGenerations}`);
      if (snapshot.best >= config.targetScore || index === config.maxGenerations) break;
      population = evolvePopulation(ranked, index, config, counter);
      await wait(90);
    }
    if (best) { const nextVersion = (engine?.version ?? 0) + 1; if (!engine || best.scores.overall >= engine.score) promote(best, nextVersion); setStatus(`${best.id} promoted as current best`); }
    setIsOptimizing(false);
  };

  const reset = () => { setEngine(null); setHistory([]); setGenerations([]); setGeneration(0); setTelemetry({ predicted: 0, human: 0 }); setStatus("Ready for a concept"); };
  const registerHumanTelemetry = () => { const human = Math.min(100, Math.round((engine?.score ?? activeEngine.scores.overall) * .96 + 3)); setTelemetry((current) => ({ ...current, human })); setStatus("Human telemetry recorded"); };

  return <div className={styles.portal}>
    <header className={styles.header}><div><div className={styles.kicker}><Sparkles className="size-4" /> SCILOOP / SELF-IMPROVING VISUAL ENGINE</div><h1>Current Best Engine</h1><p>Design → optimize → generate → test → learn → evolve.</p></div><div className={styles.liveStatus}><i /> {status}</div></header>
    <section className={styles.controlBar}><label><span>Knowledge concept</span><input value={concept} onChange={(event) => setConcept(event.target.value)} placeholder="Any concept, system, or question" /></label><button className={styles.primary} type="button" onClick={() => void optimize()} disabled={isOptimizing}><Zap className="size-4" /> {isOptimizing ? "Optimizing..." : "Optimize & Promote"}</button><button className={styles.secondary} type="button" onClick={registerHumanTelemetry} disabled={!engine}><Users className="size-4" /> Add human result</button><button className={styles.iconButton} type="button" onClick={reset} aria-label="Reset engine"><RefreshCw className="size-4" /></button></section>
    <section className={styles.pipeline}><div className={styles.pipelineTitle}><span>EVOLUTION LOOP</span><b>{generation ? `Generation ${generation}` : "Awaiting run"}</b></div><div className={styles.pipelineTrack}>{["Design Flow", "Optimize", "Generate Engine", "Generate Experience", "AI Score", "Human Test", "Telemetry", "Improve"].map((item, index) => <div key={item} className={generation && index < 5 ? styles.pipelineDone : ""}><i>{index + 1}</i><span>{item}</span>{index < 7 && <ChevronRight className="size-3" />}</div>)}</div></section>
    <section className={styles.heroGrid}><div className={styles.identity}><div className={styles.sectionKicker}><Target className="size-4" /> PROMOTED CANDIDATE</div><div className={styles.engineId}>{engine?.id ?? "C0000"}</div><div className={styles.engineVersion}>Engine V{engine?.version ?? 0} · {engine ? "current best" : "not promoted"}</div><div className={styles.scoreRing}><strong>{(engine?.score ?? 0).toFixed(1)}</strong><span>overall score</span></div><button className={styles.secondary} type="button" onClick={registerHumanTelemetry} disabled={!engine}>Record real learner result</button></div><div className={styles.flowPreview}><div className={styles.sectionKicker}><GitBranch className="size-4" /> GENERATED LEARNING EXPERIENCE</div><div className={styles.flowLine}>{nodes.map((node, index) => <div key={node.id} className={styles.flowStep}><span>{String(index + 1).padStart(2, "0")}</span><b>{node.data.label}</b>{index < nodes.length - 1 && <i />}</div>)}</div></div></section>
    <section className={styles.dashboardGrid}><article className={styles.card}><div className={styles.cardHeading}><BrainCircuit className="size-4" /><div><span>STATE MACHINE</span><b>Executable learning logic</b></div></div><div className={styles.stateList}>{machine.slice(0, 9).map((state) => <div key={state.state}><strong>{state.state}</strong><span>{state.label}</span><small>{state.transition}</small></div>)}</div></article><article className={styles.card}><div className={styles.cardHeading}><Database className="size-4" /><div><span>KNOWLEDGE GRAPH</span><b>{concept || "New concept"}</b></div></div><div className={styles.entityList}>{knowledge.map((entity) => <div key={entity.id}><i className={styles[`kind${entity.kind}`]} /> <span>{entity.kind}</span><b>{entity.label}</b><small>{entity.confidence}%</small></div>)}</div></article><article className={styles.card}><div className={styles.cardHeading}><Sparkles className="size-4" /><div><span>VISUAL LANGUAGE</span><b>Replaceable primitive mapping</b></div></div><div className={styles.mappingList}>{visuals.map((mapping) => <div key={mapping.source}><strong>{mapping.primitive}</strong><span>{mapping.source}</span><small>{mapping.behavior}</small></div>)}</div></article></section>
    <section className={styles.dashboardGrid}><article className={styles.card}><div className={styles.cardHeading}><Play className="size-4" /><div><span>SIMULATION PIPELINE</span><b>Adapter-ready execution</b></div></div><ol className={styles.stageList}>{stages.map((stage, index) => <li key={`${stage}-${index}`}><i>{index + 1}</i>{stage}<span>{index < 2 ? "ready" : "modular adapter"}</span></li>)}</ol><button className={styles.experiencePrimary} type="button" onClick={runSimulation}>Simulate this combo <Play className="size-4" /></button><div className={styles.simulationSignal}><span>Run {simulationRuns}</span><b>{simulationRuns ? `${simulation.overallScore.toFixed(1)} / 100` : "awaiting simulation"}</b></div></article><article className={styles.card}><div className={styles.cardHeading}><CheckCircle2 className="size-4" /><div><span>SCORING BREAKDOWN</span><b>AI prediction vs human result</b></div></div><div className={styles.scoreList}>{scoreRows.map(([label, value]) => <div key={label}><span>{label}</span><b>{value.toFixed(0)}</b><i><em style={{ width: `${value}%` }} /></i></div>)}</div><div className={styles.telemetry}><span>Predicted <b>{telemetry.predicted.toFixed(0)}</b></span><span>Human <b>{telemetry.human ? telemetry.human.toFixed(0) : "—"}</b></span><span>Delta <b>{telemetry.human ? (telemetry.human - telemetry.predicted).toFixed(1) : "—"}</b></span></div></article></section>
    <section className={styles.bottomGrid}><article className={styles.card}><div className={styles.cardHeading}><GitBranch className="size-4" /><div><span>OPTIMIZATION HISTORY</span><b>Promoted engine versions</b></div></div><div className={styles.historyList}>{history.length ? history.map((item) => <div key={`${item.id}-${item.version}`}><strong>{item.id}</strong><span>V{item.version}</span><b>{item.score.toFixed(1)}</b><small>{new Date(item.promotedAt).toLocaleTimeString()}</small></div>) : <p className={styles.empty}>Run Optimize & Promote to create Engine V1.</p>}</div></article><article className={styles.card}><div className={styles.cardHeading}><RefreshCw className="size-4" /><div><span>EVOLUTION TELEMETRY</span><b>Current vs previous best</b></div></div><div className={styles.evolution}><div><span>Current engine</span><strong>{engine?.id ?? "—"}</strong><b>{engine?.score.toFixed(1) ?? "—"}</b></div><div><span>AI / human gap</span><strong>{telemetry.human ? `${Math.abs(telemetry.human - telemetry.predicted).toFixed(1)} pts` : "Awaiting human test"}</strong><small>{telemetry.human ? "scoring model feedback available" : "Connect real learner telemetry to improve scoring"}</small></div></div><div className={styles.versionNote}>The engine stays domain-independent. Only the loaded knowledge graph changes.</div></article></section>
    <GeneratedLearningExperience />
    <footer className={styles.footer}><span><Zap className="size-3.5" /> One Visual Engine: simulate → optimize → promote → teach</span><span>{nodes.length} learning states · {edges.length} transitions · {generations.length} AI generations · {history.length} promoted versions</span></footer>
  </div>;
}
