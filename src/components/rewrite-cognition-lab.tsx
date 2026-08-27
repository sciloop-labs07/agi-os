"use client";

import { Activity, BrainCircuit, GitBranch, Pause, Play, RotateCcw, ShieldAlert, StepForward } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { createInitialRewriteCognitionState, runRewriteCognitionTick, type RewriteCognitionState } from "@/math-ai/simulation/rewriteCognitionLoop";
import type { RewriteRule, TheoremNode } from "@/math-ai/types";

const DESIGN_LAW =
  "Mathematical intelligence emerges when symbolic structures recursively rewrite themselves under proof, stability, and abstraction constraints.";

export function RewriteCognitionLab() {
  const [state, setState] = useState<RewriteCognitionState>(() => createInitialRewriteCognitionState());
  const [selectedNodeId, setSelectedNodeId] = useState("thm-double-negation");
  const [running, setRunning] = useState(false);
  const [busy, setBusy] = useState(false);

  const selectedNode = state.graph.nodes.find((node) => node.id === selectedNodeId) ?? state.latest?.activeTheorem ?? state.graph.nodes[0];
  const graphLayout = useMemo(() => buildGraphLayout(state), [state]);

  async function stepOnce() {
    if (busy) return;
    setBusy(true);
    const result = await runRewriteCognitionTick(state);
    setState(result.newState);
    setSelectedNodeId(result.newState.latest?.activeTheorem?.id ?? selectedNodeId);
    setBusy(false);
  }

  function reset() {
    const initial = createInitialRewriteCognitionState();
    setState(initial);
    setSelectedNodeId("thm-double-negation");
    setRunning(false);
  }

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      void runRewriteCognitionTick(state).then((result) => {
        setState(result.newState);
        setSelectedNodeId(result.newState.latest?.activeTheorem?.id ?? "thm-double-negation");
      });
    }, 1600);
    return () => window.clearInterval(timer);
  }, [running, state]);

  return (
    <div className="rounded-lg border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(72,229,255,0.14),transparent_35%),linear-gradient(180deg,rgba(7,12,22,0.95),rgba(10,14,24,0.98))] p-4 shadow-glow md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md border border-cyan-signal/30 bg-cyan-signal/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-signal">
              Rewrite Cognition Lab
            </span>
            <span className="rounded-md border border-amber-300/30 bg-amber-300/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-200">
              browser demo / unverified
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">Recursive Mathematical Rewrite Cognition Engine</h2>
          <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300">
            {DESIGN_LAW} Expressions rewrite, theorems rewrite, proof paths rewrite, theorem graphs rewrite, rewrite rules rewrite, and meta-theorems guide the process.
          </p>
          <p className="mt-2 max-w-4xl text-xs leading-5 text-slate-400">
            This browser loop is a visual rewrite demo only. It never verifies a theorem; use Verified Experimental Mode above for persisted, independently checkable evidence.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setRunning((value) => !value)}
            className="inline-flex items-center gap-2 rounded-md border border-cyan-signal/30 bg-cyan-signal/10 px-3 py-2 text-xs font-semibold text-cyan-signal hover:bg-cyan-signal/15"
          >
            {running ? <Pause className="size-4" /> : <Play className="size-4" />}
            {running ? "Pause" : "Start"}
          </button>
          <button
            type="button"
            onClick={() => void stepOnce()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md bg-cyan-signal px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50"
          >
            <StepForward className="size-4" />
            Step Rewrite Tick
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.08]"
          >
            <RotateCcw className="size-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
              <GitBranch className="size-4 text-cyan-signal" />
              Theorem Graph
            </h3>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">tick {state.tick}</div>
          </div>
          <svg viewBox="0 0 860 430" className="h-[430px] w-full rounded-md border border-white/10 bg-[#050912]">
            <defs>
              <filter id="rewrite-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {state.graph.edges.map((edge, index) => {
              const from = graphLayout.positions.get(edge.from);
              const to = graphLayout.positions.get(edge.to);
              if (!from || !to) return null;
              const stroke = edge.relationType === "contradicts" ? "#fb7185" : edge.relationType === "analogous_to" ? "#a3e635" : "#48e5ff";
              return (
                <line
                  key={`${edge.from}-${edge.to}-${index}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={stroke}
                  strokeOpacity={Math.max(0.18, edge.confidence)}
                  strokeWidth={1 + edge.weight * 3}
                />
              );
            })}
            {graphLayout.metaNodes.map((node) => (
              <GraphChip key={node.id} x={node.x} y={node.y} label={node.label} tone="meta" />
            ))}
            {graphLayout.ruleNodes.map((node) => (
              <GraphChip key={node.id} x={node.x} y={node.y} label={node.label} tone={node.status === "disabled" ? "danger" : node.status === "experimental" ? "candidate" : "rule"} />
            ))}
            {graphLayout.theoremNodes.map((node) => (
              <g
                key={node.id}
                role="button"
                tabIndex={0}
                className="cursor-pointer"
                filter={selectedNodeId === node.id ? "url(#rewrite-glow)" : undefined}
                onClick={() => setSelectedNodeId(node.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") setSelectedNodeId(node.id);
                }}
              >
                  <circle cx={node.x} cy={node.y} r={node.radius} fill={node.fill} stroke={node.stroke} strokeWidth={selectedNodeId === node.id ? 3 : 1.5} />
                  {node.ring && <circle cx={node.x} cy={node.y} r={node.radius + 5} fill="none" stroke={node.ring} strokeWidth="2" strokeDasharray="5 5" />}
                  <text x={node.x} y={node.y - 4} textAnchor="middle" className="fill-white text-[11px] font-semibold">
                    {node.shortTitle}
                  </text>
                  <text x={node.x} y={node.y + 12} textAnchor="middle" className="fill-slate-300 text-[9px]">
                    {node.statusLabel}
                  </text>
              </g>
            ))}
          </svg>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
            <Legend color="#48e5ff" label="rewrite / proof path" />
            <Legend color="#a3e635" label="analogy" />
            <Legend color="#fb7185" label="contradiction risk" />
            <Legend color="#fbbf24" label="candidate halo" />
            <Legend color="#ffffff" label="demo seed state" />
          </div>
        </div>

        <div className="grid gap-4">
          <PanelBlock title="Live Rewrite Activity" icon={<Activity className="size-4 text-cyan-signal" />}>
            <KeyValue label="Active theorem" value={state.latest?.activeTheorem?.title ?? "Waiting for first tick"} />
            <KeyValue label="Active expression" value={state.latest?.activeExpression?.rawText ?? "No expression selected yet"} />
            <KeyValue label="Latest rule" value={state.latest?.termResult?.rewriteTrace.at(0)?.ruleName ?? "No rewrite yet"} />
            <KeyValue label="Before / after" value={formatBeforeAfter(state.latest?.termResult?.rewriteTrace.at(0))} />
            <KeyValue label="Proof adapter" value={state.latest?.proofResult ? `${state.latest.proofResult.status}: ${state.latest.proofResult.notes}` : "No candidate sent yet"} />
          </PanelBlock>

          <PanelBlock title="Theorem Genome Inspector" icon={<BrainCircuit className="size-4 text-lime-signal" />}>
            {selectedNode ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">{selectedNode.title}</h4>
                  <StatusPill node={selectedNode} />
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-300">{selectedNode.statement}</p>
                <TagRow label="Assumptions" values={selectedNode.assumptions} />
                <TagRow label="Conclusions" values={selectedNode.conclusions} />
                <TagRow label="Domains" values={selectedNode.domainTags} />
                <p className="mt-3 text-xs leading-5 text-slate-400">{selectedNode.proofSketch}</p>
              </>
            ) : (
              <p className="text-xs text-slate-400">Select a theorem node.</p>
            )}
          </PanelBlock>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-4">
        <PanelBlock title="Rule Evolution" icon={<GitBranch className="size-4 text-cyan-signal" />}>
          <div className="space-y-2">
            {state.rules.slice(0, 8).map((rule) => (
              <RuleRow key={rule.id} rule={rule} />
            ))}
          </div>
        </PanelBlock>

        <PanelBlock title="Meta-Cognition" icon={<BrainCircuit className="size-4 text-lime-signal" />}>
          <TraceList
            items={[
              ...(state.latest?.metaResult?.metaInsights ?? []),
              ...(state.latest?.graphResult?.emergentPatterns ?? []),
              ...((state.latest?.graphResult?.proposedBridgeTheorems ?? []).map((node) => `Bridge theorem candidate: ${node.title}`)),
              ...((state.latest?.synthesisResult?.proposedRules ?? []).map((rule) => `Experimental rule born: ${rule.name}`))
            ]}
            empty="Step the simulation to detect abstraction, bridge, and rule-evolution patterns."
          />
        </PanelBlock>

        <PanelBlock title="Stability" icon={<ShieldAlert className="size-4 text-amber-200" />}>
          <KeyValue label="Recursion depth" value={String(state.latest?.stability?.recursionDepth ?? 0)} />
          <KeyValue label="Fuel remaining" value={String(state.latest?.stability?.fuelRemaining ?? state.settings.fuel)} />
          <KeyValue label="Confluence score" value={`${Math.round((state.latest?.stability?.stabilityScore ?? 1) * 100)}%`} />
          <KeyValue label="Critical pairs" value={String(state.latest?.stability?.criticalPairs.length ?? 0)} />
          <TraceList items={state.latest?.warnings ?? []} empty="No termination or confluence warnings." tone="warning" />
        </PanelBlock>

        <PanelBlock title="Tick Trace" icon={<Activity className="size-4 text-cyan-signal" />}>
          <TraceList items={state.latest?.tickTrace ?? []} empty="No rewrite tick has executed yet." />
          <div className="mt-3 rounded-md border border-amber-300/25 bg-amber-300/8 p-2 text-[11px] leading-4 text-amber-100">
            Generated nodes are Candidate or Needs Proof until the proof adapter verifies them.
          </div>
        </PanelBlock>
      </div>
    </div>
  );
}

function buildGraphLayout(state: RewriteCognitionState) {
  const theoremNodes = state.graph.nodes.slice(0, 13);
  const positions = new Map<string, { x: number; y: number }>();
  const center = { x: 430, y: 220 };
  const radiusX = 250;
  const radiusY = 145;
  theoremNodes.forEach((node, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(1, theoremNodes.length) - Math.PI / 2;
    positions.set(node.id, {
      x: center.x + Math.cos(angle) * radiusX,
      y: center.y + Math.sin(angle) * radiusY
    });
  });

  const ruleNodes = state.rules.slice(0, 6).map((rule, index) => ({
    id: rule.id,
    label: rule.name,
    status: rule.status,
    x: 80,
    y: 70 + index * 55
  }));

  const metaNodes = state.metaTheorems.slice(0, 4).map((meta, index) => ({
    id: meta.id,
    label: meta.name,
    x: 780,
    y: 90 + index * 70
  }));

  return {
    positions,
    theoremNodes: theoremNodes.map((node) => {
      const position = positions.get(node.id) ?? center;
      const isVerified = node.proofStatus === "verified";
      const isFailed = node.proofStatus === "failed";
      const isCandidate = node.proofStatus === "candidate" || node.proofStatus === "unverified";
      return {
        id: node.id,
        x: position.x,
        y: position.y,
        radius: node.domainTags.includes("meta") ? 34 : 41,
        fill: isVerified ? "rgba(72,229,255,0.2)" : isFailed ? "rgba(251,113,133,0.25)" : "rgba(251,191,36,0.18)",
        stroke: isVerified ? "#e0faff" : isFailed ? "#fb7185" : "#fbbf24",
        ring: isCandidate ? "#fbbf24" : isFailed ? "#fb7185" : undefined,
        shortTitle: shorten(node.title, 17),
        statusLabel: labelForProofStatus(node.proofStatus)
      };
    }),
    ruleNodes,
    metaNodes
  };
}

function GraphChip({ x, y, label, tone }: { x: number; y: number; label: string; tone: "rule" | "meta" | "candidate" | "danger" }) {
  const color = tone === "meta" ? "#a3e635" : tone === "candidate" ? "#fbbf24" : tone === "danger" ? "#fb7185" : "#48e5ff";
  return (
    <g opacity="0.9">
      <rect x={x - 50} y={y - 15} width="100" height="30" rx="6" fill="rgba(255,255,255,0.04)" stroke={color} strokeOpacity="0.55" />
      <text x={x} y={y + 4} textAnchor="middle" className="fill-slate-100 text-[9px]">
        {shorten(label, 18)}
      </text>
    </g>
  );
}

function PanelBlock({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2 rounded-md border border-white/10 bg-black/15 p-2">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className="mt-1 text-xs leading-5 text-slate-200">{value}</div>
    </div>
  );
}

function RuleRow({ rule }: { rule: RewriteRule }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/15 p-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-white">{rule.name}</span>
        <span className={`rounded px-2 py-0.5 text-[10px] ${rule.status === "active" ? "bg-cyan-signal/10 text-cyan-signal" : rule.status === "experimental" ? "bg-amber-300/10 text-amber-200" : "bg-rose-signal/10 text-rose-signal"}`}>
          {rule.status === "experimental" ? "Experimental Rule" : rule.status}
        </span>
      </div>
      <div className="mt-1 font-mono text-[10px] text-slate-500">
        {rule.lhsPattern} {"->"} {rule.rhsPattern}
      </div>
      <div className="mt-1 text-[10px] text-slate-400">
        use {rule.usageCount} / success {rule.successCount} / fail {rule.failureCount}
      </div>
    </div>
  );
}

function TraceList({ items, empty, tone = "default" }: { items: string[]; empty: string; tone?: "default" | "warning" }) {
  if (!items.length) return <p className="text-xs leading-5 text-slate-500">{empty}</p>;
  return (
    <div className="space-y-2">
      {items.slice(0, 5).map((item, index) => (
        <div key={`${item}-${index}`} className={`rounded-md border p-2 text-xs leading-5 ${tone === "warning" ? "border-amber-300/20 bg-amber-300/8 text-amber-100" : "border-white/10 bg-black/15 text-slate-300"}`}>
          {item}
        </div>
      ))}
    </div>
  );
}

function TagRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="mt-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {values.map((value) => (
          <span key={value} className="rounded border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-slate-300">
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatusPill({ node }: { node: TheoremNode }) {
  const label = labelForProofStatus(node.proofStatus);
  const className =
    node.proofStatus === "verified"
      ? "border-cyan-signal/30 bg-cyan-signal/10 text-cyan-signal"
      : node.proofStatus === "failed"
        ? "border-rose-signal/30 bg-rose-signal/10 text-rose-signal"
        : "border-amber-300/30 bg-amber-300/10 text-amber-200";
  return <span className={`rounded-md border px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${className}`}>{label}</span>;
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function formatBeforeAfter(step?: { before: string; after: string }) {
  if (!step) return "No term rewrite yet";
  return `${step.before} -> ${step.after}`;
}

function labelForProofStatus(status: TheoremNode["proofStatus"]) {
  if (status === "verified") return "Demo seed";
  if (status === "failed") return "Failed";
  if (status === "lean_pending") return "Needs Proof";
  if (status === "candidate") return "Candidate";
  return "Needs Proof";
}

function shorten(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}...` : text;
}
