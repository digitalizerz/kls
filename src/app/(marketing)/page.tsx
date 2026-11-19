import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { HomeClosing } from "@/components/marketing/home/closing";
import { HomeIndustries } from "@/components/marketing/home/industries";
import { PortalShowcase } from "@/components/marketing/home/portal-showcase";
import { HomeServices } from "@/components/marketing/home/services";
import { StatusStrip } from "@/components/marketing/home/status-strip";

export const metadata: Metadata = {
  title: { absolute: "Grease Interceptor Cleaning in Texas | KLS Environmental" },
  description:
    "Grease interceptor cleaning and non-hazardous waste hauling for commercial and institutional facilities across Texas.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="overflow-x-clip bg-white">
      <Hero />
      <StatusStrip />
      <HomeServices />
      <PortalShowcase />
      <HomeIndustries />
      <HomeClosing />
    </div>
  );
}
