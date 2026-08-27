import { NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, parseJsonBody, serverError } from "@/lib/api";
import { MathImaginationEngineV2 } from "@/math-ai/imagination/mathImaginationEngine";

const schema = z.object({
  problem: z.string().min(4),
  goal: z.string().optional(),
  mode: z.enum(["alternative", "geometry", "proof", "introspection"]).default("alternative"),
  temperature: z.number().min(0.05).max(1).default(0.72),
  steps: z.number().int().min(3).max(16).default(8)
});

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (body.error) return badRequest(body.error);

  const parsed = schema.safeParse(body.data);
  if (!parsed.success) return badRequest(parsed.error.flatten());

  try {
    const engine = new MathImaginationEngineV2();
    return NextResponse.json({ result: engine.imagine(parsed.data) });
  } catch {
    return serverError("Math imagination engine failed.");
  }
}

