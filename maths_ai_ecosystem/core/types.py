from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from time import time
from typing import Any
from uuid import uuid4


class ClaimStatus(str, Enum):
    PROPOSED = "proposed"
    TESTING = "testing"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    MUTATED = "mutated"


class AgentState(str, Enum):
    STABLE = "stable"
    ADAPTIVE = "adaptive"
    CHAOTIC = "chaotic"
    COLLAPSING = "collapsing"
    DEAD = "dead"


@dataclass(slots=True)
class ResourceCost:
    energy: float = 0.0
    compute: float = 0.0
    memory: float = 0.0

    def total(self) -> float:
        return self.energy + self.compute + self.memory


@dataclass(slots=True)
class Theorem:
    statement: str
    assumptions: list[str] = field(default_factory=list)
    proof_sketch: list[str] = field(default_factory=list)
    variables: dict[str, Any] = field(default_factory=dict)
    status: ClaimStatus = ClaimStatus.PROPOSED
    confidence: float = 0.1
    score: float = 0.0
    id: str = field(default_factory=lambda: f"thm_{uuid4().hex[:10]}")
    parent_ids: list[str] = field(default_factory=list)
    created_by: str = "unknown"
    created_at: float = field(default_factory=time)


@dataclass(slots=True)
class AgentGenome:
    role: str
    heuristics: list[str]
    abstraction_bias: float = 0.5
    skepticism: float = 0.5
    novelty: float = 0.5
    compression_bias: float = 0.5
    energy_discipline: float = 0.5
    mutation_rate: float = 0.12


@dataclass(slots=True)
class AgentRecord:
    name: str
    genome: AgentGenome
    state: AgentState = AgentState.ADAPTIVE
    fitness: float = 0.5
    energy: float = 1.0
    memory_keys: list[str] = field(default_factory=list)
    parent_id: str | None = None
    id: str = field(default_factory=lambda: f"agent_{uuid4().hex[:10]}")


@dataclass(slots=True)
class MemoryItem:
    kind: str
    content: str
    importance: float
    entropy: float
    source: str
    id: str = field(default_factory=lambda: f"mem_{uuid4().hex[:10]}")
    created_at: float = field(default_factory=time)
    links: list[str] = field(default_factory=list)


@dataclass(slots=True)
class Evaluation:
    accepted: bool
    score: float
    reasons: list[str]
    cost: ResourceCost
    contradictions: list[str] = field(default_factory=list)
