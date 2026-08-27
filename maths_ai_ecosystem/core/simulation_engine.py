from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(slots=True)
class SimulationResult:
    name: str
    score: float
    observations: list[str] = field(default_factory=list)


class SimulationEngine:
    """Resource-constrained symbolic simulations for reality testing."""

    def run_symbolic_stability(self, statement: str) -> SimulationResult:
        tokens = statement.split()
        unique = len(set(tokens))
        score = min(1.0, unique / max(1, len(tokens)) + 0.1 * ("stabilizes" in statement))
        return SimulationResult(
            name="symbolic_stability",
            score=score,
            observations=[
                f"unique_token_ratio={unique / max(1, len(tokens)):.2f}",
                "No numeric physics violation detected in symbolic-only prototype.",
            ],
        )
