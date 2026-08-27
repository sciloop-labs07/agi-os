from __future__ import annotations

from maths_ai_ecosystem.core.types import ClaimStatus, Theorem


def starter_theorems() -> list[Theorem]:
    seeds = [
        ("a + b = b + a", "commutativity"),
        ("(a + b) + c = a + (b + c)", "associativity"),
        ("f(f(x))", "recursive form"),
        ("compress(x) implies shorter_description(x)", "compression identity"),
        ("A and (A -> B) implies B", "modus ponens"),
        ("graph_rewire(G) can create hub(G)", "graph transform"),
    ]
    return [
        Theorem(
            statement=statement,
            assumptions=[label],
            proof_sketch=["Seed theorem.", "Preserve as initial symbolic structure."],
            status=ClaimStatus.ACCEPTED,
            confidence=0.8,
            score=0.8,
            created_by="seed",
        )
        for statement, label in seeds
    ]
