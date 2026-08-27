import { NextResponse } from "next/server";
import { paradigms } from "@/lib/paradigms";

export async function GET() {
  return NextResponse.json({ paradigms });
}
