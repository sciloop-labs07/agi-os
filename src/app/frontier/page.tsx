import { Activity, Beaker, BrainCircuit, GitFork, Radar, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { FrontierItemCard } from "@/components/frontier-item-card";
import { LinkButton } from "@/components/ui/button";
import { Kicker, MetricBar, Panel } from "@/components/ui/panel";
import { bottleneckMap, frontierItems, generateFrontierSnapshot, ideaMutations, researchCompression } from "@/lib/frontier/engine";

export default function FrontierPage() {
  const snapshot = generateFrontierSnapshot();

  return (
    <AppShell active="/frontier">
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(72,229,255,0.12),rgba(255,255,255,0.03))] p-6">
          <Kicker>Real-Time Frontier Intelligence</Kicker>
          <h1 className="mt-3 text-4xl font-semibold text-white">AI and AGI research signal pipeline</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
            Continuously monitors papers, code, benchmarks, labs, hardware news, patents, funding, and alignment research,
            then compresses the frontier into claims, mechanisms, bottlenecks, contradictions, convergence trends, and execution plans.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/frontier/sources" variant="outline">Monitor sources</LinkButton>
            <LinkButton href="/frontier/hybrids">Generate hybrids</LinkButton>
            <LinkButton href="/frontier/validation" variant="ghost">Physics validation</LinkButton>
          </div>
        </section>
        <Panel>
          <Kicker>Pipeline Pulse</Kicker>
          <div className="mt-5 space-y-5">
            <MetricBar label="Source coverage" value={Math.min(100, snapshot.sourceCoverage * 5)} />
            <MetricBar label="Mean importance" value={snapshot.meanImportance} />
            <MetricBar label="Paradigm coverage" value={Math.round((snapshot.liveParadigmCoverage / snapshot.monitoredParadigms) * 100)} />
            <MetricBar label="Bottleneck severity" value={snapshot.highestRisk.severity} />
          </div>
        </Panel>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          [Radar, "Ingest", "Live sources are normalized into comparable research items."],
          [ShieldCheck, "Score", "Claims receive credibility, hype, validation, feasibility, and timeline scores."],
          [GitFork, "Converge", "The system detects paradigm intersections and contradiction clusters."],
          [BrainCircuit, "Invent", "Idea mutations propose novel architectures and experiments."]
        ].map(([Icon, title, body]) => {
          const RenderIcon = Icon as typeof Radar;
          return (
            <Panel key={title as string}>
              <RenderIcon className="size-5 text-cyan-signal" />
              <h2 className="mt-3 text-sm font-semibold text-white">{title as string}</h2>
              <p className="mt-2 text-xs leading-5 text-slate-400">{body as string}</p>
            </Panel>
          );
        })}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-4">
          {frontierItems.map((item) => <FrontierItemCard key={item.id} item={item} />)}
        </div>
        <div className="space-y-4">
          <Panel>
            <Kicker>Research Compression</Kicker>
            <div className="mt-4 space-y-3">
              {researchCompression.conciseInsights.map((insight) => (
                <div key={insight} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-slate-300">{insight}</div>
              ))}
            </div>
          </Panel>
          <Panel>
            <Kicker>AGI Bottleneck Map</Kicker>
            <div className="mt-4 space-y-3">
              {bottleneckMap.map((item) => (
                <div key={item.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                    <span className="font-mono text-rose-signal">{item.severity}</span>
                  </div>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">{item.category} / {item.trend}</p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel>
            <Kicker>Idea Evolution</Kicker>
            <div className="mt-4 space-y-3">
              {ideaMutations.map((idea) => (
                <div key={idea.id} className="rounded-lg border border-lime-signal/20 bg-lime-signal/5 p-3">
                  <div className="flex items-center gap-2 text-lime-signal">
                    <Beaker className="size-4" />
                    <h3 className="text-sm font-semibold">{idea.unexploredIntersection}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{idea.mutatedHypothesis}</p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel>
            <Kicker>Automation Readiness</Kicker>
            <div className="mt-4 flex items-center gap-3 text-sm text-slate-300">
              <Activity className="size-4 text-cyan-signal" />
              Vercel cron can call `/api/intelligence/ingest` on the cadence in `vercel.json`.
            </div>
          </Panel>
        </div>
      </section>
    </AppShell>
  );
}
