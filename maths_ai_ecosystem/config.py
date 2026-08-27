from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path


@dataclass(slots=True)
class EcosystemConfig:
    """Runtime rules for the local cognitive civilization."""

    root_dir: Path = Path(__file__).resolve().parent
    database_path: Path = Path(__file__).resolve().parent / "data" / "ecosystem.sqlite"
    log_dir: Path = Path(__file__).resolve().parent / "logs"
    max_agents: int = 20
    initial_agents: int = 8
    max_memory_items: int = 2_000
    max_recursion_depth: int = 4
    max_mutations_per_tick: int = 3
    min_survival_fitness: float = 0.25
    entropy_pressure: float = 0.12
    novelty_pressure: float = 0.18
    compression_pressure: float = 0.25
    correctness_pressure: float = 0.35
    energy_budget_per_tick: float = 100.0
    memory_budget_per_tick: float = 200.0
    random_seed: int = 42
    enabled_reality_gates: list[str] = field(
        default_factory=lambda: [
            "logic_consistency",
            "symbolic_evaluation",
            "unit_test",
            "simulation_budget",
            "contradiction_check",
        ]
    )


DEFAULT_CONFIG = EcosystemConfig()
