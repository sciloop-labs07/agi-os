"use client";

import { GitBranch, Link2, Lock, MousePointer2, Redo2, Undo2 } from "lucide-react";
import type { Candidate, CognitiveNodeExecutionState, Problem } from "@/lib/cognitive-lab/types";
import { nodeRegistry } from "@/lib/engine/node-registry";
import styles from "./cognitive-engine-laboratory.module.css";
import { GravitySimulation } from "./gravity-simulation";

type ProblemWorkspaceProps = { problem: Problem; candidate: Candidate; execution: Record<string, CognitiveNodeExecutionState>; selectedNodeId?: string; canUndo: boolean; canRedo: boolean; onSelectNode: (nodeId: string) => void; onConnectLastNodes: () => void; onUndo: () => void; onRedo: () => void };

export function ProblemWorkspace({ problem, candidate, execution, selectedNodeId, canUndo, canRedo, onSelectNode, onConnectLastNodes, onUndo, onRedo }: ProblemWorkspaceProps) {
  const canConnect = candidate.freezeState === "editable" && candidate.graph.nodes.length > 1;
  return <main className={styles.problemWorkspace} aria-label="Problem Workspace">
    <header className={styles.workspaceHeader}><div><div className={styles.regionHeading}><span>PROBLEM WORKSPACE</span><strong>{candidate.name}</strong></div><p>One problem, many isolated reasoning-engine hypotheses.</p></div><div className={styles.workspaceActions}><span className={candidate.freezeState === "frozen" ? styles.frozenBadge : styles.editableBadge}>{candidate.freezeState === "frozen" ? <Lock className="size-3.5" /> : <MousePointer2 className="size-3.5" />}{candidate.freezeState}</span><button type="button" onClick={onUndo} disabled={!canUndo}><Undo2 className="size-3.5" /> Undo</button><button type="button" onClick={onRedo} disabled={!canRedo}><Redo2 className="size-3.5" /> Redo</button><button type="button" onClick={onConnectLastNodes} disabled={!canConnect}><Link2 className="size-3.5" /> Connect last two</button></div></header>
    <section className={styles.problemRoot}><span>EXPERIMENTAL PROBLEM</span><h2>{problem.title}</h2><p>{problem.description}</p></section>
    <GravitySimulation enabled={problem.title.toLowerCase() === "gravity"} />
    <section className={styles.graphSurface} aria-label={`${candidate.name} graph`}>
      <div className={styles.graphLegend}><span><GitBranch className="size-3.5" /> Candidate graph is isolated</span><span>{candidate.graph.metadata.nodeCount} nodes · {candidate.graph.metadata.connectionCount} connections</span></div>
      {!candidate.graph.nodes.length && <div className={styles.emptyGraph}><strong>Start with one reasoning operation.</strong><span>Add a node from the Node Library. This graph belongs only to {candidate.name}.</span></div>}
      <div className={styles.graphNodes}>{candidate.graph.nodes.map((node, index) => <button type="button" key={node.id} title={`Inspect ${node.label} semantic contract`} onClick={() => onSelectNode(node.id)} className={`${styles.graphNode} ${selectedNodeId === node.id ? styles.nodeSelected : ""} ${execution[node.id] === "completed" ? styles.nodeCompleted : ""}`} style={{ "--node-color": nodeRegistry[node.metadata.nodeType].visualStyle.accent, "--node-order": index } as React.CSSProperties}><span>{String(index + 1).padStart(2, "0")}</span><b>{node.label}</b><small>{execution[node.id] ?? "waiting"} · {node.metadata.kind}</small></button>)}</div>
      {candidate.graph.connections.length > 0 && <div className={styles.connectionList}>{candidate.graph.connections.map((connection) => <span key={connection.id} className={connection.validation?.severity === "warning" ? styles.connectionWarning : ""} title={connection.validation?.message}>→ {connection.label}{connection.validation?.severity === "warning" ? " · review" : ""}</span>)}</div>}
    </section>
  </main>;
}
