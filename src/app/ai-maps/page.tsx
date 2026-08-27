import { Map, Zap } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Kicker, Panel } from "@/components/ui/panel";
import { paradigmEmergenceMaps } from "@/lib/paradigm-emergence-maps";

export default function AIMapsPage() {
  return (
    <AppShell active="/ai-maps">
      <Kicker>Paradigm-Specific Intelligence Maps</Kicker>
      <h1 className="mt-3 text-3xl font-semibold text-white">How each AI paradigm becomes intelligence</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
        Each map shows the emergence path for a specific paradigm: substrate, signal encoding, representation, learning,
        architecture, weak point, innovation zone, AGI contribution, and ASI pressure.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {paradigmEmergenceMaps.map((map) => (
          <Link key={map.slug} href={`/ai-maps/${map.slug}`} className="group block">
            <Panel className="h-full transition group-hover:-translate-y-1 group-hover:border-cyan-signal/45 group-hover:bg-cyan-signal/8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-11 items-center justify-center rounded-md border border-cyan-signal/25 bg-cyan-signal/10">
                  <Map className="size-5 text-cyan-signal" />
                </div>
                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] uppercase text-slate-400">
                  {map.nodes.length} nodes
                </span>
              </div>
              <h2 className="mt-5 text-lg font-semibold text-white">{map.name}</h2>
              <p className="mt-3 min-h-24 text-sm leading-6 text-slate-400">{map.thesis}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-cyan-signal">
                <Zap className="size-4" />
                Open emergence map
              </div>
            </Panel>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
