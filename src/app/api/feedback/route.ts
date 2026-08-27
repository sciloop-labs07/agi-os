import { NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, parseJsonBody } from "@/lib/api";

const feedbackSchema = z.object({
  category: z.enum(["Product", "Research", "Bug", "Idea"]),
  rating: z.coerce.number().int().min(1).max(5),
  message: z.string().min(10).max(2000),
  email: z.string().email().optional().or(z.literal(""))
});

const globalForFeedback = globalThis as unknown as { agiFeedback?: Array<z.infer<typeof feedbackSchema> & { createdAt: string }> };
const feedback = globalForFeedback.agiFeedback ?? [];
if (!globalForFeedback.agiFeedback) globalForFeedback.agiFeedback = feedback;

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (body.error) return badRequest(body.error);

  const parsed = feedbackSchema.safeParse(body.data);
  if (!parsed.success) return badRequest(parsed.error.flatten());

  feedback.unshift({ ...parsed.data, createdAt: new Date().toISOString() });
  return NextResponse.json({ ok: true }, { status: 201 });
}
