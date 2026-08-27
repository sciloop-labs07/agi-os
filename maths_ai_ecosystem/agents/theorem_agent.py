from __future__ import annotations

from .base_agent import BaseAgent


class TheoremAgent(BaseAgent):
    def act(self, context: dict) -> dict:
        concepts = context.get("concepts", ["recursion", "compression", "prediction"])
        theorem = context["theorem_engine"].generate(self.name, concepts)
        return {"type": "theorem", "agent": self.name, "theorem": theorem}
