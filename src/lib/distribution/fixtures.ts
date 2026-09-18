import type { DistributionAssumptions, DistributionChannel, DistributionExperiment, DistributionRule, DistributionScenario, DistributionStage, DistributionStageId } from "./types";

export const distributionStages: DistributionStage[] = [
  { id: "audience", index: 1, label: "Audience", shortLabel: "Who has the problem?", purpose: "Choose the smallest group with a real, urgent reason to care.", inputs: "Specific person, painful problem, reachable context", metric: "Qualified audience fit", failureMode: "Trying to reach everyone before learning who cares.", nextExperiment: "Interview ten AI builders about the first job they would hire Skyloop to do.", accent: "#48e5ff" },
  { id: "message", index: 2, label: "Message + proof", shortLabel: "Why believe it?", purpose: "Turn the product’s value into a clear promise supported by evidence.", inputs: "Promise, proof asset, language, point of view", metric: "Message response rate", failureMode: "A clever claim with no visible reason to trust it.", nextExperiment: "Compare an outcome-first message with a mechanism-first message.", accent: "#b6ff61" },
  { id: "channel", index: 3, label: "Native channel", shortLabel: "Where does it travel?", purpose: "Package the message in the format and social context the audience already uses.", inputs: "Channel, format, sender, cadence", metric: "Channel learning speed", failureMode: "Copying the same asset into every channel.", nextExperiment: "Publish one native demonstration in a technical community and one in a founder feed.", accent: "#f4d35e" },
  { id: "reach", index: 4, label: "Qualified reach", shortLabel: "Who sees it?", purpose: "Earn attention from people who plausibly have the problem and context to act.", inputs: "Distribution surface, audience fit, timing", metric: "Qualified reach", failureMode: "Celebrating impressions that never become useful visits.", nextExperiment: "Tag the next 100 visitors by audience fit instead of counting raw views.", accent: "#ff9f68" },
  { id: "activation", index: 5, label: "Activation", shortLabel: "Do they get value?", purpose: "Move attention to a first meaningful outcome as quickly as possible.", inputs: "First-value path, onboarding, proof of work", metric: "First-value rate", failureMode: "Sending attention to a product that needs too much explanation.", nextExperiment: "Measure completion of the first useful visual explanation.", accent: "#ff5f8f" },
  { id: "retention", index: 6, label: "Retention", shortLabel: "Do they return?", purpose: "Give the user a reason to come back because the product keeps helping.", inputs: "Repeat job, memory, progress, reliability", metric: "Repeat-use rate", failureMode: "Acquiring people faster than the product can keep them.", nextExperiment: "Test a saved research trail against a one-off result.", accent: "#d39bff" },
  { id: "referral", index: 7, label: "Referral", shortLabel: "Does it spread?", purpose: "Create a natural reason for a satisfied user to bring in another qualified person.", inputs: "Shareable artifact, invitation, identity, timing", metric: "Qualified referral rate", failureMode: "Adding referral mechanics before users have a story worth sharing.", nextExperiment: "Offer a shareable explanation artifact after a successful session.", accent: "#65d8ff" },
  { id: "compounding", index: 8, label: "Compounding", shortLabel: "Does the loop strengthen?", purpose: "Reinvest learning and user-generated proof into the next distribution cycle.", inputs: "Feedback, evidence, repeatable channel, learning cadence", metric: "Referral share of new reach", failureMode: "Scaling a channel before its economics and trust are repeatable.", nextExperiment: "Run three cycles and compare referral-led reach with seeded reach.", accent: "#b6ff61" }
];

export const distributionFlowNodes = distributionStages.map((stage) => ({
  id: stage.id,
  type: "distributionStage",
  position: { x: (stage.index - 1) * 260, y: stage.index % 2 === 0 ? 120 : 30 },
  data: stage
}));

export const distributionFlowEdges = distributionStages.slice(0, -1).map((stage, index) => ({
  id: `${stage.id}-${distributionStages[index + 1].id}`,
  source: stage.id,
  target: distributionStages[index + 1].id,
  type: "smoothstep",
  animated: index >= 6,
  label: index === 0 ? "focus" : index >= 6 ? "learn + repeat" : "moves"
})).concat({
  id: "compounding-message",
  source: "compounding",
  target: "message",
  type: "smoothstep",
  animated: true,
  label: "feeds learning back"
});

const base: DistributionAssumptions = {
  seedReach: 12000,
  audienceFit: 0.72,
  messageClarity: 0.68,
  proofStrength: 0.62,
  visitRate: 0.12,
  activationRate: 0.36,
  retentionRate: 0.48,
  referralRate: 0.08,
  horizon: 6
};

export const distributionScenarios: Record<DistributionScenario["id"], DistributionScenario> = {
  conservative: { id: "conservative", label: "Conservative", description: "Low trust, narrow reach, and slower learning.", assumptions: { ...base, seedReach: 7000, audienceFit: 0.55, messageClarity: 0.5, proofStrength: 0.42, visitRate: 0.08, activationRate: 0.24, retentionRate: 0.34, referralRate: 0.04, horizon: 4 } },
  base: { id: "base", label: "Base", description: "A credible early distribution system with room to learn.", assumptions: base },
  breakout: { id: "breakout", label: "Breakout", description: "Strong proof, clear value, and a healthy referral loop.", assumptions: { ...base, seedReach: 22000, audienceFit: 0.84, messageClarity: 0.82, proofStrength: 0.8, visitRate: 0.18, activationRate: 0.52, retentionRate: 0.64, referralRate: 0.16, horizon: 8 } }
};

export const distributionRules: DistributionRule[] = [
  { index: 1, title: "Start with a specific audience and problem.", body: "A narrow wedge gives every message, channel, and experiment a chance to become legible.", failureMode: "Broad reach with no clear reason to care." },
  { index: 2, title: "Pair every message with credible proof.", body: "Trust travels with the claim: show the mechanism, result, artifact, or person who can vouch for it.", failureMode: "A promise that asks the audience to do all the believing." },
  { index: 3, title: "Adapt the format to the channel.", body: "Distribution is not copy-paste publishing; each surface has its own native behavior and social contract.", failureMode: "One asset repeated everywhere with declining signal." },
  { index: 4, title: "Optimize for first value, not impressions.", body: "The real handoff is attention to a useful outcome, not attention to another view count.", failureMode: "High reach with no first-understanding moment." },
  { index: 5, title: "Build feedback into every channel.", body: "Every distribution surface should teach you something about the audience, message, or product.", failureMode: "Activity without a learning loop." },
  { index: 6, title: "Measure stage-to-stage conversion and retention.", body: "Track where people fall out of the system and whether the product earns a return visit.", failureMode: "Optimizing a top-line number while the middle is leaking." },
  { index: 7, title: "Earn repeatability before adding paid reach.", body: "Paid reach can amplify a working system, but it cannot repair weak trust or activation.", failureMode: "Buying more attention before understanding the funnel." },
  { index: 8, title: "Scale only when the loop stays healthy.", body: "Trust, activation, retention, and referral quality must remain intact as volume grows.", failureMode: "Growth that creates support load and churn faster than value." }
];

export const distributionChannels: DistributionChannel[] = [
  { id: "direct-outreach", label: "Direct founder + researcher outreach", audience: "Technical founders, lab leads, and AI researchers", format: "Personal demo, sharp question, and interview", trustAsset: "Specific insight from the recipient’s workflow", learningSpeed: "fast", status: "ready", nextExperiment: "Run 10 conversations around the first valuable research outcome." },
  { id: "technical-communities", label: "Technical communities", audience: "Builders already discussing hard AI problems", format: "Native teardown, experiment, or open question", trustAsset: "Transparent method and useful artifact", learningSpeed: "fast", status: "learning", nextExperiment: "Compare an evidence-first post with a product-first post." },
  { id: "visual-demonstrations", label: "Build-in-public visual demonstrations", audience: "AI-curious builders and product thinkers", format: "Short visual before/after or live walkthrough", trustAsset: "Visible transformation in under one minute", learningSpeed: "medium", status: "learning", nextExperiment: "Test mechanism-first versus outcome-first demonstrations." },
  { id: "research-partnerships", label: "Research + creator partnerships", audience: "Trusted voices with overlapping technical audiences", format: "Co-authored explainer, lab session, or guest walkthrough", trustAsset: "Borrowed credibility with clear attribution", learningSpeed: "medium", status: "queued", nextExperiment: "Identify three collaborators who already explain the target problem." },
  { id: "evergreen-search", label: "Search + evergreen explanations", audience: "People actively looking for difficult concepts", format: "Searchable explanation with interactive visual", trustAsset: "Depth, citations, and a useful answer before the pitch", learningSpeed: "slow", status: "queued", nextExperiment: "Measure search-to-first-value instead of visits alone." }
];

export const distributionExperiments: DistributionExperiment[] = [
  { id: "first-value-interviews", title: "First-value conversation sprint", hypothesis: "Direct conversations reveal the language and proof needed to make activation obvious.", successMetric: "8 of 10 interviews identify the same first job", guardrail: "No unsupported promise is added to the message", status: "next" },
  { id: "native-demo-format", title: "Native demonstration test", hypothesis: "A channel-native visual demonstration creates more qualified visits than a generic announcement.", successMetric: "Qualified visit rate by format", guardrail: "Activation rate does not fall below the current baseline", status: "queued" },
  { id: "shareable-artifact", title: "Shareable research artifact", hypothesis: "A useful output gives satisfied users a natural reason to introduce another builder.", successMetric: "Qualified referrals per activated user", guardrail: "Referral quality matches the target audience wedge", status: "later" }
];

export function getDistributionStage(id: DistributionStageId) {
  return distributionStages.find((stage) => stage.id === id) ?? distributionStages[0];
}
