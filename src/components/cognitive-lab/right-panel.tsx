import type { ReactNode } from "react";
import type { LabPanelTab } from "@/lib/cognitive-lab/types";
import styles from "./cognitive-engine-laboratory.module.css";

const tabs: Array<{ id: LabPanelTab; label: string; shortLabel: string }> = [{ id: "properties", label: "Properties", shortLabel: "Inspect" }, { id: "evaluation", label: "Evaluation", shortLabel: "Evidence" }, { id: "evolution", label: "Evolution", shortLabel: "Versions" }, { id: "history", label: "History", shortLabel: "Records" }, { id: "protocol", label: "Protocol", shortLabel: "Study" }, { id: "settings", label: "Settings", shortLabel: "Local" }];

type RightPanelProps = { activeTab: LabPanelTab; onTabChange: (tab: LabPanelTab) => void; candidateManager: ReactNode; panels: Record<LabPanelTab, ReactNode> };

export function RightPanel({ activeTab, onTabChange, candidateManager, panels }: RightPanelProps) {
  return <div className={styles.rightRail}><div>{candidateManager}</div><section className={styles.rightPanel} aria-label="Research panels"><nav className={styles.panelTabs} aria-label="Research panel tabs" role="tablist">{tabs.map((tab) => <button type="button" role="tab" key={tab.id} className={activeTab === tab.id ? styles.panelTabActive : ""} aria-selected={activeTab === tab.id} onClick={() => onTabChange(tab.id)}><span>{tab.label}</span><small>{tab.shortLabel}</small></button>)}</nav><div className={styles.panelContent}>{panels[activeTab]}</div></section></div>;
}
