import { AlertTriangle, ExternalLink, GitMerge, Microscope } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { CredibilityGrid } from "@/components/credibility-grid";
import { Kicker, Panel } from "@/components/ui/panel";
import type { FrontierItem } from "@/lib/types";

export function FrontierItemCard({ item }: { item: FrontierItem }) {
  return (
    <Panel>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <Kicker>{item.sourceName} / {item.status.replaceAll("_", " ")}</Kicker>
          <h2 className="mt-2 text-xl font-semibold text-white">{item.title}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.paradigms.map((paradigm) => (
              <span key={paradigm} className="rounded-md border border-cyan-signal/20 bg-cyan-signal/8 px-2 py-1 font-mono text-[10px] uppercase text-cyan-signal">
                {paradigm}
              </span>
            ))}
          </div>
        </div>
        <Link href={item.url} className="inline-flex items-center gap-2 text-sm text-cyan-signal">
          Source <ExternalLink className="size-4" />
        </Link>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-4 md:grid-cols-2">
          <SignalBlock icon={<Microscope className="size-4" />} title="Claims" values={item.claims} />
          <SignalBlock icon={<GitMerge className="size-4" />} title="Convergence" values={item.convergenceSignals} />
          <SignalBlock icon={<AlertTriangle className="size-4" />} title="Bottlenecks" values={item.bottlenecks} />
          <SignalBlock icon={<Microscope className="size-4" />} title="Opportunities" values={item.innovationOpportunities} />
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Research importance</span>
            <span className="font-mono text-xl text-lime-signal">{item.importance}</span>
          </div>
          <CredibilityGrid score={item.credibility} />
        </div>
      </div>
    </Panel>
  );
}

function SignalBlock({ icon, title, values }: { icon: React.ReactNode; title: string; values: string[] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <span className="text-cyan-signal">{icon}</span>
        {title}
      </div>
      <ul className="mt-3 space-y-2">
        {values.map((value) => (
          <li key={value} className="text-sm leading-6 text-slate-400">{value}</li>
        ))}
      </ul>
    </div>
  );
}
