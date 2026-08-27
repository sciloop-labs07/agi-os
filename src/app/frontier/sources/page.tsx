import { AppShell } from "@/components/app-shell";
import { Kicker, Panel } from "@/components/ui/panel";
import { frontierSources } from "@/lib/frontier/sources";

export default function FrontierSourcesPage() {
  return (
    <AppShell active="/frontier">
      <Kicker>Source Monitor Registry</Kicker>
      <h1 className="mt-3 text-3xl font-semibold text-white">Live intelligence sources</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
        These monitors cover papers, code, models, labs, news, patents, funding rounds, and benchmark releases.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {frontierSources.map((source) => (
          <Panel key={source.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-signal">{source.kind} / {source.cadence}</p>
                <h2 className="mt-2 text-lg font-semibold text-white">{source.name}</h2>
              </div>
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] uppercase text-slate-400">
                {source.monitorStrategy}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {source.focus.map((focus) => (
                <span key={focus} className="rounded-md bg-cyan-signal/8 px-2 py-1 text-xs text-slate-300">{focus}</span>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </AppShell>
  );
}
