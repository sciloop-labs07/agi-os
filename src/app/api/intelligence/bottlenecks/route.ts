import { NextResponse } from "next/server";
import { bottleneckMap } from "@/lib/frontier/engine";

export async function GET() {
  return NextResponse.json({ bottlenecks: bottleneckMap });
}
