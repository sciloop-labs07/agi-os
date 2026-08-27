import { NextResponse } from "next/server";
import { badRequest, parseJsonBody } from "@/lib/api";
import { installPersonalPlugin, listPersonalPlugins } from "@/lib/personal/event-engine";
import { pluginManifestSchema } from "@/lib/personal/schemas";

export async function GET() {
  return NextResponse.json({ plugins: listPersonalPlugins() });
}

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (body.error) return badRequest(body.error);

  const parsed = pluginManifestSchema.safeParse(body.data);
  if (!parsed.success) return badRequest(parsed.error.flatten());

  const plugin = installPersonalPlugin(parsed.data);
  return NextResponse.json({ plugin }, { status: 201 });
}
