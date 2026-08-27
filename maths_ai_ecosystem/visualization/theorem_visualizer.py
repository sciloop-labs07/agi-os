from __future__ import annotations

from pathlib import Path


def render_theorem_tree(theorems, output_path: Path) -> Path:
    lines = ["# Theorem Evolution"]
    for theorem in theorems:
        parents = ",".join(theorem.parent_ids) if theorem.parent_ids else "root"
        lines.append(f"- {theorem.id} [{theorem.status.value} score={theorem.score:.2f}] parents={parents}: {theorem.statement}")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines), encoding="utf-8")
    return output_path
