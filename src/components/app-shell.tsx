import { Activity, Atom, Binary, BrainCircuit, CircleDollarSign, Crown, FlaskConical, GitBranch, LineChart, Map, MessageSquareText, Moon, Network, NotebookTabs, Orbit, Radar, Route, ShieldAlert, Sigma, Sparkles, UserRound, WandSparkles, Workflow, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Command", icon: Orbit },
  { href: "/personal", label: "Personal OS", icon: Activity },
  { href: "/founder-network", label: "Founder Net", icon: Network },
  { href: "/money-universe", label: "Money Universe", icon: CircleDollarSign },
  { href: "/ship-check", label: "AI Ship Check", icon: ShieldAlert },
  { href: "/sciloop", label: "SciLoop Synthesis", icon: Sparkles },
  { href: "/sciloop-flow-designer", label: "SciLoop Flow", icon: Workflow },
  { href: "/cognitive-engine-laboratory", label: "Cognitive Lab", icon: FlaskConical },
  { href: "/sciloop-best-engine", label: "Visual Engine", icon: Sparkles },
  { href: "/self-evolving-engine", label: "Evolving Engine", icon: Zap },
  { href: "/frontier", label: "Frontier", icon: Radar },
  { href: "/emergence-map", label: "Emergence", icon: Map },
  { href: "/ai-maps", label: "AI Maps", icon: Map },
  { href: "/maths-ai", label: "Maths AI", icon: Sigma },
  { href: "/ruleforge", label: "RuleForge", icon: BrainCircuit },
  { href: "/imagination", label: "Imagine", icon: WandSparkles },
  { href: "/shadow-field-theory", label: "Shadow Field", icon: Moon },
  { href: "/negative-trace-intelligence", label: "NTI Lab", icon: BrainCircuit },
  { href: "/explorer", label: "Paradigms", icon: BrainCircuit },
  { href: "/graph", label: "Graph", icon: GitBranch },
  { href: "/comparison", label: "Compare", icon: Binary },
  { href: "/workspace", label: "Workspace", icon: NotebookTabs },
  { href: "/roadmap", label: "Roadmap", icon: Route },
  { href: "/simulation", label: "Simulation", icon: LineChart },
  { href: "/architecture", label: "System", icon: Workflow },
  { href: "/feedback", label: "Feedback", icon: MessageSquareText },
  { href: "/premium", label: "Premium", icon: Crown },
  { href: "/login", label: "Account", icon: UserRound }
];

export function AppShell({ children, active }: { children: React.ReactNode; active?: string }) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 overflow-y-auto border-r border-white/10 bg-slate-950 px-4 py-5 lg:block">
        <Link href="/" className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.05]">
          <div className="flex size-10 items-center justify-center rounded-lg border border-cyan-signal/30 bg-cyan-signal/10">
            <Atom className="size-5 text-cyan-signal" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">AGI OS</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">intelligence workspace</div>
          </div>
        </Link>
        <div className="mt-8 px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Workspace</div>
        <nav className="mt-2 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-white",
                  isActive && "bg-cyan-signal/10 font-medium text-cyan-signal"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950 px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-semibold text-cyan-signal">AGI OS</Link>
          <span className="font-mono text-xs text-slate-500">workspace</span>
        </div>
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={cn("shrink-0 rounded-md border border-white/10 px-3 py-1.5 text-xs text-slate-400", active === item.href && "border-cyan-signal/30 bg-cyan-signal/10 text-cyan-signal")}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
