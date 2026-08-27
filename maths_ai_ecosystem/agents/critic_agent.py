from __future__ import annotations

from .base_agent import BaseAgent


class CriticAgent(BaseAgent):
    def act(self, context: dict) -> dict:
        theorem = context.get("current_theorem")
        if theorem is None:
            return {"type": "critique", "agent": self.name, "notes": ["No theorem available."]}
        evaluation = context["theorem_engine"].proof_search(theorem)
        reality = context["reality"].validate(theorem, evaluation)
        return {"type": "critique", "agent": self.name, "evaluation": reality, "theorem": theorem}
