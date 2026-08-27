/*
  SciLoop Maths AI - Theorem Kernel

  This is the non-visual intelligence layer for the Living Theorem Ecosystem.

  It does not verify mathematics.
  It generates structured conjecture candidates, proof targets, and counterexample targets.

  Future:
  - Connect to Lean / Coq / Isabelle
  - Connect to symbolic algebra systems
  - Connect to theorem databases
*/

export class TheoremKernel {
  constructor({ theorems = [], relations = [], settings = {} }) {
    this.theorems = clone(theorems);
    this.relations = clone(relations);
    this.tick = 0;

    this.settings = {
      creativity: 0.65,
      rigor: 0.72,
      abstraction: 0.7,
      counterexampleAggression: 0.55,
      ...settings
    };

    this.candidates = [];
    this.events = [];
  }

  setSettings(nextSettings = {}) {
    this.settings = {
      ...this.settings,
      ...nextSettings
    };
  }

  step() {
    this.tick += 1;

    const relation = this.selectRelation();
    if (!relation) return null;

    const source = this.getTheorem(relation.from);
    const target = this.getTheorem(relation.to);

    if (!source || !target) return null;

    const interaction = this.createInteraction(source, target, relation);

    this.applyInteractionLearning(interaction);

    this.events.unshift(interaction);
    this.events = this.events.slice(0, 50);

    return interaction;
  }

  generateCandidate(sourceId = null, targetId = null, preferredOperator = null) {
    const relation = sourceId && targetId
      ? this.findRelation(sourceId, targetId)
      : this.selectRelation();

    if (!relation) return null;

    const source = this.getTheorem(sourceId || relation.from);
    const target = this.getTheorem(targetId || relation.to);

    if (!source || !target) return null;

    const operator =
      preferredOperator ||
      this.chooseOperator(source, target, relation);

    const analysis = this.analyzePair(source, target, relation);
    const mutation = this.applyMutationOperator(operator, source, target, analysis);
    const proofPlan = this.createProofPlan(operator, source, target, mutation, analysis);
    const counterexamples = this.searchCounterexampleTargets(
      operator,
      source,
      target,
      mutation,
      analysis
    );

    const scores = this.scoreCandidate({
      source,
      target,
      relation,
      operator,
      analysis,
      mutation,
      proofPlan,
      counterexamples
    });

    const candidate = {
      id: `candidate-${Date.now()}-${Math.floor(Math.random() * 99999)}`,
      type: this.classifyCandidate(scores),
      title: this.makeCandidateTitle(operator, source, target, scores),
      parents: [source.id, target.id],
      parentNames: [source.name, target.name],
      operator,
      assumptions: mutation.assumptions,
      removedAssumptions: mutation.removedAssumptions,
      addedAssumptions: mutation.addedAssumptions,
      proposedStatement: mutation.proposedStatement,
      expectedConclusion: mutation.expectedConclusion,
      proofSketch: proofPlan.sketch,
      proofPlanSteps: proofPlan.steps,
      possibleCounterexamples: counterexamples,
      verificationStatus: "Unverified. Requires formal proof or counterexample search.",
      leanHookPlaceholder: this.createLeanHookPlaceholder(source, target, mutation),
      scores,
      createdAtTick: this.tick
    };

    this.candidates.unshift(candidate);
    this.candidates = this.candidates.slice(0, 40);

    this.events.unshift({
      tick: this.tick,
      kind: "candidate-generated",
      sourceId: source.id,
      targetId: target.id,
      operator,
      title: candidate.title,
      candidateId: candidate.id,
      summary: `${candidate.type}: ${candidate.title}`
    });

    return candidate;
  }

  runCounterexampleSearch(candidateId) {
    const candidate = this.candidates.find((item) => item.id === candidateId);

    if (!candidate) return null;

    const parentA = this.getTheorem(candidate.parents[0]);
    const parentB = this.getTheorem(candidate.parents[1]);

    const risks = [];

    for (const removed of candidate.removedAssumptions || []) {
      risks.push({
        removedAssumption: removed,
        riskLevel: "high",
        explanation: `The candidate removed "${removed}". Parent theorem failure modes should be checked before trusting the candidate.`,
        target: `Build an example where "${removed}" fails but all other assumptions appear to hold.`
      });
    }

    for (const parent of [parentA, parentB]) {
      if (!parent) continue;

      for (const failure of parent.failureModes || []) {
        risks.push({
          removedAssumption: failure.assumption || "unknown",
          riskLevel: failure.severity || "medium",
          explanation: failure.description,
          target: failure.counterexampleTarget || "Search for a boundary case."
        });
      }
    }

    candidate.possibleCounterexamples = [
      ...candidate.possibleCounterexamples,
      ...risks
    ];

    candidate.scores.counterexampleRisk = clamp(
      candidate.scores.counterexampleRisk + risks.length * 0.06,
      0,
      1
    );

    candidate.type = this.classifyCandidate(candidate.scores);

    return {
      candidateId,
      risks,
      updatedType: candidate.type,
      updatedScores: candidate.scores
    };
  }

  createInteraction(source, target, relation) {
    const analysis = this.analyzePair(source, target, relation);

    const possibleKinds = [
      "teach",
      "compare",
      "compose",
      "generalize",
      "specialize",
      "dualize",
      "counterexampleSearch",
      "proofPlan"
    ];

    const kind = weightedPick([
      ["teach", 0.2],
      ["compare", 0.14],
      ["compose", 0.16 * this.settings.creativity],
      ["generalize", 0.14 * this.settings.abstraction],
      ["specialize", 0.1],
      ["dualize", analysis.hasDuality ? 0.16 : 0.04],
      ["counterexampleSearch", 0.12 * this.settings.counterexampleAggression],
      ["proofPlan", 0.16 * this.settings.rigor]
    ]) || randomItem(possibleKinds);

    let transferredIdea = null;
    let summary = "";

    if (kind === "teach") {
      transferredIdea = this.selectTeachableIdea(source, target);
      summary = `${source.name} teaches "${transferredIdea}" to ${target.name}.`;
    }

    if (kind === "compare") {
      summary = `${source.name} and ${target.name} compare shared invariant: ${analysis.sharedInvariants[0] || "structural pattern"}.`;
    }

    if (kind === "compose") {
      summary = `${source.name} attempts composition with ${target.name} through ${relation.type}.`;
    }

    if (kind === "generalize") {
      summary = `${source.name} tries to generalize ${target.name} by abstracting assumptions.`;
    }

    if (kind === "specialize") {
      summary = `${source.name} specializes ${target.name} into a simpler domain.`;
    }

    if (kind === "dualize") {
      summary = `${source.name} and ${target.name} search for a dual relation.`;
    }

    if (kind === "counterexampleSearch") {
      summary = `${source.name} challenges ${target.name} by weakening one assumption.`;
    }

    if (kind === "proofPlan") {
      summary = `${source.name} and ${target.name} form a possible proof route.`;
    }

    return {
      tick: this.tick,
      kind,
      sourceId: source.id,
      targetId: target.id,
      relationType: relation.type,
      transferredIdea,
      analysis,
      summary
    };
  }

  analyzePair(source, target, relation) {
    const sourceIdeas = collectIdeas(source);
    const targetIdeas = collectIdeas(target);

    const sharedIdeas = intersection(sourceIdeas, targetIdeas);
    const sharedAssumptions = intersection(source.assumptions || [], target.assumptions || []);
    const sharedMethods = intersection(source.proofMethods || [], target.proofMethods || []);
    const sharedInvariants = intersection(
      [source.coreInvariant, ...(source.teaches || [])].filter(Boolean),
      [target.coreInvariant, ...(target.teaches || [])].filter(Boolean)
    );

    const hasDuality =
      hasAny(source.mutationOperators, ["dualization", "dualize"]) ||
      hasAny(target.mutationOperators, ["dualization", "dualize"]) ||
      relation.type.includes("dual") ||
      relation.type.includes("correspondence");

    const domainCompatibility = this.estimateDomainCompatibility(
      source.domain,
      target.domain,
      relation
    );

    const proofCompatibility = sharedMethods.length > 0
      ? 0.85
      : source.proofMethods?.length && target.proofMethods?.length
        ? 0.45
        : 0.25;

    return {
      sharedIdeas,
      sharedAssumptions,
      sharedMethods,
      sharedInvariants,
      hasDuality,
      domainCompatibility,
      proofCompatibility,
      relationStrength: relation.strength || 0.5
    };
  }

  applyMutationOperator(operator, source, target, analysis) {
    const baseAssumptions = unique([
      ...(source.assumptions || []),
      ...(target.assumptions || [])
    ]);

    const removedAssumptions = [];
    const addedAssumptions = [];

    let proposedStatement = "";
    let expectedConclusion = "";

    if (operator === "generalization") {
      const removable = chooseWeakestAssumption(baseAssumptions);
      if (removable) removedAssumptions.push(removable);
      addedAssumptions.push("abstract structure preserving the shared invariant");
      proposedStatement =
        `If a structure preserves "${analysis.sharedInvariants[0] || source.coreInvariant || source.statementPattern}", then a generalized form of ${source.name} may transfer to ${target.domain}-like systems.`;
      expectedConclusion =
        `The conclusion pattern "${source.conclusionPattern || source.statementPattern}" survives under a broader abstraction, unless a removed assumption is essential.`;
    } else if (operator === "specialization") {
      addedAssumptions.push(`restricted to ${target.domain} setting`);
      addedAssumptions.push("stronger regularity / compatibility condition");
      proposedStatement =
        `Under ${target.domain}-specific constraints, ${source.name} may reduce to a simpler theorem pattern compatible with ${target.name}.`;
      expectedConclusion =
        "A more computable or visual special case appears, with lower counterexample risk.";
    } else if (operator === "dualization") {
      addedAssumptions.push("valid dual interpretation exists");
      addedAssumptions.push("objects and relations can be exchanged");
      proposedStatement =
        `The ${source.name} pattern may admit a dual form where "${source.coreInvariant}" is expressed through the relational structure of ${target.name}.`;
      expectedConclusion =
        "A primal-dual, local-global, or syntax-semantics correspondence becomes visible.";
    } else if (operator === "composition") {
      addedAssumptions.push("output pattern of first theorem matches input pattern of second theorem");
      addedAssumptions.push("shared concepts are type-compatible");
      proposedStatement =
        `Composing ${source.name}'s pattern "${source.statementPattern}" with ${target.name}'s pattern "${target.statementPattern}" may create a reusable proof pipeline.`;
      expectedConclusion =
        `The combined theorem transfers ${source.name}'s conclusion into the structural world of ${target.name}.`;
    } else if (operator === "discretization") {
      removedAssumptions.push("smoothness");
      addedAssumptions.push("local finite approximation");
      addedAssumptions.push("discrete consistency condition");
      proposedStatement =
        `A discrete analogue of ${source.name} may hold when local finite transitions preserve "${source.coreInvariant}".`;
      expectedConclusion = "A graph, lattice, or algorithmic version of the theorem emerges.";
    } else if (operator === "relaxation") {
      const removable = chooseWeakestAssumption(baseAssumptions);
      if (removable) removedAssumptions.push(removable);
      addedAssumptions.push("probabilistic validity");
      addedAssumptions.push("bounded error or convergence in expectation");
      proposedStatement =
        `A relaxed version of ${source.name} may hold approximately when supported by ${target.name}'s uncertainty or averaging pattern.`;
      expectedConclusion =
        "The theorem becomes approximate, probabilistic, or asymptotic instead of exact.";
    } else if (operator === "algorithmization") {
      addedAssumptions.push("constructive procedure exists");
      addedAssumptions.push("finite representation of objects");
      proposedStatement =
        `${source.name} can be converted into an executable search or transformation procedure using concepts from ${target.name}.`;
      expectedConclusion =
        "The theorem becomes a runnable algorithm, simulation, or proof-search routine.";
    } else if (operator === "counterexample search") {
      const removed = chooseMostDangerousAssumption(source, target);
      if (removed) removedAssumptions.push(removed);
      proposedStatement =
        `Remove "${removed || "one essential assumption"}" and test whether the conclusion pattern still survives.`;
      expectedConclusion =
        "If the conclusion fails, the removed assumption is structurally necessary.";
    } else {
      addedAssumptions.push("cross-domain compatibility condition");
      proposedStatement =
        `${source.name} and ${target.name} share enough structure to form a candidate bridge theorem.`;
      expectedConclusion = "The bridge should preserve at least one shared invariant.";
    }

    const finalAssumptions = unique([
      ...baseAssumptions.filter((item) => !removedAssumptions.includes(item)),
      ...addedAssumptions
    ]);

    return {
      assumptions: finalAssumptions,
      removedAssumptions,
      addedAssumptions,
      proposedStatement,
      expectedConclusion
    };
  }

  createProofPlan(operator, source, target, mutation, analysis) {
    const methods = unique([
      ...(analysis.sharedMethods || []),
      ...(source.proofMethods || []),
      ...(target.proofMethods || [])
    ]);

    const preferredMethod = methods[0] || "structural analogy";
    const steps = [];

    steps.push(`Formalize objects from ${source.name} and ${target.name}.`);
    steps.push("Check that all candidate assumptions are type-correct.");
    steps.push(`Identify shared invariant: ${analysis.sharedInvariants[0] || "unknown invariant"}.`);

    if (mutation.removedAssumptions.length > 0) {
      steps.push(`Test removed assumptions: ${mutation.removedAssumptions.join(", ")}.`);
      steps.push("Search for counterexample before attempting proof.");
    }

    if (operator === "composition") steps.push("Verify that conclusion of first theorem can feed into assumptions of second theorem.");
    if (operator === "dualization") steps.push("Construct dual mapping between objects, relations, assumptions, and conclusions.");
    if (operator === "generalization") steps.push("Replace concrete objects with abstract structure preserving the invariant.");
    if (operator === "algorithmization") steps.push("Convert proof construction into finite executable steps.");

    steps.push(`Attempt proof using: ${preferredMethod}.`);
    steps.push("Send formalized statement to Lean/Coq placeholder.");
    steps.push("Do not mark verified until proof checker confirms.");

    return {
      sketch:
        `Possible route: use ${preferredMethod} to connect "${source.coreInvariant}" with "${target.coreInvariant}". The proof is not trusted until formal verification or exhaustive counterexample search.`,
      steps
    };
  }

  searchCounterexampleTargets(operator, source, target, mutation, analysis) {
    const risks = [];
    for (const assumption of mutation.removedAssumptions || []) {
      risks.push({
        assumption,
        riskLevel: "high",
        reason: `The mutation removed "${assumption}", which may be essential.`,
        test: `Construct an object where "${assumption}" fails but other assumptions remain true.`
      });
    }
    for (const failure of [...(source.failureModes || []), ...(target.failureModes || [])]) {
      const triggered =
        mutation.removedAssumptions.includes(failure.assumption) ||
        Math.random() < this.settings.counterexampleAggression * 0.25;
      if (triggered) {
        risks.push({
          assumption: failure.assumption || "unknown",
          riskLevel: failure.severity || "medium",
          reason: failure.description || "Known theorem boundary may be triggered.",
          test: failure.counterexampleTarget || "Search for boundary case."
        });
      }
    }
    if (analysis.domainCompatibility < 0.35) {
      risks.push({
        assumption: "domain compatibility",
        riskLevel: "medium",
        reason: "The source and target theorem domains may not share enough structure.",
        test: "Build a type map between both domains before trusting the candidate."
      });
    }
    return risks;
  }

  scoreCandidate(payload) {
    const { source, target, relation, analysis, mutation, counterexamples } = payload;
    const sharedIdeaBoost = clamp(analysis.sharedIdeas.length / 12, 0, 1);
    const sharedMethodBoost = clamp(analysis.sharedMethods.length / 4, 0, 1);
    const relationBoost = relation.strength || 0.5;
    const removedAssumptionPenalty = clamp(mutation.removedAssumptions.length * 0.18, 0, 0.72);
    const formalDifficulty = ((source.formalizationDifficulty || 0.5) + (target.formalizationDifficulty || 0.5)) / 2;
    const counterexampleRisk = clamp(
      counterexamples.length * 0.13 + removedAssumptionPenalty + (1 - analysis.domainCompatibility) * 0.2,
      0,
      1
    );
    const proofReadiness = clamp(
      0.18 + sharedMethodBoost * 0.28 + relationBoost * 0.22 + analysis.proofCompatibility * 0.2 -
        formalDifficulty * 0.15 - removedAssumptionPenalty * 0.35,
      0,
      1
    );
    const noveltyScore = clamp(
      this.settings.creativity * 0.32 + this.settings.abstraction * 0.24 +
        Math.abs(source.abstraction - target.abstraction) * 0.22 + (1 - sharedIdeaBoost) * 0.12,
      0,
      1
    );
    const rigorRisk = clamp(1 - proofReadiness + counterexampleRisk * 0.45 + formalDifficulty * 0.25, 0, 1);
    const visualClarity = clamp(((source.visualPrimitives?.length || 0) + (target.visualPrimitives?.length || 0)) / 12, 0, 1);
    const generativePotential = clamp(
      source.generativePower * 0.25 + target.generativePower * 0.25 + noveltyScore * 0.2 +
        relationBoost * 0.2 + sharedIdeaBoost * 0.1,
      0,
      1
    );
    return { noveltyScore, rigorRisk, proofReadiness, counterexampleRisk, visualClarity, generativePotential };
  }

  classifyCandidate(scores) {
    if (scores.counterexampleRisk > 0.72) return "Counterexample Target";
    if (scores.proofReadiness > 0.72 && scores.rigorRisk < 0.45) return "Verification Ready Proof Target";
    if (scores.generativePotential > 0.72 && scores.noveltyScore > 0.62) return "High-Value Conjecture Candidate";
    if (scores.rigorRisk > 0.65) return "Speculative Mutation Candidate";
    return "Conjecture Candidate";
  }

  makeCandidateTitle(operator, source, target, scores) {
    const op = titleCase(operator.replaceAll("-", " "));
    if (scores.counterexampleRisk > 0.72) return `${op} Boundary Test: ${short(source.name)} x ${short(target.name)}`;
    if (scores.proofReadiness > 0.72) return `${op} Proof Target: ${short(source.name)} -> ${short(target.name)}`;
    return `${op} Bridge: ${short(source.name)} x ${short(target.name)}`;
  }

  createLeanHookPlaceholder(source, target, mutation) {
    return {
      status: "placeholder",
      targetSystem: "Lean/Coq/Isabelle",
      note: "This is not formal syntax yet. Convert objects, assumptions, and conclusion into theorem prover language.",
      pseudoFormalStatement: {
        parents: [source.name, target.name],
        assumptions: mutation.assumptions,
        claim: mutation.expectedConclusion
      }
    };
  }

  applyInteractionLearning(interaction) {
    const relation = this.findRelation(interaction.sourceId, interaction.targetId);
    if (!relation) return;
    const useful =
      interaction.analysis.sharedIdeas.length > 0 ||
      interaction.analysis.sharedMethods.length > 0 ||
      interaction.analysis.domainCompatibility > 0.55;
    const hasProofPlan = interaction.kind === "proofPlan" || interaction.analysis.proofCompatibility > 0.55;
    const counterexampleExtreme = interaction.kind === "counterexampleSearch" && interaction.analysis.domainCompatibility < 0.35;
    if (useful && hasProofPlan && !counterexampleExtreme) {
      relation.strength = clamp(relation.strength + 0.018, 0.05, 1);
    } else {
      relation.strength = clamp(relation.strength - 0.014, 0.05, 1);
    }
  }

  chooseOperator(source, target, relation) {
    const pool = unique([
      ...(source.mutationOperators || []),
      ...(target.mutationOperators || []),
      relation.type,
      "composition",
      "generalization",
      "specialization",
      "dualization",
      "counterexample search"
    ]);
    return weightedPick(pool.map((operator) => {
      let weight = 1;
      if (operator.includes("general")) weight += this.settings.abstraction;
      if (operator.includes("dual")) weight += 0.7;
      if (operator.includes("counter")) weight += this.settings.counterexampleAggression;
      if (operator.includes("composition")) weight += this.settings.creativity;
      if (operator.includes("algorithm")) weight += 0.55;
      return [operator, weight];
    }));
  }

  selectTeachableIdea(source, target) {
    const sourceIdeas = collectIdeas(source);
    const targetIdeas = new Set(collectIdeas(target));
    const missing = sourceIdeas.filter((idea) => !targetIdeas.has(idea));
    return missing[0] || randomItem(sourceIdeas) || source.coreInvariant || source.name;
  }

  selectRelation() {
    if (!this.relations.length) return null;
    return weightedPick(this.relations.map((relation) => [relation, Math.max(0.05, relation.strength || 0.5)]));
  }

  findRelation(a, b) {
    return this.relations.find(
      (relation) =>
        (relation.from === a && relation.to === b) ||
        (relation.from === b && relation.to === a)
    );
  }

  getTheorem(id) {
    return this.theorems.find((item) => item.id === id);
  }

  estimateDomainCompatibility(a, b, relation) {
    if (a === b) return 0.95;
    const bridgeMap = {
      "geometry:algebra": 0.72,
      "calculus:topology": 0.86,
      "topology:physics": 0.76,
      "probability:ai": 0.82,
      "analysis:ai": 0.78,
      "algebra:category": 0.82,
      "logic:computation": 0.9,
      "graph:optimization": 0.88,
      "analysis:algebra": 0.76,
      "topology:category": 0.74,
      "physics:algebra": 0.66
    };
    const key1 = `${a}:${b}`;
    const key2 = `${b}:${a}`;
    if (bridgeMap[key1]) return bridgeMap[key1];
    if (bridgeMap[key2]) return bridgeMap[key2];
    if (relation.type.includes("bridge") || relation.type.includes("correspondence") || relation.type.includes("duality")) {
      return 0.64;
    }
    return 0.42;
  }
}

function collectIdeas(theorem) {
  return unique([
    theorem.domain,
    theorem.coreInvariant,
    theorem.statementPattern,
    theorem.conclusionPattern,
    ...(theorem.objects || []),
    ...(theorem.assumptions || []),
    ...(theorem.teaches || []),
    ...(theorem.proofMethods || []),
    ...(theorem.visualPrimitives || []),
    ...(theorem.specialCases || []),
    ...(theorem.generalizations || []),
    ...(theorem.duals || [])
  ].filter(Boolean));
}

function chooseWeakestAssumption(assumptions = []) {
  const riskyWords = ["smooth", "continuous", "compact", "convex", "complete", "finite", "differentiable", "independent", "orientation", "coprime"];
  const scored = assumptions.map((assumption) => {
    const lower = assumption.toLowerCase();
    const risk = riskyWords.some((word) => lower.includes(word)) ? 2 : 1;
    return [assumption, risk];
  });
  scored.sort((a, b) => b[1] - a[1]);
  return scored[0]?.[0] || assumptions[0] || null;
}

function chooseMostDangerousAssumption(source, target) {
  const failures = [...(source.failureModes || []), ...(target.failureModes || [])];
  if (failures.length > 0) return failures[0].assumption;
  return chooseWeakestAssumption([...(source.assumptions || []), ...(target.assumptions || [])]);
}

function hasAny(list = [], values = []) {
  return list.some((item) => values.some((value) => String(item).toLowerCase().includes(String(value).toLowerCase())));
}

function intersection(a = [], b = []) {
  const bSet = new Set(b);
  return unique(a.filter((x) => bSet.has(x)));
}

function unique(list = []) {
  return [...new Set(list.filter(Boolean))];
}

function weightedPick(weightedItems) {
  const total = weightedItems.reduce((sum, [, weight]) => sum + weight, 0);
  if (total <= 0) return weightedItems[0]?.[0];
  let r = Math.random() * total;
  for (const [item, weight] of weightedItems) {
    r -= weight;
    if (r <= 0) return item;
  }
  return weightedItems[weightedItems.length - 1]?.[0];
}

function randomItem(list = []) {
  return list[Math.floor(Math.random() * list.length)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function titleCase(text) {
  return String(text).replace(/\w\S*/g, (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());
}

function short(name) {
  return String(name).replace("Theorem", "").replace("Correspondence", "Corr.").replace("Transform", "Trans.").replace("Fundamental", "Fund.").trim();
}
