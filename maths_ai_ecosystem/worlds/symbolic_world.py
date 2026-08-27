from __future__ import annotations


class SymbolicWorld:
    def __init__(self) -> None:
        self.concepts = ["recursion", "compression", "prediction", "graph", "energy"]

    def observe(self) -> list[str]:
        return list(self.concepts)

    def introduce(self, concept: str) -> None:
        if concept not in self.concepts:
            self.concepts.append(concept)
