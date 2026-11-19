import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "About KLS",
  description: "KLS focus, standard, and commitment for grease interceptor service and non-hazardous waste hauling in Texas.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    label: "Our Focus",
    body: "Dependable service and organized execution, built on reliability and precision.",
  },
  {
    label: "Our Standard",
    body: "KLS operates efficiently in the background as your dedicated compliance partner, highlighting your commitment to the environment. Our team ensures every facility maintains continuous, effective compliance under state and local agency guidelines.",
  },
  {
    label: "Our Commitment",
    body: "To build structured environments for precise compliance auditing and seamless non-hazardous waste retrieval. Water preservation and community health require a collaborative effort.",
  },
];

const supports = [
  {
    title: "Dependable and Secure Remediation Schedules",
    body: "Reliable, highly organized stewardship tailored to your specific regulatory needs, with extraction and disposal services arranged for the facility.",
  },
  {
    title: "Uncompromising Detail and Accountability",
    body: "A thorough approach to ensure absolute compliance and system optimization.",
  },
  {
    title: "Collaborative Success",
    body: "Working alongside your team to support health and environmental goals.",
  },
];

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

export default function AboutPage() {
  return (
    <div className="overflow-x-clip bg-white">
      <PageHero
        eyebrow="About KLS"
        title="Built around the facility—not just the service call."
        body="KLS combines grease interceptor service, non-hazardous waste hauling, emergency response, and organized facility records in one straightforward service experience."
        imageAlt="KLS field technician working beside a vacuum truck."
      />

      <section className="bg-sand">
        <div className="mx-auto grid max-w-[90rem] gap-5 px-4 py-16 md:grid-cols-3 lg:px-8 lg:py-24">
          {principles.map((item) => (
            <article
              key={item.label}
              className={
                item.label === "Our Standard"
                  ? "rounded-[1.75rem] bg-pine px-7 py-10 text-white shadow-[0_24px_50px_-32px_rgba(16,28,25,0.55)]"
                  : "rounded-[1.75rem] border border-black/5 bg-white px-7 py-10"
              }
            >
              <h2 className={item.label === "Our Standard" ? "text-[12px] font-bold uppercase tracking-[0.18em] text-lime" : "text-[12px] font-bold uppercase tracking-[0.18em] text-pine"}>
                {item.label}
              </h2>
              <p className={item.label === "Our Standard" ? "mt-5 text-base leading-7 text-white/85" : "mt-5 text-base leading-7 text-steel"}>
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[90rem] gap-12 px-4 py-16 md:grid-cols-3 lg:px-8 lg:py-24">
          {supports.map((item) => (
            <article key={item.title} className="border-t-2 border-lime pt-6">
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-inkwell">{item.title}</h2>
              <p className="mt-4 text-base leading-7 text-steel">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-pine text-white">
        <div className="mx-auto max-w-3xl px-4 py-20 lg:px-8 lg:py-28">
          <p className="text-6xl leading-none text-lime" aria-hidden="true">
            “
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">Your dedicated compliance partner.</h2>
          <p className="mt-6 text-base leading-8 text-white/80 sm:text-lg">
            Serving as your dedicated compliance partner and active regulatory liaison, KLS bridges the gap between daily facility operations and evolving state and local agency requirements. Whether managing non-hazardous industrial waste, municipal solid waste, or liquid waste disposal, our team ensures your operations protect local water resources and strictly adhere to runoff, containment, and state guidelines.
          </p>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-[90rem] px-4 py-20 lg:px-8 lg:py-28">
          <h2 className="max-w-xl text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-inkwell sm:text-5xl">
            More than a truck showing up.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {differences.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] bg-white p-7">
                <h3 className="text-xl font-bold tracking-[-0.02em] text-inkwell">{item.title}</h3>
                <p className="mt-3 text-base leading-7 text-steel">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[360px] lg:min-h-[640px]">
            <Image
              src="/images/home-hero.jpg"
              alt="KLS vacuum truck and technician at a grease interceptor."
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[72%_center]"
            />
          </div>
          <div className="flex items-center bg-pine px-4 py-16 text-white lg:px-16 lg:py-24">
            <div className="max-w-xl">
              <h2 className="text-4xl font-extrabold leading-[1.02] tracking-[-0.04em]">Field service backed by better organization.</h2>
              <p className="mt-5 max-w-md text-base leading-7 text-white/75">
                KLS connects what happens at the facility with the records that come after it.
              </p>
              <div className="mt-10 grid gap-8 sm:grid-cols-[1fr_auto_1fr] sm:items-start">
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-lime">At the facility</p>
                  <ul className="mt-4 space-y-2 text-base font-semibold">
                    {fieldWork.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-3xl font-bold text-lime sm:pt-8" aria-hidden="true">
                  →
                </p>
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-lime">In your KLS account</p>
                  <ul className="mt-4 space-y-2 text-base font-semibold">
                    {accountWork.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-[90rem] px-4 py-20 lg:px-8 lg:py-28">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-pine">Account structure</p>
          <h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-inkwell">
            Built for how organizations actually operate.
          </h2>
          <ol className="mt-12 grid gap-4 md:grid-cols-4">
            {structure.map((item, index) => (
              <li key={item} className="relative rounded-2xl bg-white px-5 py-6">
                {index < structure.length - 1 ? (
                  <span className="absolute top-1/2 -right-3 hidden h-px w-4 bg-lime md:block" aria-hidden="true" />
                ) : null}
                <p className="text-lg font-bold tracking-[-0.02em] text-inkwell">{item}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-3xl text-base leading-7 text-steel">
            A hospital system, university, restaurant group, or other multi-location operator shouldn&apos;t have to mix records between facilities. KLS keeps locations and their service information separated under the business account.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[90rem] px-4 py-20 lg:px-8 lg:py-28">
          <h2 className="max-w-2xl text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-inkwell">
            Documentation shouldn&apos;t become an inspection-day scramble.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-steel">
            KLS helps keep service records and facility documentation organized so your team can more easily retrieve what it has when records are requested.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {docs.map((item) => (
              <li key={item} className="rounded-full border border-black/10 bg-sand px-4 py-2.5 text-sm font-semibold text-inkwell">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-pine text-white">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-8 px-4 py-16 sm:flex-row sm:items-center sm:justify-between lg:px-8 lg:py-20">
          <h2 className="max-w-xl text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
            Looking for a better way to manage interceptor service?
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-md bg-lime px-6 text-sm font-bold uppercase tracking-[0.06em] text-inkwell transition-colors hover:bg-white"
            >
              Request service
            </Link>
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/40 px-6 text-sm font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-white/10"
            >
              Open an account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
