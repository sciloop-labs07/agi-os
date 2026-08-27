import { NextResponse } from "next/server";
import { buildFounderNetworkProjection } from "@/lib/founder-network/intelligence";

export async function GET() {
  return NextResponse.json({ projection: buildFounderNetworkProjection() });
}
