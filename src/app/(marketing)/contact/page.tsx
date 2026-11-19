import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/marketing/contact-form";
import { PageHero } from "@/components/marketing/page-hero";
import { phoneHref, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Request Service in Texas",
  description: `Request grease interceptor service in Texas, or call ${siteConfig.phone} for a spill, backup, or overflow.`,
  alternates: { canonical: "/contact" },
};

const paths = [
  { href: "/contact?need=INTERCEPTOR", title: "Schedule service", body: "Routine or on-demand interceptor service.", emergency: false },
  { href: "/contact?need=RECURRING", title: "Set up recurring service", body: "Establish an ongoing service schedule.", emergency: false },
  { href: "/register", title: "Open an account", body: "Register your business and facilities.", emergency: false },
  { href: phoneHref(), title: "Emergency service", body: "Spill, backup, overflow, or urgent issue.", emergency: true },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ need?: string }>;
}) {
  const { need } = await searchParams;

  return (
    <div className="overflow-x-clip bg-white">
      <PageHero
        compact
        eyebrow="Contact KLS"
        title="Tell us what your facility needs."
        body="Request grease interceptor service, ask about non-hazardous waste hauling, set up a new facility, or get help with your KLS account."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[90rem] px-4 py-16 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-inkwell sm:text-4xl">What can we help with?</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {paths.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={
                    item.emergency
                      ? "is-emergency flex h-full min-h-44 flex-col rounded-[1.5rem] bg-emergency px-6 py-6 text-white transition-colors hover:bg-emergency-hover"
                      : "flex h-full min-h-44 flex-col rounded-[1.5rem] border border-black/8 bg-sand px-6 py-6 transition-colors hover:border-pine"
                  }
                >
                  <span className="text-lg font-bold tracking-[-0.02em]">{item.title}</span>
                  <span className={item.emergency ? "mt-2 text-sm leading-6 text-white/90" : "mt-2 text-sm leading-6 text-steel"}>
                    {item.body}
                  </span>
                  {item.emergency ? <span className="mt-auto pt-6 text-sm font-bold uppercase tracking-[0.06em]">Call 24/7 →</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-pine text-white">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center lg:py-28">
          <h2 className="text-4xl font-extrabold tracking-[-0.045em] sm:text-6xl">Active spill, backup, or overflow?</h2>
          <p className="mt-5 text-lg font-medium text-white/75">Don&apos;t wait for an online response.</p>
          <a
            href={phoneHref()}
            className="is-emergency mt-8 inline-flex h-14 items-center justify-center rounded-md bg-lime px-8 text-base font-bold uppercase tracking-[0.08em] text-inkwell transition-colors hover:bg-white"
          >
            Call KLS now →
          </a>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto grid max-w-[90rem] gap-8 px-4 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-24">
          <div className="rounded-[1.75rem] bg-white p-7 lg:p-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-pine">Contact KLS</p>
            <dl className="mt-6 space-y-6 text-base">
              <div>
                <dt className="text-sm font-semibold text-steel">Phone</dt>
                <dd className="mt-1 text-lg font-bold text-inkwell">
                  <a href={phoneHref()} className="hover:text-pine">
                    {siteConfig.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-steel">General Inquiries</dt>
                <dd className="mt-1 font-semibold text-inkwell">
                  <a href={`mailto:${siteConfig.email}`} className="hover:text-pine">
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-steel">Billing &amp; Accounting</dt>
                <dd className="mt-1 font-semibold text-inkwell">
                  <a href={`mailto:${siteConfig.accountingEmail}`} className="hover:text-pine">
                    {siteConfig.accountingEmail}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-steel">Emergency service</dt>
                <dd className="mt-1 font-semibold text-inkwell">{siteConfig.emergencyAvailability}</dd>
              </div>
            </dl>
          </div>
          {siteConfig.acceptingRequests ? (
            <ContactForm defaultNeed={need} />
          ) : (
            <div className="flex flex-col justify-center rounded-[1.75rem] bg-white px-7 py-10 lg:px-10">
              <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-inkwell">Service requests are not open yet.</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-steel">
                KLS will accept online service requests after regulatory approval. For an active spill, backup, or overflow, call the 24/7 line.
              </p>
              <a
                href={phoneHref()}
                className="is-emergency mt-8 inline-flex h-12 w-fit items-center justify-center rounded-md bg-emergency px-6 text-sm font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-emergency-hover"
              >
                Call 24/7
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
