from __future__ import annotations

import html
import json
from dataclasses import asdict
from pathlib import Path


class Dashboard:
    """Dependency-light live dashboard renderer.

    If Plotly is installed later, this can be swapped for real-time plots. The
    MVP writes an HTML dashboard that opens directly in a browser.
    """

    def render(self, runtime, reports, frames, output_path: Path) -> Path:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        data = {
            "reports": [asdict(report) for report in reports],
            "metrics": [asdict(frame) for frame in frames],
            "agents": [agent.self_model() for agent in runtime.agents],
            "memory_hubs": runtime.memory.compressed_summary(),
        }
        rows = "\n".join(
            f"<tr><td>{frame.tick}</td><td>{frame.theorem_count}</td><td>{frame.graph_complexity}</td>"
            f"<td>{frame.entropy:.2f}</td><td>{frame.emergence_indicator:.2f}</td></tr>"
            for frame in frames
        )
        agent_cards = "\n".join(
            f"<div class='card'><b>{html.escape(agent['name'])}</b><span>{agent['role']} | fitness={agent['fitness']:.2f}</span></div>"
            for agent in data["agents"]
        )
        output_path.write_text(
            f"""<!doctype html>
<html><head><meta charset='utf-8'><title>Maths-AI Dashboard</title>
<style>
body{{margin:0;background:#05070d;color:#e5f7ff;font-family:Inter,system-ui,sans-serif;padding:28px}}
h1{{font-size:42px}} .grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}}
.card{{border:1px solid rgba(72,229,255,.25);background:rgba(72,229,255,.08);border-radius:8px;padding:14px}}
.card span{{display:block;color:#9fb0c2;margin-top:8px}} table{{width:100%;border-collapse:collapse;margin-top:24px}}
td,th{{border-bottom:1px solid rgba(255,255,255,.12);padding:10px;text-align:left}} code{{color:#b6ff61}}
</style></head><body>
<h1>Maths-AI Ecosystem Dashboard</h1>
<p>Agents, theorem growth, graph complexity, entropy flow, and emergence indicators.</p>
<section class='grid'>{agent_cards}</section>
<table><thead><tr><th>Tick</th><th>Theorems</th><th>Graph complexity</th><th>Entropy</th><th>Emergence</th></tr></thead><tbody>{rows}</tbody></table>
<h2>Raw Snapshot</h2><pre><code>{html.escape(json.dumps(data, indent=2))}</code></pre>
</body></html>""",
            encoding="utf-8",
        )
        return output_path
