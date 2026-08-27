class TransformationGraph:
    """Tiny category-inspired object-transform mapping prototype."""

    def __init__(self) -> None:
        self.morphisms: dict[tuple[str, str], str] = {}

    def add_mapping(self, source: str, target: str, transform: str) -> None:
        self.morphisms[(source, target)] = transform

    def compose(self, a: str, b: str, c: str) -> str | None:
        first = self.morphisms.get((a, b))
        second = self.morphisms.get((b, c))
        if first and second:
            return f"{second} o {first}"
        return None
