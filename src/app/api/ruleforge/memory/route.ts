import { NextResponse } from "next/server";
import { getRuleForgeMemory } from "@/ruleforge/memory";

export async function GET() {
  return NextResponse.json({ memory: getRuleForgeMemory() });
}
