import { AppShell } from "@/components/app-shell";
import { Kicker, Panel } from "@/components/ui/panel";

const layers = [
  ["Interface", "Next.js App Router, Tailwind, shadcn-style primitives, Framer Motion-ready transitions, React Flow, Recharts."],
  ["Domain", "Structured paradigm model, graph relations, roadmap entities, simulation scenarios, research notes, experiments."],
  ["Persistence", "PostgreSQL with Prisma ORM. Optional Neo4j for deep graph traversal and vector database for semantic retrieval."],
  ["AI Layer", "Provider-neutral adapters for OpenAI, Claude, Gemini, Groq, and DeepSeek with prompt templates and audit logs."],
  ["Auth", "JWT/session foundation with User roles. Production path can add OAuth, SSO, organizations, and RBAC policies."],
  ["Deployment", "Vercel frontend/API routes with Supabase or Railway Postgres. Background jobs can move to queues/workers."]
];

export default function ArchitecturePage() {
  return (
    <AppShell active="/architecture">
      <Kicker>Full Project Architecture</Kicker>
      <h1 className="mt-3 text-3xl font-semibold text-white">Scalable platform blueprint</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {layers.map(([title, body]) => (
          <Panel key={title}>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
          </Panel>
        ))}
      </div>
      <Panel className="mt-6">
        <Kicker>Future Expansion Roadmap</Kicker>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {["Graph database sync", "Paper ingestion pipeline", "AI research copilots", "Experiment version control", "Evaluation harnesses", "Organization RBAC"].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300">{item}</div>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
