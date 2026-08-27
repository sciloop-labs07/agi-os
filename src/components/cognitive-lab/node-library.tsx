"use client";

import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { nodeRegistry, nodeRegistryGroups, type ReasoningNodeType } from "@/lib/engine/node-registry";
import styles from "./cognitive-engine-laboratory.module.css";

type NodeLibraryProps = { disabled: boolean; onAddNode: (nodeType: ReasoningNodeType) => void };

export function NodeLibrary({ disabled, onAddNode }: NodeLibraryProps) {
  const [openCategory, setOpenCategory] = useState("Reality");
  return <aside className={styles.nodeLibrary} aria-label="Node Library">
    <div className={styles.regionHeading}><span>NODE LIBRARY</span><strong>Reasoning operations</strong></div>
    <p className={styles.regionCopy}>Add only operations that make the candidate&apos;s reasoning clearer.</p>
    <div className={styles.libraryGroups}>{nodeRegistryGroups.map((group) => <section key={group.label} className={styles.libraryGroup}><button type="button" onClick={() => setOpenCategory((current) => current === group.label ? "" : group.label)} aria-expanded={openCategory === group.label}><span>{group.label}</span><ChevronDown className={`size-3.5 ${openCategory === group.label ? "rotate-180" : ""}`} /></button>{openCategory === group.label && <div>{group.nodeTypes.map((nodeType) => { const node = nodeRegistry[nodeType]; return <button key={nodeType} type="button" className={styles.libraryNode} disabled={disabled} onClick={() => onAddNode(nodeType)}><i style={{ background: node.accent }} /><span><b>{node.displayName}</b><small>{node.description}</small></span><Plus className="size-3.5" /></button>; })}</div>}</section>)}</div>
  </aside>;
}
