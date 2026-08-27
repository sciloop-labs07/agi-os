import {
  ArrowRight,
  Binary,
  Brain,
  BrainCircuit,
  Cpu,
  FlaskConical,
  GitBranch,
  LineChart,
  Map,
  Moon,
  Network,
  NotebookTabs,
  Radar,
  Route,
  ShieldCheck,
  Sigma,
  Sparkles,
  WandSparkles,
  Workflow
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MathsAIExecutionPanel } from "@/components/maths-ai-execution-panel";
import { SciLoopSynthesisDashboard } from "@/components/sciloop-synthesis-dashboard";
import { ParadigmCard } from "@/components/paradigm-card";
import { LinkButton } from "@/components/ui/button";
import { Kicker, MetricBar, Panel } from "@/components/ui/panel";
import { generateFrontierSnapshot } from "@/lib/frontier/engine";
import { paradigms } from "@/lib/paradigms";

const operatingLoops = [
  { icon: Brain, label: "Understand", body: "First-principles portals explain physics, computation, learning, bottlenecks, and AGI relevance." },
  { icon: Network, label: "Connect", body: "Graph relations expose dependencies, convergence points, causal pathways, and open problems." },
  { icon: FlaskConical, label: "Execute", body: "Roadmaps turn scientific uncertainty into experiments, milestones, and innovation opportunities." },
  { icon: ShieldCheck, label: "Align", body: "Every paradigm carries a safety surface: control, opacity, recursive risk, privacy, and governance." }
];

const commandModules = [
  { href: "/ship-check", icon: ShieldCheck, title: "AI Ship Check", body: "Crash-test an AI system, reproduce meaningful failures, trace evidence, generate remediation, and explain readiness limits.", signal: "P0 product" },
  { href: "/frontier", icon: Radar, title: "Frontier Intelligence", body: "Research-source adapters, credibility heuristics, contradictions, and trend exploration.", signal: "research pipeline" },
  { href: "/emergence-map", icon: Map, title: "Emergence Map", body: "Interactive causal map from raw signals to AGI and ASI, with red weak points and innovation zones.", signal: "AGI path" },
  { href: "/ai-maps", icon: Map, title: "Maps For Each AI", body: "A separate live emergence map for every AI paradigm, showing how that paradigm works and where it gets weak.", signal: "15 maps" },
  { href: "/maths-ai", icon: Sigma, title: "Maths AI", body: "A bounded hypothesis-search lab with deterministic verifiers, rejection evidence, and fixed-baseline comparisons.", signal: "verified experiments" },
  { href: "/imagination", icon: WandSparkles, title: "Imagination Engine", body: "Possible-world search where the AI dreams future systems, branches counterfactuals, and turns scenes into tests.", signal: "mental lab" },
  { href: "/shadow-field-theory", icon: Moon, title: "Shadow Field Theory Lab", body: "Detect hidden traces behind every action: physical, cyber, behavioral, AI memory, and reality-testing shadows.", signal: "shadow lab" },
  { href: "/negative-trace-intelligence", icon: BrainCircuit, title: "Negative Trace Intelligence", body: "AI that learns from absence, failure, uncertainty, contradiction, missing context, and unchosen paths.", signal: "NTI lab" },
  { href: "/explorer", icon: BrainCircuit, title: "Paradigm Explorer", body: "Dedicated portals for electronic, photonic, neuromorphic, quantum, embodied, biological, and hybrid AI.", signal: "15 portals" },
  { href: "/graph", icon: GitBranch, title: "Knowledge Graph", body: "Causal dependencies connecting concepts, equations, architectures, companies, bottlenecks, and opportunities.", signal: "system map" },
  { href: "/comparison", icon: Binary, title: "Comparison Engine", body: "Radar, matrix, and strategic scoring across energy, compute density, maturity, safety, and AGI potential.", signal: "ranked views" },
  { href: "/workspace", icon: NotebookTabs, title: "Research Workspace", body: "Notes, hypotheses, experiments, innovation trees, tags, and execution tracking.", signal: "lab notebook" },
  { href: "/roadmap", icon: Route, title: "AGI Roadmap", body: "Missing technologies, bottleneck priority, hybrid strategies, and staged research execution.", signal: "execution plan" },
  { href: "/simulation", icon: LineChart, title: "Future Simulation", body: "Scenario modeling for compute scaling, energy constraints, recursive improvement, and hardware bottlenecks.", signal: "forecast lab" },
  { href: "/architecture", icon: Workflow, title: "System Architecture", body: "Database schema, APIs, AI integration layer, deployment path, and scale roadmap.", signal: "blueprint" }
];

export default function Home() {
  const topParadigms = [...paradigms].sort((a, b) => b.metrics.agiPotential - a.metrics.agiPotential).slice(0, 6);
  const averageEnergy = Math.round(paradigms.reduce((sum, item) => sum + item.metrics.energyEfficiency, 0) / paradigms.length);
  const averageAgi = Math.round(paradigms.reduce((sum, item) => sum + item.metrics.agiPotential, 0) / paradigms.length);
  const frontierSnapshot = generateFrontierSnapshot();

  return (
    <AppShell active="/">
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="relative min-h-[560px] overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(72,229,255,0.14),rgba(182,255,97,0.07)_40%,rgba(255,95,143,0.1))] p-6 shadow-glow md:p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-signal to-transparent" />
          <div className="absolute right-8 top-8 hidden h-44 w-44 rounded-full border border-cyan-signal/20 xl:block" />
          <div className="absolute right-20 top-20 hidden h-20 w-20 rounded-full border border-lime-signal/20 xl:block" />
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-cyan-signal/30 bg-cyan-signal/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-cyan-signal">
              unified command layer
            </span>
            <span className="rounded-md border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-300">
              {paradigms.length} paradigms indexed
            </span>
            <span className="rounded-md border border-lime-signal/20 bg-lime-signal/10 px-3 py-1 font-mono text-xs text-lime-signal">
              {frontierSnapshot.sourceCoverage} configured source adapters
            </span>
          </div>
          <h1 className="mt-8 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-6xl">
            Crash-test your AI system before your customers do.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
            AI Ship Check currently demonstrates evidence-backed evaluation against controlled fixtures and turns observed failures into remediation work.
            The broader AGI OS surface is a research-stage software laboratory for understanding, comparison, and system design—not AGI or a production-safety certification.
          </p>
          <div className="mt-5 max-w-3xl rounded-md border border-amber-300/25 bg-amber-300/[0.06] px-4 py-3 text-sm leading-6 text-amber-100">
            Public demo limits: no customers or revenue are claimed; Ship Check uses controlled fixtures; Maths AI covers bounded toy benchmarks; several research portals are incomplete or simulated.
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/ship-check">Start Ship Check <ArrowRight className="size-4" /></LinkButton>
            <LinkButton href="/sciloop" variant="outline">Open SciLoop synthesis</LinkButton>
            <LinkButton href="/frontier">Enter frontier intelligence <ArrowRight className="size-4" /></LinkButton>
            <LinkButton href="/explorer" variant="outline">Open paradigm portals</LinkButton>
            <LinkButton href="/graph" variant="ghost">View graph</LinkButton>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {operatingLoops.map((loop) => {
              const Icon = loop.icon;
              return (
                <div key={loop.label} className="rounded-lg border border-white/10 bg-slate-950/48 p-4">
                  <Icon className="size-5 text-cyan-signal" />
                  <h2 className="mt-3 text-sm font-semibold text-white">{loop.label}</h2>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{loop.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <Panel className="flex flex-col justify-between">
          <div>
            <Kicker>System Pulse</Kicker>
            <h2 className="mt-3 text-2xl font-semibold text-white">Strategic research state</h2>
            <div className="mt-6 space-y-5">
              <MetricBar label="Mean AGI potential" value={averageAgi} />
              <MetricBar label="Mean energy leverage" value={averageEnergy} />
              <MetricBar label="Hybrid convergence pressure" value={89} />
              <MetricBar label="Safety uncertainty" value={71} />
              <MetricBar label="Frontier importance" value={frontierSnapshot.meanImportance} />
            </div>
          </div>
          <div className="mt-8 rounded-lg border border-white/10 bg-black/20 p-4">
            <div className="flex items-center gap-3 text-lime-signal">
              <Sparkles className="size-5" />
              <span className="text-sm font-medium">Highest leverage thesis</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Hybrid intelligence systems are the best near-term strategic architecture because they route cognition across
              digital models, physical systems, human institutions, and specialized accelerators.
            </p>
          </div>
        </Panel>
      </div>

      <section className="mt-8">
        <SciLoopSynthesisDashboard compact />
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <Kicker>Main Connected Interface</Kicker>
            <h2 className="mt-2 text-2xl font-semibold text-white">All systems linked from one hub</h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
            click any module to open
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {commandModules.map((module) => {
            const Icon = module.icon;
            return (
              <a
                key={module.href}
                href={module.href}
                className="group relative overflow-hidden rounded-lg border border-white/10 bg-panel/78 p-5 shadow-glow transition hover:-translate-y-1 hover:border-cyan-signal/45 hover:bg-cyan-signal/8"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-signal/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-11 items-center justify-center rounded-md border border-cyan-signal/25 bg-cyan-signal/10">
                    <Icon className="size-5 text-cyan-signal" />
                  </div>
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] uppercase text-slate-400">
                    {module.signal}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{module.title}</h3>
                <p className="mt-2 min-h-20 text-sm leading-6 text-slate-400">{module.body}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-signal">
                  Open module <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <MathsAIExecutionPanel compact />
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <Kicker>Priority Portals</Kicker>
            <h2 className="mt-2 text-2xl font-semibold text-white">Highest AGI potential tracks</h2>
          </div>
          <LinkButton href="/comparison" variant="ghost">Compare all</LinkButton>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topParadigms.map((paradigm) => <ParadigmCard key={paradigm.slug} paradigm={paradigm} />)}
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["Architecture", "Next.js App Router, Prisma/PostgreSQL, React Flow, provider-neutral AI layer."],
          ["Execution", "Research notes, experiments, innovation trees, roadmaps, and future simulation modules."],
          ["Scale Path", "Vector search, Neo4j graph traversal, agentic workflows, evaluation harnesses, and enterprise auth."]
        ].map(([title, body]) => (
          <Panel key={title}>
            <Cpu className="size-5 text-cyan-signal" />
            <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
          </Panel>
        ))}
      </section>
    </AppShell>
  );
}
