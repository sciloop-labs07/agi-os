from __future__ import annotations

from collections import defaultdict, deque
from dataclasses import dataclass, field


@dataclass(slots=True)
class GraphNode:
    id: str
    kind: str
    label: str
    weight: float = 1.0
    data: dict = field(default_factory=dict)


class GraphEngine:
    """Dependency graph, semantic memory graph, and agent interaction graph."""

    def __init__(self) -> None:
        self.nodes: dict[str, GraphNode] = {}
        self.edges: dict[str, dict[str, float]] = defaultdict(dict)

    def add_node(self, node_id: str, kind: str, label: str, weight: float = 1.0, **data: object) -> None:
        self.nodes[node_id] = GraphNode(node_id, kind, label, weight, dict(data))

    def connect(self, source: str, target: str, weight: float = 1.0) -> None:
        if source in self.nodes and target in self.nodes:
            self.edges[source][target] = weight

    def rewire_weak_edges(self, threshold: float = 0.18) -> None:
        for source, targets in list(self.edges.items()):
            for target, weight in list(targets.items()):
                if weight < threshold:
                    del targets[target]

    def hubs(self, top_k: int = 5) -> list[tuple[str, int]]:
        degree = defaultdict(int)
        for source, targets in self.edges.items():
            degree[source] += len(targets)
            for target in targets:
                degree[target] += 1
        return sorted(degree.items(), key=lambda item: item[1], reverse=True)[:top_k]

    def shortest_path(self, source: str, target: str) -> list[str]:
        queue = deque([(source, [source])])
        seen = {source}
        while queue:
            node, path = queue.popleft()
            if node == target:
                return path
            for next_node in self.edges.get(node, {}):
                if next_node not in seen:
                    seen.add(next_node)
                    queue.append((next_node, path + [next_node]))
        return []

    def compress_memory_graph(self) -> list[str]:
        """Return labels of emergent hubs that deserve memory preservation."""
        return [self.nodes[node_id].label for node_id, _ in self.hubs()]
