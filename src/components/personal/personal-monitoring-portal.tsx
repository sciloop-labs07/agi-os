"use client";

import {
  Activity,
  Bell,
  BrainCircuit,
  CheckCircle2,
  CircleGauge,
  Clock3,
  Database,
  GitBranch,
  LineChart,
  Network,
  Plus,
  Puzzle,
  RefreshCw,
  Sparkles,
  Target,
  Timer,
  Zap
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { PersonalEvent, PersonalEventType, PersonalModule, PersonalProjection } from "@/lib/personal/types";

type DashboardResponse = { projection: PersonalProjection };
type EventsResponse = { events: PersonalEvent[] };

const quickEvents: Array<{
  label: string;
  type: PersonalEventType;
  module: PersonalModule;
  payload: Record<string, unknown>;
  icon: ReactNode;
}> = [
  {
    label: "Complete Deep Work",
    type: "task.completed",
    module: "tasks",
    payload: { title: "Deep work block", focusMinutes: 75 },
    icon: <CheckCircle2 className="size-4" />
  },
  {
    label: "Log Sleep",
    type: "sleep.ended",
    module: "sleep",
    payload: { hours: 7.4, quality: 82 },
    icon: <Clock3 className="size-4" />
  },
  {
    label: "Record Decision",
    type: "decision.recorded",
    module: "decision-log",
    payload: { decision: "Protect tomorrow's first work block", expectedOutcome: "Higher execution stability" },
    icon: <GitBranch className="size-4" />
  },
  {
    label: "Daily Review",
    type: "review.daily.completed",
    module: "review-system",
    payload: { wins: 3, friction: "Notification drift", nextAdjustment: "Batch messages after deep work" },
    icon: <Sparkles className="size-4" />
  }
];

const moduleMap: Array<{ module: PersonalModule; label: string; description: string; icon: ReactNode }> = [
  { module: "event-engine", label: "Event Engine", description: "Single source of behavioral truth", icon: <Database className="size-4" /> },
  { module: "sensors", label: "Sensors", description: "Manual, device, API and plugin inputs", icon: <Activity className="size-4" /> },
  { module: "habits", label: "Habits", description: "Consistency signals, not habit tracking", icon: <CheckCircle2 className="size-4" /> },
  { module: "sleep", label: "Sleep", description: "Recovery and prediction substrate", icon: <Clock3 className="size-4" /> },
  { module: "tasks", label: "Tasks", description: "Execution events and completion memory", icon: <Target className="size-4" /> },
  { module: "goals", label: "Goals", description: "Long-range state transitions", icon: <CircleGauge className="size-4" /> },
  { module: "learning", label: "Learning", description: "Study sessions and knowledge outputs", icon: <BrainCircuit className="size-4" /> },
  { module: "projects", label: "Projects", description: "Milestones, risk, delivery signals", icon: <Puzzle className="size-4" /> },
  { module: "networking", label: "Networking", description: "Relationships and touchpoints", icon: <Network className="size-4" /> },
  { module: "time-audit", label: "Time Audit", description: "Attention allocation and leakage", icon: <Timer className="size-4" /> },
  { module: "prediction-engine", label: "Prediction Engine", description: "Forecast outcomes from event stream", icon: <LineChart className="size-4" /> },
  { module: "notification-intelligence", label: "Notifications", description: "Timing and intervention logic", icon: <Bell className="size-4" /> }
];

export function PersonalMonitoringPortal({
  initialProjection,
  initialEvents
}: {
  initialProjection: PersonalProjection;
  initialEvents: PersonalEvent[];
}) {
  const [projection, setProjection] = useState<PersonalProjection | null>(initialProjection);
  const [events, setEvents] = useState<PersonalEvent[]>(initialEvents);
  const [selectedModule, setSelectedModule] = useState<PersonalModule | "all">("all");
  const [customTitle, setCustomTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [projectionResponse, eventsResponse] = await Promise.all([
        fetch("/api/personal/projections/dashboard/daily", { cache: "no-store" }),
        fetch("/api/personal/events?limit=80", { cache: "no-store" })
      ]);
      if (!projectionResponse.ok || !eventsResponse.ok) {
        throw new Error("Personal OS event APIs did not respond cleanly.");
      }
      const projectionData = (await projectionResponse.json()) as DashboardResponse;
      const eventsData = (await eventsResponse.json()) as EventsResponse;
      setProjection(projectionData.projection);
      setEvents(eventsData.events);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Personal OS refresh failed.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const filteredEvents = useMemo(
    () => (selectedModule === "all" ? events : events.filter((event) => event.module === selectedModule)),
    [events, selectedModule]
  );

  async function appendEvent(type: PersonalEventType, module: PersonalModule, payload: Record<string, unknown>) {
    setError(null);
    const response = await fetch("/api/personal/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        module,
        source: "manual",
        payload,
        metadata: { importance: 72, tags: ["portal"] }
      })
    });
    if (!response.ok) {
      setError("Could not append event to the Personal OS stream.");
      return;
    }
    await refresh();
  }

  async function runCoach() {
    setError(null);
    const response = await fetch("/api/personal/ai/coach", { method: "POST" });
    if (!response.ok) {
      setError("Could not generate an AI coach event.");
      return;
    }
    await refresh();
  }

  if (loading && !projection) {
    return <div className="rounded-lg border border-white/10 bg-panel/80 p-6 text-slate-300">Loading Personal OS event stream...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(circle_at_16%_16%,rgba(72,229,255,0.16),transparent_30%),radial-gradient(circle_at_82%_30%,rgba(182,255,97,0.12),transparent_24%),linear-gradient(135deg,rgba(8,18,31,0.98),rgba(2,6,23,0.98))] p-6 shadow-glow md:p-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-signal to-transparent" />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>Personal Monitoring Portal</Badge>
              <Badge tone="lime">Event-sourced AGI OS foundation</Badge>
            </div>
            <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight text-white md:text-6xl">Cybernetic Self-Monitoring System</h1>
            <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300 md:text-base">
              Not a habit tracker. Every action is captured as a timestamped event. Dashboards, analytics, predictions,
              reviews, AI memory, and coach insights are projections over the same behavioral event stream.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void refresh()}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-cyan-signal/30 bg-cyan-signal/10 px-4 py-2 text-sm font-semibold text-cyan-signal transition hover:bg-cyan-signal/15"
          >
            <RefreshCw className="size-4" />
            Refresh stream
          </button>
        </div>
      </section>

      {projection && (
        <>
          {error && (
            <div className="rounded-lg border border-rose-signal/30 bg-rose-signal/10 p-4 text-sm text-rose-100">
              {error}
            </div>
          )}
          {loading && (
            <div className="rounded-lg border border-cyan-signal/25 bg-cyan-signal/10 p-3 text-sm text-cyan-signal">
              Syncing Personal OS event projections...
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Daily Cybernetic Score" value={`${projection.dailyScore}%`} detail="Derived projection" tone="lime" />
            <MetricCard label="Events" value={String(projection.eventCount)} detail="Current projection window" tone="cyan" />
            <MetricCard label="Modules Active" value={String(projection.modulesActive)} detail="Behavioral coverage" tone="fuchsia" />
            <MetricCard label="Focus Minutes" value={String(Math.round(projection.focusMinutes))} detail="Tasks + learning + work blocks" tone="slate" />
          </div>

          <div className="grid min-w-0 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <Kicker>Event Engine</Kicker>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Append-Only Control Surface</h2>
                </div>
                <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300">single source of truth</span>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {quickEvents.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => void appendEvent(item.type, item.module, item.payload)}
                    className="flex items-center gap-3 rounded-md border border-white/10 bg-black/20 p-3 text-left text-sm text-slate-300 transition hover:border-cyan-signal/30 hover:bg-cyan-signal/10 hover:text-white"
                  >
                    <span className="flex size-9 items-center justify-center rounded-md border border-cyan-signal/25 bg-cyan-signal/10 text-cyan-signal">{item.icon}</span>
                    <span>
                      <span className="block font-semibold text-white">{item.label}</span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{item.type}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-3 md:flex-row">
                <input
                  value={customTitle}
                  onChange={(event) => setCustomTitle(event.target.value)}
                  placeholder="Create a task event from this title"
                  className="h-11 flex-1 rounded-md border border-white/10 bg-black/25 px-3 text-sm text-slate-100 outline-none focus:border-cyan-signal/50"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!customTitle.trim()) return;
                    void appendEvent("task.created", "tasks", { title: customTitle.trim(), status: "open" });
                    setCustomTitle("");
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-cyan-signal px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                >
                  <Plus className="size-4" />
                  Append event
                </button>
              </div>
            </Card>

            <Card>
              <Kicker>AI Coach</Kicker>
              <h2 className="mt-2 text-2xl font-semibold text-white">Projection-Aware Recommendations</h2>
              <div className="mt-5 space-y-3">
                {projection.aiInsights.map((insight) => (
                  <div key={insight.title} className="rounded-md border border-white/10 bg-black/20 p-3">
                    <h3 className="text-sm font-semibold text-white">{insight.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{insight.body}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => void runCoach()}
                className="mt-4 inline-flex items-center gap-2 rounded-md border border-lime-signal/30 bg-lime-signal/10 px-4 py-2 text-sm font-semibold text-lime-signal transition hover:bg-lime-signal/15"
              >
                <Zap className="size-4" />
                Generate coach event
              </button>
            </Card>
          </div>

          <div className="grid min-w-0 gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <Card>
              <Kicker>Module Registry</Kicker>
              <h2 className="mt-2 text-2xl font-semibold text-white">Reusable AGI OS Modules</h2>
              <div className="mt-5 grid gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedModule("all")}
                  className={`w-full min-w-0 rounded-md border px-3 py-2 text-left text-sm transition ${selectedModule === "all" ? "border-cyan-signal/35 bg-cyan-signal/10 text-cyan-signal" : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"}`}
                >
                  All event modules
                </button>
                {moduleMap.map((item) => (
                  <button
                  key={item.module}
                  type="button"
                  onClick={() => setSelectedModule(item.module)}
                  className={`flex w-full min-w-0 items-start gap-3 rounded-md border px-3 py-2 text-left transition ${selectedModule === item.module ? "border-cyan-signal/35 bg-cyan-signal/10 text-cyan-signal" : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"}`}
                >
                  <span className="mt-0.5 shrink-0 text-cyan-signal">{item.icon}</span>
                  <span className="min-w-0">
                      <span className="block break-words text-sm font-semibold">{item.label}</span>
                      <span className="block break-words text-xs leading-5 text-slate-500">{item.description}</span>
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <Kicker>Timeline Projection</Kicker>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Behavioral Event Stream</h2>
                </div>
                <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300">{filteredEvents.length} visible events</span>
              </div>
              <div className="mt-5 space-y-3">
                {filteredEvents.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </div>
            </Card>
          </div>

          <div className="grid min-w-0 gap-5 xl:grid-cols-3">
            <Card>
              <Kicker>Analytics</Kicker>
              <h2 className="mt-2 text-xl font-semibold text-white">Module Activity</h2>
              <div className="mt-5 space-y-3">
                {projection.moduleActivity.map((item) => (
                  <Bar key={item.module} label={item.module} value={Math.min(100, item.count * 18)} />
                ))}
              </div>
            </Card>
            <Card>
              <Kicker>Prediction Engine</Kicker>
              <h2 className="mt-2 text-xl font-semibold text-white">Outcome Forecasts</h2>
              <div className="mt-5 space-y-3">
                {projection.predictions.map((prediction) => (
                  <div key={prediction.title} className="rounded-md border border-white/10 bg-black/20 p-3">
                    <div className="flex justify-between gap-3 text-sm">
                      <span className="font-semibold text-white">{prediction.title}</span>
                      <span className="font-mono text-cyan-signal">{prediction.probability}%</span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{prediction.rationale}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <Kicker>Plugin System</Kicker>
              <h2 className="mt-2 text-xl font-semibold text-white">Extensible Portal Contract</h2>
              <div className="mt-5 rounded-md border border-white/10 bg-black/25 p-4 font-mono text-xs leading-6 text-slate-300">
                <p>plugin.event.recorded</p>
                <p>events:read / events:write</p>
                <p>projectionKeys: daily-dashboard</p>
                <p>module manifests register future AGI OS portals</p>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <section className="min-w-0 rounded-lg border border-white/10 bg-panel/78 p-5 shadow-glow backdrop-blur-xl">{children}</section>;
}

function Kicker({ children }: { children: ReactNode }) {
  return <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-signal">{children}</div>;
}

function Badge({ children, tone = "cyan" }: { children: ReactNode; tone?: "cyan" | "lime" }) {
  return (
    <span className={`rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${tone === "lime" ? "border-lime-signal/25 bg-lime-signal/10 text-lime-signal" : "border-cyan-signal/25 bg-cyan-signal/10 text-cyan-signal"}`}>
      {children}
    </span>
  );
}

function MetricCard({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: "cyan" | "lime" | "fuchsia" | "slate" }) {
  const toneClass = {
    cyan: "text-cyan-signal",
    lime: "text-lime-signal",
    fuchsia: "text-fuchsia-200",
    slate: "text-slate-100"
  }[tone];

  return (
    <Card>
      <div className="text-sm text-slate-400">{label}</div>
      <div className={`mt-3 text-4xl font-semibold ${toneClass}`}>{value}</div>
      <div className="mt-2 text-xs text-slate-500">{detail}</div>
    </Card>
  );
}

function EventRow({ event }: { event: PersonalEvent }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold text-white">{event.type}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{event.module} / {event.source}</div>
        </div>
        <div className="text-xs text-slate-500">{new Date(event.timestamp).toLocaleString()}</div>
      </div>
      <pre className="mt-3 max-w-full overflow-auto whitespace-pre-wrap break-words rounded-md bg-black/25 p-2 text-xs leading-5 text-slate-400">{JSON.stringify(event.payload, null, 2)}</pre>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between gap-3 text-xs text-slate-300">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-signal to-lime-signal" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
