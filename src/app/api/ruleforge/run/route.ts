import { NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, parseJsonBody, serverError } from "@/lib/api";
import { runRuleForgeCycle } from "@/ruleforge/engine";

const runSchema = z.object({
  url: z.string().url().optional(),
  task: z.string().max(500).optional()
});

export async function GET() {
  try {
    return NextResponse.json(await runRuleForgeCycle());
  } catch {
    return serverError("RuleForge cycle failed.");
  }
}

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (body.error) return badRequest(body.error);

  const parsed = runSchema.safeParse(body.data ?? {});
  if (!parsed.success) return badRequest(parsed.error.flatten());

  try {
    return NextResponse.json(await runRuleForgeCycle(parsed.data));
  } catch {
    return serverError("RuleForge cycle failed.");
  }
}
