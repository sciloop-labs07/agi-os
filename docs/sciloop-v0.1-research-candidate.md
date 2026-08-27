# SciLoop Version 0.1 Research Candidate

Status: frozen for experimentation

## Mission

SciLoop 0.1 is a stable laboratory for designing, executing, comparing, and evolving reasoning engines. It is not yet a product and does not claim to identify a universally best engine. Its immediate research value is making competing reasoning hypotheses visible, isolated, repeatable, and reviewable.

## Architecture Review

The Cognitive Engine Laboratory is organized around one `Experiment` containing one shared `Problem` and multiple isolated `Candidate` engines. Each candidate owns its graph, node metadata, connections, execution state, history, lineage, and evaluation history.

The UI is divided into the Node Library, Problem Workspace, Candidate Manager, research panels, and Experiment Console. The Protocol panel adds the standardized experimental lifecycle without changing the existing graph or execution model.

Core boundaries:

- `src/lib/cognitive-lab`: state, models, factories, persistence, execution, and evaluation contracts.
- `src/components/cognitive-lab`: focused laboratory regions and panels.
- `src/lib/experiments`: protocol metadata, notes, evidence reports, and experiment-library state.
- `src/lib/node-registry`: semantic node definitions and validation metadata.

State changes go through the cognitive-lab reducer. Candidate graph changes are isolated by candidate ID and recorded in candidate-specific history. Local persistence restores the experiment on the same device; no cloud synchronization is enabled.

## Data Model

The primary models are `Problem`, `Experiment`, `Candidate`, `CandidateGraph`, `Node`, `Connection`, `ExecutionState`, `ExperimentLogEntry`, `HistorySnapshot`, `ExperimentMetadata`, `ResearchNotes`, and `ProtocolReport`.

The protocol metadata records the shared problem, hypothesis, research goal, selected candidate IDs, status, timestamps, tags, and notebook fields. Reports retain structural evidence and metric observations without declaring a winning engine.

## Execution Flow

1. Select or create a candidate.
2. Add semantic nodes from the registry.
3. Connect the latest nodes and inspect validation warnings.
4. Freeze the candidate to create an experimental snapshot.
5. Run the candidate; the existing execution runner highlights nodes in sequence.
6. Review execution logs, evaluation estimates, and candidate history.
7. Duplicate a candidate before making a new generation.

Execution is intentionally a readable traversal animation, not a reasoning or AI runtime.

## Evaluation Flow

Evaluation currently reports structural estimates derived from the graph and execution context. These are scaffolding for future human-study measurements, not scientific conclusions. The protocol report groups those observations by candidate and metric, then preserves researcher notes, conclusions, and open questions.

## Evolution Flow

Evolution creates a new candidate from a parent through explicit mutation or replay actions. Frozen candidates remain unchanged. Lineage records generation, parent, branch, and mutation explanation so later experiments can compare versions without overwriting evidence.

## Extension Points

- Replace structural evaluation with validated human-study measurements.
- Add deterministic experiment runners and repeated-trial scheduling.
- Add persistent database storage behind the existing state boundary.
- Add exports for protocol metadata, graphs, logs, and reports.
- Add AI assistance only after a body of manually reviewed experiments exists.

## Usability Review

The first-use path communicates the central idea through the shared problem header, candidate isolation language, lifecycle strip, and candidate cards. Empty graphs explain how to begin. Freeze and run states are visible in both the workspace and candidate manager. The protocol panel makes candidate selection explicit and shows the current step.

The most important interaction feedback is present through freeze badges, run states, execution highlights, console logs, history records, and evidence reports. Semantic connection warnings are advisory rather than blocking.

The main remaining friction is that the problem is currently created from the experiment factory rather than edited through a dedicated problem form. This is acceptable for the frozen 0.1 research candidate and should be addressed only when problem authoring is part of a clearly defined study workflow.

## Technical Debt Report

### Strengths

- Candidate graphs are isolated and reducer-driven.
- Frozen snapshots and lineage preserve experimental integrity.
- Semantic node metadata is centralized in a registry.
- Protocol reports are evidence-first and do not hard-code a winner.
- Local persistence and hydration are separated to avoid server/client mismatch.

### Known limitations

- Persistence is local browser storage only.
- Evaluation values are structural placeholders, not validated learning outcomes.
- Execution is sequential animation without semantic reasoning.
- Protocol runs are researcher-coordinated rather than scheduled or randomized.
- The experiment library is local and currently scoped to the active persisted workspace.
- Report conclusions are researcher-entered and are not independently verified.

### Refactoring candidates

- Split the reducer cases into domain command modules if the action set grows substantially.
- Add schema validation and migrations before introducing durable storage.
- Extract shared form and status primitives if more panels adopt the protocol controls.
- Replace random client IDs with a centralized, testable ID provider.

### Performance risks

- Full-state local persistence runs after hydrated state changes.
- Large candidate sets will make the right rail and protocol candidate list dense.
- Graph rendering is currently DOM-based and should be profiled before thousands of visible nodes are used.

## Research Readiness Assessment

Version 0.1 is ready for internal experimentation with a small number of concepts. It supports isolated candidate construction, frozen snapshots, repeatable manual runs, structural comparison, evolution history, protocol notes, and evidence reports.

It is not ready to support claims about human understanding, cross-user learning effects, or general-purpose cognitive superiority. Those claims require a study design, participant data, validated measures, and controlled repeated trials.

## Recommended Experimental Plan

Become the first researcher. Use 3–10 candidate engines across a small concept set such as Gravity, Evolution, Binary Search, Thermodynamics, and Neural Networks.

For each concept:

1. State one specific hypothesis.
2. Build several meaningfully different engines.
3. Freeze every candidate before running it.
4. Run each candidate and record where understanding appears to increase or stall.
5. Complete the protocol notebook, especially actual outcome and future questions.
6. Duplicate promising candidates instead of editing frozen snapshots.
7. Repeat across domains and look for sequence patterns that persist.

The valuable output is a small set of reasoning patterns with consistent qualitative evidence, not a large graph collection.

## Version 0.2 Suggestions

Do not begin automatically. First synthesize the 20–30 manual studies and define what “better” means operationally. Then prioritize only the smallest improvements that the evidence supports: likely deterministic repeated trials, stronger study exports, problem authoring, and validated human-observation capture. AI integration and automatic optimization should remain deferred until the research protocol has produced trustworthy data.

