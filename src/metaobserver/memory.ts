import type { MetaObserverDecision } from "@/metaobserver/types";

const globalForMetaObserver = globalThis as unknown as { metaObserverTimeline?: MetaObserverDecision[] };

export function getMetaObserverTimeline() {
  if (!globalForMetaObserver.metaObserverTimeline) {
    globalForMetaObserver.metaObserverTimeline = [];
  }

  return globalForMetaObserver.metaObserverTimeline;
}

export function rememberMetaObserverDecision(decision: MetaObserverDecision) {
  const timeline = getMetaObserverTimeline();
  if (!timeline.some((item) => item.id === decision.id)) {
    timeline.unshift(decision);
    timeline.splice(80);
  }
  return timeline;
}
