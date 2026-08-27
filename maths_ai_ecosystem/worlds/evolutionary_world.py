from __future__ import annotations

from maths_ai_ecosystem.core.agent_runtime import AgentRuntime


class EvolutionaryWorld:
    def __init__(self, runtime: AgentRuntime) -> None:
        self.runtime = runtime

    def run(self, ticks: int = 5):
        return self.runtime.run(ticks)
