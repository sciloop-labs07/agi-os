import { PrismaClient } from "@prisma/client";
import { paradigms } from "../src/lib/paradigms";
import { graphEdges, graphNodes } from "../src/lib/graph";
import { bottleneckMap, frontierItems, hybridArchitectures, ideaMutations, physicsValidations } from "../src/lib/frontier/engine";
import { frontierSources } from "../src/lib/frontier/sources";

const prisma = new PrismaClient();

async function main() {
  for (const paradigm of paradigms) {
    await prisma.aIParadigm.upsert({
      where: { slug: paradigm.slug },
      update: {
        name: paradigm.name,
        summary: paradigm.summary,
        horizon: paradigm.horizon,
        maturity: paradigm.maturity,
        agiPotential: paradigm.metrics.agiPotential,
        energyEfficiency: paradigm.metrics.energyEfficiency,
        scalability: paradigm.metrics.scalability,
        safetyComplexity: 100 - paradigm.metrics.safety,
        economicFeasibility: paradigm.metrics.economicFeasibility
      },
      create: {
        slug: paradigm.slug,
        name: paradigm.name,
        summary: paradigm.summary,
        horizon: paradigm.horizon,
        maturity: paradigm.maturity,
        agiPotential: paradigm.metrics.agiPotential,
        energyEfficiency: paradigm.metrics.energyEfficiency,
        scalability: paradigm.metrics.scalability,
        safetyComplexity: 100 - paradigm.metrics.safety,
        economicFeasibility: paradigm.metrics.economicFeasibility,
        principles: { create: paradigm.principles },
        mechanisms: { create: paradigm.mechanism.map((item, index) => ({ step: index + 1, title: item.title, body: item.body })) },
        equations: { create: paradigm.equations },
        advantages: { create: paradigm.advantages },
        disadvantages: { create: paradigm.disadvantages },
        bottlenecks: { create: paradigm.bottlenecks.map((item) => ({ title: item.title, body: item.body, severity: item.score })) },
        opportunities: { create: paradigm.opportunities.map((item) => ({ title: item.title, body: item.body, leverage: item.score })) },
        predictions: { create: paradigm.timeline },
        companies: { create: paradigm.companies.map((name) => ({ name, focus: paradigm.family })) },
        scientists: { create: paradigm.researchers.map((name) => ({ name, focus: paradigm.family })) }
      }
    });
  }

  for (const node of graphNodes) {
    await prisma.conceptNode.upsert({
      where: { key: node.id },
      update: { label: node.label, type: node.type.toUpperCase() as never, description: node.description },
      create: { key: node.id, label: node.label, type: node.type.toUpperCase() as never, description: node.description }
    });
  }

  for (const edge of graphEdges) {
    const source = await prisma.conceptNode.findUniqueOrThrow({ where: { key: edge.source } });
    const target = await prisma.conceptNode.findUniqueOrThrow({ where: { key: edge.target } });
    await prisma.conceptRelation.create({
      data: {
        sourceId: source.id,
        targetId: target.id,
        relation: edge.label === "depends on" ? "DEPENDS_ON" : edge.label === "complicates" || edge.label === "stresses" ? "CONSTRAINS" : "ENABLES",
        weight: edge.weight
      }
    });
  }

  for (const source of frontierSources) {
    await prisma.intelligenceSource.upsert({
      where: { key: source.id },
      update: {
        name: source.name,
        kind: source.kind.toUpperCase() as never,
        url: source.url,
        cadence: source.cadence.toUpperCase() as never,
        monitorStrategy: source.monitorStrategy.toUpperCase() as never,
        focus: source.focus
      },
      create: {
        key: source.id,
        name: source.name,
        kind: source.kind.toUpperCase() as never,
        url: source.url,
        cadence: source.cadence.toUpperCase() as never,
        monitorStrategy: source.monitorStrategy.toUpperCase() as never,
        focus: source.focus
      }
    });
  }

  for (const item of frontierItems) {
    const source = await prisma.intelligenceSource.findUniqueOrThrow({ where: { key: item.sourceId } });
    const connectedParadigms = await prisma.aIParadigm.findMany({ where: { slug: { in: item.paradigms } } });
    await prisma.frontierResearchItem.create({
      data: {
        externalId: item.id,
        title: item.title,
        url: item.url,
        publishedAt: new Date(item.publishedAt),
        sourceId: source.id,
        paradigms: { connect: connectedParadigms.map((paradigm) => ({ id: paradigm.id })) },
        claims: item.claims,
        mechanisms: item.mechanisms,
        bottlenecks: item.bottlenecks,
        contradictions: item.contradictions,
        convergenceSignals: item.convergenceSignals,
        innovationOpportunities: item.innovationOpportunities,
        importance: item.importance,
        status: item.status.toUpperCase() as never,
        evidenceStrength: item.credibility.evidenceStrength,
        reproducibilityLikelihood: item.credibility.reproducibilityLikelihood,
        hypeScore: item.credibility.hypeScore,
        experimentalValidation: item.credibility.experimentalValidation,
        engineeringFeasibility: item.credibility.engineeringFeasibility,
        thermodynamicFeasibility: item.credibility.thermodynamicFeasibility,
        scalabilityFeasibility: item.credibility.scalabilityFeasibility,
        timelineRealism: item.credibility.timelineRealism
      }
    });
  }

  for (const bottleneck of bottleneckMap) {
    const connectedParadigms = await prisma.aIParadigm.findMany({ where: { slug: { in: bottleneck.affectedParadigms } } });
    await prisma.aGIBottleneckSignal.create({
      data: {
        category: bottleneck.category.replace("-", "_").toUpperCase() as never,
        title: bottleneck.title,
        severity: bottleneck.severity,
        trend: bottleneck.trend.toUpperCase() as never,
        affectedParadigms: { connect: connectedParadigms.map((paradigm) => ({ id: paradigm.id })) },
        evidence: bottleneck.evidence,
        possibleResolutions: bottleneck.possibleResolutions
      }
    });
  }

  for (const architecture of hybridArchitectures) {
    await prisma.hybridArchitecture.upsert({
      where: { key: architecture.id },
      update: {
        name: architecture.name,
        components: architecture.components,
        thesis: architecture.thesis,
        strengths: architecture.strengths,
        weaknesses: architecture.weaknesses,
        requiredBreakthroughs: architecture.requiredBreakthroughs,
        estimatedTimeline: architecture.estimatedTimeline,
        civilizationImpact: architecture.civilizationImpact
      },
      create: {
        key: architecture.id,
        name: architecture.name,
        components: architecture.components,
        thesis: architecture.thesis,
        strengths: architecture.strengths,
        weaknesses: architecture.weaknesses,
        requiredBreakthroughs: architecture.requiredBreakthroughs,
        estimatedTimeline: architecture.estimatedTimeline,
        civilizationImpact: architecture.civilizationImpact,
        evidenceStrength: architecture.feasibility.evidenceStrength,
        reproducibilityLikelihood: architecture.feasibility.reproducibilityLikelihood,
        hypeScore: architecture.feasibility.hypeScore,
        experimentalValidation: architecture.feasibility.experimentalValidation,
        engineeringFeasibility: architecture.feasibility.engineeringFeasibility,
        thermodynamicFeasibility: architecture.feasibility.thermodynamicFeasibility,
        scalabilityFeasibility: architecture.feasibility.scalabilityFeasibility,
        timelineRealism: architecture.feasibility.timelineRealism
      }
    });
  }

  for (const validation of physicsValidations) {
    const architecture = await prisma.hybridArchitecture.findUniqueOrThrow({ where: { key: validation.architectureId } });
    await prisma.physicsValidation.create({
      data: {
        architectureId: architecture.id,
        verdict: validation.verdict.toUpperCase() as never,
        thermodynamics: validation.thermodynamics,
        informationTheory: validation.informationTheory,
        memoryBandwidth: validation.memoryBandwidth,
        energyEfficiency: validation.energyEfficiency,
        fabricationFeasibility: validation.fabricationFeasibility,
        communicationLatency: validation.communicationLatency,
        scalingLimits: validation.scalingLimits,
        notes: validation.notes
      }
    });
  }

  for (const idea of ideaMutations) {
    await prisma.ideaMutation.upsert({
      where: { key: idea.id },
      update: {
        seedIdeas: idea.seedIdeas,
        mutatedHypothesis: idea.mutatedHypothesis,
        unexploredIntersection: idea.unexploredIntersection,
        testPathway: idea.testPathway,
        expectedBreakthroughIfTrue: idea.expectedBreakthroughIfTrue,
        risk: idea.risk
      },
      create: {
        key: idea.id,
        seedIdeas: idea.seedIdeas,
        mutatedHypothesis: idea.mutatedHypothesis,
        unexploredIntersection: idea.unexploredIntersection,
        testPathway: idea.testPathway,
        expectedBreakthroughIfTrue: idea.expectedBreakthroughIfTrue,
        risk: idea.risk
      }
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
