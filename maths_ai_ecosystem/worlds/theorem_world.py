from __future__ import annotations

from maths_ai_ecosystem.core.theorem_engine import TheoremEngine


class TheoremWorld:
    def __init__(self, engine: TheoremEngine) -> None:
        self.engine = engine

    def step(self, agent_name: str, concepts: list[str]) -> tuple[str, float]:
        theorem = self.engine.generate(agent_name, concepts)
        evaluation = self.engine.proof_search(theorem)
        return theorem.statement, evaluation.score
