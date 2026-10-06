import Link from "next/link";
import { Droplets, FileCheck, Siren, Truck } from "lucide-react";
import type { Metadata } from "next";
import { EmergencyCta } from "@/components/marketing/emergency-cta";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { Hero } from "@/components/marketing/hero";
import { ServiceArea } from "@/components/marketing/service-area";
import { phoneHref } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: "Grease Interceptor Cleaning in Houston | KLS Environmental" },
  description:
    "Grease interceptor cleaning and non-hazardous waste hauling for commercial and institutional kitchens in Houston and Greater Houston, Texas.",
  alternates: { canonical: "/" },
};

const pillars = [
  {
    icon: Droplets,
    title: "Grease interceptor cleaning",
    body: "Scheduled cleaning for commercial and institutional kitchen operations.",
  },
  {
    icon: Truck,
    title: "Non-hazardous waste hauling",
    body: "Pickup and hauling tied to the facility and the service.",
  },
  {
    icon: FileCheck,
    title: "Service records",
    body: "Manifests, interceptor information, and history kept with the location.",
  },
  {
    icon: Siren,
    title: "Emergency response",
    body: "A 24/7 line for spills, backups, and overflows.",
  },
];

const steps = [
  ["01", "Set up the facility", "Location, capacity, and the documents you already have."],
  ["02", "Schedule service", "Routine requests in the account. Emergencies by phone."],
  ["03", "Keep the record", "Completed service stays with that facility."],
];

const options = [
  ["Recurring", "An ongoing interceptor schedule."],
  ["On-demand", "Service without a standing schedule."],
  ["Emergency", "Call for an active spill or backup."],
  ["Multi-site", "Separate records for each location."],
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>What KLS does</Eyebrow>
              <h2 className="mt-3 max-w-xl text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-charcoal">
                Cleaning, hauling, and the record that follows.
              </h2>
            </div>
            <Link href="/services" className="text-sm font-bold text-brand hover:text-brand-deep">
              See KLS services →
            </Link>
          </div>
          <div className="mt-10 grid gap-8 border-t border-rule pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((item) => (
              <article key={item.title}>
                <item.icon className="h-6 w-6 text-brand" strokeWidth={1.75} aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold text-charcoal">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-steel">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-charcoal">Request, service, record.</h2>
            </div>
            <Link href="/how-it-works" className="text-sm font-bold text-brand hover:text-brand-deep">
              See how it works →
            </Link>
          </div>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map(([n, title, body]) => (
              <li key={n}>
                <p className="text-sm font-bold text-brand">{n}</p>
                <h3 className="mt-2 text-xl font-bold text-charcoal">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-steel">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-brand text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:flex-row sm:items-end sm:justify-between lg:px-6">
          <div className="max-w-xl">
            <Eyebrow light>Why KLS</Eyebrow>
            <h2 className="mt-3 text-4xl font-bold leading-[1.08] tracking-[-0.03em]">Built around the facility, not just the service call.</h2>
          </div>
          <Link href="/why-kls" className="text-sm font-bold text-white hover:text-white/80">
            Why facilities choose KLS →
          </Link>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>Ways to work with KLS</Eyebrow>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-charcoal">Choose how service is set up.</h2>
            </div>
            <Link href="/service-options" className="text-sm font-bold text-brand hover:text-brand-deep">
              Explore service options →
            </Link>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {options.map(([title, body]) => (
              <li key={title} className="border border-rule px-5 py-5">
                <h3 className="text-lg font-bold text-charcoal">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-steel">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ServiceArea />
      <EmergencyCta />

      <section className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <div>
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-charcoal">Need interceptor service?</h2>
            <p className="mt-2 text-base text-steel">Tell us about the facility, or call if it can&apos;t wait.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="inline-flex h-11 items-center justify-center bg-brand px-5 text-sm font-bold text-white hover:bg-brand-deep">
              Request service
            </Link>
            <a href={phoneHref()} className="inline-flex h-11 items-center justify-center border border-rule px-5 text-sm font-bold text-charcoal hover:border-charcoal">
              Call KLS
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
