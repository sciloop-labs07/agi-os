def halting_risk_proxy(program_text: str) -> float:
    """Crude guard for runaway loops in generated code."""
    risky = ["while True", "for (;;)", "recursive_reflect("]
    return min(1.0, sum(token in program_text for token in risky) * 0.4)
