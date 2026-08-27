from __future__ import annotations

from math import sqrt


class VectorMemory:
    """Tiny dependency-free vector memory. Replace with FAISS when installed."""

    def __init__(self) -> None:
        self.vectors: dict[str, list[float]] = {}
        self.payloads: dict[str, str] = {}

    def embed_text(self, text: str, dims: int = 16) -> list[float]:
        vec = [0.0] * dims
        for index, char in enumerate(text):
            vec[index % dims] += (ord(char) % 31) / 31.0
        norm = sqrt(sum(v * v for v in vec)) or 1.0
        return [v / norm for v in vec]

    def add(self, key: str, text: str) -> None:
        self.vectors[key] = self.embed_text(text)
        self.payloads[key] = text

    def search(self, text: str, top_k: int = 5) -> list[tuple[str, float, str]]:
        query = self.embed_text(text)
        scored = []
        for key, vector in self.vectors.items():
            score = sum(a * b for a, b in zip(query, vector))
            scored.append((key, score, self.payloads[key]))
        return sorted(scored, key=lambda item: item[1], reverse=True)[:top_k]
