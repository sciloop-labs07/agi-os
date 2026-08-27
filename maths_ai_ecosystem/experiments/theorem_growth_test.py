from maths_ai_ecosystem.core.engine import MathsAIEngine


if __name__ == "__main__":
    engine = MathsAIEngine()
    engine.run(10)
    print(f"theorem_count={len(engine.runtime.theorem_engine.archive)}")
