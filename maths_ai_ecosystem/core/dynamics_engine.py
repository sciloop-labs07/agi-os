from __future__ import annotations

from math import log

from .types import AgentRecord, AgentState


class DynamicsEngine:
    """Nonlinear state update, attractor tendency, chaos proxy, and stability estimation."""

    def logistic_step(self, x: float, r: float = 3.62) -> float:
        x = min(0.999, max(0.001, x))
        return r * x * (1 - x)

    def lyapunov_proxy(self, trajectory: list[float], r: float = 3.62) -> float:
        if not trajectory:
            return 0.0
        vals = [abs(r * (1 - 2 * min(0.999, max(0.001, x)))) for x in trajectory]
        return sum(log(max(1e-9, v)) for v in vals) / len(vals)

    def update_agent_state(self, agent: AgentRecord, feedback: float) -> AgentState:
        attractor = self.logistic_step(agent.energy * 0.5 + feedback * 0.5, 3.1 + agent.genome.novelty)
        agent.energy = max(0.0, min(1.0, 0.72 * agent.energy + 0.28 * attractor))
        if agent.energy < 0.08:
            agent.state = AgentState.DEAD
        elif attractor > 0.82 and agent.genome.skepticism < 0.25:
            agent.state = AgentState.CHAOTIC
        elif attractor < 0.18:
            agent.state = AgentState.COLLAPSING
        elif feedback > 0.62:
            agent.state = AgentState.STABLE
        else:
            agent.state = AgentState.ADAPTIVE
        return agent.state
