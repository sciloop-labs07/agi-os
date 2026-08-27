from maths_ai_ecosystem.core.recursion_engine import RecursionEngine


if __name__ == "__main__":
    engine = RecursionEngine(max_depth=4)
    for line in engine.recursive_reflect("recursion recursion compression prediction prediction"):
        print(line)
