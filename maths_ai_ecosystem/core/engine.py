from __future__ import annotations

from pathlib import Path

from maths_ai_ecosystem.config import DEFAULT_CONFIG, EcosystemConfig
from maths_ai_ecosystem.core.agent_runtime import AgentRuntime, TickReport
from maths_ai_ecosystem.core.simulation_loop import SimulationLoop
from maths_ai_ecosystem.visualization.dashboard import Dashboard


class MathsAIEngine:
    """High-level project engine: config, runtime, loop, metrics, visualization."""

    def __init__(self, config: EcosystemConfig = DEFAULT_CONFIG) -> None:
        self.config = config
        self.runtime = AgentRuntime(config)
        self.loop = SimulationLoop(self.runtime)
        self.dashboard = Dashboard()
        self.last_reports: list[TickReport] = []

    @classmethod
    def from_yaml(cls, path: Path) -> "MathsAIEngine":
        config = DEFAULT_CONFIG
        if path.exists():
            values = _tiny_yaml(path.read_text(encoding="utf-8"))
            runtime = values.get("runtime", {})
            resources = values.get("resources", {})
            memory = values.get("memory", {})
            config = EcosystemConfig(
                max_agents=int(runtime.get("max_agents", config.max_agents)),
                initial_agents=int(runtime.get("initial_agents", config.initial_agents)),
                max_recursion_depth=int(runtime.get("max_recursion_depth", config.max_recursion_depth)),
                random_seed=int(runtime.get("random_seed", config.random_seed)),
                energy_budget_per_tick=float(resources.get("energy_budget_per_tick", config.energy_budget_per_tick)),
                memory_budget_per_tick=float(resources.get("memory_budget_per_tick", config.memory_budget_per_tick)),
                min_survival_fitness=float(resources.get("min_survival_fitness", config.min_survival_fitness)),
                database_path=Path(memory.get("database_path", config.database_path)),
                max_memory_items=int(memory.get("max_memory_items", config.max_memory_items)),
            )
        return cls(config)

    def run(self, ticks: int) -> list[TickReport]:
        self.last_reports = self.loop.run(ticks)
        return self.last_reports

    def render_dashboard(self) -> Path:
        return self.dashboard.render(self.runtime, self.last_reports, self.loop.metrics.frames, Path("maths_ai_ecosystem/logs/dashboard.html"))


def _tiny_yaml(text: str) -> dict:
    """Tiny YAML subset parser for this config file, avoiding a hard PyYAML dependency."""
    root: dict[str, dict[str, str]] = {}
    current: str | None = None
    for raw in text.splitlines():
        line = raw.split("#", 1)[0].rstrip()
        if not line:
            continue
        if not line.startswith(" ") and line.endswith(":"):
            current = line[:-1]
            root[current] = {}
        elif current and ":" in line:
            key, value = line.strip().split(":", 1)
            root[current][key.strip()] = value.strip().strip('"')
    return root
