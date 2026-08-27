import { NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, parseJsonBody } from "@/lib/api";
import { appendPersonalEvent, listPersonalEvents } from "@/lib/personal/event-engine";
import { personalEventInputSchema } from "@/lib/personal/schemas";

const querySchema = z.object({
  module: z.string().optional(),
  type: z.string().optional(),
  limit: z.coerce.number().min(1).max(200).default(100)
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return badRequest(parsed.error.flatten());

  return NextResponse.json({ events: listPersonalEvents(parsed.data) });
}

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (body.error) return badRequest(body.error);

  const parsed = personalEventInputSchema.safeParse(body.data);
  if (!parsed.success) return badRequest(parsed.error.flatten());

  const event = appendPersonalEvent(parsed.data);
  return NextResponse.json({ event }, { status: 201 });
}
