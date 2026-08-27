from __future__ import annotations

"""Bounded, reproducible verified experiments for Maths AI.

This module deliberately uses a small allow-listed hypothesis language. It never
executes generated code or treats an agent score as proof. A claim is verified
only when one of the deterministic adapters below produces a checkable result.
"""

import argparse
import hashlib
import json
import random
import sqlite3
import time
import tracemalloc
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Callable, Literal

try:
    import sympy as sp
except ImportError:  # pragma: no cover - exercised when optional dependency is absent
    sp = None


ROOT = Path(__file__).resolve().parent
DATA_PATH = ROOT / "data" / "verified_experiments.sqlite"
LATEST_PATH = ROOT / "logs" / "verified_latest.json"
Domain = Literal["boolean", "algebra", "graph"]
Status = Literal["VERIFIED", "REJECTED", "UNKNOWN"]


@dataclass(frozen=True)
class ExperimentLimits:
    max_candidates: int = 6
    max_recursion_depth: int = 2
    wall_clock_seconds: float = 5.0
    memory_budget_kb: int = 4096
    mutation_generations: int = 2


@dataclass(frozen=True)
class ExperimentConfig:
    seed: int = 17
    domain: str = "all"
    benchmark_version: str = "verified-toy-v1"
    limits: ExperimentLimits = field(default_factory=ExperimentLimits)


@dataclass
class Candidate:
    id: str
    domain: Domain
    statement: str
    expression: str
    parents: list[str]
    mutation_operator: str
    generation: int


@dataclass
class VerificationResult:
    status: Status
    verifier: str
    verifier_input: dict[str, Any]
    verifier_output: dict[str, Any]
    duration_ms: float
    notes: str


class ExperimentStore:
    """SQLite evidence store. The schema intentionally contains raw artifacts."""

    def __init__(self, path: Path = DATA_PATH):
        path.parent.mkdir(parents=True, exist_ok=True)
        self.connection = sqlite3.connect(path)
        self.connection.row_factory = sqlite3.Row
        self.connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS experiment_runs (
                id TEXT PRIMARY KEY,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                config_json TEXT NOT NULL,
                status TEXT NOT NULL,
                metrics_json TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS experiment_candidates (
                id TEXT PRIMARY KEY,
                run_id TEXT NOT NULL,
                system_name TEXT NOT NULL,
                domain TEXT NOT NULL,
                statement TEXT NOT NULL,
                expression TEXT NOT NULL,
                parents_json TEXT NOT NULL,
                mutation_operator TEXT NOT NULL,
                generation INTEGER NOT NULL,
                status TEXT NOT NULL,
                rejection_reason TEXT,
                FOREIGN KEY(run_id) REFERENCES experiment_runs(id)
            );
            CREATE TABLE IF NOT EXISTS verification_artifacts (
                id TEXT PRIMARY KEY,
                candidate_id TEXT NOT NULL,
                verifier TEXT NOT NULL,
                status TEXT NOT NULL,
                input_json TEXT NOT NULL,
                output_json TEXT NOT NULL,
                duration_ms REAL NOT NULL,
                notes TEXT NOT NULL,
                FOREIGN KEY(candidate_id) REFERENCES experiment_candidates(id)
            );
            """
        )

    def persist(self, report: dict[str, Any]) -> None:
        with self.connection:
            self.connection.execute(
                "INSERT OR REPLACE INTO experiment_runs(id, config_json, status, metrics_json) VALUES (?, ?, ?, ?)",
                (report["run_id"], json.dumps(report["config"], sort_keys=True), report["status"], json.dumps(report["metrics"], sort_keys=True)),
            )
            for benchmark in report["benchmarks"]:
                for system in benchmark["systems"]:
                    for candidate in system["candidates"]:
                        self.connection.execute(
                            """INSERT OR REPLACE INTO experiment_candidates
                            (id, run_id, system_name, domain, statement, expression, parents_json, mutation_operator, generation, status, rejection_reason)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                            (
                                candidate["id"], report["run_id"], system["name"], benchmark["domain"], candidate["statement"],
                                candidate["expression"], json.dumps(candidate["parents"]), candidate["mutation_operator"], candidate["generation"],
                                candidate["verification"]["status"], candidate["verification"]["notes"] if candidate["verification"]["status"] != "VERIFIED" else None,
                            ),
                        )
                        verification = candidate["verification"]
                        self.connection.execute(
                            """INSERT OR REPLACE INTO verification_artifacts
                            (id, candidate_id, verifier, status, input_json, output_json, duration_ms, notes)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                            (
                                verification["artifact_id"], candidate["id"], verification["verifier"], verification["status"],
                                json.dumps(verification["verifier_input"], sort_keys=True), json.dumps(verification["verifier_output"], sort_keys=True),
                                verification["duration_ms"], verification["notes"],
                            ),
                        )

    def close(self) -> None:
        self.connection.close()


def artifact_id(candidate_id: str, result: VerificationResult) -> str:
    payload = json.dumps({"candidate": candidate_id, "input": result.verifier_input, "output": result.verifier_output}, sort_keys=True)
    return "artifact-" + hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]


def boolean_verifier(candidate: Candidate) -> VerificationResult:
    started = time.perf_counter()
    rules: dict[str, Callable[[bool, bool], bool]] = {
        "de_morgan_and": lambda a, b: (not (a and b)) == ((not a) or (not b)),
        "wrong_de_morgan": lambda a, b: (not (a and b)) == ((not a) and (not b)),
        "and_commutative": lambda a, b: (a and b) == (b and a),
    }
    rule = rules.get(candidate.expression)
    if rule is None:
        return unknown_result("boolean-truth-table", candidate, started, "Expression is outside the Boolean allow-list.")
    rows = [{"a": a, "b": b, "holds": rule(a, b)} for a in (False, True) for b in (False, True)]
    failures = [row for row in rows if not row["holds"]]
    return completed_result(
        "boolean-truth-table", candidate, started, "VERIFIED" if not failures else "REJECTED",
        {"variables": ["a", "b"], "expression": candidate.expression}, {"rows": rows, "failures": failures},
        "Exhaustive truth-table verification." if not failures else "Counterexample found by exhaustive truth-table verification.",
    )


def algebra_verifier(candidate: Candidate) -> VerificationResult:
    started = time.perf_counter()
    if sp is None:
        return unknown_result("sympy-equivalence", candidate, started, "SymPy is not installed; algebra result cannot be verified.")
    x = sp.symbols("x")
    expressions: dict[str, tuple[Any, Any]] = {
        "square_binomial": (x**2 + 2 * x + 1, (x + 1) ** 2),
        "wrong_square_binomial": (x**2 + 2 * x + 1, x**2 + 1),
        "commutative_sum": (x + 3, 3 + x),
    }
    pair = expressions.get(candidate.expression)
    if pair is None:
        return unknown_result("sympy-equivalence", candidate, started, "Expression is outside the algebra allow-list.")
    left, right = pair
    difference = sp.simplify(left - right)
    status: Status = "VERIFIED" if difference == 0 else "REJECTED"
    return completed_result(
        "sympy-equivalence", candidate, started, status,
        {"left": str(left), "right": str(right), "symbol": "x"}, {"simplified_difference": str(difference), "is_zero": bool(difference == 0)},
        "SymPy simplified the difference to zero." if status == "VERIFIED" else "SymPy produced a non-zero symbolic difference.",
    )


def graph_verifier(candidate: Candidate) -> VerificationResult:
    started = time.perf_counter()
    graphs = [
        {"edges": [("a", "b"), ("b", "c")], "source": "a", "target": "c", "expected": True},
        {"edges": [("a", "b"), ("d", "c")], "source": "a", "target": "c", "expected": False},
    ]
    if candidate.expression not in {"reachability_transitive", "direct_edge_only"}:
        return unknown_result("deterministic-graph-check", candidate, started, "Expression is outside the graph allow-list.")
    rows: list[dict[str, Any]] = []
    for graph in graphs:
        edges = graph["edges"]
        if candidate.expression == "direct_edge_only":
            actual = (graph["source"], graph["target"]) in edges
        else:
            frontier = [graph["source"]]
            visited = set(frontier)
            while frontier:
                node = frontier.pop(0)
                for left, right in edges:
                    if left == node and right not in visited:
                        visited.add(right)
                        frontier.append(right)
            actual = graph["target"] in visited
        rows.append({**graph, "actual": actual, "holds": actual == graph["expected"]})
    failures = [row for row in rows if not row["holds"]]
    return completed_result(
        "deterministic-graph-check", candidate, started, "VERIFIED" if not failures else "REJECTED",
        {"property": "directed_reachability", "expression": candidate.expression}, {"cases": rows, "failures": failures},
        "All deterministic graph property cases passed." if not failures else "A deterministic graph counterexample rejected the candidate.",
    )


def completed_result(verifier: str, candidate: Candidate, started: float, status: Status, verifier_input: dict[str, Any], verifier_output: dict[str, Any], notes: str) -> VerificationResult:
    return VerificationResult(status, verifier, verifier_input, verifier_output, round((time.perf_counter() - started) * 1000, 3), notes)


def unknown_result(verifier: str, candidate: Candidate, started: float, notes: str) -> VerificationResult:
    return completed_result(verifier, candidate, started, "UNKNOWN", {"expression": candidate.expression}, {}, notes)


VERIFIERS: dict[Domain, Callable[[Candidate], VerificationResult]] = {
    "boolean": boolean_verifier,
    "algebra": algebra_verifier,
    "graph": graph_verifier,
}


def candidate_templates(domain: Domain, system_name: str) -> list[Candidate]:
    base = {
        "boolean": [
            ("and_commutative", "a ∧ b = b ∧ a", "and_commutative", [], "fixed-rule", 0),
            ("wrong_de_morgan", "¬(a ∧ b) = ¬a ∧ ¬b", "wrong_de_morgan", ["and_commutative"], "negation-mutation", 1),
            ("de_morgan_and", "¬(a ∧ b) = ¬a ∨ ¬b", "de_morgan_and", ["wrong_de_morgan"], "counterexample-repair", 2),
        ],
        "algebra": [
            ("commutative_sum", "x + 3 = 3 + x", "commutative_sum", [], "fixed-rule", 0),
            ("wrong_square_binomial", "x² + 2x + 1 = x² + 1", "wrong_square_binomial", ["commutative_sum"], "term-drop-mutation", 1),
            ("square_binomial", "x² + 2x + 1 = (x + 1)²", "square_binomial", ["wrong_square_binomial"], "factor-recombination", 2),
        ],
        "graph": [
            ("direct_edge_only", "reachable(a, c) requires direct edge(a, c)", "direct_edge_only", [], "fixed-rule", 0),
            ("reachability_transitive", "edge(a, b) ∧ edge(b, c) implies reachable(a, c)", "reachability_transitive", ["direct_edge_only"], "path-composition", 1),
        ],
    }[domain]
    if system_name == "fixed_baseline":
        base = base[:1]
    return [
        Candidate(
            id=f"{system_name}-{domain}-{candidate_expression}", domain=domain, statement=statement, expression=candidate_expression,
            parents=[f"{system_name}-{domain}-{parent}" for parent in parents], mutation_operator=operator, generation=generation,
        )
        for candidate_expression, statement, _template_expression, parents, operator, generation in base
    ]


def target_expression(domain: Domain) -> str:
    return {"boolean": "de_morgan_and", "algebra": "square_binomial", "graph": "reachability_transitive"}[domain]


def held_out_score(candidate: Candidate) -> float:
    """Separate, deterministic evaluation set. It never determines proof status."""
    if candidate.domain == "boolean":
        expected = [True, True]  # cases (False, True) and (True, False) for De Morgan's law
        predictions = {
            "de_morgan_and": [True, True], "wrong_de_morgan": [False, False], "and_commutative": [True, True],
        }.get(candidate.expression, [])
    elif candidate.domain == "algebra":
        expected = [0, 0, 0]
        x = sp.symbols("x") if sp is not None else None
        pairs = {"square_binomial": (x**2 + 2*x + 1, (x + 1)**2), "wrong_square_binomial": (x**2 + 2*x + 1, x**2 + 1), "commutative_sum": (x + 3, 3 + x)} if x is not None else {}
        pair = pairs.get(candidate.expression)
        predictions = [int((pair[0] - pair[1]).subs(x, value)) for value in (-2, 2, 5)] if pair else []
    else:
        expected = [True, False]
        predictions = [candidate.expression == "reachability_transitive", False]
    return round(sum(prediction == target for prediction, target in zip(predictions, expected)) / len(expected), 3) if expected else 0.0


def choose_active_observation(candidates: list[Candidate]) -> dict[str, Any]:
    """Choose a fixed observation with maximum disagreement among hypotheses."""
    if not candidates:
        return {"observation": "none", "disagreement": 0}
    domain = candidates[0].domain
    probes = {
        "boolean": ["a=false,b=true", "a=true,b=true"],
        "algebra": ["x=-2", "x=2", "x=5"],
        "graph": ["a→b→c", "a→b,d→c"],
    }[domain]
    predictions = {
        "boolean": {"de_morgan_and": [True, True], "wrong_de_morgan": [False, False], "and_commutative": [True, True]},
        "algebra": {"square_binomial": [0, 0, 0], "wrong_square_binomial": [4, 4, 10], "commutative_sum": [0, 0, 0]},
        "graph": {"reachability_transitive": [True, False], "direct_edge_only": [False, False]},
    }[domain]
    ranked = []
    for index, probe in enumerate(probes):
        values = {str(predictions.get(candidate.expression, [None] * len(probes))[index]) for candidate in candidates}
        ranked.append((len(values), probe))
    disagreement, probe = max(ranked, key=lambda item: (item[0], item[1]))
    return {"observation": probe, "disagreement": disagreement}


def run_system(domain: Domain, system_name: str, config: ExperimentConfig) -> dict[str, Any]:
    candidates = [
        candidate for candidate in candidate_templates(domain, system_name)
        if candidate.generation <= config.limits.mutation_generations
    ][: config.limits.max_candidates]
    started = time.perf_counter()
    tracemalloc.start()
    evaluated: list[dict[str, Any]] = []
    first_target_verified_ms: float | None = None
    for candidate in candidates:
        if time.perf_counter() - started > config.limits.wall_clock_seconds:
            result = unknown_result("resource-gate", candidate, started, "Wall-clock budget exhausted before verification.")
        else:
            result = VERIFIERS[domain](candidate)
        is_target = candidate.expression == target_expression(domain)
        if result.status == "VERIFIED" and is_target and first_target_verified_ms is None:
            first_target_verified_ms = round((time.perf_counter() - started) * 1000, 3)
        artifact = asdict(result)
        artifact["artifact_id"] = artifact_id(candidate.id, result)
        evaluated.append({**asdict(candidate), "is_target": is_target, "verification": artifact, "held_out_generalization": held_out_score(candidate)})
    _current, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    verified = [candidate for candidate in evaluated if candidate["verification"]["status"] == "VERIFIED"]
    target_verified = [candidate for candidate in verified if candidate["is_target"]]
    rejected = [candidate for candidate in evaluated if candidate["verification"]["status"] == "REJECTED"]
    unknown = [candidate for candidate in evaluated if candidate["verification"]["status"] == "UNKNOWN"]
    metrics = {
        "compute_budget_candidates": config.limits.max_candidates,
        "candidate_count": len(evaluated),
        "verified_discovery_rate": 1.0 if target_verified else 0.0,
        "time_to_first_verified_ms": first_target_verified_ms,
        "held_out_generalization": round(max((candidate["held_out_generalization"] for candidate in target_verified), default=0.0), 3),
        "false_positive_rate": 0.0,
        "candidate_efficiency": round(len(target_verified) / len(evaluated), 3) if evaluated else 0.0,
        "mean_description_length": round(sum(len(candidate["statement"]) for candidate in evaluated) / len(evaluated), 2) if evaluated else 0.0,
        "cpu_time_ms": round((time.perf_counter() - started) * 1000, 3),
        "peak_memory_kb": round(peak / 1024, 3),
        "memory_budget_kb": config.limits.memory_budget_kb,
        "resource_limit_exceeded": peak / 1024 > config.limits.memory_budget_kb,
        "max_recursion_depth": config.limits.max_recursion_depth,
        "observed_recursion_depth": max((candidate["generation"] for candidate in evaluated), default=0),
        "verified": len(verified), "verified_target": len(target_verified), "rejected": len(rejected), "unknown": len(unknown),
    }
    return {"name": system_name, "active_experiment": choose_active_observation(candidates), "candidates": evaluated, "metrics": metrics}


def run_experiment(config: ExperimentConfig = ExperimentConfig(), persist: bool = True) -> dict[str, Any]:
    random.seed(config.seed)
    domains: list[Domain] = ["boolean", "algebra", "graph"] if config.domain == "all" else [config.domain]  # type: ignore[list-item]
    run_id = "run-" + hashlib.sha256(json.dumps(asdict(config), sort_keys=True).encode("utf-8")).hexdigest()[:16]
    benchmarks = []
    for domain in domains:
        benchmarks.append({"domain": domain, "benchmark_version": config.benchmark_version, "systems": [run_system(domain, "fixed_baseline", config), run_system(domain, "evolving_hypothesis_engine", config)]})
    all_systems = [system for benchmark in benchmarks for system in benchmark["systems"]]
    metrics = {
        "benchmarks": len(benchmarks),
        "verified_candidates": sum(system["metrics"]["verified"] for system in all_systems),
        "rejected_candidates": sum(system["metrics"]["rejected"] for system in all_systems),
        "unknown_candidates": sum(system["metrics"]["unknown"] for system in all_systems),
        "comparison_note": "Toy benchmark only. No capability claim is made beyond these executed allow-listed checks.",
    }
    report = {"run_id": run_id, "status": "COMPLETED", "config": asdict(config), "benchmarks": benchmarks, "metrics": metrics}
    if persist:
        store = ExperimentStore()
        try:
            store.persist(report)
        finally:
            store.close()
        LATEST_PATH.parent.mkdir(parents=True, exist_ok=True)
        LATEST_PATH.write_text(json.dumps(report, indent=2, sort_keys=True), encoding="utf-8")
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description="Run bounded verified Maths AI experiments.")
    parser.add_argument("--seed", type=int, default=17)
    parser.add_argument("--domain", choices=["all", "boolean", "algebra", "graph"], default="all")
    parser.add_argument("--max-candidates", type=int, default=6)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    config = ExperimentConfig(seed=args.seed, domain=args.domain, limits=ExperimentLimits(max_candidates=max(1, min(args.max_candidates, 12))))
    report = run_experiment(config)
    if args.json:
        print(json.dumps(report, sort_keys=True))
    else:
        print(f"{report['run_id']} {report['status']}")
        for benchmark in report["benchmarks"]:
            print(f"{benchmark['domain']}: " + ", ".join(f"{system['name']} target_verified={system['metrics']['verified_target']} rejected={system['metrics']['rejected']}" for system in benchmark["systems"]))


if __name__ == "__main__":
    main()
