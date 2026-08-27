import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function GET() {
  const token = (await cookies()).get("agi_session")?.value;
  if (!token) return NextResponse.json({ user: null });

  try {
    const session = await verifySessionToken(token);
    return NextResponse.json({ user: session });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
