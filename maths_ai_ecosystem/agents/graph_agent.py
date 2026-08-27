from __future__ import annotations

from .base_agent import BaseAgent


class GraphAgent(BaseAgent):
    def act(self, context: dict) -> dict:
        memory = context["memory"]
        hubs = memory.compressed_summary()
        memory.graph.rewire_weak_edges(0.12)
        return {"type": "graph", "agent": self.name, "hubs": hubs}
