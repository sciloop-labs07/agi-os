"use client";

import { TerminalSquare } from "lucide-react";
import type { ExperimentLogEntry } from "@/lib/cognitive-lab/types";
import styles from "./cognitive-engine-laboratory.module.css";

export function ExperimentConsole({ entries }: { entries: ExperimentLogEntry[] }) {
  return <section className={styles.experimentConsole} aria-label="Experiment Console"><header><div className={styles.regionHeading}><span>EXPERIMENT CONSOLE</span><strong><TerminalSquare className="size-3.5" /> Execution trace</strong></div><span>{entries.length} events</span></header><div className={styles.consoleBody}>{entries.length ? entries.map((entry) => <div key={entry.id}><time>{new Date(entry.timestamp).toLocaleTimeString()}</time><i>{entry.type.replaceAll("_", " ")}</i><span>{entry.message}</span></div>) : <p>Run a candidate to record its execution trace.</p>}</div></section>;
}
