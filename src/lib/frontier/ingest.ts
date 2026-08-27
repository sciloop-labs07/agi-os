import { frontierSources } from "./sources";

export type IngestedRawItem = {
  id: string;
  title: string;
  summary: string;
  published?: string;
  sourceId: string;
  url: string;
};

export async function ingestSource(sourceId: string): Promise<IngestedRawItem[]> {
  const source = frontierSources.find((item) => item.id === sourceId);
  if (!source) throw new Error(`Unknown source: ${sourceId}`);

  if (source.id === "arxiv") {
    return ingestArxiv();
  }

  if (source.id === "github") {
    return ingestGithub();
  }

  return [
    {
      id: `${source.id}-monitor-placeholder`,
      sourceId: source.id,
      title: `${source.name} monitor configured`,
      summary: `Live monitor strategy is ${source.monitorStrategy}. Add credentials or an extraction connector for production ingestion.`,
      published: new Date().toISOString(),
      url: source.url
    }
  ];
}

async function ingestArxiv(): Promise<IngestedRawItem[]> {
  const query = encodeURIComponent("cat:cs.AI OR cat:cs.LG OR cat:cs.NE");
  const response = await fetch(`https://export.arxiv.org/api/query?search_query=${query}&start=0&max_results=5&sortBy=submittedDate&sortOrder=descending`, {
    next: { revalidate: 1800 }
  });
  if (!response.ok) throw new Error(`arXiv returned HTTP ${response.status}`);

  const xml = await response.text();
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 5);
  return entries.map((match) => {
    const block = match[1] ?? "";
    const id = extractXml(block, "id");
    return {
      id,
      sourceId: "arxiv",
      title: cleanXml(extractXml(block, "title")),
      summary: cleanXml(extractXml(block, "summary")),
      published: extractXml(block, "published"),
      url: id
    };
  });
}

async function ingestGithub(): Promise<IngestedRawItem[]> {
  const response = await fetch("https://api.github.com/search/repositories?q=AI+agent+benchmark+created:%3E2025-01-01&sort=updated&order=desc&per_page=5", {
    headers: { Accept: "application/vnd.github+json" },
    next: { revalidate: 1800 }
  });
  if (!response.ok) throw new Error(`GitHub returned HTTP ${response.status}`);

  const data = (await response.json()) as { items?: Array<{ id: number; full_name: string; description: string | null; html_url: string; updated_at: string }> };
  return (data.items ?? []).map((item) => ({
    id: String(item.id),
    sourceId: "github",
    title: item.full_name,
    summary: item.description ?? "No repository description provided.",
    published: item.updated_at,
    url: item.html_url
  }));
}

function extractXml(block: string, tag: string) {
  return block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1]?.trim() ?? "";
}

function cleanXml(value: string) {
  return value.replace(/\s+/g, " ").replace(/&amp;/g, "&").trim();
}
