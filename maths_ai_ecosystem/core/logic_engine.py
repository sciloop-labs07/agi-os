from __future__ import annotations

import ast
import operator
from dataclasses import dataclass


@dataclass(slots=True)
class LogicResult:
    valid: bool
    reasons: list[str]
    contradictions: list[str]


class LogicEngine:
    """Small symbolic logic layer for consistency and propositional testing."""

    allowed_ops = {
        ast.And: all,
        ast.Or: any,
        ast.Not: operator.not_,
        ast.Eq: operator.eq,
        ast.NotEq: operator.ne,
        ast.Gt: operator.gt,
        ast.GtE: operator.ge,
        ast.Lt: operator.lt,
        ast.LtE: operator.le,
    }

    def detect_contradictions(self, statements: list[str]) -> list[str]:
        normalized = {item.strip().lower() for item in statements}
        contradictions: list[str] = []
        for statement in normalized:
            if statement.startswith("not "):
                positive = statement[4:]
                if positive in normalized:
                    contradictions.append(f"{positive} contradicts {statement}")
            else:
                if f"not {statement}" in normalized:
                    contradictions.append(f"{statement} contradicts not {statement}")
        return sorted(set(contradictions))

    def consistency_score(self, statements: list[str]) -> float:
        contradictions = self.detect_contradictions(statements)
        return max(0.0, 1.0 - len(contradictions) / max(1, len(statements)))

    def validate_implication(self, assumptions: list[str], conclusion: str) -> LogicResult:
        contradictions = self.detect_contradictions(assumptions + [conclusion])
        reasons = []
        valid = not contradictions
        if valid:
            reasons.append("No direct symbolic contradiction detected.")
        else:
            reasons.extend(contradictions)
        if conclusion in assumptions:
            reasons.append("Conclusion is directly contained in assumptions.")
            valid = True
        return LogicResult(valid=valid, reasons=reasons, contradictions=contradictions)
