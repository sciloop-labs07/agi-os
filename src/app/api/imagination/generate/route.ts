import { NextResponse } from "next/server";
import { z } from "zod";
import {
  buildImaginationPrompt,
  buildImaginationSystemPrompt,
  generateLocalImagination,
  type ImaginationResult
} from "@/lib/imagination";
import { badRequest, parseJsonBody, serverError } from "@/lib/api";
import { generateResearchBrief } from "@/lib/ai/providers";

const schema = z.object({
  seed: z.string().min(8),
  mode: z.enum(["world", "invention", "strategy", "safety"]).default("world"),
  horizon: z.number().int().min(1).max(30).default(7),
  novelty: z.number().int().min(0).max(100).default(68),
  constraints: z.array(z.string().min(2).max(80)).max(8).default([]),
  provider: z.enum(["openai", "claude", "gemini", "groq", "deepseek"]).default("openai")
});

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (body.error) return badRequest(body.error);

  const parsed = schema.safeParse(body.data);
  if (!parsed.success) return badRequest(parsed.error.flatten());

  const fallback = generateLocalImagination(parsed.data);

  try {
    const generated = await generateResearchBrief({
      provider: parsed.data.provider,
      system: buildImaginationSystemPrompt(),
      prompt: buildImaginationPrompt(parsed.data)
    });

    if (!process.env.OPENAI_API_KEY || !generated.text.trim().startsWith("{")) {
      return NextResponse.json({ source: "local", result: fallback });
    }

    const result = JSON.parse(generated.text) as ImaginationResult;
    return NextResponse.json({ source: generated.provider, result });
  } catch {
    try {
      return NextResponse.json({ source: "local", result: fallback });
    } catch {
      return serverError("Imagination engine failed.");
    }
  }
}

