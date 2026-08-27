from __future__ import annotations

from .base_agent import BaseAgent


class ExplorerAgent(BaseAgent):
    def act(self, context: dict) -> dict:
        memory = context["memory"].recent(8)
        seeds = [item.content.split()[0] for item in memory if item.content.split()]
        base = context.get("concepts", [])
        concepts = list(dict.fromkeys(base + seeds + ["invariant", "fixed-point", "energy"]))
        return {"type": "exploration", "agent": self.name, "concepts": concepts[-8:]}
