from __future__ import annotations

from random import Random

from .dynamics_engine import DynamicsEngine
from .mutation_engine import MutationEngine
from .optimization_engine import OptimizationEngine
from .types import AgentRecord, AgentState


class EvolutionEngine:
    """Mutation, selection, novelty preservation, agent death, and agent spawning."""

    def __init__(self, seed: int = 42, max_agents: int = 20, min_survival_fitness: float = 0.25) -> None:
        self.random = Random(seed)
        self.max_agents = max_agents
        self.min_survival_fitness = min_survival_fitness
        self.mutation = MutationEngine(seed)
        self.optimization = OptimizationEngine()
        self.dynamics = DynamicsEngine()

    def update_population(self, agents: list[AgentRecord], feedback_by_agent: dict[str, float]) -> list[AgentRecord]:
        survivors: list[AgentRecord] = []
        for agent in agents:
            feedback = feedback_by_agent.get(agent.id, 0.4)
            self.dynamics.update_agent_state(agent, feedback)
            agent.fitness = max(0.0, min(1.0, 0.68 * agent.fitness + 0.32 * feedback))
            if agent.fitness >= self.min_survival_fitness and agent.state is not AgentState.DEAD:
                survivors.append(agent)

        children: list[AgentRecord] = []
        for agent in sorted(survivors, key=lambda item: item.fitness, reverse=True)[:3]:
            if len(survivors) + len(children) >= self.max_agents:
                break
            if self.random.random() < agent.genome.mutation_rate + agent.genome.novelty * 0.12:
                children.append(self.mutation.spawn_variant(agent))

        return (survivors + children)[: self.max_agents]
