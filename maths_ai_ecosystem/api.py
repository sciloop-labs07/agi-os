from __future__ import annotations

"""Optional FastAPI entrypoint.

Install `requirements.txt` to run:
    uvicorn maths_ai_ecosystem.api:app --reload
"""

try:
    from fastapi import FastAPI
except Exception:  # pragma: no cover - optional dependency
    FastAPI = None

from maths_ai_ecosystem.config import DEFAULT_CONFIG
from maths_ai_ecosystem.core.agent_runtime import AgentRuntime
from maths_ai_ecosystem.verified_mode import ExperimentConfig, ExperimentLimits, run_experiment


if FastAPI is not None:
    app = FastAPI(title="Maths-AI Ecosystem")
    runtime = AgentRuntime(DEFAULT_CONFIG)

    @app.get("/status")
    def status():
        return {"agents": len(runtime.agents), "concepts": runtime.concepts}

    @app.post("/tick")
    def tick():
        report = runtime.tick()
        return {
            "tick": report.tick,
            "accepted_theorems": report.accepted_theorems,
            "rejected_theorems": report.rejected_theorems,
            "agent_count": report.agent_count,
            "best_fitness": report.best_fitness,
            "events": report.events,
        }

    @app.post("/verified-experiment")
    def verified_experiment(seed: int = 17, domain: str = "all", max_candidates: int = 6):
        if domain not in {"all", "boolean", "algebra", "graph"}:
            return {"error": "Unsupported benchmark domain."}
        limits = ExperimentLimits(max_candidates=max(1, min(max_candidates, 12)))
        return run_experiment(ExperimentConfig(seed=seed, domain=domain, limits=limits))
else:
    app = None
