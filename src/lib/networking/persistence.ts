import { createDefaultNetworkingState } from "./seed";
import type { NetworkingState } from "./types";

export const NETWORKING_STORAGE_KEY = "agi-os:networking:v1";

export function serializeNetworkingState(state: NetworkingState) {
  return JSON.stringify(state, null, 2);
}

export function parseNetworkingState(raw: string): NetworkingState {
  const parsed = JSON.parse(raw) as Partial<NetworkingState>;
  const fallback = createDefaultNetworkingState();
  if (parsed.version !== 1 || !Array.isArray(parsed.people) || !Array.isArray(parsed.goals) || !Array.isArray(parsed.edges) || !Array.isArray(parsed.touchpoints)) throw new Error("Invalid Networking state");
  return { ...fallback, ...parsed, controls: parsed.controls ?? fallback.controls } as NetworkingState;
}

export function loadNetworkingState(): NetworkingState {
  const fallback = createDefaultNetworkingState();
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(NETWORKING_STORAGE_KEY);
    return raw ? parseNetworkingState(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveNetworkingState(state: NetworkingState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NETWORKING_STORAGE_KEY, serializeNetworkingState(state));
  } catch {
    // Local storage is an optional enhancement; the in-memory portal remains usable.
  }
}
