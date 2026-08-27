"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, CheckCircle2, Eye, FlaskConical, GitBranch, Sparkles, Zap } from "lucide-react";

type LearnerMemory = { totalRuns?: number; correctRuns?: number; challenge?: number };

const storageKey = "sciloop-self-evolving-engine-v1";

const pillars = [
  {
    href: "/sciloop-flow-designer",
    label: "SciLoop Flow",
    purpose: "Structure the learning loop",
    output: "Discovery + Feedback Loop",
    evidence: "14 nodes · 14 connections",
    icon: GitBranch,
    color: "cyan"
  },
  {
    href: "/cognitive-engine-laboratory",
    label: "Cognitive Lab",
    purpose: "Test whether the flow supports understanding",
    output: "Prediction → Simulation → Observation → Feedback",
    evidence: "reasoning + transfer protocol",
    icon: FlaskConical,
    color: "amber"
  },
  {
    href: "/sciloop-best-engine",
    label: "Visual Engine",
    purpose: "Turn meaning into visible structure",
    output: "Object · Change · Relationship · Time · Error",
    evidence: "shared visual basis",
    icon: Eye,
    color: "violet"
  },
  {
    href: "/self-evolving-engine",
    label: "Evolving Engine",
    purpose: "Use learner evidence to change the next test",
    output: "Contrast after error · challenge after success",
    evidence: "local learner memory",
    icon: Zap,
    color: "lime"
  }
] as const;

const colorClasses = {
  cyan: "border-cyan-signal/25 bg-cyan-signal/6 text-cyan-signal",
  amber: "border-amber-300/25 bg-amber-300/6 text-amber-200",
  violet: "border-violet-300/25 bg-violet-300/6 text-violet-200",
  lime: "border-lime-signal/25 bg-lime-signal/6 text-lime-signal"
} as const;

function readLearnerMemory(): LearnerMemory {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) as LearnerMemory : {};
  } catch {
    return {};
  }
}

export function SciLoopSynthesisDashboard({ compact = false }: { compact?: boolean }) {
  const [memory, setMemory] = useState<LearnerMemory>({});

  useEffect(() => {
    setMemory(readLearnerMemory());
  }, []);

  const tests = memory.totalRuns ?? 0;
  const accuracy = tests ? Math.round(((memory.correctRuns ?? 0) / tests) * 100) : 0;
  const learnerSignal = tests ? `${tests} tests · ${accuracy}% prediction accuracy · challenge ×${memory.challenge ?? 1}` : "Ready for the first learner test";

  if (compact) {
    return <section className="relative overflow-hidden rounded-lg border border-cyan-signal/25 bg-[linear-gradient(125deg,rgba(72,229,255,0.1),rgba(182,255,97,0.05),rgba(3,9,17,0.78))] p-5 shadow-glow md:p-6">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-signal"><Sparkles className="size-4" /> SciLoop synthesis</div>
          <h2 className="mt-2 text-2xl font-semibold text-white">Four portals. One conclusion.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Flow structures the loop, Cognitive Lab tests it, Visual Engine makes it legible, and Evolving Engine learns from the next attempt.</p>
        </div>
        <Link href="/sciloop" className="inline-flex shrink-0 items-center gap-2 rounded-md border border-lime-signal/35 bg-lime-signal/10 px-4 py-2 text-sm font-medium text-lime-signal transition hover:bg-lime-signal/20">Open unified conclusion <ArrowRight className="size-4" /></Link>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-4">{pillars.map((pillar) => <div key={pillar.label} className="rounded-md border border-white/10 bg-slate-950/35 px-3 py-3"><div className="flex items-center gap-2 text-xs font-medium text-white"><pillar.icon className="size-4 text-cyan-signal" /> {pillar.label}</div><p className="mt-1 text-[11px] leading-5 text-slate-500">{pillar.purpose}</p></div>)}</div>
    </section>;
  }

  return <div className="space-y-6">
    <section className="relative overflow-hidden rounded-lg border border-cyan-signal/25 bg-[radial-gradient(circle_at_85%_15%,rgba(182,255,97,0.12),transparent_30%),linear-gradient(125deg,rgba(72,229,255,0.1),rgba(3,9,17,0.82))] p-6 shadow-glow md:p-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-signal to-transparent" />
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-signal"><Sparkles className="size-4" /> SCILOOP / UNIFIED CONCLUSION</div>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-5xl">From four engines to one understanding system.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">This is the main SciLoop surface. Each portal contributes one job, then the synthesis layer compresses the result into an implementation decision you can act on.</p>
        </div>
        <div className="rounded-md border border-lime-signal/25 bg-lime-signal/8 px-4 py-3 lg:min-w-64"><div className="flex items-center gap-2 text-xs font-medium text-lime-signal"><CheckCircle2 className="size-4" /> Current learner signal</div><p className="mt-2 font-mono text-[11px] leading-5 text-slate-300">{learnerSignal}</p></div>
      </div>
    </section>

    <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="rounded-lg border border-lime-signal/25 bg-panel/75 p-5 md:p-6">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-lime-signal"><BrainCircuit className="size-4" /> Main conclusion</div>
        <h2 className="mt-3 text-2xl font-semibold text-white">Build around prediction before explanation.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">The strongest common result is a prediction-first, feedback-driven loop: give the learner a concrete experience, require a guess, show the consequence, expose the cause, and let the next challenge adapt to the evidence.</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2"><div className="rounded-md border border-white/10 bg-black/15 p-3"><span className="font-mono text-[10px] uppercase text-slate-500">What to implement</span><strong className="mt-2 block text-sm text-white">One shared learning grammar</strong><p className="mt-1 text-xs leading-5 text-slate-400">Experience → Prediction → Simulation → Observation → Rule → Transfer</p></div><div className="rounded-md border border-white/10 bg-black/15 p-3"><span className="font-mono text-[10px] uppercase text-slate-500">What must adapt</span><strong className="mt-2 block text-sm text-white">The next experience</strong><p className="mt-1 text-xs leading-5 text-slate-400">Errors request contrast and explanation; successful predictions earn a harder or broader test.</p></div></div>
      </div>
      <div className="rounded-lg border border-white/10 bg-panel/75 p-5 md:p-6"><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-signal"><Sparkles className="size-4" /> Shared basis</div><div className="mt-4 flex flex-wrap gap-2">{["Experience", "Prediction", "State", "Relationship", "Time", "Causality", "Error", "Transfer"].map((item) => <span key={item} className="rounded-md border border-cyan-signal/20 bg-cyan-signal/5 px-2 py-1.5 font-mono text-[10px] text-cyan-100">{item}</span>)}</div><p className="mt-4 text-xs leading-5 text-slate-400">These are the smallest practical pieces shared by the four portals. Subject matter can change; the learning grammar stays stable.</p></div>
    </section>

    <section>
      <div className="mb-4 flex flex-col justify-between gap-2 md:flex-row md:items-end"><div><div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-signal">The four jobs</div><h2 className="mt-2 text-2xl font-semibold text-white">Each portal contributes one layer</h2></div><span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">open any portal for depth</span></div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{pillars.map((pillar, index) => { const Icon = pillar.icon; return <article key={pillar.label} className={`group rounded-lg border p-4 transition hover:-translate-y-1 hover:border-white/25 ${colorClasses[pillar.color]}`}><div className="flex items-start justify-between gap-3"><div className="flex size-10 items-center justify-center rounded-md border border-white/10 bg-black/20"><Icon className="size-5" /></div><span className="font-mono text-[10px] text-slate-500">0{index + 1}</span></div><h3 className="mt-4 text-lg font-semibold text-white">{pillar.label}</h3><p className="mt-1 min-h-10 text-xs leading-5 text-slate-400">{pillar.purpose}</p><div className="mt-4 border-t border-white/10 pt-3"><span className="font-mono text-[9px] uppercase text-slate-500">result</span><p className="mt-1 text-sm leading-5 text-white">{pillar.output}</p><span className="mt-2 block font-mono text-[10px] text-slate-500">{pillar.evidence}</span></div><Link href={pillar.href} className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-white/75 hover:text-white">Open portal <ArrowRight className="size-3.5 transition group-hover:translate-x-1" /></Link></article>; })}</div>
    </section>

    <section className="rounded-lg border border-amber-300/20 bg-amber-300/5 p-5 md:p-6"><div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-200"><FlaskConical className="size-4" /> Implementation decision</div><div className="mt-3 grid gap-4 lg:grid-cols-3"><div><h3 className="text-sm font-semibold text-white">1. Start with a world</h3><p className="mt-1 text-xs leading-5 text-slate-400">Concrete objects and visible changes come before equations or terminology.</p></div><div><h3 className="text-sm font-semibold text-white">2. Ask for a commitment</h3><p className="mt-1 text-xs leading-5 text-slate-400">The learner must predict before the system explains.</p></div><div><h3 className="text-sm font-semibold text-white">3. End with transfer</h3><p className="mt-1 text-xs leading-5 text-slate-400">The final test asks whether the learner can use the rule somewhere new.</p></div></div></section>

    <div className="flex flex-wrap gap-3"><Link href="/self-evolving-engine" className="inline-flex items-center gap-2 rounded-md border border-lime-signal/35 bg-lime-signal/10 px-4 py-2 text-sm font-medium text-lime-signal hover:bg-lime-signal/20"><Zap className="size-4" /> Run learner test</Link><Link href="/sciloop-flow-designer" className="inline-flex items-center gap-2 rounded-md border border-cyan-signal/30 bg-cyan-signal/8 px-4 py-2 text-sm font-medium text-cyan-signal hover:bg-cyan-signal/15"><GitBranch className="size-4" /> Edit shared flow</Link></div>
  </div>;
}
