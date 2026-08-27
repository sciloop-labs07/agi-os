from __future__ import annotations

from maths_ai_ecosystem.core.graph_engine import GraphEngine


class GraphWorld:
    def __init__(self) -> None:
        self.graph = GraphEngine()

    def add_concept_relation(self, source: str, target: str, weight: float) -> None:
        self.graph.add_node(source, "concept", source)
        self.graph.add_node(target, "concept", target)
        self.graph.connect(source, target, weight)
