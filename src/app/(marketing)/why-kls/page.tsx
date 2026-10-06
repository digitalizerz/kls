import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { PageHero } from "@/components/marketing/page-hero";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Why Houston Facilities Choose KLS",
  description: "How KLS connects grease interceptor service, non-hazardous hauling, and facility records for Greater Houston kitchens.",
  alternates: { canonical: "/why-kls" },
};

const differences = [
  {
    title: "Service built around your operation",
    body: "Routine service should fit the facility's needs—not the other way around.",
  },
  {
    title: "Records stay with the facility",
    body: "Service history and documents remain associated with the location they belong to.",
  },
  {
    title: "Ready when records are requested",
    body: "Keep manifests, interceptor information, and supporting documents easier to locate when needed.",
  },
  {
    title: "Help when service can't wait",
    body: "A dedicated emergency line gives facilities a direct path when spills, backups, or overflows require urgent attention.",
  },
];

const fieldWork = ["Cleaning", "Pumping", "Waste removal", "Emergency response"];
const accountWork = ["Facility information", "Service history", "Manifests", "Supporting documents"];
const structure = ["One organization", "Multiple facilities", "Individual interceptors", "Service and documentation"];
const docs = ["Pickup manifests", "Sizing documents", "Service records", "Plans", "Photos"];

export default function WhyKlsPage() {
  return (
    <>
      <PageHero
        eyebrow="Why KLS"
        title="Built around the facility—not just the service call."
        body="KLS combines grease interceptor service, non-hazardous waste hauling, emergency response, and organized facility records in one straightforward service experience."
        imageAlt="KLS field technician working beside a vacuum truck."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
          <h2 className="max-w-xl text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-charcoal sm:text-5xl">
            More than a truck showing up.
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {differences.map((item) => (
              <article key={item.title} className="border-t border-rule pt-6">
                <h3 className="text-xl font-bold text-charcoal">{item.title}</h3>
                <p className="mt-3 text-base leading-7 text-steel">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[320px]">
            <Image
              src={siteConfig.heroImage}
              alt="KLS vacuum truck and technician at a grease interceptor."
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[72%_center]"
            />
          </div>
          <div className="bg-brand px-4 py-14 text-white lg:px-14 lg:py-20">
            <h2 className="text-4xl font-bold leading-[1.08] tracking-[-0.03em]">Field service backed by better organization.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-white/80">
              KLS connects what happens at the facility with the records that come after it.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-[1fr_auto_1fr] sm:items-start">
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-white/60">At the facility</p>
                <ul className="mt-4 space-y-2 text-base font-semibold">
                  {fieldWork.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <p className="text-2xl font-bold sm:pt-8" aria-hidden="true">→</p>
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-white/60">In your KLS account</p>
                <ul className="mt-4 space-y-2 text-base font-semibold">
                  {accountWork.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
          <Eyebrow>Account structure</Eyebrow>
          <h2 className="mt-3 max-w-xl text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-charcoal">
            Built for how organizations actually operate.
          </h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {structure.map((item, index) => (
              <li key={item} className="border border-rule bg-white px-5 py-5">
                <p className="text-sm font-bold text-brand">0{index + 1}</p>
                <p className="mt-3 text-lg font-bold text-charcoal">{item}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-3xl text-base leading-7 text-steel">
            A hospital system, university, restaurant group, or other multi-location operator shouldn&apos;t have to mix records between facilities. KLS keeps locations and their service information separated under the business account.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
          <h2 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-charcoal">
            Documentation shouldn&apos;t become an inspection-day scramble.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-steel">
            KLS helps keep service records and facility documentation organized so your team can more easily retrieve what it has when records are requested.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {docs.map((item) => (
              <li key={item} className="border border-rule px-4 py-3 text-sm font-semibold text-charcoal">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-brand text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <h2 className="max-w-xl text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            Looking for a better way to manage interceptor service?
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="inline-flex h-11 items-center justify-center bg-white px-5 text-sm font-bold text-charcoal hover:bg-ivory">
              Request service
            </Link>
            <Link href="/register" className="inline-flex h-11 items-center justify-center border border-white/50 px-5 text-sm font-bold text-white hover:bg-white/10">
              Open an account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
