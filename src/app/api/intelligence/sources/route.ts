import { NextResponse } from "next/server";
import { frontierSources } from "@/lib/frontier/sources";

export async function GET() {
  return NextResponse.json({ sources: frontierSources });
}
