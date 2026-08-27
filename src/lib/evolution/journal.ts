import type { EvolutionEvent } from "./types";

export function describeEvolutionEvent(event: EvolutionEvent): string { return `${event.mutationType.replaceAll("_", " ")} in generation ${event.generation}: ${event.explanation}`; }
export function replayEvents<T>(initial: T, events: EvolutionEvent[], apply: (state: T, event: EvolutionEvent) => T, generation?: number): T { return events.filter((event) => generation === undefined || event.generation <= generation).reduce(apply, initial); }
