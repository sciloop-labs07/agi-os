"use client";

import { useCallback, useEffect, useRef, type Dispatch } from "react";
import { buildExecutionTrace, createExperimentLog } from "@/lib/cognitive-lab/execution";
import type { LabAction } from "@/lib/cognitive-lab/lab-state";
import type { Candidate } from "@/lib/cognitive-lab/types";

export function useCandidateExecution(dispatch: Dispatch<LabAction>) {
  const timers = useRef<number[]>([]);
  useEffect(() => () => { timers.current.forEach((timer) => window.clearTimeout(timer)); }, []);
  const run = useCallback((candidate: Candidate) => {
    if (candidate.runState === "running") return;
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    dispatch({ type: "start_run", candidateId: candidate.id });
    dispatch({ type: "append_log", entry: createExperimentLog(candidate, "candidate_started") });
    const trace = buildExecutionTrace(candidate);
    trace.forEach((step) => {
      const node = candidate.graph.nodes.find((item) => item.id === step.nodeId);
      timers.current.push(window.setTimeout(() => {
        dispatch({ type: "complete_node", candidateId: candidate.id, nodeId: step.nodeId });
        dispatch({ type: "append_log", entry: createExperimentLog(candidate, "node_executed", node?.label) });
      }, step.delayMs));
    });
    timers.current.push(window.setTimeout(() => {
      dispatch({ type: "finish_run", candidateId: candidate.id });
      dispatch({ type: "append_log", entry: createExperimentLog(candidate, "candidate_finished") });
    }, trace.at(-1)?.delayMs ?? 0));
  }, [dispatch]);
  return { run };
}
