from __future__ import annotations

from pathlib import Path

from maths_ai_ecosystem.config import DEFAULT_CONFIG
from maths_ai_ecosystem.core.agent_runtime import AgentRuntime
from maths_ai_ecosystem.visualization import export_runtime_snapshot


def main() -> None:
    runtime = AgentRuntime(DEFAULT_CONFIG)
    reports = runtime.run(ticks=8)
    for report in reports:
        print(
            f"tick={report.tick} agents={report.agent_count} "
            f"accepted={report.accepted_theorems} rejected={report.rejected_theorems} "
            f"best_fitness={report.best_fitness:.2f}"
        )
        for event in report.events[:4]:
            print(f"  - {event}")
    output = export_runtime_snapshot(runtime, reports, Path("maths_ai_ecosystem/logs/dashboard_snapshot.json"))
    print(f"snapshot={output}")


if __name__ == "__main__":
    main()
