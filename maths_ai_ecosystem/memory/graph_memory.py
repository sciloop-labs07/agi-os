from __future__ import annotations

from maths_ai_ecosystem.core.graph_engine import GraphEngine


class GraphMemory:
    """Graph memory wrapper for concepts, theorems, agents, transformations, and memories."""

    def __init__(self) -> None:
        self.graph = GraphEngine()

    def add_concept(self, concept: str, weight: float = 1.0) -> None:
        self.graph.add_node(concept, "concept", concept, weight)

    def add_theorem(self, theorem_id: str, statement: str, score: float) -> None:
        self.graph.add_node(theorem_id, "theorem", statement, score)

    def relate(self, source: str, target: str, weight: float = 1.0) -> None:
        self.graph.connect(source, target, weight)

    def evolve(self) -> None:
        self.graph.rewire_weak_edges()

    def emergent_hubs(self) -> list[str]:
        return [label for label in self.graph.compress_memory_graph()]
