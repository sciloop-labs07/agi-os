from __future__ import annotations

from .base_agent import BaseAgent


class PhysicsAgent(BaseAgent):
    def act(self, context: dict) -> dict:
        theorem = context.get("current_theorem")
        if theorem is None:
            return {"type": "physics", "agent": self.name, "score": 0.0}
        result = context["simulation"].run_symbolic_stability(theorem.statement)
        return {"type": "physics", "agent": self.name, "result": result}
