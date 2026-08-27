"use client";

import { Trash2 } from "lucide-react";
import type { CognitiveNode } from "@/lib/cognitive-lab/types";
import { nodeRegistry } from "@/lib/engine/node-registry";
import styles from "./cognitive-engine-laboratory.module.css";

type PropertiesPanelProps = { node?: CognitiveNode; frozen: boolean; onUpdate: (label: string) => void; onDelete: () => void };

export function PropertiesPanel({ node, frozen, onUpdate, onDelete }: PropertiesPanelProps) {
  return <aside className={styles.propertiesPanel} aria-label="Properties Panel">
    <div className={styles.regionHeading}><span>PROPERTIES PANEL</span><strong>Selected operation</strong></div>
    {!node ? <p className={styles.regionCopy}>Select a node in the problem workspace to inspect its semantic contract.</p> : <div className={styles.propertyBody}>{(() => { const semantic = nodeRegistry[node.metadata.nodeType]; return <>
      <div className={styles.inspectorTitle}><span style={{ color: semantic.accent }}>{semantic.icon}</span><div><strong>{semantic.displayName}</strong><small>{semantic.category} · {semantic.kind}</small></div></div>
      <label>Label<input value={node.label} disabled={frozen} onChange={(event) => onUpdate(event.target.value)} /></label>
      <section className={styles.inspectorSection}><b>Why this node exists</b><p>{semantic.purpose}</p></section>
      <section className={styles.inspectorSection}><b>Meaning</b><p>{semantic.description}</p></section>
      <div className={styles.propertyFacts}><span>Execution <b>{semantic.executionType}</b></span><span>Status <b>{node.executionState}</b></span><span>Inputs <b>{semantic.requiredInputs.join(", ") || "none"}</b></span><span>Produces <b>{semantic.producedOutputs.join(", ") || "none"}</b></span></div>
      <section className={styles.inspectorSection}><b>Typical use</b><p>{semantic.validation.length ? semantic.validation.join("; ") : "Use this operation when the graph needs this semantic role."}</p></section>
      <div className={styles.propertyFacts}><span>Previous <b>{semantic.validPreviousNodes.join(", ") || "root"}</b></span><span>Next <b>{semantic.validNextNodes.join(", ") || "terminal"}</b></span><span>Parameters <b>{semantic.properties.map((property) => property.label).join(", ")}</b></span></div>
      <section className={styles.inspectorSection}><b>Future AI hooks</b><p>Evidence, confidence, knowledge graph, and user telemetry are supported extension points.</p></section>
      <button type="button" className={styles.deleteNodeButton} disabled={frozen} onClick={onDelete}><Trash2 className="size-3.5" /> Delete node</button>
    </>; })()}</div>}
  </aside>;
}
