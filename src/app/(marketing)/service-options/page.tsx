import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { PageHero } from "@/components/marketing/page-hero";
import { phoneHref } from "@/config/site";

export const metadata: Metadata = {
  title: "Recurring and Emergency Service",
  description: "Recurring, on-demand, emergency, and multi-site grease interceptor service for facilities in Greater Houston, Texas.",
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

export default function ServiceOptionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Service options"
        title="Service that fits the way your facility operates."
        body="From recurring interceptor cleaning to urgent response and multi-location coordination, KLS offers flexible ways to keep service moving."
        actions={
          <Link href="/contact" className="inline-flex h-11 items-center justify-center bg-charcoal px-5 text-sm font-bold text-white hover:bg-black">
            Request service
          </Link>
        }
      />

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 border-b border-rule px-4 py-16 lg:grid-cols-[1fr_1fr] lg:px-6 lg:py-20">
          <div>
            <p className="text-sm font-bold text-brand">01</p>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-charcoal">Recurring service</h2>
            <p className="mt-4 text-base leading-7 text-steel">
              For facilities that need interceptor service on an ongoing schedule. Schedules can be coordinated around the facility&apos;s operational requirements. These are scheduling options, not a recommendation for every facility.
            </p>
            <Link href="/contact?need=RECURRING" className="mt-6 inline-flex text-sm font-bold text-brand">
              Set up recurring service →
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {intervals.map((item) => (
              <li key={item} className="flex items-center justify-center border border-rule bg-ivory px-4 py-8 text-center text-lg font-bold text-charcoal">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-20">
          <p className="text-sm font-bold text-brand">02</p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-charcoal">On-demand service</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-steel">
            Need service without establishing a recurring schedule? Submit a request with your facility information and service need. KLS can coordinate the next available service opportunity.
          </p>
          <Link href="/contact?need=INTERCEPTOR" className="mt-6 inline-flex text-sm font-bold text-brand">
            Request service →
          </Link>
        </div>
      </section>

      <section className="bg-charcoal text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-20">
          <p className="text-sm font-bold text-emergency">03</p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em]">24/7 emergency service</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75">
            For spills, backups, overflows, and other urgent interceptor service needs.
          </p>
          <p className="mt-4 text-base font-bold">Do not submit an online request for an active emergency.</p>
          <a
            href={phoneHref()}
            className="is-emergency mt-8 inline-flex h-14 items-center justify-center bg-emergency px-6 text-sm font-bold uppercase tracking-[0.04em] text-white hover:bg-emergency-hover"
          >
            Call KLS now
          </a>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-20">
          <p className="text-sm font-bold text-brand">04</p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.03em] text-charcoal">Multi-site service</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-steel">
            For organizations managing multiple kitchens or facilities. One business account can organize each location separately.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {multiSite.map((item) => (
              <li key={item} className="border border-rule px-4 py-4 text-sm font-semibold text-charcoal">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.14em] text-steel">Often used by</p>
          <ul className="mt-3 flex flex-wrap gap-3">
            {examples.map((item) => (
              <li key={item} className="bg-ivory px-4 py-2 text-sm font-semibold text-charcoal">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-rule bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
          <Eyebrow>Compare options</Eyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-charcoal">How the options differ</h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <caption className="sr-only">Comparison of recurring, on-demand, emergency, and multi-site service options</caption>
              <thead>
                <tr className="border-b border-rule">
                  <th scope="col" className="py-3 pr-4 font-bold text-charcoal">
                    <span className="sr-only">Feature</span>
                  </th>
                  {columns.map((column) => (
                    <th key={column} scope="col" className="px-3 py-3 font-bold text-charcoal">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.label} className="border-b border-rule">
                    <th scope="row" className="py-4 pr-4 font-semibold text-charcoal">
                      {row.label}
                    </th>
                    {row.values.map((value, index) => (
                      <td key={columns[index]} className="px-3 py-4 text-steel">
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

      <section className="bg-brand text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <div>
            <h2 className="text-3xl font-bold tracking-[-0.03em]">Not sure which service option you need?</h2>
            <p className="mt-3 text-base text-white/80">Tell KLS about the facility and what you&apos;re dealing with.</p>
          </div>
          <Link href="/contact" className="inline-flex h-11 items-center justify-center bg-white px-5 text-sm font-bold text-charcoal hover:bg-ivory">
            Talk to KLS →
          </Link>
        </div>
      </section>
    </>
  );
}
