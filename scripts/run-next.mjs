import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const command = process.argv[2];

if (!command || !["build", "start"].includes(command)) {
  console.error("Usage: node scripts/run-next.mjs <build|start> [...next args]");
  process.exit(1);
}

const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const child = spawn(process.execPath, [nextBin, command, ...process.argv.slice(3)], {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_DIST_DIR: process.env.NEXT_DIST_DIR ?? (process.env.VERCEL ? ".next" : ".next-build")
  }
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
