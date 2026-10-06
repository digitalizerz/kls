import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FileText, FolderOpen, History, Ruler } from "lucide-react";
import { EmergencyLink } from "@/components/marketing/emergency-link";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { PageHero } from "@/components/marketing/page-hero";
import { ServiceArea } from "@/components/marketing/service-area";
import { industries } from "@/config/industries";
import { phoneHref, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Grease Interceptor Cleaning in Houston",
  description:
    "Scheduled grease interceptor cleaning, pumping, and non-hazardous waste hauling for Houston restaurants, hospitals, schools, and food-service facilities.",
  alternates: { canonical: "/services" },
};

const documents = [
  { icon: FileText, title: "Pickup manifests", body: "Keep pickup documentation associated with the correct facility." },
  { icon: Ruler, title: "Interceptor information", body: "Store interceptor capacity and sizing documentation." },
  { icon: History, title: "Service history", body: "Maintain a record of completed service by location." },
  { icon: FolderOpen, title: "Facility documents", body: "Keep relevant building, plumbing, and supporting documentation organized." },
];

const includes = [
  "Scheduled interceptor cleaning",
  "Pumping and removal",
  "Service documentation",
  "Facility and interceptor records",
  "Emergency response when needed",
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="KLS services"
        title="Grease interceptor service built for demanding facilities."
        body="KLS provides grease interceptor cleaning and non-hazardous waste hauling for commercial and institutional facilities with high-volume kitchen operations."
        actions={
          <>
            <Link href="/contact?need=INTERCEPTOR" className="inline-flex h-11 items-center justify-center bg-charcoal px-5 text-sm font-bold text-white hover:bg-black">
              Request service
            </Link>
            <EmergencyLink />
          </>
        }
      />

      <section className="bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[280px] lg:min-h-[520px]">
            <Image
              src={siteConfig.heroImage}
              alt="KLS vacuum truck beside an open grease interceptor."
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[18%_center]"
            />
          </div>
          <div className="flex items-center px-4 py-14 lg:px-14">
            <div className="max-w-lg">
              <p className="text-sm font-bold text-brand">01</p>
              <h2 className="mt-3 text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-charcoal">Grease interceptor cleaning</h2>
              <p className="mt-4 text-base leading-7 text-steel">
                Keep grease interceptors serviced with scheduled cleaning for commercial and institutional kitchen operations.
              </p>
              <p className="mt-4 text-base leading-7 text-steel">
                KLS works with facilities ranging from restaurants and commercial kitchens to hospitals, schools, universities, and food processing operations.
              </p>
              <p className="mt-6 text-sm font-bold text-charcoal">Service can include:</p>
              <ul className="mt-3 space-y-2 text-base text-steel">
                {includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href="/contact?need=INTERCEPTOR" className="mt-8 inline-flex text-sm font-bold text-brand hover:text-brand-deep">
                Request interceptor service →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-rule bg-ivory">
        <div className="grid lg:grid-cols-2">
          <div className="flex items-center px-4 py-14 lg:px-14">
            <div className="max-w-lg">
              <p className="text-sm font-bold text-brand">02</p>
              <h2 className="mt-3 text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-charcoal">Non-hazardous waste hauling</h2>
              <p className="mt-4 text-base leading-7 text-steel">
                KLS provides pickup and hauling of non-hazardous waste associated with commercial and institutional service operations.
              </p>
              <p className="mt-4 text-base leading-7 text-steel">
                We coordinate service around the facility&apos;s needs while maintaining the documentation associated with the pickup and location.
              </p>
              <div className="mt-8 border border-rule bg-white p-5">
                <p className="text-sm font-bold text-charcoal">Need documentation from a previous pickup?</p>
                <p className="mt-2 text-sm leading-6 text-steel">
                  Service records and manifests can remain associated with the facility account for easier retrieval.
                </p>
              </div>
            </div>
          </div>
          <div className="relative min-h-[280px] lg:min-h-[520px]">
            <Image
              src={siteConfig.heroImage}
              alt="KLS technician handling a vacuum hose during a non-hazardous waste pickup."
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[78%_center]"
            />
          </div>
        </div>
      </section>

      <section className="bg-charcoal text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-20">
          <p className="text-sm font-bold text-white/60">03</p>
          <h2 className="mt-3 max-w-xl text-4xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-5xl">When it can&apos;t wait.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/75">
            Spills, backups, overflows, and interceptor problems don&apos;t always happen during a scheduled service window. KLS provides a dedicated 24/7 emergency service line for urgent service needs.
          </p>
          <a
            href={phoneHref()}
            className="is-emergency mt-8 inline-flex h-14 items-center justify-center bg-emergency px-6 text-sm font-bold uppercase tracking-[0.04em] text-white hover:bg-emergency-hover"
          >
            Call 24/7 emergency service
          </a>
          <p className="mt-6 max-w-xl border-l-2 border-white/30 pl-4 text-sm leading-6 text-white/75">
            Portal requests are intended for routine scheduling. For an active emergency, call KLS directly.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
          <Eyebrow>Documentation</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-charcoal sm:text-5xl">
            The service doesn&apos;t end when the truck leaves.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {documents.map((item) => (
              <article key={item.title} className="border border-rule p-5">
                <item.icon className="h-6 w-6 text-brand" strokeWidth={1.75} aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold text-charcoal">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-steel">{item.body}</p>
              </article>
            ))}
          </div>
          <Link href="/register" className="mt-8 inline-flex text-sm font-bold text-brand hover:text-brand-deep">
            Open an account →
          </Link>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-charcoal text-white">
        <Image src={siteConfig.heroImage} alt="" fill sizes="100vw" className="object-cover object-center opacity-30" />
        <div className="absolute inset-0 bg-charcoal/80" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-24">
          <Eyebrow light>Facilities we serve</Eyebrow>
          <h2 className="mt-3 max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            Built around high-volume kitchen operations.
          </h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <li key={industry.title} className="border border-white/15 bg-charcoal/40 px-5 py-5">
                <h3 className="text-lg font-bold">{industry.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/75">{industry.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ServiceArea />

      <section className="bg-brand text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <div>
            <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">Need interceptor service?</h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-white/80">
              Tell us about your facility and we&apos;ll help you determine the next step.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="inline-flex h-11 items-center justify-center bg-white px-5 text-sm font-bold text-charcoal hover:bg-ivory">
              Request service
            </Link>
            <a href={phoneHref()} className="inline-flex h-11 items-center justify-center border border-white/40 px-5 text-sm font-bold text-white hover:bg-white/10">
              Call KLS
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
