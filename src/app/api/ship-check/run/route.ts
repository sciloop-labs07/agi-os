import { NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, parseJsonBody, serverError } from "@/lib/api";
import { runShipCheck } from "@/lib/ship-check/engine";

const schema = z.object({ demoId: z.enum(["customer-support", "rag-knowledge", "coding-developer"]) });

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (body.error) return badRequest(body.error);
  const parsed = schema.safeParse(body.data);
  if (!parsed.success) return badRequest(parsed.error.flatten());
  try { return NextResponse.json(runShipCheck(parsed.data.demoId)); } catch { return serverError("Ship Check execution failed."); }
}
