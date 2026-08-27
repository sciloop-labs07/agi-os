"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, BrainCircuit, Check, ChevronRight, CircleAlert, Database, Gauge, RotateCcw, Sparkles, Target, Zap } from "lucide-react";
import { defaultSelfEvolvingState, evaluateExample, evolveState, selfEvolvingExamples, type EngineExample, type ExampleResult, type SelfEvolvingState } from "@/lib/self-evolving-engine";
import styles from "./self-evolving-engine.module.css";

const storageKey = "sciloop-self-evolving-engine-v1";
const difficultyLabel = { easy: "EASY SYSTEM", medium: "MEDIUM SYSTEM", complex: "COMPLEX SYSTEM" } as const;

function adaptiveScenario(example: EngineExample, challenge: number, contrastMode: boolean) {
  const values = Object.fromEntries(example.variables.map((variable) => [variable.id, variable.initial]));
  if (contrastMode) {
    if (example.id === "gravity") Object.assign(values, { gravity: 0.2, height: 4 });
    if (example.id === "ecosystem") Object.assign(values, { prey: 60, predators: 25, food: 60 });
    if (example.id === "climate") Object.assign(values, { co2: 400, albedo: 0.4, solar: 0.98 });
  } else if (challenge >= 3) {
    if (example.id === "gravity") Object.assign(values, { gravity: challenge >= 4 ? 14 : 9.8, height: challenge >= 4 ? 10 : 9 });
    if (example.id === "ecosystem") Object.assign(values, challenge >= 4 ? { prey: 58, predators: 40, food: 45 } : { prey: 62, predators: 32, food: 58 });
    if (example.id === "climate") Object.assign(values, challenge >= 4 ? { co2: 350, albedo: 0.42, solar: 0.96 } : { co2: 500, albedo: 0.25, solar: 1.08 });
  }
  return values;
}

export function SelfEvolvingEngine() {
  const [selectedId, setSelectedId] = useState("gravity");
  const [state, setState] = useState<SelfEvolvingState>(defaultSelfEvolvingState);
  const [values, setValues] = useState<Record<string, number>>(() => Object.fromEntries(selfEvolvingExamples[0].variables.map((variable) => [variable.id, variable.initial])));
  const [prediction, setPrediction] = useState("");
  const [result, setResult] = useState<ExampleResult | null>(null);
  const [beginnerMode, setBeginnerMode] = useState(true);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [status, setStatus] = useState("Ready for a falsifiable prediction");
  const [hydrated, setHydrated] = useState(false);
  const example = selfEvolvingExamples.find((item) => item.id === selectedId) ?? selfEvolvingExamples[0];
  const accuracy = state.totalRuns ? Math.round((state.correctRuns / state.totalRuns) * 100) : 0;
  const activeMastery = Math.round(state.mastery[example.id] ?? 0);
  const sharedPrimitives = useMemo(() => [...new Set(selfEvolvingExamples.flatMap((item) => item.primitives))], []);
  const beginnerBasis = ["things", "changes", "relationships", "time", "your guess", "what happened"];
  const visibleVariables = beginnerMode && !showAdvancedControls ? example.variables.slice(0, 1) : example.variables;
  const loopSteps = beginnerMode ? ["Look", "Guess", "Choose", "Watch", "Notice", "Learn", "Try elsewhere"] : ["Experience", "Predict", "Commit", "Simulate", "Error", "Update model", "Transfer"];

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setState({ ...defaultSelfEvolvingState(), ...JSON.parse(saved) });
    } catch { /* Keep the lab usable when storage is unavailable. */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [hydrated, state]);

  const chooseExample = (next: EngineExample) => {
    setSelectedId(next.id);
    setValues(adaptiveScenario(next, state.challenge, state.contrastMode));
    setPrediction("");
    setResult(null);
    setShowWhy(false);
    setShowAdvancedControls(false);
    setStatus("Ready for a falsifiable prediction");
  };

  const prepareNextTest = () => {
    setValues(adaptiveScenario(example, state.challenge, state.contrastMode));
    setPrediction("");
    setResult(null);
    setShowWhy(false);
    setShowAdvancedControls(false);
    setStatus(beginnerMode ? `A new practice world is ready` : `Adaptive challenge ×${state.challenge} loaded`);
  };

  const run = () => {
    if (result) { prepareNextTest(); return; }
    if (!prediction) { setStatus("Commit a prediction before running the system"); return; }
    const nextResult = evaluateExample(example, values, prediction);
    setResult(nextResult);
    setShowWhy(false);
    setReplayKey((current) => current + 1);
    setState((current) => evolveState(current, example.id, nextResult, prediction));
    setStatus(nextResult.correct ? "Prediction confirmed · engine strengthened" : "Prediction error captured · engine will adapt");
  };

  const reset = () => { setState(defaultSelfEvolvingState()); setResult(null); setPrediction(""); setShowWhy(false); setShowAdvancedControls(false); setStatus("Engine memory reset"); window.localStorage.removeItem(storageKey); };

  return <div className={styles.portal}>
    <header className={styles.header}><div><div className={styles.kicker}><Sparkles className="size-4" /> SCILOOP / SELF-EVOLVING FINAL ENGINE</div><h1>{beginnerMode ? "Learning Playground" : "Understanding Engine"}</h1><p>{beginnerMode ? "You do not need to know science first. Look, make a guess, and let the world show you what changed." : "Test the same discovery grammar on simple, coupled, and complex systems—then let learner evidence change the next experience."}</p></div><div className={styles.liveStatus}><i /> {status}</div></header>

    <section className={styles.controlStrip}><div className={styles.metric}><span>{beginnerMode ? "TESTS COMPLETED" : "GENERATION"}</span><strong>{beginnerMode ? state.totalRuns : `G${String(state.generation).padStart(3, "0")}`}</strong></div><div className={styles.metric}><span>{beginnerMode ? "GOOD GUESSES" : "LEARNER ACCURACY"}</span><strong>{accuracy}%</strong></div><div className={styles.metric}><span>{beginnerMode ? "LEARNING THIS IDEA" : "ACTIVE MASTERY"}</span><strong>{activeMastery}%</strong></div><div className={styles.metric}><span>{beginnerMode ? "NEXT LEVEL" : "NEXT CHALLENGE"}</span><strong>×{state.challenge}</strong></div><button type="button" className={styles.modeToggle} aria-pressed={beginnerMode} onClick={() => { setBeginnerMode((current) => !current); setShowWhy(false); }}><Sparkles className="size-3.5" /> {beginnerMode ? "New learner mode" : "Expert view"}</button><button type="button" className={styles.resetButton} onClick={reset}><RotateCcw className="size-3.5" /> Reset memory</button></section>

    {beginnerMode && <section className={styles.beginnerGuide}><div><span className={styles.sectionKicker}><Sparkles className="size-4" /> FIRST TIME HERE?</span><h2>There are no wrong guesses.</h2><p>The engine learns from what you expect. Your job is only to look, choose, and see what happens.</p></div><div className={styles.guideSteps}><span><b>1</b> Look</span><span><b>2</b> Guess</span><span><b>3</b> See why</span></div></section>}

    <section className={styles.engineLoop}><div className={styles.loopTitle}><BrainCircuit className="size-4" /><span>{beginnerMode ? "HOW YOU LEARN" : "ADAPTIVE LOOP"}</span><b>{beginnerMode ? "Every guess helps the next one" : "Every test produces a mutation signal"}</b></div><div className={styles.loopTrack}>{loopSteps.map((step, index) => <div key={step}><i>{String(index + 1).padStart(2, "0")}</i><span>{step}</span>{index < 6 && <ChevronRight className="size-3" />}</div>)}</div></section>

    <section className={styles.exampleSection}><div className={styles.sectionHeader}><div><div className={styles.sectionKicker}><Target className="size-4" /> {beginnerMode ? "PICK A WORLD" : "CROSS-DOMAIN TEST SET"}</div><h2>{beginnerMode ? "What would you like to explore?" : "Can one visual grammar scale?"}</h2><p>{beginnerMode ? "Start with one simple idea. You can come back to the harder worlds whenever you are ready." : "Each example uses objects, variables, relationships, time, state, and prediction error—but the transition rule changes by domain."}</p></div><div className={styles.exampleCount}>{state.totalRuns} test{state.totalRuns === 1 ? "" : "s"} recorded</div></div><div className={styles.exampleGrid}>{selfEvolvingExamples.map((item) => { const mastery = Math.round(state.mastery[item.id] ?? 0); return <button type="button" key={item.id} className={`${styles.exampleCard} ${item.id === example.id ? styles.exampleActive : ""}`} onClick={() => chooseExample(item)}><div className={styles.exampleTop}><span className={styles.difficulty}>{beginnerMode ? item.difficulty === "easy" ? "START HERE" : item.difficulty === "medium" ? "NEXT STEP" : "BIG QUESTION" : difficultyLabel[item.difficulty]}</span><strong>{mastery}%</strong></div><h3>{item.title}</h3><span>{beginnerMode ? "A world to explore" : item.domain}</span><p>{beginnerMode ? item.beginnerDescription : item.description}</p><i><b style={{ width: `${mastery}%` }} /></i></button>; })}</div></section>

    <section className={styles.workspace}><div className={styles.simulationCard}><div className={styles.cardHeader}><div><span className={styles.sectionKicker}><Activity className="size-4" /> {beginnerMode ? "YOUR WORLD" : `ACTIVE SYSTEM · ${example.domain.toUpperCase()}`}</span><h2>{example.title}</h2><p>{beginnerMode ? example.beginnerDescription : example.description}</p></div><span className={styles.difficulty}>{beginnerMode ? "EXPLORE" : difficultyLabel[example.difficulty]}</span></div><div className={styles.reasonCard}><strong>{beginnerMode ? "Why this matters" : "Concept"}</strong><span>{example.whyItMatters}</span></div><div className={styles.systemCanvas}><div className={`${styles.systemOrb} ${result?.correct ? styles.orbCorrect : result && styles.orbWrong}`}><span>{example.id === "gravity" ? "●" : example.id === "ecosystem" ? "◌ ◌" : "☼"}</span><small>{result ? (beginnerMode ? result.beginnerResult : result.outcomeLabel) : beginnerMode ? "watch closely" : "system waiting"}</small></div>{!beginnerMode && <div className={styles.signalLine}><span>latent signal</span><b>{result ? result.signal.toFixed(2) : "—"}</b><i><b style={{ width: `${result ? Math.min(100, Math.abs(result.signal) * 100) : 8}%` }} /></i></div>}</div><div className={styles.caveat}><CircleAlert className="size-3.5" /> {beginnerMode ? "This is a safe practice world, not a real forecast." : example.caveat}</div></div>

      <div className={styles.controlCard}><div className={styles.cardHeader}><div><span className={styles.sectionKicker}><Zap className="size-4" /> {beginnerMode ? "MAKE A GUESS" : "ACTIVE EXPERIMENT"}</span><h2>{beginnerMode ? "What do you think will happen?" : "Make the model commit"}</h2><p>{beginnerMode ? example.beginnerQuestion : example.question}</p></div></div><div className={styles.variableList}>{visibleVariables.map((variable) => <label key={variable.id}><span><b>{beginnerMode ? variable.beginnerLabel : variable.label}</b><small>{beginnerMode ? variable.meaning : variable.unit}</small></span><strong>{values[variable.id]}</strong><input aria-label={beginnerMode ? variable.beginnerLabel : `${variable.label} ${variable.unit}`} type="range" min={variable.min} max={variable.max} step={variable.step} value={values[variable.id] ?? variable.initial} onChange={(event) => { setValues((current) => ({ ...current, [variable.id]: Number(event.target.value) })); setResult(null); setShowWhy(false); }} /></label>)}</div>{beginnerMode && example.variables.length > 1 && <button type="button" className={styles.secondaryButton} onClick={() => setShowAdvancedControls((current) => !current)}>{showAdvancedControls ? "Hide extra controls" : "Show another thing to test"}</button>}<div className={styles.predictionBlock}><span>{beginnerMode ? "YOUR GUESS" : "YOUR PREDICTION"}</span><div className={styles.predictionOptions}>{example.options.map((option) => <button type="button" key={option.id} className={prediction === option.id ? styles.predictionSelected : ""} onClick={() => { setPrediction(option.id); setResult(null); setShowWhy(false); }}><b>{option.symbol}</b><span>{beginnerMode ? option.beginnerLabel : option.label}</span></button>)}</div></div><button type="button" className={styles.runButton} onClick={run}><Activity className="size-4" /> {result ? (beginnerMode ? "Try another setup" : "Run next test") : beginnerMode ? "See what happens" : "Run simulation"}</button></div></section>

    {result && <section className={`${styles.resultBanner} ${result.correct ? styles.resultGood : styles.resultBad}`}><div className={styles.resultMain}>{result.correct ? <Check className="size-5" /> : <CircleAlert className="size-5" />}<div><span>{beginnerMode ? (result.correct ? "YOUR GUESS MATCHED" : "THE WORLD SURPRISED YOU") : result.correct ? "PREDICTION CONFIRMED" : "PREDICTION ERROR"}</span><h2>{beginnerMode ? result.beginnerResult : result.outcomeLabel}</h2><p>{beginnerMode ? result.plainExplanation : result.explanation}</p><div className={styles.replay} key={replayKey}><div><b>1</b><span>{beginnerMode ? "What pushed it?" : "CAUSE"}<strong>{result.cause}</strong></span></div><ChevronRight className="size-4" /><div><b>2</b><span>{beginnerMode ? "What changed?" : "CHANGE"}<strong>{result.change}</strong></span></div><ChevronRight className="size-4" /><div><b>3</b><span>{beginnerMode ? "What did we see?" : "RESULT"}<strong>{beginnerMode ? result.beginnerResult : result.result}</strong></span></div></div><button type="button" className={styles.whyButton} onClick={() => setShowWhy((current) => !current)}>{showWhy ? "Hide the explanation" : "Why did this happen?"}</button>{showWhy && <div className={styles.whyPanel}><p>{beginnerMode ? example.whyItMatters : result.explanation}</p><strong>{beginnerMode ? "Try this next" : "Transfer challenge"}</strong><span>{example.transferPrompt}</span></div>}</div></div><div className={styles.mutation}><span>{beginnerMode ? "WHAT THE ENGINE DOES NEXT" : "ENGINE MUTATION"}</span><strong>{beginnerMode ? (result.correct ? "Make the next guess more interesting" : "Show a clearer contrast next time") : result.correct ? "Increase challenge" : "Add contrast + explanation"}</strong><small>{beginnerMode ? "Your attempt changes the next world." : `Generation G${String(state.generation).padStart(3, "0")} · ${state.explanationDepth} explanation layer${state.explanationDepth === 1 ? "" : "s"} queued`}</small></div></section>}

    <section className={styles.learningGrid}><article className={styles.card}><div className={styles.cardHeader}><div><span className={styles.sectionKicker}><Database className="size-4" /> {beginnerMode ? "WHAT STAYS THE SAME" : "SHARED MEANING BASIS"}</span><h2>{beginnerMode ? "The engine’s simple pattern" : "What transfers across domains"}</h2></div></div><div className={styles.primitiveCloud}>{(beginnerMode ? beginnerBasis : sharedPrimitives).map((primitive) => <span key={primitive}>{primitive}</span>)}</div><p className={styles.cardNote}>{beginnerMode ? "In every world, something changes because something else affects it. You guess the change, watch it happen, and use what you learned somewhere new." : "The engine does not memorize one gravity animation. It learns a reusable grammar: entities change state through relationships over time, and the learner tests a prediction against an observable result."}</p></article><article className={styles.card}><div className={styles.cardHeader}><div><span className={styles.sectionKicker}><Gauge className="size-4" /> {beginnerMode ? "HOW IT ADAPTS" : "EVOLUTION MEMORY"}</span><h2>{beginnerMode ? "Your guesses change the next test" : "What changed in the engine"}</h2></div></div><div className={styles.adaptationList}><div><span>{beginnerMode ? "After a surprise" : "Failure response"}</span><strong>{beginnerMode ? "show a clearer contrast" : state.explanationDepth ? "add contrast + replay" : "keep concise"}</strong></div><div><span>{beginnerMode ? "After a good guess" : "Challenge policy"}</span><strong>{beginnerMode ? "make it more interesting" : state.challenge < 3 ? "single-variable" : "coupled variables"}</strong></div><div><span>{beginnerMode ? "Next place to try" : "Transfer target"}</span><strong>{beginnerMode ? state.correctRuns > 2 ? "a new world" : "this world again" : state.correctRuns > 2 ? "new domain" : "same domain"}</strong></div></div><p className={styles.cardNote}>{beginnerMode ? "The engine remembers your attempts in this browser so it can choose a better next experience." : "Local memory persists between tests. Reset it to compare a fresh learner against an adapted engine."}</p></article></section>

    <section className={styles.history}><div className={styles.sectionHeader}><div><div className={styles.sectionKicker}><BrainCircuit className="size-4" /> {beginnerMode ? "YOUR ATTEMPTS" : "REPRODUCIBLE TELEMETRY"}</div><h2>{beginnerMode ? "What you have tried" : "Recent tests"}</h2></div><span>{state.runs.length} stored locally</span></div>{state.runs.length ? <div className={styles.historyRows}>{state.runs.slice(0, 8).map((run) => <div key={run.id}><span>G{String(run.generation).padStart(3, "0")}</span><b>{selfEvolvingExamples.find((item) => item.id === run.exampleId)?.title}</b><small>{beginnerMode ? run.correct ? "your idea matched" : "the world surprised you" : run.correct ? "confirmed" : "error captured"}</small><strong className={run.correct ? styles.textGood : styles.textBad}>{run.correct ? "✓" : "×"}</strong></div>)}</div> : <div className={styles.emptyState}>{beginnerMode ? "Make your first guess to begin." : "Run the first prediction to create an evolution record."}</div>}</section>
  </div>;
}
