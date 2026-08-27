import { NextResponse } from "next/server";
import { generateFrontierSnapshot } from "@/lib/frontier/engine";

export async function GET() {
  return NextResponse.json({ snapshot: generateFrontierSnapshot() });
}
