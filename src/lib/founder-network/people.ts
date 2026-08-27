import type { FounderPlatform } from "@/lib/founder-network/types";

export type FounderPersonCategory =
  | "AI researchers"
  | "Startup founders"
  | "VCs"
  | "Open-source maintainers"
  | "Scientists"
  | "Olympiad winners"
  | "Professors"
  | "Technical bloggers";

export type FounderPersonProfileLink = {
  label: string;
  url: string;
  platform?: FounderPlatform;
};

export type FounderPersonProfile = {
  id: string;
  name: string;
  category: FounderPersonCategory;
  role: string;
  focus: string;
  summary: string;
  discoveryScore: number;
  tags: string[];
  links: FounderPersonProfileLink[];
};

export const founderPeople: FounderPersonProfile[] = [
  {
    id: "person-fei-fei-li",
    name: "Fei-Fei Li",
    category: "AI researchers",
    role: "AI researcher and professor",
    focus: "Human-centered AI, computer vision, spatial intelligence",
    summary: "A high-signal research and startup connector across Stanford, AI4ALL, and spatial intelligence.",
    discoveryScore: 99,
    tags: ["computer vision", "human-centered AI", "spatial intelligence"],
    links: [{ label: "Stanford profile", url: "https://profiles.stanford.edu/fei-fei-li" }]
  },
  {
    id: "person-yoshua-bengio",
    name: "Yoshua Bengio",
    category: "AI researchers",
    role: "AI researcher and scientific director",
    focus: "Deep learning, AI safety, representation learning",
    summary: "A foundational deep learning voice with strong research, policy, and safety signal.",
    discoveryScore: 98,
    tags: ["deep learning", "AI safety", "representation learning"],
    links: [{ label: "Official site", url: "https://yoshuabengio.org/" }]
  },
  {
    id: "person-patrick-collison",
    name: "Patrick Collison",
    category: "Startup founders",
    role: "Co-founder and CEO, Stripe",
    focus: "Internet infrastructure, science, ambitious startups",
    summary: "A founder and ecosystem builder worth tracking for infrastructure, science, and operator networks.",
    discoveryScore: 97,
    tags: ["fintech", "infrastructure", "science"],
    links: [{ label: "Personal site", url: "https://patrickcollison.com/" }]
  },
  {
    id: "person-melanie-perkins",
    name: "Melanie Perkins",
    category: "Startup founders",
    role: "Co-founder and CEO, Canva",
    focus: "Product-led growth, design tools, global teams",
    summary: "A product-led founder signal for distribution, design infrastructure, and global company building.",
    discoveryScore: 95,
    tags: ["product-led growth", "design", "global teams"],
    links: [{ label: "Canva newsroom", url: "https://www.canva.com/newsroom/news/melanie-perkins/" }]
  },
  {
    id: "person-elad-gil",
    name: "Elad Gil",
    category: "VCs",
    role: "Investor and operator",
    focus: "AI, developer tools, network effects, company building",
    summary: "A high-density investor node for AI companies, technical founders, and market formation.",
    discoveryScore: 98,
    tags: ["AI", "developer tools", "seed", "growth"],
    links: [{ label: "Official site", url: "https://www.eladgil.com/" }]
  },
  {
    id: "person-aileen-lee",
    name: "Aileen Lee",
    category: "VCs",
    role: "Founder and managing partner, Cowboy Ventures",
    focus: "Consumer, future of work, breakout startups",
    summary: "An investor perspective on category creation, consumer products, and founder pattern recognition.",
    discoveryScore: 94,
    tags: ["consumer", "future of work", "seed"],
    links: [{ label: "Cowboy Ventures", url: "https://www.cowboy.vc/team/aileen-lee" }]
  },
  {
    id: "person-simon-willison",
    name: "Simon Willison",
    category: "Open-source maintainers",
    role: "Co-creator, Django; independent developer",
    focus: "LLM tooling, developer experience, open-source research",
    summary: "A practical open-source signal for emerging AI tools, experiments, and developer workflows.",
    discoveryScore: 97,
    tags: ["LLM tooling", "Django", "developer experience"],
    links: [{ label: "Blog and projects", url: "https://simonwillison.net/" }]
  },
  {
    id: "person-guillermo-rauch",
    name: "Guillermo Rauch",
    category: "Open-source maintainers",
    role: "CEO, Vercel; open-source maintainer",
    focus: "Web infrastructure, developer platforms, frontend systems",
    summary: "A founder-maintainer node connecting open-source adoption to modern developer platforms.",
    discoveryScore: 96,
    tags: ["web infrastructure", "frontend", "developer platforms"],
    links: [{ label: "Personal site", url: "https://rauchg.com/" }]
  },
  {
    id: "person-jennifer-doudna",
    name: "Jennifer Doudna",
    category: "Scientists",
    role: "Biochemist and professor",
    focus: "CRISPR, genomics, biotechnology translation",
    summary: "A science and biotech node for research translation, company formation, and frontier collaboration.",
    discoveryScore: 96,
    tags: ["CRISPR", "genomics", "biotech"],
    links: [{ label: "Innovative Genomics Institute", url: "https://innovativegenomics.org/about-us/jennifer-doudna/" }]
  },
  {
    id: "person-terence-tao",
    name: "Terence Tao",
    category: "Scientists",
    role: "Mathematician and professor",
    focus: "Harmonic analysis, number theory, collaborative mathematics",
    summary: "A cross-disciplinary research signal spanning mathematics, computation, and scientific collaboration.",
    discoveryScore: 99,
    tags: ["mathematics", "number theory", "research"],
    links: [{ label: "UCLA profile", url: "https://www.math.ucla.edu/~tao/" }]
  },
  {
    id: "person-lisa-sauermann",
    name: "Lisa Sauermann",
    category: "Olympiad winners",
    role: "Mathematician and professor",
    focus: "Combinatorics, extremal mathematics, mathematical talent",
    summary: "A standout mathematical talent signal with a public research profile and academic network.",
    discoveryScore: 91,
    tags: ["IMO gold medalist", "combinatorics", "mathematical talent"],
    links: [{ label: "University profile", url: "https://www.math.uni-hamburg.de/home/sauermann/" }]
  },
  {
    id: "person-evan-chen",
    name: "Evan Chen",
    category: "Olympiad winners",
    role: "Mathematics educator and author",
    focus: "Olympiad mathematics, problem solving, education",
    summary: "A public bridge between elite mathematical problem solving, education, and community building.",
    discoveryScore: 92,
    tags: ["IMO gold medalist", "olympiad", "education"],
    links: [{ label: "Official site", url: "https://web.evanchen.cc/" }]
  },
  {
    id: "person-andrew-ng",
    name: "Andrew Ng",
    category: "Professors",
    role: "AI educator, entrepreneur, and professor",
    focus: "AI education, practical machine learning, startups",
    summary: "A high-leverage professor and operator node for AI learning, talent, and applied company building.",
    discoveryScore: 98,
    tags: ["AI education", "machine learning", "startups"],
    links: [{ label: "Official site", url: "https://www.andrewng.org/" }]
  },
  {
    id: "person-martin-kleppmann",
    name: "Martin Kleppmann",
    category: "Professors",
    role: "Professor and distributed systems researcher",
    focus: "Distributed systems, data-intensive applications, CRDTs",
    summary: "A technical academic node for infrastructure architecture and rigorous systems thinking.",
    discoveryScore: 93,
    tags: ["distributed systems", "data", "CRDTs"],
    links: [{ label: "Research and writing", url: "https://martin.kleppmann.com/" }]
  },
  {
    id: "person-julia-evans",
    name: "Julia Evans",
    category: "Technical bloggers",
    role: "Writer and educator, Wizard Zines",
    focus: "Linux, debugging, systems education, developer learning",
    summary: "A clear technical writing signal for learning how complex systems work from first principles.",
    discoveryScore: 95,
    tags: ["Linux", "debugging", "developer education"],
    links: [{ label: "Blog and zines", url: "https://jvns.ca/" }]
  },
  {
    id: "person-maggie-appleton",
    name: "Maggie Appleton",
    category: "Technical bloggers",
    role: "Designer and technical writer",
    focus: "Developer tools, visual explanations, knowledge systems",
    summary: "A visual thinking signal for explaining technical systems and designing knowledge interfaces.",
    discoveryScore: 90,
    tags: ["visual explanations", "developer tools", "knowledge systems"],
    links: [{ label: "Portfolio and essays", url: "https://maggieappleton.com/" }]
  }
];

export const founderPersonCategories: FounderPersonCategory[] = [
  "AI researchers",
  "Startup founders",
  "VCs",
  "Open-source maintainers",
  "Scientists",
  "Olympiad winners",
  "Professors",
  "Technical bloggers"
];
