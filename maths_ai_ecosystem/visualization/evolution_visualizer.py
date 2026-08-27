from __future__ import annotations

from pathlib import Path


def render_evolution_csv(reports, output_path: Path) -> Path:
    lines = ["tick,agents,best_fitness,accepted,rejected"]
    lines += [
        f"{report.tick},{report.agent_count},{report.best_fitness},{report.accepted_theorems},{report.rejected_theorems}"
        for report in reports
    ]
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines), encoding="utf-8")
    return output_path
