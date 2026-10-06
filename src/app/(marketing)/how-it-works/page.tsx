import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { PageHero } from "@/components/marketing/page-hero";
import { phoneHref } from "@/config/site";

export const metadata: Metadata = {
  title: "How Interceptor Service Works",
  description:
    "How Houston facilities set up an account, schedule grease interceptor service, and keep manifests with each location.",
  alternates: { canonical: "/how-it-works" },
};

const setupItems = ["Facility location", "Interceptor capacity", "Service needs", "Preferred schedule", "Existing documentation"];
const uploads = ["Pickup manifests", "Interceptor sizing documents", "Building plans", "Plumbing plans", "Previous service records"];
const records = ["Service history", "Pickup manifests", "Photos and documents", "Facility information"];
const perLocation = ["Service schedule", "Interceptor information", "Documents", "Service history"];
const needed = [
  ["Business information", "The organization requesting service."],
  ["Facility address", "Where the interceptor is located."],
  ["Interceptor capacity, if known", "Gallons, when you have them."],
  ["Primary contact", "Who KLS should reach."],
  ["Existing documents, if available", "Manifests, sizing documents, or plans."],
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How KLS works"
        title="From service request to complete record."
        body="Whether you manage one kitchen or multiple facilities, KLS keeps the service process straightforward—from facility setup and scheduling through service and documentation."
        imageAlt="KLS technician and vacuum truck at a commercial grease interceptor."
        actions={
          <Link href="/register" className="inline-flex h-11 items-center justify-center bg-white px-5 text-sm font-bold text-charcoal hover:bg-ivory">
            Get started
          </Link>
        }
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <article className="grid gap-8 border-b border-rule py-14 lg:grid-cols-2 lg:py-20">
            <div>
              <p className="text-sm font-bold text-brand">01</p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-charcoal sm:text-4xl">Tell us about your facility</h2>
              <p className="mt-4 text-base leading-7 text-steel">
                Provide the basic information KLS needs to understand the location and service requirement.
              </p>
            </div>
            <ul className="border border-rule bg-ivory p-6">
              {setupItems.map((item) => (
                <li key={item} className="border-b border-rule py-3 text-base font-semibold text-charcoal last:border-0">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="grid gap-8 border-b border-rule py-14 lg:grid-cols-2 lg:py-20">
            <div className="lg:order-2">
              <p className="text-sm font-bold text-brand">02</p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-charcoal sm:text-4xl">Upload what you already have</h2>
              <p className="mt-4 text-base leading-7 text-steel">Already have interceptor or facility documentation? Bring it with you.</p>
              <p className="mt-4 text-sm leading-6 text-steel">Facility documents are treated as confidential operational information.</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:order-1">
              {uploads.map((item) => (
                <li key={item} className="border border-rule px-4 py-4 text-sm font-semibold text-charcoal">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="grid gap-8 border-b border-rule py-14 lg:grid-cols-2 lg:py-20">
            <div>
              <p className="text-sm font-bold text-brand">03</p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-charcoal sm:text-4xl">Schedule service</h2>
              <p className="mt-4 text-base leading-7 text-steel">
                For routine service, customers can submit a service request and coordinate scheduling with KLS. For an urgent spill, backup, or overflow, call the 24/7 emergency line.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-rule p-5">
                <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand">Routine</p>
                <p className="mt-3 text-sm leading-6 text-steel">Request service and coordinate a schedule.</p>
                <Link href="/contact?need=INTERCEPTOR" className="mt-4 inline-flex text-sm font-bold text-brand">
                  Request service →
                </Link>
              </div>
              <div className="border border-emergency/30 bg-emergency/5 p-5">
                <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-emergency">Emergency</p>
                <p className="mt-3 text-sm leading-6 text-steel">Call for a spill, backup, or overflow.</p>
                <a href={phoneHref()} className="mt-4 inline-flex text-sm font-bold text-emergency">
                  Call now →
                </a>
              </div>
            </div>
          </article>

          <article className="grid gap-8 py-14 lg:grid-cols-2 lg:py-20">
            <div className="lg:order-2">
              <p className="text-sm font-bold text-brand">04</p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-charcoal sm:text-4xl">Keep the record</h2>
              <p className="mt-4 text-base leading-7 text-steel">
                After service, relevant records remain associated with the facility so they are easier to retrieve when needed.
              </p>
            </div>
            <ul className="border border-rule lg:order-1">
              {records.map((item) => (
                <li key={item} className="border-b border-rule px-5 py-4 text-base font-semibold text-charcoal last:border-0">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="bg-charcoal text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
          <Eyebrow light>Multiple facilities</Eyebrow>
          <h2 className="mt-3 max-w-xl text-4xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-5xl">One company. Multiple facilities.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/75">
            If an organization operates several locations, each facility can maintain its own records without mixing them between locations.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {perLocation.map((item) => (
              <li key={item} className="border border-white/15 px-5 py-5 text-base font-semibold">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
          <Eyebrow>What you&apos;ll need</Eyebrow>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-charcoal">Setting up your account?</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {needed.map(([title, body]) => (
              <li key={title} className="border border-rule bg-white px-5 py-5">
                <p className="font-bold text-charcoal">{title}</p>
                <p className="mt-1 text-sm leading-6 text-steel">{body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base font-semibold text-charcoal">Don&apos;t have everything yet? That&apos;s okay. Start with what you know.</p>
        </div>
      </section>

      <section className="bg-brand text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <div>
            <h2 className="text-3xl font-bold tracking-[-0.03em]">Ready to get started?</h2>
            <p className="mt-3 text-base text-white/80">Open your KLS account and add your first facility.</p>
          </div>
          <Link href="/register" className="inline-flex h-11 items-center justify-center bg-white px-5 text-sm font-bold text-charcoal hover:bg-ivory">
            Open an account →
          </Link>
        </div>
      </section>
    </>
  );
}
