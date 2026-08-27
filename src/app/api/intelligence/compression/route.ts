import { NextResponse } from "next/server";
import { researchCompression } from "@/lib/frontier/engine";

export async function GET() {
  return NextResponse.json({ compression: researchCompression });
}
