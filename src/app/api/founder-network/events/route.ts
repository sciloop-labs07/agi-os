import { NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, parseJsonBody } from "@/lib/api";
import { ingestFounderEvent, listFounderEvents } from "@/lib/founder-network/intelligence";

const eventSchema = z.object({
  platform: z.string(),
  connectorMode: z.enum(["api", "rss", "webhook", "manual-import", "official-export"]),
  type: z.string(),
  title: z.string().min(2),
  summary: z.string().min(2),
  url: z.string().url(),
  occurredAt: z.string().datetime().default(new Date().toISOString()),
  tags: z.array(z.string()).default([]),
  sourceReliability: z.number().min(0).max(100).default(60),
  entities: z.array(z.object({
    id: z.string(),
    type: z.string(),
    label: z.string(),
    platform: z.string().optional(),
    url: z.string().url().optional(),
    metadata: z.record(z.string(), z.unknown()).default({})
  })).default([]),
  relationships: z.array(z.object({
    id: z.string(),
    sourceId: z.string(),
    targetId: z.string(),
    relation: z.string(),
    weight: z.number().min(0).max(100),
    evidenceEventIds: z.array(z.string()).default([])
  })).default([])
});

export async function GET() {
  return NextResponse.json({ events: listFounderEvents() });
}

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (body.error) return badRequest(body.error);
  const parsed = eventSchema.safeParse(body.data);
  if (!parsed.success) return badRequest(parsed.error.flatten());
  const event = ingestFounderEvent(parsed.data as never);
  return NextResponse.json({ event }, { status: 201 });
}
