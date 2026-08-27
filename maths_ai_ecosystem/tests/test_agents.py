import unittest

from maths_ai_ecosystem.config import EcosystemConfig
from maths_ai_ecosystem.core.agent_runtime import AgentRuntime


class AgentTests(unittest.TestCase):
    def test_runtime_has_required_agents(self) -> None:
        runtime = AgentRuntime(EcosystemConfig())
        names = {agent.name for agent in runtime.agents}
        self.assertIn("Theorem Agent", names)
        self.assertIn("Critic Agent", names)
        self.assertIn("Graph Agent", names)


if __name__ == "__main__":
    unittest.main()
