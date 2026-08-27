import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { RuleForgeDashboard } from "@/components/ruleforge-dashboard";

export default function RuleForgePortalPage() {
  return (
    <AppShell active="/ruleforge">
      <section className="rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(182,255,97,0.14),rgba(72,229,255,0.1),rgba(255,95,143,0.06))] p-6 shadow-glow">
        <div className="flex flex-wrap gap-3">
          <span className="rounded-md border border-lime-signal/30 bg-lime-signal/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-lime-signal">
            dedicated ai portal
          </span>
          <span className="rounded-md border border-cyan-signal/30 bg-cyan-signal/10 px-3 py-1 font-mono text-xs text-cyan-signal">
            RuleForge + MetaObserver
          </span>
        </div>
        <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-tight text-white md:text-6xl">
          RuleForge AI — Self-Evolving Internet-Learning Symbolic Engine
        </h1>
        <p className="mt-5 max-w-4xl text-base leading-7 text-slate-300">
          Assign a learning task, observe trusted sources, extract structured claims, generate symbolic rules,
          sandbox-test them, and let MetaObserver recommend the safest next direction.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/explorer" className="rounded-md border border-cyan-signal/30 bg-cyan-signal/8 px-4 py-2 text-sm font-semibold text-cyan-signal">
            Backend launch gate
          </Link>
          <Link href="/maths-ai" className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-slate-200">
            Maths AI lab
          </Link>
        </div>
      </section>

      <section className="mt-6">
        <RuleForgeDashboard />
      </section>
    </AppShell>
  );
}
