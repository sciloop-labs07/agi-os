from __future__ import annotations

from dataclasses import dataclass, field

from .agent_runtime import TickReport


@dataclass(slots=True)
class MetricsFrame:
    tick: int
    entropy: float
    theorem_count: int
    graph_complexity: int
    compression_ratio: float
    mutation_diversity: float
    mean_agent_fitness: float
    stability: float
    emergence_indicator: float
    recursive_depth: int
    knowledge_density: float


class MetricsRecorder:
    """Tracks ecosystem-level emergence signals over time."""

    def __init__(self) -> None:
        self.frames: list[MetricsFrame] = []

    def record(self, runtime, report: TickReport) -> MetricsFrame:
        agent_fitness = [agent.record.fitness for agent in runtime.agents]
        theorem_count = len(runtime.theorem_engine.archive)
        graph_complexity = sum(len(targets) for targets in runtime.memory.graph.edges.values())
        memory_items = runtime.memory.recent(200)
        entropy = sum(item.entropy for item in memory_items) / max(1, len(memory_items))
        mean_fitness = sum(agent_fitness) / max(1, len(agent_fitness))
        mutation_diversity = len({agent.record.parent_id for agent in runtime.agents if agent.record.parent_id}) / max(1, len(runtime.agents))
        compression_ratio = len(runtime.memory.compressed_summary()) / max(1, len(memory_items))
        stability = 1.0 - min(1.0, abs(report.best_fitness - mean_fitness))
        emergence = 0.25 * mean_fitness + 0.25 * compression_ratio + 0.25 * min(1.0, theorem_count / 20) + 0.25 * stability
        frame = MetricsFrame(
            tick=report.tick,
            entropy=entropy,
            theorem_count=theorem_count,
            graph_complexity=graph_complexity,
            compression_ratio=compression_ratio,
            mutation_diversity=mutation_diversity,
            mean_agent_fitness=mean_fitness,
            stability=stability,
            emergence_indicator=emergence,
            recursive_depth=runtime.config.max_recursion_depth,
            knowledge_density=len(memory_items) / max(1, graph_complexity + 1),
        )
        self.frames.append(frame)
        return frame
