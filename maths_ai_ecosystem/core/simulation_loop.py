from __future__ import annotations

from .agent_runtime import AgentRuntime, TickReport
from .event_bus import EventBus
from .metrics import MetricsRecorder
from .scheduler import Scheduler
from .stability_engine import StabilityEngine


class SimulationLoop:
    """Continuous loop matching the observe/reason/exchange/critique/compress/mutate cycle."""

    def __init__(self, runtime: AgentRuntime) -> None:
        self.runtime = runtime
        self.bus = EventBus()
        self.scheduler = Scheduler()
        self.metrics = MetricsRecorder()
        self.stability = StabilityEngine()
        self.fitness_trajectory: list[float] = []

    def step(self) -> TickReport:
        self.bus.publish("agents.observe", {"concepts": self.runtime.concepts})
        report = self.runtime.tick()
        self.fitness_trajectory.append(report.best_fitness)
        frame = self.metrics.record(self.runtime, report)
        stability = self.stability.check(self.fitness_trajectory, self.runtime.config.max_recursion_depth, self.runtime.config.max_recursion_depth)
        self.bus.publish("metrics.record", {"frame": frame})
        self.bus.publish("stability.check", {"stable": stability.stable, "warnings": stability.warnings})
        self.scheduler.run_due(report.tick)
        return report

    def run(self, ticks: int) -> list[TickReport]:
        return [self.step() for _ in range(ticks)]
