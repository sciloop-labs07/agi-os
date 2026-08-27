export const THEOREM_GENOMES = [
  {
    id: "pythagorean",
    name: "Pythagorean Theorem",
    domain: "geometry",
    objects: ["right triangle", "Euclidean plane", "length", "orthogonal components"],
    assumptions: ["Euclidean geometry", "right angle", "flat metric"],
    statementPattern: "orthogonal components combine by squared magnitude",
    conclusionPattern: "total distance squared equals sum of component squares",
    coreInvariant: "metric distance",
    proofMethods: ["area rearrangement", "similar triangles", "inner product identity"],
    teaches: ["distance", "orthogonality", "metric", "energy form"],
    visualPrimitives: ["right triangle", "squares on sides", "orthogonal axes"],
    mutationOperators: ["generalization", "deformation", "algorithmization"],
    specialCases: ["2D Euclidean distance"],
    generalizations: ["inner product spaces", "Hilbert spaces", "Parseval identity"],
    duals: ["energy decomposition"],
    failureModes: [
      {
        assumption: "Euclidean geometry",
        severity: "high",
        description: "On curved surfaces, the Euclidean squared-distance relation does not generally hold.",
        counterexampleTarget: "Use a triangle on a sphere or hyperbolic surface."
      },
      {
        assumption: "right angle",
        severity: "high",
        description: "Without orthogonality, the law of cosines introduces an extra term.",
        counterexampleTarget: "Use a non-right triangle."
      }
    ],
    counterexampleTemplates: ["curved triangle", "non-orthogonal vectors"],
    formalizationDifficulty: 0.25,
    confidence: 0.99,
    abstraction: 0.62,
    generativePower: 0.84,
    verified: true
  },
  {
    id: "stokes",
    name: "Stokes' Theorem",
    domain: "topology",
    objects: ["manifold", "boundary", "differential form", "orientation"],
    assumptions: ["smooth manifold", "orientation", "boundary compatibility", "differentiable form"],
    statementPattern: "integral over boundary equals integral of derivative over region",
    conclusionPattern: "boundary behavior encodes interior change",
    coreInvariant: "local-global boundary relation",
    proofMethods: ["partition of unity", "differential forms", "local coordinate reduction"],
    teaches: ["boundary", "local-global relation", "field flow", "conservation"],
    visualPrimitives: ["surface", "boundary loop", "flow arrows", "field"],
    mutationOperators: ["generalization", "specialization", "dualization", "discretization"],
    specialCases: ["Fundamental Theorem of Calculus", "Green's Theorem", "Divergence Theorem"],
    generalizations: ["de Rham cohomology", "generalized Stokes theorem"],
    duals: ["cohomology-homology pairing"],
    failureModes: [
      {
        assumption: "orientation",
        severity: "high",
        description: "Without orientation, signs and integration over boundary may become ill-defined.",
        counterexampleTarget: "Use a non-orientable surface."
      },
      {
        assumption: "smooth manifold",
        severity: "medium",
        description: "Singular spaces require generalized integration theory.",
        counterexampleTarget: "Use a region with singular boundary."
      }
    ],
    counterexampleTemplates: ["non-orientable surface", "singular boundary"],
    formalizationDifficulty: 0.85,
    confidence: 0.96,
    abstraction: 0.94,
    generativePower: 0.98,
    verified: true
  },
  {
    id: "bayes",
    name: "Bayes' Theorem",
    domain: "probability",
    objects: ["events", "conditional probability", "evidence", "hypothesis"],
    assumptions: ["nonzero evidence probability", "well-defined probability space"],
    statementPattern: "posterior belief equals likelihood times prior normalized by evidence",
    conclusionPattern: "belief updates through evidence",
    coreInvariant: "probability mass conservation under conditioning",
    proofMethods: ["conditional probability definition", "probability algebra"],
    teaches: ["belief update", "evidence", "posterior", "uncertainty"],
    visualPrimitives: ["belief bars", "evidence arrow", "probability flow"],
    mutationOperators: ["composition", "relaxation", "algorithmization"],
    specialCases: ["Bayesian classification", "diagnostic testing"],
    generalizations: ["Bayesian networks", "Bayesian inference", "Bayesian decision theory"],
    duals: ["likelihood-prior dual view"],
    failureModes: [
      {
        assumption: "nonzero evidence probability",
        severity: "high",
        description: "Conditioning on zero-probability events is not directly defined in elementary probability.",
        counterexampleTarget: "Try conditioning on an impossible event."
      }
    ],
    counterexampleTemplates: ["zero evidence probability", "misleading base rate"],
    formalizationDifficulty: 0.35,
    confidence: 0.97,
    abstraction: 0.78,
    generativePower: 0.91,
    verified: true
  },
  {
    id: "noether",
    name: "Noether's Theorem",
    domain: "physics",
    objects: ["action", "symmetry", "continuous transformation", "conserved current"],
    assumptions: ["differentiable action", "continuous symmetry", "variational principle"],
    statementPattern: "continuous symmetry implies conservation law",
    conclusionPattern: "invariant transformation produces conserved quantity",
    coreInvariant: "symmetry-conservation correspondence",
    proofMethods: ["calculus of variations", "Lie group symmetry", "Euler-Lagrange equations"],
    teaches: ["symmetry", "invariance", "conservation", "physical law"],
    visualPrimitives: ["symmetry orbit", "conserved flow", "motion path"],
    mutationOperators: ["generalization", "dualization", "composition"],
    specialCases: ["time symmetry gives energy conservation", "space symmetry gives momentum conservation"],
    generalizations: ["gauge theory", "field theory conservation laws"],
    duals: ["symmetry-current correspondence"],
    failureModes: [
      {
        assumption: "continuous symmetry",
        severity: "high",
        description: "Discrete symmetries do not directly give the same conserved currents through the classical theorem.",
        counterexampleTarget: "Use a system with only discrete symmetry."
      }
    ],
    counterexampleTemplates: ["broken symmetry", "dissipative system"],
    formalizationDifficulty: 0.82,
    confidence: 0.95,
    abstraction: 0.93,
    generativePower: 0.98,
    verified: true
  },
  {
    id: "curry-howard",
    name: "Curry-Howard Correspondence",
    domain: "computation",
    objects: ["proof", "program", "type", "proposition"],
    assumptions: ["formal logic", "typed computation", "constructive interpretation"],
    statementPattern: "propositions correspond to types and proofs correspond to programs",
    conclusionPattern: "proof construction can be treated as computation",
    coreInvariant: "proof-program identity",
    proofMethods: ["type interpretation", "lambda calculus", "structural induction"],
    teaches: ["proof as program", "type safety", "formal verification", "constructive proof"],
    visualPrimitives: ["proof tree", "program block", "type arrow"],
    mutationOperators: ["algorithmization", "formalization", "composition"],
    specialCases: ["simply typed lambda calculus", "intuitionistic logic"],
    generalizations: ["dependent type theory", "homotopy type theory"],
    duals: ["syntax-semantics correspondence"],
    failureModes: [
      {
        assumption: "constructive interpretation",
        severity: "medium",
        description: "Classical principles require translations or additional control operators.",
        counterexampleTarget: "Use unrestricted law of excluded middle in constructive setting."
      }
    ],
    counterexampleTemplates: ["classical nonconstructive proof"],
    formalizationDifficulty: 0.7,
    confidence: 0.94,
    abstraction: 0.95,
    generativePower: 0.94,
    verified: true
  },
  {
    id: "yoneda",
    name: "Yoneda Lemma",
    domain: "category",
    objects: ["category", "object", "functor", "natural transformation"],
    assumptions: ["locally small category", "functor category", "natural transformations"],
    statementPattern: "an object is determined by its relationships to all other objects",
    conclusionPattern: "identity is recoverable from relational behavior",
    coreInvariant: "object-as-relations",
    proofMethods: ["natural transformation construction", "representable functors"],
    teaches: ["relation identity", "abstraction", "functorial thinking", "representation"],
    visualPrimitives: ["object node", "relationship web", "mapping arrows"],
    mutationOperators: ["categorification", "generalization", "composition", "dualization"],
    specialCases: ["representable functor behavior"],
    generalizations: ["enriched Yoneda", "higher category analogues"],
    duals: ["co-Yoneda lemma"],
    failureModes: [
      {
        assumption: "natural transformations",
        severity: "high",
        description: "Without naturality, the relational identity loses coherence.",
        counterexampleTarget: "Use arbitrary maps that do not commute naturally."
      }
    ],
    counterexampleTemplates: ["non-natural mapping"],
    formalizationDifficulty: 0.9,
    confidence: 0.93,
    abstraction: 1.0,
    generativePower: 0.97,
    verified: true
  }
];

export const THEOREM_RELATIONS = [
  { from: "pythagorean", to: "stokes", type: "local-global geometry bridge", strength: 0.42 },
  { from: "stokes", to: "noether", type: "conservation bridge", strength: 0.82 },
  { from: "bayes", to: "curry-howard", type: "belief-to-proof bridge", strength: 0.52 },
  { from: "curry-howard", to: "yoneda", type: "abstraction bridge", strength: 0.72 },
  { from: "yoneda", to: "noether", type: "relation-symmetry bridge", strength: 0.58 },
  { from: "pythagorean", to: "noether", type: "invariant structure bridge", strength: 0.54 },
  { from: "bayes", to: "yoneda", type: "object-as-evidence relation", strength: 0.46 }
];
