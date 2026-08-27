from __future__ import annotations

from pathlib import Path


def render_graph_text(graph, output_path: Path) -> Path:
    lines = ["# Graph Evolution"]
    for source, targets in graph.edges.items():
        for target, weight in targets.items():
            lines.append(f"{source} -> {target} [weight={weight:.2f}]")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines), encoding="utf-8")
    return output_path
