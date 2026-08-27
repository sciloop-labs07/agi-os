# AGI Research Operating System

A production-oriented Next.js platform for structured AI paradigm research, comparison, execution planning, knowledge graphs, and future simulation.

## What It Contains

- Command dashboard for the overall research operating system
- Dedicated AI paradigm portals for 15 paradigms
- Cross-paradigm comparison engine with charts
- React Flow knowledge graph for causal and dependency mapping
- Research workspace for notes, hypotheses, tags, and experiments
- AGI roadmap planner
- Future simulation surface for compute, energy, hardware, and recursive improvement scenarios
- Imagination engine for possible-world search, counterfactual branching, hypotheses, experiments, and safety risks
- Maths AI imagination v2 for latent equation blending, rule retrieval, validity filtering, geometric trajectories, and proof-step sketches
- Shadow Field Theory Lab for modeling hidden traces as expected reality minus actual reality across physics, cyber, AI, and human systems
- Negative Trace Intelligence Lab for learning from what did not happen: absence, failed attempts, missing context, contradictions, and hidden assumptions
- Real-time frontier intelligence system for live research monitoring, credibility scoring, bottleneck mapping, hybrid AGI architecture generation, and physics validation
- Prisma/PostgreSQL schema covering the core domain model
- API routes for paradigms, graph data, notes, auth session flow, and AI generation
- Provider-neutral AI adapter with OpenAI wired and Claude/Gemini/Groq/DeepSeek extension points

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion-ready architecture
- shadcn-style local UI primitives
- React Flow
- Recharts
- Prisma ORM
- PostgreSQL
- JWT auth utilities

## Key Folders

```txt
src/app                 Next.js routes, API routes, and pages
src/components          Reusable UI, graph, chart, shell, and cards
src/lib                 Domain data, graph model, auth, AI providers, utilities
prisma/schema.prisma    Production database schema
prisma/seed.ts          Initial paradigm and graph seed script
```

## Run Locally

```bash
npm install
npm run dev -- -p 3003
```

Open `http://localhost:3003`.

This project uses port `3003` so it stays separate from PX (`3000`), Denver OS (`3002`), and SciLoop main (`3010`).

## Database

Copy `.env.example` to `.env` and set `DATABASE_URL`.

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

The schema includes:

- `AIParadigm`
- `Principle`
- `Mechanism`
- `Equation`
- `Advantage`
- `Disadvantage`
- `Bottleneck`
- `InnovationOpportunity`
- `ResearchPaper`
- `ResearchNote`
- `Experiment`
- `TechnologyDependency`
- `FuturePrediction`
- `Company`
- `Scientist`
- `ConceptNode`
- `ConceptRelation`
- `IntelligenceSource`
- `FrontierResearchItem`
- `AGIBottleneckSignal`
- `HybridArchitecture`
- `PhysicsValidation`
- `IdeaMutation`
- `User`

FounderNet architecture and scale plan: [`docs/foundernet-architecture.md`](docs/foundernet-architecture.md)

## API Surface

- `GET /api/paradigms`
- `GET /api/paradigms/[slug]`
- `GET /api/graph`
- `GET /api/research/notes`
- `POST /api/research/notes`
- `POST /api/ai/generate`
- `POST /api/imagination/generate`
- `POST /api/maths-ai/imagine`
- `GET /api/intelligence/sources`
- `GET /api/intelligence/items`
- `GET /api/intelligence/bottlenecks`
- `GET /api/intelligence/hybrids`
- `GET /api/intelligence/validation`
- `GET /api/intelligence/compression`
- `GET /api/intelligence/ideas`
- `GET /api/intelligence/snapshot`
- `GET /api/intelligence/ingest`
- `POST /api/intelligence/ingest`
- `POST /api/auth/register`
- `GET /api/auth/session`
- `POST /api/auth/logout`

## Deployment

Recommended first deployment:

- Vercel for the Next.js app and API routes
- Supabase or Railway for PostgreSQL
- Environment variables from `.env.example`

Scale path:

- Add Neo4j for deep graph traversal
- Add pgvector, Pinecone, Weaviate, or Qdrant for semantic paper/note retrieval
- Add background workers for paper ingestion, graph extraction, and AI report generation
- Add OAuth/SSO, organizations, RBAC, audit logs, and billing if this becomes multi-user

## Frontier Intelligence System

The source registry monitors arXiv, Semantic Scholar, GitHub, Hugging Face, OpenAI Research, Anthropic Research, Google DeepMind, NVIDIA Research, MIT, Stanford, Nature, Science, semiconductor news, photonic computing companies, neuromorphic startups, AI benchmark releases, robotics research, alignment papers, patents, and venture funding signals.

The intelligence pipeline:

- Ingests papers, articles, repositories, benchmarks, patents, and funding signals
- Extracts claims, mechanisms, bottlenecks, contradictions, and convergence trends
- Scores scientific credibility, hype risk, reproducibility, validation status, engineering feasibility, thermodynamic feasibility, scalability, and timeline realism
- Maps AGI bottlenecks across compute, memory, energy, bandwidth, training, embodiment, scaling laws, and fabrication
- Generates hybrid architectures such as photonic + neuromorphic, electronic + optical interconnects, embodied multi-agent systems, and verified recursive self-improving agents
- Compresses research into concise insights, causal maps, bottleneck trees, innovation opportunities, and strategic execution plans
- Mutates unrelated ideas into novel hypotheses and breakthrough pathways
- Validates proposed architectures against thermodynamics, information theory, memory bandwidth, energy efficiency, fabrication, latency, and scaling limits

`vercel.json` configures Vercel Cron to call `/api/intelligence/ingest` every 6 hours. The first live adapters support arXiv and GitHub; sources requiring credentials or deeper extraction are represented as production-ready connector slots.

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```

## Sale diligence verification

For a buyer-ready local evidence bundle, run:

```bash
npm run sale:verify
```

This runs the TypeScript typecheck, the Maths AI Python unit tests, and the seeded verified experiment, then writes a timestamped report to `output/agi-os-sale/SALE-VERIFICATION-REPORT.json`. It does not contact external services, use API keys, or claim production readiness.
