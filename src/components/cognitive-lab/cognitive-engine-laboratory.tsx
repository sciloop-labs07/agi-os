"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { FlaskConical } from "lucide-react";
import { evaluateCandidate } from "@/lib/evaluation";
import type { MutationType } from "@/lib/evolution/types";
import { createExperimentLog } from "@/lib/cognitive-lab/execution";
import { cognitiveLabReducer, createInitialCognitiveLabState } from "@/lib/cognitive-lab/lab-state";
import type { Candidate, ImportedFlowConnection, ImportedFlowNode } from "@/lib/cognitive-lab/types";
import { useCandidateExecution } from "@/hooks/use-candidate-execution";
import { loadCognitiveLabState, saveCognitiveLabState } from "@/lib/cognitive-lab/persistence";
import { CandidateManager } from "./candidate-manager";
import { ExperimentConsole } from "./experiment-console";
import { NodeLibrary } from "./node-library";
import { ProblemWorkspace } from "./problem-workspace";
import { PropertiesPanel } from "./properties-panel";
import { EvaluationPanel } from "./evaluation-panel";
import { EvolutionPanel } from "./evolution-panel";
import { HistoryPanel } from "./history-panel";
import { RightPanel } from "./right-panel";
import { SettingsPanel } from "./settings-panel";
import { ProtocolPanel } from "./protocol-panel";
import { buildProtocolReport } from "@/lib/experiments/reports";
import styles from "./cognitive-engine-laboratory.module.css";

export function CognitiveEngineLaboratory() {
  const [state, dispatch] = useReducer(cognitiveLabReducer, undefined, createInitialCognitiveLabState);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    dispatch({ type: "hydrate", state: loadCognitiveLabState() });
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    const importTarget = state.experiment.candidates.find((candidate) => candidate.id === state.activeCandidateId);
    if (!importTarget || importTarget.freezeState === "frozen") return;
    const raw = localStorage.getItem("sciloop-candidate-flow-transfer");
    if (!raw) return;
    try {
      const transfer = JSON.parse(raw) as { version?: number; nodes?: ImportedFlowNode[]; connections?: ImportedFlowConnection[] };
      if (transfer.version !== 1 || !Array.isArray(transfer.nodes) || !Array.isArray(transfer.connections) || !transfer.nodes.length) return;
      dispatch({ type: "import_flow", candidateId: state.activeCandidateId, nodes: transfer.nodes, connections: transfer.connections });
      localStorage.removeItem("sciloop-candidate-flow-transfer");
    } catch {
      localStorage.removeItem("sciloop-candidate-flow-transfer");
    }
  }, [hydrated, state.activeCandidateId, state.experiment.candidates]);
  useEffect(() => { if (hydrated) saveCognitiveLabState(state); }, [hydrated, state]);
  const activeCandidate = useMemo(() => state.experiment.candidates.find((candidate) => candidate.id === state.activeCandidateId) ?? state.experiment.candidates[0], [state.activeCandidateId, state.experiment.candidates]);
  const { run } = useCandidateExecution(dispatch);
  const currentEvaluations = useMemo(() => state.experiment.candidates.map((candidate) => evaluateCandidate(candidate, state.experiment.candidates)), [state.experiment.candidates]);
  if (!activeCandidate) return null;
  const selectedNode = activeCandidate.graph.nodes.find((node) => node.id === state.selectedNodeId);
  const candidateHistory = state.history[activeCandidate.id];
  const currentEvaluation = currentEvaluations.find((evaluation) => evaluation.candidateId === activeCandidate.id) ?? evaluateCandidate(activeCandidate, state.experiment.candidates);
  const protocolCandidates = state.experiment.candidates.filter((candidate) => state.protocol.metadata.candidateIds.includes(candidate.id));
  const generateProtocolReport = () => {
    const evidence = protocolCandidates.map((candidate) => ({ candidateId: candidate.id, candidateName: candidate.name, evaluation: currentEvaluations.find((evaluation) => evaluation.candidateId === candidate.id) ?? evaluateCandidate(candidate, state.experiment.candidates) }));
    const notes = state.protocol.metadata.researcherNotes;
    dispatch({ type: "save_protocol_report", report: buildProtocolReport(state.protocol.metadata, protocolCandidates, evidence, notes, notes.actualOutcome, notes.futureQuestions) });
  };
  const updateCandidate = (candidate: Candidate) => dispatch({ type: "update_candidate", candidateId: candidate.id, changes: { name: candidate.name, description: candidate.description, color: candidate.color } });
  const toggleFreeze = (candidate: Candidate) => {
    dispatch({ type: "toggle_freeze", candidateId: candidate.id });
    if (candidate.freezeState === "editable") dispatch({ type: "append_log", entry: createExperimentLog(candidate, "candidate_frozen") });
  };
  return <div className={styles.lab}>
    <header className={styles.labHeader}><div><div className={styles.kicker}><FlaskConical className="size-4" /> SCILOOP / EXPERIMENTAL COGNITIVE ENGINE LABORATORY</div><h1>Cognitive Engine Laboratory</h1><p>Construct competing reasoning engines against one shared problem. Preserve snapshots. Observe execution.</p></div><div className={styles.labMeta}><span>PHASE 1</span><b>{state.experiment.candidates.length} candidates</b></div></header>
    <div className={styles.labFlow} aria-label="Experiment workflow"><span className={styles.flowActive}>1 <b>Problem</b><small>{state.experiment.problem.title}</small></span><i>→</i><span>2 <b>Candidate engines</b><small>Build alternatives</small></span><i>→</i><span>3 <b>Evaluation</b><small>Inspect evidence</small></span><i>→</i><span>4 <b>Evolution</b><small>Preserve versions</small></span></div>
    <div className={styles.labGrid}>
      <NodeLibrary disabled={activeCandidate.freezeState === "frozen"} onAddNode={(nodeType) => dispatch({ type: "add_node", candidateId: activeCandidate.id, nodeType })} />
      <ProblemWorkspace problem={state.experiment.problem} candidate={activeCandidate} execution={state.execution[activeCandidate.id] ?? {}} selectedNodeId={state.selectedNodeId} canUndo={Boolean(candidateHistory?.past.length) && activeCandidate.freezeState !== "frozen"} canRedo={Boolean(candidateHistory?.future.length) && activeCandidate.freezeState !== "frozen"} onSelectNode={(nodeId) => dispatch({ type: "select_node", nodeId })} onUndo={() => dispatch({ type: "undo", candidateId: activeCandidate.id })} onRedo={() => dispatch({ type: "redo", candidateId: activeCandidate.id })} onConnectLastNodes={() => dispatch({ type: "connect_last_nodes", candidateId: activeCandidate.id })} />
      <RightPanel activeTab={state.ui.activePanel} onTabChange={(activePanel) => dispatch({ type: "set_ui", changes: { activePanel } })} candidateManager={<CandidateManager candidates={state.experiment.candidates} activeCandidateId={activeCandidate.id} onSelect={(candidateId) => dispatch({ type: "select_candidate", candidateId })} onCreate={() => dispatch({ type: "create_candidate" })} onDuplicate={(candidateId) => dispatch({ type: "duplicate_candidate", candidateId })} onDelete={(candidateId) => dispatch({ type: "delete_candidate", candidateId })} onUpdate={updateCandidate} onToggleFreeze={toggleFreeze} onRun={run} />} panels={{ properties: <PropertiesPanel node={selectedNode} frozen={activeCandidate.freezeState === "frozen"} onUpdate={(label) => selectedNode && dispatch({ type: "update_node", candidateId: activeCandidate.id, nodeId: selectedNode.id, label })} onDelete={() => selectedNode && dispatch({ type: "delete_node", candidateId: activeCandidate.id, nodeId: selectedNode.id })} />, evaluation: <EvaluationPanel problemTitle={state.experiment.problem.title} candidates={state.experiment.candidates} evaluation={currentEvaluation} evaluations={currentEvaluations} history={state.evaluationHistory[activeCandidate.id]} />, evolution: <EvolutionPanel candidates={state.experiment.candidates} activeCandidate={activeCandidate} events={state.evolution.events} onMutate={(mutationType: MutationType) => dispatch({ type: "evolve_candidate", candidateId: activeCandidate.id, mutationType, parameters: { seed: Date.now() } })} onRestore={(sourceCandidateId) => dispatch({ type: "restore_candidate", sourceCandidateId, targetCandidateId: activeCandidate.id })} onSetStatus={(eventId, status) => dispatch({ type: "set_evolution_status", eventId, status })} />, history: <HistoryPanel candidate={activeCandidate} evaluationHistory={state.evaluationHistory[activeCandidate.id]} events={state.evolution.events} />, protocol: <ProtocolPanel protocol={state.protocol} candidates={state.experiment.candidates} onMetadata={(changes) => dispatch({ type: "update_protocol_metadata", changes })} onCandidates={(candidateIds) => dispatch({ type: "set_protocol_candidates", candidateIds })} onStep={(step) => dispatch({ type: "set_protocol_step", step })} onStatus={(status) => dispatch({ type: "set_protocol_status", status })} onNotes={(changes) => dispatch({ type: "update_protocol_notes", changes })} onFreeze={toggleFreeze} onRun={run} onReport={generateProtocolReport} onNextCandidate={() => dispatch({ type: "duplicate_candidate", candidateId: activeCandidate.id })} />, settings: <SettingsPanel /> }} />
      <ExperimentConsole entries={state.console} />
    </div>
  </div>;
}
