from __future__ import annotations

from dataclasses import dataclass

from .dynamics_engine import DynamicsEngine


@dataclass(slots=True)
class StabilityReport:
    stable: bool
    chaos_score: float
    warnings: list[str]


class StabilityEngine:
    """Instability monitor for runaway recursion, collapse, and chaos."""

    def __init__(self) -> None:
        self.dynamics = DynamicsEngine()

    def check(self, fitness_trajectory: list[float], recursion_depth: int, max_depth: int) -> StabilityReport:
        chaos = self.dynamics.lyapunov_proxy(fitness_trajectory[-12:]) if fitness_trajectory else 0.0
        warnings: list[str] = []
        if recursion_depth > max_depth:
            warnings.append("recursion depth exceeded")
        if chaos > 0.8:
            warnings.append("high chaos indicator")
        if fitness_trajectory and fitness_trajectory[-1] < 0.08:
            warnings.append("ecosystem collapse risk")
        return StabilityReport(stable=not warnings, chaos_score=chaos, warnings=warnings)
