from __future__ import annotations

from dataclasses import dataclass, field
from time import time


@dataclass(slots=True)
class Episode:
    event: str
    source: str
    importance: float
    created_at: float = field(default_factory=time)


class EpisodicMemory:
    def __init__(self, decay_rate: float = 0.02) -> None:
        self.decay_rate = decay_rate
        self.episodes: list[Episode] = []

    def add(self, event: str, source: str, importance: float = 0.5) -> None:
        self.episodes.append(Episode(event, source, importance))

    def decay(self) -> None:
        for episode in self.episodes:
            episode.importance *= 1.0 - self.decay_rate
        self.episodes = [episode for episode in self.episodes if episode.importance > 0.05]
