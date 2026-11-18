import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/marketing/contact-form";
import { Eyebrow } from "@/components/marketing/eyebrow";
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
    <>
      <PageHero
        compact
        eyebrow="Contact KLS"
        title="Tell us what your facility needs."
        body="Request grease interceptor service, ask about non-hazardous waste hauling, set up a new facility, or get help with your KLS account."
      />

      <section className="bg-ivory">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
          <h2 className="text-3xl font-bold tracking-[-0.03em] text-charcoal">What can we help with?</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {paths.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={
                    item.emergency
                      ? "is-emergency flex h-full flex-col bg-emergency px-5 py-5 text-white hover:bg-emergency-hover"
                      : "flex h-full flex-col border border-rule bg-white px-5 py-5 hover:border-charcoal"
                  }
                >
                  <span className="text-lg font-bold">{item.title}</span>
                  <span className={item.emergency ? "mt-2 text-sm leading-6 text-white/90" : "mt-2 text-sm leading-6 text-steel"}>
                    {item.body}
                  </span>
                  {item.emergency ? <span className="mt-4 text-sm font-bold uppercase tracking-[0.04em]">Call 24/7 →</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-charcoal text-white">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center lg:px-6 lg:py-20">
          <h2 className="text-3xl font-bold tracking-[-0.03em] sm:text-5xl">Active spill, backup, or overflow?</h2>
          <p className="mt-4 text-lg font-semibold text-white/80">Don&apos;t wait for an online response.</p>
          <a href={phoneHref()} className="mt-8 inline-flex text-lg font-bold uppercase tracking-[0.06em] text-white">
            Call KLS now →
          </a>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:px-6 lg:py-24">
          <div>
            <Eyebrow>Contact KLS</Eyebrow>
            <dl className="mt-6 space-y-5 text-base">
              <div>
                <dt className="text-sm font-bold text-steel">Phone</dt>
                <dd className="font-semibold text-charcoal">
                  <a href={phoneHref()}>{siteConfig.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-bold text-steel">General Inquiries</dt>
                <dd className="font-semibold text-charcoal">
                  <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-bold text-steel">Billing &amp; Accounting</dt>
                <dd className="font-semibold text-charcoal">
                  <a href={`mailto:${siteConfig.accountingEmail}`}>{siteConfig.accountingEmail}</a>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-bold text-steel">Emergency service</dt>
                <dd className="font-semibold text-charcoal">{siteConfig.emergencyAvailability}</dd>
              </div>
            </dl>
          </div>
          {siteConfig.acceptingRequests ? (
            <ContactForm defaultNeed={need} />
          ) : (
            <div className="border border-rule bg-ivory px-6 py-10">
              <h2 className="text-2xl font-bold tracking-[-0.03em] text-charcoal">Service requests are not open yet.</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-steel">
                KLS will accept online service requests after regulatory approval. For an active spill, backup, or overflow, call the 24/7 line.
              </p>
              <a href={phoneHref()} className="is-emergency mt-6 inline-flex h-11 items-center justify-center bg-emergency px-5 text-sm font-bold text-white hover:bg-emergency-hover">
                Call 24/7
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
