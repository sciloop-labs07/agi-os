"use client";

import { BrainCircuit, FlaskConical, Gauge, Lightbulb, Orbit, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Kicker, Panel } from "@/components/ui/panel";
import type { ImaginationMode, ImaginationResult } from "@/lib/imagination";

const modeOptions: Array<{ value: ImaginationMode; label: string; icon: typeof Orbit }> = [
  { value: "world", label: "World", icon: Orbit },
  { value: "invention", label: "Invention", icon: Lightbulb },
  { value: "strategy", label: "Strategy", icon: BrainCircuit },
  { value: "safety", label: "Safety", icon: ShieldCheck }
];

const starterConstraints = ["energy", "memory bandwidth", "human oversight", "fabrication", "evaluation", "latency"];

export function ImaginationLab() {
  const [seed, setSeed] = useState("An AI research system that can dream possible AGI architectures before building them");
  const [mode, setMode] = useState<ImaginationMode>("world");
  const [horizon, setHorizon] = useState(7);
  const [novelty, setNovelty] = useState(72);
  const [constraints, setConstraints] = useState<string[]>(["energy", "evaluation", "human oversight"]);
  const [result, setResult] = useState<ImaginationResult | null>(null);
  const [source, setSource] = useState("waiting");
  const [loading, setLoading] = useState(false);

  const constraintText = useMemo(() => constraints.join(", "), [constraints]);

  async function imagine() {
    setLoading(true);
    const response = await fetch("/api/imagination/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed, mode, horizon, novelty, constraints })
    });
    const data = (await response.json()) as { source: string; result: ImaginationResult };
    if (response.ok) {
      setResult(data.result);
      setSource(data.source);
    }
    setLoading(false);
  }

  function toggleConstraint(item: string) {
    setConstraints((current) => (current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Panel className="h-fit">
        <Kicker>Imagination Controls</Kicker>
        <h2 className="mt-3 text-2xl font-semibold text-white">Give the AI a world seed</h2>
        <label className="mt-5 block text-sm font-medium text-slate-300" htmlFor="imagination-seed">
          Seed idea
        </label>
        <textarea
          id="imagination-seed"
          value={seed}
          onChange={(event) => setSeed(event.target.value)}
          className="mt-2 min-h-36 w-full resize-none rounded-md border border-white/10 bg-black/25 p-3 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-signal/60"
        />

        <div className="mt-5">
          <div className="mb-2 text-sm font-medium text-slate-300">Mode</div>
          <div className="grid grid-cols-2 gap-2">
            {modeOptions.map((item) => {
              const Icon = item.icon;
              const active = mode === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMode(item.value)}
                  className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                    active ? "border-cyan-signal/60 bg-cyan-signal/12 text-cyan-signal" : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <Slider label="Time horizon" value={horizon} min={1} max={30} suffix=" years" onChange={setHorizon} />
        <Slider label="Novelty pressure" value={novelty} min={0} max={100} suffix="%" onChange={setNovelty} />

        <div className="mt-5">
          <div className="mb-2 text-sm font-medium text-slate-300">Reality constraints</div>
          <div className="flex flex-wrap gap-2">
            {starterConstraints.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleConstraint(item)}
                className={`rounded-md border px-3 py-1.5 text-xs transition ${
                  constraints.includes(item) ? "border-lime-signal/45 bg-lime-signal/10 text-lime-signal" : "border-white/10 bg-white/[0.03] text-slate-500"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={imagine} disabled={loading || seed.trim().length < 8} className="mt-6 w-full">
          <WandSparkles className="size-4" />
          {loading ? "Imagining..." : "Run imagination loop"}
        </Button>

        <div className="mt-4 rounded-md border border-white/10 bg-black/20 p-3 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
          constraints: {constraintText || "none"} / source: {source}
        </div>
      </Panel>

      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(72,229,255,0.18),transparent_34%),linear-gradient(135deg,rgba(8,18,31,0.96),rgba(5,8,15,0.99))] p-6 shadow-glow">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-signal to-transparent" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-cyan-signal/30 bg-cyan-signal/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-signal">
              imagination engine
            </span>
            <span className="rounded-md border border-amber-300/30 bg-amber-300/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-200">
              speculative, test before trust
            </span>
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-white">AI imagination as disciplined possible-world search.</h1>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-400">
            The AI forms a mental scene, branches counterfactuals, proposes hypotheses, and turns the dream into experiments. It is creative by design, but every imagined world is forced back through constraints, risks, and tests.
          </p>
        </section>

        {result ? <ImaginationOutput result={result} /> : <EmptyState />}
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, suffix, onChange }: { label: string; value: number; min: number; max: number; suffix: string; onChange: (value: number) => void }) {
  return (
    <label className="mt-5 block">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="font-mono text-cyan-signal">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-cyan-signal"
      />
    </label>
  );
}

function EmptyState() {
  return (
    <Panel className="min-h-80">
      <Sparkles className="size-6 text-cyan-signal" />
      <h2 className="mt-4 text-2xl font-semibold text-white">No imagined world yet</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
        Run the loop to generate a mental scene, counterfactuals, research hypotheses, experiments, risks, and next actions.
      </p>
    </Panel>
  );
}

function ImaginationOutput({ result }: { result: ImaginationResult }) {
  return (
    <div className="space-y-6">
      <Panel>
        <Kicker>Mental Scene</Kicker>
        <h2 className="mt-3 text-2xl font-semibold text-white">{result.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">{result.premise}</p>
        <div className="mt-4 rounded-lg border border-cyan-signal/20 bg-cyan-signal/8 p-4 text-sm leading-7 text-cyan-50">
          {result.mentalScene}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(result.scoreVector).map(([key, value]) => (
          <div key={key} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{key}</div>
              <Gauge className="size-4 text-cyan-signal" />
            </div>
            <div className="mt-3 text-2xl font-semibold text-white">{value}%</div>
            <div className="mt-3 h-1.5 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-cyan-signal" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Trace title="Counterfactual Branches" icon={<Orbit className="size-4 text-cyan-signal" />} items={result.counterfactuals} />
        <Trace title="Hypotheses" icon={<Lightbulb className="size-4 text-lime-signal" />} items={result.hypotheses} />
        <Trace title="Experiments" icon={<FlaskConical className="size-4 text-cyan-signal" />} items={result.experiments} />
        <Trace title="Risks" icon={<ShieldCheck className="size-4 text-amber-200" />} items={result.risks} danger />
      </div>

      <Trace title="Next Actions" icon={<WandSparkles className="size-4 text-lime-signal" />} items={result.nextActions} />
    </div>
  );
}

function Trace({ title, icon, items, danger = false }: { title: string; icon: React.ReactNode; items: string[]; danger?: boolean }) {
  return (
    <Panel>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
        {icon}
        {title}
      </h3>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item} className={`rounded-md border p-3 text-sm leading-6 ${danger ? "border-amber-300/25 bg-amber-300/8 text-amber-100" : "border-white/10 bg-black/15 text-slate-300"}`}>
            {item}
          </div>
        ))}
      </div>
    </Panel>
  );
}

