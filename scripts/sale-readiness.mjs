import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, "output/agi-os-sale/SALE-VERIFICATION-REPORT.json");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const pythonCommand = process.platform === "win32" ? "python" : "python3";

const checks = [
  { name: "TypeScript typecheck", command: npmCommand, args: ["run", "typecheck"] },
  { name: "Python unit tests", command: pythonCommand, args: ["-m", "unittest", "discover", "maths_ai_ecosystem/tests", "-v"] },
  { name: "Seeded verified experiment", command: pythonCommand, args: ["-m", "maths_ai_ecosystem.verified_mode", "--seed", "17", "--domain", "all", "--max-candidates", "6"] },
];

function runCheck(check) {
  return new Promise((resolveResult) => {
    const started = Date.now();
    // Windows exposes npm/python launchers as .cmd files. Use cmd.exe with a
    // fixed, repository-owned command line; no user input reaches this runner.
    const launch = process.platform === "win32"
      ? { command: process.env.ComSpec ?? "cmd.exe", args: ["/d", "/s", "/c", [check.command, ...check.args].join(" ")] }
      : { command: check.command, args: check.args };
    const child = spawn(launch.command, launch.args, { cwd: root, env: process.env, shell: false });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", (error) => resolveResult({ ...check, status: "FAILED", exit_code: null, duration_ms: Date.now() - started, stdout, stderr: `${stderr}${error.message}` }));
    child.on("close", (exitCode) => resolveResult({ ...check, status: exitCode === 0 ? "PASSED" : "FAILED", exit_code: exitCode, duration_ms: Date.now() - started, stdout: stdout.trim(), stderr: stderr.trim() }));
  });
}

const startedAt = new Date().toISOString();
const results = [];
for (const check of checks) results.push(await runCheck(check));
const finishedAt = new Date().toISOString();
const report = {
  schema_version: "1.0",
  generated_at: finishedAt,
  started_at: startedAt,
  finished_at: finishedAt,
  purpose: "Local sale diligence and reproducibility evidence; not a product capability claim.",
  checks: results,
  overall_status: results.every((result) => result.status === "PASSED") ? "PASSED" : "FAILED",
  limitations: [
    "The verified Maths run is a bounded toy benchmark.",
    "AI Ship Check remains limited to controlled local fixtures.",
    "No customers, revenue, billing, production deployment, or security certification is represented.",
  ],
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
for (const result of results) console.log(`${result.status} ${result.name} (${result.duration_ms}ms)`);
console.log(`Report: ${outputPath}`);
process.exitCode = report.overall_status === "PASSED" ? 0 : 1;
