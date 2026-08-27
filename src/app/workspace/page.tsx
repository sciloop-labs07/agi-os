import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Kicker, Panel } from "@/components/ui/panel";
import { paradigms } from "@/lib/paradigms";

const notes = [
  { title: "Photonic nonlinearity map", tags: ["photonic", "hardware"], body: "Survey mechanisms for optical nonlinear activation and memory integration." },
  { title: "Recursive improvement gates", tags: ["safety", "agents"], body: "Define approval checkpoints for self-modifying code and tool creation." },
  { title: "Hybrid paradigm router", tags: ["architecture", "execution"], body: "Score task routing by latency, reliability, energy, privacy, and verifiability." }
];

export default function WorkspacePage() {
  return (
    <AppShell active="/workspace">
      <Kicker>Research Workspace</Kicker>
      <h1 className="mt-3 text-3xl font-semibold text-white">Notes, hypotheses, experiments</h1>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <Panel>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-white">Hypothesis editor</h2>
            <Button variant="outline">Save note</Button>
          </div>
          <input className="mt-5 h-11 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-white outline-none focus:border-cyan-signal/70" defaultValue="Can hybrid intelligence reduce AGI bottleneck risk?" />
          <textarea
            className="mt-3 min-h-72 w-full rounded-md border border-white/10 bg-slate-950 p-3 font-mono text-sm leading-6 text-slate-200 outline-none focus:border-cyan-signal/70"
            defaultValue={`## Hypothesis\nA routed hybrid architecture can outperform a monolithic digital model when the task needs physical grounding, energy-efficient sensing, institutional reasoning, and auditability.\n\n## Experiment\nCompare digital-only agents against a hybrid plan using robotics simulators, retrieval memory, formal validators, and human review loops.\n\n## Success metric\nHigher task reliability per dollar, lower unsafe-action rate, and improved causal explanation quality.`}
          />
        </Panel>
        <div className="space-y-4">
          <Panel>
            <Kicker>Attach Context</Kicker>
            <select className="mt-4 h-11 w-full rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-slate-200">
              {paradigms.map((paradigm) => <option key={paradigm.slug}>{paradigm.name}</option>)}
            </select>
            <div className="mt-3 flex flex-wrap gap-2">
              {["hypothesis", "roadmap", "paper", "experiment", "risk"].map((tag) => (
                <span key={tag} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300">{tag}</span>
              ))}
            </div>
          </Panel>
          <Panel>
            <Kicker>Recent Notes</Kicker>
            <div className="mt-4 space-y-3">
              {notes.map((note) => (
                <div key={note.title} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <h3 className="text-sm font-semibold text-white">{note.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{note.body}</p>
                  <div className="mt-3 flex gap-2">
                    {note.tags.map((tag) => <span key={tag} className="font-mono text-[10px] uppercase text-cyan-signal">{tag}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
