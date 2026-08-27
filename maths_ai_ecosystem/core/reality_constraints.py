from __future__ import annotations

from .logic_engine import LogicEngine
from .types import Evaluation, ResourceCost, Theorem


class RealityConstraintLayer:
    """Reality is the final judge: proof, code, simulation, consistency, and budget gates."""

    def __init__(self, energy_budget: float = 100.0, memory_budget: float = 200.0) -> None:
        self.energy_budget = energy_budget
        self.memory_budget = memory_budget
        self.energy_used = 0.0
        self.memory_used = 0.0
        self.logic = LogicEngine()

    def reset_tick(self) -> None:
        self.energy_used = 0.0
        self.memory_used = 0.0

    def validate(self, theorem: Theorem, evaluation: Evaluation) -> Evaluation:
        reasons = list(evaluation.reasons)
        contradictions = self.logic.detect_contradictions(theorem.assumptions + [theorem.statement])
        if contradictions:
            reasons.append("Rejected by contradiction gate.")
        if self.energy_used + evaluation.cost.energy > self.energy_budget:
            reasons.append("Rejected by energy budget.")
        if self.memory_used + evaluation.cost.memory > self.memory_budget:
            reasons.append("Rejected by memory budget.")
        accepted = evaluation.accepted and not contradictions and not any("Rejected" in r for r in reasons)
        self.energy_used += evaluation.cost.energy
        self.memory_used += evaluation.cost.memory
        return Evaluation(
            accepted=accepted,
            score=evaluation.score if accepted else evaluation.score * 0.5,
            reasons=reasons,
            contradictions=contradictions,
            cost=evaluation.cost,
        )

    def action_cost(self, action_name: str, complexity: float = 1.0) -> ResourceCost:
        return ResourceCost(
            energy=0.8 * complexity + len(action_name) * 0.02,
            compute=1.2 * complexity,
            memory=0.4 * complexity,
        )
