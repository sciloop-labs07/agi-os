import { NextResponse } from "next/server";
import { listPersonalEvents } from "@/lib/personal/event-engine";
import { buildPersonalProjection } from "@/lib/personal/projections";

export async function GET() {
  const projection = buildPersonalProjection(listPersonalEvents({ limit: 500 }));
  return NextResponse.json({ predictions: projection.predictions });
}
