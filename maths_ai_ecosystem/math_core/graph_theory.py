from maths_ai_ecosystem.core.graph_engine import GraphEngine


def centrality_scores(graph: GraphEngine) -> dict[str, float]:
    degree: dict[str, float] = {node: 0.0 for node in graph.nodes}
    for source, targets in graph.edges.items():
        degree[source] = degree.get(source, 0.0) + len(targets)
        for target, weight in targets.items():
            degree[target] = degree.get(target, 0.0) + weight
    max_degree = max(degree.values(), default=1.0) or 1.0
    return {node: value / max_degree for node, value in degree.items()}
