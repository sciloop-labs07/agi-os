from __future__ import annotations

from .base_agent import BaseAgent


class CompressionAgent(BaseAgent):
    def act(self, context: dict) -> dict:
        memory = context["memory"].recent(12)
        original = " ".join(item.content for item in memory)
        compressed = " ".join(dict.fromkeys(original.split()))
        score = context["entropy"].compression_score(original, compressed)
        return {"type": "compression", "agent": self.name, "compressed": compressed[:500], "score": score}
