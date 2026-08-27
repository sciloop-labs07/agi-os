import type { MathExpression } from "@/math-ai/types";

export function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

export function normalizeExpression(rawText: string) {
  return rawText.replace(/\s+/g, " ").trim();
}

export function parseExpression(rawText: string) {
  return normalizeExpression(rawText)
    .replace(/[()]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function estimateComplexity(rawText: string) {
  const text = normalizeExpression(rawText);
  const operators = (text.match(/[¬∧∨→=+*∪∩^]/g) ?? []).length;
  const parens = (text.match(/[()]/g) ?? []).length;
  const tokens = parseExpression(text).length;
  return Math.max(1, tokens + operators * 1.5 + parens * 0.35);
}

export function variablesOf(rawText: string) {
  return [...new Set((rawText.match(/\b[A-ZabcxyzG]\b/g) ?? []).filter(Boolean))];
}

export function createExpression(id: string, rawText: string, domain: string, truthStatus: MathExpression["truthStatus"] = "unknown"): MathExpression {
  return {
    id,
    rawText,
    ast: parseExpression(rawText),
    variables: variablesOf(rawText),
    domain,
    complexityScore: estimateComplexity(rawText),
    normalForm: normalizeExpression(rawText),
    truthStatus
  };
}

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}
