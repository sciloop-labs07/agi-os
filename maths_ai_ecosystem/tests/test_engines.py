from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from maths_ai_ecosystem.config import EcosystemConfig
from maths_ai_ecosystem.core.agent_runtime import AgentRuntime
from maths_ai_ecosystem.core.entropy_engine import EntropyEngine
from maths_ai_ecosystem.core.logic_engine import LogicEngine
from maths_ai_ecosystem.core.theorem_engine import TheoremEngine


class EngineTests(unittest.TestCase):
    def test_entropy_and_compression(self) -> None:
        engine = EntropyEngine()
        self.assertGreater(engine.shannon_entropy("abcabc"), 0)
        self.assertGreaterEqual(engine.compression_score("a b a b a b", "a b"), 0)

    def test_contradiction_detection(self) -> None:
        logic = LogicEngine()
        contradictions = logic.detect_contradictions(["A exists", "not a exists"])
        self.assertTrue(contradictions)

    def test_theorem_generation_and_evaluation(self) -> None:
        engine = TheoremEngine(seed=1)
        theorem = engine.generate("tester", ["compression", "recursion"])
        evaluation = engine.proof_search(theorem)
        self.assertGreaterEqual(evaluation.score, 0)
        self.assertIn(theorem.status.value, {"accepted", "rejected"})

    def test_runtime_evolves(self) -> None:
        with TemporaryDirectory(ignore_cleanup_errors=True) as tmp:
            config = EcosystemConfig(database_path=Path(tmp) / "test.sqlite", max_agents=12)
            runtime = AgentRuntime(config)
            reports = runtime.run(ticks=3)
            self.assertEqual(len(reports), 3)
            self.assertGreaterEqual(reports[-1].agent_count, 1)


if __name__ == "__main__":
    unittest.main()
