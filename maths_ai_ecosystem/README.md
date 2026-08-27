# Maths-AI Self-Evolving Intelligence Ecosystem

Local-first prototype for an evolving mathematical intelligence civilization.

This is not a chatbot. It is a modular experimental system where agents generate theorems, critique them, compress memory, mutate variants, compete, cooperate, and survive only when claims pass reality constraints.

## Run

From the repository root:

```bash
python main.py --ticks 12
python -m maths_ai_ecosystem.run_simulation
python -m unittest discover maths_ai_ecosystem/tests
```

The MVP runs with the Python standard library. Optional scientific dependencies are listed in `requirements.txt`.

## Architecture

```txt
core/
  engine.py                    high-level engine
  scheduler.py                 recurring tick tasks
  event_bus.py                 ecosystem events
  simulation_loop.py           observe/reason/exchange/critique/compress/mutate loop
  metrics.py                   entropy, graph, theorem, fitness, emergence metrics
  stability_engine.py          chaos and runaway recursion monitoring
  logic_engine.py              symbolic consistency and contradiction checks
  theorem_engine.py            theorem generation, proof search, scoring
  recursion_engine.py          recursive reflection and fixed-point guard
  graph_engine.py              dynamic relational graph memory
  optimization_engine.py       fitness and compression objectives
  entropy_engine.py            Shannon entropy, MI, MDL, compression scoring
  dynamics_engine.py           nonlinear state dynamics and Lyapunov proxy
  mutation_engine.py           bounded variant generation
  simulation_engine.py         symbolic simulation reality checks
  reality_constraints.py       energy, memory, contradiction, and validation gates
  memory_engine.py             SQLite memory, theorem archive, graph memory
  evolution_engine.py          mutation, selection, death, spawning
  agent_runtime.py             civilization loop

agents/
  theorem_agent.py             proposes mathematical hypotheses
  critic_agent.py              validates and rejects weak reasoning
  optimizer_agent.py           scores theorem quality and compression
  explorer_agent.py            searches novel concept intersections
  compression_agent.py         compresses memory into reusable structures
  mutation_agent.py            mutates theorems and strategies
  physics_agent.py             runs symbolic reality checks
  graph_agent.py               reorganizes graph memory and detects hubs

memory/
  episodic_memory.py
  semantic_memory.py
  graph_memory.py
  compressed_memory.py
  vector_memory.py

math_core/
  information_theory.py
  graph_theory.py
  category_theory.py
  topology.py
  probability.py
  symbolic_logic.py
  dynamical_systems.py
  thermodynamics.py
  complexity.py
  computability.py

worlds/
  symbolic_world.py
  theorem_world.py
  graph_world.py
  evolutionary_world.py
visualization/
  dashboard.py                 browser-openable HTML dashboard
  graph_visualizer.py
  entropy_visualizer.py
  evolution_visualizer.py
  theorem_visualizer.py
```

## Reality Gates

Accepted claims must pass some combination of:

- contradiction detection
- proof search
- symbolic checks
- unit tests
- simulation
- energy budget
- memory budget
- failed-attempt archive review

## Evolution Metrics

Variants compete on:

- correctness
- compression efficiency
- prediction quality
- logical consistency
- energy efficiency
- novelty
- theorem quality
- stability

## Output

The simulation writes:

```txt
maths_ai_ecosystem/logs/dashboard_snapshot.json
maths_ai_ecosystem/logs/dashboard.html
```

These files are intended for dashboards showing agent interactions, theorem evolution, entropy flow, memory hubs, and mutation lineage.

## Verified Experimental Mode

`verified_mode.py` is a separate, bounded experiment runner. It does not accept
agent scores, prompts, or seed labels as proof. A candidate is only marked
`VERIFIED` when an allow-listed independent adapter records a reproducible
artifact:

- Boolean identities: exhaustive truth-table enumeration.
- Algebraic identities: SymPy simplification of the symbolic difference.
- Graph reachability: deterministic traversal over fixed property cases.
- Unsupported expressions: `UNKNOWN`, never verified.

Run the executed benchmark suite with:

```bash
python -m maths_ai_ecosystem.verified_mode --seed 17 --domain all --max-candidates 6
python -m unittest maths_ai_ecosystem.tests.test_verified_mode -v
```

The runner writes raw evidence to:

```txt
maths_ai_ecosystem/data/verified_experiments.sqlite
maths_ai_ecosystem/logs/verified_latest.json
```

The current suite is deliberately a small, deterministic toy benchmark. It
tests whether an allow-listed evolving hypothesis search produces a verified
target rule under the same candidate budget as a fixed baseline. It does not
demonstrate general theorem discovery or AGI.

## Starter Theorems

- `a + b = b + a`
- `(a + b) + c = a + (b + c)`
- `f(f(x))`
- `compress(x) implies shorter_description(x)`
- `A and (A -> B) implies B`
- `graph_rewire(G) can create hub(G)`

## Next Upgrades

- Replace internal graph with NetworkX.
- Add SymPy theorem and algebra checks.
- Add FastAPI server for live dashboard streaming.
- Add FAISS semantic memory.
- Add PyTorch/JAX learned scoring models.
- Add sandboxed Python code execution for generated theorem tests.
- Add browser visualization for force-directed agent/theorem graphs.
