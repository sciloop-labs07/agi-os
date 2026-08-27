import { NextResponse } from "next/server";
import { appendPersonalEvent, listPersonalEvents } from "@/lib/personal/event-engine";
import { buildPersonalProjection } from "@/lib/personal/projections";

export async function POST() {
  const projection = buildPersonalProjection(listPersonalEvents({ limit: 500 }));
  const strongestPrediction = projection.predictions[0];
  const event = appendPersonalEvent({
    type: "ai.coach.recommendation.generated",
    source: "ai",
    module: "ai-coach",
    payload: {
      title: "Close the loop",
      recommendation: `${strongestPrediction.title}: ${strongestPrediction.rationale}`,
      dailyScore: projection.dailyScore
    },
    metadata: { confidence: strongestPrediction.probability, importance: 78, tags: ["ai-coach"] }
  });

  return NextResponse.json({ recommendation: event }, { status: 201 });
}
