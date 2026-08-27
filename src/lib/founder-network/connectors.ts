import type { FounderConnector, FounderNetworkEvent, FounderPlatform } from "@/lib/founder-network/types";

export const founderConnectors: FounderConnector[] = [
  {
    id: "github",
    name: "GitHub",
    modes: ["api", "webhook"],
    platformUrl: "https://github.com/",
    officialUrl: "https://docs.github.com/rest",
    status: "credential-required",
    entities: ["person", "company", "repository"],
    eventTypes: ["repository.trending", "founder.update", "competitor.move"],
    complianceNote: "Use GitHub REST/GraphQL APIs and repository webhooks. Do not scrape private data."
  },
  {
    id: "gitlab",
    name: "GitLab",
    modes: ["api", "webhook"],
    platformUrl: "https://gitlab.com/",
    officialUrl: "https://docs.gitlab.com/api/",
    status: "credential-required",
    entities: ["person", "company", "repository"],
    eventTypes: ["repository.trending", "competitor.move"],
    complianceNote: "Use official GitLab APIs and project webhooks."
  },
  {
    id: "product-hunt",
    name: "Product Hunt",
    modes: ["api"],
    platformUrl: "https://www.producthunt.com/",
    officialUrl: "https://api.producthunt.com/v2/docs",
    status: "credential-required",
    entities: ["product", "startup", "person"],
    eventTypes: ["product.launched", "customer.intent", "competitor.move"],
    complianceNote: "Use official Product Hunt API access where available."
  },
  {
    id: "wellfound",
    name: "Wellfound",
    modes: ["official-export", "manual-import"],
    platformUrl: "https://wellfound.com/",
    officialUrl: "https://wellfound.com/",
    status: "design-only",
    entities: ["startup", "job", "person"],
    eventTypes: ["job.posted", "founder.update"],
    complianceNote: "Use officially supported exports, partnerships, or manual user-provided imports only."
  },
  {
    id: "crunchbase",
    name: "Crunchbase",
    modes: ["api"],
    platformUrl: "https://www.crunchbase.com/",
    officialUrl: "https://data.crunchbase.com/docs",
    status: "credential-required",
    entities: ["company", "startup", "investor", "person"],
    eventTypes: ["funding.announced", "investor.signal", "competitor.move"],
    complianceNote: "Use Crunchbase licensed API/data access."
  },
  {
    id: "f6s",
    name: "F6S",
    modes: ["official-export", "manual-import"],
    platformUrl: "https://www.f6s.com/",
    officialUrl: "https://www.f6s.com/",
    status: "design-only",
    entities: ["startup", "investor", "event"],
    eventTypes: ["funding.announced", "founder.update"],
    complianceNote: "Use official exports, partner access, or user-provided data."
  },
  {
    id: "y-combinator",
    name: "Y Combinator",
    modes: ["rss", "manual-import"],
    platformUrl: "https://www.ycombinator.com/",
    officialUrl: "https://www.ycombinator.com/companies",
    status: "design-only",
    entities: ["startup", "person", "investor"],
    eventTypes: ["funding.announced", "product.launched", "founder.update"],
    complianceNote: "Prefer public RSS/official datasets/manual curation; no prohibited scraping."
  },
  {
    id: "hacker-news",
    name: "Hacker News",
    modes: ["api"],
    platformUrl: "https://news.ycombinator.com/",
    officialUrl: "https://github.com/HackerNews/API",
    status: "ready",
    entities: ["person", "community", "product"],
    eventTypes: ["community.discussion", "customer.intent", "product.launched"],
    complianceNote: "Use official Firebase API."
  },
  {
    id: "indie-hackers",
    name: "Indie Hackers",
    modes: ["rss", "manual-import"],
    platformUrl: "https://www.indiehackers.com/",
    officialUrl: "https://www.indiehackers.com/",
    status: "design-only",
    entities: ["person", "startup", "community"],
    eventTypes: ["community.discussion", "customer.intent", "founder.update"],
    complianceNote: "Use RSS or user-authorized imports where available."
  },
  {
    id: "reddit",
    name: "Reddit",
    modes: ["api"],
    platformUrl: "https://www.reddit.com/",
    officialUrl: "https://www.reddit.com/dev/api/",
    status: "credential-required",
    entities: ["community", "person", "product"],
    eventTypes: ["community.discussion", "customer.intent", "competitor.move"],
    complianceNote: "Use Reddit API and respect subreddit/platform policies."
  },
  {
    id: "discord",
    name: "Discord",
    modes: ["api", "webhook"],
    platformUrl: "https://discord.com/",
    officialUrl: "https://discord.com/developers/docs/intro",
    status: "credential-required",
    entities: ["community", "person", "event"],
    eventTypes: ["community.discussion", "customer.intent"],
    complianceNote: "Use bots/webhooks only in authorized servers."
  },
  {
    id: "slack",
    name: "Slack",
    modes: ["api", "webhook"],
    platformUrl: "https://slack.com/",
    officialUrl: "https://api.slack.com/",
    status: "credential-required",
    entities: ["community", "person", "company"],
    eventTypes: ["community.discussion", "customer.intent", "founder.update"],
    complianceNote: "Use Slack app permissions and workspace authorization."
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    modes: ["api", "official-export"],
    platformUrl: "https://www.linkedin.com/",
    officialUrl: "https://learn.microsoft.com/linkedin/",
    status: "credential-required",
    entities: ["person", "company", "job", "investor"],
    eventTypes: ["job.posted", "investor.signal", "founder.update"],
    complianceNote: "Use officially supported LinkedIn APIs/exports only."
  },
  {
    id: "x",
    name: "X",
    modes: ["api"],
    platformUrl: "https://x.com/",
    officialUrl: "https://developer.x.com/",
    status: "credential-required",
    entities: ["person", "company", "community"],
    eventTypes: ["founder.update", "press.mention", "customer.intent"],
    complianceNote: "Use official X API access only."
  },
  {
    id: "hugging-face",
    name: "Hugging Face",
    modes: ["api", "rss"],
    platformUrl: "https://huggingface.co/",
    officialUrl: "https://huggingface.co/docs/hub/api",
    status: "ready",
    entities: ["repository", "company", "person", "product"],
    eventTypes: ["repository.trending", "research.published", "competitor.move"],
    complianceNote: "Use Hub APIs and public model/dataset metadata."
  },
  {
    id: "arxiv",
    name: "arXiv",
    modes: ["api", "rss"],
    platformUrl: "https://arxiv.org/",
    officialUrl: "https://info.arxiv.org/help/api/index.html",
    status: "ready",
    entities: ["person", "company", "event"],
    eventTypes: ["research.published", "competitor.move"],
    complianceNote: "Use arXiv API/RSS."
  },
  {
    id: "semantic-scholar",
    name: "Semantic Scholar",
    modes: ["api"],
    platformUrl: "https://www.semanticscholar.org/",
    officialUrl: "https://api.semanticscholar.org/",
    status: "credential-required",
    entities: ["person", "company", "event"],
    eventTypes: ["research.published"],
    complianceNote: "Use Semantic Scholar APIs and rate limits."
  },
  {
    id: "techcrunch",
    name: "TechCrunch",
    modes: ["rss"],
    platformUrl: "https://techcrunch.com/",
    officialUrl: "https://techcrunch.com/feed/",
    status: "ready",
    entities: ["company", "startup", "investor", "person"],
    eventTypes: ["funding.announced", "press.mention", "competitor.move"],
    complianceNote: "Use RSS feeds and article metadata."
  },
  {
    id: "venturebeat",
    name: "VentureBeat",
    modes: ["rss"],
    platformUrl: "https://venturebeat.com/",
    officialUrl: "https://venturebeat.com/feed/",
    status: "ready",
    entities: ["company", "startup", "investor", "person"],
    eventTypes: ["funding.announced", "press.mention", "competitor.move"],
    complianceNote: "Use RSS feeds and article metadata."
  }
];

export type ConnectorIngestionRequest = {
  platform: FounderPlatform;
  cursor?: string;
  since?: string;
  credentialsRef?: string;
};

export interface FounderPlatformConnector {
  definition: FounderConnector;
  ingest(request: ConnectorIngestionRequest): Promise<FounderNetworkEvent[]>;
}

export function getConnector(platform: FounderPlatform) {
  return founderConnectors.find((connector) => connector.id === platform);
}
