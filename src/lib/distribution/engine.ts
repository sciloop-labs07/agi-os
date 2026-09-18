import type { DistributionAssumptions, DistributionSimulation } from "./types";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const round = (value: number) => Math.round(value);

export function simulateDistribution(assumptions: DistributionAssumptions): DistributionSimulation {
  const audienceFit = clamp(assumptions.audienceFit);
  const messageClarity = clamp(assumptions.messageClarity);
  const proofStrength = clamp(assumptions.proofStrength);
  const visitRate = clamp(assumptions.visitRate);
  const activationRate = clamp(assumptions.activationRate);
  const retentionRate = clamp(assumptions.retentionRate);
  const referralRate = clamp(assumptions.referralRate);
  const horizon = Math.max(1, Math.round(assumptions.horizon));
  const qualityMultiplier = audienceFit * messageClarity * proofStrength;

  let seededReach = Math.max(0, assumptions.seedReach);
  let qualifiedReach = 0;
  let activations = 0;
  let retained = 0;
  let referrals = 0;

  for (let cycle = 0; cycle < horizon; cycle += 1) {
    const cycleQualifiedReach = seededReach * qualityMultiplier;
    const cycleActivations = cycleQualifiedReach * visitRate * activationRate;
    const cycleRetained = cycleActivations * retentionRate;
    const cycleReferrals = cycleRetained * referralRate;

    qualifiedReach += cycleQualifiedReach;
    activations += cycleActivations;
    retained += cycleRetained;
    referrals += cycleReferrals;
    seededReach = Math.max(assumptions.seedReach * 0.25, assumptions.seedReach + cycleReferrals);
  }

  const firstCycleQualifiedReach = assumptions.seedReach * qualityMultiplier;
  const firstCycleActivations = firstCycleQualifiedReach * visitRate * activationRate;
  const firstCycleRetained = firstCycleActivations * retentionRate;
  const firstCycleReferrals = firstCycleRetained * referralRate;
  const stageScores = [
    ["Audience fit", audienceFit],
    ["Message clarity", messageClarity],
    ["Proof strength", proofStrength],
    ["Channel visit rate", visitRate],
    ["Activation rate", activationRate],
    ["Retention rate", retentionRate],
    ["Referral rate", referralRate]
  ] as const;
  const bottleneck = [...stageScores].sort((left, right) => left[1] - right[1])[0][0];
  const leverageScore = clamp(
    ((audienceFit + messageClarity + proofStrength) / 3) * 0.3 +
    ((visitRate + activationRate) / 2) * 0.25 +
    retentionRate * 0.25 +
    referralRate * 0.2,
    0,
    1
  ) * 100;

  return {
    firstCycle: {
      qualifiedReach: round(firstCycleQualifiedReach),
      activations: round(firstCycleActivations),
      retained: round(firstCycleRetained),
      referrals: round(firstCycleReferrals)
    },
    funnel: [
      { id: "audience", label: "Seed reach", value: round(assumptions.seedReach) },
      { id: "reach", label: "Qualified reach", value: round(firstCycleQualifiedReach) },
      { id: "activation", label: "First-value activations", value: round(firstCycleActivations) },
      { id: "retention", label: "Retained users", value: round(firstCycleRetained) },
      { id: "referral", label: "Qualified referrals", value: round(firstCycleReferrals) }
    ],
    qualifiedReach: round(qualifiedReach),
    activations: round(activations),
    retained: round(retained),
    referrals: round(referrals),
    referralShare: qualifiedReach === 0 ? 0 : (referrals / qualifiedReach) * 100,
    compoundedReach: round(qualifiedReach + referrals),
    leverageScore: round(leverageScore),
    bottleneck
  };
}
