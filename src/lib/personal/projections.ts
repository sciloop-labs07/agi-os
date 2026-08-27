import type { PersonalEvent, PersonalModule, PersonalProjection } from "@/lib/personal/types";

function numberPayload(event: PersonalEvent, key: string) {
  const value = event.payload[key];
  return typeof value === "number" ? value : 0;
}

function eventWeight(event: PersonalEvent) {
  return event.metadata.importance ?? event.metadata.confidence ?? 50;
}

function summarizeModule(module: PersonalModule) {
  return module
    .split("-")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export function buildPersonalProjection(events: PersonalEvent[], date = new Date().toISOString().slice(0, 10)): PersonalProjection {
  const dailyEvents = events.filter((event) => event.localDate === date);
  const source = dailyEvents.length ? dailyEvents : events.slice(0, 30);
  const modules = new Map<PersonalModule, number>();

  for (const event of source) {
    modules.set(event.module, (modules.get(event.module) ?? 0) + 1);
  }

  const completedTasks = source.filter((event) => event.type === "task.completed").length;
  const completedHabits = source.filter((event) => event.type === "habit.completed").length;
  const workouts = source.filter((event) => event.type === "workout.logged").length;
  const meals = source.filter((event) => event.type === "meal.logged").length;
  const decisions = source.filter((event) => event.type === "decision.recorded").length;
  const experiments = source.filter((event) => event.type === "experiment.started" || event.type === "experiment.result.logged").length;
  const focusMinutes = source.reduce((total, event) => total + numberPayload(event, "focusMinutes") + numberPayload(event, "minutes"), 0);
  const latestSleep = source.find((event) => event.type === "sleep.ended");
  const sleepHours = latestSleep ? numberPayload(latestSleep, "hours") : 0;

  const signalScore =
    Math.min(28, completedTasks * 8) +
    Math.min(18, completedHabits * 6) +
    Math.min(16, workouts * 8) +
    Math.min(18, focusMinutes / 10) +
    Math.min(12, sleepHours * 1.5) +
    Math.min(8, decisions * 4);

  const dailyScore = Math.round(Math.max(12, Math.min(100, signalScore)));
  const weightedEvents = [...source].sort((a, b) => eventWeight(b) - eventWeight(a));

  return {
    dailyScore,
    date,
    eventCount: source.length,
    modulesActive: modules.size,
    focusMinutes,
    sleepHours,
    completedTasks,
    completedHabits,
    workouts,
    meals,
    decisions,
    experiments,
    currentSignals: [
      { label: "Event stream", value: `${source.length} signals`, tone: "cyan" },
      { label: "Modules active", value: `${modules.size}`, tone: "lime" },
      { label: "Focus minutes", value: `${Math.round(focusMinutes)}`, tone: "fuchsia" },
      { label: "Sleep", value: sleepHours ? `${sleepHours.toFixed(1)}h` : "No sleep event", tone: sleepHours >= 7 ? "lime" : "rose" }
    ],
    timeline: source.slice(0, 18),
    moduleActivity: Array.from(modules.entries())
      .map(([module, count]) => ({ module, count }))
      .sort((a, b) => b.count - a.count),
    predictions: buildPredictions({ dailyScore, sleepHours, focusMinutes, completedTasks, completedHabits, modulesActive: modules.size }),
    aiInsights: buildInsights(weightedEvents)
  };
}

function buildPredictions(input: {
  dailyScore: number;
  sleepHours: number;
  focusMinutes: number;
  completedTasks: number;
  completedHabits: number;
  modulesActive: number;
}) {
  return [
    {
      title: "Tomorrow execution stability",
      probability: Math.min(94, Math.round(input.dailyScore * 0.74 + input.completedHabits * 7)),
      rationale: "Derived from today's event density, habit completion, and module coverage."
    },
    {
      title: "Deep work recovery risk",
      probability: Math.max(8, Math.round(78 - input.sleepHours * 8 + (input.focusMinutes > 120 ? 12 : 0))),
      rationale: "Higher when sleep is low or focus load is already high."
    },
    {
      title: "System awareness coverage",
      probability: Math.min(96, Math.round(input.modulesActive * 13 + input.completedTasks * 4)),
      rationale: "Measures how much of the personal operating system emitted useful signals."
    }
  ];
}

function buildInsights(events: PersonalEvent[]) {
  const top = events.slice(0, 4);
  if (!top.length) {
    return [
      {
        title: "No signal yet",
        body: "Start by logging one task, sleep event, decision, or review. The portal improves as the event stream thickens.",
        sourceEventIds: []
      }
    ];
  }

  return [
    {
      title: "Most important signal",
      body: `${summarizeModule(top[0].module)} emitted ${top[0].type}. This should influence today's planning loop.`,
      sourceEventIds: [top[0].id]
    },
    {
      title: "Cybernetic loop status",
      body: "The system has enough recent events to project dashboard state from behavior instead of static forms.",
      sourceEventIds: top.map((event) => event.id)
    },
    {
      title: "Next improvement",
      body: "Add one review event at the end of the day so predictions can compare intention, execution, and outcome.",
      sourceEventIds: top.slice(0, 2).map((event) => event.id)
    }
  ];
}
