from __future__ import annotations

"""Root entrypoint for Maths-AI v0.1.

Run:
    python main.py --ticks 12
"""

import argparse
from pathlib import Path

from maths_ai_ecosystem.core.engine import MathsAIEngine


def main() -> None:
    parser = argparse.ArgumentParser(description="Run Maths-AI self-evolving ecosystem.")
    parser.add_argument("--ticks", type=int, default=12, help="Number of simulation ticks.")
    parser.add_argument("--config", type=Path, default=Path("config.yaml"), help="YAML config path.")
    args = parser.parse_args()

    engine = MathsAIEngine.from_yaml(args.config)
    reports = engine.run(args.ticks)
    for report in reports:
        print(
            f"tick={report.tick:03d} agents={report.agent_count:02d} "
            f"accepted={report.accepted_theorems} rejected={report.rejected_theorems} "
            f"fitness={report.best_fitness:.2f}"
        )
    print(f"dashboard={engine.render_dashboard()}")


if __name__ == "__main__":
    main()
