import { NextResponse } from "next/server";
import { frontierItems } from "@/lib/frontier/engine";

export async function GET() {
  return NextResponse.json({ items: frontierItems });
}
