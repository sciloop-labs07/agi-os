import type { CredibilityScore } from "@/lib/types";
import { MetricBar } from "@/components/ui/panel";

const labels: Array<[keyof CredibilityScore, string]> = [
  ["evidenceStrength", "Evidence"],
  ["reproducibilityLikelihood", "Reproducibility"],
  ["experimentalValidation", "Validation"],
  ["engineeringFeasibility", "Engineering"],
  ["thermodynamicFeasibility", "Thermodynamics"],
  ["scalabilityFeasibility", "Scalability"],
  ["timelineRealism", "Timeline realism"],
  ["hypeScore", "Hype risk"]
];

export function CredibilityGrid({ score }: { score: CredibilityScore }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {labels.map(([key, label]) => (
        <MetricBar key={key} label={label} value={score[key]} />
      ))}
    </div>
  );
}
