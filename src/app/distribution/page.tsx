import type { Metadata } from "next";
import { DistributionPortal } from "@/components/distribution/distribution-portal";

export const metadata: Metadata = {
  title: "Distribution | AGI Research OS",
  description: "Understand, simulate, and improve how AGI OS reaches the right people."
};

export default function DistributionPage() {
  return <DistributionPortal />;
}
