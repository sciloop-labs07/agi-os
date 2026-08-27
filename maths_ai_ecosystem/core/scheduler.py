from __future__ import annotations

from dataclasses import dataclass
from typing import Callable


@dataclass(slots=True)
class ScheduledTask:
    name: str
    every_ticks: int
    callback: Callable[[int], None]


class Scheduler:
    """Tick scheduler for compression, visualization, memory decay, and audits."""

    def __init__(self) -> None:
        self.tasks: list[ScheduledTask] = []

    def every(self, ticks: int, name: str, callback: Callable[[int], None]) -> None:
        self.tasks.append(ScheduledTask(name=name, every_ticks=max(1, ticks), callback=callback))

    def run_due(self, tick: int) -> None:
        for task in self.tasks:
            if tick % task.every_ticks == 0:
                task.callback(tick)
