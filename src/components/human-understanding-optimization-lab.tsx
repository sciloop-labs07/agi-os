"use client";

import { BrainCircuit, CheckCircle2, Plus, RotateCcw, Sparkles, WandSparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Kicker, Panel } from "@/components/ui/panel";

type UnderstandingPrimitive =
  | "object"
  | "property"
  | "relation"
  | "action"
  | "time"
  | "space"
  | "state"
  | "flow"
  | "information"
  | "constraint"
  | "observer"
  | "abstraction";

type UnderstandingParameter = {
  id: string;
  name: string;
  primitive: UnderstandingPrimitive;
  influence: number;
  description: string;
};

type ResultParameter = {
  id: string;
  name: string;
  target: number;
  weights: Record<UnderstandingPrimitive, number>;
};

type CandidateScore = {
  values: Record<string, number>;
  resultScores: Record<string, number>;
  total: number;
  explanation: string;
};

const primitiveKeys: UnderstandingPrimitive[] = [
  "object",
  "property",
  "relation",
  "action",
  "time",
  "space",
  "state",
  "flow",
  "information",
  "constraint",
  "observer",
  "abstraction"
];

const defaultParameters: UnderstandingParameter[] = [
  { id: "object", name: "Object", primitive: "object", influence: 92, description: "What exists as a thing, entity, variable, body, agent, or node." },
  { id: "property", name: "Property", primitive: "property", influence: 87, description: "What an object is like: length, mass, color, value, role, capacity, or feature." },
  { id: "relation", name: "Relation", primitive: "relation", influence: 94, description: "How objects connect: equality, distance, causality, ownership, dependency, or similarity." },
  { id: "action", name: "Action", primitive: "action", influence: 84, description: "What changes: transformation, decision, operation, force, mutation, or behavior." },
  { id: "time", name: "Time", primitive: "time", influence: 80, description: "When change occurs: order, duration, rhythm, history, future, deadline, or sequence." },
  { id: "space", name: "Space", primitive: "space", influence: 82, description: "Where things exist: position, boundary, geometry, topology, field, market, or environment." },
  { id: "state", name: "State", primitive: "state", influence: 86, description: "Current condition: stable, active, failed, solved, growing, constrained, or ready." },
  { id: "flow", name: "Energy / Flow", primitive: "flow", influence: 83, description: "Movement and transfer: energy, money, attention, information, force, traffic, or momentum." },
  { id: "information", name: "Information", primitive: "information", influence: 93, description: "Meaning and signals: data, message, uncertainty reduction, pattern, code, or feedback." },
  { id: "constraint", name: "Constraint", primitive: "constraint", influence: 91, description: "Rules and limits: law, boundary, invariant, budget, assumption, condition, or proof gate." },
  { id: "observer", name: "Observer", primitive: "observer", influence: 78, description: "Viewpoint and interpretation: user, scientist, model, frame, bias, measurement, or context." },
  { id: "abstraction", name: "Abstraction", primitive: "abstraction", influence: 96, description: "Level of representation: symbol, model, theorem, class, schema, map, or compressed idea." },
  { id: "pythagoras-example", name: "Pythagoras example", primitive: "relation", influence: 88, description: "A concrete relation primitive: a^2 + b^2 = c^2 connects sides through invariant structure." },
  { id: "visual-analogy", name: "Visual analogy", primitive: "observer", influence: 89, description: "A viewpoint bridge that helps a mind interpret formal structure as something seen." }
];

const defaultResults: ResultParameter[] = [
  { id: "creativity", name: "Creativity", target: 86, weights: makeWeights({ relation: 0.9, action: 1, flow: 0.8, information: 0.9, observer: 0.9, abstraction: 1 }) },
  { id: "clarity", name: "Clarity", target: 92, weights: makeWeights({ object: 1, property: 0.9, relation: 1, constraint: 0.8, observer: 0.7, abstraction: 0.8 }) },
  { id: "transfer", name: "Transfer", target: 84, weights: makeWeights({ relation: 0.9, action: 0.7, state: 0.7, information: 0.8, constraint: 0.8, abstraction: 1 }) },
  { id: "retention", name: "Retention", target: 88, weights: makeWeights({ object: 0.7, property: 0.7, space: 0.8, state: 0.8, information: 0.9, observer: 0.9 }) },
  { id: "prediction", name: "Prediction", target: 82, weights: makeWeights({ action: 0.8, time: 1, state: 0.9, flow: 0.8, information: 0.8, constraint: 0.7 }) },
  { id: "causal-control", name: "Causal control", target: 80, weights: makeWeights({ relation: 1, action: 1, time: 0.8, flow: 0.9, state: 0.7, constraint: 0.9 }) }
];

const primitiveLabels: Record<UnderstandingPrimitive, string> = {
  object: "Object",
  property: "Property",
  relation: "Relation",
  action: "Action",
  time: "Time",
  space: "Space",
  state: "State",
  flow: "Energy / Flow",
  information: "Information",
  constraint: "Constraint",
  observer: "Observer",
  abstraction: "Abstraction"
};

const primitiveColors: Record<UnderstandingPrimitive, string> = {
  object: "#48e5ff",
  property: "#7dd3fc",
  relation: "#b6ff61",
  action: "#c084fc",
  time: "#fbbf24",
  space: "#38bdf8",
  state: "#34d399",
  flow: "#fb7185",
  information: "#22d3ee",
  constraint: "#f97316",
  observer: "#e879f9",
  abstraction: "#a78bfa"
};

export function HumanUnderstandingOptimizationLab() {
  const [parameters, setParameters] = useState(defaultParameters);
  const [results, setResults] = useState(defaultResults);
  const [parameterName, setParameterName] = useState("Triangle intuition");
  const [parameterPrimitive, setParameterPrimitive] = useState<UnderstandingPrimitive>("relation");
  const [resultName, setResultName] = useState("Confidence");
  const [running, setRunning] = useState(false);
  const [iteration, setIteration] = useState(0);
  const [activeCandidate, setActiveCandidate] = useState<CandidateScore | null>(null);
  const [bestCandidate, setBestCandidate] = useState<CandidateScore | null>(null);

  const maxIterations = Math.max(72, parameters.length * results.length);
  const progress = Math.min(100, Math.round((iteration / maxIterations) * 100));

  const roleTotals = useMemo(() => {
    return parameters.reduce<Record<UnderstandingPrimitive, number>>(
      (totals, parameter) => {
        totals[parameter.primitive] += parameter.influence;
        return totals;
      },
      createPrimitiveRecord(0)
    );
  }, [parameters]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setIteration((current) => {
        const next = current + 1;
        const candidate = evaluateCandidate(parameters, results, next);
        setActiveCandidate(candidate);
        setBestCandidate((best) => (!best || candidate.total > best.total ? candidate : best));
        if (next >= maxIterations) setRunning(false);
        return Math.min(next, maxIterations);
      });
    }, 90);

    return () => window.clearInterval(timer);
  }, [maxIterations, parameters, results, running]);

  function startLoop() {
    setIteration(0);
    setActiveCandidate(null);
    setBestCandidate(null);
    setRunning(true);
  }

  function resetLoop() {
    setRunning(false);
    setIteration(0);
    setActiveCandidate(null);
    setBestCandidate(null);
  }

  function addParameter() {
    const name = parameterName.trim();
    if (!name) return;
    setParameters((items) => [
      ...items,
      {
        id: makeId(name, items.length),
        name,
        primitive: parameterPrimitive,
        influence: 68 + ((items.length * 7) % 24),
        description: `User-created ${primitiveLabels[parameterPrimitive]} primitive.`
      }
    ]);
    setParameterName("");
  }

  function addResult() {
    const name = resultName.trim();
    if (!name) return;
    setResults((items) => [
      ...items,
      {
        id: makeId(name, items.length),
        name,
        target: 84,
        weights: makeWeights({})
      }
    ]);
    setResultName("");
  }

  const showcased = bestCandidate ?? activeCandidate;

  return (
    <Panel className="overflow-hidden bg-[radial-gradient(circle_at_16%_10%,rgba(72,229,255,0.16),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(182,255,97,0.12),transparent_28%),linear-gradient(180deg,rgba(7,12,22,0.96),rgba(10,14,24,0.98))]">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md border border-cyan-signal/30 bg-cyan-signal/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-signal">
              Visual Understanding Engine
            </span>
            <span className="rounded-md border border-lime-signal/25 bg-lime-signal/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-lime-signal">
              optimization loop
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">Human Understanding Optimizer</h2>
          <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300">
            Create primitive parameters and result parameters, then let the loop search for the best combination. Every domain can be represented through Object, Property, Relation, Action, Time, Space, State, Flow, Information, Constraint, Observer, and Abstraction.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={startLoop} disabled={running || parameters.length === 0 || results.length === 0}>
            <WandSparkles className="size-4" />
            {running ? "Optimizing..." : "Run loop"}
          </Button>
          <button
            type="button"
            onClick={resetLoop}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.08]"
          >
            <RotateCcw className="size-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <CreatorPanel
            title="Create parameter"
            value={parameterName}
            onValueChange={setParameterName}
            action="Add parameter"
            onAction={addParameter}
          >
            <label className="block">
              <span className="text-xs font-medium text-slate-300">Parameter type</span>
              <select
                value={parameterPrimitive}
                onChange={(event) => setParameterPrimitive(event.target.value as UnderstandingPrimitive)}
                className="mt-2 h-10 w-full rounded-md border border-white/10 bg-black/25 px-3 text-sm text-slate-100 outline-none focus:border-cyan-signal/60"
              >
                {primitiveKeys.map((primitive) => (
                  <option key={primitive} value={primitive}>{primitiveLabels[primitive]}</option>
                ))}
              </select>
            </label>
          </CreatorPanel>

          <CreatorPanel
            title="Create resulting parameter"
            value={resultName}
            onValueChange={setResultName}
            action="Add result parameter"
            onAction={addResult}
          />

          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <Kicker>Loop progress</Kicker>
              <span className="font-mono text-xs text-cyan-signal">{iteration}/{maxIterations}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,#48e5ff,#b6ff61,#ff5f8f)] transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-400">
              The loop tests parameter mixtures, scores the result parameters, keeps the strongest combination, and stops when the search budget ends.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <VisualSearchField
            parameters={parameters}
            results={results}
            activeCandidate={activeCandidate}
            bestCandidate={bestCandidate}
            roleTotals={roleTotals}
          />

          <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <BrainCircuit className="size-4 text-cyan-signal" />
                Parameter space
              </h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {parameters.map((parameter) => (
                  <ParameterCard key={parameter.id} parameter={parameter} />
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-lime-signal/20 bg-lime-signal/8 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-lime-signal">
                <CheckCircle2 className="size-4" />
                {iteration >= maxIterations ? "Best combo found" : "Best combo so far"}
              </h3>
              {showcased ? (
                <BestCombo candidate={showcased} parameters={parameters} results={results} complete={iteration >= maxIterations} />
              ) : (
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  Run the loop to generate combinations and reveal the strongest understanding recipe.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function CreatorPanel({
  title,
  value,
  action,
  children,
  onValueChange,
  onAction
}: {
  title: string;
  value: string;
  action: string;
  children?: React.ReactNode;
  onValueChange: (value: string) => void;
  onAction: () => void;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <label className="mt-3 block">
        <span className="text-xs font-medium text-slate-300">Name</span>
        <input
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          className="mt-2 h-10 w-full rounded-md border border-white/10 bg-black/25 px-3 text-sm text-slate-100 outline-none focus:border-cyan-signal/60"
        />
      </label>
      {children ? <div className="mt-3">{children}</div> : null}
      <button
        type="button"
        onClick={onAction}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-cyan-signal/30 bg-cyan-signal/10 px-3 py-2 text-xs font-semibold text-cyan-signal hover:bg-cyan-signal/15"
      >
        <Plus className="size-4" />
        {action}
      </button>
    </div>
  );
}

function VisualSearchField({
  parameters,
  results,
  activeCandidate,
  bestCandidate,
  roleTotals
}: {
  parameters: UnderstandingParameter[];
  results: ResultParameter[];
  activeCandidate: CandidateScore | null;
  bestCandidate: CandidateScore | null;
  roleTotals: Record<UnderstandingPrimitive, number>;
}) {
  const shownCandidate = activeCandidate ?? bestCandidate;
  const roleEntries = primitiveKeys.map((primitive) => [primitive, roleTotals[primitive]] as const);

  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
          <Sparkles className="size-4 text-lime-signal" />
          Live visual optimization field
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
          {parameters.length} parameters / {results.length} result parameters
        </span>
      </div>
      <svg viewBox="0 0 920 360" className="h-[360px] w-full rounded-md border border-white/10 bg-[#050912]" role="img" aria-label="Human understanding optimization graph">
        <defs>
          <filter id="understanding-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <line x1="245" y1="180" x2="675" y2="180" stroke="#48e5ff" strokeOpacity="0.22" strokeWidth="2" strokeDasharray="6 8" />
        <circle cx="460" cy="180" r="82" fill="rgba(72,229,255,0.08)" stroke="#48e5ff" strokeOpacity="0.35" />
        <circle cx="460" cy="180" r="48" fill="rgba(182,255,97,0.08)" stroke="#b6ff61" strokeOpacity="0.45" filter="url(#understanding-glow)" />
        <text x="460" y="174" textAnchor="middle" className="fill-white text-[13px] font-semibold">OPTIMIZER</text>
        <text x="460" y="193" textAnchor="middle" className="fill-slate-300 text-[10px]">best combo search</text>

        {parameters.slice(0, 12).map((parameter, index) => {
          const y = 30 + index * 25;
          const value = shownCandidate?.values[parameter.id] ?? parameter.influence;
          return (
            <g key={parameter.id}>
              <line x1="220" y1={y} x2="378" y2="180" stroke={primitiveColors[parameter.primitive]} strokeOpacity={0.18 + value / 180} />
              <rect x="28" y={y - 11} width="188" height="22" rx="6" fill="rgba(255,255,255,0.04)" stroke={primitiveColors[parameter.primitive]} strokeOpacity="0.45" />
              <rect x="28" y={y + 8} width={Math.max(8, value * 1.88)} height="3" rx="2" fill={primitiveColors[parameter.primitive]} opacity="0.85" />
              <text x="40" y={y + 4} className="fill-slate-100 text-[9px]">{shorten(parameter.name, 25)}</text>
            </g>
          );
        })}

        {results.slice(0, 6).map((result, index) => {
          const y = 70 + index * 44;
          const score = shownCandidate?.resultScores[result.id] ?? 0;
          return (
            <g key={result.id}>
              <line x1="542" y1="180" x2="690" y2={y} stroke="#b6ff61" strokeOpacity={0.2 + score / 160} />
              <rect x="700" y={y - 16} width="176" height="32" rx="6" fill="rgba(182,255,97,0.055)" stroke="#b6ff61" strokeOpacity="0.4" />
              <rect x="700" y={y + 13} width={Math.max(8, score * 1.76)} height="3" rx="2" fill="#b6ff61" opacity="0.9" />
              <text x="712" y={y + 4} className="fill-slate-100 text-[10px]">{shorten(result.name, 21)} / {Math.round(score)}</text>
            </g>
          );
        })}

        {roleEntries.map(([role, total], index) => (
          <g key={role} transform={`translate(${160 + index * 60} 306)`}>
            <circle r={Math.max(7, Math.min(18, total / 26))} fill={primitiveColors[role]} opacity="0.18" stroke={primitiveColors[role]} />
            <text y="34" textAnchor="middle" className="fill-slate-400 text-[7px]">{primitiveLabels[role]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ParameterCard({ parameter }: { parameter: UnderstandingParameter }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/15 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold text-white">{parameter.name}</h4>
          <p className="mt-1 text-xs text-slate-400">{primitiveLabels[parameter.primitive]}</p>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{parameter.description}</p>
        </div>
        <span className="font-mono text-sm" style={{ color: primitiveColors[parameter.primitive] }}>{parameter.influence}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full" style={{ width: `${parameter.influence}%`, backgroundColor: primitiveColors[parameter.primitive] }} />
      </div>
    </div>
  );
}

function BestCombo({ candidate, parameters, results, complete }: { candidate: CandidateScore; parameters: UnderstandingParameter[]; results: ResultParameter[]; complete: boolean }) {
  const topParameters = parameters
    .map((parameter) => ({ parameter, value: candidate.values[parameter.id] ?? 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="mt-4 space-y-4">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">{complete ? "Final score" : "Current score"}</div>
        <div className="mt-1 text-4xl font-semibold text-white">{Math.round(candidate.total)}</div>
      </div>
      <p className="text-sm leading-6 text-slate-300">{candidate.explanation}</p>
      <div className="space-y-2">
        {topParameters.map(({ parameter, value }) => (
          <div key={parameter.id} className="rounded-md border border-white/10 bg-black/20 p-2">
            <div className="flex justify-between gap-3 text-xs">
              <span className="text-slate-200">{parameter.name}</span>
              <span className="font-mono text-cyan-signal">{Math.round(value)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-2">
        {results.map((result) => (
          <div key={result.id} className="rounded-md border border-lime-signal/15 bg-lime-signal/8 p-2">
            <div className="flex justify-between gap-3 text-xs">
              <span className="text-slate-200">{result.name}</span>
              <span className="font-mono text-lime-signal">{Math.round(candidate.resultScores[result.id] ?? 0)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function evaluateCandidate(parameters: UnderstandingParameter[], results: ResultParameter[], iteration: number): CandidateScore {
  const values = Object.fromEntries(
    parameters.map((parameter, index) => {
      const wave = Math.sin((iteration + index * 5) / (3.7 + index * 0.21));
      const exploration = Math.cos((iteration * (index + 2)) / 11);
      const value = clamp(parameter.influence * 0.58 + 28 + wave * 17 + exploration * 9, 5, 100);
      return [parameter.id, value];
    })
  );

  const primitiveAverages = primitiveKeys.reduce<Record<UnderstandingPrimitive, number>>((averages, primitive) => {
    const matching = parameters.filter((parameter) => parameter.primitive === primitive);
    averages[primitive] = matching.length ? average(matching.map((parameter) => values[parameter.id] ?? 0)) : 48;
    return averages;
  }, createPrimitiveRecord(0));

  const resultScores = Object.fromEntries(
    results.map((result, index) => {
      const weighted = primitiveKeys.reduce((sum, primitive) => sum + primitiveAverages[primitive] * result.weights[primitive], 0);
      const weightTotal = primitiveKeys.reduce((sum, primitive) => sum + result.weights[primitive], 0);
      const harmony = 100 - Math.abs(result.target - weighted / weightTotal);
      const rhythm = Math.sin((iteration + index * 13) / 9) * 4;
      return [result.id, clamp(harmony + rhythm, 0, 100)];
    })
  );

  const total = average(Object.values(resultScores));
  const leadingResult = results
    .map((result) => ({ name: result.name, score: resultScores[result.id] ?? 0 }))
    .sort((a, b) => b.score - a.score)[0];

  return {
    values,
    resultScores,
    total,
    explanation: leadingResult
      ? `The strongest current recipe optimizes ${leadingResult.name} at ${Math.round(leadingResult.score)} by balancing object identity, properties, relations, actions, time, space, state, flow, information, constraints, observer viewpoint, and abstraction level.`
      : "No resulting parameter has been created yet."
  };
}

function makeWeights(overrides: Partial<Record<UnderstandingPrimitive, number>>) {
  return primitiveKeys.reduce<Record<UnderstandingPrimitive, number>>((weights, primitive) => {
    weights[primitive] = overrides[primitive] ?? 0.35;
    return weights;
  }, createPrimitiveRecord(0));
}

function createPrimitiveRecord(value: number) {
  return Object.fromEntries(primitiveKeys.map((primitive) => [primitive, value])) as Record<UnderstandingPrimitive, number>;
}

function makeId(name: string, index: number) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${index}`;
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function shorten(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}...` : text;
}
