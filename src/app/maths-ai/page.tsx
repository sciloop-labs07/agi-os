import { BrainCircuit, CheckCircle2, GitBranch, Sigma, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { AppShell } from "@/components/app-shell";
import { HumanUnderstandingOptimizationLab } from "@/components/human-understanding-optimization-lab";
import { MathImaginationPanel } from "@/components/math-imagination-panel";
import { MathsAIExecutionPanel } from "@/components/maths-ai-execution-panel";
import { VerifiedExperimentMode } from "@/components/verified-experiment-mode";
import { RewriteCognitionLab } from "@/components/rewrite-cognition-lab";
import { RuleForgeDashboard } from "@/components/ruleforge-dashboard";
import { Kicker, Panel } from "@/components/ui/panel";
import { mathsAgents, mathsMemoryStructures, mathsPrototypePlan, mathsRealityGates, mathsSelectionMetrics } from "@/lib/maths-ai";

export default function MathsAIPortalPage() {
  return (
    <AppShell active="/maths-ai">
      <section className="rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(72,229,255,0.16),rgba(182,255,97,0.08),rgba(255,95,143,0.08))] p-6 shadow-glow">
        <div className="flex flex-wrap gap-3">
          <span className="rounded-md border border-cyan-signal/30 bg-cyan-signal/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-cyan-signal">
            special ai portal
          </span>
          <span className="rounded-md border border-lime-signal/25 bg-lime-signal/10 px-3 py-1 font-mono text-xs text-lime-signal">
            bounded experimental ecosystem
          </span>
        </div>
        <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-tight text-white md:text-6xl">
          Maths AI — Bounded Experimental Intelligence Lab
        </h1>
        <p className="mt-5 max-w-4xl text-base leading-7 text-slate-300">
          A local laboratory for bounded hypothesis search, deterministic verification, counterexamples, and reproducible comparison against fixed baselines.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/ai-maps/maths-ai" className="rounded-md bg-cyan-signal px-4 py-2 text-sm font-semibold text-slate-950">
            Open Maths AI map
          </Link>
          <Link href="/paradigms/maths-ai" className="rounded-md border border-cyan-signal/30 bg-cyan-signal/8 px-4 py-2 text-sm font-semibold text-cyan-signal">
            Structured portal
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          ["Hypothesis search", "Experimental"],
          ["Verification", "Independent adapters only"],
          ["Resource model", "Bounded local runs"],
          ["Capability claim", "None beyond executed evidence"]
        ].map(([label, value]) => <Panel key={label}><Kicker>{label}</Kicker><p className="mt-3 text-sm font-semibold text-white">{value}</p></Panel>)}
      </section>

      <section className="mt-6">
        <MathsAIExecutionPanel />
      </section>

      <section className="mt-6">
        <VerifiedExperimentMode />
      </section>

      <section className="mt-6">
        <RewriteCognitionLab />
      </section>

      <section className="mt-6">
        <MathImaginationPanel />
      </section>

      <section className="mt-6">
        <HumanUnderstandingOptimizationLab />
      </section>

      <section className="mt-6">
        <RuleForgeDashboard />
      </section>

      <section className="mt-6">
        <div data-theorem-ecosystem-root>
          <div className="rounded-lg border border-white/10 bg-panel/80 p-6 text-sm text-slate-300">
            Loading Living Theorem Ecosystem...
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
        <Panel>
          <Kicker>Internal Cognitive Civilization</Kicker>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {mathsAgents.map((agent) => (
              <div key={agent.name} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <BrainCircuit className="size-5 text-cyan-signal" />
                <h2 className="mt-3 text-lg font-semibold text-white">{agent.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{agent.role}</p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-lime-signal">{agent.priority}</p>
              </div>
            ))}
          </div>
        </Panel>
        <div className="space-y-4">
          <Panel>
            <Kicker>Fundamental Hypothesis</Kicker>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Intelligence is not a static model. It emerges from recursive interaction, transformation reasoning,
              compression, simulation, evolutionary adaptation, and structured self-correction.
            </p>
          </Panel>
          <Panel>
            <Kicker>Reality Is Final Judge</Kicker>
            <div className="mt-4 grid gap-2">
              {mathsRealityGates.map((gate) => (
                <div key={gate} className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
                  <ShieldCheck className="size-4 text-lime-signal" />
                  {gate}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel>
          <Kicker>Persistent Memory</Kicker>
          <div className="mt-4 space-y-3">
            {mathsMemoryStructures.map((item) => (
              <div key={item.name} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <Kicker>Evolutionary Selection</Kicker>
          <div className="mt-4 flex flex-wrap gap-2">
            {mathsSelectionMetrics.map((metric) => (
              <span key={metric} className="rounded-md border border-cyan-signal/20 bg-cyan-signal/8 px-2 py-1 text-xs text-cyan-signal">
                {metric}
              </span>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-rose-signal/25 bg-rose-signal/8 p-4">
            <h3 className="text-sm font-semibold text-rose-signal">Weak structures die</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Variants that fail proofs, tests, simulations, or compression benchmarks are archived with failure reasons.
            </p>
          </div>
          <div className="mt-4 rounded-lg border border-lime-signal/25 bg-lime-signal/8 p-4">
            <h3 className="text-sm font-semibold text-lime-signal">Strong structures survive</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Variants that improve correctness, abstraction, transfer, and efficiency become parents for the next generation.
            </p>
          </div>
        </Panel>
        <Panel>
          <Kicker>Version 0.1 Build Plan</Kicker>
          <div className="mt-4 space-y-3">
            {mathsPrototypePlan.map((step) => (
              <div key={step.phase} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center gap-2 text-cyan-signal">
                  <CheckCircle2 className="size-4" />
                  <h3 className="text-sm font-semibold">{step.phase}</h3>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">{step.body}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          [Sigma, "Mathematical reasoning", "Autonomously generate proofs, counterexamples, invariants, abstractions, and transformations."],
          [GitBranch, "Recursive evolution", "Mutate cognitive strategies while preserving lineage, rollback, and hard validation."],
          [Sparkles, "Scientific emergence", "Search for structures that compress reality better than brute-force prediction."]
        ].map(([Icon, title, body]) => {
          const RenderIcon = Icon as typeof Sigma;
          return (
            <Panel key={title as string}>
              <RenderIcon className="size-5 text-cyan-signal" />
              <h2 className="mt-3 text-lg font-semibold text-white">{title as string}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body as string}</p>
            </Panel>
          );
        })}
      </section>
      <Script src="/js/math-ai/theorem-ecosystem.js" type="module" strategy="afterInteractive" />
    </AppShell>
  );
}
