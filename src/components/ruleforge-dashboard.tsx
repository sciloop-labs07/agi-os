"use client";

import { Activity, AlertTriangle, Binary, CheckCircle2, Database, GitBranch, Globe2, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MetaObserverPanel } from "@/components/metaobserver-panel";
import type { CandidateRule, RuleForgeRun, SandboxResult, SymbolicGraph } from "@/ruleforge/types";

const DEFAULT_SOURCE = "https://news.mit.edu/topic/artificial-intelligence2";
const PRINCIPLE = "Internet gives experience. Symbolic rewriting creates structure. Testing creates truth. Memory creates growth. Meta-rules create intelligence.";

export function RuleForgeDashboard() {
  const [url, setUrl] = useState(DEFAULT_SOURCE);
  const [task, setTask] = useState("Find stable symbolic rules about AI verification, energy limits, memory bottlenecks, and safe rule evolution.");
  const [run, setRun] = useState<RuleForgeRun | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const booted = useRef(false);

  const startCycle = useCallback(async (useDefault = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ruleforge/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(useDefault ? { task } : { url, task })
      });
      const data = (await response.json()) as RuleForgeRun | { error?: string };
      if (!response.ok) throw new Error("error" in data && data.error ? data.error : "RuleForge cycle failed.");
      setRun(data as RuleForgeRun);
    } catch (err) {
      setError(err instanceof Error ? err.message : "RuleForge cycle failed.");
    } finally {
      setLoading(false);
    }
  }, [task, url]);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    void startCycle(true);
  }, [startCycle]);

  const graphStats = useMemo(() => {
    if (!run) return { nodes: 0, edges: 0, active: 0, contradiction: 0 };
    return {
      nodes: run.graph.nodes.length,
      edges: run.graph.edges.length,
      active: run.graph.nodes.filter((node) => node.binaryState === 1).length,
      contradiction: run.graph.nodes.filter((node) => node.nodeType === "contradiction").length
    };
  }, [run]);

  return (
    <div className="rounded-lg border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(182,255,97,0.12),transparent_32%),linear-gradient(180deg,rgba(8,13,23,0.98),rgba(5,8,15,0.98))] p-4 shadow-glow md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md border border-lime-signal/30 bg-lime-signal/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-lime-signal">
              RuleForge AI
            </span>
            <span className="rounded-md border border-cyan-signal/30 bg-cyan-signal/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-signal">
              internet to symbolic laws
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">Self-Evolving Internet-Learning Symbolic AI Engine</h2>
          <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300">{PRINCIPLE}</p>
          <p className="mt-2 max-w-4xl text-xs leading-5 text-slate-400">
            RuleForge reads only approved sources, treats observations as evidence rather than truth, extracts structured claims, converts them into binary symbolic graphs, creates candidate rules, sandbox-tests them, and stores only decisions with an audit trail.
          </p>
        </div>
        <div className="w-full max-w-xl rounded-lg border border-white/10 bg-black/20 p-3">
          <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500" htmlFor="ruleforge-task">
            Assign task to RuleForge AI
          </label>
          <textarea
            id="ruleforge-task"
            value={task}
            onChange={(event) => setTask(event.target.value)}
            rows={3}
            className="mt-2 w-full resize-none rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-xs leading-5 text-slate-100 outline-none focus:border-lime-signal/60"
            placeholder="Example: Learn stable laws about AI energy bottlenecks and propose safe experiments."
          />
          <label className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500" htmlFor="ruleforge-url">
            Approved source URL
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              id="ruleforge-url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="min-w-0 flex-1 rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-signal/60"
            />
            <button
              type="button"
              onClick={() => void startCycle(false)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-lime-signal px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50"
            >
              <Activity className="size-4" />
              {loading ? "Running" : "Run Cycle"}
            </button>
            <button
              type="button"
              onClick={() => void startCycle(true)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-200 disabled:opacity-50"
            >
              <RotateCcw className="size-4" />
              Fallback
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-rose-signal">{error}</p>}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <Metric label="Claims extracted" value={run?.claims.length ?? 0} />
        <Metric label="Graph nodes" value={graphStats.nodes} />
        <Metric label="Candidate rules" value={run?.candidateRules.length ?? 0} />
        <Metric label="Accepted laws" value={run?.acceptedRules.length ?? 0} />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Panel title="Internet Input Stream" icon={<Globe2 className="size-4 text-lime-signal" />}>
          {run ? (
            <div className="space-y-2 text-xs leading-5 text-slate-300">
              <Key label="Assigned task" value={run.assignedTask?.objective ?? "No explicit task assigned"} />
              <Key label="Task safety" value={run.assignedTask?.safetyNote ?? "Default learning cycle only"} />
              <Key label="Title" value={run.source.title} />
              <Key label="URL" value={run.source.url} />
              <Key label="Domain" value={run.source.domain} />
              <Key label="Read status" value={`${run.source.readStatus} / credibility ${Math.round(run.source.credibilityScore * 100)}%`} />
              <div className="rounded-md border border-cyan-signal/20 bg-cyan-signal/8 p-2 text-cyan-signal">
                Cross-check status: single-source MVP. Claims are evidence, not truth.
              </div>
            </div>
          ) : (
            <Empty text="Run a RuleForge cycle to read an approved source." />
          )}
        </Panel>

        <Panel title="Core Loop" icon={<GitBranch className="size-4 text-cyan-signal" />}>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {(run?.loop ?? ["Observe", "Extract", "Symbolize", "Generate Rule", "Simulate", "Test", "Score", "Accept/Reject", "Rewrite", "Remember", "Improve"]).map((step, index) => (
              <div key={step} className={`rounded-md border px-2 py-2 text-xs ${run ? "border-lime-signal/20 bg-lime-signal/8 text-lime-signal" : "border-white/10 bg-white/[0.03] text-slate-400"}`}>
                {index + 1}. {step}
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Extracted Knowledge" icon={<Sparkles className="size-4 text-cyan-signal" />}>
          <div className="space-y-2">
            {run?.claims.map((claim) => (
              <div key={claim.id} className="rounded-md border border-white/10 bg-black/15 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-cyan-signal/10 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-cyan-signal">{claim.kind}</span>
                  <span className="text-[10px] text-slate-500">support {claim.supportCount} / contradiction {claim.contradictionCount}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-300">{claim.text}</p>
                <p className="mt-2 rounded border border-lime-signal/20 bg-lime-signal/8 p-2 font-mono text-[11px] leading-5 text-lime-signal">{claim.logicForm}</p>
              </div>
            )) ?? <Empty text="No claims extracted yet." />}
          </div>
        </Panel>

        <Panel title="Symbolic Binary Graph" icon={<Binary className="size-4 text-lime-signal" />}>
          {run ? <GraphView graph={run.graph} /> : <Empty text="The 0/1 atom graph appears after extraction." />}
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Generated Rules" icon={<GitBranch className="size-4 text-cyan-signal" />}>
          <RuleList rules={run?.candidateRules ?? []} results={run?.sandboxResults ?? []} />
        </Panel>
        <Panel title="Sandbox Test Results" icon={<ShieldCheck className="size-4 text-lime-signal" />}>
          <SandboxList results={run?.sandboxResults ?? []} />
        </Panel>
        <Panel title="Rejected / Review Queue" icon={<AlertTriangle className="size-4 text-amber-200" />}>
          <RuleList rules={[...(run?.rejectedRules ?? []), ...(run?.candidateRules.filter((rule) => run.sandboxResults.find((result) => result.ruleId === rule.rule_id)?.decision === "needs_human_approval") ?? [])]} results={run?.sandboxResults ?? []} compact />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Active Laws" icon={<CheckCircle2 className="size-4 text-lime-signal" />}>
          <RuleList rules={run?.acceptedRules ?? []} results={run?.sandboxResults ?? []} compact />
        </Panel>
        <Panel title="Meta-Learning Layer" icon={<Sparkles className="size-4 text-cyan-signal" />}>
          <Trace items={run?.metaRules ?? []} empty="Meta-rules appear after sandbox decisions." />
        </Panel>
        <Panel title="Memory + Audit" icon={<Database className="size-4 text-lime-signal" />}>
          {run ? (
            <div className="space-y-2">
              <Key label="Stored observations" value={String(run.memory.rawObservations.length)} />
              <Key label="Active rules in memory" value={String(run.memory.activeRules.length)} />
              <Key label="Rejected rules in memory" value={String(run.memory.rejectedRules.length)} />
              <Trace items={run.memory.auditLog.slice(0, 4)} empty="No audit events yet." />
            </div>
          ) : (
            <Empty text="Memory fills after the first cycle." />
          )}
        </Panel>
      </div>

      <MetaObserverPanel run={run} />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
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

function Key({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/15 p-2">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className="mt-1 break-words text-xs leading-5 text-slate-200">{value}</div>
    </div>
  );
}

function GraphView({ graph }: { graph: SymbolicGraph }) {
  const nodes = graph.nodes.slice(0, 18);
  const positions = nodes.map((node, index) => {
    const angle = (Math.PI * 2 * index) / Math.max(1, nodes.length);
    const ring = node.nodeType === "evidence" ? 88 : 145;
    return { node, x: 280 + Math.cos(angle) * ring, y: 160 + Math.sin(angle) * ring };
  });
  const byId = new Map(positions.map((item) => [item.node.id, item]));

  return (
    <svg viewBox="0 0 560 320" className="h-[320px] w-full rounded-md border border-white/10 bg-[#050912]">
      {graph.edges.slice(0, 36).map((edge, index) => {
        const from = byId.get(edge.from);
        const to = byId.get(edge.to);
        if (!from || !to) return null;
        const stroke = edge.relation === "contradicts" ? "#fb7185" : edge.relation === "causes" ? "#a3e635" : "#48e5ff";
        return <line key={`${edge.from}-${edge.to}-${index}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={stroke} strokeOpacity={0.35 + edge.weight * 0.35} strokeWidth={1 + edge.weight * 2} />;
      })}
      {positions.map(({ node, x, y }) => {
        const stroke = node.nodeType === "contradiction" ? "#fb7185" : node.binaryState ? "#a3e635" : "#fbbf24";
        return (
          <g key={node.id}>
            <circle cx={x} cy={y} r={node.nodeType === "evidence" ? 28 : 22} fill={node.binaryState ? "rgba(163,230,53,0.13)" : "rgba(251,191,36,0.13)"} stroke={stroke} strokeWidth="1.5" />
            <text x={x} y={y + 3} textAnchor="middle" className="fill-slate-100 text-[9px]">
              {short(node.label, 15)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function RuleList({ rules, results, compact = false }: { rules: CandidateRule[]; results: SandboxResult[]; compact?: boolean }) {
  if (!rules.length) return <Empty text="No rules in this panel yet." />;
  return (
    <div className="space-y-2">
      {rules.map((rule) => {
        const result = results.find((item) => item.ruleId === rule.rule_id);
        return (
          <div key={rule.rule_id} className="rounded-md border border-white/10 bg-black/15 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-semibold text-white">{rule.rule_name}</h4>
              <span className={`rounded px-2 py-1 text-[10px] ${statusClass(result?.decision ?? rule.status)}`}>{result?.decision ?? rule.status}</span>
            </div>
            <p className="mt-2 font-mono text-[11px] leading-5 text-lime-signal">
              {rule.input_pattern} {"->"} {rule.output_transformation}
            </p>
            {!compact && (
              <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-slate-400">
                <span>confidence {rule.confidence_score}</span>
                <span>stability {rule.stability_score}</span>
                <span>prediction {rule.prediction_score}</span>
                <span>contradiction {rule.contradiction_score}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SandboxList({ results }: { results: SandboxResult[] }) {
  if (!results.length) return <Empty text="Sandbox results appear after rules are generated." />;
  return (
    <div className="space-y-2">
      {results.map((result) => (
        <div key={result.ruleId} className="rounded-md border border-white/10 bg-black/15 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className={`rounded px-2 py-1 text-[10px] ${statusClass(result.decision)}`}>{result.decision}</span>
            <span className="font-mono text-[10px] text-slate-500">score {result.score}</span>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-300">{result.reason}</p>
          <div className="mt-2 space-y-1">
            {result.tests.map((test) => (
              <div key={test.name} className="flex gap-2 text-[11px] text-slate-400">
                <span className={test.passed ? "text-lime-signal" : "text-rose-signal"}>{test.passed ? "pass" : "fail"}</span>
                <span>{test.name}: {test.detail}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Trace({ items, empty }: { items: string[]; empty: string }) {
  if (!items.length) return <Empty text={empty} />;
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className="rounded-md border border-white/10 bg-black/15 p-2 text-xs leading-5 text-slate-300">
          {item}
        </div>
      ))}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-xs leading-5 text-slate-500">{text}</p>;
}

function statusClass(status: string) {
  if (status === "accepted" || status === "active") return "bg-lime-signal/10 text-lime-signal";
  if (status === "rejected") return "bg-rose-signal/10 text-rose-signal";
  if (status === "needs_human_approval") return "bg-amber-300/10 text-amber-200";
  return "bg-cyan-signal/10 text-cyan-signal";
}

function short(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}...` : text;
}
