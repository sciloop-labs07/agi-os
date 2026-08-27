import { NextResponse } from "next/server";
import { graphEdges, graphNodes } from "@/lib/graph";

export async function GET() {
  return NextResponse.json({ nodes: graphNodes, edges: graphEdges });
}
