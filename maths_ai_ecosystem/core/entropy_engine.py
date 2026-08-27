from __future__ import annotations

from collections import Counter
from math import log2


class EntropyEngine:
    """Information-theoretic pressure for memory, theorem, and mutation survival."""

    def shannon_entropy(self, symbols: list[str] | str) -> float:
        tokens = list(symbols) if isinstance(symbols, str) else symbols
        if not tokens:
            return 0.0
        counts = Counter(tokens)
        total = len(tokens)
        return -sum((count / total) * log2(count / total) for count in counts.values())

    def mutual_information(self, xs: list[str], ys: list[str]) -> float:
        if not xs or not ys or len(xs) != len(ys):
            return 0.0
        h_x = self.shannon_entropy(xs)
        h_y = self.shannon_entropy(ys)
        joint = [f"{x}|{y}" for x, y in zip(xs, ys)]
        h_xy = self.shannon_entropy(joint)
        return max(0.0, h_x + h_y - h_xy)

    def information_gain(self, prior_entropy: float, posterior_entropy: float) -> float:
        return max(0.0, prior_entropy - posterior_entropy)

    def kolmogorov_proxy(self, text: str) -> float:
        """Approximate Kolmogorov complexity with dictionary compression intuition."""
        if not text:
            return 0.0
        tokens = text.replace("(", " ").replace(")", " ").replace(",", " ").split()
        unique_ratio = len(set(tokens)) / max(1, len(tokens))
        entropy = self.shannon_entropy(text)
        return 0.55 * entropy + 0.45 * unique_ratio * log2(len(text) + 1)

    def minimum_description_length(self, model_bits: float, error_bits: float) -> float:
        return model_bits + error_bits

    def compression_score(self, original: str, compressed: str) -> float:
        if not original:
            return 0.0
        gain = max(0, len(original) - len(compressed))
        predictive_bonus = len(set(compressed.split())) / max(1, len(set(original.split())))
        return min(1.0, gain / len(original) + 0.2 * predictive_bonus)
