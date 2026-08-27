import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { NextResponse } from "next/server";
import { z } from "zod";
import { badRequest, parseJsonBody, serverError } from "@/lib/api";

export const runtime = "nodejs";

const executeFile = promisify(execFile);
const latestReportPath = path.join(process.cwd(), "maths_ai_ecosystem", "logs", "verified_latest.json");
const requestSchema = z.object({
  seed: z.number().int().min(0).max(2_147_483_647).default(17),
  domain: z.enum(["all", "boolean", "algebra", "graph"]).default("all"),
  maxCandidates: z.number().int().min(1).max(12).default(6)
});

export async function GET() {
  try {
    const report = JSON.parse(await fs.readFile(latestReportPath, "utf8")) as unknown;
    return NextResponse.json({ source: "executed-python-artifact", report });
  } catch {
    return NextResponse.json({ source: "none", report: null });
  }
}

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (body.error) return badRequest(body.error);
  const parsed = requestSchema.safeParse(body.data);
  if (!parsed.success) return badRequest(parsed.error.flatten());

  try {
    // Fixed module + validated scalar arguments only. Candidate expressions never
    // become shell commands or executable code.
    const { stdout } = await executeFile(
      process.env.PYTHON ?? "python",
      ["-m", "maths_ai_ecosystem.verified_mode", "--json", "--seed", String(parsed.data.seed), "--domain", parsed.data.domain, "--max-candidates", String(parsed.data.maxCandidates)],
      { cwd: process.cwd(), timeout: 20_000, maxBuffer: 2_000_000, windowsHide: true }
    );
    return NextResponse.json({ source: "executed-python-artifact", report: JSON.parse(stdout) as unknown });
  } catch {
    return serverError("Verified experiment could not complete. Check that Python and SymPy are available.");
  }
}
