import { TheoremKernel } from "./theorem-kernel.js";
import { THEOREM_GENOMES, THEOREM_RELATIONS } from "./theorem-data.js";

class TheoremEcosystem {
  constructor(root) {
    this.root = root;
    this.settings = {
      creativity: 0.65,
      rigor: 0.72,
      abstraction: 0.7,
      counterexampleAggression: 0.55
    };
    this.timer = null;
    this.selectedTheoremId = THEOREM_GENOMES[0]?.id;
    this.selectedCandidateId = null;
    this.latestInteraction = null;
    this.proofRun = null;
    this.counterexampleResult = null;
    this.positions = {};
    this.resetKernel();
    this.mount();
    this.render();
  }

  resetKernel() {
    this.kernel = new TheoremKernel({
      theorems: THEOREM_GENOMES,
      relations: THEOREM_RELATIONS,
      settings: this.settings
    });
    this.selectedCandidateId = null;
    this.latestInteraction = null;
    this.proofRun = null;
    this.counterexampleResult = null;
    this.computePositions();
  }

  mount() {
    this.root.className = "theorem-ecosystem";
    this.root.innerHTML = `
      <section class="te-header">
        <div class="te-kicker">Living Theorem Ecosystem</div>
        <h2>Visual mathematical intelligence lab</h2>
        <p>
          Theorems are represented as agents with assumptions, proof methods, invariants, failure modes, and mutation operators.
          They interact by teaching, composing, generalizing, dualizing, relaxing, and challenging each other.
          The system does not blindly claim new theorems. It creates structured conjecture candidates, proof targets, and counterexample targets.
          A candidate becomes a theorem only after formal verification.
        </p>
      </section>
      <section class="te-controls">
        <div class="te-button-row">
          <button class="te-button primary" data-action="toggle">Start</button>
          <button class="te-button" data-action="step">Step Once</button>
          <button class="te-button" data-action="candidate">Generate Candidate</button>
          <button class="te-button warn" data-action="counterexample">Counterexample Search</button>
          <button class="te-button" data-action="proof">Run Proof Plan</button>
          <button class="te-button" data-action="reset">Reset</button>
        </div>
        <div class="te-sliders">
          ${this.slider("creativity", "Creativity")}
          ${this.slider("rigor", "Rigor")}
          ${this.slider("abstraction", "Abstraction")}
          ${this.slider("counterexampleAggression", "Counterexample Aggression")}
        </div>
      </section>
      <section class="te-layout">
        <div class="te-graph" data-role="graph"></div>
        <aside class="te-side">
          <div class="te-panel" data-role="inspector"></div>
          <div class="te-panel" data-role="lab"></div>
          <div class="te-panel" data-role="forge"></div>
          <div class="te-panel" data-role="sandbox"></div>
          <div class="te-panel" data-role="proof"></div>
        </aside>
      </section>
      <section class="te-log" data-role="log"></section>
    `;

    this.root.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]")?.dataset.action;
      if (action) this.handleAction(action);
      const theoremId = event.target.closest("[data-theorem-id]")?.dataset.theoremId;
      if (theoremId) {
        this.selectedTheoremId = theoremId;
        this.selectedCandidateId = null;
        this.render();
      }
      const candidateId = event.target.closest("[data-candidate-id]")?.dataset.candidateId;
      if (candidateId) {
        this.selectedCandidateId = candidateId;
        this.render();
      }
    });

    this.root.addEventListener("input", (event) => {
      const key = event.target.dataset.setting;
      if (!key) return;
      this.settings[key] = Number(event.target.value);
      this.kernel.setSettings(this.settings);
      this.renderControls();
    });
  }

  slider(key, label) {
    return `
      <div class="te-slider">
        <label><span>${label}</span><span data-value="${key}">${this.settings[key].toFixed(2)}</span></label>
        <input data-setting="${key}" type="range" min="0" max="1" step="0.01" value="${this.settings[key]}">
      </div>
    `;
  }

  handleAction(action) {
    if (action === "toggle") {
      if (this.timer) this.pause();
      else this.start();
    }
    if (action === "step") this.step();
    if (action === "candidate") this.generateCandidate();
    if (action === "counterexample") this.runCounterexample();
    if (action === "proof") this.runProofPlan();
    if (action === "reset") {
      this.pause();
      this.resetKernel();
      this.render();
    }
  }

  start() {
    this.pause();
    this.timer = setInterval(() => this.step(), 1200);
    this.renderControls();
  }

  pause() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.renderControls();
  }

  step() {
    const event = this.kernel.step();
    if (event) {
      this.latestInteraction = event;
      this.selectedTheoremId = event.targetId;
    }
    this.render();
  }

  generateCandidate() {
    const candidate = this.kernel.generateCandidate();
    if (candidate) {
      this.selectedCandidateId = candidate.id;
      this.selectedTheoremId = candidate.parents[1];
    }
    this.computePositions();
    this.render();
  }

  runCounterexample() {
    const candidate = this.selectedCandidate();
    if (!candidate) {
      const generated = this.kernel.generateCandidate(null, null, "counterexample search");
      this.selectedCandidateId = generated?.id ?? null;
    }
    const selected = this.selectedCandidate();
    if (!selected) return;
    this.counterexampleResult = this.kernel.runCounterexampleSearch(selected.id);
    this.render();
  }

  runProofPlan() {
    const candidate = this.selectedCandidate() || this.kernel.generateCandidate(null, null, "composition");
    if (!candidate) return;
    this.selectedCandidateId = candidate.id;
    this.proofRun = {
      candidateId: candidate.id,
      status: "Proof Target only. Not verified.",
      steps: candidate.proofPlanSteps
    };
    this.kernel.events.unshift({
      tick: this.kernel.tick,
      kind: "proof-plan-run",
      candidateId: candidate.id,
      summary: `Proof plan prepared for ${candidate.title}. Formal verification still required.`
    });
    this.render();
  }

  selectedTheorem() {
    return this.kernel.getTheorem(this.selectedTheoremId) || this.kernel.theorems[0];
  }

  selectedCandidate() {
    return this.kernel.candidates.find((candidate) => candidate.id === this.selectedCandidateId) || this.kernel.candidates[0] || null;
  }

  computePositions() {
    const width = 900;
    const height = 460;
    const cx = width / 2;
    const cy = height / 2;
    const radius = 185;
    this.positions = {};
    this.kernel.theorems.forEach((theorem, index) => {
      const angle = (Math.PI * 2 * index) / this.kernel.theorems.length - Math.PI / 2;
      this.positions[theorem.id] = {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius
      };
    });
  }

  render() {
    this.renderControls();
    this.renderGraph();
    this.renderInspector();
    this.renderLab();
    this.renderForge();
    this.renderSandbox();
    this.renderProof();
    this.renderLog();
  }

  renderControls() {
    this.root.querySelector('[data-action="toggle"]').textContent = this.timer ? "Pause" : "Start";
    Object.entries(this.settings).forEach(([key, value]) => {
      const el = this.root.querySelector(`[data-value="${key}"]`);
      if (el) el.textContent = Number(value).toFixed(2);
    });
  }

  renderGraph() {
    const graph = this.root.querySelector('[data-role="graph"]');
    const candidates = this.kernel.candidates.slice(0, 7);
    const candidatePositions = {};
    candidates.forEach((candidate, index) => {
      candidatePositions[candidate.id] = { x: 140 + index * 110, y: 540 };
    });

    const recent = this.latestInteraction;
    const relationLines = this.kernel.relations.map((relation) => {
      const a = this.positions[relation.from];
      const b = this.positions[relation.to];
      if (!a || !b) return "";
      const strongClass = relation.strength > 0.68 ? "strong" : relation.strength < 0.48 ? "weak" : "";
      const recentClass = recent && recent.sourceId === relation.from && recent.targetId === relation.to ? "recent" : "";
      return `<line class="te-edge ${strongClass} ${recentClass}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke-width="${Math.max(1, relation.strength * 5)}" />`;
    }).join("");

    const theoremNodes = this.kernel.theorems.map((theorem) => {
      const p = this.positions[theorem.id];
      const selected = theorem.id === this.selectedTheoremId ? "selected" : "";
      return `
        <g class="te-node verified ${selected}" data-theorem-id="${theorem.id}">
          <circle cx="${p.x}" cy="${p.y}" r="34"></circle>
          <text x="${p.x}" y="${p.y + 52}" text-anchor="middle">${escapeXml(shortName(theorem.name))}</text>
          <text x="${p.x}" y="${p.y + 66}" text-anchor="middle">${escapeXml(theorem.domain)}</text>
        </g>
      `;
    }).join("");

    const candidateEdges = candidates.map((candidate) => {
      const p = candidatePositions[candidate.id];
      return candidate.parents.map((parent) => {
        const a = this.positions[parent];
        return a ? `<line class="te-edge weak" x1="${a.x}" y1="${a.y}" x2="${p.x}" y2="${p.y}" stroke-width="1" />` : "";
      }).join("");
    }).join("");

    const candidateNodes = candidates.map((candidate) => {
      const p = candidatePositions[candidate.id];
      const highRisk = candidate.scores.counterexampleRisk > 0.7 ? "counterexample" : "";
      const proofReady = candidate.scores.proofReadiness > 0.72 ? "proof-ready" : "";
      const selected = candidate.id === this.selectedCandidateId ? "selected" : "";
      return `
        <g class="te-node candidate ${highRisk} ${proofReady} ${selected}" data-candidate-id="${candidate.id}">
          <circle cx="${p.x}" cy="${p.y}" r="26"></circle>
          <text x="${p.x}" y="${p.y + 43}" text-anchor="middle">${escapeXml(candidate.type.replace(" Candidate", ""))}</text>
        </g>
      `;
    }).join("");

    graph.innerHTML = `
      <svg viewBox="0 0 900 620" role="img" aria-label="Living theorem ecosystem graph">
        <defs>
          <marker id="te-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="rgba(72,229,255,.7)"></path>
          </marker>
        </defs>
        ${relationLines}
        ${candidateEdges}
        ${theoremNodes}
        ${candidateNodes}
      </svg>
    `;
  }

  renderInspector() {
    const theorem = this.selectedTheorem();
    this.root.querySelector('[data-role="inspector"]').innerHTML = `
      <h3>Theorem Genome Inspector</h3>
      <div class="te-kicker">${theorem.verified ? "Verified source theorem" : "Unverified node"} / ${escapeHtml(theorem.domain)}</div>
      <p class="te-small"><b>${escapeHtml(theorem.name)}</b></p>
      ${field("Statement pattern", theorem.statementPattern)}
      ${field("Conclusion pattern", theorem.conclusionPattern)}
      ${field("Core invariant", theorem.coreInvariant)}
      ${pillList("Assumptions", theorem.assumptions)}
      ${pillList("Proof methods", theorem.proofMethods)}
      ${pillList("Failure modes", (theorem.failureModes || []).map((item) => item.assumption))}
    `;
  }

  renderLab() {
    const event = this.latestInteraction || this.kernel.events[0];
    this.root.querySelector('[data-role="lab"]').innerHTML = `
      <h3>Evolution Lab</h3>
      ${event ? `
        <div class="te-kicker">tick ${event.tick} / ${event.kind}</div>
        <p class="te-small">${escapeHtml(event.summary || "Structured interaction event generated.")}</p>
        ${event.transferredIdea ? field("Transferred idea", event.transferredIdea) : ""}
        ${event.analysis ? `
          ${field("Domain compatibility", pct(event.analysis.domainCompatibility))}
          ${field("Proof compatibility", pct(event.analysis.proofCompatibility))}
          ${pillList("Shared concepts", event.analysis.sharedIdeas.slice(0, 8))}
        ` : ""}
      ` : `<p class="te-small">Press Step Once to produce a structured theorem interaction.</p>`}
    `;
  }

  renderForge() {
    const candidates = this.kernel.candidates;
    this.root.querySelector('[data-role="forge"]').innerHTML = `
      <h3>Candidate Forge</h3>
      <p class="te-small">Generated outputs are candidates only. They are not verified theorems.</p>
      <div class="te-list" style="display:grid">
        ${candidates.length ? candidates.map((candidate) => `
          <div class="te-candidate ${candidate.id === this.selectedCandidateId ? "active" : ""}" data-candidate-id="${candidate.id}">
            <div class="te-candidate-type">${escapeHtml(candidate.type)}</div>
            <b>${escapeHtml(candidate.title)}</b>
            <div class="te-small">${escapeHtml(candidate.verificationStatus)}</div>
          </div>
        `).join("") : `<p class="te-small">No candidates yet. Press Generate Candidate.</p>`}
      </div>
    `;
  }

  renderSandbox() {
    const candidate = this.selectedCandidate();
    const risks = candidate?.possibleCounterexamples || [];
    this.root.querySelector('[data-role="sandbox"]').innerHTML = `
      <h3>Counterexample Sandbox</h3>
      ${candidate ? `
        ${pillList("Removed assumptions", candidate.removedAssumptions || [])}
        ${risks.length ? risks.slice(0, 5).map((risk) => `
          <div class="te-pill te-warning" style="display:block;margin:6px 0;border-radius:7px">
            <b>${escapeHtml(risk.riskLevel || "risk")}</b>: ${escapeHtml(risk.reason || risk.explanation || "Boundary case.")}
            <br><span>${escapeHtml(risk.test || risk.target || "Search for counterexample.")}</span>
          </div>
        `).join("") : `<p class="te-small">No counterexample risk has been triggered yet.</p>`}
      ` : `<p class="te-small">Select or generate a candidate to inspect counterexample targets.</p>`}
    `;
  }

  renderProof() {
    const candidate = this.selectedCandidate();
    this.root.querySelector('[data-role="proof"]').innerHTML = `
      <h3>Proof Plan Panel</h3>
      ${candidate ? `
        <div class="te-candidate-type">${escapeHtml(candidate.type)}</div>
        <p class="te-small">${escapeHtml(candidate.proofSketch)}</p>
        <ol class="te-small">
          ${(candidate.proofPlanSteps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
        </ol>
        ${field("Formal verification hook", candidate.leanHookPlaceholder?.targetSystem || "Lean/Coq/Isabelle placeholder")}
        <div class="te-score">
          ${scoreRows(candidate.scores)}
        </div>
      ` : `<p class="te-small">Generate a candidate to prepare a proof route. No verification is claimed.</p>`}
    `;
  }

  renderLog() {
    const log = this.root.querySelector('[data-role="log"]');
    log.innerHTML = this.kernel.events.slice(0, 8).map((event) => `
      <div class="te-log-item"><b>tick ${event.tick ?? this.kernel.tick}</b> / ${escapeHtml(event.kind)}: ${escapeHtml(event.summary || event.title || "structured event")}</div>
    `).join("");
  }
}

function field(label, value) {
  return `<p class="te-small"><b>${escapeHtml(label)}:</b> ${escapeHtml(String(value ?? "none"))}</p>`;
}

function pillList(label, items = []) {
  return `
    <div style="margin:10px 0">
      <div class="te-small"><b>${escapeHtml(label)}</b></div>
      <div class="te-list">${items.length ? items.map((item) => `<span class="te-pill">${escapeHtml(String(item))}</span>`).join("") : `<span class="te-pill">none</span>`}</div>
    </div>
  `;
}

function scoreRows(scores) {
  return Object.entries(scores).map(([key, value]) => `
    <div class="te-score-row">
      <span>${escapeHtml(key)}</span>
      <div class="te-score-bar"><span style="width:${Math.round(value * 100)}%"></span></div>
      <span>${Math.round(value * 100)}</span>
    </div>
  `).join("");
}

function pct(value) {
  return `${Math.round(Number(value || 0) * 100)}%`;
}

function shortName(name) {
  return String(name).replace("Theorem", "Thm.").replace("Correspondence", "Corr.");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function escapeXml(value) {
  return escapeHtml(value);
}

function initTheoremEcosystems() {
  document.querySelectorAll("[data-theorem-ecosystem-root]").forEach((root) => {
    if (root.dataset.initialized === "true") return;
    root.dataset.initialized = "true";
    root.__theoremEcosystem = new TheoremEcosystem(root);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTheoremEcosystems);
} else {
  initTheoremEcosystems();
}

window.SciLoopTheoremEcosystem = { init: initTheoremEcosystems, TheoremEcosystem };
