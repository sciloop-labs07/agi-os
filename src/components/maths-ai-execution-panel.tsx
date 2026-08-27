import { CheckCircle2, FileCode2, FlaskConical, Gauge, TerminalSquare } from "lucide-react";
import { getMathsAIStatus } from "@/lib/maths-ai-status";
import { Kicker, Panel } from "@/components/ui/panel";

export function MathsAIExecutionPanel({ compact = false }: { compact?: boolean }) {
  const status = getMathsAIStatus();
  const existingArtifacts = status.artifacts.filter((artifact) => artifact.exists);

  return (
    <Panel>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <Kicker>Legacy Simulation Build</Kicker>
          <h2 className="mt-3 text-2xl font-semibold text-white">Local simulation components and build checks</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            These are deterministic local simulation diagnostics, not independently verified mathematical discoveries. Verified evidence appears only in Verified Experimental Mode.
          </p>
        </div>
        <div className="rounded-md border border-lime-signal/25 bg-lime-signal/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-lime-signal">
          simulation-only
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard label="simulated agents" value={status.metrics.agents} icon={<Gauge className="size-4" />} />
        <MetricCard label="simulation ticks" value={status.metrics.ticks} icon={<FlaskConical className="size-4" />} />
        <MetricCard label="simulation accepts" value={status.metrics.acceptedTheorems} icon={<CheckCircle2 className="size-4" />} />
        <MetricCard label="artifacts" value={existingArtifacts.length} icon={<FileCode2 className="size-4" />} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <TerminalSquare className="size-4 text-cyan-signal" />
            Commands verified
          </h3>
          <div className="mt-3 space-y-2">
            {status.commands.map((command) => (
              <div key={command.command} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between gap-3">
                  <code className="text-xs text-cyan-signal">{command.command}</code>
                  <span className="font-mono text-[10px] uppercase text-lime-signal">{command.result}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-400">{command.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <FileCode2 className="size-4 text-cyan-signal" />
            Generated files
          </h3>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {existingArtifacts.slice(0, compact ? 6 : 14).map((artifact) => (
              <div key={artifact.path} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="truncate font-mono text-xs text-slate-200">{artifact.path}</div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                  {artifact.size} bytes
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!compact && (
        <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-4">
          <h3 className="text-sm font-semibold text-white">Latest simulation events (not verifier evidence)</h3>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {status.latestEvents.map((event) => (
              <div key={event} className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs leading-5 text-slate-400">
                {event}
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-3 text-cyan-signal">
        {icon}
        <span className="font-mono text-2xl">{typeof value === "number" ? Math.round(value * 100) / 100 : value}</span>
      </div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
    </div>
  );
}
