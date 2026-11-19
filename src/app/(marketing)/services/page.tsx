import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, FileText, FolderOpen, History, Quote, Ruler } from "lucide-react";
import { TexasMap } from "@/components/marketing/home/texas-map";
import { industries } from "@/config/industries";
import { phoneHref } from "@/config/site";

export const metadata: Metadata = {
  title: "Grease Interceptor Cleaning in Texas",
  description:
    "Scheduled grease interceptor cleaning, pumping, and non-hazardous waste hauling for restaurants, hospitals, schools, and food-service facilities in Texas.",
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
    <div className="overflow-x-clip bg-white">
      <section className="relative isolate overflow-hidden bg-pine text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/home-hero.jpg"
            alt="Technician pumping a grease interceptor beside a vacuum truck at a commercial facility."
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pine via-pine/80 to-pine/55 sm:bg-gradient-to-r sm:from-pine sm:from-[8%] sm:via-pine/88 sm:via-[46%] sm:to-pine/20" />
        </div>
        <div className="relative mx-auto flex min-h-[620px] max-w-[90rem] items-center px-4 py-20 lg:min-h-[680px] lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-lime">KLS services</p>
            <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] text-lime sm:text-5xl lg:text-6xl">
              Grease interceptor service built for demanding facilities.
            </h1>
            <p className="mt-6 max-w-xl text-base font-normal leading-7 text-white/85 sm:text-lg sm:leading-8">
              KLS provides grease interceptor cleaning and non-hazardous waste hauling for commercial and institutional facilities with high-volume kitchen operations.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact?need=INTERCEPTOR"
                className="inline-flex h-12 items-center justify-center rounded-md bg-lime px-6 text-sm font-bold uppercase tracking-[0.06em] text-inkwell transition-colors hover:bg-white"
              >
                Request Service
              </Link>
              <a
                href={phoneHref()}
                className="is-emergency inline-flex h-12 items-center justify-center rounded-md border border-white/45 px-6 text-sm font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-white/10"
              >
                24/7 Emergency Service
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="grease-interceptor-cleaning" className="scroll-mt-24 bg-sand">
        <div className="grid lg:grid-cols-2">
          <div className="flex items-center px-4 py-20 lg:px-16 lg:py-28">
            <div className="max-w-xl">
              <Quote className="h-10 w-10 text-pine" strokeWidth={1.5} aria-hidden="true" />
              <h2 className="mt-5 text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-inkwell sm:text-5xl">
                Grease interceptor cleaning
              </h2>
              <p className="mt-5 text-base leading-7 text-steel">
                Keep grease interceptors serviced with scheduled cleaning for commercial and institutional kitchen operations.
              </p>
              <p className="mt-4 text-base leading-7 text-steel">
                KLS works with facilities ranging from restaurants and commercial kitchens to hospitals, schools, universities, and food processing operations.
              </p>
              <p className="mt-8 text-sm font-bold text-inkwell">Service can include:</p>
              <ul className="mt-4 space-y-3">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base text-inkwell">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-pine" strokeWidth={2.5} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/contact?need=INTERCEPTOR" className="mt-8 inline-flex text-sm font-semibold text-pine hover:text-pine-mid">
                Request interceptor service →
              </Link>
            </div>
          </div>
          <div className="relative min-h-[360px] lg:min-h-[720px]">
            <Image
              src="/images/home-interceptor.jpg"
              alt="Vacuum hose entering a grease interceptor opening."
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section id="non-hazardous-waste-hauling" className="scroll-mt-24 bg-white">
        <div className="grid items-center lg:grid-cols-2">
          <div className="relative min-h-[420px] lg:min-h-[680px]">
            <Image
              src="/images/home-hauling.jpg"
              alt="Vacuum truck used for non-hazardous waste hauling."
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-[center_60%]"
            />
            <div className="absolute bottom-6 left-4 right-4 max-w-md rounded-2xl bg-white p-6 shadow-[0_20px_50px_-24px_rgba(16,28,25,0.45)] sm:left-8 lg:bottom-12 lg:left-auto lg:right-8 lg:w-[22rem]">
              <p className="text-base font-bold tracking-[-0.02em] text-inkwell">Need documentation from a previous pickup?</p>
              <p className="mt-2 text-sm leading-6 text-steel">
                Service records and manifests can remain associated with the facility account for easier retrieval.
              </p>
            </div>
          </div>
          <div className="flex items-center px-4 py-16 lg:px-16 lg:py-24">
            <div className="max-w-xl">
              <h2 className="text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-inkwell sm:text-5xl">
                Non-hazardous waste hauling
              </h2>
              <p className="mt-5 text-base leading-7 text-steel">
                KLS provides pickup and hauling of non-hazardous waste associated with commercial and institutional service operations.
              </p>
              <p className="mt-4 text-base leading-7 text-steel">
                We coordinate service around the facility&apos;s needs while maintaining the documentation associated with the pickup and location.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-pine text-white">
        <Image
          src="/images/home-hero.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[80%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pine from-15% via-pine/90 via-45% to-pine/35" />
        <div className="relative mx-auto max-w-[90rem] px-4 py-20 lg:px-8 lg:py-28">
          <h2 className="max-w-xl text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl">When it can&apos;t wait.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
            Spills, backups, overflows, and interceptor problems don&apos;t always happen during a scheduled service window. KLS provides a dedicated 24/7 emergency service line for urgent service needs.
          </p>
          <a
            href={phoneHref()}
            className="is-emergency mt-8 inline-flex h-12 items-center justify-center rounded-md bg-emergency px-6 text-sm font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-emergency-hover"
          >
            Call 24/7 emergency service
          </a>
          <p className="mt-6 max-w-xl text-sm leading-6 text-white/70">
            Portal requests are intended for routine scheduling. For an active emergency, call KLS directly.
          </p>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-[90rem] px-4 py-20 lg:px-8 lg:py-28">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-pine">Documentation</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-inkwell sm:text-5xl">
            The service doesn&apos;t end when the truck leaves.
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {documents.map((item) => (
              <article key={item.title} className="rounded-2xl border border-black/5 bg-white p-7 shadow-[0_16px_40px_-28px_rgba(16,28,25,0.45)]">
                <item.icon className="h-7 w-7 text-pine" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-5 text-xl font-bold tracking-[-0.02em] text-inkwell">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-steel">{item.body}</p>
              </article>
            ))}
          </div>
          <Link href="/register" className="mt-8 inline-flex text-sm font-semibold text-pine hover:text-pine-mid">
            Open an account →
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden bg-pine text-white">
        <div className="mx-auto max-w-[90rem] px-4 py-20 lg:px-8 lg:py-24">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-lime">Facilities we serve</p>
          <h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl">
            Built around high-volume kitchen operations.
          </h2>
          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {industries.map((industry) => (
              <li key={industry.title}>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-lime">
                  <industry.icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="mt-4 max-w-[11rem] text-sm font-semibold leading-5">{industry.title}</h3>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative border-t border-white/10">
          <div className="mx-auto grid max-w-[90rem] items-center gap-8 px-4 py-16 sm:grid-cols-[220px_1fr] lg:px-8 lg:py-20">
            <TexasMap className="h-52 w-full max-w-[220px] text-lime" />
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-lime">Service area</p>
              <h2 className="mt-3 text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl">Service across Texas.</h2>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-8 top-0 hidden h-full w-28 origin-bottom -skew-x-[18deg] bg-sand lg:block" aria-hidden="true" />
        </div>
      </section>
    </div>
  );
}
