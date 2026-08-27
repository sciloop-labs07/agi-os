export type FounderPlatform =
  | "github"
  | "gitlab"
  | "product-hunt"
  | "wellfound"
  | "crunchbase"
  | "f6s"
  | "y-combinator"
  | "hacker-news"
  | "indie-hackers"
  | "reddit"
  | "discord"
  | "slack"
  | "linkedin"
  | "x"
  | "hugging-face"
  | "arxiv"
  | "semantic-scholar"
  | "techcrunch"
  | "venturebeat";

export type ConnectorMode = "api" | "rss" | "webhook" | "manual-import" | "official-export";

export type FounderEntityType =
  | "person"
  | "company"
  | "investor"
  | "startup"
  | "repository"
  | "product"
  | "job"
  | "community"
  | "event";

export type FounderEventType =
  | "funding.announced"
  | "product.launched"
  | "repository.trending"
  | "job.posted"
  | "investor.signal"
  | "competitor.move"
  | "customer.intent"
  | "research.published"
  | "community.discussion"
  | "press.mention"
  | "founder.update"
  | "partnership.signal";

export type FounderAgentId =
  | "investor"
  | "competitor"
  | "hiring"
  | "customer"
  | "research"
  | "community"
  | "open-source"
  | "growth"
  | "pr"
  | "funding";

export type FounderConnector = {
  id: FounderPlatform;
  name: string;
  modes: ConnectorMode[];
  platformUrl: string;
  officialUrl: string;
  status: "ready" | "credential-required" | "design-only";
  entities: FounderEntityType[];
  eventTypes: FounderEventType[];
  complianceNote: string;
};

export type FounderGraphNode = {
  id: string;
  type: FounderEntityType;
  label: string;
  platform?: FounderPlatform;
  url?: string;
  metadata: Record<string, unknown>;
};

export type FounderGraphEdge = {
  id: string;
  sourceId: string;
  targetId: string;
  relation: "founded" | "funded" | "works_at" | "launched" | "competes_with" | "maintains" | "discussed_in" | "hiring_for" | "mentions" | "discovered_on";
  weight: number;
  evidenceEventIds: string[];
};

export type FounderNetworkEvent = {
  id: string;
  platform: FounderPlatform;
  connectorMode: ConnectorMode;
  type: FounderEventType;
  title: string;
  summary: string;
  url: string;
  occurredAt: string;
  ingestedAt: string;
  entities: FounderGraphNode[];
  relationships: FounderGraphEdge[];
  tags: string[];
  rawRef?: string;
  sourceReliability: number;
};

export type AgentRecommendation = {
  agent: FounderAgentId;
  eventId: string;
  urgency: number;
  importance: number;
  reason: string;
  nextActions: string[];
  notify: boolean;
  notificationRule: string;
};

export type FounderNetworkProjection = {
  eventCount: number;
  connectorCount: number;
  activePlatforms: number;
  graphNodeCount: number;
  graphEdgeCount: number;
  highUrgencyCount: number;
  inbox: Array<FounderNetworkEvent & { recommendations: AgentRecommendation[]; topUrgency: number }>;
  opportunities: AgentRecommendation[];
  peopleDiscovery: import("@/lib/founder-network/people").FounderPersonProfile[];
  connectorHealth: Array<{
    platform: FounderPlatform;
    name: string;
    status: FounderConnector["status"];
    modes: ConnectorMode[];
    platformUrl: string;
    officialUrl: string;
    eventCount: number;
  }>;
  graph: {
    nodes: FounderGraphNode[];
    edges: FounderGraphEdge[];
  };
};
