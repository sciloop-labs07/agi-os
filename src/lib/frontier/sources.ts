import type { FrontierSource } from "@/lib/types";

export const frontierSources: FrontierSource[] = [
  { id: "arxiv", name: "arXiv", kind: "paper", url: "https://export.arxiv.org/api/query", cadence: "hourly", monitorStrategy: "api", focus: ["cs.AI", "cs.LG", "cs.NE", "quant-ph", "physics.comp-ph"] },
  { id: "semantic-scholar", name: "Semantic Scholar", kind: "paper", url: "https://api.semanticscholar.org/graph/v1/paper/search", cadence: "daily", monitorStrategy: "api", focus: ["citations", "paper graph", "authors"] },
  { id: "github", name: "GitHub", kind: "code", url: "https://api.github.com/search/repositories", cadence: "hourly", monitorStrategy: "api", focus: ["agents", "benchmarks", "robotics", "neuromorphic", "photonic"] },
  { id: "hugging-face", name: "Hugging Face", kind: "model", url: "https://huggingface.co/api/models", cadence: "hourly", monitorStrategy: "api", focus: ["models", "datasets", "leaderboards"] },
  { id: "openai", name: "OpenAI Research", kind: "lab", url: "https://openai.com/research", cadence: "daily", monitorStrategy: "web", focus: ["frontier models", "agents", "alignment"] },
  { id: "anthropic", name: "Anthropic Research", kind: "lab", url: "https://www.anthropic.com/research", cadence: "daily", monitorStrategy: "web", focus: ["mechanistic interpretability", "alignment", "agents"] },
  { id: "deepmind", name: "Google DeepMind Research", kind: "lab", url: "https://deepmind.google/discover/blog/", cadence: "daily", monitorStrategy: "web", focus: ["robotics", "science", "agents", "reasoning"] },
  { id: "nvidia", name: "NVIDIA Research", kind: "lab", url: "https://research.nvidia.com/", cadence: "weekly", monitorStrategy: "web", focus: ["accelerators", "simulation", "robotics"] },
  { id: "mit", name: "MIT AI Research", kind: "paper", url: "https://news.mit.edu/topic/artificial-intelligence2", cadence: "weekly", monitorStrategy: "web", focus: ["robotics", "neuroscience", "systems"] },
  { id: "stanford", name: "Stanford AI", kind: "paper", url: "https://hai.stanford.edu/news", cadence: "weekly", monitorStrategy: "web", focus: ["policy", "foundation models", "benchmarks"] },
  { id: "nature", name: "Nature", kind: "paper", url: "https://www.nature.com/search", cadence: "weekly", monitorStrategy: "web", focus: ["science AI", "biology", "materials"] },
  { id: "science", name: "Science", kind: "paper", url: "https://www.science.org/action/doSearch", cadence: "weekly", monitorStrategy: "web", focus: ["science AI", "robotics", "bio intelligence"] },
  { id: "semiconductor-news", name: "Semiconductor News", kind: "news", url: "https://www.semianalysis.com/", cadence: "daily", monitorStrategy: "web", focus: ["compute", "memory", "fabrication", "supply chain"] },
  { id: "photonic-companies", name: "Photonic Computing Companies", kind: "news", url: "https://www.lightmatter.co/news", cadence: "weekly", monitorStrategy: "web", focus: ["optical interconnects", "photonic compute"] },
  { id: "neuromorphic-startups", name: "Neuromorphic Startups", kind: "news", url: "https://www.synsense.ai/news/", cadence: "weekly", monitorStrategy: "web", focus: ["spiking chips", "edge intelligence"] },
  { id: "benchmarks", name: "AI Benchmark Releases", kind: "benchmark", url: "https://paperswithcode.com/sota", cadence: "daily", monitorStrategy: "web", focus: ["capability measurement", "regressions", "scaling"] },
  { id: "robotics", name: "Robotics Research", kind: "paper", url: "https://roboticsconference.org/", cadence: "weekly", monitorStrategy: "web", focus: ["embodiment", "control", "world models"] },
  { id: "alignment", name: "AI Alignment Papers", kind: "paper", url: "https://www.alignmentforum.org/", cadence: "daily", monitorStrategy: "web", focus: ["safety", "interpretability", "governance"] },
  { id: "patents", name: "Patents", kind: "patent", url: "https://patents.google.com/", cadence: "weekly", monitorStrategy: "web", focus: ["hardware", "agents", "interfaces"] },
  { id: "funding", name: "Venture Funding Rounds", kind: "funding", url: "https://www.crunchbase.com/", cadence: "weekly", monitorStrategy: "web", focus: ["startup signals", "capital allocation"] }
];
