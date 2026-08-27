from maths_ai_ecosystem.config import DEFAULT_CONFIG
from maths_ai_ecosystem.core.agent_runtime import AgentRuntime


def run_experiment(ticks: int = 20):
    runtime = AgentRuntime(DEFAULT_CONFIG)
    return runtime.run(ticks)


if __name__ == "__main__":
    for report in run_experiment(20):
        print(report)
