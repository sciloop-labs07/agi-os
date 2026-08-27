from __future__ import annotations


class SemanticMemory:
    def __init__(self) -> None:
        self.facts: dict[str, set[str]] = {}

    def add_fact(self, concept: str, fact: str) -> None:
        self.facts.setdefault(concept, set()).add(fact)

    def query(self, concept: str) -> list[str]:
        return sorted(self.facts.get(concept, set()))

    def concepts(self) -> list[str]:
        return sorted(self.facts)
