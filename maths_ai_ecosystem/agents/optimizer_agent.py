from __future__ import annotations

from .base_agent import BaseAgent


class OptimizerAgent(BaseAgent):
    def act(self, context: dict) -> dict:
        theorem = context.get("current_theorem")
        if theorem is None:
            return {"type": "optimization", "agent": self.name, "score": 0.0}
        evaluation = context.get("current_evaluation")
        if evaluation is None:
            evaluation = context["theorem_engine"].proof_search(theorem)
        score = context["optimizer"].theorem_quality(theorem, evaluation)
        return {"type": "optimization", "agent": self.name, "score": score, "theorem": theorem}
