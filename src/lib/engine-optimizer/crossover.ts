import type { EngineGenome, NodeParameters } from "./types";

export function crossoverEngines(first: EngineGenome, second: EngineGenome, generation: number): EngineGenome {
  const parameters = Object.fromEntries(Object.keys(first.parameters).map((nodeId, index) => {
    const source = index % 2 === 0 ? first.parameters[nodeId] : second.parameters[nodeId] ?? first.parameters[nodeId];
    return [nodeId, { ...source } as NodeParameters];
  }));
  return { ...first, id: "", generation, parameters, scores: { ...first.scores } };
}
