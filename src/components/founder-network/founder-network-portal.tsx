"use client";

import {
  Bell,
  ExternalLink,
  BriefcaseBusiness,
  Building2,
  CircleDollarSign,
  Code2,
  GitBranch,
  LineChart,
  Maximize2,
  Megaphone,
  Minimize2,
  Network,
  Newspaper,
  Radio,
  RefreshCw,
  Rocket,
  Search,
  Sparkles,
  UserRound,
  Users,
  Zap
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import type { FounderAgentId, FounderNetworkProjection } from "@/lib/founder-network/types";
import { founderPersonCategories, type FounderPersonCategory, type FounderPersonProfile } from "@/lib/founder-network/people";

const tabs = [
  "Unified inbox",
  "Founder CRM",
  "Relationship graph",
  "Opportunity feed",
  "Investor pipeline",
  "Competitor tracker",
  "Launch tracker",
  "Hiring tracker",
  "Open-source analytics",
  "Research feed",
  "AI recommendations",
  "Notification center",
  "People Discovery"
] as const;

type Tab = (typeof tabs)[number];

const tabAgent: Partial<Record<Tab, FounderAgentId>> = {
  "Investor pipeline": "investor",
  "Competitor tracker": "competitor",
  "Hiring tracker": "hiring",
  "Open-source analytics": "open-source",
  "Research feed": "research",
  "AI recommendations": "growth",
  "Notification center": "funding"
};

export function FounderNetworkPortal({ initialProjection }: { initialProjection: FounderNetworkProjection }) {
  const [projection, setProjection] = useState(initialProjection);
  const [active, setActive] = useState<Tab>("Unified inbox");
  const [query, setQuery] = useState("");
  const [peopleCategory, setPeopleCategory] = useState<FounderPersonCategory | "All people">("All people");
  const [loading, setLoading] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [sidePeekOpen, setSidePeekOpen] = useState(false);

  async function refresh() {
    setLoading(true);
    const response = await fetch("/api/founder-network/projection", { cache: "no-store" });
    const data = (await response.json()) as { projection: FounderNetworkProjection };
    setProjection(data.projection);
    setLoading(false);
  }

  function enterFocusMode() {
    setFocusMode(true);
  }

  function exitFocusMode() {
    setFocusMode(false);
    setSidePeekOpen(false);
  }

  const filteredInbox = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return projection.inbox.filter((event) => {
      if (!normalized) return true;
      return `${event.title} ${event.summary} ${event.platform} ${event.tags.join(" ")}`.toLowerCase().includes(normalized);
    });
  }, [projection.inbox, query]);

  const selectedRecommendations = useMemo(() => {
    const agent = tabAgent[active];
    if (!agent) return projection.opportunities;
    return projection.opportunities.filter((item) => item.agent === agent);
  }, [active, projection.opportunities]);

  const filteredPeople = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    return projection.peopleDiscovery.filter((person) => {
      const matchesCategory = peopleCategory === "All people" || person.category === peopleCategory;
      const matchesQuery = !normalized || `${person.name} ${person.role} ${person.focus} ${person.summary} ${person.tags.join(" ")}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [peopleCategory, projection.peopleDiscovery, query]);

  return (
    <div className={`founder-net-surface space-y-6 text-[15px] md:text-base ${focusMode ? "founder-net-focus" : ""}`}>
      <section className="founder-net-hero relative overflow-hidden rounded-lg border border-cyan-signal/20 bg-[radial-gradient(circle_at_18%_20%,rgba(72,229,255,0.24),transparent_30%),radial-gradient(circle_at_78%_22%,rgba(182,255,97,0.18),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(255,95,143,0.12),transparent_34%),linear-gradient(135deg,rgba(2,6,23,0.98),rgba(8,18,31,0.98))] p-6 shadow-glow md:p-8">
        <div className="founder-net-scan absolute inset-0 opacity-70" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-signal to-transparent" />
        <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>Founder Intelligence Network</Badge>
              <Badge tone="lime">AI-ranked startup operating system</Badge>
              <Badge tone="rose">live graph active</Badge>
            </div>
            <h1 className="mt-5 max-w-5xl text-4xl font-semibold leading-tight text-white md:text-6xl">
              One Intelligence Layer For Startup Signals
            </h1>
            <p className="mt-4 max-w-4xl text-base leading-7 text-slate-200 md:text-lg">
              Connectors normalize founder, investor, launch, hiring, research, developer, and community events into a graph.
              AI agents rank what matters and route execution back to the original platforms.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                if (focusMode) {
                  exitFocusMode();
                } else {
                  enterFocusMode();
                }
              }}
              className="inline-flex w-fit items-center gap-2 rounded-md border border-lime-signal/35 bg-lime-signal/10 px-4 py-2 text-base font-semibold text-lime-signal transition hover:bg-lime-signal/15"
            >
              {focusMode ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
              {focusMode ? "Minimize portal" : "Expand portal"}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                void refresh();
              }}
              className="inline-flex w-fit items-center gap-2 rounded-md border border-cyan-signal/30 bg-cyan-signal/10 px-4 py-2 text-base font-semibold text-cyan-signal transition hover:bg-cyan-signal/15"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              Refresh intelligence
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Metric label="Events" value={projection.eventCount} icon={<Zap className="size-4" />} />
        <Metric label="Connectors" value={projection.connectorCount} icon={<Network className="size-4" />} />
        <Metric label="Platforms active" value={projection.activePlatforms} icon={<Rocket className="size-4" />} />
        <Metric label="Graph nodes" value={projection.graphNodeCount} icon={<GitBranch className="size-4" />} />
        <Metric label="Urgent signals" value={projection.highUrgencyCount} icon={<Bell className="size-4" />} tone="rose" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setActive(tab);
            }}
            className={`shrink-0 rounded-md border px-4 py-2.5 text-base transition ${
              active === tab ? "founder-net-active-tab border-cyan-signal/55 bg-cyan-signal/15 text-cyan-100" : "border-white/10 bg-white/[0.04] text-slate-300 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={`founder-net-workspace grid min-w-0 gap-5 ${focusMode ? "xl:grid-cols-1" : "xl:grid-cols-[1.05fr_0.95fr]"}`}>
        <Card className={focusMode ? "founder-net-primary-expanded" : ""} onClick={enterFocusMode}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <Kicker>{active}</Kicker>
              <h2 className="mt-2 text-2xl font-semibold text-white">{titleFor(active)}</h2>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search signal graph"
                  className="h-11 w-full rounded-md border border-white/10 bg-black/25 pl-9 pr-3 text-base text-slate-100 outline-none focus:border-cyan-signal/50 md:w-80"
                />
              </label>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  if (focusMode) {
                    exitFocusMode();
                  } else {
                    enterFocusMode();
                  }
                }}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-lime-signal/30 bg-lime-signal/10 px-3 text-sm font-semibold text-lime-signal transition hover:bg-lime-signal/15"
              >
                {focusMode ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                {focusMode ? "Minimize" : "Expand"}
              </button>
            </div>
          </div>

          {active === "People Discovery" ? (
            <PeopleDiscovery people={filteredPeople} category={peopleCategory} onCategoryChange={setPeopleCategory} />
          ) : active === "Relationship graph" || active === "Founder CRM" ? (
            <GraphView projection={projection} />
          ) : active === "Unified inbox" ? (
            <Inbox events={filteredInbox} />
          ) : (
            <RecommendationList recommendations={selectedRecommendations} />
          )}
        </Card>

        <div className={focusMode ? "hidden" : "grid content-start gap-5"}>
          <SidePanels projection={projection} />
        </div>

        {focusMode && (
          <div
            className="founder-net-hover-rail"
            data-open={sidePeekOpen}
            onMouseEnter={() => setSidePeekOpen(true)}
            onMouseLeave={() => setSidePeekOpen(false)}
            onFocus={() => setSidePeekOpen(true)}
            onBlur={() => setSidePeekOpen(false)}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="founder-net-rail-button"
              aria-label="Show minimized portal blocks"
              aria-expanded={sidePeekOpen}
              onClick={() => setSidePeekOpen((open) => !open)}
            >
              <Network className="size-4" />
            </button>
            <div className="founder-net-hover-drawer">
              <SidePanels projection={projection} compact />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const agentCards: Array<{ id: FounderAgentId; label: string; body: string; icon: ReactNode }> = [
  { id: "investor", label: "Investor Agent", body: "Detects investor fit, fund activity, and relationship timing.", icon: <CircleDollarSign className="size-4" /> },
  { id: "competitor", label: "Competitor Agent", body: "Tracks launches, funding, positioning, and product moves.", icon: <Building2 className="size-4" /> },
  { id: "hiring", label: "Hiring Agent", body: "Turns job posts and team signals into hiring intelligence.", icon: <BriefcaseBusiness className="size-4" /> },
  { id: "customer", label: "Customer Agent", body: "Finds pain, intent, objections, and discovery leads.", icon: <Users className="size-4" /> },
  { id: "research", label: "Research Agent", body: "Ranks papers, benchmarks, claims, and technical shifts.", icon: <Newspaper className="size-4" /> },
  { id: "open-source", label: "Open Source Agent", body: "Monitors repositories, maintainers, velocity, and integrations.", icon: <Code2 className="size-4" /> },
  { id: "growth", label: "Growth Agent", body: "Extracts launch tactics and demand generation signals.", icon: <LineChart className="size-4" /> },
  { id: "pr", label: "PR Agent", body: "Tracks press hooks, journalist surface area, and narrative windows.", icon: <Megaphone className="size-4" /> },
  { id: "funding", label: "Funding Agent", body: "Scores fundraising timing, investors, and strategic capital events.", icon: <Sparkles className="size-4" /> }
];

function titleFor(tab: Tab) {
  if (tab === "Unified inbox") return "AI-Ranked Signal Inbox";
  if (tab === "Founder CRM") return "People, Companies, Investors, Communities";
  if (tab === "Relationship graph") return "Startup Relationship Graph";
  if (tab === "People Discovery") return "Find the people who move the ecosystem";
  return "Agent-Filtered Opportunity Surface";
}

function PeopleDiscovery({
  people,
  category,
  onCategoryChange
}: {
  people: FounderPersonProfile[];
  category: FounderPersonCategory | "All people";
  onCategoryChange: (category: FounderPersonCategory | "All people") => void;
}) {
  return (
    <div className="mt-5 space-y-4">
      <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
        {["All people", ...founderPersonCategories].map((item) => (
          <button
            key={item}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onCategoryChange(item as FounderPersonCategory | "All people");
            }}
            className={`shrink-0 rounded-md border px-3 py-2 text-sm transition ${category === item ? "border-fuchsia-300/45 bg-fuchsia-300/10 text-fuchsia-100" : "border-white/10 bg-white/[0.03] text-slate-300 hover:text-white"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 border-y border-white/10 py-3">
        <div className="flex items-center gap-2 text-base text-slate-200"><UserRound className="size-4 text-fuchsia-200" /> {people.length} public profiles in view</div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">curated signal layer</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {people.map((person) => <PersonCard key={person.id} person={person} />)}
      </div>
      {people.length === 0 && <div className="rounded-md border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">No profiles match this discovery lens.</div>}
    </div>
  );
}

function PersonCard({ person }: { person: FounderPersonProfile }) {
  return (
    <article className="founder-net-row rounded-md border border-white/10 bg-black/20 p-4 transition hover:border-fuchsia-300/30 hover:bg-fuchsia-300/[0.05]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-fuchsia-200">{person.category}</div>
          <h3 className="mt-2 text-lg font-semibold text-white">{person.name}</h3>
          <p className="mt-1 text-sm text-slate-300">{person.role}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-mono text-lg text-fuchsia-100">{person.discoveryScore}</div>
          <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">signal</div>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{person.summary}</p>
      <div className="mt-3 rounded-md border border-white/8 bg-white/[0.04] p-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">Focus</div>
        <div className="mt-1 text-sm leading-6 text-slate-300">{person.focus}</div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {person.tags.map((tag) => <span key={tag} className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-300">{tag}</span>)}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {person.links.map((link) => (
          <a key={link.url} href={link.url} target="_blank" rel="noreferrer" onPointerDown={(event) => event.stopPropagation()} className="inline-flex items-center gap-2 rounded-md border border-cyan-signal/25 bg-cyan-signal/10 px-3 py-2 text-sm font-semibold text-cyan-signal">
            <ExternalLink className="size-3.5" />
            {link.label}
          </a>
        ))}
      </div>
    </article>
  );
}

function Inbox({ events }: { events: FounderNetworkProjection["inbox"] }) {
  return (
    <div className="mt-5 space-y-3">
      {events.map((event) => (
        <article key={event.id} className="founder-net-row rounded-md border border-white/10 bg-black/20 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-signal">{event.platform} / {event.type}</div>
              <h3 className="mt-2 text-lg font-semibold text-white">{event.title}</h3>
              <p className="mt-2 text-base leading-7 text-slate-300">{event.summary}</p>
            </div>
            <span className="shrink-0 rounded-md border border-lime-signal/25 bg-lime-signal/10 px-3 py-1 text-sm text-lime-signal">{event.topUrgency}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {event.tags.map((tag) => <span key={tag} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-sm text-slate-300">{tag}</span>)}
          </div>
          <a href={event.url} target="_blank" rel="noreferrer" onPointerDown={(event) => event.stopPropagation()} className="mt-4 inline-flex rounded-md border border-cyan-signal/30 bg-cyan-signal/10 px-3 py-2 text-base font-semibold text-cyan-signal">
            Open source platform
          </a>
        </article>
      ))}
    </div>
  );
}

function RecommendationList({ recommendations }: { recommendations: FounderNetworkProjection["opportunities"] }) {
  return (
    <div className="mt-5 space-y-3">
      {recommendations.map((item) => (
        <div key={`${item.agent}-${item.eventId}`} className="founder-net-row rounded-md border border-white/10 bg-black/20 p-4">
          <div className="flex justify-between gap-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-fuchsia-200">{item.agent} agent</div>
            <span className="font-mono text-sm text-cyan-signal">{item.urgency}/100</span>
          </div>
          <p className="mt-3 text-base leading-7 text-slate-300">{item.reason}</p>
          <ul className="mt-3 space-y-2">
            {item.nextActions.map((action) => <li key={action} className="text-base leading-7 text-slate-300">{action}</li>)}
          </ul>
          {item.notify && <div className="mt-3 rounded-md border border-rose-signal/30 bg-rose-signal/10 p-2 text-xs text-rose-100">{item.notificationRule}</div>}
        </div>
      ))}
    </div>
  );
}

function GraphView({ projection }: { projection: FounderNetworkProjection }) {
  return (
    <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="founder-net-graph lg:col-span-2">
        {projection.graph.nodes.slice(0, 10).map((node, index) => (
          <span
            key={node.id}
            className={`founder-net-node founder-net-node-${index + 1}`}
            style={{ ["--node-index" as string]: index }}
            aria-label={`${node.label} ${node.type}`}
          >
            <Radio className="size-3" />
          </span>
        ))}
        <div className="founder-net-core">LIVE GRAPH</div>
      </div>
      <div className="space-y-3">
        {projection.graph.nodes.slice(0, 12).map((node) => (
          <div key={node.id} className="founder-net-row rounded-md border border-white/10 bg-black/20 p-3">
            <div className="text-base font-semibold text-white">{node.label}</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{node.type} / {node.platform ?? "internal"}</div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {projection.graph.edges.slice(0, 12).map((edge) => (
          <div key={edge.id} className="founder-net-row rounded-md border border-cyan-signal/15 bg-cyan-signal/8 p-3">
            <div className="text-base font-semibold text-cyan-100">{edge.relation}</div>
            <div className="mt-1 text-sm leading-6 text-slate-300">{edge.sourceId} {"->"} {edge.targetId}</div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="founder-net-meter h-full rounded-full bg-cyan-signal" style={{ width: `${edge.weight}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidePanels({ projection, compact = false }: { projection: FounderNetworkProjection; compact?: boolean }) {
  return (
    <>
      <Card className={compact ? "max-h-[46vh] overflow-y-auto" : ""}>
        <Kicker>Connector Fabric</Kicker>
        <h2 className="mt-2 text-2xl font-semibold text-white">100+ Integration-Ready Architecture</h2>
        <div className="mt-5 grid gap-3">
          {projection.connectorHealth.map((connector) => (
            <div key={connector.platform} className="founder-net-row rounded-md border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-white">{connector.name}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{connector.modes.join(" / ")}</div>
                </div>
                <span className={`shrink-0 rounded-md border px-2 py-1 text-[10px] uppercase ${connector.status === "ready" ? "border-lime-signal/30 bg-lime-signal/10 text-lime-signal" : connector.status === "credential-required" ? "border-cyan-signal/30 bg-cyan-signal/10 text-cyan-signal" : "border-slate-500/30 bg-slate-500/10 text-slate-400"}`}>
                  {connector.status}
                </span>
              </div>
              <div className="mt-3 text-sm text-slate-300">{connector.eventCount} normalized events</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={connector.platformUrl}
                  target="_blank"
                  rel="noreferrer"
                  onPointerDown={(event) => event.stopPropagation()}
                  className="inline-flex items-center gap-2 rounded-md border border-lime-signal/25 bg-lime-signal/10 px-3 py-2 text-sm font-semibold text-lime-signal transition hover:bg-lime-signal/15"
                >
                  <ExternalLink className="size-3.5" />
                  Platform
                </a>
                <a
                  href={connector.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  onPointerDown={(event) => event.stopPropagation()}
                  className="inline-flex items-center gap-2 rounded-md border border-cyan-signal/25 bg-cyan-signal/10 px-3 py-2 text-sm font-semibold text-cyan-signal transition hover:bg-cyan-signal/15"
                >
                  <ExternalLink className="size-3.5" />
                  Integration
                </a>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <Kicker>Agent Mesh</Kicker>
        <h2 className="mt-2 text-2xl font-semibold text-white">Specialized Founder Agents</h2>
        <div className="mt-5 grid gap-2">
          {agentCards.map((agent) => (
            <div key={agent.id} className="founder-net-row flex items-start gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3">
              <span className="mt-0.5 text-cyan-signal">{agent.icon}</span>
              <div>
                <div className="text-base font-semibold text-white">{agent.label}</div>
                <div className="text-sm leading-6 text-slate-400">{agent.body}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function Card({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <section
      onClick={onClick}
      className={`founder-net-card min-w-0 rounded-lg border border-white/10 bg-panel/78 p-5 shadow-glow backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}

function Metric({ label, value, icon, tone = "cyan" }: { label: string; value: number; icon: ReactNode; tone?: "cyan" | "rose" }) {
  return (
    <Card>
      <div className={tone === "rose" ? "text-rose-signal" : "text-cyan-signal"}>{icon}</div>
      <div className="mt-3 text-base text-slate-300">{label}</div>
      <div className="mt-2 text-4xl font-semibold text-white">{value}</div>
    </Card>
  );
}

function Badge({ children, tone = "cyan" }: { children: ReactNode; tone?: "cyan" | "lime" | "rose" }) {
  return (
    <span className={`rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${tone === "lime" ? "border-lime-signal/25 bg-lime-signal/10 text-lime-signal" : tone === "rose" ? "border-rose-signal/25 bg-rose-signal/10 text-rose-signal" : "border-cyan-signal/25 bg-cyan-signal/10 text-cyan-signal"}`}>
      {children}
    </span>
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-signal">{children}</div>;
}
