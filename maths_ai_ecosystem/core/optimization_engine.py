from __future__ import annotations

from .entropy_engine import EntropyEngine
from .types import Evaluation, Theorem


class OptimizationEngine:
    """Fitness and compression objective for theorem and variant survival."""

    def __init__(self) -> None:
        self.entropy = EntropyEngine()

    def theorem_quality(self, theorem: Theorem, evaluation: Evaluation) -> float:
        compression = max(0.0, 1.0 - self.entropy.kolmogorov_proxy(theorem.statement) / 12.0)
        assumption_penalty = min(0.35, len(theorem.assumptions) * 0.04)
        return max(0.0, min(1.0, 0.62 * evaluation.score + 0.28 * compression - assumption_penalty))

    def survival_fitness(
        self,
        correctness: float,
        compression: float,
        prediction: float,
        consistency: float,
        energy_efficiency: float,
        novelty: float,
    ) -> float:
        return (
            0.28 * correctness
            + 0.18 * compression
            + 0.16 * prediction
            + 0.16 * consistency
            + 0.12 * energy_efficiency
            + 0.10 * novelty
        )
