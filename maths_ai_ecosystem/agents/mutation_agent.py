from __future__ import annotations

from .base_agent import BaseAgent


class MutationAgent(BaseAgent):
    def act(self, context: dict) -> dict:
        theorem = context.get("current_theorem")
        if theorem is None:
            return {"type": "mutation", "agent": self.name, "mutant": None}
        mutant = context["mutation"].mutate_theorem(theorem, self.name)
        return {"type": "mutation", "agent": self.name, "mutant": mutant}
