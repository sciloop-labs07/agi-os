import { paradigms } from "@/lib/paradigms";
import type { GraphEdge, GraphNode } from "@/lib/types";

export const graphNodes: GraphNode[] = [
  ...paradigms.map((paradigm) => ({
    id: paradigm.slug,
    label: paradigm.name,
    type: "paradigm" as const,
    description: paradigm.summary
  })),
  { id: "energy", label: "Energy efficiency", type: "concept", description: "Intelligence produced per joule under useful workloads." },
  { id: "hardware", label: "Hardware maturity", type: "hardware", description: "Manufacturing, toolchains, reliability, and supply chain readiness." },
  { id: "alignment", label: "Alignment surface", type: "concept", description: "Observability, controllability, goal specification, and safety verification." },
  { id: "memory", label: "Persistent memory", type: "concept", description: "State that survives tasks and supports long-horizon reasoning." },
  { id: "embodiment", label: "Embodiment", type: "concept", description: "Closed-loop perception and action in the physical world." },
  { id: "self-improvement", label: "Self-improvement loop", type: "opportunity", description: "Systems that improve tools, models, curricula, and code." }
];

export const graphEdges: GraphEdge[] = [
  { id: "electronic-memory", source: "electronic-ai", target: "memory", label: "enables", weight: 86 },
  { id: "electronic-recursive", source: "electronic-ai", target: "recursive-self-improving-ai", label: "bootstraps", weight: 78 },
  { id: "photonic-energy", source: "photonic-ai", target: "energy", label: "improves", weight: 82 },
  { id: "analog-energy", source: "analog-computing-ai", target: "energy", label: "improves", weight: 85 },
  { id: "neuromorphic-energy", source: "neuromorphic-ai", target: "energy", label: "improves", weight: 90 },
  { id: "robotics-embodiment", source: "embodied-robotics-ai", target: "embodiment", label: "grounds", weight: 92 },
  { id: "bci-alignment", source: "brain-computer-ai", target: "alignment", label: "complicates", weight: 77 },
  { id: "recursive-alignment", source: "recursive-self-improving-ai", target: "alignment", label: "stresses", weight: 96 },
  { id: "multi-agent-collective", source: "multi-agent-intelligence-systems", target: "collective-intelligence", label: "converges", weight: 81 },
  { id: "hybrid-all", source: "hybrid-intelligence-systems", target: "hardware", label: "orchestrates", weight: 74 },
  { id: "hybrid-self", source: "hybrid-intelligence-systems", target: "self-improvement", label: "governs", weight: 80 },
  { id: "synthetic-energy", source: "synthetic-biological-intelligence", target: "energy", label: "approaches", weight: 73 },
  { id: "physics-energy", source: "physics-native-intelligence", target: "energy", label: "approaches", weight: 88 },
  { id: "quantum-hardware", source: "quantum-ai", target: "hardware", label: "depends on", weight: 90 },
  { id: "swarm-embodiment", source: "swarm-intelligence", target: "embodiment", label: "coordinates", weight: 71 }
];
