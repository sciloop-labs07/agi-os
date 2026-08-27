from __future__ import annotations

import re
from random import Random

from .entropy_engine import EntropyEngine
from .logic_engine import LogicEngine
from .types import ClaimStatus, Evaluation, ResourceCost, Theorem


class TheoremEngine:
    """Prototype theorem generation, proof search, contradiction detection, and scoring."""

    def __init__(self, seed: int = 42) -> None:
        self.random = Random(seed)
        self.logic = LogicEngine()
        self.entropy = EntropyEngine()
        self.archive: dict[str, Theorem] = {}

    def generate(self, agent_name: str, concepts: list[str]) -> Theorem:
        if not concepts:
            concepts = ["compression", "recursion", "prediction"]
        a = self.random.choice(concepts)
        b = self.random.choice(concepts)
        relation = self.random.choice(["implies", "compresses", "stabilizes", "transforms", "constrains"])
        statement = f"{a} {relation} {b}"
        theorem = Theorem(
            statement=statement,
            assumptions=[f"{a} exists", f"{b} exists"],
            proof_sketch=[f"Assume {a}.", f"Apply relation {relation}.", f"Infer effect on {b}."],
            created_by=agent_name,
        )
        self.archive[theorem.id] = theorem
        return theorem

    def proof_search(self, theorem: Theorem) -> Evaluation:
        contradictions = self.logic.detect_contradictions(theorem.assumptions + [theorem.statement])
        symbolic_strength = self._symbolic_strength(theorem.statement)
        compression = 1.0 - min(1.0, self.entropy.kolmogorov_proxy(theorem.statement) / 10.0)
        proof_steps = min(1.0, len(theorem.proof_sketch) / 4)
        score = 0.45 * symbolic_strength + 0.3 * proof_steps + 0.25 * compression
        if contradictions:
            score *= 0.15
        accepted = score >= 0.42 and not contradictions
        theorem.status = ClaimStatus.ACCEPTED if accepted else ClaimStatus.REJECTED
        theorem.score = score
        theorem.confidence = score
        reasons = [
            f"symbolic_strength={symbolic_strength:.2f}",
            f"proof_steps={proof_steps:.2f}",
            f"compression={compression:.2f}",
        ]
        return Evaluation(
            accepted=accepted,
            score=score,
            reasons=reasons,
            contradictions=contradictions,
            cost=ResourceCost(energy=1.5, compute=2.0, memory=0.5),
        )

    def _symbolic_strength(self, statement: str) -> float:
        symbols = len(re.findall(r"[A-Za-z_]+", statement))
        operators = sum(statement.count(op) for op in ["implies", "=", ">", "<", "constrains", "transforms"])
        return min(1.0, 0.15 * symbols + 0.2 * operators)
