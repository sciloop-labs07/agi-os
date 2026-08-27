from __future__ import annotations

from copy import deepcopy
from random import Random

from .types import AgentGenome, AgentRecord, Theorem


class MutationEngine:
    """Bounded self-modification through prompt/heuristic/genome mutation."""

    heuristic_pool = [
        "search for invariants",
        "prefer shorter proofs",
        "generate counterexamples first",
        "test by simulation",
        "compress into reusable lemma",
        "compare with failed attempts",
        "ask another agent to refute",
        "minimize energy cost",
    ]

    def __init__(self, seed: int = 42) -> None:
        self.random = Random(seed)

    def mutate_genome(self, genome: AgentGenome) -> AgentGenome:
        child = deepcopy(genome)
        attr = self.random.choice(["abstraction_bias", "skepticism", "novelty", "compression_bias", "energy_discipline"])
        delta = self.random.uniform(-0.12, 0.12)
        setattr(child, attr, min(1.0, max(0.0, getattr(child, attr) + delta)))
        if self.random.random() < child.mutation_rate:
            child.heuristics = list(dict.fromkeys(child.heuristics + [self.random.choice(self.heuristic_pool)]))[-5:]
        return child

    def spawn_variant(self, parent: AgentRecord) -> AgentRecord:
        genome = self.mutate_genome(parent.genome)
        return AgentRecord(
            name=f"{parent.name}-variant",
            genome=genome,
            fitness=min(1.0, max(0.05, parent.fitness * self.random.uniform(0.82, 1.12))),
            energy=max(0.2, parent.energy * 0.9),
            parent_id=parent.id,
        )

    def mutate_theorem(self, theorem: Theorem, agent_name: str) -> Theorem:
        relation_map = {
            "implies": "constrains",
            "compresses": "transforms",
            "stabilizes": "predicts",
            "transforms": "compresses",
            "constrains": "stabilizes",
        }
        statement = theorem.statement
        for old, new in relation_map.items():
            if old in statement:
                statement = statement.replace(old, new, 1)
                break
        return Theorem(
            statement=statement,
            assumptions=list(theorem.assumptions),
            proof_sketch=theorem.proof_sketch + ["Mutated relation and retested under reality gate."],
            parent_ids=[theorem.id],
            created_by=agent_name,
        )
