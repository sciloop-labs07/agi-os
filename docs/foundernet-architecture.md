# FounderNet Architecture

FounderNet is an AI-native intelligence layer over the startup ecosystem. It is not a social network, founder directory, or co-founder matching product.

Its two primary outputs are:

1. The highest-value person to meet today.
2. The highest-return action to take next.

Every feature must improve one of those decisions and retain a link to the original source platform for execution.

## System architecture

~~~mermaid
flowchart LR
  Sources[Official APIs, RSS, exports, webhooks] --> Connectors[Connector services]
  Connectors --> Events[Canonical event log]
  Events --> Graph[Entity and relationship extraction]
  Graph --> Postgres[(PostgreSQL)]
  Graph --> Neo4j[(Neo4j read model)]
  Graph --> Qdrant[(Qdrant vectors)]
  Events --> Redis[Redis streams and jobs]
  Neo4j --> Relationships[Relationship intelligence]
  Qdrant --> Discovery[Semantic discovery]
  Relationships --> Opportunities[Opportunity engine]
  Discovery --> Opportunities
  Opportunities --> Copilot[AI Founder Copilot]
  Opportunities --> Dashboard[Founder dashboard]
  Copilot --> Actions[Approved actions on original platforms]
~~~

| Boundary | Responsibility | First deployment | Scale path |
| --- | --- | --- | --- |
| Web | Founder UI, BFF routes, streaming | Next.js App Router | Separate web and API deployment |
| Identity | Auth, organizations, roles, consent | Next.js utilities and PostgreSQL | NestJS Identity service and OIDC |
| Connectors | Official ingestion and source health | FounderNet connector registry | Queue-backed worker services |
| Events | Immutable normalized events and replay | TypeScript projections and Prisma | Redis Streams or Kafka |
| Graph | Nodes, edges, evidence, paths | Prisma graph-ready tables | Neo4j read model |
| Search | Lexical, semantic, graph retrieval | PostgreSQL slots | Qdrant and reranking |
| Intelligence | Scores and recommendations | TypeScript rules | Versioned AI workers |
| Actions | Draft and execute approved workflows | External source links | Connector action APIs |

Start as a modular monolith. Split services only when load, ownership, or failure isolation requires it.

## Domain modules

1. Identity Engine: people, companies, investors, researchers, universities, organizations, achievements, projects, education, skills, funding, hiring, availability, and consent.
2. Global Startup Graph: founders, companies, investors, accelerators, universities, technologies, papers, countries, cities, patents, products, events, and communities.
3. Relationship Intelligence: mutual connections, paths, warm introduction probability, response probability, influence, strength, trust, overlap, and interaction timeline.
4. Discovery Engine: natural-language, faceted, semantic, and graph-aware search.
5. Opportunity Engine: funding, accelerators, grants, events, hiring, collaboration, acquisitions, government schemes, and open calls.
6. AI Founder Copilot: grounded chat, strategy generation, and typed tools.
7. Networking Engine: introductions, scheduler, outreach drafts, conversation preparation, follow-ups, and relationship memory.
8. Exposure Engine: launches, build-in-public, products, blogs, video, achievements, press, and speaking.
9. Competitive Intelligence: funding, hiring, news, launches, GitHub, patents, research, acquisitions, and technology shifts.
10. Founder Dashboard: highest-ROI actions, top introductions, investors, hires, opportunities, risks, follow-ups, goals, relationship score, and execution score.
11. Founder Reputation: execution, shipping velocity, technical depth, contribution, innovation, reliability, response rate, and collaboration.
12. Recommendation Engine: graph, embeddings, vector search, semantic search, and rules.
13. Knowledge Engine: papers, cases, stories, lessons, templates, playbooks, videos, failures, and fundraising knowledge.
14. Analytics: network growth, connection quality, investor engagement, opportunity conversion, meeting conversion, hiring funnel, and funding funnel.
15. Future AI: interfaces for autonomous networking, investor, recruiting, research, and strategy agents, disabled by default.

People Discovery is the first Discovery Engine vertical slice. It creates person nodes, category metadata, public source links, and discovered-on graph edges.

## Repository structure

~~~text
src/
  app/
    founder-network/page.tsx
    founder-net/page.tsx
    admin/founder-net/page.tsx
    api/founder-network/
      connectors/route.ts
      events/route.ts
      projection/route.ts
      people/route.ts
    api/v1/founder-net/
      discovery/search/route.ts
      opportunities/route.ts
      relationships/paths/route.ts
      copilot/threads/route.ts
      analytics/overview/route.ts
  components/founder-network/
    founder-network-portal.tsx
    people-discovery.tsx
    opportunity-inbox.tsx
    relationship-graph.tsx
    founder-copilot.tsx
    reputation-panel.tsx
    connector-health.tsx
  lib/founder-network/
    types.ts
    people.ts
    intelligence.ts
    connectors.ts
    events/
    identity/
    graph/
    discovery/
    opportunities/
    relationships/
    recommendations/
    reputation/
    copilot/
  workers/
    connector-worker.ts
    graph-worker.ts
    embedding-worker.ts
    recommendation-worker.ts
    analytics-worker.ts
  contracts/events/
  contracts/api/
  config/
prisma/
  schema.prisma
  migrations/
  seed.ts
docs/
  foundernet-architecture.md
  foundernet-api.md
~~~

## PostgreSQL source of truth

PostgreSQL owns transactional identity, consent, event provenance, workflow state, and auditability. Neo4j, Qdrant, Redis, and analytics stores are derived systems.

Core tables:

~~~text
Organization(id, name, slug, plan, created_at, updated_at)
OrganizationMember(organization_id, user_id, role, status)
User(id, email, name, auth_provider, status, created_at, updated_at)
PersonProfile(id, organization_id, canonical_name, headline, bio, country, city,
  availability, visibility, verification_status, source_confidence)
PersonAttribute(id, person_id, type, value, confidence, source_event_id)
PersonLink(id, person_id, label, url, platform, verified_at, source_event_id)
ConsentGrant(id, organization_id, subject_id, scope, granted_at, revoked_at)
GraphNode(id, organization_id, type, canonical_key, label, url, metadata, version)
GraphEdge(id, organization_id, source_id, target_id, relation, weight,
  confidence, valid_from, valid_to, metadata, version)
GraphEvidence(id, edge_id, event_id, source_url, source_platform,
  observed_at, reliability, excerpt_hash)
FounderNetworkEvent(id, organization_id, event_key, platform, connector_mode,
  type, title, summary, url, occurred_at, ingested_at, tags,
  source_reliability, payload, schema_version)
RelationshipScore(id, organization_id, source_person_id, target_person_id,
  strength, trust, influence, response_probability, warm_intro_probability,
  calculated_at, model_version)
Opportunity(id, organization_id, type, subject_id, score, urgency,
  expected_value, effort, reason, next_actions, status, expires_at,
  model_version, created_at)
Recommendation(id, organization_id, subject_type, subject_id, reason,
  score, evidence_ids, model_version, dismissed_at, created_at)
Interaction(id, organization_id, person_id, channel, occurred_at,
  direction, outcome, source_event_id, metadata)
IntroductionRequest(id, organization_id, requester_id, target_id, path_id,
  draft, status, approved_at, sent_at, outcome)
CopilotThread(id, organization_id, user_id, title, status, created_at, updated_at)
CopilotMessage(id, thread_id, role, content, citations, tool_calls, model, created_at)
ReputationSnapshot(id, organization_id, person_id, execution, shipping_velocity,
  technical_depth, contribution, innovation, reliability, response_rate,
  collaboration, model_version, calculated_at)
AuditLog(id, organization_id, actor_id, action, resource_type, resource_id,
  before_state, after_state, created_at)
~~~

Operational tables are ConnectorState, Job, FeatureFlag, NotificationRule, and ModelVersion. Every graph edge requires evidence. Inferred edges carry confidence and must be identified as inferred.

## Neo4j model

Node labels:

~~~text
Person, Founder, Investor, Company, Startup, Accelerator, University,
Technology, ResearchPaper, Country, City, Patent, Product, Event,
Community, Organization, Job, Opportunity
~~~

Relationship types:

~~~text
WORKED_WITH, INVESTED_IN, ADVISOR_OF, EMPLOYEE_OF, COMPETITOR_OF,
FRIEND_OF, MENTOR_OF, PARTNER_OF, RESEARCHED_WITH, ATTENDED,
FUNDED, LIKES, FOLLOWS, MAINTAINS, DISCOVERED_ON, PUBLISHED,
HIRED_FOR, LOCATED_IN, USES, MENTIONED_IN
~~~

Neo4j is a derived read model. PostgreSQL is authoritative. Graph writes are idempotent and include sourceEventId, confidence, observedAt, and modelVersion.

## Canonical event contract

~~~json
{
  "eventId": "fn_evt_01H...",
  "schemaVersion": 1,
  "organizationId": "org_01H...",
  "source": {
    "platform": "github",
    "connectorMode": "api",
    "externalId": "repo:owner/name:release:123",
    "url": "https://github.com/owner/name/releases/tag/v1.2.0",
    "reliability": 0.94
  },
  "type": "repository.trending",
  "occurredAt": "2026-07-21T10:30:00.000Z",
  "ingestedAt": "2026-07-21T10:31:02.000Z",
  "entities": [{ "type": "repository", "canonicalKey": "github:owner/name" }],
  "relationships": [],
  "payload": {},
  "dedupeKey": "github:repo:owner/name:release:123",
  "privacy": { "visibility": "public", "consentRequired": false }
}
~~~

Events are append-only, deduplicated, replayable, versioned, and tenant-scoped. Derived scores store their evidence event IDs. Private data requires explicit consent and source authorization.

## API surface

~~~text
GET    /api/v1/founder-net/dashboard
GET    /api/v1/founder-net/people
GET    /api/v1/founder-net/people/:id
GET    /api/v1/founder-net/discovery/search?q=...
GET    /api/v1/founder-net/opportunities
POST   /api/v1/founder-net/opportunities/:id/dismiss
GET    /api/v1/founder-net/relationships/:personId/paths/:targetId
POST   /api/v1/founder-net/introductions/draft
POST   /api/v1/founder-net/introductions/:id/approve
GET    /api/v1/founder-net/competitors
GET    /api/v1/founder-net/graph
GET    /api/v1/founder-net/reputation/:personId
GET    /api/v1/founder-net/connectors
POST   /api/v1/founder-net/connectors/:platform/sync
GET    /api/v1/founder-net/copilot/threads
POST   /api/v1/founder-net/copilot/threads
POST   /api/v1/founder-net/copilot/threads/:id/messages
GET    /api/v1/founder-net/analytics/overview
~~~

GraphQL is appropriate for read-heavy dashboard composition. Mutations remain explicit REST commands for clear authorization and audit behavior. Use WebSockets or SSE for connector health, opportunity updates, graph expansion, and copilot streams.

## Discovery, relationships, and scoring

Natural-language discovery is a query planner:

1. Parse entities, constraints, geography, time, availability, and desired action.
2. Run PostgreSQL lexical search and Qdrant semantic retrieval.
3. Traverse Neo4j for graph constraints and relationship paths.
4. Apply privacy, consent, visibility, and blocked-source policies.
5. Rank relevance, relationship fit, expected value, response probability, freshness, and effort.
6. Return evidence, uncertainty, and the recommended next action.

~~~text
final_score =
  0.28 semantic_relevance
  + 0.22 graph_fit
  + 0.18 relationship_strength
  + 0.14 expected_value
  + 0.10 response_probability
  + 0.08 freshness
  - 0.12 effort
~~~

Relationship measures are probabilistic and never imply access or endorsement:

~~~text
relationship_strength = recency x frequency x reciprocity x channel_quality
trust_score = source_reliability x observed_outcomes x consistency
warm_intro_probability = path_quality x intermediary_trust x context_fit
response_probability = relationship_strength x relevance x timing x channel_fit
influence_score = evidence_of_impact, not follower count
~~~

Recommendations include modelVersion, evidence references, uncertainty, and a plain-language reason.

## Copilot, pages, and admin

Typed copilot tools:

~~~text
search_people
search_startups
find_relationship_paths
rank_opportunities
inspect_competitor
summarize_source
draft_introduction
draft_follow_up
create_founder_plan
schedule_meeting
~~~

The model drafts actions, but messages, invitations, calendar changes, and profile changes require explicit approval.

Frontend pages:

~~~text
/founder-network                 Current intelligence workspace
/founder-net                     Future canonical route
/founder-net/people/:id          Person intelligence profile
/founder-net/startups/:id        Startup intelligence profile
/founder-net/investors/:id       Investor intelligence profile
/founder-net/discover            Natural-language discovery
/founder-net/opportunities       Daily opportunity queue
/founder-net/relationships       Relationship graph
/founder-net/competitors         Competitive intelligence
/founder-net/copilot             AI Founder Copilot
/founder-net/reputation          Reputation and evidence
/founder-net/settings            Connectors, consent, notifications
/admin/founder-net               Operations dashboard
~~~

Admin tools cover connector health, rate limits, cursors, replay, source verification, entity merges, graph evidence, model versions, feature flags, consent, retention, audit, abuse, privacy, takedown, and source-policy workflows.

## Security and reliability

Use short-lived access tokens, rotating refresh tokens, OIDC-ready authentication, organization-scoped queries, RBAC roles OWNER, ADMIN, OPERATOR, MEMBER, and VIEWER, managed secret storage for connector credentials, consent checks, rate limits, immutable audit logs, and export/correction/deletion workflows.

Observe connector freshness, source error rate, event lag, graph lag, search latency, retrieval recall, recommendation acceptance, dismissal rate, and opportunity conversion. Use OpenTelemetry across ingestion, graph writes, retrieval, ranking, and copilot tools.

## Roadmap

### Phase 0: Foundation, current

- Founder Net workspace and connector registry.
- Normalized event shape and AI-ranked inbox.
- Graph-ready PostgreSQL models.
- People Discovery with curated public profiles.
- Port 3003 local development path.

### Phase 1: Durable intelligence core

- Organizations, consent, and PostgreSQL persistence.
- Redis-backed jobs and replayable projections.
- GitHub, Hacker News, arXiv, and RSS production connectors.
- Admin connector health and event replay.

### Phase 2: Discovery and relationships

- Natural-language discovery parser.
- Qdrant embeddings and hybrid retrieval.
- Neo4j projection and shortest paths.
- Relationship evidence timelines and entity detail pages.

### Phase 3: Founder operating system

- Opportunity engine and daily ROI dashboard.
- Grounded copilot tools.
- Introduction drafts, follow-ups, meetings, and approval gates.
- Reputation dimensions and private evidence views.

### Phase 4: Ecosystem scale

- Independent NestJS connector and intelligence workers.
- Graph and vector read replicas.
- Multi-region ingestion and tenant isolation.
- Connector marketplace, plugin SDK, SSO, RBAC, billing, retention, and audit exports.

### Phase 5: Future AI

- Autonomous networking, investor, recruiter, researcher, and strategist agents.
- Disabled by default, typed, observable, approval-aware, and policy-constrained.

## Risks and production definition

The main risks are inaccurate people data, unauthorized ingestion, hallucinated recommendations, inferred graph facts presented as truth, ranking bias, premature service sprawl, and external platform dependency. Mitigations are provenance, consent, citations, confidence, human approval, configurable scoring, modular-monolith-first delivery, connector contracts, replay, and graceful degradation.

FounderNet is production-ready when recommendations are explainable and evidence-backed, connectors are authorized and replayable, mutations are permission-checked and audited, derived stores can be rebuilt from events, data is tenant-isolated, visibility is explicit, and external actions require approval until a policy-gated autonomous agent is enabled.

