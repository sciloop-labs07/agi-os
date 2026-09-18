import type { NetworkingScenario, NetworkingState } from "./types";

const seedDate = "2026-09-18T08:00:00.000Z";

export const networkingScenarios: NetworkingScenario[] = [
  {
    id: "warm-introduction",
    label: "Warm introduction strategy",
    description: "Find the shortest trustworthy path to one person who can change the outcome.",
    focus: "Access path × trust × specificity",
    defaultControls: { goalClarity: 82, relationshipStrength: 62, trust: 68, reciprocity: 76, timing: 70, followUpConsistency: 78, warmPathAvailability: 84, concentrationRisk: 26, valueBeforeAsk: 88 }
  },
  {
    id: "dormant-recovery",
    label: "Dormant network recovery",
    description: "Repair relationship freshness with useful, low-pressure value before asking for anything.",
    focus: "Freshness × value × follow-through",
    defaultControls: { goalClarity: 70, relationshipStrength: 54, trust: 60, reciprocity: 72, timing: 52, followUpConsistency: 86, warmPathAvailability: 62, concentrationRisk: 38, valueBeforeAsk: 92 }
  },
  {
    id: "weak-tie-discovery",
    label: "Weak-tie discovery",
    description: "Expand beyond the obvious cluster to reach new information, talent, and opportunity.",
    focus: "Diversity × relevance × exploration",
    defaultControls: { goalClarity: 74, relationshipStrength: 38, trust: 44, reciprocity: 64, timing: 68, followUpConsistency: 70, warmPathAvailability: 46, concentrationRisk: 24, valueBeforeAsk: 78 }
  }
];

export function createDefaultNetworkingState(): NetworkingState {
  return {
    version: 1,
    userLabel: "AGIOS Operator",
    selectedGoalId: "goal-customer-discovery",
    goals: [
      { id: "goal-customer-discovery", title: "Find three sharp customer discovery conversations", type: "customer", desiredOutcome: "Validate the highest-cost workflow pain before building more.", priority: 92, horizonDays: 21, createdAt: seedDate },
      { id: "goal-agent-experts", title: "Build an expert circle for agent evaluation", type: "expert", desiredOutcome: "Create a small feedback loop across research, product, and safety.", priority: 78, horizonDays: 45, createdAt: seedDate }
    ],
    people: [
      { id: "person-maya", name: "Maya Chen", role: "Product operator", organization: "Northstar Studio", kind: "customer", tags: ["workflow", "B2B", "early adopter"], source: "local", trust: 74, relevance: 94, reciprocity: 78, strength: 68, lastTouchDays: 8, responseRate: 82, preferredPath: "direct", notes: "Asked for a sharper view of operator workflows." },
      { id: "person-arjun", name: "Arjun Rao", role: "Applied AI researcher", organization: "Independent lab", kind: "expert", tags: ["evaluation", "agents", "research"], source: "founder-net", trust: 58, relevance: 91, reciprocity: 62, strength: 42, lastTouchDays: 36, responseRate: 64, preferredPath: "warm-intro", notes: "Strong fit for a technical feedback loop; needs a specific artifact." },
      { id: "person-lena", name: "Lena Ortiz", role: "Community builder", organization: "Builders Assembly", kind: "community", tags: ["community", "founders", "events"], source: "founder-net", trust: 66, relevance: 79, reciprocity: 74, strength: 51, lastTouchDays: 21, responseRate: 71, preferredPath: "community", notes: "Can open a high-context room when the contribution is useful to members." },
      { id: "person-samir", name: "Samir Patel", role: "Seed investor", organization: "Kite Ventures", kind: "investor", tags: ["AI", "seed", "systems"], source: "founder-net", trust: 46, relevance: 83, reciprocity: 48, strength: 28, lastTouchDays: 74, responseRate: 44, preferredPath: "warm-intro", notes: "Not a pitch target yet; build context and proof before asking." },
      { id: "person-jo", name: "Jo Williams", role: "Platform engineer", organization: "Cinder Cloud", kind: "talent", tags: ["infra", "platform", "reliability"], source: "local", trust: 61, relevance: 76, reciprocity: 69, strength: 55, lastTouchDays: 48, responseRate: 73, preferredPath: "direct", notes: "Useful peer for infrastructure trade-offs and future hiring context." },
      { id: "person-nikhil", name: "Nikhil Mehta", role: "Founder", organization: "Signal Commons", kind: "peer", tags: ["founder", "distribution", "learning"], source: "local", trust: 70, relevance: 72, reciprocity: 81, strength: 63, lastTouchDays: 15, responseRate: 88, preferredPath: "direct", notes: "High-trust peer; exchange experiments, not generic updates." },
      { id: "person-elise", name: "Elise Martin", role: "Research lead", organization: "Causal Systems Group", kind: "expert", tags: ["causality", "measurement", "science"], source: "founder-net", trust: 52, relevance: 86, reciprocity: 55, strength: 34, lastTouchDays: 92, responseRate: 51, preferredPath: "warm-intro", notes: "Weak tie with high information value; find a trusted bridge." },
      { id: "person-daniel", name: "Daniel Okafor", role: "Talent community lead", organization: "Open Systems Guild", kind: "community", tags: ["talent", "open source", "builders"], source: "founder-net", trust: 49, relevance: 80, reciprocity: 68, strength: 31, lastTouchDays: 67, responseRate: 58, preferredPath: "community", notes: "Better reached through contribution to the guild than a cold ask." }
    ],
    edges: [
      { id: "edge-maya-nikhil", sourceId: "person-maya", targetId: "person-nikhil", kind: "shared-context", strength: 62, trust: 68, reciprocity: 70, pathLength: 2, lastTouchDays: 15 },
      { id: "edge-nikhil-arjun", sourceId: "person-nikhil", targetId: "person-arjun", kind: "introduced-by", strength: 58, trust: 64, reciprocity: 61, pathLength: 2, lastTouchDays: 26 },
      { id: "edge-lena-daniel", sourceId: "person-lena", targetId: "person-daniel", kind: "community", strength: 74, trust: 71, reciprocity: 78, pathLength: 2, lastTouchDays: 18 },
      { id: "edge-arjun-elise", sourceId: "person-arjun", targetId: "person-elise", kind: "shared-context", strength: 68, trust: 72, reciprocity: 60, pathLength: 2, lastTouchDays: 31 },
      { id: "edge-jo-nikhil", sourceId: "person-jo", targetId: "person-nikhil", kind: "direct", strength: 54, trust: 61, reciprocity: 66, pathLength: 2, lastTouchDays: 40 },
      { id: "edge-samir-nikhil", sourceId: "person-samir", targetId: "person-nikhil", kind: "introduced-by", strength: 44, trust: 52, reciprocity: 47, pathLength: 2, lastTouchDays: 79 }
    ],
    touchpoints: [
      { id: "touch-maya", personId: "person-maya", kind: "meeting", valueOffered: "Shared a workflow map before the conversation.", asking: "Which pain is expensive enough to change behavior?", outcome: "positive", loggedAt: "2026-09-10T10:00:00.000Z", nextAction: "Send a concise synthesis and one follow-up question." },
      { id: "touch-nikhil", personId: "person-nikhil", kind: "value-share", valueOffered: "Compared two distribution experiments.", asking: "What would you test next?", outcome: "positive", loggedAt: "2026-09-03T10:00:00.000Z", nextAction: "Trade experiment results after the next run." }
    ],
    controls: networkingScenarios[0].defaultControls
  };
}
