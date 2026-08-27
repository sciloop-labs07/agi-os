import { z } from "zod";

export const personalEventTypes = [
  "habit.completed",
  "habit.missed",
  "sleep.started",
  "sleep.ended",
  "workout.logged",
  "meal.logged",
  "health.metric.logged",
  "routine.completed",
  "task.created",
  "task.completed",
  "goal.created",
  "goal.progress.updated",
  "learning.session.logged",
  "knowledge.node.created",
  "project.progress.logged",
  "networking.touchpoint.logged",
  "experiment.started",
  "experiment.result.logged",
  "decision.recorded",
  "time.audit.logged",
  "review.daily.completed",
  "ai.memory.created",
  "ai.coach.recommendation.generated",
  "notification.sent",
  "plugin.event.recorded"
] as const;

export const personalModules = [
  "identity",
  "dashboard",
  "event-engine",
  "sensors",
  "habits",
  "sleep",
  "workout",
  "nutrition",
  "health",
  "routine",
  "tasks",
  "calendar",
  "goals",
  "learning",
  "knowledge-graph",
  "projects",
  "networking",
  "experiments",
  "decision-log",
  "time-audit",
  "timeline",
  "analytics",
  "prediction-engine",
  "ai-memory",
  "ai-coach",
  "review-system",
  "notification-intelligence",
  "causal-analytics",
  "plugin-system"
] as const;

export const personalEventInputSchema = z.object({
  userId: z.string().default("local-user"),
  type: z.enum(personalEventTypes),
  source: z.enum(["manual", "sensor", "system", "ai", "plugin"]).default("manual"),
  timestamp: z.string().datetime().optional(),
  timezone: z.string().default("Asia/Calcutta"),
  module: z.enum(personalModules),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).default({}),
  metadata: z
    .object({
      confidence: z.number().min(0).max(100).optional(),
      importance: z.number().min(0).max(100).optional(),
      tags: z.array(z.string()).optional(),
      device: z.string().optional(),
      location: z.string().optional()
    })
    .default({}),
  correlationId: z.string().optional(),
  causationId: z.string().optional()
});

export const batchEventInputSchema = z.object({
  events: z.array(personalEventInputSchema).min(1).max(50)
});

export const pluginManifestSchema = z.object({
  id: z.string().min(2),
  name: z.string().min(2),
  module: z.enum(personalModules),
  version: z.string().default("0.1.0"),
  eventTypes: z.array(z.enum(personalEventTypes)).default([]),
  permissions: z
    .array(z.enum(["events:read", "events:write", "projections:read", "ai:write", "notifications:write"]))
    .default(["events:read"]),
  projectionKeys: z.array(z.string()).default([])
});

export type PersonalEventInput = z.infer<typeof personalEventInputSchema>;
