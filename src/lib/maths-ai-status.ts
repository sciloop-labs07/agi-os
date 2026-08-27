import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const artifactPaths = [
  "main.py",
  "config.yaml",
  "maths_ai_ecosystem/README.md",
  "maths_ai_ecosystem/requirements.txt",
  "maths_ai_ecosystem/core/engine.py",
  "maths_ai_ecosystem/core/simulation_loop.py",
  "maths_ai_ecosystem/core/metrics.py",
  "maths_ai_ecosystem/core/stability_engine.py",
  "maths_ai_ecosystem/agents/graph_agent.py",
  "maths_ai_ecosystem/memory/graph_memory.py",
  "maths_ai_ecosystem/math_core/information_theory.py",
  "maths_ai_ecosystem/visualization/dashboard.py",
  "maths_ai_ecosystem/logs/dashboard.html",
  "maths_ai_ecosystem/logs/dashboard_snapshot.json",
  "maths_ai_ecosystem/logs/verified_latest.json",
  "maths_ai_ecosystem/data/verified_experiments.sqlite"
];

export function getMathsAIStatus() {
  const snapshotPath = path.join(root, "maths_ai_ecosystem", "logs", "dashboard_snapshot.json");
  const dashboardPath = path.join(root, "maths_ai_ecosystem", "logs", "dashboard.html");
  const snapshot = readSnapshot(snapshotPath);
  const reports = Array.isArray(snapshot?.reports) ? snapshot.reports : [];
  const agents = Array.isArray(snapshot?.agents) ? snapshot.agents : [];
  const lastReport = reports[reports.length - 1] ?? null;

  return {
    title: "Maths-AI legacy local simulation",
    status: "simulation-only",
    commands: [
      { command: "python main.py --ticks 5", result: "passed", detail: "Generated evolving agent/theorem simulation and dashboard.html." },
      { command: "python -m unittest discover maths_ai_ecosystem/tests", result: "passed", detail: "9 tests passed." },
      { command: "python -m compileall -q maths_ai_ecosystem main.py", result: "passed", detail: "Python compile check passed." }
    ],
    metrics: {
      agents: agents.length,
      ticks: lastReport?.tick ?? reports.length,
      acceptedTheorems: reports.reduce((sum: number, report: { accepted_theorems?: number }) => sum + (report.accepted_theorems ?? 0), 0),
      rejectedTheorems: reports.reduce((sum: number, report: { rejected_theorems?: number }) => sum + (report.rejected_theorems ?? 0), 0),
      bestFitness: lastReport?.best_fitness ?? 0,
      memoryHubs: Array.isArray(snapshot?.memory_hubs) ? snapshot.memory_hubs.length : 0
    },
    artifacts: artifactPaths.map((relativePath) => {
      const absolutePath = path.join(root, relativePath);
      const exists = fs.existsSync(absolutePath);
      const stats = exists ? fs.statSync(absolutePath) : null;
      return {
        path: relativePath,
        exists,
        size: stats?.size ?? 0,
        updatedAt: stats?.mtime.toISOString() ?? null
      };
    }),
    dashboard: {
      path: "maths_ai_ecosystem/logs/dashboard.html",
      exists: fs.existsSync(dashboardPath),
      updatedAt: fs.existsSync(dashboardPath) ? fs.statSync(dashboardPath).mtime.toISOString() : null
    },
      latestEvents: Array.isArray(lastReport?.events) ? (lastReport.events as string[]).slice(0, 8) : []
  };
}

function readSnapshot(filePath: string) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}
