"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { ArrowRight, BarChart3, BookOpen, CircleAlert, CircleCheck, Gauge, GitBranch, Lightbulb, RotateCcw, Target, Users, Zap } from "lucide-react";
import ReactFlow, { Background, Controls, Handle, MarkerType, MiniMap, Position, type NodeProps } from "reactflow";
import "reactflow/dist/style.css";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Kicker, Panel } from "@/components/ui/panel";
import { distributionChannels, distributionExperiments, distributionFlowEdges, distributionFlowNodes, distributionRules, distributionScenarios, getDistributionStage, simulateDistribution, type DistributionAssumptionKey, type DistributionAssumptions, type DistributionPresetId, type DistributionStage } from "@/lib/distribution";

const integer = (value: number) => value.toLocaleString("en-US", { maximumFractionDigits: 0 });
const oneDecimal = (value: number) => value.toFixed(1);

function DistributionStageNode({ data, selected }: NodeProps<DistributionStage>) {
  return (
    <div className="min-w-[190px] rounded-xl border bg-slate-950/95 p-3 shadow-[0_12px_32px_rgba(0,0,0,.25)]" style={{ borderColor: `${data.accent}66`, boxShadow: selected ? `0 0 0 2px ${data.accent}, 0 0 30px ${data.accent}33` : undefined }}>
      <Handle type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border-2 !border-slate-950" style={{ background: data.accent }} />
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: data.accent }}>0{data.index}</span>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-slate-500">stage</span>
      </div>
      <div className="mt-3 text-sm font-semibold text-white">{data.label}</div>
      <div className="mt-1 text-xs leading-5 text-slate-400">{data.shortLabel}</div>
      <Handle type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border-2 !border-slate-950" style={{ background: data.accent }} />
    </div>
  );
}

const nodeTypes = { distributionStage: DistributionStageNode };

function MetricCard({ label, value, detail, tone = "cyan" }: { label: string; value: string; detail: string; tone?: "cyan" | "lime" | "amber" | "rose" }) {
  const toneClasses = { cyan: "border-cyan-signal/20", lime: "border-lime-signal/20", amber: "border-amber-300/20", rose: "border-rose-300/20" };
  return <div className={`rounded-xl border bg-white/[0.03] p-4 ${toneClasses[tone]}`}><p className="text-xs text-slate-400">{label}</p><p className="mt-2 text-2xl font-semibold text-white">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div>;
}

function SliderField({ id, label, value, min, max, step, display, onChange }: { id: string; label: string; value: number; min: number; max: number; step: number; display: string; onChange: (value: number) => void }) {
  return <label htmlFor={id} className="block"><div className="flex items-center justify-between gap-3 text-xs text-slate-300"><span>{label}</span><span className="font-mono text-cyan-100">{display}</span></div><input id={id} aria-label={label} className="mt-2 h-1.5 w-full cursor-pointer accent-cyan-300" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

function FunnelRow({ label, value, maximum, highlighted }: { label: string; value: number; maximum: number; highlighted?: boolean }) {
  const width = maximum <= 0 ? 0 : Math.max(3, Math.min(100, (value / maximum) * 100));
  return <div className="space-y-1.5"><div className="flex items-center justify-between gap-3 text-xs"><span className={highlighted ? "text-amber-200" : "text-slate-400"}>{label}</span><span className="font-mono text-slate-200">{integer(value)}</span></div><div className="h-2 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-gradient-to-r from-cyan-signal to-lime-signal" style={{ width: `${width}%` }} /></div></div>;
}

export function DistributionPortal() {
  const [presetId, setPresetId] = useState<DistributionPresetId | "custom">("base");
  const [assumptions, setAssumptions] = useState<DistributionAssumptions>(distributionScenarios.base.assumptions);
  const [selectedStageId, setSelectedStageId] = useState("audience");
  const selectedStage = getDistributionStage(selectedStageId as DistributionStage["id"]);
  const simulation = useMemo(() => simulateDistribution(assumptions), [assumptions]);

  const updateAssumption = useCallback((key: DistributionAssumptionKey, value: number) => {
    setPresetId("custom");
    setAssumptions((current) => ({ ...current, [key]: value }));
  }, []);

  const applyPreset = useCallback((nextPreset: DistributionPresetId) => {
    setPresetId(nextPreset);
    setAssumptions(distributionScenarios[nextPreset].assumptions);
  }, []);

  const reset = useCallback(() => applyPreset("base"), [applyPreset]);

  return <AppShell active="/distribution">
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-cyan-signal/20 bg-slate-950/75 p-6 sm:p-8">
        <div className="absolute -right-20 -top-24 size-80 rounded-full bg-cyan-signal/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <Kicker className="flex items-center gap-2 text-cyan-signal"><GitBranch className="size-4" /> AGI OS / DISTRIBUTION SYSTEM</Kicker>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Distribution is how good work reaches the right people.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">A strategy workspace for AI builders and researchers to understand the distribution loop, find its bottleneck, and choose the next learning experiment.</p>
          </div>
          <div className="max-w-sm rounded-xl border border-lime-signal/25 bg-lime-signal/[0.07] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-lime-100"><Target className="size-4" /> Core definition</div>
            <p className="mt-2 text-sm leading-6 text-lime-50/80">Distribution is the system that moves a product from existence to the right person’s attention, first value, repeat use, and onward spread.</p>
          </div>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Scenario qualified reach" value={integer(simulation.qualifiedReach)} detail={`${assumptions.horizon} cycle horizon`} />
        <MetricCard label="First-value activations" value={integer(simulation.activations)} detail="People who reached a useful outcome" tone="lime" />
        <MetricCard label="Referral share" value={`${oneDecimal(simulation.referralShare)}%`} detail="Share of qualified reach from referrals" tone="amber" />
        <MetricCard label="Current bottleneck" value={simulation.bottleneck} detail={`${simulation.leverageScore}/100 leverage score`} tone="rose" />
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,.8fr)]">
        <div className="space-y-6">
          <Panel className="overflow-hidden border-cyan-signal/20 bg-slate-950/75 p-0">
            <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
              <div><Kicker className="text-cyan-signal">System map</Kicker><h2 className="mt-2 text-2xl font-semibold text-white">The distribution loop</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Attention is only the first handoff. The system becomes durable when value creates return visits, referrals, and better proof.</p></div>
              <div className="flex items-center gap-2 text-xs text-slate-500"><span className="size-2 rounded-full bg-cyan-signal" /> click a stage for operating detail</div>
            </div>
            <div className="h-[500px] min-h-[500px] w-full bg-[#050b14] sm:h-[590px] sm:min-h-[590px]">
              <ReactFlow nodes={distributionFlowNodes} edges={distributionFlowEdges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.22 }} minZoom={0.18} maxZoom={1.35} onNodeClick={(_, node) => setSelectedStageId(node.id)} defaultEdgeOptions={{ markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: "#48e5ff", strokeWidth: 1.6 } }} proOptions={{ hideAttribution: true }}>
                <Background color="rgba(72,229,255,.12)" gap={28} size={1} />
                <MiniMap nodeColor={(node) => (node.data as DistributionStage).accent} maskColor="rgba(2,6,23,.78)" pannable zoomable />
                <Controls showInteractive={false} />
              </ReactFlow>
            </div>
          </Panel>

          <Panel className="border-white/10 bg-slate-950/60">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><Kicker style={{ color: selectedStage.accent }}>Selected stage · 0{selectedStage.index}</Kicker><h2 className="mt-2 text-2xl font-semibold text-white">{selectedStage.label}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{selectedStage.purpose}</p></div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400">Primary metric <span className="ml-1 text-white">{selectedStage.metric}</span></div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-white/10 p-4"><p className="text-xs text-slate-500">Required inputs</p><p className="mt-2 text-sm leading-6 text-slate-200">{selectedStage.inputs}</p></div>
              <div className="rounded-lg border border-rose-300/15 bg-rose-300/[0.04] p-4"><p className="flex items-center gap-2 text-xs text-rose-200"><CircleAlert className="size-3.5" /> Failure mode</p><p className="mt-2 text-sm leading-6 text-slate-300">{selectedStage.failureMode}</p></div>
              <div className="rounded-lg border border-lime-signal/15 bg-lime-signal/[0.04] p-4"><p className="flex items-center gap-2 text-xs text-lime-200"><Lightbulb className="size-3.5" /> Next experiment</p><p className="mt-2 text-sm leading-6 text-slate-300">{selectedStage.nextExperiment}</p></div>
            </div>
          </Panel>
        </div>

        <Panel className="border-lime-signal/20 bg-slate-950/75 xl:sticky xl:top-6">
          <div className="flex items-start justify-between gap-3"><div><Kicker className="text-lime-signal">Scenario simulator</Kicker><h2 className="mt-2 text-2xl font-semibold text-white">Find the constraint</h2></div><Gauge className="size-6 text-lime-signal" /></div>
          <p className="mt-3 text-sm leading-6 text-slate-400">Change the assumptions and see how the loop responds. These are scenario outputs, not measured evidence.</p>
          <label className="mt-5 block text-sm font-medium text-white" htmlFor="distribution-preset">Operating preset</label>
          <select id="distribution-preset" value={presetId} onChange={(event) => event.target.value === "custom" ? undefined : applyPreset(event.target.value as DistributionPresetId)} className="mt-2 w-full rounded-md border border-white/15 bg-slate-900 px-3 py-2 text-sm text-white"><option value="conservative">Conservative</option><option value="base">Base</option><option value="breakout">Breakout</option><option value="custom">Custom adjustments</option></select>
          <p className="mt-2 text-xs leading-5 text-slate-500">{presetId === "custom" ? "Custom scenario" : distributionScenarios[presetId].description}</p>
          <div className="mt-6 space-y-5">
            <SliderField id="seed-reach" label="Seed reach" value={assumptions.seedReach} min={1000} max={50000} step={500} display={integer(assumptions.seedReach)} onChange={(value) => updateAssumption("seedReach", value)} />
            <SliderField id="audience-fit" label="Audience fit" value={assumptions.audienceFit} min={0} max={1} step={0.01} display={`${Math.round(assumptions.audienceFit * 100)}%`} onChange={(value) => updateAssumption("audienceFit", value)} />
            <SliderField id="message-clarity" label="Message clarity" value={assumptions.messageClarity} min={0} max={1} step={0.01} display={`${Math.round(assumptions.messageClarity * 100)}%`} onChange={(value) => updateAssumption("messageClarity", value)} />
            <SliderField id="proof-strength" label="Proof / trust strength" value={assumptions.proofStrength} min={0} max={1} step={0.01} display={`${Math.round(assumptions.proofStrength * 100)}%`} onChange={(value) => updateAssumption("proofStrength", value)} />
            <SliderField id="visit-rate" label="Channel visit rate" value={assumptions.visitRate} min={0} max={0.4} step={0.01} display={`${Math.round(assumptions.visitRate * 100)}%`} onChange={(value) => updateAssumption("visitRate", value)} />
            <SliderField id="activation-rate" label="Activation rate" value={assumptions.activationRate} min={0} max={1} step={0.01} display={`${Math.round(assumptions.activationRate * 100)}%`} onChange={(value) => updateAssumption("activationRate", value)} />
            <SliderField id="retention-rate" label="Retention rate" value={assumptions.retentionRate} min={0} max={1} step={0.01} display={`${Math.round(assumptions.retentionRate * 100)}%`} onChange={(value) => updateAssumption("retentionRate", value)} />
            <SliderField id="referral-rate" label="Referral rate" value={assumptions.referralRate} min={0} max={0.5} step={0.01} display={`${Math.round(assumptions.referralRate * 100)}%`} onChange={(value) => updateAssumption("referralRate", value)} />
            <SliderField id="horizon" label="Simulation horizon" value={assumptions.horizon} min={1} max={12} step={1} display={`${assumptions.horizon} cycles`} onChange={(value) => updateAssumption("horizon", value)} />
          </div>
          <Button type="button" variant="outline" className="mt-6 w-full" onClick={reset}><RotateCcw className="size-4" /> Reset to base</Button>
          <div className="mt-6 border-t border-white/10 pt-5"><div className="flex items-center justify-between gap-3"><div><Kicker className="text-cyan-signal">Scenario output</Kicker><p className="mt-1 text-sm text-slate-300">Compounded reach</p></div><span className="text-2xl font-semibold text-white">{integer(simulation.compoundedReach)}</span></div><div className="mt-4 space-y-4">{simulation.funnel.map((stage) => <FunnelRow key={stage.id} label={stage.label} value={stage.value} maximum={simulation.funnel[0].value} highlighted={stage.id === "activation"} />)}</div></div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel><div className="flex items-center gap-3"><BookOpen className="size-5 text-amber-300" /><div><Kicker className="text-amber-200">Operating rules</Kicker><h2 className="mt-1 text-2xl font-semibold text-white">Rules that protect the loop</h2></div></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{distributionRules.map((rule) => <article key={rule.index} className="rounded-lg border border-white/10 bg-white/[0.025] p-4"><div className="flex items-start justify-between gap-3"><span className="font-mono text-xs text-amber-200">0{rule.index}</span><CircleCheck className="size-4 text-lime-signal" /></div><h3 className="mt-3 text-sm font-semibold text-white">{rule.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{rule.body}</p><p className="mt-3 border-t border-white/10 pt-3 text-xs leading-5 text-rose-200/75">Failure: {rule.failureMode}</p></article>)}</div></Panel>
        <Panel><div className="flex items-center gap-3"><Users className="size-5 text-cyan-signal" /><div><Kicker className="text-cyan-signal">Channel ecosystem</Kicker><h2 className="mt-1 text-2xl font-semibold text-white">Where the system can travel</h2></div></div><div className="mt-5 space-y-3">{distributionChannels.map((channel) => <article key={channel.id} className="rounded-lg border border-white/10 bg-white/[0.025] p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-sm font-semibold text-white">{channel.label}</h3><span className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.14em] ${channel.status === "ready" ? "border-lime-signal/25 bg-lime-signal/[0.06] text-lime-200" : channel.status === "learning" ? "border-amber-300/25 bg-amber-300/[0.06] text-amber-200" : "border-white/15 text-slate-400"}`}>{channel.status}</span></div><p className="mt-2 text-sm text-slate-300">{channel.audience}</p><div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2"><span>Native format: <b className="font-normal text-slate-300">{channel.format}</b></span><span>Trust asset: <b className="font-normal text-slate-300">{channel.trustAsset}</b></span><span>Learning speed: <b className="font-normal capitalize text-cyan-200">{channel.learningSpeed}</b></span><span>Next: <b className="font-normal text-slate-300">{channel.nextExperiment}</b></span></div></article>)}</div></Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
        <Panel><div className="flex items-center gap-3"><Lightbulb className="size-5 text-lime-signal" /><div><Kicker className="text-lime-signal">Experiment queue</Kicker><h2 className="mt-1 text-2xl font-semibold text-white">Learn before scaling</h2></div></div><div className="mt-5 grid gap-3 md:grid-cols-3">{distributionExperiments.map((experiment) => <article key={experiment.id} className="rounded-lg border border-white/10 bg-white/[0.025] p-4"><div className="flex items-start justify-between gap-3"><h3 className="text-sm font-semibold text-white">{experiment.title}</h3><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-200">{experiment.status}</span></div><p className="mt-3 text-sm leading-6 text-slate-400">{experiment.hypothesis}</p><div className="mt-4 space-y-2 border-t border-white/10 pt-3 text-xs"><p className="text-slate-500">Success <span className="text-slate-300">{experiment.successMetric}</span></p><p className="text-slate-500">Guardrail <span className="text-slate-300">{experiment.guardrail}</span></p></div></article>)}</div></Panel>
        <Panel className="border-cyan-signal/20 bg-cyan-signal/[0.04]"><BarChart3 className="size-6 text-cyan-signal" /><Kicker className="mt-5 text-cyan-signal">Keep the loop honest</Kicker><h2 className="mt-2 text-xl font-semibold text-white">Reach is not distribution.</h2><p className="mt-3 text-sm leading-6 text-slate-300">A distribution system earns the right to scale when attention becomes value, value becomes return use, and return use creates qualified spread.</p><Link href="/market-fit" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-signal hover:text-white">Open Market Fit <ArrowRight className="size-4" /></Link><div className="mt-6 flex items-center gap-2 text-xs text-slate-500"><Zap className="size-4 text-lime-signal" /> Scenario-only · no live campaigns</div></Panel>
      </div>
    </div>
  </AppShell>;
}
