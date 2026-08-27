export type MoneyAudience = "Kid" | "Student" | "Founder" | "Investor" | "Researcher";

export type MoneyLens = {
  id: string;
  label: string;
  shortLabel: string;
  question: string;
  descriptions: Record<MoneyAudience, string>;
  signal: string;
};

export type MoneyEra = {
  id: string;
  year: string;
  label: string;
  need: string;
  leap: string;
  system: string;
};

export const moneyAudiences: MoneyAudience[] = ["Kid", "Student", "Founder", "Investor", "Researcher"];

export const moneyLenses: MoneyLens[] = [
  {
    id: "trust",
    label: "Stored trust",
    shortLabel: "Trust",
    question: "Why will another person accept it?",
    signal: "Agreement",
    descriptions: {
      Kid: "Money works because we agree that it can be traded again.",
      Student: "Money carries a shared promise: someone else is likely to accept it later.",
      Founder: "Money reduces the trust cost of coordinating customers, workers, and suppliers.",
      Investor: "Every monetary asset is a layered claim on institutions, networks, or collateral.",
      Researcher: "Money is a recursively maintained social belief stabilized by institutions and incentives."
    }
  },
  {
    id: "memory",
    label: "Civilization memory",
    shortLabel: "Memory",
    question: "Who gave value, and who may claim it later?",
    signal: "Ledger",
    descriptions: {
      Kid: "Money helps the village remember who already helped.",
      Student: "A balance records unfinished exchange across time.",
      Founder: "Ledgers let value move beyond one relationship or one moment.",
      Investor: "Balance sheets are memory systems for claims, obligations, and ownership.",
      Researcher: "Money compresses social credit histories into transferable state."
    }
  },
  {
    id: "information",
    label: "Price information",
    shortLabel: "Signal",
    question: "What is scarce, wanted, or productive?",
    signal: "Price",
    descriptions: {
      Kid: "Prices tell us when many people want the same thing.",
      Student: "Prices carry information about scarcity and demand.",
      Founder: "Price is feedback about customer value and resource allocation.",
      Investor: "Markets aggregate beliefs about future cash flows, risk, and scarcity.",
      Researcher: "Prices are lossy distributed signals produced by constrained agents."
    }
  },
  {
    id: "coordination",
    label: "Coordination engine",
    shortLabel: "Coordinate",
    question: "How can strangers build together?",
    signal: "Exchange",
    descriptions: {
      Kid: "Money lets people who do not know each other trade fairly.",
      Student: "A common unit makes many different goods easier to compare.",
      Founder: "Money aligns specialized people around a shared production plan.",
      Investor: "Capital coordinates resources toward expected future returns.",
      Researcher: "Money is an incentive protocol for decentralized resource allocation."
    }
  },
  {
    id: "time",
    label: "Stored time",
    shortLabel: "Time",
    question: "Can effort today be used tomorrow?",
    signal: "Saving",
    descriptions: {
      Kid: "You can help today and save the reward for later.",
      Student: "Saving moves purchasing power through time.",
      Founder: "Capital turns past production into future experiments.",
      Investor: "Interest prices time, uncertainty, liquidity, and default risk.",
      Researcher: "Financial claims couple present sacrifice to uncertain future consumption."
    }
  },
  {
    id: "power",
    label: "Incentive power",
    shortLabel: "Power",
    question: "Who may decide where resources flow?",
    signal: "Control",
    descriptions: {
      Kid: "Money gives people choices, but not everyone starts with the same amount.",
      Student: "Money changes what people can choose and which rules affect them.",
      Founder: "Ownership and incentives shape which problems attract talent and capital.",
      Investor: "Capital allocation confers governance rights and option value.",
      Researcher: "Monetary systems distribute agency, bargaining power, and systemic risk."
    }
  }
];

export const moneyEras: MoneyEra[] = [
  { id: "gift", year: "Before 9000 BCE", label: "Gift & memory", need: "Remember mutual help", leap: "Social credit", system: "Relationships" },
  { id: "barter", year: "Early settlements", label: "Barter", need: "Swap useful goods", leap: "Direct exchange", system: "Goods" },
  { id: "commodity", year: "c. 3000 BCE", label: "Commodity money", need: "Carry value", leap: "Shared scarce objects", system: "Shells, grain, salt" },
  { id: "coin", year: "c. 650 BCE", label: "Coins", need: "Verify weight and purity", leap: "Standard minting", system: "Metal" },
  { id: "paper", year: "c. 1000 CE", label: "Paper money", need: "Move value cheaply", leap: "Redeemable claims", system: "Notes" },
  { id: "bank", year: "1400s", label: "Banking", need: "Store and lend", leap: "Networked ledgers", system: "Deposits & credit" },
  { id: "central", year: "1600s-1900s", label: "Central money", need: "Stabilize national systems", leap: "Monetary policy", system: "Fiat currency" },
  { id: "digital", year: "1950s-2000s", label: "Digital money", need: "Exchange at machine speed", leap: "Electronic settlement", system: "Cards & databases" },
  { id: "internet", year: "1990s-2010s", label: "Internet money", need: "Pay across the web", leap: "Global payment rails", system: "Wallets & fintech" },
  { id: "crypto", year: "2009+", label: "Crypto networks", need: "Coordinate without one ledger owner", leap: "Programmable scarcity", system: "Blockchains" },
  { id: "programmable", year: "2020s+", label: "Programmable money", need: "Embed rules in value", leap: "Software-defined assets", system: "Tokens & CBDCs" },
  { id: "machine", year: "Emerging", label: "Machine economies", need: "Let agents transact", leap: "Autonomous exchange", system: "AI wallets & protocols" },
  { id: "planetary", year: "Speculative", label: "Planetary money", need: "Coordinate abundance and scarcity", leap: "Civilization-scale accounting", system: "Energy, compute & trust" }
];

export const futureEconomies = [
  { id: "programmable", horizon: "Now-2035", label: "Programmable value", detail: "Rules, identity, and settlement merge into software." },
  { id: "agent", horizon: "2030s", label: "Agent economies", detail: "AI systems buy compute, data, tools, and services." },
  { id: "robot", horizon: "2035-2060", label: "Robot economies", detail: "Machine labor changes wages, ownership, and taxation." },
  { id: "abundance", horizon: "Mid-century", label: "Abundance systems", detail: "Access rights matter more when marginal costs collapse." },
  { id: "space", horizon: "Long horizon", label: "Space economies", detail: "Delay, energy, and local resources reshape exchange." },
  { id: "post-money", horizon: "Open question", label: "Beyond money?", detail: "Coordination remains even if scarcity radically changes." }
] as const;

export type EconomyInputs = {
  population: number;
  resources: number;
  trust: number;
  productivity: number;
  moneySupply: number;
  taxRate: number;
};

export type EconomyOutput = {
  inflation: number;
  trade: number;
  stability: number;
  wealth: number;
  inequality: number;
  diagnosis: string;
};

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export function simulateEconomy(input: EconomyInputs): EconomyOutput {
  const resourcePressure = input.population / Math.max(input.resources, 1);
  const realCapacity = (input.resources * input.productivity) / 100;
  const excessMoney = input.moneySupply - (80 + realCapacity * 0.42);
  const inflation = clamp(excessMoney * 0.22 + resourcePressure * 13 - input.trust * 0.045, -8, 80);
  const trade = clamp(input.trust * 0.52 + input.productivity * 0.43 + input.moneySupply * 0.1 - Math.max(inflation, 0) * 0.28);
  const stability = clamp(input.trust * 0.58 + input.resources * 0.24 + (100 - Math.abs(inflation) * 2) * 0.18);
  const wealth = clamp((realCapacity * input.trust) / 64 + input.productivity * 0.28 + trade * 0.24);
  const inequality = clamp(62 - input.taxRate * 0.72 + input.productivity * 0.12 + resourcePressure * 5 - input.trust * 0.12);

  let diagnosis = "Exchange is balanced: money, trust, and real production are moving together.";
  if (inflation > 18) diagnosis = "Money is growing faster than goods. Prices accelerate and trust begins to leak.";
  else if (input.trust < 35) diagnosis = "The village can produce, but weak trust blocks exchange and shrinks the network.";
  else if (resourcePressure > 1.8) diagnosis = "Too many claims are chasing scarce resources. Production capacity is the bottleneck.";
  else if (wealth > 74 && stability > 70) diagnosis = "High trust and productivity create a resilient, expanding economy.";

  return { inflation, trade, stability, wealth, inequality, diagnosis };
}

