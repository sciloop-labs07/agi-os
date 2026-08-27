import { NextResponse } from "next/server";
import { hybridArchitectures } from "@/lib/frontier/engine";

export async function GET() {
  return NextResponse.json({ architectures: hybridArchitectures });
}
