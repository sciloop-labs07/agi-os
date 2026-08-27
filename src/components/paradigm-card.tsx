import { ArrowRight, CircuitBoard, Zap } from "lucide-react";
import Link from "next/link";
import type { Paradigm } from "@/lib/types";
import { MetricBar, Panel } from "@/components/ui/panel";

export function ParadigmCard({ paradigm }: { paradigm: Paradigm }) {
  return (
    <Panel className="flex h-full flex-col justify-between p-4">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">{paradigm.family}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{paradigm.name}</h3>
          </div>
          <CircuitBoard className="size-5 shrink-0 text-cyan-signal" />
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-400">{paradigm.summary}</p>
        <div className="mt-5 space-y-3">
          <MetricBar label="AGI potential" value={paradigm.metrics.agiPotential} />
          <MetricBar label="Energy efficiency" value={paradigm.metrics.energyEfficiency} />
        </div>
      </div>
      <Link href={`/paradigms/${paradigm.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-signal">
        Open portal <ArrowRight className="size-4" />
      </Link>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <Zap className="size-3.5" />
        Horizon: {paradigm.horizon}
      </div>
    </Panel>
  );
}
