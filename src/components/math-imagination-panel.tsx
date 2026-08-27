"use client";

import { BrainCircuit, FlaskConical, GitBranch, Orbit, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Kicker, Panel } from "@/components/ui/panel";
import type { MathImaginationMode, MathImaginationResult } from "@/math-ai/imagination/mathImaginationEngine";

const modes: Array<{ value: MathImaginationMode; label: string }> = [
  { value: "alternative", label: "Equation" },
  { value: "geometry", label: "Geometry" },
  { value: "proof", label: "Proof" },
  { value: "introspection", label: "Latent" }
];

export function MathImaginationPanel() {
  const [problem, setProblem] = useState("x^2 + 2x + 1 = 0");
  const [goal, setGoal] = useState("preserve the invariant while creating a useful transformed equation");
  const [mode, setMode] = useState<MathImaginationMode>("alternative");
  const [temperature, setTemperature] = useState(0.72);
  const [steps, setSteps] = useState(8);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MathImaginationResult | null>(null);

  async function run() {
    setLoading(true);
    const response = await fetch("/api/maths-ai/imagine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problem, goal, mode, temperature, steps })
    });
    const data = (await response.json()) as { result: MathImaginationResult };
    if (response.ok) setResult(data.result);
    setLoading(false);
  }

  return (
    <Panel>
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
        <div>
          <Kicker>Math Imagination Engine v2</Kicker>
          <h2 className="mt-3 text-2xl font-semibold text-white">Latent equation dreams with validity gates</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
            Inspired by your PyTorch sketch: structural latent encoding, parameter blending, diffusion-style mutation, rule retrieval, validity checks, proof-step imagination, geometric trajectory frames, and self-critique.
          </p>
        </div>
        <div className="rounded-md border border-cyan-signal/25 bg-cyan-signal/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-signal">
          deterministic local v2
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-300">Problem or equation</span>
            <textarea
              value={problem}
              onChange={(event) => setProblem(event.target.value)}
              className="mt-2 min-h-28 w-full resize-none rounded-md border border-white/10 bg-black/25 p-3 text-sm text-slate-100 outline-none focus:border-cyan-signal/60"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-300">Goal</span>
            <input
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-white/10 bg-black/25 px-3 text-sm text-slate-100 outline-none focus:border-cyan-signal/60"
            />
          </label>
          <div>
            <span className="text-sm font-medium text-slate-300">Mode</span>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {modes.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMode(item.value)}
                  className={`rounded-md border px-2 py-2 text-xs transition ${
                    mode === item.value ? "border-cyan-signal/50 bg-cyan-signal/10 text-cyan-signal" : "border-white/10 bg-white/[0.03] text-slate-500"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <Slider label="Temperature" value={temperature} min={0.05} max={1} step={0.01} onChange={setTemperature} />
          <Slider label="Trajectory steps" value={steps} min={3} max={16} step={1} onChange={setSteps} />
          <Button onClick={run} disabled={loading || problem.trim().length < 4} className="w-full">
            <WandSparkles className="size-4" />
            {loading ? "Imagining..." : "Imagine math variant"}
          </Button>
        </div>

        {result ? <ResultView result={result} /> : <Empty />}
      </div>
    </Panel>
  );
}

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="font-mono text-cyan-signal">{value}</span>
      </div>
      <input className="w-full accent-cyan-signal" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Empty() {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
      <Sparkles className="size-6 text-cyan-signal" />
      <h3 className="mt-4 text-xl font-semibold text-white">Waiting for a math imagination run</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        The result will include an imagined equation, retrieved transformation rules, validity notes, critique scores, trajectory frames, proof step, and latent introspection.
      </p>
    </div>
  );
}

function ResultView({ result }: { result: MathImaginationResult }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-cyan-signal/20 bg-cyan-signal/8 p-4">
        <div className="flex items-center gap-2 text-cyan-signal">
          <BrainCircuit className="size-4" />
          <h3 className="text-sm font-semibold">Imagined equation</h3>
        </div>
        <code className="mt-3 block text-lg text-white">{result.imaginedEquation}</code>
        <p className="mt-3 text-sm leading-6 text-slate-300">{result.introspection}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Score label="novelty" value={result.critique.noveltyScore} />
        <Score label="logic" value={result.critique.logicScore} />
        <Score label="utility" value={result.critique.utilityScore} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Trace title="Retrieved Rules" icon={<GitBranch className="size-4 text-cyan-signal" />} items={result.retrievedRules} />
        <Trace title="Validity Filter" icon={<ShieldCheck className="size-4 text-lime-signal" />} items={result.validity.notes} />
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-2 text-lime-signal">
          <FlaskConical className="size-4" />
          <h3 className="text-sm font-semibold">Imagined proof step</h3>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-300">{result.imaginedProofStep}</p>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center gap-2 text-cyan-signal">
          <Orbit className="size-4" />
          <h3 className="text-sm font-semibold">Geometric trajectory</h3>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {result.geometricTrajectory.slice(0, 8).map((frame) => (
            <div key={`${frame.t}-${frame.equation}`} className="rounded-md border border-white/10 bg-black/15 p-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">t = {frame.t}</div>
              <code className="mt-1 block text-xs text-cyan-signal">{frame.equation}</code>
              <p className="mt-2 text-xs leading-5 text-slate-400">{frame.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  const percent = Math.round(value * 100);
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-white/10">
        <div className="h-full rounded-full bg-cyan-signal" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function Trace({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
        {icon}
        {title}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-md border border-white/10 bg-black/15 px-2 py-1 text-xs text-slate-300">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

