"use client";

import { Activity, Database, FlaskConical, Play, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Kicker, Panel } from "@/components/ui/panel";

type Candidate = {
  id: string;
  statement: string;
  is_target: boolean;
  verification: { artifact_id: string; status: "VERIFIED" | "REJECTED" | "UNKNOWN"; verifier: string; notes: string; duration_ms: number };
};

type System = {
  name: string;
  active_experiment: { observation: string; disagreement: number };
  candidates: Candidate[];
  metrics: Record<string, number | string | null | boolean>;
};

type Report = {
  run_id: string;
  status: string;
  config: { seed: number; domain: string; limits: { max_candidates: number } };
  metrics: { comparison_note: string; verified_candidates: number; rejected_candidates: number; unknown_candidates: number };
  benchmarks: Array<{ domain: string; benchmark_version: string; systems: System[] }>;
};

export function VerifiedExperimentMode() {
  const [report, setReport] = useState<Report | null>(null);
  const [seed, setSeed] = useState(17);
  const [domain, setDomain] = useState("all");
  const [maxCandidates, setMaxCandidates] = useState(6);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/maths-ai/verified-experiment")
      .then((response) => response.json())
      .then((payload: { report: Report | null }) => setReport(payload.report))
      .catch(() => setError("Could not load the last executed experiment artifact."));
  }, []);

  async function run() {
    setRunning(true);
    setError(null);
    try {
      const response = await fetch("/api/maths-ai/verified-experiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed, domain, maxCandidates })
      });
      const payload = await response.json() as { report?: Report; error?: string };
      if (!response.ok || !payload.report) throw new Error(payload.error ?? "Experiment failed.");
      setReport(payload.report);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Experiment failed.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <Panel className="border-cyan-signal/25 bg-[linear-gradient(135deg,rgba(72,229,255,0.09),rgba(7,17,28,0.82)_52%,rgba(182,255,97,0.06))]">
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
        <div>
          <Kicker className="text-cyan-signal">Verified Experimental Mode</Kicker>
          <h2 className="mt-3 text-2xl font-semibold text-white">Evidence, not agent theatre.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            This runs a bounded Python experiment with truth-table, SymPy, and deterministic graph verifiers. Only independent verifier output can become VERIFIED.
          </p>
        </div>
        <div className="rounded-md border border-lime-signal/30 bg-lime-signal/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-lime-signal">
          {report ? "executed artifact loaded" : "no executed run loaded"}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <Field label="Seed"><input value={seed} onChange={(event) => setSeed(Number(event.target.value) || 0)} type="number" min="0" className="field" /></Field>
        <Field label="Benchmark"><select value={domain} onChange={(event) => setDomain(event.target.value)} className="field"><option value="all">All domains</option><option value="boolean">Boolean</option><option value="algebra">Algebra</option><option value="graph">Graph</option></select></Field>
        <Field label="Candidate budget"><input value={maxCandidates} onChange={(event) => setMaxCandidates(Math.min(12, Math.max(1, Number(event.target.value) || 1)))} type="number" min="1" max="12" className="field" /></Field>
        <button type="button" disabled={running} onClick={() => void run()} className="mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-md bg-cyan-signal px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-50"><Play className="size-4" />{running ? "Executing…" : "Run verified experiment"}</button>
      </div>

      {error && <p className="mt-4 rounded-md border border-rose-signal/30 bg-rose-signal/10 p-3 text-sm text-rose-signal">{error}</p>}
      {!report && !error && <p className="mt-5 text-sm text-slate-400">No result is shown until a Python experiment executes.</p>}
      {report && <ExecutedReport report={report} />}
    </Panel>
  );
}

function ExecutedReport({ report }: { report: Report }) {
  return (
    <div className="mt-6 space-y-5">
      <div className="grid gap-3 md:grid-cols-4">
        <Metric label="Run" value={report.run_id} icon={<FlaskConical className="size-4" />} />
        <Metric label="Verified" value={String(report.metrics.verified_candidates)} icon={<ShieldCheck className="size-4" />} />
        <Metric label="Rejected" value={String(report.metrics.rejected_candidates)} icon={<Activity className="size-4" />} />
        <Metric label="Unknown" value={String(report.metrics.unknown_candidates)} icon={<Database className="size-4" />} />
      </div>
      <p className="rounded-md border border-amber-300/25 bg-amber-300/8 p-3 text-xs leading-5 text-amber-100">{report.metrics.comparison_note}</p>
      {report.benchmarks.map((benchmark) => (
        <div key={benchmark.domain} className="rounded-lg border border-white/10 bg-black/20 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold text-white">{benchmark.domain} benchmark</h3><span className="font-mono text-[10px] uppercase text-slate-500">{benchmark.benchmark_version}</span></div>
          <div className="mt-4 grid gap-3 xl:grid-cols-2">
            {benchmark.systems.map((system) => <SystemResult key={system.name} system={system} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function SystemResult({ system }: { system: System }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center justify-between gap-3"><b className="text-sm text-white">{system.name.replaceAll("_", " ")}</b><span className="font-mono text-[10px] text-cyan-signal">target discovery {String(system.metrics.verified_discovery_rate)}</span></div>
      <p className="mt-2 text-xs text-slate-400">Active discriminator: {system.active_experiment.observation} · disagreement {system.active_experiment.disagreement}</p>
      <div className="mt-3 space-y-2">
        {system.candidates.map((candidate) => <div key={candidate.id} className="rounded border border-white/10 bg-black/20 p-2 text-xs">
          <div className="flex items-center justify-between gap-2"><span className="text-slate-200">{candidate.statement}</span><Status status={candidate.verification.status} /></div>
          <p className="mt-1 text-slate-500">{candidate.verification.verifier} · {candidate.verification.duration_ms}ms · {candidate.verification.artifact_id}</p>
          <p className="mt-1 text-slate-400">{candidate.verification.notes}</p>
        </div>)}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{label}{children}</label>;
}

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div className="rounded-md border border-white/10 bg-white/[0.03] p-3"><div className="flex items-center justify-between text-cyan-signal">{icon}<span className="max-w-[12rem] truncate font-mono text-xs">{value}</span></div><p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{label}</p></div>;
}

function Status({ status }: { status: Candidate["verification"]["status"] }) {
  const color = status === "VERIFIED" ? "text-lime-signal" : status === "REJECTED" ? "text-rose-signal" : "text-amber-200";
  return <span className={`font-mono text-[10px] ${color}`}>{status}</span>;
}
