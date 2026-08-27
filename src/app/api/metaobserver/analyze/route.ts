import { NextResponse } from "next/server";
import { badRequest, parseJsonBody, serverError } from "@/lib/api";
import { analyzeRuleForge, getMetaObserverState } from "@/metaobserver/engine";
import type { MetaObserverInput } from "@/metaobserver/types";

export async function GET() {
  return NextResponse.json(getMetaObserverState());
}

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (body.error) return badRequest(body.error);

  try {
    return NextResponse.json(analyzeRuleForge((body.data ?? {}) as MetaObserverInput));
  } catch {
    return serverError("MetaObserver analysis failed.");
  }
}
