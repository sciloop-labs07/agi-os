import { NextResponse } from "next/server";
import { ideaMutations } from "@/lib/frontier/engine";

export async function GET() {
  return NextResponse.json({ ideas: ideaMutations });
}
