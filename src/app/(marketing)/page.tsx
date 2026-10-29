import type { Metadata } from "next";
import { EmergencyCta } from "@/components/marketing/emergency-cta";
import { Hero } from "@/components/marketing/hero";
import { ServiceArea } from "@/components/marketing/service-area";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Grease Interceptor Cleaning in Texas | KLS Environmental" },
  description:
    "Grease interceptor cleaning and non-hazardous waste hauling for commercial and institutional facilities across Texas, based on the request.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceArea />
      <EmergencyCta />
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center lg:px-6 lg:py-24">
          <h2 className="text-4xl font-bold tracking-[-0.03em] text-charcoal sm:text-5xl">Ready to get started?</h2>
          <div className="mt-8 flex justify-center">
            <Link href="/contact" className="inline-flex h-12 items-center justify-center bg-brand px-6 text-sm font-bold text-white hover:bg-brand-deep">
              Request service
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
