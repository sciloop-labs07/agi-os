"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { paradigms } from "@/lib/paradigms";

export function ComparisonMatrix() {
  const data = paradigms.map((item) => ({
    name: item.name.replace(" Intelligence", "").replace(" AI", ""),
    energy: item.metrics.energyEfficiency,
    agi: item.metrics.agiPotential,
    maturity: item.metrics.hardwareMaturity
  }));

  return (
    <div className="h-[520px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 12, right: 16, bottom: 92, left: 0 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.14)" vertical={false} />
          <XAxis dataKey="name" angle={-42} textAnchor="end" interval={0} tick={{ fill: "#cbd5e1", fontSize: 11 }} />
          <YAxis tick={{ fill: "#cbd5e1", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#07111c", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }} />
          <Legend />
          <Bar dataKey="energy" fill="#48e5ff" radius={[4, 4, 0, 0]} />
          <Bar dataKey="agi" fill="#b6ff61" radius={[4, 4, 0, 0]} />
          <Bar dataKey="maturity" fill="#ff5f8f" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
