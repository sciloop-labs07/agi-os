"use client";

import {
  Atom,
  Banknote,
  BookOpen,
  BrainCircuit,
  ChevronRight,
  CircleDollarSign,
  Database,
  Factory,
  Globe2,
  Landmark,
  Network,
  Pause,
  Play,
  RefreshCw,
  Rocket,
  Scale,
  Sparkles,
  Users,
  WalletCards
} from "lucide-react";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  futureEconomies,
  moneyAudiences,
  moneyEras,
  moneyLenses,
  simulateEconomy,
  type EconomyInputs,
  type MoneyAudience
} from "@/lib/money-universe";
import styles from "./money-universe.module.css";

const views = ["Universe", "Evolution", "Simulator", "World", "Questions", "Future"] as const;
type View = (typeof views)[number];

const viewIcons: Record<View, ReactNode> = {
  Universe: <Atom className="size-4" />,
  Evolution: <Network className="size-4" />,
  Simulator: <Factory className="size-4" />,
  World: <Globe2 className="size-4" />,
  Questions: <BrainCircuit className="size-4" />,
  Future: <Rocket className="size-4" />
};

const audienceTaglines: Record<MoneyAudience, string> = {
  Kid: "A village invents money from nothing.",
  Student: "See why every monetary system had to evolve.",
  Founder: "Trace how trust becomes capital, companies, and scale.",
  Investor: "Read money as claims, risk, time, and optionality.",
  Researcher: "Model money as emergent information infrastructure."
};

const questions = [
  { question: "Who creates money?", answer: "Commercial banks create most spendable money through lending; central banks create base money and shape its conditions." },
  { question: "Is money real?", answer: "The token is physical or digital. Its value is relational: a maintained agreement about future acceptance." },
  { question: "Why does inflation happen?", answer: "Prices rise when spending power grows faster than available goods, or when supply becomes harder and more expensive." },
  { question: "What creates wealth?", answer: "Useful knowledge, energy, tools, institutions, and cooperation create real capacity. Money measures claims on that capacity." },
  { question: "Why do banks exist?", answer: "Banks connect savers, borrowers, payments, risk assessment, and maturity transformation inside one ledger network." },
  { question: "Can money disappear?", answer: "Yes. Debt repayment, defaults, asset repricing, bank failure, and lost confidence can destroy monetary claims." },
  { question: "Why are countries rich?", answer: "Productivity, institutions, human capital, energy, geography, trade, history, and bargaining power interact over generations." },
  { question: "What comes after money?", answer: "Even under abundance, systems still need to coordinate scarce time, attention, energy, compute, land, and decision rights." }
];

type WorldDatum = {
  code: string;
  label: string;
  gdp: number | null;
  gdpYear: string | null;
  inflation: number | null;
  inflationYear: string | null;
};

type WorldDataResponse = {
  source: string;
  status: "live" | "unavailable";
  updatedAt?: string;
  message?: string;
  values: WorldDatum[];
};

const initialInputs: EconomyInputs = {
  population: 62,
  resources: 58,
  trust: 72,
  productivity: 65,
  moneySupply: 104,
  taxRate: 22
};

export function MoneyUniversePortal() {
  const [audience, setAudience] = useState<MoneyAudience>("Student");
  const [activeLens, setActiveLens] = useState(moneyLenses[0].id);
  const [view, setView] = useState<View>("Universe");
  const [era, setEra] = useState(moneyEras[7].id);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [inputs, setInputs] = useState(initialInputs);
  const [running, setRunning] = useState(true);
  const [worldData, setWorldData] = useState<WorldDataResponse | null>(null);
  const [syncing, setSyncing] = useState(false);

  const lens = moneyLenses.find((item) => item.id === activeLens) ?? moneyLenses[0];
  const selectedEra = moneyEras.find((item) => item.id === era) ?? moneyEras[0];
  const economy = useMemo(() => simulateEconomy(inputs), [inputs]);

  async function syncWorldData() {
    setSyncing(true);
    try {
      const response = await fetch("/api/money-universe/world-data", { cache: "no-store" });
      const payload = (await response.json()) as WorldDataResponse;
      setWorldData(payload);
    } catch {
      setWorldData({ source: "World Bank Open Data", status: "unavailable", message: "The live source could not be reached.", values: [] });
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className={styles.portal}>
      <section className={`${styles.hero} ${running ? "" : styles.paused}`} aria-label="Interactive model of money">
        <div className={styles.starfield} aria-hidden="true" />
        <header className={styles.heroHeader}>
          <div>
            <div className={styles.eyebrow}><CircleDollarSign className="size-4" /> AGI OS / ECONOMIC INTELLIGENCE</div>
            <h1>THE MONEY UNIVERSE</h1>
            <p>Everything humanity has ever invented about money.</p>
          </div>
          <button type="button" className={styles.motionButton} onClick={() => setRunning((value) => !value)} aria-label={running ? "Pause animation" : "Play animation"}>
            {running ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
        </header>

        <div className={styles.audienceControl} aria-label="Choose learning level">
          {moneyAudiences.map((item) => (
            <button key={item} type="button" aria-pressed={audience === item} onClick={() => setAudience(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className={styles.orbitStage}>
          <svg className={styles.orbitLines} viewBox="0 0 800 460" role="img" aria-label="Money connects trust, memory, information, coordination, time, and power">
            <defs>
              <linearGradient id="money-orbit-gradient" x1="0" x2="1">
                <stop offset="0" stopColor="#48e5ff" />
                <stop offset="0.5" stopColor="#f4d35e" />
                <stop offset="1" stopColor="#ff6b8a" />
              </linearGradient>
              <filter id="money-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <ellipse cx="400" cy="230" rx="282" ry="166" fill="none" stroke="rgba(148,163,184,.18)" />
            <ellipse cx="400" cy="230" rx="210" ry="124" fill="none" stroke="rgba(72,229,255,.16)" strokeDasharray="5 12" />
            <path className={styles.energyPath} d="M118 230 C210 28 590 28 682 230 C590 432 210 432 118 230Z" fill="none" stroke="url(#money-orbit-gradient)" strokeWidth="2" filter="url(#money-glow)" />
            <path className={styles.energyPathReverse} d="M400 64 C690 64 690 396 400 396 C110 396 110 64 400 64Z" fill="none" stroke="rgba(182,255,97,.55)" strokeWidth="1.4" strokeDasharray="4 10" />
          </svg>

          <div className={styles.moneyCore}>
            <div className={styles.coreHalo} aria-hidden="true" />
            <span>WHAT IS</span>
            <strong>MONEY?</strong>
            <small>{audienceTaglines[audience]}</small>
          </div>

          {moneyLenses.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.orbitNode} ${activeLens === item.id ? styles.orbitNodeActive : ""}`}
              style={{ "--node-index": index } as CSSProperties}
              aria-pressed={activeLens === item.id}
              onClick={() => setActiveLens(item.id)}
            >
              <span>{item.signal}</span>
              <strong>{item.shortLabel}</strong>
            </button>
          ))}
        </div>

        <div className={styles.lensReadout} aria-live="polite">
          <div><span>{lens.label}</span><strong>{lens.question}</strong></div>
          <p>{lens.descriptions[audience]}</p>
        </div>
      </section>

      <nav className={styles.viewNav} aria-label="Money Universe sections">
        {views.map((item) => (
          <button key={item} type="button" aria-pressed={view === item} onClick={() => setView(item)}>
            {viewIcons[item]} {item}
          </button>
        ))}
      </nav>

      <section className={styles.workspace}>
        {view === "Universe" && <UniverseView audience={audience} onOpenEvolution={() => setView("Evolution")} />}
        {view === "Evolution" && <EvolutionView selected={selectedEra.id} onSelect={setEra} era={selectedEra} />}
        {view === "Simulator" && <SimulatorView inputs={inputs} onChange={setInputs} economy={economy} />}
        {view === "World" && <WorldView data={worldData} syncing={syncing} onSync={() => void syncWorldData()} />}
        {view === "Questions" && <QuestionsView selected={questionIndex} onSelect={setQuestionIndex} />}
        {view === "Future" && <FutureView />}
      </section>
    </div>
  );
}

function UniverseView({ audience, onOpenEvolution }: { audience: MoneyAudience; onOpenEvolution: () => void }) {
  const steps = [
    { icon: <Users />, label: "Need", value: audience === "Kid" ? "I have bananas" : "Different people hold different resources" },
    { icon: <Scale />, label: "Problem", value: audience === "Kid" ? "You want fish" : "Wants, timing, and trust do not match" },
    { icon: <Banknote />, label: "Invention", value: audience === "Kid" ? "Choose a shared token" : "Create a transferable record of value" },
    { icon: <WalletCards />, label: "Network", value: audience === "Kid" ? "Everyone accepts it" : "Acceptance increases its usefulness" },
    { icon: <Globe2 />, label: "Scale", value: audience === "Kid" ? "The village can build more" : "Specialization expands across civilization" }
  ];
  return (
    <div className={styles.explainer}>
      <div className={styles.sectionHeading}><span>FIRST PRINCIPLES</span><h2>Humanity invents money</h2></div>
      <div className={styles.inventionFlow}>
        {steps.map((step, index) => (
          <div className={styles.flowStep} key={step.label}>
            <div className={styles.flowIcon}>{step.icon}</div>
            <span>{step.label}</span>
            <strong>{step.value}</strong>
            {index < steps.length - 1 && <ChevronRight className={styles.flowArrow} aria-hidden="true" />}
          </div>
        ))}
      </div>
      <button type="button" className={styles.primaryAction} onClick={onOpenEvolution}>See what humanity invented next <ChevronRight className="size-4" /></button>
    </div>
  );
}

function EvolutionView({ selected, onSelect, era }: { selected: string; onSelect: (id: string) => void; era: (typeof moneyEras)[number] }) {
  return (
    <div>
      <div className={styles.sectionHeading}><span>MONEY EVOLUTION ENGINE</span><h2>Each form solved a coordination problem</h2></div>
      <div className={styles.timeline} role="list" aria-label="Evolution of money">
        <div className={styles.timelineRail} aria-hidden="true" />
        {moneyEras.map((item, index) => (
          <button key={item.id} type="button" className={selected === item.id ? styles.timelineActive : ""} aria-pressed={selected === item.id} onClick={() => onSelect(item.id)}>
            <span className={styles.timelineIndex}>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.label}</strong>
            <small>{item.year}</small>
          </button>
        ))}
      </div>
      <div className={styles.eraReadout}>
        <div><span>Pressure</span><strong>{era.need}</strong></div>
        <div className={styles.eraTransform}><span>{era.label}</span><ChevronRight /></div>
        <div><span>Breakthrough</span><strong>{era.leap}</strong></div>
        <div><span>New system</span><strong>{era.system}</strong></div>
      </div>
    </div>
  );
}

function SimulatorView({ inputs, onChange, economy }: { inputs: EconomyInputs; onChange: (inputs: EconomyInputs) => void; economy: ReturnType<typeof simulateEconomy> }) {
  const controls: { key: keyof EconomyInputs; label: string; min: number; max: number; suffix?: string }[] = [
    { key: "population", label: "Population", min: 20, max: 120 },
    { key: "resources", label: "Resources", min: 20, max: 100 },
    { key: "trust", label: "Trust", min: 0, max: 100, suffix: "%" },
    { key: "productivity", label: "Productivity", min: 20, max: 100 },
    { key: "moneySupply", label: "Money supply", min: 40, max: 180 },
    { key: "taxRate", label: "Tax rate", min: 0, max: 55, suffix: "%" }
  ];
  const sceneStyle = {
    "--trade-speed": `${Math.max(1.2, 7 - economy.trade / 18)}s`,
    "--economy-stability": `${economy.stability / 100}`,
    "--inflation-heat": `${Math.max(0, economy.inflation) / 80}`
  } as CSSProperties;

  return (
    <div className={styles.simulatorLayout}>
      <div className={styles.controlsColumn}>
        <div className={styles.sectionHeading}><span>LIVE ECONOMY LAB</span><h2>Change the village</h2></div>
        {controls.map((control) => (
          <label key={control.key} className={styles.rangeControl}>
            <span>{control.label}<strong>{inputs[control.key]}{control.suffix}</strong></span>
            <input type="range" min={control.min} max={control.max} value={inputs[control.key]} onInput={(event) => onChange({ ...inputs, [control.key]: Number(event.currentTarget.value) })} />
          </label>
        ))}
      </div>
      <div className={styles.simulationArea}>
        <div className={styles.economyScene} style={sceneStyle} role="img" aria-label={`Simulated village economy: trade ${Math.round(economy.trade)}, stability ${Math.round(economy.stability)}, inflation ${economy.inflation.toFixed(1)} percent`}>
          <div className={`${styles.sceneNode} ${styles.scenePeople}`}><Users /><span>People</span></div>
          <div className={`${styles.sceneNode} ${styles.sceneMarket}`}><CircleDollarSign /><span>Market</span></div>
          <div className={`${styles.sceneNode} ${styles.sceneFactory}`}><Factory /><span>Production</span></div>
          <div className={`${styles.sceneNode} ${styles.sceneBank}`}><Landmark /><span>Bank</span></div>
          <div className={`${styles.sceneNode} ${styles.sceneState}`}><Scale /><span>State</span></div>
          {Array.from({ length: 10 }).map((_, index) => <i key={index} className={styles.tradeParticle} style={{ "--particle-index": index } as CSSProperties} />)}
        </div>
        <div className={styles.outcomeBars}>
          <Outcome label="Trade" value={economy.trade} />
          <Outcome label="Stability" value={economy.stability} />
          <Outcome label="Real wealth" value={economy.wealth} />
          <Outcome label="Inequality" value={economy.inequality} inverse />
          <Outcome label="Inflation" value={Math.max(0, economy.inflation)} suffix="%" danger={economy.inflation > 18} />
        </div>
        <p className={styles.diagnosis}>{economy.diagnosis}</p>
      </div>
    </div>
  );
}

function Outcome({ label, value, suffix = "", danger = false, inverse = false }: { label: string; value: number; suffix?: string; danger?: boolean; inverse?: boolean }) {
  const width = Math.min(100, Math.max(0, inverse ? 100 - value : value));
  return <div className={styles.outcome}><span>{label}<strong>{value.toFixed(1)}{suffix}</strong></span><div><i className={danger ? styles.dangerBar : ""} style={{ width: `${width}%` }} /></div></div>;
}

function WorldView({ data, syncing, onSync }: { data: WorldDataResponse | null; syncing: boolean; onSync: () => void }) {
  const maxGdp = Math.max(...(data?.values.map((item) => item.gdp ?? 0) ?? [1]), 1);
  return (
    <div>
      <div className={styles.worldHeader}>
        <div className={styles.sectionHeading}><span>GLOBAL MONEY EXPLORER</span><h2>Official economic signals</h2></div>
        <button type="button" className={styles.primaryAction} onClick={onSync} disabled={syncing}><RefreshCw className={`size-4 ${syncing ? "animate-spin" : ""}`} /> {syncing ? "Syncing" : "Sync World Bank"}</button>
      </div>
      {!data ? (
        <div className={styles.dataConstellation}>
          <Globe2 className={styles.globeIcon} />
          {["World Bank", "IMF", "BIS", "OECD", "FRED", "Central banks"].map((source, index) => <span key={source} style={{ "--source-index": index } as CSSProperties}>{source}</span>)}
          <p>Connect public data systems to compare output, prices, money, debt, and wealth.</p>
        </div>
      ) : data.status === "unavailable" ? (
        <div className={styles.dataMessage}><Database /><strong>Live source unavailable</strong><span>{data.message}</span></div>
      ) : (
        <div className={styles.worldBars}>
          {data.values.map((item) => (
            <div key={item.code} className={styles.worldRow}>
              <strong>{item.code}</strong>
              <span>{item.label}</span>
              <div><i style={{ width: `${((item.gdp ?? 0) / maxGdp) * 100}%` }} /></div>
              <b>{formatCurrency(item.gdp)} <small>{item.gdpYear}</small></b>
              <em>{item.inflation?.toFixed(1) ?? "--"}% inflation</em>
            </div>
          ))}
          <p className={styles.sourceLine}><Database className="size-4" /> {data.source} / latest reported annual observations</p>
        </div>
      )}
    </div>
  );
}

function QuestionsView({ selected, onSelect }: { selected: number; onSelect: (index: number) => void }) {
  return (
    <div>
      <div className={styles.sectionHeading}><span>THE BIG QUESTIONS</span><h2>Open any door</h2></div>
      <div className={styles.questionUniverse}>
        <div className={styles.questionAnswer}><Sparkles /><strong>{questions[selected].question}</strong><p>{questions[selected].answer}</p></div>
        <div className={styles.questionGrid}>{questions.map((item, index) => <button key={item.question} type="button" aria-pressed={selected === index} onClick={() => onSelect(index)}>{item.question}</button>)}</div>
      </div>
    </div>
  );
}

function FutureView() {
  return (
    <div>
      <div className={styles.sectionHeading}><span>FUTURE OF MONEY</span><h2>From human exchange to machine civilization</h2></div>
      <div className={styles.futureMap}>
        <div className={styles.futureBeam} aria-hidden="true" />
        {futureEconomies.map((future, index) => (
          <div key={future.id} className={styles.futureNode} style={{ "--future-index": index } as CSSProperties}>
            <span>{future.horizon}</span><strong>{future.label}</strong><p>{future.detail}</p>
          </div>
        ))}
      </div>
      <div className={styles.futureQuestion}><BookOpen /><span>The open problem</span><strong>How do we preserve agency, fairness, and meaning when intelligence and production become abundant?</strong></div>
    </div>
  );
}

function formatCurrency(value: number | null) {
  if (value === null) return "--";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  return `$${value.toLocaleString()}`;
}
