"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, BrainCircuit, CheckCircle2, ChevronDown, Play, ShieldCheck, Sparkles, Timer, X } from "lucide-react";
import type { SciLoopEdge, SciLoopNode } from "@/lib/sciloop-flow";
import { analyzeReasoningGraph } from "@/lib/engine/graph-analytics";
import { createExecutionPlan } from "@/lib/engine/execution-engine";
import { nodeRegistryGroups } from "@/lib/engine/node-registry";
import { validateReasoningGraph } from "@/lib/engine/semantic-validation";
import styles from "./sciloop-flow-designer.module.css";
import { AgiOsControlPlane } from "./agi-os-control-plane";

type ReasoningEnginePanelProps = { nodes: SciLoopNode[]; edges: SciLoopEdge[]; onAddNode: (type: SciLoopNode["data"]["nodeType"]) => void; onClose: () => void };

export function ReasoningEnginePanel({ nodes, edges, onAddNode, onClose }: ReasoningEnginePanelProps) {
  const [openCategory, setOpenCategory] = useState<string>("Reality");
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [executed, setExecuted] = useState<string[]>([]);
  const analytics = useMemo(() => analyzeReasoningGraph(nodes, edges), [nodes, edges]);
  const issues = useMemo(() => validateReasoningGraph(nodes, edges), [nodes, edges]);
  const plan = useMemo(() => createExecutionPlan(nodes, edges), [nodes, edges]);
  const startExecution = () => {
    if (running) return;
    setRunning(true); setExecuted([]);
    plan.forEach((frame, index) => window.setTimeout(() => { setExecuted((current) => [...current, frame.nodeId]); if (index === plan.length - 1) setRunning(false); }, index * (340 / speed)));
  };
  return <section className={styles.reasoningPanel} aria-label="Universal reasoning engine">
    <header className={styles.reasoningHeader}><div><div className={styles.kicker}><BrainCircuit className="size-4" /> UNIVERSAL REASONING OPERATING SYSTEM</div><h2>Reasoning Engine</h2><p>Every node is a cognitive operation. Every connection is a semantic claim.</p></div><div className={styles.reasoningActions}><button type="button" className={styles.executionButton} onClick={startExecution} disabled={running}><Play className="size-4" /> {running ? "Executing..." : "Execute graph"}</button><button type="button" className={styles.closeReasoningButton} aria-label="Close reasoning engine" onClick={onClose}><X className="size-4" /></button></div></header>
    <div className={styles.reasoningToolbar}><span className={styles.reasoningBadge}><Sparkles className="size-3.5" /> plugin registry active</span><label><Timer className="size-3.5" /> execution speed <input type="range" min=".35" max="2" step=".05" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} /></label></div>
    <AgiOsControlPlane analytics={analytics} issueCount={issues.length} planLength={plan.length} />
    <div className={styles.analyticsStrip}>{[["Nodes", analytics.nodes], ["Connections", analytics.connections], ["Cycles", analytics.cycles], ["Depth", analytics.reasoningDepth], ["Complexity", analytics.complexity], ["Knowledge", `${analytics.knowledgeScore}%`], ["Validation", `${analytics.validationCoverage}%`], ["Unknowns", analytics.unknowns]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
    <div className={styles.reasoningGrid}><aside className={styles.registryPanel}><div className={styles.panelHeading}><span>NODE REGISTRY</span><strong>Metadata-driven toolbox</strong></div>{nodeRegistryGroups.map((group) => <div key={group.label} className={styles.registryGroup}><button type="button" onClick={() => setOpenCategory(openCategory === group.label ? "" : group.label)}><span>{group.label}</span><ChevronDown className={`size-3 ${openCategory === group.label ? "rotate-180" : ""}`} /></button>{openCategory === group.label && <div>{group.nodeTypes.map((type) => <button key={type} type="button" onClick={() => onAddNode(type)}><i style={{ background: "var(--node-accent)" }} />{type}<small>{type === "Unknown" ? "gap" : "operation"}</small></button>)}</div>}</div>)}</aside><div className={styles.executionTimeline}><div className={styles.panelHeading}><span>VISUAL EXECUTION</span><strong>{executed.length ? `${executed.length} / ${plan.length} operations` : "Waiting"}</strong></div><div className={styles.timelineList}>{plan.map((frame) => <div key={frame.nodeId} className={executed.includes(frame.nodeId) ? styles.timelineCompleted : ""}><i>{executed.includes(frame.nodeId) ? "✓" : frame.order + 1}</i><span>{nodes.find((node) => node.id === frame.nodeId)?.data.label ?? frame.nodeId}</span><small>{executed.includes(frame.nodeId) ? "completed" : "waiting"}</small></div>)}</div></div><aside className={styles.validationPanel}><div className={styles.panelHeading}><span>AI ASSISTANT</span><strong>Suggestions only</strong></div><div className={styles.validationSummary}><ShieldCheck className="size-4" /><span>{issues.length ? `${issues.length} reasoning suggestions` : "Graph is semantically strong"}</span></div>{issues.slice(0, 6).map((issue) => <div key={issue.id} className={styles.validationIssue}><AlertTriangle className="size-3.5" /><span>{issue.message}</span></div>)}{!issues.length && <div className={styles.validationIssue}><CheckCircle2 className="size-3.5" /><span>No dead ends or missing validation detected.</span></div>}</aside></div>
  </section>;
}
