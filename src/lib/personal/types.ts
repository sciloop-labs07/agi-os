export type PersonalEventSource = "manual" | "sensor" | "system" | "ai" | "plugin";

export type PersonalEventType =
  | "habit.completed"
  | "habit.missed"
  | "sleep.started"
  | "sleep.ended"
  | "workout.logged"
  | "meal.logged"
  | "health.metric.logged"
  | "routine.completed"
  | "task.created"
  | "task.completed"
  | "goal.created"
  | "goal.progress.updated"
  | "learning.session.logged"
  | "knowledge.node.created"
  | "project.progress.logged"
  | "networking.touchpoint.logged"
  | "experiment.started"
  | "experiment.result.logged"
  | "decision.recorded"
  | "time.audit.logged"
  | "review.daily.completed"
  | "ai.memory.created"
  | "ai.coach.recommendation.generated"
  | "notification.sent"
  | "plugin.event.recorded";

export type PersonalModule =
  | "identity"
  | "dashboard"
  | "event-engine"
  | "sensors"
  | "habits"
  | "sleep"
  | "workout"
  | "nutrition"
  | "health"
  | "routine"
  | "tasks"
  | "calendar"
  | "goals"
  | "learning"
  | "knowledge-graph"
  | "projects"
  | "networking"
  | "experiments"
  | "decision-log"
  | "time-audit"
  | "timeline"
  | "analytics"
  | "prediction-engine"
  | "ai-memory"
  | "ai-coach"
  | "review-system"
  | "notification-intelligence"
  | "causal-analytics"
  | "plugin-system";

export type PersonalEvent = {
  id: string;
  userId: string;
  type: PersonalEventType;
  source: PersonalEventSource;
  timestamp: string;
  localDate: string;
  timezone: string;
  module: PersonalModule;
  entityType?: string;
  entityId?: string;
  payload: Record<string, unknown>;
  metadata: {
    confidence?: number;
    importance?: number;
    tags?: string[];
    device?: string;
    location?: string;
  };
  correlationId?: string;
  causationId?: string;
  version: number;
  createdAt: string;
};

export type PersonalProjection = {
  dailyScore: number;
  date: string;
  eventCount: number;
  modulesActive: number;
  focusMinutes: number;
  sleepHours: number;
  completedTasks: number;
  completedHabits: number;
  workouts: number;
  meals: number;
  decisions: number;
  experiments: number;
  currentSignals: Array<{
    label: string;
    value: string;
    tone: "cyan" | "lime" | "rose" | "fuchsia" | "slate";
  }>;
  timeline: PersonalEvent[];
  moduleActivity: Array<{
    module: PersonalModule;
    count: number;
  }>;
  predictions: Array<{
    title: string;
    probability: number;
    rationale: string;
  }>;
  aiInsights: Array<{
    title: string;
    body: string;
    sourceEventIds: string[];
  }>;
};

export type PersonalPluginManifest = {
  id: string;
  name: string;
  module: PersonalModule;
  version: string;
  eventTypes: PersonalEventType[];
  permissions: Array<"events:read" | "events:write" | "projections:read" | "ai:write" | "notifications:write">;
  projectionKeys: string[];
};
