import { NextResponse } from "next/server";
import { listPersonalEvents } from "@/lib/personal/event-engine";

export async function GET() {
  return NextResponse.json({ timeline: listPersonalEvents({ limit: 100 }) });
}
