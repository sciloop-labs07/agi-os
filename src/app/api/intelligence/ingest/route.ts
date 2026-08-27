import { NextResponse } from "next/server";
import { z } from "zod";
import { ingestSource } from "@/lib/frontier/ingest";
import { frontierSources } from "@/lib/frontier/sources";
import { badRequest, parseJsonBody } from "@/lib/api";

const ingestSchema = z.object({
  sourceId: z.string().optional()
});

export async function GET() {
  const prioritySources = ["arxiv", "github"];
  const results = await Promise.allSettled(prioritySources.map((sourceId) => ingestSource(sourceId)));
  return NextResponse.json({
    checked: prioritySources,
    results: results.map((result, index) => ({
      sourceId: prioritySources[index],
      status: result.status,
      items: result.status === "fulfilled" ? result.value : [],
      error: result.status === "rejected" ? result.reason instanceof Error ? result.reason.message : "Unknown ingestion error" : null
    }))
  });
}

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (body.error) return badRequest(body.error);

  const parsed = ingestSchema.safeParse(body.data);
  if (!parsed.success) return badRequest(parsed.error.flatten());

  const sourceIds = parsed.data.sourceId ? [parsed.data.sourceId] : frontierSources.map((source) => source.id);
  const results = await Promise.allSettled(sourceIds.map((sourceId) => ingestSource(sourceId)));

  return NextResponse.json({
    checked: sourceIds,
    results: results.map((result, index) => ({
      sourceId: sourceIds[index],
      status: result.status,
      items: result.status === "fulfilled" ? result.value : [],
      error: result.status === "rejected" ? result.reason instanceof Error ? result.reason.message : "Unknown ingestion error" : null
    }))
  });
}
