from __future__ import annotations

from abc import ABC, abstractmethod
from random import Random

from maths_ai_ecosystem.core.types import AgentGenome, AgentRecord, Theorem


class BaseAgent(ABC):
    """Base class for all evolving mathematical entities."""

    def __init__(self, record: AgentRecord, seed: int = 42) -> None:
        self.record = record
        self.random = Random(seed + hash(record.id) % 10_000)

    @property
    def name(self) -> str:
        return self.record.name

    @abstractmethod
    def act(self, context: dict) -> dict:
        """Return an action packet. The runtime decides what survives reality gates."""

    def self_model(self) -> dict:
        genome = self.record.genome
        return {
            "name": self.name,
            "role": genome.role,
            "fitness": self.record.fitness,
            "state": self.record.state.value,
            "heuristics": genome.heuristics,
        }


def create_record(name: str, role: str, heuristics: list[str], **biases: float) -> AgentRecord:
    genome = AgentGenome(role=role, heuristics=heuristics, **biases)
    return AgentRecord(name=name, genome=genome)
