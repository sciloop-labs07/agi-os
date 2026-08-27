from __future__ import annotations

from maths_ai_ecosystem.core.entropy_engine import EntropyEngine


class CompressedMemory:
    def __init__(self) -> None:
        self.entropy = EntropyEngine()
        self.summaries: list[tuple[str, float]] = []

    def compress(self, texts: list[str]) -> tuple[str, float]:
        original = " ".join(texts)
        compressed = " ".join(dict.fromkeys(original.split()))
        score = self.entropy.compression_score(original, compressed)
        self.summaries.append((compressed, score))
        return compressed, score
