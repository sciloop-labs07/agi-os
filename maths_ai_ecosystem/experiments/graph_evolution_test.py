from maths_ai_ecosystem.memory.graph_memory import GraphMemory


if __name__ == "__main__":
    memory = GraphMemory()
    for concept in ["recursion", "compression", "prediction"]:
        memory.add_concept(concept)
    memory.relate("recursion", "compression", 0.8)
    memory.relate("compression", "prediction", 0.7)
    memory.evolve()
    print(memory.emergent_hubs())
