"use client";

import { useMemo, useState } from "react";
import { Check, Database, Gauge, LockKeyhole, Search, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import type { GraphAnalytics } from "@/lib/engine/graph-analytics";
import styles from "./sciloop-flow-designer.module.css";

type AgiOsControlPlaneProps = { analytics: GraphAnalytics; issueCount: number; planLength: number };
const phases = [
  { id: "sense", label: "Sense", detail: "ground in evidence" },
  { id: "plan", label: "Plan", detail: "decompose the goal" },
  { id: "act", label: "Act", detail: "use bounded tools" },
  { id: "verify", label: "Verify", detail: "test before trust" },
] as const;
const toolDefaults = [
  { id: "evidence", label: "Evidence retrieval", icon: Search, enabled: true },
  { id: "simulation", label: "SciLoop simulation", icon: Sparkles, enabled: true },
  { id: "memory", label: "Working memory", icon: Database, enabled: true },
  { id: "external", label: "External actions", icon: Wrench, enabled: false },
];

export function AgiOsControlPlane({ analytics, issueCount, planLength }: AgiOsControlPlaneProps) {
  const [phase, setPhase] = useState<(typeof phases)[number]["id"]>("sense");
  const [autonomy, setAutonomy] = useState(2);
  const [tools, setTools] = useState(toolDefaults);
  const [humanGate, setHumanGate] = useState(true);
  const readiness = useMemo(() => {
    const penalty = issueCount === 0 ? 22 : Math.max(0, 22 - issueCount * 3);
    return Math.max(0, Math.min(100, Math.round(analytics.validationCoverage * 0.48 + analytics.knowledgeScore * 0.26 + penalty)));
  }, [analytics.knowledgeScore, analytics.validationCoverage, issueCount]);
  const estimatedBudget = (0.9 + autonomy * 0.55 + (tools.filter((tool) => tool.enabled).length - 2) * 0.25).toFixed(1);
  const toggleTool = (id: string) => setTools((current) => current.map((tool) => tool.id === id ? { ...tool, enabled: !tool.enabled } : tool));

  return <section className={styles.agiOsPlane} aria-label="SciLoop AGI OS control plane">
    <div className={styles.agiOsHeader}><div><div className={styles.panelHeadingInline}><span><Sparkles className="size-3.5" /> AGI-OS CONTROL PLANE</span><strong>bounded autonomy / evidence-first</strong></div><h3>Make the reasoning loop executable</h3><p>Model + tools + memory + verification, kept visible so SciLoop can improve without becoming a black box.</p></div><div className={styles.agiReadiness}><span>LOOP READINESS</span><strong>{readiness}%</strong><i><b style={{ width: `${readiness}%` }} /></i></div></div>
    <div className={styles.agiPhaseRail} role="tablist" aria-label="AGI OS phases">{phases.map((item) => <button key={item.id} type="button" role="tab" aria-selected={phase === item.id} onClick={() => setPhase(item.id)}><span>{item.label}</span><small>{item.detail}</small></button>)}</div>
    <div className={styles.agiOsGrid}>
      <div className={styles.agiMemoryCard}><div className={styles.panelHeadingInline}><span><Database className="size-3.5" /> MEMORY STATE</span><strong>short-term context</strong></div><div className={styles.memoryStack}><div><b>Goal</b><span>understand and transfer</span></div><div><b>Graph</b><span>{analytics.nodes} operations / {planLength} planned</span></div><div><b>Open gaps</b><span>{analytics.unknowns ? `${analytics.unknowns} unknowns` : "none detected"}</span></div></div><p className={styles.agiHint}>Long-term memory should be earned from verified observations, not copied from model guesses.</p></div>
      <div className={styles.agiToolsCard}><div className={styles.panelHeadingInline}><span><Wrench className="size-3.5" /> APPROVED TOOLS</span><strong>least privilege</strong></div><div className={styles.toolToggleList}>{tools.map((tool) => { const Icon = tool.icon; return <button key={tool.id} type="button" aria-pressed={tool.enabled} onClick={() => toggleTool(tool.id)}><Icon className="size-3.5" /><span>{tool.label}</span><i>{tool.enabled ? <Check className="size-3" /> : "off"}</i></button>; })}</div></div>
      <div className={styles.agiGuardrailCard}><div className={styles.panelHeadingInline}><span><ShieldCheck className="size-3.5" /> SAFETY + EVALS</span><strong>before publish</strong></div><div className={styles.guardrailRow}><LockKeyhole className="size-3.5" /><span>Human approval for external actions</span><button type="button" aria-pressed={humanGate} onClick={() => setHumanGate((current) => !current)}>{humanGate ? "ON" : "OFF"}</button></div><div className={styles.guardrailRow}><Gauge className="size-3.5" /><span>Reasoning budget</span><input aria-label="Reasoning budget" type="range" min="1" max="4" step="1" value={autonomy} onChange={(event) => setAutonomy(Number(event.target.value))} /><b>{estimatedBudget}s</b></div><div className={styles.evalChips}><span>faithfulness</span><span>tool success</span><span>cost / outcome</span></div></div>
    </div>
    <div className={styles.agiStatusLine}><span className={styles.liveDot} /> Active phase: <strong>{phases.find((item) => item.id === phase)?.label}</strong><span className={styles.agiStatusDivider} /> {humanGate ? "Human gate armed" : "Autonomy only"}<span className={styles.agiStatusDivider} /> {tools.filter((tool) => tool.enabled).length} tools available</div>
  </section>;
}
