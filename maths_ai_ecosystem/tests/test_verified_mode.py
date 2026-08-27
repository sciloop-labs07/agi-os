from __future__ import annotations

import sqlite3
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from maths_ai_ecosystem.verified_mode import (
    Candidate,
    ExperimentConfig,
    ExperimentStore,
    algebra_verifier,
    boolean_verifier,
    graph_verifier,
    run_experiment,
)


class VerifiedModeTests(unittest.TestCase):
    def test_verifiers_require_real_evidence(self) -> None:
        good_boolean = Candidate("boolean-good", "boolean", "De Morgan", "de_morgan_and", [], "seed", 0)
        bad_boolean = Candidate("boolean-bad", "boolean", "Wrong De Morgan", "wrong_de_morgan", [], "seed", 0)
        algebra = Candidate("algebra-good", "algebra", "Square binomial", "square_binomial", [], "seed", 0)
        graph = Candidate("graph-good", "graph", "Reachability", "reachability_transitive", [], "seed", 0)
        self.assertEqual(boolean_verifier(good_boolean).status, "VERIFIED")
        self.assertEqual(boolean_verifier(bad_boolean).status, "REJECTED")
        self.assertEqual(algebra_verifier(algebra).status, "VERIFIED")
        self.assertEqual(graph_verifier(graph).status, "VERIFIED")

    def test_seeded_structure_is_reproducible(self) -> None:
        config = ExperimentConfig(seed=41)
        first = run_experiment(config, persist=False)
        second = run_experiment(config, persist=False)
        self.assertEqual(first["run_id"], second["run_id"])
        self.assertEqual(_structure(first), _structure(second))

    def test_evolving_engine_discovers_each_target_in_toy_suite(self) -> None:
        report = run_experiment(ExperimentConfig(seed=17), persist=False)
        for benchmark in report["benchmarks"]:
            systems = {system["name"]: system for system in benchmark["systems"]}
            self.assertEqual(systems["fixed_baseline"]["metrics"]["verified_discovery_rate"], 0.0)
            self.assertEqual(systems["evolving_hypothesis_engine"]["metrics"]["verified_discovery_rate"], 1.0)
            self.assertEqual(systems["evolving_hypothesis_engine"]["metrics"]["false_positive_rate"], 0.0)

    def test_store_persists_raw_artifacts(self) -> None:
        report = run_experiment(ExperimentConfig(seed=17, domain="boolean"), persist=False)
        with TemporaryDirectory() as temporary_directory:
            path = Path(temporary_directory) / "evidence.sqlite"
            store = ExperimentStore(path)
            try:
                store.persist(report)
            finally:
                store.close()
            connection = sqlite3.connect(path)
            try:
                self.assertEqual(connection.execute("SELECT COUNT(*) FROM experiment_runs").fetchone()[0], 1)
                self.assertGreater(connection.execute("SELECT COUNT(*) FROM verification_artifacts").fetchone()[0], 0)
            finally:
                connection.close()


def _structure(report: dict) -> list[tuple[str, str, str]]:
    return [
        (benchmark["domain"], candidate["expression"], candidate["verification"]["status"])
        for benchmark in report["benchmarks"]
        for system in benchmark["systems"]
        for candidate in system["candidates"]
    ]


if __name__ == "__main__":
    unittest.main()
