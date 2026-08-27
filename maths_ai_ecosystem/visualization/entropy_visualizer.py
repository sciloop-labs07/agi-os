from __future__ import annotations

from pathlib import Path


def render_entropy_csv(frames, output_path: Path) -> Path:
    lines = ["tick,entropy,compression_ratio,knowledge_density"]
    lines += [f"{frame.tick},{frame.entropy},{frame.compression_ratio},{frame.knowledge_density}" for frame in frames]
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines), encoding="utf-8")
    return output_path
