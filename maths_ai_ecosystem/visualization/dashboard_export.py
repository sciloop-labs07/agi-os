from __future__ import annotations

import json
from pathlib import Path

from maths_ai_ecosystem.core.agent_runtime import AgentRuntime, TickReport


def export_runtime_snapshot(runtime: AgentRuntime, reports: list[TickReport], output_path: Path) -> Path:
    """Export a JSON dashboard payload for graph/entropy/mutation visualization."""
    payload = {
        "agents": [agent.self_model() for agent in runtime.agents],
        "reports": [
            {
                "tick": report.tick,
                "accepted_theorems": report.accepted_theorems,
                "rejected_theorems": report.rejected_theorems,
                "agent_count": report.agent_count,
                "best_fitness": report.best_fitness,
                "events": report.events,
            }
            for report in reports
        ],
        "memory_hubs": runtime.memory.compressed_summary(),
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return output_path
