import unittest

from maths_ai_ecosystem.memory.graph_memory import GraphMemory


class GraphMemoryTests(unittest.TestCase):
    def test_hub_discovery(self) -> None:
        memory = GraphMemory()
        memory.add_concept("recursion")
        memory.add_concept("compression")
        memory.relate("recursion", "compression", 0.9)
        self.assertTrue(memory.emergent_hubs())


if __name__ == "__main__":
    unittest.main()
