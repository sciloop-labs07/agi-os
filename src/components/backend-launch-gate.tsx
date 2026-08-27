"use client";

import { Activity, CheckCircle2, Play, RefreshCw, ShieldAlert, XCircle } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type Probe = {
  id: string;
  label: string;
  method: "GET" | "POST";
  path: string;
  body?: unknown;
  okStatuses: number[];
  status: "idle" | "checking" | "pass" | "fail";
  statusCode?: number;
  detail?: string;
};

const REQUIRED_PROBES: Omit<Probe, "status" | "statusCode" | "detail">[] = [
  { id: "paradigms", label: "Paradigm API", method: "GET", path: "/api/paradigms", okStatuses: [200] },
  { id: "paradigm-detail", label: "Paradigm Detail API", method: "GET", path: "/api/paradigms/electronic-ai", okStatuses: [200] },
  { id: "graph", label: "Knowledge Graph API", method: "GET", path: "/api/graph", okStatuses: [200] },
  { id: "frontier-snapshot", label: "Frontier Snapshot API", method: "GET", path: "/api/intelligence/snapshot", okStatuses: [200] },
  { id: "frontier-ingest", label: "Frontier Ingest API", method: "GET", path: "/api/intelligence/ingest", okStatuses: [200] },
  { id: "maths-status", label: "Maths AI Status API", method: "GET", path: "/api/maths-ai/status", okStatuses: [200] },
  { id: "ruleforge", label: "RuleForge Cycle API", method: "POST", path: "/api/ruleforge/run", body: {}, okStatuses: [200] },
  { id: "metaobserver", label: "MetaObserver Analyze API", method: "POST", path: "/api/metaobserver/analyze", body: {}, okStatuses: [200] },
  { id: "notes", label: "Research Notes API", method: "POST", path: "/api/research/notes", body: { title: "Launch health check", markdown: "Backend launch gate probe.", tags: ["health"] }, okStatuses: [201] },
  { id: "ai-provider", label: "AI Provider Fallback API", method: "POST", path: "/api/ai/generate", body: { provider: "openai", prompt: "Return a short backend health-check acknowledgement." }, okStatuses: [200] }
];

export function BackendLaunchGate() {
  const [probes, setProbes] = useState<Probe[]>(() => REQUIRED_PROBES.map((probe) => ({ ...probe, status: "idle" })));
  const [checking, setChecking] = useState(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);

  const summary = useMemo(() => {
    const passed = probes.filter((probe) => probe.status === "pass").length;
    const failed = probes.filter((probe) => probe.status === "fail").length;
    const complete = passed + failed === probes.length;
    return { passed, failed, complete, ready: complete && failed === 0 };
  }, [probes]);

  async function runChecks() {
    setChecking(true);
    setLastCheckedAt(null);
    setProbes(REQUIRED_PROBES.map((probe) => ({ ...probe, status: "checking" })));

    const next: Probe[] = [];
    for (const probe of REQUIRED_PROBES) {
      const result = await runProbe(probe);
      next.push(result);
      setProbes((current) => current.map((item) => (item.id === result.id ? result : item)));
    }

    setProbes(next);
    setLastCheckedAt(new Date().toLocaleTimeString());
    setChecking(false);
  }

  return (
    <section className="mt-6 rounded-lg border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(72,229,255,0.14),transparent_32%),linear-gradient(180deg,rgba(8,13,24,0.98),rgba(5,9,16,0.98))] p-5 shadow-glow">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md border border-cyan-signal/30 bg-cyan-signal/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-signal">
              Backend Launch Gate
            </span>
            <span className="rounded-md border border-lime-signal/25 bg-lime-signal/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-lime-signal">
              API readiness check
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-white">Verify backend before starting the main platform</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            This checks the core APIs, RuleForge, MetaObserver, notes, graph, frontier intelligence, and AI-provider fallback. The main platform launch unlocks only when every required service responds correctly.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void runChecks()}
            disabled={checking}
            className="inline-flex items-center gap-2 rounded-md bg-cyan-signal px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {checking ? <RefreshCw className="size-4 animate-spin" /> : <Activity className="size-4" />}
            {checking ? "Checking backend" : "Check Backend + APIs"}
          </button>
          {summary.ready ? (
            <Link href="/ruleforge" className="inline-flex items-center gap-2 rounded-md bg-lime-signal px-4 py-2 text-sm font-semibold text-slate-950">
              <Play className="size-4" />
              Start Main Platform
            </Link>
          ) : (
            <button type="button" disabled className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-500">
              <ShieldAlert className="size-4" />
              Start locked
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <Metric label="Passed" value={summary.passed} tone="pass" />
        <Metric label="Failed" value={summary.failed} tone={summary.failed ? "fail" : "neutral"} />
        <Metric label="Total probes" value={probes.length} tone="neutral" />
        <Metric label="Last check" value={lastCheckedAt ?? "not run"} tone="neutral" />
      </div>

      <div className="mt-5 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {probes.map((probe) => (
          <div key={probe.id} className="rounded-md border border-white/10 bg-black/15 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">{probe.label}</h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
                  {probe.method} {probe.path}
                </p>
              </div>
              <StatusIcon status={probe.status} />
            </div>
            <p className={`mt-3 text-xs leading-5 ${probe.status === "fail" ? "text-rose-signal" : probe.status === "pass" ? "text-lime-signal" : "text-slate-500"}`}>
              {probe.detail ?? "Waiting for health check."}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

async function runProbe(probe: Omit<Probe, "status" | "statusCode" | "detail">): Promise<Probe> {
  try {
    const response = await fetch(probe.path, {
      method: probe.method,
      headers: probe.method === "POST" ? { "Content-Type": "application/json" } : undefined,
      body: probe.method === "POST" ? JSON.stringify(probe.body ?? {}) : undefined
    });
    const ok = probe.okStatuses.includes(response.status);
    return {
      ...probe,
      status: ok ? "pass" : "fail",
      statusCode: response.status,
      detail: ok ? `Healthy: HTTP ${response.status}` : `Unexpected HTTP ${response.status}`
    };
  } catch (error) {
    return {
      ...probe,
      status: "fail",
      detail: error instanceof Error ? error.message : "Network or runtime failure"
    };
  }
}

function Metric({ label, value, tone }: { label: string; value: number | string; tone: "pass" | "fail" | "neutral" }) {
  const color = tone === "pass" ? "text-lime-signal" : tone === "fail" ? "text-rose-signal" : "text-white";
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className={`mt-2 text-xl font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function StatusIcon({ status }: { status: Probe["status"] }) {
  if (status === "pass") return <CheckCircle2 className="size-5 text-lime-signal" />;
  if (status === "fail") return <XCircle className="size-5 text-rose-signal" />;
  if (status === "checking") return <RefreshCw className="size-5 animate-spin text-cyan-signal" />;
  return <ShieldAlert className="size-5 text-slate-600" />;
}
