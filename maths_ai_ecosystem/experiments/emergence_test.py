from maths_ai_ecosystem.core.engine import MathsAIEngine


def run(ticks: int = 16):
    engine = MathsAIEngine()
    reports = engine.run(ticks)
    return engine.loop.metrics.frames[-1].emergence_indicator, reports


if __name__ == "__main__":
    score, _ = run()
    print(f"emergence_indicator={score:.3f}")
