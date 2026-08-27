def connected_components(edges: list[tuple[str, str]]) -> list[set[str]]:
    graph: dict[str, set[str]] = {}
    for a, b in edges:
        graph.setdefault(a, set()).add(b)
        graph.setdefault(b, set()).add(a)
    seen: set[str] = set()
    components: list[set[str]] = []
    for node in graph:
        if node in seen:
            continue
        stack = [node]
        component: set[str] = set()
        while stack:
            current = stack.pop()
            if current in seen:
                continue
            seen.add(current)
            component.add(current)
            stack.extend(graph.get(current, set()) - seen)
        components.append(component)
    return components
