import { NextResponse } from "next/server";
import { badRequest, parseJsonBody } from "@/lib/api";
import { appendPersonalEvents } from "@/lib/personal/event-engine";
import { batchEventInputSchema } from "@/lib/personal/schemas";

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (body.error) return badRequest(body.error);

  const parsed = batchEventInputSchema.safeParse(body.data);
  if (!parsed.success) return badRequest(parsed.error.flatten());

  const events = appendPersonalEvents(parsed.data.events);
  return NextResponse.json({ events }, { status: 201 });
}
