import { NextResponse } from "next/server";

export async function parseJsonBody(request: Request) {
  try {
    const text = await request.text();
    if (!text.trim()) return { data: null, error: "Request body must be valid JSON." };
    return { data: JSON.parse(text) as unknown, error: null as string | null };
  } catch {
    return { data: null, error: "Request body must be valid JSON." };
  }
}

export function badRequest(error: unknown) {
  return NextResponse.json({ error }, { status: 400 });
}

export function serverError(message = "Internal server error") {
  return NextResponse.json({ error: message }, { status: 500 });
}
