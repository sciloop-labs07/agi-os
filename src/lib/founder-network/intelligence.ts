import { founderConnectors } from "@/lib/founder-network/connectors";
import { founderPeople } from "@/lib/founder-network/people";
import type {
  AgentRecommendation,
  FounderAgentId,
  FounderGraphEdge,
  FounderGraphNode,
  FounderNetworkEvent,
  FounderNetworkProjection
} from "@/lib/founder-network/types";

const now = new Date().toISOString();

const seedEvents: FounderNetworkEvent[] = [
  {
    id: "fn-github-agent-runtime",
    platform: "github",
    connectorMode: "api",
    type: "repository.trending",
    title: "Agent runtime repo gains fast traction",
    summary: "A developer tool repository crossed a high star velocity threshold and added enterprise deployment examples.",
    url: "https://github.com/",
    occurredAt: now,
    ingestedAt: now,
    tags: ["agents", "developer-tools", "open-source"],
    sourceReliability: 82,
    entities: [
      { id: "repo-agent-runtime", type: "repository", label: "Agent Runtime", platform: "github", url: "https://github.com/", metadata: { starsDelta: 740 } },
      { id: "company-agent-runtime-labs", type: "startup", label: "Agent Runtime Labs", metadata: { category: "developer tooling" } }
    ],
    relationships: [
      { id: "edge-agent-runtime-maintains", sourceId: "company-agent-runtime-labs", targetId: "repo-agent-runtime", relation: "maintains", weight: 84, evidenceEventIds: ["fn-github-agent-runtime"] }
    ]
  },
  {
    id: "fn-producthunt-launch",
    platform: "product-hunt",
    connectorMode: "api",
    type: "product.launched",
    title: "AI support copilot launches with strong founder comments",
    summary: "A support automation startup is ranking in the top launch slots and founders are asking for integrations.",
    url: "https://www.producthunt.com/",
    occurredAt: now,
    ingestedAt: now,
    tags: ["launch", "support", "customers"],
    sourceReliability: 78,
    entities: [
      { id: "product-support-copilot", type: "product", label: "Support Copilot", platform: "product-hunt", url: "https://www.producthunt.com/", metadata: { rank: 2 } },
      { id: "startup-support-copilot", type: "startup", label: "Support Copilot Inc.", metadata: { stage: "seed" } }
    ],
    relationships: [
      { id: "edge-support-launch", sourceId: "startup-support-copilot", targetId: "product-support-copilot", relation: "launched", weight: 80, evidenceEventIds: ["fn-producthunt-launch"] }
    ]
  },
  {
    id: "fn-crunchbase-funding",
    platform: "crunchbase",
    connectorMode: "api",
    type: "funding.announced",
    title: "Vertical AI workflow startup raises Series A",
    summary: "A workflow automation competitor raised a new round from two notable enterprise SaaS investors.",
    url: "https://www.crunchbase.com/",
    occurredAt: now,
    ingestedAt: now,
    tags: ["funding", "competitor", "enterprise"],
    sourceReliability: 86,
    entities: [
      { id: "startup-workflow-ai", type: "startup", label: "WorkflowAI", platform: "crunchbase", url: "https://www.crunchbase.com/", metadata: { round: "Series A", amount: "$18M" } },
      { id: "investor-northstar", type: "investor", label: "Northstar Ventures", metadata: { focus: "enterprise SaaS" } }
    ],
    relationships: [
      { id: "edge-northstar-funded-workflow", sourceId: "investor-northstar", targetId: "startup-workflow-ai", relation: "funded", weight: 88, evidenceEventIds: ["fn-crunchbase-funding"] }
    ]
  },
  {
    id: "fn-arxiv-paper",
    platform: "arxiv",
    connectorMode: "rss",
    type: "research.published",
    title: "New paper on long-horizon agent evaluation",
    summary: "Researchers propose a benchmark for multi-step tool-using agents across planning and recovery tasks.",
    url: "https://arxiv.org/",
    occurredAt: now,
    ingestedAt: now,
    tags: ["research", "agents", "evaluation"],
    sourceReliability: 75,
    entities: [
      { id: "paper-long-horizon-agents", type: "event", label: "Long-horizon agent benchmark", platform: "arxiv", url: "https://arxiv.org/", metadata: { field: "AI evaluation" } },
      { id: "community-agent-research", type: "community", label: "Agent Research", metadata: { domain: "AI" } }
    ],
    relationships: [
      { id: "edge-paper-discussed", sourceId: "paper-long-horizon-agents", targetId: "community-agent-research", relation: "discussed_in", weight: 72, evidenceEventIds: ["fn-arxiv-paper"] }
    ]
  },
  {
    id: "fn-hn-customer-intent",
    platform: "hacker-news",
    connectorMode: "api",
    type: "customer.intent",
    title: "Founder thread complains about fragmented startup tooling",
    summary: "Multiple founders describe switching between CRM, hiring, investor updates, launch channels, and research tools.",
    url: "https://news.ycombinator.com/",
    occurredAt: now,
    ingestedAt: now,
    tags: ["customer-intent", "founder-os", "community"],
    sourceReliability: 69,
    entities: [
      { id: "community-hacker-news", type: "community", label: "Hacker News", platform: "hacker-news", url: "https://news.ycombinator.com/", metadata: { thread: "startup tooling" } },
      { id: "product-founder-os", type: "product", label: "Founder OS", metadata: { category: "operating system" } }
    ],
    relationships: [
      { id: "edge-hn-mentions-founder-os", sourceId: "community-hacker-news", targetId: "product-founder-os", relation: "mentions", weight: 76, evidenceEventIds: ["fn-hn-customer-intent"] }
    ]
  }
];

const globalFounderStore = globalThis as unknown as { founderNetworkEvents?: FounderNetworkEvent[] };
if (!globalFounderStore.founderNetworkEvents) globalFounderStore.founderNetworkEvents = seedEvents;

const agentRules: Record<FounderAgentId, { keywords: string[]; eventTypes: string[]; base: number; action: string }> = {
  investor: { keywords: ["investor", "funding", "round", "series", "venture"], eventTypes: ["funding.announced", "investor.signal"], base: 64, action: "Add investor to pipeline and prepare a targeted context brief." },
  competitor: { keywords: ["competitor", "launch", "raised", "enterprise", "workflow"], eventTypes: ["competitor.move", "funding.announced", "product.launched"], base: 68, action: "Update competitor tracker and compare positioning changes." },
  hiring: { keywords: ["job", "hiring", "talent", "engineer"], eventTypes: ["job.posted"], base: 58, action: "Map hiring signal to team strategy and possible candidate sourcing." },
  customer: { keywords: ["customer", "complains", "founders", "need", "pain"], eventTypes: ["customer.intent", "community.discussion"], base: 72, action: "Create customer discovery prompt and find people to interview." },
  research: { keywords: ["paper", "research", "benchmark", "arxiv", "evaluation"], eventTypes: ["research.published"], base: 66, action: "Send to research feed and extract claims for validation." },
  community: { keywords: ["thread", "discussion", "community", "discord", "reddit"], eventTypes: ["community.discussion", "customer.intent"], base: 56, action: "Join the conversation from the original platform when appropriate." },
  "open-source": { keywords: ["repo", "github", "gitlab", "stars", "open-source"], eventTypes: ["repository.trending"], base: 70, action: "Review repository, star velocity, maintainers, and integration surface." },
  growth: { keywords: ["launch", "product hunt", "rank", "comments", "growth"], eventTypes: ["product.launched", "customer.intent"], base: 62, action: "Extract launch tactics and add learnings to growth experiments." },
  pr: { keywords: ["press", "techcrunch", "venturebeat", "mention"], eventTypes: ["press.mention", "funding.announced"], base: 54, action: "Prepare PR angle and track journalist/source relationship." },
  funding: { keywords: ["funding", "series", "seed", "investor", "round"], eventTypes: ["funding.announced", "investor.signal"], base: 74, action: "Assess fundraising timing and investor relevance." }
};

export function listFounderEvents() {
  return [...(globalFounderStore.founderNetworkEvents ?? [])];
}

export function ingestFounderEvent(event: Omit<FounderNetworkEvent, "id" | "ingestedAt"> & { id?: string }) {
  const next: FounderNetworkEvent = {
    ...event,
    id: event.id ?? `fn-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    ingestedAt: new Date().toISOString()
  };
  globalFounderStore.founderNetworkEvents = [next, ...listFounderEvents()];
  return next;
}

export function scoreFounderEvent(event: FounderNetworkEvent): AgentRecommendation[] {
  const searchable = `${event.title} ${event.summary} ${event.tags.join(" ")}`.toLowerCase();
  return (Object.entries(agentRules) as Array<[FounderAgentId, (typeof agentRules)[FounderAgentId]]>)
    .map(([agent, rule]) => {
      const keywordHits = rule.keywords.filter((keyword) => searchable.includes(keyword)).length;
      const typeHit = rule.eventTypes.includes(event.type) ? 1 : 0;
      const urgency = Math.min(100, Math.round(rule.base + keywordHits * 7 + typeHit * 12 + event.sourceReliability * 0.12));
      const importance = Math.min(100, Math.round(urgency * 0.76 + event.sourceReliability * 0.24));
      return {
        agent,
        eventId: event.id,
        urgency,
        importance,
        reason: `${agent} agent detected ${typeHit ? "a direct event match" : "related weak signals"} with ${keywordHits} keyword signals and ${event.sourceReliability}% source reliability.`,
        nextActions: [rule.action, "Open the source platform for execution and record outcome back into AGI OS."],
        notify: urgency >= 78,
        notificationRule: urgency >= 78 ? "Notify when urgency >= 78" : "Hold in ranked inbox"
      };
    })
    .filter((recommendation) => recommendation.urgency >= 50)
    .sort((a, b) => b.urgency - a.urgency);
}

export function buildFounderNetworkProjection(): FounderNetworkProjection {
  const events = listFounderEvents();
  const recommendations = events.flatMap(scoreFounderEvent);
  const nodeMap = new Map<string, FounderGraphNode>();
  const edgeMap = new Map<string, FounderGraphEdge>();

  for (const event of events) {
    event.entities.forEach((node) => nodeMap.set(node.id, node));
    event.relationships.forEach((edge) => edgeMap.set(edge.id, edge));
  }

  const peopleDiscoveryNode: FounderGraphNode = {
    id: "people-discovery",
    type: "community",
    label: "People Discovery",
    metadata: { categories: 8, profileCount: founderPeople.length }
  };
  nodeMap.set(peopleDiscoveryNode.id, peopleDiscoveryNode);
  founderPeople.forEach((person) => {
    nodeMap.set(person.id, {
      id: person.id,
      type: "person",
      label: person.name,
      metadata: {
        category: person.category,
        role: person.role,
        focus: person.focus,
        discoveryScore: person.discoveryScore,
        tags: person.tags
      }
    });
    const edgeId = `edge-${person.id}-people-discovery`;
    edgeMap.set(edgeId, {
      id: edgeId,
      sourceId: person.id,
      targetId: peopleDiscoveryNode.id,
      relation: "discovered_on",
      weight: person.discoveryScore,
      evidenceEventIds: []
    });
  });

  return {
    eventCount: events.length,
    connectorCount: founderConnectors.length,
    activePlatforms: new Set(events.map((event) => event.platform)).size,
    graphNodeCount: nodeMap.size,
    graphEdgeCount: edgeMap.size,
    highUrgencyCount: recommendations.filter((recommendation) => recommendation.urgency >= 78).length,
    inbox: events
      .map((event) => {
        const eventRecommendations = scoreFounderEvent(event);
        return { ...event, recommendations: eventRecommendations, topUrgency: eventRecommendations[0]?.urgency ?? 0 };
      })
      .sort((a, b) => b.topUrgency - a.topUrgency),
    opportunities: recommendations.sort((a, b) => b.urgency - a.urgency).slice(0, 18),
    peopleDiscovery: founderPeople,
    connectorHealth: founderConnectors.map((connector) => ({
      platform: connector.id,
      name: connector.name,
      status: connector.status,
      modes: connector.modes,
      platformUrl: connector.platformUrl,
      officialUrl: connector.officialUrl,
      eventCount: events.filter((event) => event.platform === connector.id).length
    })),
    graph: {
      nodes: Array.from(nodeMap.values()),
      edges: Array.from(edgeMap.values())
    }
  };
}
