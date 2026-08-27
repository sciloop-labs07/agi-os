import unittest

from maths_ai_ecosystem.math_core.information_theory import EntropyEngine


class EntropyTests(unittest.TestCase):
    def test_information_gain(self) -> None:
        engine = EntropyEngine()
        self.assertEqual(engine.information_gain(2.0, 1.0), 1.0)


if __name__ == "__main__":
    unittest.main()
