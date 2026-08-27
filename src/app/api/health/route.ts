import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const databaseConfigured = Boolean(process.env.DATABASE_URL?.trim());
  const jwtConfigured = Boolean(process.env.JWT_SECRET?.trim());
  const dataMode = process.env.DATA_MODE ?? "database";
  const readOnlyDemo = !databaseConfigured && dataMode === "read-only-demo";
  const ready = jwtConfigured && (databaseConfigured || readOnlyDemo);

  const payload = {
    service: "agi-os",
    status: ready ? (readOnlyDemo ? "degraded" : "ready") : "blocked",
    runtime: "nodejs",
    python: process.env.PYTHON ?? "python3",
    dependencies: {
      database: databaseConfigured
        ? "configured"
        : readOnlyDemo
          ? "read-only demo fallback; no durable database writes"
          : "missing DATABASE_URL",
      sessionSecret: jwtConfigured ? "configured" : "missing JWT_SECRET",
      mathsAi: "bounded verifier route available; uses ephemeral /tmp evidence storage"
    },
    persistence: {
      durableDatabaseWrites: databaseConfigured,
      processState: readOnlyDemo ? "ephemeral demo state; lost on restart" : "application configured mode"
    },
    claims: {
      agi: false,
      productionReady: false,
      securityCertified: false
    }
  };

  return NextResponse.json(payload, { status: ready ? 200 : 503 });
}
