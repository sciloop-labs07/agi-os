import { simulateFlow } from "@/lib/simulation-result-engine";
import type { SciLoopEdge, SciLoopNode } from "@/lib/sciloop-flow";
import type { NodeParameters, OptimizerScores } from "./types";

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value * 10) / 10));
const avg = (...values: number[]) => values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
const meanParameters = (parameters: Record<string, NodeParameters>) => {
  const values = Object.values(parameters);
  return values.length ? {
    intensity: avg(...values.map((item) => item.intensity)),
    novelty: avg(...values.map((item) => item.novelty)),
    challenge: avg(...values.map((item) => item.challenge)),
    repetition: avg(...values.map((item) => item.repetition))
  } : { intensity: 50, novelty: 50, challenge: 50, repetition: 50 };
};

export function scoreEngine(nodes: SciLoopNode[], edges: SciLoopEdge[], parameters: Record<string, NodeParameters>): OptimizerScores {
  const base = simulateFlow(nodes, edges);
  const p = meanParameters(parameters);
  const metric = (label: string) => base.metrics.find((item) => item.label === label)?.value ?? 50;
  const understanding = avg(metric("Understanding Level"), p.intensity, p.repetition);
  const curiosity = avg(metric("Curiosity Level"), p.novelty, p.challenge);
  const attention = avg(metric("Attention Retention"), 100 - metric("Cognitive Load"), p.intensity);
  const retention = avg(metric("Concept Retention"), metric("Long-term Memory"), p.repetition);
  const recall = avg(metric("Recall Speed"), metric("Knowledge Compression"), 100 - p.intensity * .25);
  const learningSpeed = avg(metric("Learning Speed"), metric("Understanding per Minute"), 100 - p.repetition * .25);
  const cognitiveLoad = clamp(avg(metric("Cognitive Load"), p.challenge * .78 + p.intensity * .22));
  const engagement = avg(metric("Engagement"), p.novelty, p.challenge, 100 - cognitiveLoad * .35);
  const motivation = avg(metric("Motivation"), metric("Reward Feeling"), engagement);
  const confidence = avg(metric("Confidence"), metric("Prediction Accuracy"), retention);
  const predictionAccuracy = avg(metric("Prediction Accuracy"), metric("Hypothesis Quality"), p.intensity);
  const discoveryRate = avg(metric("Discovery Rate"), metric("Experiment Frequency"), p.novelty);
  const interactionQuality = avg(metric("User Participation"), metric("Experimentation Score"), metric("Exploration Rate"));
  const simplicity = avg(metric("Clarity"), metric("Visual Simplicity"), 100 - cognitiveLoad * .35);
  const informationDensity = avg(metric("Information Density"), metric("Concept Connection Score"), p.intensity);
  const transferLearning = avg(metric("Transfer Learning"), metric("Mental Model Quality"), confidence);
  const masteryProbability = avg(metric("Mastery Probability"), understanding, retention, transferLearning, confidence);
  const overall = avg(understanding, curiosity, attention, retention, recall, learningSpeed, 100 - cognitiveLoad, engagement, motivation, confidence, predictionAccuracy, discoveryRate, interactionQuality, simplicity, informationDensity, transferLearning, masteryProbability);
  return { understanding: clamp(understanding), curiosity: clamp(curiosity), attention: clamp(attention), retention: clamp(retention), recall: clamp(recall), learningSpeed: clamp(learningSpeed), cognitiveLoad, engagement: clamp(engagement), motivation: clamp(motivation), confidence: clamp(confidence), predictionAccuracy: clamp(predictionAccuracy), discoveryRate: clamp(discoveryRate), interactionQuality: clamp(interactionQuality), simplicity: clamp(simplicity), informationDensity: clamp(informationDensity), transferLearning: clamp(transferLearning), masteryProbability: clamp(masteryProbability), overall: clamp(overall) };
}
