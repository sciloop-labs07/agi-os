"use client";

import { Gauge, Network, ShieldAlert, Sparkles } from "lucide-react";
import { useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import {
  calculateCyberShadow,
  calculateInformationShadow,
  calculatePhysicalShadow,
  clamp,
  defaultEvolutionEntries,
  defaultRealityTests,
  generateShadowMemory,
  levelFromScore,
  runRealityTest,
  type CyberActivity,
  type EvolutionEntry,
  type RealityTest
} from "@/lib/shadow-field";

const tabs = [
  "Theory Core",
  "Equation Engine",
  "Physical Simulation",
  "Cyber Shadow",
  "AI Shadow Memory",
  "Human Systems",
  "Reality Test Arena",
  "Evolution Log",
  "Future Extensions"
] as const;

type Tab = (typeof tabs)[number];

type EquationState = {
  expectedSignal: number;
  actualSignal: number;
  noiseLevel: number;
  timeDelay: number;
  behaviorDeviation: number;
  missingInformation: number;
};

type SimulationState = {
  light: number;
  objectSize: number;
  opacity: number;
  distance: number;
  surfaceDistance: number;
};

const sampleActivities: CyberActivity[] = [
  { name: "Normal Student", typingSpeed: 43, clickRhythm: 1.3, loginAbnormality: 6, fileAccessCount: 4, failedAttempts: 1, apiRate: 9, pathDeviation: 7, latencyMismatch: 6 },
  { name: "Admin", typingSpeed: 50, clickRhythm: 1.1, loginAbnormality: 10, fileAccessCount: 14, failedAttempts: 1, apiRate: 18, pathDeviation: 12, latencyMismatch: 8 },
  { name: "Bot Attack", typingSpeed: 180, clickRhythm: 0.1, loginAbnormality: 92, fileAccessCount: 80, failedAttempts: 34, apiRate: 160, pathDeviation: 88, latencyMismatch: 62 },
  { name: "Slow Insider", typingSpeed: 26, clickRhythm: 4.2, loginAbnormality: 48, fileAccessCount: 28, failedAttempts: 2, apiRate: 8, pathDeviation: 42, latencyMismatch: 18 },
  { name: "VPN Hacker", typingSpeed: 72, clickRhythm: 0.6, loginAbnormality: 76, fileAccessCount: 40, failedAttempts: 9, apiRate: 70, pathDeviation: 65, latencyMismatch: 84 }
];

const futureExtensions = [
  ["Shadow-Based Cybersecurity Engine", "Detect attackers by invisible behavior traces."],
  ["Shadow Memory AI", "AI learns from what is missing, not only what is present."],
  ["Photonic Shadow Computing", "Use light, absence, interference, and blocked signals for computation."],
  ["Neuromorphic Shadow Learning", "Model uncertainty and absence as memory traces."],
  ["Shadow Address Protocol", "Create unique behavioral shadow IDs for users, devices, and events."],
  ["Shadow Reality Simulator", "Test whether the theory appears in physics, biology, society, economics, and cognition."],
  ["Shadow Dataset Builder", "Collect visible action plus hidden trace pairs."],
  ["Shadow Score API", "Expose shadow scoring as an API endpoint for other portals."]
];

const humanSystems = [
  ["Education", "Visible = exam marks", "Shadow = stress, weak basics, language barrier, fear"],
  ["Economy", "Visible = income", "Shadow = unpaid labor, attention capture, hidden inequality"],
  ["Innovation", "Visible = product", "Shadow = failed prototypes, ignored ideas, invisible effort"],
  ["Society", "Visible = public behavior", "Shadow = pressure, culture, hidden incentives"],
  ["Cyber World", "Visible = login", "Shadow = behavior pattern, abnormal rhythm, missing normal steps"]
];

const memoryEvent = generateShadowMemory({
  visible: 'User clicked "Generate Report"',
  shadow: "User first opened pricing page, waited 30 seconds, returned, then generated report."
});

export function ShadowFieldTheoryLab() {
  const [active, setActive] = useState<Tab>("Theory Core");
  const [equation, setEquation] = useState({
    expectedSignal: 100,
    actualSignal: 63,
    noiseLevel: 18,
    timeDelay: 24,
    behaviorDeviation: 37,
    missingInformation: 42
  });
  const [sim, setSim] = useState({ light: 72, objectSize: 44, opacity: 86, distance: 32, surfaceDistance: 58 });
  const [tests, setTests] = useState<RealityTest[]>(defaultRealityTests);
  const [evolution, setEvolution] = useState<EvolutionEntry[]>(defaultEvolutionEntries);
  const [logFilter, setLogFilter] = useState("All");
  const [newTest, setNewTest] = useState<RealityTest>({
    system: "",
    expected: "",
    actual: "",
    shadow: "",
    measurable: "partially",
    application: "",
    confidence: 65,
    notes: ""
  });
  const [newEntry, setNewEntry] = useState<EvolutionEntry>({
    title: "",
    type: "theorem",
    description: "",
    confidence: 70,
    date: new Date().toISOString().slice(0, 10),
    status: "idea"
  });

  useEffect(() => {
    const savedTests = window.localStorage.getItem("shadow-field-tests");
    const savedEvolution = window.localStorage.getItem("shadow-field-evolution");
    if (savedTests) setTests(JSON.parse(savedTests) as RealityTest[]);
    if (savedEvolution) setEvolution(JSON.parse(savedEvolution) as EvolutionEntry[]);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("shadow-field-tests", JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    window.localStorage.setItem("shadow-field-evolution", JSON.stringify(evolution));
  }, [evolution]);

  const physicalScore = calculatePhysicalShadow(equation.actualSignal, equation.expectedSignal);
  const cyberScore = clamp((equation.behaviorDeviation * 1.35 + equation.timeDelay + equation.missingInformation * 1.2 + equation.noiseLevel) / 4.55);
  const informationScore = calculateInformationShadow({
    missingInfo: equation.missingInformation,
    contradiction: equation.behaviorDeviation,
    uncertainty: (equation.noiseLevel + equation.timeDelay) / 2,
    delay: equation.timeDelay,
    noise: equation.noiseLevel
  });
  const finalScore = clamp((physicalScore + cyberScore + informationScore.score) / 3);
  const shadowSize = clamp(sim.objectSize * (1 + sim.surfaceDistance / 80) + sim.distance * 0.35, 30, 190);
  const shadowDarkness = clamp(sim.opacity * 0.75 + (100 - sim.light) * 0.25, 8, 96);

  const filteredEvolution = evolution.filter((entry) => {
    if (logFilter === "All") return true;
    if (logFilter === "Theorems") return entry.type === "theorem";
    if (logFilter === "Applications") return entry.type === "application";
    if (logFilter === "Experiments") return entry.type === "experiment";
    if (logFilter === "Failures") return entry.type === "failure";
    return entry.type === "future idea";
  });

  function addRealityTest() {
    if (!newTest.system.trim()) return;
    const result = runRealityTest(newTest);
    setTests((current) => [newTest, ...current]);
    setEvolution((current) => [
      {
        title: `Reality test: ${newTest.system}`,
        type: "experiment",
        description: `${newTest.shadow || "Shadow trace recorded."} Result: ${result.level} shadow, ${result.applicationPotential}.`,
        confidence: clamp(newTest.confidence),
        date: new Date().toISOString().slice(0, 10),
        status: "testing"
      },
      ...current
    ]);
    setNewTest({ system: "", expected: "", actual: "", shadow: "", measurable: "partially", application: "", confidence: 65, notes: "" });
    setActive("Evolution Log");
  }

  function addEvolutionEntry() {
    if (!newEntry.title.trim()) return;
    setEvolution((current) => [{ ...newEntry, date: newEntry.date || new Date().toISOString().slice(0, 10) }, ...current]);
    setNewEntry({ title: "", type: "theorem", description: "", confidence: 70, date: new Date().toISOString().slice(0, 10), status: "idea" });
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.24),transparent_34%),linear-gradient(135deg,rgba(8,18,31,0.96),rgba(5,8,15,0.99))] p-6 shadow-glow md:p-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent" />
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>Shadow Intelligence Portal</Badge>
              <Badge tone="lime">Research prototype</Badge>
            </div>
            <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight text-white md:text-6xl">Shadow Field Theory Lab</h1>
            <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300 md:text-base">
              Detecting hidden traces behind every action: physical shadows, cyber shadows, information gaps, AI memory shadows, and future reality-testing simulations.
            </p>
          </div>
          <div className="rounded-lg border border-violet-300/25 bg-violet-400/10 p-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">Core equation</div>
            <div className="mt-2 text-xl font-semibold text-white">Shadow = Expected - Actual</div>
            <div className="mt-1 font-mono text-xs text-violet-200">S(x,t) = 1 - I(x,t) / I0(x,t)</div>
          </div>
        </div>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={`shrink-0 rounded-md border px-4 py-2 text-sm transition ${
                active === tab ? "border-violet-300/60 bg-violet-500 text-white" : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {active === "Theory Core" && <TheoryCore />}
      {active === "Equation Engine" && (
        <EquationEngine
          equation={equation}
          setEquation={setEquation}
          physicalScore={physicalScore}
          cyberScore={cyberScore}
          informationScore={informationScore}
          finalScore={finalScore}
        />
      )}
      {active === "Physical Simulation" && <PhysicalSimulation sim={sim} setSim={setSim} shadowSize={shadowSize} shadowDarkness={shadowDarkness} />}
      {active === "Cyber Shadow" && <CyberShadow />}
      {active === "AI Shadow Memory" && <AIShadowMemory />}
      {active === "Human Systems" && <HumanSystems />}
      {active === "Reality Test Arena" && <RealityTestArena tests={tests} newTest={newTest} setNewTest={setNewTest} addRealityTest={addRealityTest} />}
      {active === "Evolution Log" && (
        <EvolutionLog
          evolution={filteredEvolution}
          newEntry={newEntry}
          setNewEntry={setNewEntry}
          addEvolutionEntry={addEvolutionEntry}
          logFilter={logFilter}
          setLogFilter={setLogFilter}
        />
      )}
      {active === "Future Extensions" && <FutureExtensions />}
    </div>
  );
}

function TheoryCore() {
  return (
    <Section title="Theory Core" subtitle="A shadow is not only darkness. It is a hidden trace created by interaction.">
      <Card className="mb-4">
        <p className="text-sm leading-6 text-slate-300">
          Shadow Field Theory proposes that every interaction creates both a visible effect and a hidden shadow trace. A shadow is not only darkness. It is any measurable difference between expected reality and observed reality.
        </p>
        <div className="mt-4 rounded-md border border-violet-300/20 bg-violet-400/10 p-4 text-sm leading-6 text-violet-100">
          <strong>Shadow Trace Principle:</strong> For every observable action A inside a system, there exists a corresponding shadow trace S, formed by the difference between expected behavior and actual behavior.
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          ["Physical Shadow", "A reduction of photons caused by blockage.", "🌑"],
          ["Information Shadow", "Missing, hidden, delayed, or contradicted information after an event.", "🧩"],
          ["Cyber Shadow", "The invisible behavioral trace created by user or attacker activity.", "🛡️"],
          ["AI Shadow Memory", "Learning from absence, failed paths, contradictions, uncertainty, and hidden context.", "🧠"],
          ["Cognitive Shadow", "A model of what is not directly visible but still affects decisions.", "👁️"]
        ].map(([title, body, icon]) => (
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

function EquationEngine({
  equation,
  setEquation,
  physicalScore,
  cyberScore,
  informationScore,
  finalScore
}: {
  equation: EquationState;
  setEquation: Dispatch<SetStateAction<EquationState>>;
  physicalScore: number;
  cyberScore: number;
  informationScore: { score: number; explanation: string };
  finalScore: number;
}) {
  return (
    <Section title="Shadow Equation Engine" subtitle="Calculate physical, cyber, information, and combined shadow intensity.">
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(equation).map(([key, value]) => (
              <label key={key} className="text-sm">
                <span className="capitalize text-slate-300">{key.replace(/([A-Z])/g, " $1")}</span>
                <input
                  type="number"
                  value={value}
                  onChange={(event) => setEquation({ ...equation, [key]: Number(event.target.value) })}
                  className="mt-1 h-10 w-full rounded-md border border-white/10 bg-black/25 px-3 text-slate-100 outline-none focus:border-violet-300/60"
                />
              </label>
            ))}
          </div>
        </Card>
        <Card>
          <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <div className="space-y-4">
              <Meter label="Physical Shadow" value={physicalScore} />
              <Meter label="Cyber Shadow" value={cyberScore} />
              <Meter label="Information Shadow" value={informationScore.score} />
              <Meter label="Final Shadow Intensity" value={finalScore} />
              <p className="text-sm leading-6 text-slate-400">{informationScore.explanation}</p>
              <p className="text-sm font-semibold text-white">Risk interpretation: {interpretShadow(finalScore)}</p>
            </div>
            <div className="relative mx-auto flex size-52 items-center justify-center rounded-full border border-cyan-signal/20 bg-cyan-signal/15 shadow-glow">
              <div className="absolute inset-0 rounded-full bg-cyan-signal/20" />
              <div className="absolute inset-0 rounded-full bg-black transition-all duration-500" style={{ opacity: clamp(finalScore) / 115 }} />
              <div className="relative z-10 text-center">
                <Gauge className="mx-auto size-7 text-violet-200" />
                <div className="mt-2 text-3xl font-semibold text-white">{Math.round(finalScore)}%</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">{levelFromScore(finalScore)}</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function PhysicalSimulation({
  sim,
  setSim,
  shadowSize,
  shadowDarkness
}: {
  sim: SimulationState;
  setSim: Dispatch<SetStateAction<SimulationState>>;
  shadowSize: number;
  shadowDarkness: number;
}) {
  return (
    <Section title="Physical Shadow Simulation" subtitle="Light source, object, and shadow region modeled as missing photons.">
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="relative h-80 overflow-hidden rounded-lg border border-white/10 bg-gradient-to-r from-yellow-200/80 via-slate-500/40 to-black">
            <div
              className="absolute left-8 top-1/2 -translate-y-1/2 rounded-full bg-yellow-200 blur-sm"
              style={{ width: sim.light, height: sim.light, boxShadow: `0 0 ${sim.light}px rgba(253,224,71,.8)` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 rounded-lg border border-white/20 bg-slate-950"
              style={{ left: 150 + sim.distance, width: sim.objectSize, height: sim.objectSize * 2, opacity: sim.opacity / 100 }}
            />
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black blur-md"
              style={{
                width: shadowSize * 2,
                height: shadowSize * 1.55,
                opacity: shadowDarkness / 100,
                clipPath: "polygon(0 35%, 100% 10%, 100% 90%, 0 65%)"
              }}
            />
            <div className="absolute bottom-4 left-4 rounded-md border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs text-white/80">
              S(x,t) = 1 - I(x,t) / I0(x,t)
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">Darkness here is modeled as missing photons compared to expected light.</p>
        </Card>
        <Card>
          {Object.entries(sim).map(([key, value]) => (
            <label key={key} className="mb-5 block text-sm">
              <span className="capitalize text-slate-300">
                {key.replace(/([A-Z])/g, " $1")}: <span className="font-mono text-violet-200">{value}</span>
              </span>
              <input
                type="range"
                min="1"
                max="100"
                value={value}
                onChange={(event) => setSim({ ...sim, [key]: Number(event.target.value) })}
                className="mt-2 w-full accent-violet-400"
              />
            </label>
          ))}
        </Card>
      </div>
    </Section>
  );
}

function CyberShadow() {
  return (
    <Section title="Cyber Shadow Addressing" subtitle="Even if identity is hidden, behavior creates a measurable shadow trace.">
      <div className="mb-4 rounded-md border border-amber-300/25 bg-amber-300/10 p-3 text-sm text-amber-100">
        Research prototype / simulation only. This does not provide a real security guarantee.
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sampleActivities.map((activity) => {
          const result = calculateCyberShadow(activity);
          return (
            <Card key={activity.name}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{activity.name}</h3>
                  <p className="mt-1 font-mono text-xs text-violet-200">{result.shadowAddress}</p>
                </div>
                <ShieldAlert className="size-5 text-violet-200" />
              </div>
              <div className="mt-4">
                <Meter label="Cyber Shadow Score" value={result.score} />
              </div>
              <p className="mt-3 text-sm font-semibold text-white">Suspicion Level: {result.level}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-400">
                {result.reasons.map((reason) => <li key={reason}>{reason}</li>)}
              </ul>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}

function AIShadowMemory() {
  return (
    <Section title="AI Shadow Memory" subtitle="AI learns from what is missing, delayed, contradicted, or uncertain.">
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h3 className="text-xl font-semibold text-white">Visible Signal</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {["User clicked buy", "User opened article", "User asked question", "Model gave answer"].map((item) => <li key={item}>Visible: {item}</li>)}
          </ul>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold text-white">Shadow Trace</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {["User hesitated", "User skipped step", "User contradicted earlier behavior", "User abandoned path", "Model was uncertain", "Answer required hidden assumption"].map((item) => <li key={item}>Shadow: {item}</li>)}
          </ul>
        </Card>
      </div>
      <Card className="mt-5">
        <h3 className="text-xl font-semibold text-white">AI Memory Update</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">Visible action says WHAT happened. Shadow trace suggests WHY it happened.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Info label="Visible Signal" value={memoryEvent.visibleSignal} />
          <Info label="Shadow Trace" value={memoryEvent.shadowTrace} />
          <Info label="Possible Meaning" value={memoryEvent.possibleMeaning} />
          <Info label="Future Prediction" value={memoryEvent.futurePrediction} />
        </div>
      </Card>
      <Card className="mt-5">
        <h3 className="text-xl font-semibold text-white">Shadow Learning Graph</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-6">
          {["Action", "Missing Context", "Delay", "Contradiction", "Uncertainty", "Future Prediction"].map((node, index) => (
            <div key={node} className="relative rounded-lg border border-violet-300/25 bg-violet-400/10 p-3 text-center text-xs text-violet-100">
              {node}
              {index < 5 && <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-slate-500 md:block">→</span>}
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
}

function HumanSystems() {
  return (
    <Section title="Human System Shadow Map" subtitle="Visible results often hide deeper invisible causes.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {humanSystems.map(([title, visible, shadow]) => (
          <Card key={title}>
            <Network className="size-5 text-violet-200" />
            <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-3 text-sm text-cyan-signal">{visible}</p>
            <p className="mt-2 text-sm text-violet-200">{shadow}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-5">
        <h3 className="text-lg font-semibold text-white">Cause-effect map</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {["Visible Result", "Hidden Pressure", "Behavioral Distortion", "Shadow-Aware Decision"].map((node, index) => (
            <div key={node} className="relative rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
              {node}
              {index < 3 && <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-violet-200 md:block">→</span>}
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
}

function RealityTestArena({
  tests,
  newTest,
  setNewTest,
  addRealityTest
}: {
  tests: RealityTest[];
  newTest: RealityTest;
  setNewTest: (value: RealityTest) => void;
  addRealityTest: () => void;
}) {
  return (
    <Section title="Reality Test Arena" subtitle="Test Shadow Field Theory against physical, cyber, AI, human, economic, biological, and universal systems.">
      <div className="mb-4 flex flex-wrap gap-2">
        {["Physics laws", "Cybersecurity systems", "AI behavior", "Human behavior", "Economic systems", "Biological systems", "Universal patterns"].map((item) => <Badge key={item}>{item}</Badge>)}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {tests.map((test, index) => {
          const result = runRealityTest(test);
          return (
            <Card key={`${test.system}-${index}`}>
              <h3 className="text-xl font-semibold text-white">{test.system}</h3>
              <div className="mt-3 grid gap-2 text-sm text-slate-300">
                <p><strong>Expected:</strong> {test.expected}</p>
                <p><strong>Actual:</strong> {test.actual}</p>
                <p className="text-violet-200"><strong>Shadow:</strong> {test.shadow}</p>
                <p className="text-cyan-signal"><strong>Application:</strong> {test.application}</p>
              </div>
              <div className="mt-4">
                <Meter label="Reality Shadow" value={result.shadowScore} />
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-400">
                {result.measurability} / {result.applicationPotential} / {result.confidenceComment}
              </p>
            </Card>
          );
        })}
      </div>
      <Card className="mt-5">
        <h3 className="text-xl font-semibold text-white">Add New Reality Test</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(["system", "expected", "actual", "shadow", "application", "measurable"] as const).map((key) => (
            <input
              key={key}
              placeholder={key}
              value={String(newTest[key] ?? "")}
              onChange={(event) => setNewTest({ ...newTest, [key]: event.target.value })}
              className="h-10 rounded-md border border-white/10 bg-black/25 px-3 text-sm text-slate-100 outline-none focus:border-violet-300/60"
            />
          ))}
          <input
            type="number"
            placeholder="confidence"
            value={newTest.confidence}
            onChange={(event) => setNewTest({ ...newTest, confidence: Number(event.target.value) })}
            className="h-10 rounded-md border border-white/10 bg-black/25 px-3 text-sm text-slate-100 outline-none focus:border-violet-300/60"
          />
        </div>
        <button type="button" onClick={addRealityTest} className="mt-4 rounded-md bg-violet-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-400">
          Run Shadow Analysis
        </button>
      </Card>
    </Section>
  );
}

function EvolutionLog({
  evolution,
  newEntry,
  setNewEntry,
  addEvolutionEntry,
  logFilter,
  setLogFilter
}: {
  evolution: EvolutionEntry[];
  newEntry: EvolutionEntry;
  setNewEntry: (value: EvolutionEntry) => void;
  addEvolutionEntry: () => void;
  logFilter: string;
  setLogFilter: (value: string) => void;
}) {
  return (
    <Section title="Evolution Log" subtitle="Add new theorems, observations, applications, failed tests, and future questions.">
      <Card className="mb-5">
        <div className="grid gap-3 md:grid-cols-2">
          <input value={newEntry.title} onChange={(event) => setNewEntry({ ...newEntry, title: event.target.value })} placeholder="title" className="h-10 rounded-md border border-white/10 bg-black/25 px-3 text-sm text-slate-100 outline-none focus:border-violet-300/60" />
          <select value={newEntry.type} onChange={(event) => setNewEntry({ ...newEntry, type: event.target.value as EvolutionEntry["type"] })} className="h-10 rounded-md border border-white/10 bg-black/25 px-3 text-sm text-slate-100 outline-none focus:border-violet-300/60">
            <option value="theorem">theorem</option>
            <option value="experiment">experiment</option>
            <option value="application">application</option>
            <option value="failure">failure</option>
            <option value="future idea">future idea</option>
          </select>
          <select value={newEntry.status} onChange={(event) => setNewEntry({ ...newEntry, status: event.target.value as EvolutionEntry["status"] })} className="h-10 rounded-md border border-white/10 bg-black/25 px-3 text-sm text-slate-100 outline-none focus:border-violet-300/60">
            <option value="idea">idea</option>
            <option value="testing">testing</option>
            <option value="validated">validated</option>
            <option value="rejected">rejected</option>
            <option value="upgraded">upgraded</option>
          </select>
          <input type="number" value={newEntry.confidence} onChange={(event) => setNewEntry({ ...newEntry, confidence: Number(event.target.value) })} placeholder="confidence" className="h-10 rounded-md border border-white/10 bg-black/25 px-3 text-sm text-slate-100 outline-none focus:border-violet-300/60" />
          <textarea value={newEntry.description} onChange={(event) => setNewEntry({ ...newEntry, description: event.target.value })} placeholder="description" className="min-h-24 rounded-md border border-white/10 bg-black/25 p-3 text-sm text-slate-100 outline-none focus:border-violet-300/60 md:col-span-2" />
        </div>
        <button type="button" onClick={addEvolutionEntry} className="mt-4 rounded-md bg-violet-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-violet-400">
          Add Evolution Entry
        </button>
      </Card>
      <div className="mb-4 flex flex-wrap gap-2">
        {["All", "Theorems", "Applications", "Experiments", "Failures", "Future Ideas"].map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setLogFilter(filter)}
            className={`rounded-md border px-3 py-1.5 text-xs ${logFilter === filter ? "border-violet-300 bg-violet-500 text-white" : "border-white/10 bg-white/[0.04] text-slate-400"}`}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {evolution.map((entry, index) => (
          <Card key={`${entry.title}-${index}`}>
            <div className="flex justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
              <span className="h-fit rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase text-slate-400">{entry.type}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400">{entry.description}</p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-violet-200">{entry.date} / {entry.status}</p>
            <div className="mt-3">
              <Meter label="Confidence" value={entry.confidence} />
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function FutureExtensions() {
  return (
    <Section title="Future Extensions" subtitle="Roadmap for turning Shadow Field Theory into live applications.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {futureExtensions.map(([title, body]) => (
          <Card key={title}>
            <Sparkles className="size-5 text-violet-200" />
            <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section>
      <div className="mb-5">
        <div className="font-mono text-xs uppercase tracking-[0.22em] text-violet-200">{title}</div>
        <h2 className="mt-2 text-2xl font-semibold text-white">{subtitle}</h2>
      </div>
      {children}
    </section>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-white/10 bg-panel/78 p-5 shadow-glow backdrop-blur-xl ${className}`}>{children}</div>;
}

function Badge({ children, tone = "violet" }: { children: ReactNode; tone?: "violet" | "lime" }) {
  return (
    <span className={`rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${tone === "lime" ? "border-lime-signal/25 bg-lime-signal/10 text-lime-signal" : "border-violet-300/30 bg-violet-400/10 text-violet-200"}`}>
      {children}
    </span>
  );
}

function Meter({ value, label = "Shadow Intensity" }: { value: number; label?: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between gap-3 text-xs text-slate-300">
        <span>{label}</span>
        <span className="font-mono text-slate-100">{Math.round(clamp(value))}% / {levelFromScore(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-signal via-violet-400 to-rose-signal transition-all duration-500" style={{ width: `${clamp(value)}%` }} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{label}</div>
      <p className="mt-1 text-sm leading-6 text-slate-300">{value}</p>
    </div>
  );
}

function interpretShadow(score: number) {
  const value = clamp(score);
  if (value <= 20) return "Low shadow";
  if (value <= 45) return "Soft shadow";
  if (value <= 70) return "Strong shadow";
  return "Critical hidden disturbance";
}
