from __future__ import annotations

from dataclasses import dataclass, field

from maths_ai_ecosystem.agents import (
    BaseAgent,
    CompressionAgent,
    CriticAgent,
    ExplorerAgent,
    GraphAgent,
    MutationAgent,
    OptimizerAgent,
    PhysicsAgent,
    TheoremAgent,
    create_record,
)
from maths_ai_ecosystem.config import EcosystemConfig
from maths_ai_ecosystem.core.entropy_engine import EntropyEngine
from maths_ai_ecosystem.core.evolution_engine import EvolutionEngine
from maths_ai_ecosystem.core.memory_engine import MemoryEngine
from maths_ai_ecosystem.core.mutation_engine import MutationEngine
from maths_ai_ecosystem.core.optimization_engine import OptimizationEngine
from maths_ai_ecosystem.core.reality_constraints import RealityConstraintLayer
from maths_ai_ecosystem.core.simulation_engine import SimulationEngine
from maths_ai_ecosystem.core.starter_theorems import starter_theorems
from maths_ai_ecosystem.core.theorem_engine import TheoremEngine
from maths_ai_ecosystem.core.types import Evaluation, Theorem


@dataclass(slots=True)
class TickReport:
    tick: int
    accepted_theorems: int
    rejected_theorems: int
    agent_count: int
    best_fitness: float
    events: list[str] = field(default_factory=list)


class AgentRuntime:
    """The local mathematical civilization loop."""

    def __init__(self, config: EcosystemConfig) -> None:
        self.config = config
        self.entropy = EntropyEngine()
        self.theorem_engine = TheoremEngine(config.random_seed)
        self.optimizer = OptimizationEngine()
        self.mutation = MutationEngine(config.random_seed)
        self.simulation = SimulationEngine()
        self.reality = RealityConstraintLayer(config.energy_budget_per_tick, config.memory_budget_per_tick)
        self.memory = MemoryEngine(config.database_path, config.max_memory_items)
        self.evolution = EvolutionEngine(config.random_seed, config.max_agents, config.min_survival_fitness)
        self.agents: list[BaseAgent] = self._make_initial_agents()
        self.concepts = ["recursion", "compression", "prediction", "invariant", "proof", "energy", "graph"]
        self.tick_index = 0
        self._seed_theorems()

    def _make_initial_agents(self) -> list[BaseAgent]:
        records = [
            create_record("Theorem Agent", "theorem", ["invent theorem", "seek lemma"], abstraction_bias=0.8, novelty=0.55),
            create_record("Critic Agent", "critic", ["find contradiction", "reject weak proof"], skepticism=0.86),
            create_record("Optimizer Agent", "optimizer", ["score compression", "rank fitness"], compression_bias=0.7),
            create_record("Explorer Agent", "explorer", ["search novel bridge", "mutate concepts"], novelty=0.9),
            create_record("Compression Agent", "compression", ["minimum description length", "extract invariant"], compression_bias=0.9),
            create_record("Mutation Agent", "mutation", ["spawn variant", "alter relation"], novelty=0.75),
            create_record("Physics Agent", "physics", ["simulate", "check resource"], skepticism=0.65, energy_discipline=0.8),
            create_record("Graph Agent", "graph", ["rewire graph", "detect hub"], abstraction_bias=0.72),
        ]
        return [
            TheoremAgent(records[0]),
            CriticAgent(records[1]),
            OptimizerAgent(records[2]),
            ExplorerAgent(records[3]),
            CompressionAgent(records[4]),
            MutationAgent(records[5]),
            PhysicsAgent(records[6]),
            GraphAgent(records[7]),
        ]

    def _seed_theorems(self) -> None:
        for theorem in starter_theorems():
            self.theorem_engine.archive[theorem.id] = theorem
            self.memory.archive_theorem(theorem)
            self.memory.remember("starter_theorem", theorem.statement, theorem.score, theorem.created_by)

    def tick(self) -> TickReport:
        self.tick_index += 1
        self.reality.reset_tick()
        events: list[str] = []
        accepted = 0
        rejected = 0
        feedback: dict[str, float] = {}
        current_theorem: Theorem | None = None
        current_evaluation: Evaluation | None = None

        for agent in list(self.agents):
            context = self._context(current_theorem, current_evaluation)
            packet = agent.act(context)
            kind = packet["type"]
            if kind == "exploration":
                self.concepts = list(dict.fromkeys(self.concepts + packet["concepts"]))[-16:]
                events.append(f"{agent.name} expanded concepts.")
                feedback[agent.record.id] = 0.58
            elif kind == "theorem":
                current_theorem = packet["theorem"]
                self.memory.remember("theorem_proposal", current_theorem.statement, 0.55, agent.name)
                events.append(f"{agent.name} proposed {current_theorem.statement!r}.")
                feedback[agent.record.id] = 0.52
            elif kind == "critique" and packet.get("theorem"):
                current_evaluation = packet["evaluation"]
                theorem = packet["theorem"]
                self.memory.archive_theorem(theorem)
                if current_evaluation.accepted:
                    accepted += 1
                    self.memory.remember("accepted_theorem", theorem.statement, current_evaluation.score, agent.name)
                else:
                    rejected += 1
                    self.memory.remember("failed_attempt", theorem.statement, 0.25, agent.name)
                events.append(f"{agent.name} reality-gated theorem score={current_evaluation.score:.2f}.")
                feedback[agent.record.id] = current_evaluation.score
            elif kind == "optimization":
                feedback[agent.record.id] = packet["score"]
                events.append(f"{agent.name} optimized score={packet['score']:.2f}.")
            elif kind == "compression":
                self.memory.remember("compressed_memory", packet["compressed"], packet["score"], agent.name)
                feedback[agent.record.id] = packet["score"]
                events.append(f"{agent.name} compressed memory score={packet['score']:.2f}.")
            elif kind == "mutation" and packet.get("mutant"):
                mutant = packet["mutant"]
                evaluation = self.reality.validate(mutant, self.theorem_engine.proof_search(mutant))
                self.memory.archive_theorem(mutant)
                feedback[agent.record.id] = evaluation.score
                events.append(f"{agent.name} produced mutant score={evaluation.score:.2f}.")
            elif kind == "physics" and packet.get("result"):
                result = packet["result"]
                feedback[agent.record.id] = result.score
                events.append(f"{agent.name} ran {result.name} score={result.score:.2f}.")
            elif kind == "graph":
                feedback[agent.record.id] = min(1.0, 0.45 + 0.05 * len(packet["hubs"]))
                events.append(f"{agent.name} reorganized graph hubs={len(packet['hubs'])}.")

        self._evolve_agents(feedback)
        best = max((agent.record.fitness for agent in self.agents), default=0.0)
        return TickReport(self.tick_index, accepted, rejected, len(self.agents), best, events)

    def run(self, ticks: int = 5) -> list[TickReport]:
        return [self.tick() for _ in range(ticks)]

    def _context(self, theorem: Theorem | None, evaluation: Evaluation | None) -> dict:
        return {
            "concepts": self.concepts,
            "current_theorem": theorem,
            "current_evaluation": evaluation,
            "entropy": self.entropy,
            "theorem_engine": self.theorem_engine,
            "optimizer": self.optimizer,
            "mutation": self.mutation,
            "simulation": self.simulation,
            "reality": self.reality,
            "memory": self.memory,
        }

    def _evolve_agents(self, feedback: dict[str, float]) -> None:
        records = self.evolution.update_population([agent.record for agent in self.agents], feedback)
        class_by_role = {
            "theorem": TheoremAgent,
            "critic": CriticAgent,
            "optimizer": OptimizerAgent,
            "explorer": ExplorerAgent,
            "compression": CompressionAgent,
            "mutation": MutationAgent,
            "physics": PhysicsAgent,
            "graph": GraphAgent,
        }
        self.agents = [class_by_role.get(record.genome.role, ExplorerAgent)(record) for record in records]
