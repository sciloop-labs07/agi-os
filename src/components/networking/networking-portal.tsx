"use client";

import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Download,
  ExternalLink,
  GitBranch,
  Handshake,
  Info,
  Layers3,
  Link2,
  Network,
  Plus,
  Radar,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Upload
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { buildNetworkingProjection, buildPersonalTouchpointEvent, simulateNetworkingScenario, validateNetworkingState } from "@/lib/networking/engine";
import { loadNetworkingState, parseNetworkingState, saveNetworkingState, serializeNetworkingState } from "@/lib/networking/persistence";
import { createDefaultNetworkingState, networkingScenarios } from "@/lib/networking/seed";
import type { NetworkPerson, NetworkingControls, NetworkingGoalType, NetworkingMove, NetworkingScenarioId, NetworkingState, NetworkingTab, NetworkingTouchpoint, TouchpointKind } from "@/lib/networking/types";

const tabs: Array<{ id: NetworkingTab; label: string; icon: typeof Network }> = [
  { id: "command", label: "Command center", icon: Radar },
  { id: "graph", label: "Graph explorer", icon: Network },
  { id: "simulator", label: "Strategy simulator", icon: TrendingUp },
  { id: "workflow", label: "Workflow", icon: GitBranch },
  { id: "rules", label: "Rules & playbooks", icon: ShieldCheck }
];

const graphPositions: Record<string, { x: number; y: number }> = {
  "person-maya": { x: 22, y: 22 },
  "person-arjun": { x: 73, y: 16 },
  "person-lena": { x: 85, y: 50 },
  "person-samir": { x: 70, y: 82 },
  "person-jo": { x: 29, y: 84 },
  "person-nikhil": { x: 13, y: 50 },
  "person-elise": { x: 50, y: 13 },
  "person-daniel": { x: 50, y: 88 }
};

const networkingRules = [
  { title: "Give value before you ask", body: "The first move should reduce uncertainty, save time, open context, or make the other person stronger.", signal: "trust compounds" },
  { title: "Prefer warm paths", body: "A trusted bridge transfers context and lowers the cost of attention. Cold outreach is a fallback, not the default.", signal: "access is a graph" },
  { title: "Be specific", body: "Name the reason, the useful artifact, the exact ask, and the smallest next step. Vague intent creates vague response.", signal: "specificity wins" },
  { title: "Respect attention", body: "Consent, timing, and an easy no are part of the relationship contract. Pressure creates negative network memory.", signal: "permission matters" },
  { title: "Build reciprocity", body: "A strong network is not a list of people to extract from. It is a repeated exchange of useful context and outcomes.", signal: "exchange, not extraction" },
  { title: "Follow through", body: "Reliability is visible in the small loop: capture the outcome, deliver the promised value, and schedule the next move.", signal: "memory becomes trust" },
  { title: "Maintain before urgency", body: "Relationships decay quietly. A lightweight, useful touchpoint before the urgent ask preserves optionality.", signal: "freshness is leverage" },
  { title: "Diversify the graph", body: "A network concentrated in one cluster is fragile. Weak ties often carry novel information and new opportunity paths.", signal: "resilience needs breadth" },
  { title: "Learn from mismatches", body: "A no-response or decline is not just failure; it is evidence about timing, fit, clarity, or value.", signal: "feedback improves strategy" }
];

const goalTypes: Array<{ value: NetworkingGoalType; label: string }> = [
  { value: "customer", label: "Customer" },
  { value: "investor", label: "Investor" },
  { value: "talent", label: "Talent" },
  { value: "expert", label: "Expert" },
  { value: "community", label: "Community" },
  { value: "peer", label: "Peer" }
];

export function NetworkingPortal() {
  const [state, setState] = useState<NetworkingState>(() => createDefaultNetworkingState());
  const [tab, setTab] = useState<NetworkingTab>("command");
  const [hydrated, setHydrated] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState("person-maya");
  const [scenarioId, setScenarioId] = useState<NetworkingScenarioId>("warm-introduction");
  const [simulationRun, setSimulationRun] = useState(0);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalType, setGoalType] = useState<NetworkingGoalType>("customer");
  const [draftValue, setDraftValue] = useState("");
  const [draftAsk, setDraftAsk] = useState("");
  const [touchpointKind, setTouchpointKind] = useState<TouchpointKind>("value-share");
  const [status, setStatus] = useState("Local state ready");
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setState(loadNetworkingState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveNetworkingState(state);
  }, [hydrated, state]);

  const projection = useMemo(() => buildNetworkingProjection(state), [state]);
  const simulation = useMemo(() => simulateNetworkingScenario(state, scenarioId, state.controls), [scenarioId, state]);
  const selectedPerson = state.people.find((person) => person.id === selectedPersonId) ?? state.people[0];
  const selectedPersonKind = selectedPerson?.kind;
  const selectedPersonExists = Boolean(selectedPerson);
  const selectedScenario = networkingScenarios.find((scenario) => scenario.id === scenarioId) ?? networkingScenarios[0];
  const selectedMove = projection.topMoves.find((move) => move.personId === selectedPerson?.id) ?? projection.topMoves[0];
  const issues = useMemo(() => validateNetworkingState(state), [state]);

  useEffect(() => {
    if (!selectedPersonExists || !selectedPersonKind) return;
    setDraftValue(selectedPersonKind === "customer" ? "A concise synthesis of the workflow problem I am investigating." : selectedPersonKind === "expert" ? "A small artifact with one precise question for your critique." : "A useful introduction, insight, or resource matched to your current focus.");
    setDraftAsk(selectedPersonKind === "customer" ? "Would you be open to a 20-minute conversation about where this is most expensive?" : "Would you be open to a short conversation if this context is relevant to you?");
  }, [selectedPersonExists, selectedPersonKind]);

  function updateControls(updates: Partial<NetworkingControls>) {
    setState((current) => ({ ...current, controls: { ...current.controls, ...updates } }));
  }

  function createGoal() {
    const title = goalTitle.trim();
    if (!title) return;
    const id = `goal-${Date.now()}`;
    setState((current) => ({
      ...current,
      selectedGoalId: id,
      goals: [{ id, title, type: goalType, desiredOutcome: "Define the smallest useful outcome before the first conversation.", priority: 74, horizonDays: 30, createdAt: new Date().toISOString() }, ...current.goals]
    }));
    setGoalTitle("");
    setStatus("Goal added to the local relationship strategy.");
  }

  function selectPerson(person: NetworkPerson) {
    setSelectedPersonId(person.id);
    setTab("graph");
  }

  function draftMove(move: NetworkingMove) {
    setSelectedPersonId(move.personId);
    setTab("workflow");
    setStatus(`Draft brief prepared for ${state.people.find((person) => person.id === move.personId)?.name ?? "selected person"}.`);
  }

  async function logTouchpoint() {
    if (!selectedPerson) return;
    const touchpoint: NetworkingTouchpoint = {
      id: `touch-${Date.now()}`,
      personId: selectedPerson.id,
      kind: touchpointKind,
      valueOffered: draftValue.trim() || "Value-first context was prepared.",
      asking: draftAsk.trim() || "No ask recorded.",
      outcome: "planned",
      loggedAt: new Date().toISOString(),
      nextAction: "Review the outcome and schedule the next useful step."
    };
    setState((current) => ({ ...current, touchpoints: [touchpoint, ...current.touchpoints] }));
    setStatus("Touchpoint logged locally. Syncing the approved event to Personal OS…");
    try {
      const response = await fetch("/api/personal/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPersonalTouchpointEvent(selectedPerson, touchpoint))
      });
      setStatus(response.ok ? "Touchpoint logged and shared with Personal OS." : "Touchpoint saved locally; Personal OS bridge was unavailable.");
    } catch {
      setStatus("Touchpoint saved locally; Personal OS bridge was unavailable.");
    }
  }

  function exportState() {
    const url = URL.createObjectURL(new Blob([serializeNetworkingState(state)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "agios-networking-state.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus("Networking state exported as JSON.");
  }

  function importState(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        setState(parseNetworkingState(String(reader.result)));
        setStatus("Networking state imported locally.");
      } catch {
        setStatus("Could not import that Networking JSON file.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_12%_12%,rgba(72,229,255,0.22),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(182,255,97,0.14),transparent_24%),radial-gradient(circle_at_62%_90%,rgba(255,95,143,0.12),transparent_28%),linear-gradient(135deg,rgba(8,18,31,0.98),rgba(2,6,23,0.99))] p-6 shadow-glow md:p-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-signal to-transparent" />
        <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge><Network className="size-3.5" /> Networking / relationship OS</Badge>
              <Badge tone="lime"><ShieldCheck className="size-3.5" /> Local + draft-only</Badge>
              <Badge tone="rose"><Info className="size-3.5" /> Simulated assumptions</Badge>
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">Relationships are infrastructure for opportunity.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">Networking is not collecting contacts. It is the disciplined system of trust, value exchange, timing, and follow-through that lets people discover, create, and compound opportunity together.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="button" onClick={() => setTab("simulator")}><TrendingUp className="size-4" /> Run strategy simulator</Button>
              <Link href="/founder-network" className="inline-flex h-10 items-center gap-2 rounded-md border border-fuchsia-300/25 bg-fuchsia-300/10 px-4 text-sm font-medium text-fuchsia-100 hover:bg-fuchsia-300/15"><ExternalLink className="size-4" /> Founder Net context</Link>
            </div>
          </div>
          <div className="grid w-full max-w-sm gap-3 sm:grid-cols-2 xl:w-80 xl:grid-cols-1">
            <div className="rounded-lg border border-cyan-signal/20 bg-black/20 p-4"><div className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-signal">Current doctrine</span><Handshake className="size-4 text-cyan-signal" /></div><p className="mt-3 text-sm leading-6 text-slate-200">Give value before you ask. Make the next step easy to understand.</p></div>
            <div className="rounded-lg border border-lime-signal/20 bg-lime-signal/[0.05] p-4"><div className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-lime-signal">Portal status</span><Activity className="size-4 text-lime-signal" /></div><p className="mt-3 text-sm leading-6 text-slate-200">{status}</p></div>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Network health" value={`${projection.networkHealth}%`} detail="trust + freshness + breadth" tone="cyan" />
        <MetricCard label="Freshness" value={`${projection.freshness}%`} detail={`${projection.graphSummary.dormant} dormant relationships`} tone="lime" />
        <MetricCard label="Trust" value={`${projection.trust}%`} detail="average relationship signal" tone="fuchsia" />
        <MetricCard label="Reciprocity" value={`${projection.reciprocity}%`} detail="exchange quality" tone="amber" />
        <MetricCard label="Graph" value={`${projection.graphSummary.people} people`} detail={`${projection.graphSummary.edges} access paths`} tone="slate" />
      </div>

      <nav className="sticky top-2 z-10 flex gap-2 overflow-x-auto rounded-lg border border-white/10 bg-slate-950/90 p-2 shadow-lg backdrop-blur-xl" aria-label="Networking portal sections">
        {tabs.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" onClick={() => setTab(item.id)} className={`inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition ${tab === item.id ? "bg-cyan-signal/15 text-cyan-signal" : "text-slate-400 hover:bg-white/[0.05] hover:text-white"}`}><Icon className="size-4" />{item.label}</button>; })}
        <div className="ml-auto hidden items-center gap-2 md:flex"><span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">{hydrated ? "saved locally" : "initializing"}</span><button type="button" onClick={exportState} className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1.5 text-xs text-slate-400 hover:text-white" title="Export Networking state"><Download className="size-3.5" /> Export</button><button type="button" onClick={() => importRef.current?.click()} className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1.5 text-xs text-slate-400 hover:text-white" title="Import Networking state"><Upload className="size-3.5" /> Import</button><input ref={importRef} className="hidden" type="file" accept="application/json,.json" onChange={(event) => { const file = event.target.files?.[0]; if (file) importState(file); event.target.value = ""; }} /></div>
      </nav>

      {issues.length > 0 && <div className="rounded-lg border border-amber-300/25 bg-amber-300/[0.06] p-4 text-sm text-amber-100">{issues.join(" ")}</div>}

      {tab === "command" && <CommandCenter projection={projection} state={state} goalTitle={goalTitle} goalType={goalType} onGoalTitleChange={setGoalTitle} onGoalTypeChange={setGoalType} onCreateGoal={createGoal} onSelectGoal={(selectedGoalId) => setState((current) => ({ ...current, selectedGoalId }))} onDraftMove={draftMove} onSelectPerson={selectPerson} />}
      {tab === "graph" && <GraphExplorer state={state} selectedPerson={selectedPerson} selectedMove={selectedMove} onSelectPerson={setSelectedPersonId} onOpenWorkflow={() => setTab("workflow")} />}
      {tab === "simulator" && <Simulator scenarioId={scenarioId} scenario={selectedScenario} result={simulation} controls={state.controls} runCount={simulationRun} onScenarioChange={(next) => { setScenarioId(next); const scenario = networkingScenarios.find((item) => item.id === next); if (scenario) updateControls(scenario.defaultControls); }} onControlChange={updateControls} onRun={() => { setSimulationRun((count) => count + 1); setStatus("Local strategy simulation recalculated."); }} />}
      {tab === "workflow" && <Workflow state={state} selectedPerson={selectedPerson} selectedMove={selectedMove} value={draftValue} ask={draftAsk} kind={touchpointKind} onValueChange={setDraftValue} onAskChange={setDraftAsk} onKindChange={setTouchpointKind} onLog={logTouchpoint} onSelectPerson={setSelectedPersonId} />}
      {tab === "rules" && <Rules />}
    </div>
  );
}

function CommandCenter({ projection, state, goalTitle, goalType, onGoalTitleChange, onGoalTypeChange, onCreateGoal, onSelectGoal, onDraftMove, onSelectPerson }: { projection: ReturnType<typeof buildNetworkingProjection>; state: NetworkingState; goalTitle: string; goalType: NetworkingGoalType; onGoalTitleChange: (value: string) => void; onGoalTypeChange: (value: NetworkingGoalType) => void; onCreateGoal: () => void; onSelectGoal: (id: string) => void; onDraftMove: (move: NetworkingMove) => void; onSelectPerson: (person: NetworkPerson) => void }) {
  return <div className="space-y-5">
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <Kicker>Why networking matters</Kicker>
        <h2 className="mt-2 text-2xl font-semibold text-white">Your network is a living system, not a contact list.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Every relationship carries information, trust, timing, and access. The point of this portal is to make those hidden variables visible so you can choose better next moves instead of performing more random outreach.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <InsightCard icon={<Link2 className="size-4" />} title="Access" body="Who can open a trustworthy path to the outcome?" />
          <InsightCard icon={<Handshake className="size-4" />} title="Exchange" body="What useful value can move before the ask?" />
          <InsightCard icon={<Timer className="size-4" />} title="Timing" body="When does the next touchpoint create momentum?" />
        </div>
      </Card>
      <Card>
        <div className="flex items-start justify-between gap-3"><div><Kicker>Network health</Kicker><h2 className="mt-2 text-2xl font-semibold text-white">Compounding capacity</h2></div><span className="rounded-md border border-lime-signal/25 bg-lime-signal/10 px-2 py-1 font-mono text-[10px] uppercase text-lime-signal">{projection.networkHealth}/100</span></div>
        <div className="mt-5 space-y-4"><HealthBar label="Trust" value={projection.trust} /><HealthBar label="Freshness" value={projection.freshness} /><HealthBar label="Reciprocity" value={projection.reciprocity} /><HealthBar label="Diversity" value={projection.diversity} /></div>
        <p className="mt-5 text-xs leading-5 text-slate-500">Projection is local and assumption-based. It is a strategy instrument, not a factual claim about a person.</p>
      </Card>
    </div>

    <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <Card>
        <div className="flex items-start justify-between gap-3"><div><Kicker>Active objective</Kicker><h2 className="mt-2 text-2xl font-semibold text-white">Give the graph a reason</h2></div><Target className="size-5 text-cyan-signal" /></div>
        <select aria-label="Active Networking goal" value={state.selectedGoalId} onChange={(event) => onSelectGoal(event.target.value)} className="mt-5 h-11 w-full rounded-md border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-cyan-signal/50">{state.goals.map((goal) => <option key={goal.id} value={goal.id}>{goal.title}</option>)}</select>
        <div className="mt-4 rounded-md border border-cyan-signal/20 bg-cyan-signal/[0.05] p-4"><div className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] uppercase tracking-[0.15em] text-cyan-signal">{projection.activeGoal.type} goal · {projection.activeGoal.horizonDays} days</span><span className="font-mono text-xs text-lime-signal">priority {projection.activeGoal.priority}</span></div><p className="mt-2 text-sm leading-6 text-slate-200">{projection.activeGoal.desiredOutcome}</p></div>
        <div className="mt-4 border-t border-white/10 pt-4"><div className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">Add a goal</div><div className="grid gap-2 sm:grid-cols-[1fr_auto]"><input value={goalTitle} onChange={(event) => onGoalTitleChange(event.target.value)} placeholder="e.g. Find a research collaborator" className="h-10 rounded-md border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-cyan-signal/50" /><select aria-label="New goal type" value={goalType} onChange={(event) => onGoalTypeChange(event.target.value as NetworkingGoalType)} className="h-10 rounded-md border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-cyan-signal/50">{goalTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div><button type="button" onClick={onCreateGoal} className="mt-2 inline-flex items-center gap-2 rounded-md border border-cyan-signal/25 bg-cyan-signal/10 px-3 py-2 text-sm text-cyan-signal hover:bg-cyan-signal/15"><Plus className="size-4" /> Add goal locally</button></div>
      </Card>
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><Kicker>Highest-leverage next moves</Kicker><h2 className="mt-2 text-2xl font-semibold text-white">Do the next useful thing</h2></div><span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">ranked by goal fit + trust + timing</span></div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">{projection.topMoves.map((move) => { const person = state.people.find((item) => item.id === move.personId); return <article key={move.id} className="rounded-md border border-white/10 bg-black/20 p-4 transition hover:border-cyan-signal/30 hover:bg-cyan-signal/[0.04]"><div className="flex items-start justify-between gap-3"><button type="button" onClick={() => person && onSelectPerson(person)} className="text-left"><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-fuchsia-200">{person?.kind} · {move.path}</div><h3 className="mt-2 text-base font-semibold text-white">{move.title}</h3></button><span className="font-mono text-lg text-cyan-signal">{move.score}</span></div><p className="mt-2 text-xs leading-5 text-slate-400">{move.reason}</p><button type="button" onClick={() => onDraftMove(move)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-signal hover:text-white">Draft next move <ArrowRight className="size-4" /></button></article>; })}</div>
      </Card>
    </div>

    <Card><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><Kicker>Founder Net bridge</Kicker><h2 className="mt-2 text-xl font-semibold text-white">Context without losing the relationship layer</h2></div><Link href="/founder-network" className="inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-100 hover:text-white">Open Founder Net <ExternalLink className="size-4" /></Link></div><p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">Founder Net surfaces ecosystem signals and public discovery. Networking turns a selected relationship into a goal, a value-first move, a rehearsal, and a memory loop. The bridge is read-only in this portal.</p><div className="mt-4 grid gap-2 sm:grid-cols-3"><BridgeStat label="Founder Net context" value="read-only" /><BridgeStat label="Personal OS" value="touchpoints" /><BridgeStat label="External sends" value="disabled" /></div></Card>
  </div>;
}

function GraphExplorer({ state, selectedPerson, selectedMove, onSelectPerson, onOpenWorkflow }: { state: NetworkingState; selectedPerson?: NetworkPerson; selectedMove?: NetworkingMove; onSelectPerson: (id: string) => void; onOpenWorkflow: () => void }) {
  return <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
    <Card><div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><Kicker>Relationship graph</Kicker><h2 className="mt-2 text-2xl font-semibold text-white">See paths, not just names</h2></div><span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">click a node to inspect</span></div><div className="relative mt-5 min-h-[420px] overflow-hidden rounded-lg border border-cyan-signal/20 bg-[radial-gradient(circle_at_50%_50%,rgba(72,229,255,0.16),transparent_25%),linear-gradient(rgba(72,229,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(72,229,255,0.045)_1px,transparent_1px),rgba(0,0,0,0.24)] bg-[length:auto,32px_32px,32px_32px,auto]"><svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{state.people.map((person) => { const point = graphPositions[person.id] ?? { x: 50, y: 50 }; return <line key={person.id} x1="50" y1="50" x2={point.x} y2={point.y} stroke="rgba(72,229,255,0.22)" strokeWidth="0.35" />; })}{state.edges.map((edge) => { const start = graphPositions[edge.sourceId] ?? { x: 50, y: 50 }; const end = graphPositions[edge.targetId] ?? { x: 50, y: 50 }; return <line key={edge.id} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="rgba(182,255,97,0.25)" strokeWidth="0.25" strokeDasharray="1.5 1" />; })}</svg><div className="absolute left-1/2 top-1/2 z-10 flex size-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-cyan-signal/45 bg-slate-950/90 text-center shadow-[0_0_45px_rgba(72,229,255,0.2)]"><Network className="size-5 text-cyan-signal" /><span className="mt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white">Your node</span><span className="mt-1 text-[10px] text-slate-500">{state.edges.length} paths</span></div>{state.people.map((person) => { const point = graphPositions[person.id] ?? { x: 50, y: 50 }; const active = person.id === selectedPerson?.id; return <button key={person.id} type="button" onClick={() => onSelectPerson(person.id)} className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-2 text-left shadow-lg transition hover:scale-105 ${active ? "border-fuchsia-200 bg-fuchsia-200/20 text-white shadow-[0_0_30px_rgba(244,114,182,0.25)]" : "border-cyan-signal/35 bg-cyan-signal/10 text-cyan-50"}`} style={{ left: `${point.x}%`, top: `${point.y}%` }}><span className="block max-w-24 truncate text-xs font-semibold">{person.name}</span><span className="mt-0.5 block font-mono text-[9px] uppercase text-slate-400">{person.kind}</span></button>; })}</div><div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400"><span className="inline-flex items-center gap-2"><i className="size-2 rounded-full bg-cyan-signal" /> direct path</span><span className="inline-flex items-center gap-2"><i className="size-2 rounded-full bg-lime-signal" /> shared context</span><span className="inline-flex items-center gap-2"><i className="size-2 rounded-full bg-fuchsia-300" /> selected relationship</span></div></Card>
    <div className="space-y-5"><Card>{selectedPerson ? <><div className="flex items-start justify-between gap-3"><div><Kicker>Selected relationship</Kicker><h2 className="mt-2 text-2xl font-semibold text-white">{selectedPerson.name}</h2><p className="mt-1 text-sm text-slate-400">{selectedPerson.role} · {selectedPerson.organization}</p></div><span className="rounded-md border border-fuchsia-300/25 bg-fuchsia-300/10 px-2 py-1 font-mono text-[10px] uppercase text-fuchsia-100">{selectedPerson.source}</span></div><p className="mt-4 text-sm leading-6 text-slate-300">{selectedPerson.notes}</p><div className="mt-5 grid grid-cols-2 gap-2"><MiniMetric label="Trust" value={selectedPerson.trust} /><MiniMetric label="Relevance" value={selectedPerson.relevance} /><MiniMetric label="Reciprocity" value={selectedPerson.reciprocity} /><MiniMetric label="Strength" value={selectedPerson.strength} /></div><div className="mt-4 rounded-md border border-white/10 bg-black/20 p-3"><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Recommended path</div><div className="mt-1 flex items-center gap-2 text-sm text-cyan-100"><Link2 className="size-4" /> {selectedPerson.preferredPath.replaceAll("-", " ")}</div><p className="mt-2 text-xs leading-5 text-slate-500">Last touchpoint: {selectedPerson.lastTouchDays} days ago · response signal {selectedPerson.responseRate}%</p></div>{selectedMove && <button type="button" onClick={onOpenWorkflow} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan-signal px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-200">Open relationship workflow <ArrowRight className="size-4" /></button>}</> : <EmptyState text="Select a person from the graph." />}</Card><Card><Kicker>Path inventory</Kicker><h2 className="mt-2 text-xl font-semibold text-white">Access paths</h2><div className="mt-4 space-y-2">{state.edges.map((edge) => <div key={edge.id} className="rounded-md border border-white/10 bg-black/20 p-3"><div className="flex items-center justify-between gap-3"><span className="text-sm text-white">{state.people.find((person) => person.id === edge.sourceId)?.name} <span className="text-slate-500">→</span> {state.people.find((person) => person.id === edge.targetId)?.name}</span><span className="font-mono text-xs text-lime-signal">{edge.strength}</span></div><div className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">{edge.kind.replaceAll("-", " ")} · {edge.pathLength} hops</div></div>)}</div></Card></div>
  </div>;
}

function Simulator({ scenarioId, scenario, result, controls, runCount, onScenarioChange, onControlChange, onRun }: { scenarioId: NetworkingScenarioId; scenario: typeof networkingScenarios[number]; result: ReturnType<typeof simulateNetworkingScenario>; controls: NetworkingControls; runCount: number; onScenarioChange: (id: NetworkingScenarioId) => void; onControlChange: (updates: Partial<NetworkingControls>) => void; onRun: () => void }) {
  const controlFields: Array<{ key: keyof NetworkingControls; label: string; description: string }> = [
    { key: "goalClarity", label: "Goal clarity", description: "How precise is the desired outcome?" },
    { key: "relationshipStrength", label: "Relationship strength", description: "How much shared context already exists?" },
    { key: "trust", label: "Trust", description: "How safe is it to exchange honest context?" },
    { key: "reciprocity", label: "Reciprocity", description: "How balanced is the value exchange?" },
    { key: "timing", label: "Timing", description: "Is the next touchpoint timely?" },
    { key: "followUpConsistency", label: "Follow-through", description: "Will the loop continue after the first move?" },
    { key: "warmPathAvailability", label: "Warm path", description: "Can context travel through a trusted bridge?" },
    { key: "concentrationRisk", label: "Concentration risk", description: "How dependent is the network on one cluster?" },
    { key: "valueBeforeAsk", label: "Value before ask", description: "How much useful context moves first?" }
  ];
  return <div className="space-y-5"><div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]"><Card><div className="flex items-start justify-between gap-3"><div><Kicker>Scenario lab</Kicker><h2 className="mt-2 text-2xl font-semibold text-white">Test the strategy before the outreach</h2></div><Sparkles className="size-5 text-lime-signal" /></div><select aria-label="Networking simulation scenario" value={scenarioId} onChange={(event) => onScenarioChange(event.target.value as NetworkingScenarioId)} className="mt-5 h-11 w-full rounded-md border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-cyan-signal/50">{networkingScenarios.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select><div className="mt-4 rounded-md border border-lime-signal/20 bg-lime-signal/[0.05] p-4"><div className="font-mono text-[10px] uppercase tracking-[0.15em] text-lime-signal">{scenario.focus}</div><p className="mt-2 text-sm leading-6 text-slate-200">{scenario.description}</p></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><MetricCard label="Response probability" value={`${result.responseProbability}%`} detail="local projection" tone="cyan" /><MetricCard label="Opportunity access" value={`${result.opportunityAccess}%`} detail="path + fit + timing" tone="lime" /><MetricCard label="Trust movement" value={`${result.trustMovement > 0 ? "+" : ""}${result.trustMovement}`} detail="scenario delta" tone="fuchsia" /><MetricCard label="Resilience" value={`${result.networkResilience}%`} detail="breadth + reciprocity" tone="amber" /></div><div className="mt-5 flex items-center justify-between gap-3"><span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">run {runCount + 1} · {result.label}</span><Button type="button" onClick={onRun}><RefreshCw className="size-4" /> Run local simulation</Button></div></Card><Card><div className="flex items-start justify-between gap-3"><div><Kicker>Control surface</Kicker><h2 className="mt-2 text-2xl font-semibold text-white">Change the system, observe the consequence</h2></div><Layers3 className="size-5 text-cyan-signal" /></div><div className="mt-5 grid gap-x-5 gap-y-4 md:grid-cols-2">{controlFields.map((field) => <RangeControl key={field.key} label={field.label} description={field.description} value={controls[field.key]} onChange={(value) => onControlChange({ [field.key]: value })} />)}</div></Card></div><div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]"><Card><Kicker>Explainable result</Kicker><h2 className="mt-2 text-2xl font-semibold text-white">Why the result moved</h2><div className="mt-5 space-y-4">{result.steps.map((step) => <div key={step.label}><div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium text-white">{step.label}</span><span className="font-mono text-cyan-signal">{step.value}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-signal to-lime-signal" style={{ width: `${step.value}%` }} /></div><p className="mt-2 text-xs leading-5 text-slate-400">{step.explanation}</p></div>)}</div></Card><Card><div className="flex items-center gap-2"><Info className="size-4 text-amber-200" /><Kicker className="text-amber-200">Decision notes</Kicker></div><h2 className="mt-2 text-2xl font-semibold text-white">Bottlenecks and next moves</h2><div className="mt-4 space-y-2">{result.bottlenecks.length ? result.bottlenecks.map((item) => <div key={item} className="rounded-md border border-amber-300/20 bg-amber-300/[0.05] p-3 text-sm leading-6 text-amber-100">{item}</div>) : <div className="rounded-md border border-lime-signal/20 bg-lime-signal/[0.05] p-3 text-sm leading-6 text-lime-100">No major bottleneck detected in this local scenario.</div>}{result.nextActions.map((item) => <div key={item} className="flex gap-2 rounded-md border border-white/10 bg-black/20 p-3 text-sm leading-6 text-slate-300"><CheckCircle2 className="mt-1 size-4 shrink-0 text-lime-signal" />{item}</div>)}</div></Card></div><div className="rounded-lg border border-rose-signal/20 bg-rose-signal/[0.04] p-4 text-sm leading-6 text-rose-100"><strong>Guardrail:</strong> this simulator rehearses relationship strategy using local assumptions. It never sends messages, creates external introductions, or claims to predict a real person.</div></div>;
}

function Workflow({ state, selectedPerson, selectedMove, value, ask, kind, onValueChange, onAskChange, onKindChange, onLog, onSelectPerson }: { state: NetworkingState; selectedPerson?: NetworkPerson; selectedMove?: NetworkingMove; value: string; ask: string; kind: TouchpointKind; onValueChange: (value: string) => void; onAskChange: (value: string) => void; onKindChange: (value: TouchpointKind) => void; onLog: () => void; onSelectPerson: (id: string) => void }) {
  const draft = selectedPerson ? `Hi ${selectedPerson.name.split(" ")[0]},\n\nI thought this might be useful for your work at ${selectedPerson.organization}: ${value}\n\n${ask}\n\nNo pressure if the timing is not right — I wanted to make the context useful either way.` : "Select a person to prepare a brief.";
  return <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]"><Card><div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><Kicker>Relationship workflow</Kicker><h2 className="mt-2 text-2xl font-semibold text-white">Rehearse the next useful move</h2></div><span className="rounded-md border border-cyan-signal/25 bg-cyan-signal/10 px-2 py-1 font-mono text-[10px] uppercase text-cyan-signal">draft only</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-xs text-slate-400">Person<select aria-label="Workflow person" value={selectedPerson?.id ?? ""} onChange={(event) => onSelectPerson(event.target.value)} className="mt-2 h-10 w-full rounded-md border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-cyan-signal/50">{state.people.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.kind}</option>)}</select></label><label className="text-xs text-slate-400">Touchpoint kind<select aria-label="Touchpoint kind" value={kind} onChange={(event) => onKindChange(event.target.value as TouchpointKind)} className="mt-2 h-10 w-full rounded-md border border-white/10 bg-black/25 px-3 text-sm text-white outline-none focus:border-cyan-signal/50"><option value="value-share">Value share</option><option value="meeting">Meeting</option><option value="introduction">Introduction</option><option value="follow-up">Follow-up</option><option value="message">Message</option><option value="note">Note</option></select></label></div><div className="mt-4 grid gap-3"><label className="text-xs text-slate-400">Value offered<textarea value={value} onChange={(event) => onValueChange(event.target.value)} rows={3} className="mt-2 w-full rounded-md border border-white/10 bg-black/25 p-3 text-sm leading-6 text-white outline-none focus:border-cyan-signal/50" /></label><label className="text-xs text-slate-400">Specific ask<textarea value={ask} onChange={(event) => onAskChange(event.target.value)} rows={3} className="mt-2 w-full rounded-md border border-white/10 bg-black/25 p-3 text-sm leading-6 text-white outline-none focus:border-cyan-signal/50" /></label></div>{selectedMove && <div className="mt-4 rounded-md border border-lime-signal/20 bg-lime-signal/[0.05] p-4"><div className="font-mono text-[10px] uppercase tracking-[0.15em] text-lime-signal">Why this person now · score {selectedMove.score}</div><p className="mt-2 text-sm leading-6 text-slate-300">{selectedMove.reason}</p></div>}<div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={onLog} className="inline-flex items-center gap-2 rounded-md bg-cyan-signal px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-200"><CheckCircle2 className="size-4" /> Log approved touchpoint</button><span className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs text-slate-400"><ShieldCheck className="size-3.5 text-lime-signal" /> saved locally + Personal OS event</span></div></Card><div className="space-y-5"><Card><Kicker>Conversation brief</Kicker><h2 className="mt-2 text-2xl font-semibold text-white">A useful draft, not an automated send</h2><pre className="mt-5 whitespace-pre-wrap rounded-md border border-cyan-signal/20 bg-black/25 p-4 text-sm leading-7 text-cyan-50">{draft}</pre><p className="mt-3 text-xs leading-5 text-slate-500">Review, edit, and use this as rehearsal material. AGIOS does not transmit it.</p></Card><Card><Kicker>Workflow memory</Kicker><h2 className="mt-2 text-xl font-semibold text-white">Recent touchpoints</h2><div className="mt-4 space-y-2">{state.touchpoints.slice(0, 5).map((touchpoint) => <TouchpointRow key={touchpoint.id} touchpoint={touchpoint} person={state.people.find((person) => person.id === touchpoint.personId)} />)}</div></Card></div></div>;
}

function Rules() {
  return <div className="space-y-5"><Card><div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><Kicker>Networking operating system</Kicker><h2 className="mt-2 text-3xl font-semibold text-white">The deep game is compounding trust.</h2></div><span className="font-mono text-[10px] uppercase tracking-[0.15em] text-cyan-signal">rules are executable strategy</span></div><p className="mt-4 max-w-4xl text-base leading-7 text-slate-300">The portal treats networking as a repeated system: choose a meaningful goal, identify the right node, select the safest path, move value first, make a specific ask, record what happened, and let the next decision learn from reality.</p></Card><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{networkingRules.map((rule, index) => <article key={rule.title} className="rounded-lg border border-white/10 bg-panel/75 p-5 shadow-glow"><div className="flex items-start justify-between gap-3"><div className="flex size-9 items-center justify-center rounded-md border border-cyan-signal/20 bg-cyan-signal/10 font-mono text-xs text-cyan-signal">{String(index + 1).padStart(2, "0")}</div><span className="font-mono text-[9px] uppercase tracking-[0.13em] text-slate-500">{rule.signal}</span></div><h3 className="mt-4 text-lg font-semibold text-white">{rule.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{rule.body}</p></article>)}</div><Card><Kicker>Playbook loop</Kicker><h2 className="mt-2 text-xl font-semibold text-white">Goal → path → value → ask → outcome → memory</h2><div className="mt-5 grid gap-2 md:grid-cols-6">{["Goal", "Path", "Value", "Ask", "Outcome", "Memory"].map((step, index) => <div key={step} className="flex items-center gap-2 rounded-md border border-white/10 bg-black/20 p-3"><span className="font-mono text-xs text-cyan-signal">0{index + 1}</span><span className="text-sm font-semibold text-white">{step}</span>{index < 5 && <ArrowRight className="ml-auto hidden size-3.5 text-slate-600 md:block" />}</div>)}</div></Card></div>;
}

function Card({ children }: { children: ReactNode }) { return <section className="min-w-0 rounded-lg border border-white/10 bg-panel/78 p-5 shadow-glow backdrop-blur-xl">{children}</section>; }
function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) { return <div className={`font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-signal ${className}`}>{children}</div>; }
function Badge({ children, tone = "cyan" }: { children: ReactNode; tone?: "cyan" | "lime" | "rose" }) { const styles = tone === "lime" ? "border-lime-signal/25 bg-lime-signal/10 text-lime-signal" : tone === "rose" ? "border-rose-signal/25 bg-rose-signal/10 text-rose-signal" : "border-cyan-signal/25 bg-cyan-signal/10 text-cyan-signal"; return <span className={`inline-flex items-center gap-2 rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${styles}`}>{children}</span>; }
function MetricCard({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: "cyan" | "lime" | "fuchsia" | "amber" | "slate" }) { const styles = { cyan: "text-cyan-signal", lime: "text-lime-signal", fuchsia: "text-fuchsia-200", amber: "text-amber-200", slate: "text-slate-100" }; return <div className="rounded-lg border border-white/10 bg-panel/75 p-4"><div className="text-xs text-slate-400">{label}</div><div className={`mt-2 text-2xl font-semibold ${styles[tone]}`}>{value}</div><div className="mt-1 text-[11px] text-slate-500">{detail}</div></div>; }
function InsightCard({ icon, title, body }: { icon: ReactNode; title: string; body: string }) { return <div className="rounded-md border border-white/10 bg-black/20 p-3"><span className="text-cyan-signal">{icon}</span><h3 className="mt-3 text-sm font-semibold text-white">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{body}</p></div>; }
function HealthBar({ label, value }: { label: string; value: number }) { return <div><div className="mb-1 flex items-center justify-between gap-3 text-xs text-slate-300"><span>{label}</span><span className="font-mono text-slate-100">{value}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-signal to-lime-signal" style={{ width: `${value}%` }} /></div></div>; }
function BridgeStat({ label, value }: { label: string; value: string }) { return <div className="rounded-md border border-white/10 bg-black/20 p-3"><div className="font-mono text-[10px] uppercase tracking-[0.13em] text-slate-500">{label}</div><div className="mt-1 text-sm font-semibold text-white">{value}</div></div>; }
function MiniMetric({ label, value }: { label: string; value: number }) { return <div className="rounded-md border border-white/10 bg-black/20 p-3"><div className="text-xs text-slate-500">{label}</div><div className="mt-1 font-mono text-lg text-white">{value}</div></div>; }
function RangeControl({ label, description, value, onChange }: { label: string; description: string; value: number; onChange: (value: number) => void }) { return <label className="block"><div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium text-white">{label}</span><span className="font-mono text-cyan-signal">{value}</span></div><input aria-label={label} className="mt-2 w-full accent-cyan-300" type="range" min="0" max="100" value={value} onChange={(event) => onChange(Number(event.target.value))} /><span className="mt-1 block text-[11px] leading-5 text-slate-500">{description}</span></label>; }
function TouchpointRow({ touchpoint, person }: { touchpoint: NetworkingTouchpoint; person?: NetworkPerson }) { return <div className="rounded-md border border-white/10 bg-black/20 p-3"><div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-white">{person?.name ?? "Unknown person"}</span><span className="font-mono text-[10px] uppercase text-cyan-signal">{touchpoint.kind.replaceAll("-", " ")}</span></div><p className="mt-2 text-xs leading-5 text-slate-400">{touchpoint.valueOffered}</p><div className="mt-2 text-[10px] text-slate-500">{touchpoint.outcome} · {new Date(touchpoint.loggedAt).toLocaleDateString()}</div></div>; }
function EmptyState({ text }: { text: string }) { return <div className="rounded-md border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">{text}</div>; }
