from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass, field
from time import time
from typing import Any, Callable


@dataclass(slots=True)
class Event:
    kind: str
    payload: dict[str, Any]
    source: str = "system"
    created_at: float = field(default_factory=time)


class EventBus:
    """Small synchronous event bus for agent/world/memory interactions."""

    def __init__(self) -> None:
        self.events: list[Event] = []
        self.subscribers: dict[str, list[Callable[[Event], None]]] = defaultdict(list)

    def publish(self, kind: str, payload: dict[str, Any], source: str = "system") -> Event:
        event = Event(kind=kind, payload=payload, source=source)
        self.events.append(event)
        for handler in self.subscribers.get(kind, []):
            handler(event)
        return event

    def subscribe(self, kind: str, handler: Callable[[Event], None]) -> None:
        self.subscribers[kind].append(handler)

    def recent(self, limit: int = 50) -> list[Event]:
        return self.events[-limit:]
