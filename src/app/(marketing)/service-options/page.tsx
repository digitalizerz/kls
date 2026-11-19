import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/marketing/page-hero";
import { phoneHref } from "@/config/site";

export const metadata: Metadata = {
  title: "Recurring and Emergency Service",
  description: "Recurring, on-demand, emergency, and multi-site grease interceptor service for facilities in Texas.",
  alternates: { canonical: "/service-options" },
};

const intervals = ["Monthly", "Quarterly", "Annual", "Custom interval"];
const multiSite = ["Locations", "Interceptor capacities", "Service requests", "Schedules", "Manifests", "Facility documents", "Service history"];
const examples = ["Restaurant groups", "Hospital systems", "Schools and universities", "Multi-location food-service operators"];

const matrix: { label: string; values: string[] }[] = [
  { label: "Scheduled service", values: ["Yes", "Yes", "—", "Yes"] },
  { label: "Facility records", values: ["Yes", "Yes", "Yes", "Yes"] },
  { label: "Recurring schedule", values: ["Yes", "—", "—", "Yes"] },
  { label: "Urgent response", values: ["—", "—", "Yes", "—"] },
  { label: "Multiple locations", values: ["Optional", "Optional", "—", "Yes"] },
];

const columns = ["Recurring", "On-demand", "Emergency", "Multi-site"];

const steps = [
  ["Tell us about the facility", "Location, interceptor capacity, and the service you need."],
  ["Share what you already have", "Manifests, sizing documents, and plans can come with the account."],
  ["Schedule, or call", "Routine service is requested online. An active emergency is a phone call."],
  ["Keep the record", "Service history stays with that facility."],
];

export default function ServiceOptionsPage() {
  return (
    <div className="overflow-x-clip bg-white">
      <PageHero
        eyebrow="Service options"
        title="Service that fits the way your facility operates."
        body="From recurring interceptor cleaning to urgent response and multi-location coordination, KLS offers flexible ways to keep service moving."
        actions={
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-md bg-lime px-6 text-sm font-bold uppercase tracking-[0.06em] text-inkwell transition-colors hover:bg-white"
          >
            Request service
          </Link>
        }
      />

      <section className="bg-sand">
        <div className="mx-auto max-w-[90rem] px-4 py-20 lg:px-8 lg:py-28">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-pine">How service works</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-[-0.04em] text-inkwell">From the request to the record.</h2>
          <ol className="relative mt-12 grid gap-8 md:grid-cols-4">
            <span className="absolute top-3 right-[12.5%] left-[12.5%] hidden h-px bg-lime md:block" aria-hidden="true" />
            {steps.map(([title, body]) => (
              <li key={title}>
                <span className="relative z-10 grid h-6 w-6 place-items-center rounded-full bg-lime ring-4 ring-sand" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-bold tracking-[-0.02em] text-inkwell">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-steel">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white">
        <div className="grid items-center lg:grid-cols-2">
          <div className="px-4 py-16 lg:px-16 lg:py-24">
            <div className="max-w-xl">
              <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-inkwell">Recurring service</h2>
              <p className="mt-5 text-base leading-7 text-steel">
                For facilities that need interceptor service on an ongoing schedule. Schedules can be coordinated around the facility&apos;s operational requirements. These are scheduling options, not a recommendation for every facility.
              </p>
              <ul className="mt-8 grid grid-cols-2 gap-3">
                {intervals.map((item) => (
                  <li key={item} className="flex min-h-24 items-center justify-center rounded-2xl bg-sand px-4 text-center text-lg font-bold text-inkwell">
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/contact?need=RECURRING" className="mt-8 inline-flex text-sm font-semibold text-pine hover:text-pine-mid">
                Set up recurring service →
              </Link>
            </div>
          </div>
          <div className="relative min-h-[320px] lg:min-h-[560px]">
            <Image
              src="/images/home-hauling.jpg"
              alt="Vacuum truck prepared for scheduled grease interceptor service."
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-sand">
        <div className="grid items-center lg:grid-cols-2">
          <div className="relative min-h-[280px] lg:min-h-[460px]">
            <Image
              src="/images/home-interceptor.jpg"
              alt="Vacuum hose at a grease interceptor during an on-demand service."
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="px-4 py-16 lg:px-16 lg:py-24">
            <div className="max-w-xl">
              <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-inkwell">On-demand service</h2>
              <p className="mt-5 text-base leading-7 text-steel">
                Need service without establishing a recurring schedule? Submit a request with your facility information and service need. KLS can coordinate the next available service opportunity.
              </p>
              <Link href="/contact?need=INTERCEPTOR" className="mt-8 inline-flex text-sm font-semibold uppercase tracking-[0.06em] text-pine hover:text-pine-mid">
                Request service →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-pine text-white">
        <Image src="/images/home-hero.jpg" alt="" fill sizes="100vw" className="object-cover object-[78%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-pine from-10% via-pine/92 via-48% to-pine/30" />
        <div className="relative mx-auto max-w-[90rem] px-4 py-20 lg:px-8 lg:py-28">
          <h2 className="text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">24/7 emergency service</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/80">
            For spills, backups, overflows, and other urgent interceptor service needs.
          </p>
          <p className="mt-4 text-base font-bold">Do not submit an online request for an active emergency.</p>
          <a
            href={phoneHref()}
            className="is-emergency mt-8 inline-flex h-12 items-center justify-center rounded-md bg-emergency px-6 text-sm font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-emergency-hover"
          >
            CALL KLS NOW
          </a>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[90rem] px-4 py-20 lg:px-8 lg:py-28">
          <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-inkwell">Multi-site service</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-steel">
            For organizations managing multiple kitchens or facilities. One business account can organize each location separately.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {multiSite.map((item) => (
              <li key={item} className="rounded-2xl border border-black/8 bg-sand px-4 py-4 text-sm font-semibold text-inkwell">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-[12px] font-bold uppercase tracking-[0.16em] text-pine">Often used by</p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {examples.map((item) => (
              <li key={item} className="rounded-full bg-pine px-4 py-2 text-sm font-semibold text-white">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-[90rem] px-4 py-20 lg:px-8">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-pine">Compare options</p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-inkwell sm:text-4xl">How the options differ</h2>
          <div className="mt-8 overflow-x-auto rounded-[1.5rem] bg-white p-2 sm:p-4">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <caption className="sr-only">Comparison of recurring, on-demand, emergency, and multi-site service options</caption>
              <thead>
                <tr className="border-b border-black/8">
                  <th scope="col" className="px-4 py-4 font-bold text-inkwell">
                    <span className="sr-only">Feature</span>
                  </th>
                  {columns.map((column) => (
                    <th key={column} scope="col" className="px-4 py-4 font-bold text-inkwell">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.label} className="border-b border-black/5 last:border-b-0">
                    <th scope="row" className="px-4 py-4 font-semibold text-inkwell">
                      {row.label}
                    </th>
                    {row.values.map((value, index) => (
                      <td key={columns[index]} className={value === "Yes" ? "px-4 py-4 font-semibold text-pine" : "px-4 py-4 text-steel"}>
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-pine text-white">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-8 px-4 py-16 sm:flex-row sm:items-center sm:justify-between lg:px-8 lg:py-20">
          <div>
            <h2 className="text-3xl font-extrabold tracking-[-0.04em]">Not sure which service option you need?</h2>
            <p className="mt-3 text-base text-white/75">Tell KLS about the facility and what you&apos;re dealing with.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-md bg-lime px-6 text-sm font-bold uppercase tracking-[0.06em] text-inkwell transition-colors hover:bg-white"
          >
            Talk to KLS →
          </Link>
        </div>
      </section>
    </div>
  );
}
