import { notFound } from "next/navigation";
import Link from "next/link";
import { ParadigmMapFlow } from "@/components/paradigm-map-flow";
import { AppShell } from "@/components/app-shell";
import { Kicker, Panel } from "@/components/ui/panel";
import { paradigmEmergenceMapBySlug, paradigmEmergenceMaps } from "@/lib/paradigm-emergence-maps";

export function generateStaticParams() {
  return paradigmEmergenceMaps.map((map) => ({ slug: map.slug }));
}

export default async function SingleAIMapPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const map = paradigmEmergenceMapBySlug(slug);
  if (!map) notFound();

  const weakPoint = map.nodes.find((node) => node.kind === "bottleneck");
  const innovation = map.nodes.find((node) => node.kind === "innovation");

  return (
    <AppShell active="/ai-maps">
      <div className="mb-6 grid gap-5 xl:grid-cols-[1fr_380px]">
        <section className="rounded-lg border border-white/10 bg-[linear-gradient(135deg,rgba(72,229,255,0.12),rgba(182,255,97,0.06),rgba(255,95,143,0.08))] p-6">
          <Kicker>Paradigm Emergence Map</Kicker>
          <h1 className="mt-3 text-4xl font-semibold text-white">{map.name}</h1>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">{map.thesis}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/ai-maps" className="rounded-md border border-cyan-signal/30 bg-cyan-signal/8 px-3 py-2 text-sm text-cyan-signal">
              All AI maps
            </Link>
            <Link href={`/paradigms/${map.slug}`} className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
              Open full portal
            </Link>
          </div>
        </section>
        <Panel>
          <Kicker>Weak + Innovation</Kicker>
          <div className="mt-4 rounded-lg border border-rose-signal/25 bg-rose-signal/8 p-4">
            <h2 className="text-sm font-semibold text-rose-signal">Weak point: {weakPoint?.label}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{weakPoint?.weakPoint}</p>
          </div>
          <div className="mt-4 rounded-lg border border-lime-signal/25 bg-lime-signal/8 p-4">
            <h2 className="text-sm font-semibold text-lime-signal">Innovation opportunity: {innovation?.label}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{innovation?.innovation}</p>
          </div>
        </Panel>
      </div>

      <ParadigmMapFlow map={map} />
    </AppShell>
  );
}
