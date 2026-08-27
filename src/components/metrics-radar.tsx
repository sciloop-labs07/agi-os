"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Paradigm } from "@/lib/types";

const metricLabels: Record<string, string> = {
  energyEfficiency: "Energy",
  scalability: "Scale",
  hardwareMaturity: "Hardware",
  agiPotential: "AGI",
  learningEfficiency: "Learning",
  safety: "Safety",
  economicFeasibility: "Economics",
  realWorldInteraction: "World"
};

export function MetricsRadar({ paradigm }: { paradigm: Paradigm }) {
  const data = Object.entries(metricLabels).map(([key, label]) => ({
    metric: label,
    value: paradigm.metrics[key as keyof typeof paradigm.metrics]
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(148, 163, 184, 0.25)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "#cbd5e1", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#07111c", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }} />
          <Radar dataKey="value" stroke="#48e5ff" fill="#48e5ff" fillOpacity={0.22} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
