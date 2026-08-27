"use client";

import { Activity, ArrowRight, BrainCircuit, Play, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  analyzeContradiction,
  buildFailureInsight,
  calculateNegativeTrace,
  clamp,
  defaultNTIDataset,
  defaultNTIEvolution,
  detectHiddenAssumptions,
  levelFromScore,
  runNTIAnalysis,
  type FailureInsightInput,
  type NTIDatasetRow,
  type NTIEvolutionEntry,
  type NTIEvent,
  type NegativeTraceInput
} from "@/lib/negative-trace";

const tabs = [
  "NTI Core Theory",
  "Live Visual Simulator",
  "Math Engine",
  "AI Learning Simulator",
  "Live Visual Language Simulator",
  "Negative Dataset Builder",
  "Failure-to-Insight Engine",
  "Hidden Assumption Detector",
  "Contradiction Map",
  "NTI Agent Blueprint",
  "Evolution Log",
  "Future Applications"
] as const;

type Tab = (typeof tabs)[number];

const futureApiEndpoints = [
  "POST /api/nti/trace-score",
  "POST /api/nti/analyze-event",
  "POST /api/nti/failure-insight",
  "POST /api/nti/hidden-assumptions",
  "POST /api/nti/contradiction-map",
  "GET /api/nti/evolution-log"
];

const futureDataSources = [
  "AI conversation logs",
  "failed model outputs",
  "user hesitation events",
  "skipped form steps",
  "abandoned paths",
  "uncertainty/confidence logs",
  "cybersecurity behavior logs",
  "education performance logs",
  "product analytics logs"
];

const visualScenarios = [
  {
    id: "report",
    title: "Report Request",
    visible: "User asks for a report.",
    expected: "Topic, audience, source depth, deadline",
    observed: "Only the request is visible",
    missing: ["audience", "evidence depth", "deadline"],
    trace: "Missing Context Trace",
    insight: "Ask focused questions before generating the report.",
    gain: 82
  },
  {
    id: "proof",
    title: "Math Proof",
    visible: "Student gives the final answer.",
    expected: "Definitions, theorem choice, each inference",
    observed: "Correct answer, skipped reasoning",
    missing: ["proof path", "assumption check", "failed attempts"],
    trace: "Skipped Path Trace",
    insight: "Reconstruct the missing proof steps and test each assumption.",
    gain: 76
  },
  {
    id: "security",
    title: "Security Session",
    visible: "Login succeeds after retries.",
    expected: "Known device, usual timing, stable location",
    observed: "Success without normal behavior signals",
    missing: ["normal timing", "device certainty", "location match"],
    trace: "Absent Normality Trace",
    insight: "Treat missing-normal behavior as a risk signal.",
    gain: 88
  }
] as const;

export function NegativeTraceIntelligenceLab() {
  const [active, setActive] = useState<Tab>("NTI Core Theory");
  const [mathInput, setMathInput] = useState<NegativeTraceInput>({
    expected: 100,
    observed: 68,
    uncertainty: 38,
    missing: 45,
    contradiction: 28,
    failures: 2,
    delay: 35
  });
  const [simEvent, setSimEvent] = useState<NTIEvent>({
    hesitation: true,
    missingData: true,
    contradiction: false,
    failedAttempt: true,
    skippedStep: true,
    lowConfidence: true
  });
  const [dataset, setDataset] = useState<NTIDatasetRow[]>(defaultNTIDataset);
  const [newRow, setNewRow] = useState<NTIDatasetRow>({ input: "", expected: "", actual: "", missing: "", failures: "", contradictions: "", label: "", improved: "" });
  const [failureInput, setFailureInput] = useState<FailureInsightInput>({
    goal: "reduce AI energy use",
    method: "compress model",
    expected: "same quality with less compute",
    actual: "quality dropped",
    whyFailed: "compression removed important reasoning paths",
    hiddenConstraint: "not all parameters are equally disposable",
    newRule: "compress based on functional importance, not size only"
  });
  const [claim, setClaim] = useState("AI will become conscious if it learns from shadows.");
  const [contradiction, setContradiction] = useState({
    a: "Math can define everything.",
    b: "Human experience of darkness cannot be fully captured by numbers."
  });
  const [evolution, setEvolution] = useState<NTIEvolutionEntry[]>(defaultNTIEvolution);
  const [newEntry, setNewEntry] = useState<NTIEvolutionEntry>({
    title: "",
    type: "theorem",
    description: "",
    confidence: 70,
    status: "idea",
    date: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    const savedDataset = window.localStorage.getItem("nti-dataset");
    const savedEvolution = window.localStorage.getItem("nti-evolution");
    if (savedDataset) setDataset(JSON.parse(savedDataset) as NTIDatasetRow[]);
    if (savedEvolution) setEvolution(JSON.parse(savedEvolution) as NTIEvolutionEntry[]);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("nti-dataset", JSON.stringify(dataset));
  }, [dataset]);

  useEffect(() => {
    window.localStorage.setItem("nti-evolution", JSON.stringify(evolution));
  }, [evolution]);

  const ntiScore = useMemo(() => calculateNegativeTrace(mathInput), [mathInput]);
  const simResult = useMemo(() => runNTIAnalysis(simEvent), [simEvent]);
  const failureInsight = useMemo(() => buildFailureInsight(failureInput), [failureInput]);
  const assumptionResult = useMemo(() => detectHiddenAssumptions(claim), [claim]);
  const contradictionResult = useMemo(() => analyzeContradiction(contradiction.a, contradiction.b), [contradiction]);

  function addDatasetRow() {
    if (!newRow.input.trim()) return;
    setDataset((current) => [newRow, ...current]);
    setNewRow({ input: "", expected: "", actual: "", missing: "", failures: "", contradictions: "", label: "", improved: "" });
  }

  function addEvolutionEntry() {
    if (!newEntry.title.trim()) return;
    setEvolution((current) => [{ ...newEntry, date: newEntry.date || new Date().toISOString().slice(0, 10) }, ...current]);
    setNewEntry({ title: "", type: "theorem", description: "", confidence: 70, status: "idea", date: new Date().toISOString().slice(0, 10) });
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.2),transparent_34%),linear-gradient(135deg,rgba(8,18,31,0.96),rgba(5,8,15,0.99))] p-6 shadow-glow md:p-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300 to-transparent" />
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>NTI Lab</Badge>
              <Badge tone="cyan">Math + AI + Shadow Field Theory</Badge>
            </div>
            <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight text-white md:text-6xl">Negative Trace Intelligence</h1>
            <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300 md:text-base">
              Negative Trace Intelligence teaches AI to learn from what did not happen: missing information, failed paths, hidden assumptions, rejected possibilities, uncertainty, contradiction, and invisible context.
            </p>
          </div>
          <div className="rounded-lg border border-fuchsia-300/25 bg-fuchsia-400/10 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">Core formula</div>
            <div className="mt-2 text-xl font-semibold text-white">Negative Trace = Expected - Observed</div>
            <div className="mt-1 font-mono text-xs text-fuchsia-200">NTI turns absence, error, contradiction, and failure into intelligence.</div>
          </div>
        </div>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={`shrink-0 rounded-md border px-4 py-2 text-sm transition ${
                active === tab ? "border-fuchsia-300/60 bg-fuchsia-500 text-white" : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {active === "NTI Core Theory" && <CoreTheory />}
      {active === "Live Visual Simulator" && <LiveVisualSimulator />}
      {active === "Math Engine" && <MathEngine mathInput={mathInput} setMathInput={setMathInput} ntiScore={ntiScore} />}
      {active === "AI Learning Simulator" && <LearningSimulator simEvent={simEvent} setSimEvent={setSimEvent} simResult={simResult} />}
      {active === "Live Visual Language Simulator" && <NTIVisualLanguageSimulator />}
      {active === "Negative Dataset Builder" && <DatasetBuilder dataset={dataset} newRow={newRow} setNewRow={setNewRow} addDatasetRow={addDatasetRow} />}
      {active === "Failure-to-Insight Engine" && <FailureToInsight failureInput={failureInput} setFailureInput={setFailureInput} failureInsight={failureInsight} />}
      {active === "Hidden Assumption Detector" && <HiddenAssumptionDetector claim={claim} setClaim={setClaim} result={assumptionResult} />}
      {active === "Contradiction Map" && <ContradictionMap contradiction={contradiction} setContradiction={setContradiction} result={contradictionResult} />}
      {active === "NTI Agent Blueprint" && <AgentBlueprint />}
      {active === "Evolution Log" && <EvolutionLog evolution={evolution} newEntry={newEntry} setNewEntry={setNewEntry} addEvolutionEntry={addEvolutionEntry} />}
      {active === "Future Applications" && <FutureApplications />}
    </div>
  );
}

function LiveVisualSimulator() {
  const [scenarioId, setScenarioId] = useState<(typeof visualScenarios)[number]["id"]>("report");
  const [runId, setRunId] = useState(1);
  const scenario = visualScenarios.find((item) => item.id === scenarioId) ?? visualScenarios[0];

  function runScenario(id = scenarioId) {
    setScenarioId(id);
    setRunId((current) => current + 1);
  }

  return (
    <Section title="Live Visual Simulator" subtitle="Click a scenario to watch absence turn into an NTI insight.">
      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <Card>
          <div className="flex items-center gap-3">
            <Activity className="size-5 text-cyan-signal" />
            <h3 className="text-xl font-semibold text-white">Choose a process</h3>
          </div>
          <div className="mt-4 grid gap-3">
            {visualScenarios.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => runScenario(item.id)}
                className={`rounded-md border p-3 text-left transition ${
                  scenario.id === item.id
                    ? "border-cyan-signal/45 bg-cyan-signal/12 text-white shadow-[0_0_26px_rgba(72,229,255,0.14)]"
                    : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >
                <span className="text-sm font-semibold">{item.title}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-400">{item.trace}</span>
              </button>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => runScenario()}
              className="inline-flex items-center gap-2 rounded-md bg-cyan-signal px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
            >
              <Play className="size-4" />
              Run visual
            </button>
            <button
              type="button"
              onClick={() => runScenario("report")}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10"
            >
              <RotateCcw className="size-4" />
              Reset
            </button>
          </div>
          <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Visual language</div>
            <div className="mt-3 grid gap-2 text-xs text-slate-300">
              <LegendDot color="cyan" label="visible signal" />
              <LegendDot color="rose" label="missing gap" />
              <LegendDot color="lime" label="new insight" />
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-signal">Live CSS process</div>
              <h3 className="mt-2 text-2xl font-semibold text-white">{scenario.title}</h3>
            </div>
            <div className="rounded-md border border-lime-signal/30 bg-lime-signal/10 px-3 py-2 text-sm text-lime-signal">
              Learning gain {scenario.gain}%
            </div>
          </div>

          <div key={`${scenario.id}-${runId}`} className="nti-live-stage mt-5">
            <div className="nti-scan" />
            <div className="nti-flow-grid">
              <VisualNode index="01" title="Visible input" body={scenario.visible} tone="cyan" />
              <ArrowRight className="nti-flow-arrow" />
              <VisualNode index="02" title="Expected model" body={scenario.expected} tone="slate" />
              <ArrowRight className="nti-flow-arrow" />
              <VisualNode index="03" title="Observed reality" body={scenario.observed} tone="rose" />
              <ArrowRight className="nti-flow-arrow" />
              <VisualNode index="04" title="NTI insight" body={scenario.insight} tone="lime" />
            </div>

            <div className="nti-lane-wrap">
              <div className="nti-lane">
                <span className="nti-lane-label">Expected</span>
                <span className="nti-packet nti-packet-cyan" />
              </div>
              <div className="nti-lane nti-lane-observed">
                <span className="nti-lane-label">Observed</span>
                <span className="nti-packet nti-packet-rose" />
              </div>
              <div className="nti-gap-core">
                <span className="nti-ring" />
                <span className="nti-gap-label">{scenario.trace}</span>
              </div>
            </div>

            <div className="nti-trace-panel">
              <div className="nti-trace-emitter" aria-hidden="true">
                {scenario.missing.map((item, index) => (
                  <span key={item} className="nti-trace-particle" style={{ "--trace-delay": `${index * 0.24}s` } as CSSProperties} />
                ))}
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-rose-signal">Detected gaps</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {scenario.missing.map((item) => (
                    <span key={item} className="rounded-md border border-rose-signal/25 bg-rose-signal/10 px-2 py-1 text-xs text-rose-100">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="nti-memory">
                <BrainCircuit className="size-5 text-lime-signal" />
                <div>
                  <div className="text-sm font-semibold text-white">Trace memory</div>
                  <p className="mt-1 text-xs leading-5 text-slate-400">The missing pieces become reusable knowledge for the next action.</p>
                </div>
              </div>
            </div>
          </div>

          <style jsx>{`
            .nti-live-stage {
              position: relative;
              overflow: hidden;
              min-height: 520px;
              border-radius: 8px;
              border: 1px solid rgba(255, 255, 255, 0.1);
              background:
                linear-gradient(90deg, rgba(72, 229, 255, 0.05) 1px, transparent 1px),
                linear-gradient(rgba(72, 229, 255, 0.05) 1px, transparent 1px),
                radial-gradient(circle at 18% 18%, rgba(72, 229, 255, 0.12), transparent 28%),
                radial-gradient(circle at 78% 70%, rgba(182, 255, 97, 0.1), transparent 24%),
                rgba(2, 6, 23, 0.72);
              background-size: 36px 36px, 36px 36px, auto, auto, auto;
              padding: 18px;
            }

            .nti-scan {
              pointer-events: none;
              position: absolute;
              inset: 0;
              background: linear-gradient(90deg, transparent, rgba(72, 229, 255, 0.16), transparent);
              transform: translateX(-100%);
              animation: nti-scan 4.2s ease-in-out infinite;
            }

            .nti-flow-grid {
              position: relative;
              z-index: 1;
              display: grid;
              grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
              align-items: stretch;
              gap: 10px;
            }

            .nti-flow-arrow {
              align-self: center;
              width: 20px;
              color: rgba(148, 163, 184, 0.76);
              animation: nti-arrow 1.4s ease-in-out infinite;
            }

            .nti-lane-wrap {
              position: relative;
              z-index: 1;
              margin-top: 28px;
              display: grid;
              gap: 16px;
              border-radius: 8px;
              border: 1px solid rgba(255, 255, 255, 0.08);
              background: rgba(0, 0, 0, 0.2);
              padding: 18px;
            }

            .nti-lane {
              position: relative;
              height: 44px;
              overflow: hidden;
              border-radius: 999px;
              border: 1px solid rgba(72, 229, 255, 0.18);
              background: linear-gradient(90deg, rgba(72, 229, 255, 0.12), rgba(72, 229, 255, 0.03));
            }

            .nti-lane-observed {
              border-color: rgba(255, 95, 143, 0.2);
              background: linear-gradient(90deg, rgba(255, 95, 143, 0.12), rgba(255, 95, 143, 0.03));
              width: 72%;
            }

            .nti-lane::after {
              content: "";
              position: absolute;
              inset: 50% 14px auto;
              height: 1px;
              background: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.4) 0 10px, transparent 10px 22px);
            }

            .nti-lane-label {
              position: absolute;
              left: 14px;
              top: 50%;
              z-index: 2;
              transform: translateY(-50%);
              font-family: var(--font-geist-mono), monospace;
              font-size: 10px;
              letter-spacing: 0.14em;
              text-transform: uppercase;
              color: rgba(226, 232, 240, 0.72);
            }

            .nti-packet {
              position: absolute;
              top: 50%;
              left: 16px;
              z-index: 3;
              width: 18px;
              height: 18px;
              border-radius: 999px;
              transform: translateY(-50%);
              animation: nti-packet 2.6s ease-in-out infinite;
            }

            .nti-packet-cyan {
              background: #48e5ff;
              box-shadow: 0 0 24px rgba(72, 229, 255, 0.72);
            }

            .nti-packet-rose {
              background: #ff5f8f;
              box-shadow: 0 0 24px rgba(255, 95, 143, 0.7);
              animation-name: nti-packet-short;
              animation-delay: 0.22s;
            }

            .nti-gap-core {
              position: absolute;
              right: 18px;
              bottom: 24px;
              display: grid;
              place-items: center;
              width: 160px;
              height: 110px;
            }

            .nti-ring,
            .nti-ring::before,
            .nti-ring::after {
              position: absolute;
              width: 72px;
              height: 72px;
              border-radius: 999px;
              border: 1px solid rgba(255, 95, 143, 0.54);
              content: "";
              animation: nti-ring 2.4s ease-out infinite;
            }

            .nti-ring::before {
              inset: -12px;
              width: auto;
              height: auto;
              animation-delay: 0.28s;
            }

            .nti-ring::after {
              inset: -24px;
              width: auto;
              height: auto;
              animation-delay: 0.56s;
            }

            .nti-gap-label {
              z-index: 1;
              max-width: 120px;
              text-align: center;
              font-size: 12px;
              font-weight: 600;
              line-height: 1.35;
              color: #fecdd3;
            }

            .nti-trace-panel {
              position: relative;
              z-index: 1;
              margin-top: 24px;
              display: grid;
              grid-template-columns: minmax(100px, 0.6fr) 1fr minmax(220px, 0.9fr);
              gap: 16px;
              align-items: center;
              border-radius: 8px;
              border: 1px solid rgba(255, 255, 255, 0.08);
              background: rgba(0, 0, 0, 0.2);
              padding: 16px;
            }

            .nti-trace-emitter {
              position: relative;
              min-height: 118px;
              border-radius: 8px;
              border: 1px solid rgba(255, 95, 143, 0.18);
              background: rgba(255, 95, 143, 0.06);
            }

            .nti-trace-particle {
              position: absolute;
              left: 50%;
              top: 18px;
              width: 12px;
              height: 12px;
              border-radius: 999px;
              background: #ff5f8f;
              box-shadow: 0 0 22px rgba(255, 95, 143, 0.72);
              animation: nti-trace-drop 1.8s ease-in-out infinite;
              animation-delay: var(--trace-delay);
            }

            .nti-memory {
              display: flex;
              gap: 12px;
              align-items: flex-start;
              border-radius: 8px;
              border: 1px solid rgba(182, 255, 97, 0.24);
              background: rgba(182, 255, 97, 0.08);
              padding: 14px;
              animation: nti-memory-glow 2.4s ease-in-out infinite;
            }

            @keyframes nti-scan {
              0%,
              22% {
                transform: translateX(-100%);
              }
              60%,
              100% {
                transform: translateX(100%);
              }
            }

            @keyframes nti-arrow {
              0%,
              100% {
                opacity: 0.42;
                transform: translateX(0);
              }
              50% {
                opacity: 1;
                transform: translateX(4px);
              }
            }

            @keyframes nti-packet {
              0% {
                left: 16px;
                transform: translateY(-50%) scale(0.8);
              }
              72% {
                left: calc(100% - 34px);
                transform: translateY(-50%) scale(1);
              }
              100% {
                left: calc(100% - 34px);
                transform: translateY(-50%) scale(0.72);
              }
            }

            @keyframes nti-packet-short {
              0% {
                left: 16px;
                transform: translateY(-50%) scale(0.8);
              }
              62% {
                left: calc(100% - 34px);
                transform: translateY(-50%) scale(1);
              }
              100% {
                left: calc(100% - 34px);
                transform: translateY(-50%) scale(0.68);
              }
            }

            @keyframes nti-ring {
              0% {
                opacity: 0;
                transform: scale(0.55);
              }
              18% {
                opacity: 1;
              }
              100% {
                opacity: 0;
                transform: scale(1.35);
              }
            }

            @keyframes nti-trace-drop {
              0% {
                opacity: 0;
                transform: translate(-50%, 0) scale(0.6);
              }
              18% {
                opacity: 1;
              }
              78% {
                opacity: 1;
                transform: translate(-50%, 70px) scale(1);
              }
              100% {
                opacity: 0;
                transform: translate(-50%, 82px) scale(0.7);
              }
            }

            @keyframes nti-memory-glow {
              0%,
              100% {
                box-shadow: 0 0 0 rgba(182, 255, 97, 0);
              }
              50% {
                box-shadow: 0 0 28px rgba(182, 255, 97, 0.16);
              }
            }

            @media (max-width: 980px) {
              .nti-flow-grid {
                grid-template-columns: 1fr;
              }

              .nti-flow-arrow {
                display: none;
              }

              .nti-trace-panel {
                grid-template-columns: 1fr;
              }

              .nti-gap-core {
                position: relative;
                right: auto;
                bottom: auto;
                margin-inline: auto;
              }

              .nti-lane-observed {
                width: 100%;
              }
            }
          `}</style>
        </Card>
      </div>
    </Section>
  );
}

function VisualNode({ index, title, body, tone }: { index: string; title: string; body: string; tone: "cyan" | "slate" | "rose" | "lime" }) {
  const toneClass = {
    cyan: "border-cyan-signal/30 bg-cyan-signal/10 text-cyan-100",
    slate: "border-white/10 bg-white/[0.05] text-slate-200",
    rose: "border-rose-signal/30 bg-rose-signal/10 text-rose-100",
    lime: "border-lime-signal/30 bg-lime-signal/10 text-lime-100"
  }[tone];

  return (
    <div className={`min-h-36 rounded-lg border p-4 ${toneClass}`}>
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">{index}</div>
      <h4 className="mt-2 text-sm font-semibold text-white">{title}</h4>
      <p className="mt-2 text-xs leading-5">{body}</p>
    </div>
  );
}

function LegendDot({ color, label }: { color: "cyan" | "rose" | "lime"; label: string }) {
  const colorClass = {
    cyan: "bg-cyan-signal shadow-[0_0_14px_rgba(72,229,255,0.64)]",
    rose: "bg-rose-signal shadow-[0_0_14px_rgba(255,95,143,0.64)]",
    lime: "bg-lime-signal shadow-[0_0_14px_rgba(182,255,97,0.64)]"
  }[color];

  return (
    <div className="flex items-center gap-2">
      <span className={`size-2 rounded-full ${colorClass}`} />
      <span>{label}</span>
    </div>
  );
}

type VisualLanguageScenario = {
  id: string;
  field: string;
  marker: string;
  visibleSignal: string;
  expectedPattern: string;
  observedPattern: string;
  negativeTrace: string;
  missingContext: string;
  improvedAction: string;
  application: string;
  caution?: string;
};

type VisualControls = {
  traceIntensity: number;
  missingContext: number;
  contradiction: number;
  failureCount: number;
  timeDelay: number;
  animationSpeed: number;
  showMath: boolean;
  showLegend: boolean;
  livePulse: boolean;
};

type CustomScenarioDraft = Pick<
  VisualLanguageScenario,
  "field" | "visibleSignal" | "expectedPattern" | "observedPattern" | "negativeTrace" | "missingContext" | "improvedAction" | "application"
>;

const defaultVisualLanguageScenarios: VisualLanguageScenario[] = [
  {
    id: "ai-safety",
    field: "AI Safety",
    marker: "AI",
    visibleSignal: "AI answer generated",
    expectedPattern: "Confident correct answer",
    observedPattern: "Answer contains hidden assumptions",
    negativeTrace: "Uncertainty + missing latest data",
    missingContext: "Fresh source, confidence evidence, hidden assumptions",
    improvedAction: "Expose assumptions, check source, answer with confidence label",
    application: "Safer AI reasoning and hallucination reduction"
  },
  {
    id: "cybersecurity",
    field: "Cybersecurity",
    marker: "SEC",
    visibleSignal: "Login attempt",
    expectedPattern: "Normal typing rhythm and normal device behavior",
    observedPattern: "Abnormal rhythm, VPN mismatch, repeated attempts",
    negativeTrace: "Behavior shadow",
    missingContext: "True identity hidden",
    improvedAction: "Trigger verification and increase risk score",
    application: "Hacker detection through behavior disturbance",
    caution: "Research prototype only, not a complete security system."
  },
  {
    id: "education",
    field: "Education",
    marker: "EDU",
    visibleSignal: "Student failed exam",
    expectedPattern: "Student did not study",
    observedPattern: "Student studied but had weak basics and language barrier",
    negativeTrace: "Hidden learning gap",
    missingContext: "Stress, time pressure, language, fundamentals",
    improvedAction: "Create basics-first revision plan",
    application: "Personalized learning support"
  },
  {
    id: "product-design",
    field: "Product Design",
    marker: "UX",
    visibleSignal: "User abandoned checkout",
    expectedPattern: "User is not interested",
    observedPattern: "User checked price twice and hesitated",
    negativeTrace: "Value hesitation",
    missingContext: "Budget concern, trust concern, comparison need",
    improvedAction: "Show comparison, discount, guarantee, and trust proof",
    application: "Better UX and conversion design"
  },
  {
    id: "science",
    field: "Scientific Discovery",
    marker: "SCI",
    visibleSignal: "Experiment result anomaly",
    expectedPattern: "Known model prediction",
    observedPattern: "Unexpected measurement appears repeatedly",
    negativeTrace: "Model gap",
    missingContext: "Hidden variable or unknown constraint",
    improvedAction: "Run controlled retest and search hidden variable",
    application: "Anomaly-driven research discovery"
  },
  {
    id: "robotics",
    field: "Robotics",
    marker: "BOT",
    visibleSignal: "Robot missed object",
    expectedPattern: "Object detection successful",
    observedPattern: "Glare or occlusion caused detection failure",
    negativeTrace: "Sensor blind spot",
    missingContext: "Lighting angle, object edge, sensor confidence",
    improvedAction: "Switch sensor angle and update world model",
    application: "Safer robot perception"
  },
  {
    id: "healthcare-safety",
    field: "Healthcare Safety Demo",
    marker: "SAFE",
    visibleSignal: "Symptom reported",
    expectedPattern: "Simple cause",
    observedPattern: "Missing history and context creates uncertainty",
    negativeTrace: "Diagnosis uncertainty",
    missingContext: "Medical history, duration, severity, risk factors",
    improvedAction: "Ask more questions and escalate to human expert",
    application: "Safer triage-style reasoning",
    caution: "Educational safety demo only, not medical advice."
  },
  {
    id: "economy-human-systems",
    field: "Economy / Human Systems",
    marker: "SYS",
    visibleSignal: "Low income",
    expectedPattern: "Low productivity",
    observedPattern: "Unpaid labor and hidden inequality are ignored",
    negativeTrace: "Invisible economic load",
    missingContext: "Care work, opportunity gap, attention capture, social pressure",
    improvedAction: "Include hidden labor and constraint metrics",
    application: "Fairer economic analysis"
  }
];

const emptyCustomScenario: CustomScenarioDraft = {
  field: "",
  visibleSignal: "",
  expectedPattern: "",
  observedPattern: "",
  negativeTrace: "",
  missingContext: "",
  improvedAction: "",
  application: ""
};

function visualTraceLevel(score: number) {
  if (score <= 20) return "WEAK TRACE";
  if (score <= 45) return "USEFUL TRACE";
  if (score <= 70) return "STRONG HIDDEN SIGNAL";
  return "CRITICAL INTELLIGENCE GAP";
}

function visualTraceExplanation(score: number) {
  if (score <= 20) return "The observed pattern mostly matches expectation. The trace is weak, so normal action can continue.";
  if (score <= 45) return "A useful trace exists. The AI should store the gap as context before acting.";
  if (score <= 70) return "A strong hidden signal exists. The AI should slow down and reason with missing context.";
  return "Critical intelligence gap. The AI should expose assumptions, ask or check context, and update memory before acting.";
}

function visualScoreColor(score: number) {
  if (score <= 20) return "#48e5ff";
  if (score <= 45) return "#a78bfa";
  if (score <= 70) return "#f59e0b";
  return "#ff5f8f";
}

function buildVisualLanguageCSS(score: number, speed: number, pulse: boolean) {
  const opacity = (0.2 + clamp(score) / 130).toFixed(2);
  const blur = Math.round(8 + clamp(score) / 4);
  const duration = Math.max(0.6, 4 - clamp(speed) / 30).toFixed(1);

  return `.nti-negative-trace {
  opacity: ${opacity};
  filter: blur(${blur}px);
  animation: ${pulse ? `ntiPulse ${duration}s infinite ease-in-out` : "none"};
}

.nti-visible-signal {
  box-shadow: 0 0 ${Math.round(12 + score / 2)}px rgba(72, 229, 255, 0.75);
}

.nti-insight-node {
  transform: scale(${(1 + score / 300).toFixed(2)});
}

@keyframes ntiPulse {
  0%, 100% { transform: scale(0.96); opacity: ${Math.max(0.25, Number(opacity) - 0.2).toFixed(2)}; }
  50% { transform: scale(1.08); opacity: ${opacity}; }
}`;
}

function NTIVisualLanguageSimulator() {
  const [customScenarios, setCustomScenarios] = useState<VisualLanguageScenario[]>([]);
  const [customScenariosLoaded, setCustomScenariosLoaded] = useState(false);
  const [scenarioId, setScenarioId] = useState(defaultVisualLanguageScenarios[0].id);
  const [controls, setControls] = useState<VisualControls>({
    traceIntensity: 60,
    missingContext: 55,
    contradiction: 35,
    failureCount: 2,
    timeDelay: 45,
    animationSpeed: 55,
    showMath: true,
    showLegend: true,
    livePulse: true
  });
  const [newScenario, setNewScenario] = useState<CustomScenarioDraft>(emptyCustomScenario);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("ntiVisualCustomScenarios");
      if (saved) setCustomScenarios(JSON.parse(saved) as VisualLanguageScenario[]);
    } catch {
      setCustomScenarios([]);
    } finally {
      setCustomScenariosLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!customScenariosLoaded) return;
    window.localStorage.setItem("ntiVisualCustomScenarios", JSON.stringify(customScenarios));
  }, [customScenarios, customScenariosLoaded]);

  const allScenarios = useMemo(() => [...defaultVisualLanguageScenarios, ...customScenarios], [customScenarios]);
  const scenario = allScenarios.find((item) => item.id === scenarioId) ?? defaultVisualLanguageScenarios[0];

  const visualTraceScore = useMemo(
    () =>
      clamp(
        controls.traceIntensity * 0.28 +
          controls.missingContext * 0.22 +
          controls.contradiction * 0.2 +
          clamp(controls.failureCount * 18) * 0.15 +
          controls.timeDelay * 0.15
      ),
    [controls]
  );

  const generatedCSS = useMemo(
    () => buildVisualLanguageCSS(visualTraceScore, controls.animationSpeed, controls.livePulse),
    [controls.animationSpeed, controls.livePulse, visualTraceScore]
  );

  const scenarioJSON = useMemo(
    () => ({
      field: scenario.field,
      visibleSignal: scenario.visibleSignal,
      expectedPattern: scenario.expectedPattern,
      observedPattern: scenario.observedPattern,
      negativeTrace: scenario.negativeTrace,
      missingContext: scenario.missingContext,
      improvedAction: scenario.improvedAction,
      application: scenario.application,
      traceScore: Math.round(visualTraceScore),
      traceLevel: visualTraceLevel(visualTraceScore)
    }),
    [scenario, visualTraceScore]
  );

  const dynamicVars = {
    "--nti-vl-score": visualTraceScore,
    "--nti-vl-color": visualScoreColor(visualTraceScore),
    "--nti-vl-speed": `${Math.max(0.7, 4 - controls.animationSpeed / 30)}s`,
    "--nti-vl-opacity": `${0.2 + visualTraceScore / 130}`,
    "--nti-vl-blur": `${8 + visualTraceScore / 4}px`
  } as CSSProperties;

  function updateControl<K extends keyof VisualControls>(key: K, value: VisualControls[K]) {
    setControls((current) => ({ ...current, [key]: value }));
  }

  function updateNewScenario<K extends keyof CustomScenarioDraft>(key: K, value: CustomScenarioDraft[K]) {
    setNewScenario((current) => ({ ...current, [key]: value }));
  }

  function addCustomScenario() {
    if (!newScenario.field.trim()) return;
    const scenarioToAdd: VisualLanguageScenario = {
      ...newScenario,
      id: `custom-${Date.now()}`,
      marker: "NEW",
      caution: ""
    };
    setCustomScenarios((current) => [scenarioToAdd, ...current]);
    setScenarioId(scenarioToAdd.id);
    setNewScenario(emptyCustomScenario);
  }

  return (
    <Section
      title="Live Visual Language Simulator"
      subtitle="NTI Visual Language turns absence, error, delay, contradiction, and failure into live visual intelligence."
    >
      <div className="nti-vl-root" style={dynamicVars}>
        <div className="nti-vl-hero">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-fuchsia-200">NTI Visual Language System</div>
          <h3>Live Visual Language Simulator</h3>
          <p>
            A lightweight CSS/HTML visual system for reading the gap between visible signal, expected pattern,
            observed pattern, missing context, contradiction, failure path, negative trace, insight, and improved AI action.
          </p>
        </div>

        <div className="nti-vl-grid">
          <div className="grid gap-5">
            <Card>
              <div className="nti-vl-controls">
                <label className="nti-vl-control nti-vl-wide">
                  <span>Scenario</span>
                  <select value={scenarioId} onChange={(event) => setScenarioId(event.target.value)}>
                    {allScenarios.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.marker} / {item.field}
                      </option>
                    ))}
                  </select>
                </label>
                <VisualSlider label="Trace Intensity" value={controls.traceIntensity} onChange={(value) => updateControl("traceIntensity", value)} />
                <VisualSlider label="Missing Context" value={controls.missingContext} onChange={(value) => updateControl("missingContext", value)} />
                <VisualSlider label="Contradiction" value={controls.contradiction} onChange={(value) => updateControl("contradiction", value)} />
                <VisualSlider label="Failure Count" value={controls.failureCount} max={6} onChange={(value) => updateControl("failureCount", value)} />
                <VisualSlider label="Time Delay" value={controls.timeDelay} onChange={(value) => updateControl("timeDelay", value)} />
                <VisualSlider label="Animation Speed" value={controls.animationSpeed} onChange={(value) => updateControl("animationSpeed", value)} />
                <div className="nti-vl-toggles">
                  <VisualToggle label="Show math overlay" checked={controls.showMath} onChange={(value) => updateControl("showMath", value)} />
                  <VisualToggle label="Show visual legend" checked={controls.showLegend} onChange={(value) => updateControl("showLegend", value)} />
                  <VisualToggle label="Live pulse mode" checked={controls.livePulse} onChange={(value) => updateControl("livePulse", value)} />
                </div>
              </div>
            </Card>

            <div className={`nti-vl-stage ${controls.livePulse ? "nti-vl-pulse" : ""}`}>
              <div className="nti-vl-stage-header">
                <span>{scenario.marker}</span>
                <strong>{scenario.field}</strong>
                <em>{Math.round(visualTraceScore)}% / {visualTraceLevel(visualTraceScore)}</em>
              </div>
              <div className="nti-vl-trace-cloud" />
              <div className="nti-vl-path nti-vl-expected-path" />
              <div className="nti-vl-path nti-vl-observed-path" />
              <div className="nti-vl-path nti-vl-failure-path" />
              <div className="nti-vl-action-arrow" />
              <span className="nti-vl-particle particle-a" />
              <span className="nti-vl-particle particle-b" />
              <span className="nti-vl-particle particle-c" />
              <VisualLanguageNode className="visible" title="Visible Signal" body={scenario.visibleSignal} />
              <VisualLanguageNode className="expected" title="Expected Pattern" body={scenario.expectedPattern} />
              <VisualLanguageNode className="observed" title="Observed Pattern" body={scenario.observedPattern} />
              <VisualLanguageNode className="missing" title="Missing Context" body={scenario.missingContext} />
              <VisualLanguageNode className="contradiction" title="Contradiction / Trace" body={scenario.negativeTrace} />
              <VisualLanguageNode className="insight" title="Improved AI Action" body={scenario.improvedAction} />
              {controls.showMath && (
                <div className="nti-vl-math">
                  <div><strong>NT = |Expected - Observed|</strong><span>The gap becomes reusable memory.</span></div>
                  <div><strong>Missing context</strong><span>{controls.missingContext}% absent signal.</span></div>
                  <div><strong>Failure count</strong><span>{controls.failureCount} failed path markers.</span></div>
                </div>
              )}
            </div>

            {controls.showLegend && (
              <div className="nti-vl-legend">
                <span>Blue node: visible signal</span>
                <span>Green dashed path: expected pattern</span>
                <span>White/purple path: observed pattern</span>
                <span>Violet cloud: negative trace</span>
                <span>Dotted node: missing context</span>
                <span>Orange/red collision: contradiction</span>
                <span>Broken red path: failure path</span>
                <span>Gold pulse: insight</span>
                <span>Green arrow: improved action</span>
              </div>
            )}
          </div>

          <div className="grid content-start gap-5">
            <Card>
              <h3 className="text-lg font-semibold text-white">Scenario Intelligence</h3>
              <VisualLanguageMeter value={visualTraceScore} />
              <p className="mt-4 text-sm leading-6 text-slate-300">{visualTraceExplanation(visualTraceScore)}</p>
              <p className="mt-3 text-sm leading-6 text-fuchsia-100"><strong>Recommended action:</strong> {scenario.improvedAction}</p>
              <p className="mt-3 text-sm leading-6 text-cyan-100"><strong>Application:</strong> {scenario.application}</p>
              {scenario.caution && <p className="mt-3 text-sm leading-6 text-rose-200"><strong>Note:</strong> {scenario.caution}</p>}
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-white">Generated Visual Explanation</h3>
              <p className="text-sm leading-6 text-slate-300">
                In <strong>{scenario.field}</strong>, NTI observes <span className="text-cyan-signal">{scenario.visibleSignal}</span>,
                compares it to <span className="text-lime-signal">{scenario.expectedPattern}</span>, then notices
                <span className="text-fuchsia-200"> {scenario.observedPattern}</span>. The negative trace is
                <span className="text-rose-200"> {scenario.negativeTrace}</span>, so the better action is
                <span className="text-lime-200"> {scenario.improvedAction}</span>.
              </p>
            </Card>
          </div>
        </div>

        <div className="nti-vl-grid mt-5">
          <Card>
            <h3 className="text-lg font-semibold text-white">CSS Visual Language Builder</h3>
            <p className="mb-3 text-sm leading-6 text-slate-400">Generated from the selected scenario, score, speed, and pulse mode.</p>
            <textarea className="nti-vl-code" readOnly value={generatedCSS} />
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-white">Generated Scenario JSON</h3>
            <p className="mb-3 text-sm leading-6 text-slate-400">Reusable object for future APIs, logs, sensors, and analytics.</p>
            <textarea className="nti-vl-code" readOnly value={JSON.stringify(scenarioJSON, null, 2)} />
          </Card>
        </div>

        <Card className="mt-5">
          <h3 className="text-lg font-semibold text-white">Create Custom NTI Visual Scenario</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">Saved locally with the existing browser localStorage, without touching old NTI data.</p>
          <div className="nti-vl-form mt-4">
            {(Object.keys(newScenario) as Array<keyof CustomScenarioDraft>).map((key) =>
              key === "application" || key === "improvedAction" || key === "missingContext" ? (
                <textarea key={key} placeholder={key} value={newScenario[key]} onChange={(event) => updateNewScenario(key, event.target.value)} />
              ) : (
                <input key={key} placeholder={key} value={newScenario[key]} onChange={(event) => updateNewScenario(key, event.target.value)} />
              )
            )}
          </div>
          <button type="button" onClick={addCustomScenario} className="mt-4 rounded-md bg-fuchsia-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-400">
            Add Custom Visual Scenario
          </button>
        </Card>

        <style jsx>{`
          .nti-vl-root {
            color: #e5e7eb;
          }

          .nti-vl-hero {
            border: 1px solid rgba(217, 70, 239, 0.22);
            background:
              radial-gradient(circle at top left, rgba(72, 229, 255, 0.16), transparent 32%),
              radial-gradient(circle at bottom right, rgba(217, 70, 239, 0.18), transparent 34%),
              linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 0.98));
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
          }

          .nti-vl-hero h3 {
            margin-top: 8px;
            font-size: clamp(1.8rem, 4vw, 3.4rem);
            font-weight: 800;
            line-height: 1;
            color: white;
          }

          .nti-vl-hero p {
            margin-top: 12px;
            max-width: 900px;
            color: #cbd5e1;
            line-height: 1.6;
          }

          .nti-vl-grid {
            display: grid;
            grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
            gap: 20px;
            margin-top: 20px;
          }

          .nti-vl-controls,
          .nti-vl-form {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .nti-vl-wide,
          .nti-vl-toggles {
            grid-column: 1 / -1;
          }

          .nti-vl-control,
          .nti-vl-toggle {
            display: grid;
            gap: 7px;
            color: #cbd5e1;
            font-size: 0.86rem;
          }

          .nti-vl-toggle {
            grid-template-columns: auto 1fr;
            align-items: center;
          }

          .nti-vl-toggles {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
          }

          .nti-vl-control input,
          .nti-vl-control select,
          .nti-vl-form input,
          .nti-vl-form textarea {
            min-width: 0;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.25);
            color: white;
            outline: none;
          }

          .nti-vl-control select,
          .nti-vl-form input,
          .nti-vl-form textarea {
            padding: 11px 12px;
          }

          .nti-vl-form textarea {
            min-height: 82px;
            resize: vertical;
          }

          .nti-vl-stage {
            position: relative;
            min-height: 540px;
            overflow: hidden;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background:
              linear-gradient(90deg, rgba(72, 229, 255, 0.045) 1px, transparent 1px),
              linear-gradient(rgba(72, 229, 255, 0.045) 1px, transparent 1px),
              radial-gradient(circle at 30% 20%, rgba(72, 229, 255, 0.14), transparent 25%),
              radial-gradient(circle at 70% 70%, rgba(217, 70, 239, 0.15), transparent 30%),
              #020617;
            background-size: 34px 34px, 34px 34px, auto, auto, auto;
          }

          .nti-vl-stage-header {
            position: absolute;
            left: 16px;
            right: 16px;
            top: 16px;
            z-index: 8;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
          }

          .nti-vl-stage-header span,
          .nti-vl-stage-header em,
          .nti-vl-stage-header strong {
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(2, 6, 23, 0.72);
            padding: 8px 10px;
            font-size: 0.76rem;
            font-style: normal;
          }

          .nti-vl-trace-cloud {
            position: absolute;
            left: 42%;
            top: 32%;
            width: 190px;
            height: 150px;
            border-radius: 999px;
            background: radial-gradient(circle, rgba(88, 28, 135, var(--nti-vl-opacity)), rgba(15, 23, 42, 0.08) 70%);
            filter: blur(var(--nti-vl-blur));
            opacity: var(--nti-vl-opacity);
            animation: nti-vl-trace var(--nti-vl-speed) ease-in-out infinite;
          }

          .nti-vl-pulse .nti-vl-trace-cloud,
          .nti-vl-pulse .nti-vl-particle,
          .nti-vl-pulse .nti-vl-node.insight {
            animation-play-state: running;
          }

          .nti-vl-path {
            position: absolute;
            height: 3px;
            transform-origin: left center;
            z-index: 2;
          }

          .nti-vl-expected-path {
            left: 19%;
            top: 30%;
            width: 30%;
            border-top: 2px dashed rgba(182, 255, 97, 0.8);
            transform: rotate(-10deg);
          }

          .nti-vl-observed-path {
            left: 20%;
            top: 48%;
            width: 35%;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.85), rgba(168, 85, 247, 0.9));
            transform: rotate(7deg);
          }

          .nti-vl-failure-path {
            left: 52%;
            top: 58%;
            width: 20%;
            border-top: 3px dashed rgba(255, 95, 143, 0.8);
            transform: rotate(18deg);
          }

          .nti-vl-action-arrow {
            position: absolute;
            right: 14%;
            top: 44%;
            z-index: 2;
            width: 95px;
            height: 3px;
            background: #b6ff61;
            box-shadow: 0 0 20px rgba(182, 255, 97, 0.45);
          }

          .nti-vl-action-arrow::after {
            content: "";
            position: absolute;
            right: -1px;
            top: -6px;
            border-left: 13px solid #b6ff61;
            border-top: 7px solid transparent;
            border-bottom: 7px solid transparent;
          }

          .nti-vl-particle {
            position: absolute;
            z-index: 4;
            width: 8px;
            height: 8px;
            border-radius: 999px;
            background: var(--nti-vl-color);
            box-shadow: 0 0 18px var(--nti-vl-color);
            animation: nti-vl-particle var(--nti-vl-speed) infinite linear;
          }

          .particle-a { top: 34%; left: 16%; }
          .particle-b { top: 52%; left: 15%; animation-delay: 0.45s; }
          .particle-c { top: 50%; left: 50%; animation-delay: 0.9s; }

          .nti-vl-node {
            position: absolute;
            z-index: 5;
            width: 160px;
            min-height: 96px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.14);
            background: rgba(2, 6, 23, 0.74);
            padding: 12px;
            backdrop-filter: blur(10px);
          }

          .nti-vl-node strong {
            display: block;
            margin-bottom: 6px;
            color: white;
            font-size: 0.82rem;
          }

          .nti-vl-node span {
            color: #cbd5e1;
            font-size: 0.76rem;
            line-height: 1.45;
          }

          .nti-vl-node.visible {
            left: 6%;
            top: 34%;
            border-color: rgba(72, 229, 255, 0.45);
            box-shadow: 0 0 calc(16px + var(--nti-vl-score) * 0.45px) rgba(72, 229, 255, 0.36);
          }

          .nti-vl-node.expected {
            left: 34%;
            top: 16%;
            border-style: dashed;
            border-color: rgba(182, 255, 97, 0.6);
          }

          .nti-vl-node.observed {
            left: 34%;
            top: 45%;
            border-color: rgba(168, 85, 247, 0.62);
          }

          .nti-vl-node.missing {
            right: 8%;
            top: 14%;
            border-style: dotted;
            border-color: rgba(148, 163, 184, 0.7);
          }

          .nti-vl-node.contradiction {
            right: 8%;
            top: 42%;
            border-color: rgba(255, 95, 143, 0.65);
            animation: nti-vl-shake 1.4s infinite;
          }

          .nti-vl-node.insight {
            left: 44%;
            bottom: 26px;
            border-color: rgba(245, 158, 11, 0.7);
            background: rgba(120, 53, 15, 0.28);
            animation: nti-vl-insight var(--nti-vl-speed) infinite ease-in-out;
          }

          .nti-vl-math {
            position: absolute;
            left: 16px;
            right: 16px;
            bottom: 16px;
            z-index: 7;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(2, 6, 23, 0.74);
            padding: 12px;
            backdrop-filter: blur(12px);
          }

          .nti-vl-math strong,
          .nti-vl-math span {
            display: block;
          }

          .nti-vl-math strong {
            color: white;
            font-size: 0.78rem;
          }

          .nti-vl-math span {
            margin-top: 3px;
            color: #cbd5e1;
            font-size: 0.72rem;
            line-height: 1.4;
          }

          .nti-vl-legend {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
          }

          .nti-vl-legend span {
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(255, 255, 255, 0.04);
            padding: 10px;
            color: #cbd5e1;
            font-size: 0.78rem;
          }

          .nti-vl-code {
            min-height: 230px;
            width: 100%;
            resize: vertical;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.32);
            padding: 14px;
            color: #d1d5db;
            font-family: var(--font-geist-mono), monospace;
            font-size: 0.78rem;
            line-height: 1.5;
            outline: none;
          }

          @keyframes nti-vl-trace {
            0%, 100% { transform: scale(0.94); opacity: calc(var(--nti-vl-opacity) * 0.78); }
            50% { transform: scale(1.09); opacity: var(--nti-vl-opacity); }
          }

          @keyframes nti-vl-particle {
            0% { transform: translateX(0) scale(0.8); opacity: 0; }
            15% { opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateX(420px) scale(1.25); opacity: 0; }
          }

          @keyframes nti-vl-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(calc(var(--nti-vl-score) * -0.025px)); }
            75% { transform: translateX(calc(var(--nti-vl-score) * 0.025px)); }
          }

          @keyframes nti-vl-insight {
            0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(245, 158, 11, 0.18); }
            50% { transform: scale(calc(1 + var(--nti-vl-score) * 0.0018)); box-shadow: 0 0 30px rgba(245, 158, 11, 0.32); }
          }

          @media (max-width: 1100px) {
            .nti-vl-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 760px) {
            .nti-vl-controls,
            .nti-vl-form,
            .nti-vl-toggles,
            .nti-vl-legend,
            .nti-vl-math {
              grid-template-columns: 1fr;
            }

            .nti-vl-stage {
              min-height: 760px;
              padding-top: 64px;
            }

            .nti-vl-stage-header {
              position: relative;
              left: auto;
              right: auto;
              top: auto;
              margin: 12px;
            }

            .nti-vl-path,
            .nti-vl-action-arrow,
            .nti-vl-trace-cloud,
            .nti-vl-particle {
              display: none;
            }

            .nti-vl-node {
              position: relative;
              inset: auto !important;
              width: auto;
              min-height: auto;
              margin: 10px 12px;
            }

            .nti-vl-math {
              position: relative;
              left: auto;
              right: auto;
              bottom: auto;
              margin: 12px;
            }
          }
        `}</style>
      </div>
    </Section>
  );
}

function VisualSlider({ label, value, max = 100, onChange }: { label: string; value: number; max?: number; onChange: (value: number) => void }) {
  return (
    <label className="nti-vl-control">
      <span>{label}: {value}</span>
      <input type="range" min="0" max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function VisualToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="nti-vl-toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function VisualLanguageNode({ className, title, body }: { className: string; title: string; body: string }) {
  return (
    <div className={`nti-vl-node ${className}`}>
      <strong>{title}</strong>
      <span>{body}</span>
    </div>
  );
}

function VisualLanguageMeter({ value }: { value: number }) {
  const score = clamp(value);
  return (
    <div className="mt-4">
      <div className="mb-1 flex justify-between gap-3 text-xs text-slate-300">
        <span>Visual Negative Trace Score</span>
        <span className="font-mono text-slate-100">{Math.round(score)}% / {visualTraceLevel(score)}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-black/25">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, background: `linear-gradient(90deg, #48e5ff, #a78bfa, ${visualScoreColor(score)})` }}
        />
      </div>
    </div>
  );
}

function CoreTheory() {
  const cards = [
    ["Missing Information Trace", "When required context is absent.", "🧩"],
    ["Failure Trace", "When an attempted solution fails.", "❌"],
    ["Contradiction Trace", "When two statements cannot both be true.", "🔁"],
    ["Delay Trace", "When timing itself becomes information.", "⏳"],
    ["Uncertainty Trace", "When model confidence drops.", "🧠"],
    ["Unchosen Path Trace", "When many possibilities existed but only one was selected.", "🚪"]
  ];

  return (
    <Section title="NTI Core Theory" subtitle="Negative Trace Intelligence is an AI framework where absence becomes data.">
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h3 className="text-xl font-semibold text-white">Normal AI Training</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">Input → Pattern → Prediction</p>
          <div className="mt-5 rounded-lg border border-white/10 bg-black/20 p-4">
            <h3 className="text-xl font-semibold text-white">Negative Trace AI Training</h3>
            <p className="mt-3 text-sm leading-6 text-fuchsia-100">Input → Expected Pattern → Observed Pattern → Difference → Negative Trace → Better Prediction</p>
          </div>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold text-white">Core principles</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-300">
            {[
              "Absence is information.",
              "Failure is compressed knowledge.",
              "Contradiction reveals hidden structure.",
              "Uncertainty shows missing context.",
              "Skipped paths reveal decision boundaries.",
              "Expected-but-missing behavior creates a trace.",
              "AI should learn from the gap between reality and expectation."
            ].map((item) => <li key={item}>{item}</li>)}
          </ol>
        </Card>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([title, body, icon]) => (
          <Card key={title}>
            <div className="text-2xl">{icon}</div>
            <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function MathEngine({
  mathInput,
  setMathInput,
  ntiScore
}: {
  mathInput: NegativeTraceInput;
  setMathInput: (value: NegativeTraceInput) => void;
  ntiScore: ReturnType<typeof calculateNegativeTrace>;
}) {
  return (
    <Section title="Math Engine" subtitle="In NTI, error is not only minimized. Error is stored as a knowledge object.">
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="grid gap-3 md:grid-cols-2">
            {(Object.keys(mathInput) as Array<keyof NegativeTraceInput>).map((key) => (
              <label key={key} className="text-sm">
                <span className="capitalize text-slate-300">{key}</span>
                <input
                  type="number"
                  value={mathInput[key]}
                  onChange={(event) => setMathInput({ ...mathInput, [key]: Number(event.target.value) })}
                  className="mt-1 h-10 w-full rounded-md border border-white/10 bg-black/25 px-3 text-slate-100 outline-none focus:border-fuchsia-300/60"
                />
              </label>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold text-white">NTI Score</h3>
          <div className="mt-4">
            <Meter value={ntiScore.totalScore} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Info label="Basic Trace" value={String(ntiScore.basicTrace)} />
            <Info label="Normalized Gap" value={`${Math.round(ntiScore.normalizedGap)}%`} />
            <Info label="Trace ID" value={ntiScore.traceId} />
            <Info label="Formula" value="Learning Gain = Error + Missing Context + Contradiction + Failure Memory" />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">{ntiScore.interpretation}</p>
        </Card>
      </div>
    </Section>
  );
}

function LearningSimulator({ simEvent, setSimEvent, simResult }: { simEvent: NTIEvent; setSimEvent: (value: NTIEvent) => void; simResult: ReturnType<typeof runNTIAnalysis> }) {
  return (
    <Section title="AI Learning Simulator" subtitle="Compare visible-only AI with negative-trace AI.">
      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <h3 className="text-xl font-semibold text-white">Scenario</h3>
          <p className="mt-3 text-sm text-slate-300">Visible input: User asks for a report.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(Object.keys(simEvent) as Array<keyof NTIEvent>).map((key) => (
              <label key={key} className="flex items-center gap-3 rounded-md border border-white/10 bg-black/15 p-3 text-sm text-slate-300">
                <input type="checkbox" checked={simEvent[key]} onChange={(event) => setSimEvent({ ...simEvent, [key]: event.target.checked })} />
                {key.replace(/([A-Z])/g, " $1")}
              </label>
            ))}
          </div>
        </Card>
        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <h3 className="text-lg font-semibold text-white">Normal AI</h3>
              <p className="mt-2 text-sm text-slate-400">User wants report.</p>
              <p className="mt-3 text-sm text-cyan-signal">Prediction: Generate report.</p>
            </div>
            <div className="rounded-lg border border-fuchsia-300/20 bg-fuchsia-400/10 p-4">
              <h3 className="text-lg font-semibold text-white">NTI AI</h3>
              <p className="mt-2 text-sm text-slate-300">{simResult.hiddenContext}</p>
              <p className="mt-3 text-sm text-fuchsia-100">{simResult.improvedAction}</p>
            </div>
          </div>
          <div className="mt-4">
            <Meter value={simResult.learningGain} />
          </div>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-300">
            {simResult.negativeTraces.map((trace) => <li key={trace}>{trace}</li>)}
          </ul>
          <p className="mt-3 text-sm text-slate-400">Confidence Change: {simResult.confidenceChange}</p>
        </Card>
      </div>
    </Section>
  );
}

function DatasetBuilder({ dataset, newRow, setNewRow, addDatasetRow }: { dataset: NTIDatasetRow[]; newRow: NTIDatasetRow; setNewRow: (value: NTIDatasetRow) => void; addDatasetRow: () => void }) {
  return (
    <Section title="Negative Dataset Builder" subtitle="Build datasets where absence, failure, and contradiction become labels.">
      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          {(Object.keys(newRow) as Array<keyof NTIDatasetRow>).map((key) => (
            <input
              key={key}
              placeholder={key}
              value={newRow[key]}
              onChange={(event) => setNewRow({ ...newRow, [key]: event.target.value })}
              className="h-10 rounded-md border border-white/10 bg-black/25 px-3 text-sm text-slate-100 outline-none focus:border-fuchsia-300/60"
            />
          ))}
        </div>
        <button type="button" onClick={addDatasetRow} className="mt-4 rounded-md bg-fuchsia-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-400">
          Add NTI Dataset Row
        </button>
      </Card>
      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {dataset.map((row, index) => (
          <Card key={`${row.input}-${index}`}>
            <h3 className="text-lg font-semibold text-white">{row.input}</h3>
            <div className="mt-3 grid gap-2 text-sm text-slate-300">
              <p><strong>Expected:</strong> {row.expected}</p>
              <p><strong>Actual:</strong> {row.actual}</p>
              <p className="text-fuchsia-200"><strong>Missing:</strong> {row.missing}</p>
              <p className="text-rose-signal"><strong>Failures:</strong> {row.failures}</p>
              <p className="text-amber-200"><strong>Contradictions:</strong> {row.contradictions}</p>
              <p className="text-cyan-signal"><strong>Negative Trace Label:</strong> {row.label}</p>
              <p className="text-lime-signal"><strong>Improved Output:</strong> {row.improved}</p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function FailureToInsight({ failureInput, setFailureInput, failureInsight }: { failureInput: FailureInsightInput; setFailureInput: (value: FailureInsightInput) => void; failureInsight: ReturnType<typeof buildFailureInsight> }) {
  return (
    <Section title="Failure-to-Insight Engine" subtitle="Failure is not waste. Failure is a map of forbidden paths.">
      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <div className="space-y-3">
            {(Object.keys(failureInput) as Array<keyof FailureInsightInput>).map((key) => (
              <input
                key={key}
                placeholder={key}
                value={failureInput[key]}
                onChange={(event) => setFailureInput({ ...failureInput, [key]: event.target.value })}
                className="h-10 w-full rounded-md border border-white/10 bg-black/25 px-3 text-sm text-slate-100 outline-none focus:border-fuchsia-300/60"
              />
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold text-white">Failure Insight Object</h3>
          <div className="mt-4">
            <Meter value={failureInsight.score} />
          </div>
          <pre className="mt-4 max-h-80 overflow-auto rounded-lg border border-white/10 bg-black/30 p-4 text-xs text-slate-300">{JSON.stringify(failureInsight, null, 2)}</pre>
        </Card>
      </div>
    </Section>
  );
}

function HiddenAssumptionDetector({ claim, setClaim, result }: { claim: string; setClaim: (value: string) => void; result: ReturnType<typeof detectHiddenAssumptions> }) {
  return (
    <Section title="Hidden Assumption Detector" subtitle="Find what a claim silently depends on.">
      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <textarea value={claim} onChange={(event) => setClaim(event.target.value)} className="min-h-44 w-full rounded-md border border-white/10 bg-black/25 p-3 text-sm text-slate-100 outline-none focus:border-fuchsia-300/60" />
        </Card>
        <Card>
          <Info label="Visible Claim" value={result.visibleClaim} />
          <Trace title="Hidden Assumptions" items={result.hiddenAssumptions} />
          <Trace title="Missing Evidence" items={result.missingEvidence} />
          <Trace title="Contradiction Risks" items={result.contradictionRisks} />
          <p className="mt-4 rounded-md border border-cyan-signal/20 bg-cyan-signal/10 p-3 text-sm leading-6 text-cyan-100">{result.testableVersion}</p>
          <p className="mt-3 text-xs leading-5 text-fuchsia-200">{result.variables.join(" / ")}</p>
        </Card>
      </div>
    </Section>
  );
}

function ContradictionMap({ contradiction, setContradiction, result }: { contradiction: { a: string; b: string }; setContradiction: (value: { a: string; b: string }) => void; result: ReturnType<typeof analyzeContradiction> }) {
  return (
    <Section title="Contradiction Map" subtitle="Contradictions are not just errors. They reveal hidden structure.">
      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <textarea value={contradiction.a} onChange={(event) => setContradiction({ ...contradiction, a: event.target.value })} className="min-h-28 w-full rounded-md border border-white/10 bg-black/25 p-3 text-sm text-slate-100 outline-none focus:border-fuchsia-300/60" />
          <textarea value={contradiction.b} onChange={(event) => setContradiction({ ...contradiction, b: event.target.value })} className="mt-3 min-h-28 w-full rounded-md border border-white/10 bg-black/25 p-3 text-sm text-slate-100 outline-none focus:border-fuchsia-300/60" />
        </Card>
        <Card>
          <div className="flex flex-col items-center justify-center gap-4 py-5 md:flex-row">
            <div className="rounded-lg border border-cyan-signal/30 bg-cyan-signal/10 p-4 text-sm text-cyan-100">Statement A</div>
            <div className="rounded-full border border-fuchsia-300/40 bg-fuchsia-500/20 p-5 text-center text-sm font-semibold text-white">Negative Trace</div>
            <div className="rounded-lg border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">Statement B</div>
          </div>
          <Meter value={result.score} />
          <Info label="Contradiction Type" value={result.type} />
          <Info label="Hidden Layer" value={result.hiddenLayer} />
          <Info label="Possible Resolution" value={result.possibleResolution} />
          <Info label="Research Question" value={result.researchQuestion} />
        </Card>
      </div>
    </Section>
  );
}

function AgentBlueprint() {
  const steps = [
    ["Input Parser", "Reads visible data."],
    ["Expectation Generator", "Predicts what should happen."],
    ["Observation Comparator", "Compares expected vs actual."],
    ["Negative Trace Extractor", "Detects absence, failure, contradiction, uncertainty, delay, and skipped paths."],
    ["Trace Memory", "Stores negative traces as reusable knowledge."],
    ["Insight Generator", "Converts trace into a rule, warning, or hypothesis."],
    ["Action Planner", "Chooses improved next action."],
    ["Evolution Loop", "Tests whether trace-based learning improved performance."]
  ];

  return (
    <Section title="NTI Agent Blueprint" subtitle="An AI architecture that stores absence and failure as reusable intelligence.">
      <div className="grid gap-3 md:grid-cols-4">
        {steps.map(([title, body], index) => (
          <Card key={title}>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-fuchsia-200">Step {index + 1}</div>
            <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-400">{body}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-5">
        <h3 className="text-xl font-semibold text-white">Pseudo-code</h3>
        <pre className="mt-4 overflow-auto rounded-lg border border-white/10 bg-black/30 p-4 text-sm text-slate-300">{`function ntiAgent(input) {
  const expected = generateExpectation(input);
  const observed = observeReality(input);
  const trace = extractNegativeTrace(expected, observed);
  traceMemory.store(trace);
  const insight = generateInsight(trace);
  const action = planAction(input, insight);
  return action;
}`}</pre>
      </Card>
    </Section>
  );
}

function EvolutionLog({ evolution, newEntry, setNewEntry, addEvolutionEntry }: { evolution: NTIEvolutionEntry[]; newEntry: NTIEvolutionEntry; setNewEntry: (value: NTIEvolutionEntry) => void; addEvolutionEntry: () => void }) {
  return (
    <Section title="Evolution Log" subtitle="Let the theory evolve through experiments, failures, datasets, and mathematical upgrades.">
      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          <input value={newEntry.title} onChange={(event) => setNewEntry({ ...newEntry, title: event.target.value })} placeholder="title" className="h-10 rounded-md border border-white/10 bg-black/25 px-3 text-sm text-slate-100 outline-none focus:border-fuchsia-300/60" />
          <select value={newEntry.type} onChange={(event) => setNewEntry({ ...newEntry, type: event.target.value as NTIEvolutionEntry["type"] })} className="h-10 rounded-md border border-white/10 bg-black/25 px-3 text-sm text-slate-100 outline-none focus:border-fuchsia-300/60">
            {["theorem", "experiment", "dataset idea", "failed hypothesis", "AI architecture idea", "mathematical upgrade", "application", "AI principle"].map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <select value={newEntry.status} onChange={(event) => setNewEntry({ ...newEntry, status: event.target.value as NTIEvolutionEntry["status"] })} className="h-10 rounded-md border border-white/10 bg-black/25 px-3 text-sm text-slate-100 outline-none focus:border-fuchsia-300/60">
            {["idea", "testing", "prototype", "validated", "rejected", "upgraded"].map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <input type="number" value={newEntry.confidence} onChange={(event) => setNewEntry({ ...newEntry, confidence: Number(event.target.value) })} className="h-10 rounded-md border border-white/10 bg-black/25 px-3 text-sm text-slate-100 outline-none focus:border-fuchsia-300/60" />
          <textarea value={newEntry.description} onChange={(event) => setNewEntry({ ...newEntry, description: event.target.value })} placeholder="description" className="min-h-24 rounded-md border border-white/10 bg-black/25 p-3 text-sm text-slate-100 outline-none focus:border-fuchsia-300/60 md:col-span-2" />
        </div>
        <button type="button" onClick={addEvolutionEntry} className="mt-4 rounded-md bg-fuchsia-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-400">
          Add Evolution Entry
        </button>
      </Card>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {evolution.map((entry, index) => (
          <Card key={`${entry.title}-${index}`}>
            <div className="flex justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
              <span className="h-fit rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase text-slate-400">{entry.type}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400">{entry.description}</p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fuchsia-200">{entry.date} / {entry.status}</p>
            <div className="mt-3">
              <Meter value={entry.confidence} label="Confidence" />
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function FutureApplications() {
  const apps = [
    ["NTI for Cybersecurity", "Detect hackers through missing-normal-behavior and abnormal traces."],
    ["NTI for AI Safety", "Detect hidden assumptions and uncertainty before wrong answers."],
    ["NTI for Education", "Find why a student failed beyond marks."],
    ["NTI for Science Discovery", "Study anomalies instead of ignoring them."],
    ["NTI for Product Design", "Learn from user hesitation and abandonment."],
    ["NTI for Neuromorphic AI", "Store failed paths as memory traces."],
    ["NTI for Photonic AI", "Use absent light / blocked signals as information."],
    ["NTI for AGI Research", "Make AI reason with both presence and absence."]
  ];
  return (
    <Section title="Future Applications" subtitle="Where Negative Trace Intelligence can become useful.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {apps.map(([title, body]) => (
          <Card key={title}>
            <Sparkles className="size-5 text-fuchsia-200" />
            <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
          </Card>
        ))}
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold text-white">Future API endpoints</h3>
          <div className="mt-3 grid gap-2">
            {futureApiEndpoints.map((item) => <code key={item} className="rounded-md border border-white/10 bg-black/20 px-3 py-2 text-xs text-cyan-signal">{item}</code>)}
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-white">Future data sources</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {futureDataSources.map((item) => <span key={item} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-slate-300">{item}</span>)}
          </div>
        </Card>
      </div>
    </Section>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section>
      <div className="mb-5">
        <div className="font-mono text-xs uppercase tracking-[0.22em] text-fuchsia-200">{title}</div>
        <h2 className="mt-2 text-2xl font-semibold text-white">{subtitle}</h2>
      </div>
      {children}
    </section>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-white/10 bg-panel/78 p-5 shadow-glow backdrop-blur-xl ${className}`}>{children}</div>;
}

function Badge({ children, tone = "fuchsia" }: { children: ReactNode; tone?: "fuchsia" | "cyan" }) {
  return (
    <span className={`rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${tone === "cyan" ? "border-cyan-signal/25 bg-cyan-signal/10 text-cyan-signal" : "border-fuchsia-300/30 bg-fuchsia-400/10 text-fuchsia-200"}`}>
      {children}
    </span>
  );
}

function Meter({ value, label = "Negative Trace Score" }: { value: number; label?: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between gap-3 text-xs text-slate-300">
        <span>{label}</span>
        <span className="font-mono text-slate-100">{Math.round(clamp(value))}% / {levelFromScore(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-signal via-fuchsia-400 to-rose-signal transition-all duration-500" style={{ width: `${clamp(value)}%` }} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3 rounded-md border border-white/10 bg-black/20 p-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <p className="mt-1 text-sm leading-6 text-slate-300">{value}</p>
    </div>
  );
}

function Trace({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-300">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
