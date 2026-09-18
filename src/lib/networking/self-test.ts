import { buildNetworkingProjection, buildPersonalTouchpointEvent, scoreNetworkingMoves, simulateNetworkingScenario, validateNetworkingState } from "./engine";
import { createDefaultNetworkingState } from "./seed";
import { parseNetworkingState, serializeNetworkingState } from "./persistence";

export function runNetworkingSelfTest() {
  const state = createDefaultNetworkingState();
  const original = JSON.stringify(state);
  const warm = simulateNetworkingScenario(state, "warm-introduction");
  const dormant = simulateNetworkingScenario(state, "dormant-recovery");
  const weakTie = simulateNetworkingScenario(state, "weak-tie-discovery");
  if (JSON.stringify(warm) !== JSON.stringify(simulateNetworkingScenario(state, "warm-introduction"))) throw new Error("Networking simulation is not deterministic");
  if (JSON.stringify(state) !== original) throw new Error("Networking simulation mutated its input state");
  if (warm.responseProbability === dormant.responseProbability && dormant.responseProbability === weakTie.responseProbability) throw new Error("Networking scenarios should produce different projections");
  if ([warm.responseProbability, warm.opportunityAccess, warm.networkResilience].some((value) => value < 0 || value > 100)) throw new Error("Networking scores must stay within 0 and 100");
  if (!scoreNetworkingMoves(state).length || !buildNetworkingProjection(state).activeGoal) throw new Error("Networking projection is missing its goal or moves");
  if (validateNetworkingState(state).length !== 0) throw new Error("Seeded Networking state should be valid");
  const restored = parseNetworkingState(serializeNetworkingState(state));
  if (JSON.stringify(restored) !== JSON.stringify(state)) throw new Error("Networking state serialization is not reversible");
  const event = buildPersonalTouchpointEvent(state.people[0], state.touchpoints[0]);
  if (event.type !== "networking.touchpoint.logged" || event.module !== "networking" || event.entityId !== state.people[0].id) throw new Error("Personal OS touchpoint payload contract changed");
  return true;
}
