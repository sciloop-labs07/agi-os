"use client";

import { AlertTriangle, BrainCircuit, Compass, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import type { MetaObserverDecision } from "@/metaobserver/types";
import type { RuleForgeRun } from "@/ruleforge/types";

export function MetaObserverPanel({ run }: { run: RuleForgeRun | null }) {
  const [decision, setDecision] = useState<MetaObserverDecision | null>(null);
  const [timeline, setTimeline] = useState<MetaObserverDecision[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!run) return;
    let cancelled = false;
    async function analyze() {
      setLoading(true);
      const response = await fetch("/api/metaobserver/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ run })
      });
      const data = (await response.json()) as { decision: MetaObserverDecision; timeline: MetaObserverDecision[] };
      if (!cancelled && response.ok) {
        setDecision(data.decision);
        setTimeline(data.timeline);
      }
      if (!cancelled) setLoading(false);
    }
    void analyze();
    return () => {
      cancelled = true;
    };
  }, [run]);

  return (
    <div className="mt-4 rounded-lg border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(72,229,255,0.14),transparent_32%),linear-gradient(180deg,rgba(6,10,20,0.98),rgba(5,8,15,0.99))] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md border border-cyan-signal/30 bg-cyan-signal/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-signal">
              MetaObserver AI
            </span>
            <span className="rounded-md border border-amber-300/30 bg-amber-300/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-200">
              advisory only
            </span>
          </div>
          <h3 className="mt-3 text-2xl font-semibold text-white">Third-Person Strategist Watching RuleForge</h3>
          <p className="mt-2 max-w-4xl text-xs leading-5 text-slate-400">
            MetaObserver does not create rules directly. It diagnoses RuleForge from above and recommends learning direction, experiments, mutations, retirements, and safety posture. Human approval is required before changing RuleForge behavior.
          </p>
        </div>
        <div className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
          {loading ? "observing..." : decision ? `confidence ${Math.round(decision.confidenceScore * 100)}%` : "waiting for RuleForge"}
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Score label="Learning" value={decision?.scores.learning_progress_score ?? 0} />
        <Score label="Chaos" value={decision?.scores.chaos_score ?? 0} danger />
        <Score label="Stability" value={decision?.scores.stability_score ?? 0} />
        <Score label="Growth" value={decision?.scores.intelligence_growth_score ?? 0} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Panel title="System Diagnosis" icon={<BrainCircuit className="size-4 text-cyan-signal" />}>
          {decision ? (
            <div className="space-y-2">
              <Key label="Current system state" value={decision.currentSystemState} />
              <Key label="Main detected pattern" value={decision.mainDetectedPattern} />
              <Key label="Main danger" value={decision.mainDanger} tone="danger" />
              <Key label="Main opportunity" value={decision.mainOpportunity} tone="opportunity" />
            </div>
          ) : (
            <Empty />
          )}
        </Panel>

        <Panel title="Next Recommended Path" icon={<Compass className="size-4 text-lime-signal" />}>
          {decision ? (
            <div className="space-y-2">
              <div className="rounded-md border border-lime-signal/25 bg-lime-signal/8 p-3 text-sm leading-6 text-lime-signal">
                {decision.recommendedNextAction}
              </div>
              <p className="text-xs leading-5 text-slate-400">{decision.reason}</p>
            </div>
          ) : (
            <Empty />
          )}
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Danger Warnings" icon={<AlertTriangle className="size-4 text-amber-200" />}>
          <Trace items={decision?.dangerWarnings ?? []} empty="No danger scan yet." danger />
        </Panel>
        <Panel title="Breakthrough Signals" icon={<Sparkles className="size-4 text-lime-signal" />}>
          <Trace items={decision?.breakthroughSignals ?? []} empty="No breakthrough scan yet." />
        </Panel>
        <Panel title="Strategy Q&A" icon={<ShieldCheck className="size-4 text-cyan-signal" />}>
          <div className="space-y-2">
            {decision?.strategicQuestions.slice(0, 5).map((item) => (
              <div key={item.question} className="rounded-md border border-white/10 bg-black/15 p-2">
                <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500">{item.question}</div>
                <div className="mt-1 text-xs leading-5 text-slate-300">{item.answer}</div>
              </div>
            )) ?? <Empty />}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel title="Strategic Score Vector" icon={<LineChart className="size-4 text-cyan-signal" />}>
          <div className="space-y-2">
            {decision &&
              Object.entries(decision.scores).map(([key, value]) => (
                <div key={key}>
                  <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
                    <span>{key.replaceAll("_", " ")}</span>
                    <span>{Math.round(value * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-cyan-signal" style={{ width: `${Math.round(value * 100)}%` }} />
                  </div>
                </div>
              ))}
            {!decision && <Empty />}
          </div>
        </Panel>
        <Panel title="Timeline of Strategic Decisions" icon={<Compass className="size-4 text-lime-signal" />}>
          <div className="space-y-2">
            {timeline.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-md border border-white/10 bg-black/15 p-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
                  {new Date(item.createdAt).toLocaleTimeString()} / confidence {Math.round(item.confidenceScore * 100)}%
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-300">{item.recommendedNextAction}</p>
              </div>
            ))}
            {!timeline.length && <Empty />}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Score({ label, value, danger = false }: { label: string; value: number; danger?: boolean }) {
  const color = danger ? "bg-amber-300" : "bg-cyan-signal";
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.035] p-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <div className="mt-2 text-xl font-semibold text-white">{Math.round(value * 100)}%</div>
      <div className="mt-2 h-1.5 rounded-full bg-white/10">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.round(value * 100)}%` }} />
      </div>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
        {icon}
        {title}
      </h4>
      {children}
    </div>
  );
}

function Key({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "danger" | "opportunity" }) {
  const className = tone === "danger" ? "border-amber-300/25 bg-amber-300/8 text-amber-100" : tone === "opportunity" ? "border-lime-signal/25 bg-lime-signal/8 text-lime-signal" : "border-white/10 bg-black/15 text-slate-300";
  return (
    <div className={`rounded-md border p-2 ${className}`}>
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">{label}</div>
      <div className="mt-1 text-xs leading-5">{value}</div>
    </div>
  );
}

function Trace({ items, empty, danger = false }: { items: string[]; empty: string; danger?: boolean }) {
  if (!items.length) return <p className="text-xs leading-5 text-slate-500">{empty}</p>;
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item} className={`rounded-md border p-2 text-xs leading-5 ${danger ? "border-amber-300/25 bg-amber-300/8 text-amber-100" : "border-white/10 bg-black/15 text-slate-300"}`}>
          {item}
        </div>
      ))}
    </div>
  );
}

function Empty() {
  return <p className="text-xs leading-5 text-slate-500">Waiting for RuleForge activity.</p>;
}
