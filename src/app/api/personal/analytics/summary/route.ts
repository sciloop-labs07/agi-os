import { NextResponse } from "next/server";
import { listPersonalEvents } from "@/lib/personal/event-engine";
import { buildPersonalProjection } from "@/lib/personal/projections";

export async function GET() {
  const events = listPersonalEvents({ limit: 500 });
  const projection = buildPersonalProjection(events);
  return NextResponse.json({
    summary: {
      dailyScore: projection.dailyScore,
      eventCount: projection.eventCount,
      modulesActive: projection.modulesActive,
      moduleActivity: projection.moduleActivity,
      signals: projection.currentSignals
    }
  });
}
