"use client";

import { useState } from "react";
import { ArrowDown, CheckCircle2, ChevronRight, Heart, Lightbulb, RotateCcw, Sparkles, Target, XCircle } from "lucide-react";
import styles from "./visual-engine-builder.module.css";

type Phase = "curiosity" | "prediction" | "simulation" | "transfer" | "mastery";

export function GeneratedLearningExperience() {
  const [phase, setPhase] = useState<Phase>("curiosity");
  const [prediction, setPrediction] = useState<"down" | "up" | null>(null);
  const [transfer, setTransfer] = useState<"same" | "different" | null>(null);
  const [score, setScore] = useState(0);
  const [celebration, setCelebration] = useState(false);

  const answer = (isCorrect: boolean, next: Phase) => {
    if (isCorrect) { setScore((value) => Math.min(100, value + 50)); setCelebration(true); window.setTimeout(() => setCelebration(false), 1400); }
    setPhase(next);
  };
  const reset = () => { setPhase("curiosity"); setPrediction(null); setTransfer(null); setScore(0); };

  return <section className={styles.experienceBlock} aria-label="Generated Gravity learning experience">
    <div className={styles.experienceHeader}><div><div className={styles.sectionKicker}><Sparkles className="size-4" /> GENERATED LEARNING EXPERIENCE / V1</div><h2>Gravity, felt before it is explained</h2><p>The promoted engine turns an unknown concept into a short prediction → simulation → discovery loop.</p></div><div className={styles.experienceScore}><span>understanding signal</span><strong>{score}%</strong></div></div>
    <div className={styles.experienceJourney}>{(["curiosity", "prediction", "simulation", "transfer", "mastery"] as Phase[]).map((item, index) => <div key={item} className={phase === item ? styles.experienceActive : ""}><i>{index + 1}</i><span>{item}</span>{index < 4 && <ChevronRight className="size-3" />}</div>)}</div>
    <div className={styles.experienceBody}>
      <div className={styles.gravityVisual}>
        <div className={styles.skyGlow} /><div className={`${styles.gravityObject} ${phase === "simulation" || phase === "transfer" || phase === "mastery" ? styles.falling : ""}`}><span>apple</span></div><div className={styles.forceArrow}><ArrowDown className="size-5" /><span>pull toward Earth</span></div><div className={styles.earth}><div /><span>Earth</span></div>
        {phase !== "curiosity" && <div className={styles.motionTrace}><i /><i /><i /></div>}
      </div>
      <div className={styles.experiencePrompt}>
        <div className={styles.promptKicker}>{phase === "curiosity" ? <Heart className="size-4" /> : phase === "mastery" ? <CheckCircle2 className="size-4" /> : <Target className="size-4" />} {phase.toUpperCase()}</div>
        {phase === "curiosity" && <><h3>Something is holding everything down.</h3><p>Look at the apple. Before we explain anything, make a guess about what will happen when it is released.</p><button type="button" className={styles.experiencePrimary} onClick={() => setPhase("prediction")}>Make a prediction <ChevronRight className="size-4" /></button></>}
        {phase === "prediction" && <><h3>Which way will the apple move?</h3><p>Your prediction becomes a testable idea. Choose one.</p><div className={styles.answerGrid}><button type="button" onClick={() => { setPrediction("down"); answer(true, "simulation"); }}><ArrowDown className="size-5" /> Down</button><button type="button" onClick={() => { setPrediction("up"); answer(false, "simulation"); }}><ArrowDown className="size-5 rotate-180" /> Up</button></div><small>There is no penalty for being wrong. A mismatch is useful evidence.</small></>}
        {phase === "simulation" && <><h3>{prediction === "down" ? "Your prediction matches the evidence." : "The evidence surprised your prediction."}</h3><p>Release it again and watch the motion. Earth pulls objects toward its center. That pull is gravity.</p><div className={styles.explanation}><Lightbulb className="size-4" /><span><b>Discovery:</b> gravity is a force that changes motion toward Earth.</span></div><button type="button" className={styles.experiencePrimary} onClick={() => setPhase("transfer")}>Try a new situation <ChevronRight className="size-4" /></button></>}
        {phase === "transfer" && <><h3>Now test your new model.</h3><p>Imagine a heavy ball and a light ball. What direction does gravity pull both objects?</p><div className={styles.answerGrid}><button type="button" onClick={() => { setTransfer("same"); answer(true, "mastery"); }}><ArrowDown className="size-5" /> Toward Earth</button><button type="button" onClick={() => { setTransfer("different"); answer(false, "mastery"); }}><XCircle className="size-5" /> Different directions</button></div><small>Transfer means using the idea somewhere new.</small></>}
        {phase === "mastery" && <><h3>{transfer === "same" ? "You transferred the idea." : "Good attempt. The visual rule stays stable."}</h3><p>Mass can change how an object behaves, but the direction of gravity stays toward Earth. You have a working mental model.</p><div className={styles.masteryBadge}><CheckCircle2 className="size-5" /><span><b>Mastery signal earned</b><small>Predict → observe → explain → transfer</small></span></div><button type="button" className={styles.secondary} onClick={reset}><RotateCcw className="size-4" /> Run again</button></>}
        {celebration && <div className={styles.celebration}><Sparkles className="size-4" /> Correct prediction. Your model is getting stronger.</div>}
      </div>
    </div>
    <div className={styles.experienceFooter}><span><i className={styles.footerDot} /> visual language active</span><span>Object · Motion · Force · Context · Interaction</span><span>no prior knowledge required</span></div>
  </section>;
}
