from __future__ import annotations

import sqlite3
from pathlib import Path

from .entropy_engine import EntropyEngine
from .graph_engine import GraphEngine
from .types import MemoryItem, Theorem


class MemoryEngine:
    """Episodic, semantic, compressed, graph, and theorem archive memory."""

    def __init__(self, database_path: Path, max_items: int = 2_000) -> None:
        self.database_path = database_path
        self.database_path.parent.mkdir(parents=True, exist_ok=True)
        self.max_items = max_items
        self.entropy = EntropyEngine()
        self.graph = GraphEngine()
        self._init_db()

    def _init_db(self) -> None:
        with sqlite3.connect(self.database_path) as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS memory (
                    id TEXT PRIMARY KEY,
                    kind TEXT NOT NULL,
                    content TEXT NOT NULL,
                    importance REAL NOT NULL,
                    entropy REAL NOT NULL,
                    source TEXT NOT NULL,
                    created_at REAL NOT NULL
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS theorem_archive (
                    id TEXT PRIMARY KEY,
                    statement TEXT NOT NULL,
                    status TEXT NOT NULL,
                    score REAL NOT NULL,
                    created_by TEXT NOT NULL
                )
                """
            )

    def remember(self, kind: str, content: str, importance: float, source: str) -> MemoryItem:
        item = MemoryItem(kind=kind, content=content, importance=importance, entropy=self.entropy.shannon_entropy(content), source=source)
        with sqlite3.connect(self.database_path) as conn:
            conn.execute(
                "INSERT OR REPLACE INTO memory VALUES (?, ?, ?, ?, ?, ?, ?)",
                (item.id, item.kind, item.content, item.importance, item.entropy, item.source, item.created_at),
            )
        self.graph.add_node(item.id, kind, content[:72], importance, entropy=item.entropy, source=source)
        self._decay_if_needed()
        return item

    def archive_theorem(self, theorem: Theorem) -> None:
        with sqlite3.connect(self.database_path) as conn:
            conn.execute(
                "INSERT OR REPLACE INTO theorem_archive VALUES (?, ?, ?, ?, ?)",
                (theorem.id, theorem.statement, theorem.status.value, theorem.score, theorem.created_by),
            )
        self.graph.add_node(theorem.id, "theorem", theorem.statement, theorem.score, status=theorem.status.value)
        for parent in theorem.parent_ids:
            self.graph.connect(parent, theorem.id, theorem.score)

    def recent(self, limit: int = 20) -> list[MemoryItem]:
        with sqlite3.connect(self.database_path) as conn:
            rows = conn.execute(
                "SELECT id, kind, content, importance, entropy, source, created_at FROM memory ORDER BY created_at DESC LIMIT ?",
                (limit,),
            ).fetchall()
        return [
            MemoryItem(id=row[0], kind=row[1], content=row[2], importance=row[3], entropy=row[4], source=row[5], created_at=row[6])
            for row in rows
        ]

    def compressed_summary(self) -> list[str]:
        return self.graph.compress_memory_graph()

    def _decay_if_needed(self) -> None:
        with sqlite3.connect(self.database_path) as conn:
            count = conn.execute("SELECT COUNT(*) FROM memory").fetchone()[0]
            if count <= self.max_items:
                return
            conn.execute(
                """
                DELETE FROM memory WHERE id IN (
                    SELECT id FROM memory ORDER BY importance ASC, entropy DESC LIMIT ?
                )
                """,
                (count - self.max_items,),
            )
