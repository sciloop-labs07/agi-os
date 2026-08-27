import type { ProofAdapter, ProofResult, TheoremNode } from "@/math-ai/types";

/**
 * Browser-only rewrite exploration intentionally has no authority to verify a
 * theorem. Real verification is performed by the bounded Python adapters and
 * exposed through /api/maths-ai/verified-experiment.
 */
export const previewProofAdapter: ProofAdapter = {
  name: "Browser preview (not a verifier)",
  supportedDomains: [],
  async verify(_theoremNode: TheoremNode): Promise<ProofResult> {
    return {
      status: "unknown",
      engineUsed: this.name,
      notes: "Preview rewrite only. Run Verified Experimental Mode for independently checkable evidence."
    };
  }
};
