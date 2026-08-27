import unittest

from maths_ai_ecosystem.core.starter_theorems import starter_theorems
from maths_ai_ecosystem.core.theorem_engine import TheoremEngine


class TheoremEngineTests(unittest.TestCase):
    def test_starter_theorems_exist(self) -> None:
        statements = [theorem.statement for theorem in starter_theorems()]
        self.assertIn("a + b = b + a", statements)
        self.assertIn("f(f(x))", statements)

    def test_mutable_theorem_generation(self) -> None:
        engine = TheoremEngine(seed=2)
        theorem = engine.generate("tester", ["graph", "compression"])
        result = engine.proof_search(theorem)
        self.assertGreaterEqual(result.score, 0.0)


if __name__ == "__main__":
    unittest.main()
