import { NextResponse } from "next/server";
import { z } from "zod";
import { generateResearchBrief } from "@/lib/ai/providers";
import { badRequest, parseJsonBody, serverError } from "@/lib/api";

const generateSchema = z.object({
  provider: z.enum(["openai", "claude", "gemini", "groq", "deepseek"]).default("openai"),
  prompt: z.string().min(10),
  system: z.string().optional()
});

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (body.error) return badRequest(body.error);

  const parsed = generateSchema.safeParse(body.data);
  if (!parsed.success) {
    return badRequest(parsed.error.flatten());
  }

  try {
    const result = await generateResearchBrief(parsed.data);
    return NextResponse.json(result);
  } catch {
    return serverError("AI provider request failed.");
  }
}
