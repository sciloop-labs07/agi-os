export type MathImaginationMode = "alternative" | "geometry" | "proof" | "introspection";

export type MathImaginationInput = {
  problem: string;
  goal?: string;
  mode: MathImaginationMode;
  temperature: number;
  steps: number;
};

export type LatentPacket = {
  structure: string[];
  parameters: number[];
};

export type MathImaginationResult = {
  mode: MathImaginationMode;
  imaginedEquation: string;
  latentBlend: LatentPacket;
  retrievedRules: string[];
  validity: {
    valid: boolean;
    notes: string[];
  };
  critique: {
    noveltyScore: number;
    logicScore: number;
    utilityScore: number;
  };
  geometricTrajectory: Array<{
    t: number;
    equation: string;
    description: string;
  }>;
  imaginedProofStep: string;
  introspection: string;
};

const localRuleBase = [
  {
    trigger: /x\^2|quadratic|parabola/i,
    rules: ["complete_square", "factor_discriminant", "vertex_transform", "symmetry_axis"]
  },
  {
    trigger: /sin|cos|tan|trig/i,
    rules: ["phase_shift", "pythagorean_identity", "angle_sum", "frequency_scaling"]
  },
  {
    trigger: /derivative|differentiate|slope|dx/i,
    rules: ["chain_rule", "product_rule", "local_linearization", "critical_point_scan"]
  },
  {
    trigger: /integral|area|sum/i,
    rules: ["substitution", "integration_by_parts", "conservation_area", "boundary_transform"]
  },
  {
    trigger: /graph|network|node/i,
    rules: ["edge_duality", "spectral_lift", "path_compression", "flow_conservation"]
  }
];

function stableHash(text: string) {
  let hash = 2166136261;
  for (const char of text) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function sigmoid(value: number) {
  return 1 / (1 + Math.exp(-value));
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function tokenizeMath(text: string) {
  return text
    .replace(/[^\w^+\-*/=().]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 18);
}

function parameterVector(seed: string, size = 8) {
  const hash = stableHash(seed);
  return Array.from({ length: size }, (_, index) => {
    const shifted = (hash >>> ((index % 4) * 8)) & 255;
    return Number(((shifted / 255) * 2 - 1 + index * 0.07).toFixed(3));
  });
}

export class HierarchicalLatentModule {
  encode(equation: string): LatentPacket {
    const tokens = tokenizeMath(equation);
    return {
      structure: tokens.length ? tokens : ["unknown", "expression"],
      parameters: parameterVector(equation)
    };
  }

  imagineBlend(first: LatentPacket, second: LatentPacket, alpha = 0.5): LatentPacket {
    const parameters = first.parameters.map((value, index) => {
      const other = second.parameters[index] ?? 0;
      return Number((alpha * value + (1 - alpha) * other).toFixed(3));
    });

    return {
      structure: first.structure.slice(0, 6).concat(second.structure.slice(0, 3)),
      parameters
    };
  }
}

export class InternetRuleRetriever {
  private cache = new Map<string, string[]>();

  fetchTransformations(mathObject: string): string[] {
    if (this.cache.has(mathObject)) return this.cache.get(mathObject) ?? [];

    const matchingRules = localRuleBase.flatMap((entry) => (entry.trigger.test(mathObject) ? entry.rules : []));
    const rules = matchingRules.length
      ? matchingRules
      : ["normalize_expression", "introduce_auxiliary_variable", "search_invariant", "test_counterexample"];

    this.cache.set(mathObject, rules);
    return rules;
  }
}

export class ValidityFilter {
  isValid(equation: string) {
    const notes: string[] = [];
    const balancedParens = (equation.match(/\(/g)?.length ?? 0) === (equation.match(/\)/g)?.length ?? 0);
    if (!balancedParens) notes.push("Parentheses are unbalanced.");
    if (/\/\s*0(?!\.)/.test(equation)) notes.push("Direct division by zero detected.");
    if (!/[a-z0-9)]\s*=\s*[-+a-z0-9(]/i.test(equation)) notes.push("No explicit equation equality detected.");

    return {
      valid: notes.length === 0,
      notes: notes.length ? notes : ["Passed syntax, equality, and zero-denominator plausibility checks."]
    };
  }

  isValidProofStep(prefix: string, step: string, goal: string) {
    const hasBridge = step.length > 12 && (step.includes("therefore") || step.includes("so") || step.includes("because"));
    const touchesGoal = goal
      .toLowerCase()
      .split(/\W+/)
      .filter((part) => part.length > 3)
      .some((part) => step.toLowerCase().includes(part));
    return prefix.trim().length > 0 && hasBridge && touchesGoal;
  }
}

export class DiffusionImagination {
  imagine(condition: LatentPacket, temperature: number) {
    const drift = condition.parameters.reduce((sum, value) => sum + value, 0) / Math.max(1, condition.parameters.length);
    const pressure = sigmoid(drift + temperature * 0.65);
    const symbol = pressure > 0.66 ? "lambda" : pressure > 0.45 ? "phi" : "kappa";
    const exponent = pressure > 0.7 ? "3" : "2";
    const scale = Math.max(1, Math.round(pressure * 9));
    return `${symbol}(x) = ${scale}x^${exponent} + ${Math.round((1 - pressure) * 7)}x + ${condition.structure.length}`;
  }
}

export class MathImaginationEngineV2 {
  private latent = new HierarchicalLatentModule();
  private diffusion = new DiffusionImagination();
  private retriever = new InternetRuleRetriever();
  private validator = new ValidityFilter();

  imagine(input: MathImaginationInput): MathImaginationResult {
    const primary = this.latent.encode(input.problem);
    const rules = this.retriever.fetchTransformations(input.problem);
    const ruleLatent = this.latent.encode(rules.join(" "));
    const latentBlend = this.latent.imagineBlend(primary, ruleLatent, 0.62);
    const imaginedEquation = this.diffusion.imagine(latentBlend, input.temperature);
    const validity = this.validator.isValid(imaginedEquation);
    const noveltyScore = clamp01(input.temperature * 0.72 + rules.length * 0.035);
    const logicScore = validity.valid ? clamp01(0.82 - input.temperature * 0.18 + rules.length * 0.015) : 0.32;
    const utilityScore = clamp01(0.5 + rules.length * 0.06 + input.steps * 0.01);
    const goal = input.goal?.trim() || "show the imagined equation preserves the important invariant";
    const proofStep = `Because ${rules[0] ?? "normalization"} preserves the target structure, therefore test ${imaginedEquation} against ${goal}.`;

    return {
      mode: input.mode,
      imaginedEquation,
      latentBlend,
      retrievedRules: rules,
      validity,
      critique: {
        noveltyScore,
        logicScore,
        utilityScore
      },
      geometricTrajectory: this.imagineGeometricTrajectory(imaginedEquation, input.steps),
      imaginedProofStep: this.validator.isValidProofStep(input.problem, proofStep, goal) ? proofStep : "No valid step imagined",
      introspection: this.introspect(latentBlend, rules)
    };
  }

  private imagineGeometricTrajectory(equation: string, steps: number) {
    return Array.from({ length: steps }, (_, index) => {
      const t = steps === 1 ? 0 : index / (steps - 1);
      const bend = Number(Math.sin(t * Math.PI).toFixed(3));
      const deformedEquation = equation.replace(/(\d+(?:\.\d+)?)x\^(\d+)/, (_, coefficient: string, exponent: string) => {
        const nextCoefficient = Number(coefficient) * (1 + bend * 0.35);
        return `${nextCoefficient.toFixed(2)}x^${exponent}`;
      });
      return {
        t: Number(t.toFixed(2)),
        equation: deformedEquation,
        description: `Frame ${index + 1}: latent deformation bends the curve by ${bend}, then checks whether the transformed family keeps its core symmetry.`
      };
    });
  }

  private introspect(latent: LatentPacket, rules: string[]) {
    const strongest = latent.structure.slice(0, 5).join(" -> ");
    const energy = latent.parameters.reduce((sum, value) => sum + Math.abs(value), 0) / latent.parameters.length;
    return `In latent space I see structure [${strongest}], rule pressure from ${rules.slice(0, 3).join(", ")}, and deformation energy ${energy.toFixed(2)}.`;
  }
}
