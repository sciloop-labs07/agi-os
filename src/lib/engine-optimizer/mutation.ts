import type { EngineGenome, NodeParameters } from "./types";

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const mutateValue = (value: number, rate: number) => Math.random() < rate ? clamp(value + (Math.random() * 2 - 1) * 24) : value;
export function mutateEngine(engine: EngineGenome, generation: number, mutationRate = .18): EngineGenome {
  const parameters = Object.fromEntries(Object.entries(engine.parameters).map(([nodeId, value]) => [nodeId, Object.fromEntries(Object.entries(value).map(([key, item]) => [key, mutateValue(item, mutationRate)])) as NodeParameters]));
  return { ...engine, id: "", generation, parameters, scores: { ...engine.scores } };
}
