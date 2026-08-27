import { NextResponse } from "next/server";
import { founderConnectors } from "@/lib/founder-network/connectors";

export async function GET() {
  return NextResponse.json({ connectors: founderConnectors });
}
