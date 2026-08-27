import { NextResponse } from "next/server";
import { listPersonalEvents } from "@/lib/personal/event-engine";
import { buildPersonalProjection } from "@/lib/personal/projections";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  const projection = buildPersonalProjection(listPersonalEvents({ limit: 500 }), date);
  return NextResponse.json({ projection });
}
