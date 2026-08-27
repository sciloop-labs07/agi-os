import { notFound } from "next/navigation";
import { MetricsRadar } from "@/components/metrics-radar";
import { AppShell } from "@/components/app-shell";
import { LinkButton } from "@/components/ui/button";
import { Kicker, MetricBar, Panel } from "@/components/ui/panel";
import { paradigmBySlug, paradigms } from "@/lib/paradigms";
import { scoreColor } from "@/lib/utils";

export function generateStaticParams() {
  return paradigms.map((paradigm) => ({ slug: paradigm.slug }));
}

export default async function ParadigmPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const paradigm = paradigmBySlug(slug);
  if (!paradigm) notFound();

  return (
    <AppShell active="/explorer">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-white/10 bg-cyan-signal/8 p-6">
          <Kicker>{paradigm.family}</Kicker>
          <h1 className="mt-3 text-4xl font-semibold text-white">{paradigm.name}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">{paradigm.thesis}</p>
          <p className="mt-4 text-sm leading-6 text-slate-400">{paradigm.summary}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <LinkButton href="/workspace" variant="outline">Create research note</LinkButton>
            <LinkButton href={`/ai-maps/${paradigm.slug}`} variant="outline">Open intelligence map</LinkButton>
            <LinkButton href="/roadmap" variant="ghost">Map execution path</LinkButton>
          </div>
        </section>
        <Panel>
          <Kicker>Capability Geometry</Kicker>
          <MetricsRadar paradigm={paradigm} />
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Panel><MetricBar label="Maturity" value={paradigm.maturity} /></Panel>
        <Panel><MetricBar label="AGI potential" value={paradigm.metrics.agiPotential} /></Panel>
        <Panel><MetricBar label="Scalability" value={paradigm.metrics.scalability} /></Panel>
        <Panel><MetricBar label="Safety score" value={paradigm.metrics.safety} /></Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <KnowledgeSection title="Core Principles" items={paradigm.principles} />
        <KnowledgeSection title="Mechanism" items={paradigm.mechanism} ordered />
        <KnowledgeSection title="Advantages" items={paradigm.advantages} />
        <KnowledgeSection title="Disadvantages" items={paradigm.disadvantages} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <Kicker>Models & Mathematics</Kicker>
          <div className="mt-4 space-y-4">
            {paradigm.equations.map((equation) => (
              <div key={equation.label} className="rounded-lg border border-white/10 bg-black/20 p-4">
                <h3 className="text-sm font-semibold text-white">{equation.label}</h3>
                <code className="mt-3 block overflow-x-auto rounded-md bg-slate-950 p-3 font-mono text-xs text-lime-signal">{equation.expression}</code>
                <p className="mt-3 text-sm leading-6 text-slate-400">{equation.explanation}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <Kicker>Execution Layer</Kicker>
          <ol className="mt-4 space-y-3">
            {paradigm.roadmap.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-slate-300">
                <span className="font-mono text-cyan-signal">{String(index + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <ScoredSection title="Bottlenecks" items={paradigm.bottlenecks} />
        <ScoredSection title="Innovation Opportunities" items={paradigm.opportunities} />
        <Panel>
          <Kicker>Alignment Implications</Kicker>
          <p className="mt-4 text-sm leading-6 text-slate-300">{paradigm.alignment}</p>
          <div className="mt-5 space-y-3">
            {paradigm.risks.map((risk) => (
              <div key={risk.title} className="rounded-lg border border-rose-signal/20 bg-rose-signal/5 p-3">
                <h3 className="text-sm font-semibold text-rose-signal">{risk.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">{risk.body}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}

function KnowledgeSection({ title, items, ordered = false }: { title: string; items: { title: string; body: string }[]; ordered?: boolean }) {
  const List = ordered ? "ol" : "div";
  return (
    <Panel>
      <Kicker>{title}</Kicker>
      <List className="mt-4 space-y-4">
        {items.map((item, index) => (
          <div key={item.title} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <h3 className="text-sm font-semibold text-white">{ordered ? `${index + 1}. ` : ""}{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
          </div>
        ))}
      </List>
    </Panel>
  );
}

function ScoredSection({ title, items }: { title: string; items: { title: string; body: string; score: number }[] }) {
  return (
    <Panel>
      <Kicker>{title}</Kicker>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <span className={`font-mono text-sm ${scoreColor(item.score)}`}>{item.score}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
