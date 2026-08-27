import { NextResponse } from "next/server";
import { getMathsAIStatus } from "@/lib/maths-ai-status";

export async function GET() {
  return NextResponse.json(getMathsAIStatus());
}
