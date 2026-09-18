import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow)]", className)}
      {...props}
    />
  );
}

export function Kicker({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600", className)} {...props} />;
}

export function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
        <span>{label}</span>
        <span className="font-mono text-slate-100">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-blue-600" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  const stableValue = value.replace(/[०-९]/g, (digit) => String("०१२३४५६७८९".indexOf(digit)));
  return <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4"><p className="text-xs text-slate-400">{label}</p><p className="mt-2 text-xl font-semibold text-white">{stableValue}</p>{detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}</div>;
}
