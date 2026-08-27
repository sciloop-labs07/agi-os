import { NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, parseJsonBody } from "@/lib/api";

const noteSchema = z.object({
  title: z.string().min(2),
  markdown: z.string().min(1),
  tags: z.array(z.string()).default([]),
  paradigmSlug: z.string().optional()
});

const inMemoryNotes: z.infer<typeof noteSchema>[] = [];

export async function GET() {
  return NextResponse.json({ notes: inMemoryNotes });
}

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (body.error) return badRequest(body.error);

  const parsed = noteSchema.safeParse(body.data);
  if (!parsed.success) {
    return badRequest(parsed.error.flatten());
  }

  inMemoryNotes.unshift(parsed.data);
  return NextResponse.json({ note: parsed.data }, { status: 201 });
}
