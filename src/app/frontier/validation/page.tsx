import { AppShell } from "@/components/app-shell";
import { Kicker, MetricBar, Panel } from "@/components/ui/panel";
import { hybridArchitectures, physicsValidations } from "@/lib/frontier/engine";

export default function PhysicsValidationPage() {
  return (
    <AppShell active="/frontier">
      <Kicker>Physics & Reality Validation Layer</Kicker>
      <h1 className="mt-3 text-3xl font-semibold text-white">Reality checks for proposed architectures</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
        Every architecture is evaluated against thermodynamics, information theory, memory bandwidth, energy efficiency,
        fabrication feasibility, communication latency, and scaling limits.
      </p>
      <div className="mt-6 grid gap-5">
        {physicsValidations.map((validation) => {
          const architecture = hybridArchitectures.find((item) => item.id === validation.architectureId);
          return (
            <Panel key={validation.architectureId}>
              <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
                <div>
                  <Kicker>{validation.verdict.replaceAll("_", " ")}</Kicker>
                  <h2 className="mt-2 text-xl font-semibold text-white">{architecture?.name}</h2>
                  <div className="mt-4 space-y-2">
                    {validation.notes.map((note) => <p key={note} className="text-sm leading-6 text-slate-400">{note}</p>)}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <MetricBar label="Thermodynamics" value={validation.thermodynamics} />
                  <MetricBar label="Information theory" value={validation.informationTheory} />
                  <MetricBar label="Memory bandwidth" value={validation.memoryBandwidth} />
                  <MetricBar label="Energy efficiency" value={validation.energyEfficiency} />
                  <MetricBar label="Fabrication" value={validation.fabricationFeasibility} />
                  <MetricBar label="Communication latency" value={validation.communicationLatency} />
                  <MetricBar label="Scaling limits" value={validation.scalingLimits} />
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </AppShell>
  );
}
