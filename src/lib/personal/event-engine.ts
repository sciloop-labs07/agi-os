import { personalEventInputSchema, type PersonalEventInput } from "@/lib/personal/schemas";
import type { PersonalEvent, PersonalPluginManifest } from "@/lib/personal/types";

type AppendPersonalEventInput = Partial<PersonalEventInput> & Pick<PersonalEventInput, "type" | "module">;

const globalStore = globalThis as unknown as {
  personalEvents?: PersonalEvent[];
  personalPlugins?: PersonalPluginManifest[];
};

const seedEvents: PersonalEvent[] = [
  makeEvent({
    type: "sleep.ended",
    module: "sleep",
    payload: { hours: 7.2, quality: 78, note: "Recovered after late work block" },
    metadata: { importance: 78, tags: ["recovery"] }
  }),
  makeEvent({
    type: "task.completed",
    module: "tasks",
    entityType: "task",
    entityId: "task-deep-work",
    payload: { title: "Design event engine", focusMinutes: 95 },
    metadata: { importance: 86, tags: ["architecture"] }
  }),
  makeEvent({
    type: "habit.completed",
    module: "habits",
    entityType: "habit",
    entityId: "morning-review",
    payload: { name: "Morning review", streak: 4 },
    metadata: { importance: 62 }
  }),
  makeEvent({
    type: "workout.logged",
    module: "workout",
    payload: { kind: "strength", minutes: 42, intensity: 72 },
    metadata: { importance: 70, tags: ["health"] }
  }),
  makeEvent({
    type: "decision.recorded",
    module: "decision-log",
    payload: {
      decision: "Use event sourcing for Personal OS",
      expectedOutcome: "Reusable AGI OS substrate",
      reviewDate: "2026-07-17"
    },
    metadata: { importance: 90, confidence: 82 }
  }),
  makeEvent({
    type: "learning.session.logged",
    module: "learning",
    payload: { topic: "Cybernetic systems", minutes: 36, output: "Notes for monitoring portal" },
    metadata: { importance: 74 }
  }),
  makeEvent({
    type: "ai.coach.recommendation.generated",
    source: "ai",
    module: "ai-coach",
    payload: {
      title: "Protect the first work block",
      recommendation: "Schedule deep work before notifications and social inputs."
    },
    metadata: { confidence: 76, importance: 80 }
  })
];

if (!globalStore.personalEvents) globalStore.personalEvents = seedEvents;
if (!globalStore.personalPlugins) {
  globalStore.personalPlugins = [
    {
      id: "core-personal-monitor",
      name: "Core Personal Monitor",
      module: "event-engine",
      version: "0.1.0",
      eventTypes: ["task.completed", "habit.completed", "sleep.ended", "decision.recorded"],
      permissions: ["events:read", "events:write", "projections:read"],
      projectionKeys: ["daily-dashboard", "timeline", "module-activity"]
    }
  ];
}

function makeEvent(input: AppendPersonalEventInput): PersonalEvent {
  const timestamp = input.timestamp ?? new Date().toISOString();
  const date = new Date(timestamp);
  const parsed = personalEventInputSchema.parse({
    userId: "local-user",
    source: "manual",
    timezone: "Asia/Calcutta",
    payload: {},
    metadata: {},
    ...input,
    timestamp
  });

  return {
    id: globalThis.crypto?.randomUUID?.() ?? `evt-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    userId: parsed.userId,
    type: parsed.type,
    source: parsed.source,
    timestamp,
    localDate: date.toISOString().slice(0, 10),
    timezone: parsed.timezone,
    module: parsed.module,
    entityType: parsed.entityType,
    entityId: parsed.entityId,
    payload: parsed.payload,
    metadata: parsed.metadata,
    correlationId: parsed.correlationId,
    causationId: parsed.causationId,
    version: 1,
    createdAt: new Date().toISOString()
  };
}

export function appendPersonalEvent(input: AppendPersonalEventInput) {
  const event = makeEvent(input);
  globalStore.personalEvents = [event, ...(globalStore.personalEvents ?? [])];
  return event;
}

export function appendPersonalEvents(inputs: AppendPersonalEventInput[]) {
  return inputs.map((input) => appendPersonalEvent(input));
}

export function listPersonalEvents(filters?: { module?: string; type?: string; limit?: number }) {
  let events = [...(globalStore.personalEvents ?? [])];
  if (filters?.module) events = events.filter((event) => event.module === filters.module);
  if (filters?.type) events = events.filter((event) => event.type === filters.type);
  return events.slice(0, filters?.limit ?? 100);
}

export function getPersonalEvent(id: string) {
  return (globalStore.personalEvents ?? []).find((event) => event.id === id);
}

export function listPersonalPlugins() {
  return [...(globalStore.personalPlugins ?? [])];
}

export function installPersonalPlugin(plugin: PersonalPluginManifest) {
  const plugins = globalStore.personalPlugins ?? [];
  globalStore.personalPlugins = [plugin, ...plugins.filter((item) => item.id !== plugin.id)];
  return plugin;
}
