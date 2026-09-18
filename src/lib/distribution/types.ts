export type DistributionPresetId = "conservative" | "base" | "breakout";

export type DistributionStageId =
  | "audience"
  | "message"
  | "channel"
  | "reach"
  | "activation"
  | "retention"
  | "referral"
  | "compounding";

export type DistributionAssumptionKey =
  | "seedReach"
  | "audienceFit"
  | "messageClarity"
  | "proofStrength"
  | "visitRate"
  | "activationRate"
  | "retentionRate"
  | "referralRate"
  | "horizon";

export interface DistributionAssumptions {
  seedReach: number;
  audienceFit: number;
  messageClarity: number;
  proofStrength: number;
  visitRate: number;
  activationRate: number;
  retentionRate: number;
  referralRate: number;
  horizon: number;
}

export interface DistributionScenario {
  id: DistributionPresetId;
  label: string;
  description: string;
  assumptions: DistributionAssumptions;
}

export interface DistributionStage {
  id: DistributionStageId;
  index: number;
  label: string;
  shortLabel: string;
  purpose: string;
  inputs: string;
  metric: string;
  failureMode: string;
  nextExperiment: string;
  accent: string;
}

export interface DistributionChannel {
  id: string;
  label: string;
  audience: string;
  format: string;
  trustAsset: string;
  learningSpeed: "fast" | "medium" | "slow";
  status: "ready" | "learning" | "queued";
  nextExperiment: string;
}

export interface DistributionRule {
  index: number;
  title: string;
  body: string;
  failureMode: string;
}

export interface DistributionExperiment {
  id: string;
  title: string;
  hypothesis: string;
  successMetric: string;
  guardrail: string;
  status: "next" | "queued" | "later";
}

export interface DistributionFunnelStage {
  id: DistributionStageId;
  label: string;
  value: number;
}

export interface DistributionSimulation {
  firstCycle: {
    qualifiedReach: number;
    activations: number;
    retained: number;
    referrals: number;
  };
  funnel: DistributionFunnelStage[];
  qualifiedReach: number;
  activations: number;
  retained: number;
  referrals: number;
  referralShare: number;
  compoundedReach: number;
  leverageScore: number;
  bottleneck: string;
}
