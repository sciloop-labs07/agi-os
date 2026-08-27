import { Database, LayoutPanelTop } from "lucide-react";
import styles from "./cognitive-engine-laboratory.module.css";

export function SettingsPanel() {
  return <section className={styles.settingsPanel} aria-label="Settings Panel"><div className={styles.regionHeading}><span>SETTINGS</span><strong><LayoutPanelTop className="size-3.5" /> Workspace preferences</strong></div><div className={styles.settingsItem}><Database className="size-4" /><div><b>Local experiment memory</b><p>Experiments, selected candidate, active panel, and future viewport state are restored on this device.</p><small>Cloud sync is intentionally not enabled.</small></div></div><div className={styles.settingsItem}><div className={styles.settingsSwatches}><i className={styles.swatchReality} /><i className={styles.swatchReasoning} /><i className={styles.swatchValidation} /><i className={styles.swatchKnowledge} /></div><div><b>Semantic color language</b><p>Blue represents reality, purple reasoning, orange validation, and green knowledge.</p></div></div></section>;
}
