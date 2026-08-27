export type CyberActivity = {
  name?: string;
  typingSpeed: number;
  clickRhythm: number;
  loginAbnormality: number;
  fileAccessCount: number;
  failedAttempts: number;
  apiRate: number;
  pathDeviation: number;
  latencyMismatch: number;
};

export type InformationShadowInput = {
  missingInfo: number;
  contradiction: number;
  uncertainty: number;
  delay: number;
  noise: number;
};

export type RealityTest = {
  system: string;
  expected: string;
  actual: string;
  shadow: string;
  measurable: string;
  application: string;
  confidence: number;
  notes?: string;
};

export type EvolutionEntry = {
  title: string;
  type: "theorem" | "experiment" | "application" | "failure" | "future idea";
  description: string;
  confidence: number;
  date: string;
  status: "idea" | "testing" | "validated" | "rejected" | "upgraded";
};

export type ShadowMemoryEvent = {
  visible?: string;
  shadow?: string;
};

export function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number.isFinite(Number(n)) ? Number(n) : 0));
}

export function hashPattern(input: unknown) {
  const str = JSON.stringify(input);
  let hash = 0;
  for (let index = 0; index < str.length; index += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).toUpperCase().slice(0, 6).padEnd(6, "0");
}

export function levelFromScore(score: number) {
  const value = clamp(score);
  if (value <= 20) return "LOW";
  if (value <= 45) return "MED";
  if (value <= 70) return "HIGH";
  return "CRITICAL";
}

export function calculatePhysicalShadow(I: number, I0: number) {
  const expected = Math.max(Number(I0) || 0, 0.0001);
  const actual = Math.max(Number(I) || 0, 0);
  return clamp((1 - actual / expected) * 100);
}

export function generateShadowAddress(score: number, features: unknown) {
  return `SHDW-${levelFromScore(score)}-${hashPattern(features)}`;
}

export function calculateCyberShadow(activity: CyberActivity) {
  const baseline: Record<keyof CyberActivity, number> = {
    name: 0,
    typingSpeed: 45,
    clickRhythm: 1.2,
    loginAbnormality: 5,
    fileAccessCount: 5,
    failedAttempts: 1,
    apiRate: 10,
    pathDeviation: 8,
    latencyMismatch: 5
  };

  const weights: Record<keyof CyberActivity, number> = {
    name: 0,
    typingSpeed: 0.8,
    clickRhythm: 0.9,
    loginAbnormality: 1.3,
    fileAccessCount: 1.1,
    failedAttempts: 1.5,
    apiRate: 1.4,
    pathDeviation: 1.4,
    latencyMismatch: 1.1
  };

  let weighted = 0;
  let maxWeight = 0;
  const reasons: string[] = [];

  (Object.keys(baseline) as Array<keyof CyberActivity>).forEach((key) => {
    if (key === "name") return;
    const actual = Number(activity[key]) || 0;
    const base = baseline[key];
    const diff = Math.abs(actual - base) / Math.max(base, 1);
    const score = clamp(diff * 100);
    weighted += score * weights[key];
    maxWeight += weights[key];

    if (score > 45) {
      reasons.push(`${String(key)} deviates strongly from normal baseline`);
    }
  });

  const score = clamp(weighted / Math.max(maxWeight, 1));
  return {
    score,
    level: levelFromScore(score),
    shadowAddress: generateShadowAddress(score, activity),
    reasons: reasons.length ? reasons : ["Behavior is close to expected baseline"]
  };
}

export function calculateInformationShadow(data: InformationShadowInput) {
  const score = clamp(
    (clamp(data.missingInfo) + clamp(data.contradiction) + clamp(data.uncertainty) + clamp(data.delay) + clamp(data.noise)) / 5
  );

  return {
    score,
    level: levelFromScore(score),
    explanation:
      score > 70
        ? "Critical information shadow: important context is hidden, missing, delayed, or contradictory."
        : score > 45
          ? "Strong information shadow: system has meaningful uncertainty or missing context."
          : score > 20
            ? "Soft information shadow: some hidden trace exists but risk is moderate."
            : "Low information shadow: visible signal mostly matches expected context."
  };
}

export function runRealityTest(test: RealityTest) {
  const expectedLength = String(test.expected || "").length;
  const actualLength = String(test.actual || "").length;
  const shadowLength = String(test.shadow || "").length;
  const confidence = clamp(test.confidence || 50);
  const measurabilityBoost = test.measurable.toLowerCase().includes("yes") ? 12 : test.measurable.toLowerCase().includes("partial") ? 6 : 0;

  const differenceSignal = clamp(Math.abs(expectedLength - actualLength) + shadowLength + measurabilityBoost);
  const shadowScore = clamp(differenceSignal * 0.6 + (100 - confidence) * 0.4);

  return {
    shadowScore,
    level: levelFromScore(shadowScore),
    measurability: shadowScore > 65 ? "High measurable shadow" : shadowScore > 35 ? "Partially measurable shadow" : "Weak measurable shadow",
    applicationPotential: shadowScore > 65 ? "Strong application potential" : shadowScore > 35 ? "Research potential" : "Needs clearer measurement",
    confidenceComment: confidence > 80 ? "Strong confidence" : confidence > 55 ? "Moderate confidence" : "Early-stage hypothesis"
  };
}

export function generateShadowMemory(event: ShadowMemoryEvent) {
  return {
    visibleSignal: event.visible || "Visible action detected",
    shadowTrace: event.shadow || "Hidden delay, uncertainty, missing context, or contradiction detected",
    possibleMeaning: "The visible action explains what happened. The shadow trace may explain why it happened.",
    futurePrediction: "Future AI systems can use this trace to improve prediction, personalization, safety, and self-correction."
  };
}

export const defaultRealityTests: RealityTest[] = [
  {
    system: "Light and object",
    expected: "Photons travel straight",
    actual: "Object blocks photons",
    shadow: "Photon absence behind object",
    measurable: "yes",
    application: "Visual simulation, optics, sensors",
    confidence: 95,
    notes: "Canonical physical shadow case."
  },
  {
    system: "Login behavior",
    expected: "Normal user login pattern",
    actual: "Fast repeated failed attempts",
    shadow: "Abnormal behavior trace",
    measurable: "yes",
    application: "Cybersecurity",
    confidence: 85,
    notes: "Behavioral trace remains even when identity is hidden."
  },
  {
    system: "AI answer generation",
    expected: "Direct answer with full confidence",
    actual: "Answer requires missing assumptions",
    shadow: "Uncertainty and hidden context",
    measurable: "partially",
    application: "Safer AI",
    confidence: 70,
    notes: "Useful for confidence and assumption disclosure."
  },
  {
    system: "Student marks",
    expected: "Marks represent intelligence",
    actual: "Marks affected by stress, language, and time",
    shadow: "Hidden learning conditions",
    measurable: "partially",
    application: "Education analytics",
    confidence: 75,
    notes: "Visible score hides causal context."
  }
];

export const defaultEvolutionEntries: EvolutionEntry[] = [
  {
    title: "Shadow Trace Principle",
    type: "theorem",
    description: "For every observable action inside a system, there exists a corresponding shadow trace formed by expected minus actual behavior.",
    confidence: 82,
    date: "2026-06-07",
    status: "testing"
  },
  {
    title: "Shadow = Expected - Actual",
    type: "theorem",
    description: "Core compression of the theory into a measurement frame.",
    confidence: 88,
    date: "2026-06-07",
    status: "validated"
  },
  {
    title: "Cyber Shadow Addressing",
    type: "application",
    description: "Behavioral deviations create an addressable trace even when identity is hidden.",
    confidence: 76,
    date: "2026-06-07",
    status: "testing"
  },
  {
    title: "AI Shadow Memory",
    type: "application",
    description: "AI can learn from absence, hesitation, contradiction, uncertainty, and missing context.",
    confidence: 73,
    date: "2026-06-07",
    status: "idea"
  },
  {
    title: "Physical Shadow Simulation",
    type: "experiment",
    description: "Darkness is modeled as missing photons compared to expected light.",
    confidence: 95,
    date: "2026-06-07",
    status: "validated"
  },
  {
    title: "Reality Test Arena",
    type: "experiment",
    description: "Cross-domain test bench for checking where the theory is measurable and useful.",
    confidence: 70,
    date: "2026-06-07",
    status: "testing"
  }
];

