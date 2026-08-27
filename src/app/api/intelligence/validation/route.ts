import { NextResponse } from "next/server";
import { physicsValidations } from "@/lib/frontier/engine";

export async function GET() {
  return NextResponse.json({ validations: physicsValidations });
}
