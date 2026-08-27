import { NextResponse } from "next/server";
import { paradigmBySlug } from "@/lib/paradigms";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const paradigm = paradigmBySlug(slug);

  if (!paradigm) {
    return NextResponse.json({ error: "Paradigm not found" }, { status: 404 });
  }

  return NextResponse.json({ paradigm });
}
