from __future__ import annotations


class RecursionEngine:
    """Reflective analysis and fixed-point stabilization guard."""

    def __init__(self, max_depth: int = 4) -> None:
        self.max_depth = max_depth

    def recursive_reflect(self, seed: str, depth: int = 0) -> list[str]:
        if depth >= self.max_depth:
            return [f"fixed-point guard reached at depth={depth}: {seed}"]
        compressed = " ".join(dict.fromkeys(seed.split()))
        return [f"depth={depth}: {compressed}"] + self.recursive_reflect(compressed, depth + 1)

    def stable_fixed_point(self, trajectory: list[str]) -> bool:
        return len(trajectory) >= 2 and trajectory[-1] == trajectory[-2]
