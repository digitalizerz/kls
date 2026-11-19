import Image from "next/image";
import Link from "next/link";
import { phoneHref, siteConfig } from "@/config/site";

export function Hero() {
  return (
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
        <div className="absolute inset-0 bg-gradient-to-t from-pine via-pine/80 to-pine/55 sm:bg-gradient-to-r sm:from-pine sm:from-[8%] sm:via-pine/88 sm:via-[42%] sm:to-pine/15" />
      </div>
      <div className="relative mx-auto flex min-h-[680px] max-w-[90rem] items-center px-4 pb-32 pt-16 sm:min-h-[700px] lg:min-h-[720px] lg:px-8 lg:pb-36 lg:pt-20">
        <div className="max-w-[68rem]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-lime">
            Grease interceptor &amp; non-hazardous waste services
          </p>
          <h1 className="mt-5 text-[2.05rem] font-extrabold leading-[1.02] tracking-[-0.045em] text-lime sm:text-[2.7rem] lg:text-[3.15rem] xl:text-[3.65rem] xl:leading-[0.98]">
            <span className="block lg:whitespace-nowrap">Grease Interceptor Cleaning.</span>
            <span className="block lg:whitespace-nowrap">Non-Hazardous Waste Hauling.</span>
            <span className="block lg:whitespace-nowrap">Compliance Ready.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base font-normal leading-7 text-white/85 sm:text-lg sm:leading-8">
            Professional grease interceptor cleaning and non-hazardous waste hauling for commercial and institutional facilities with high-volume kitchen operations.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
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
          <p className="mt-6 text-sm text-white/80">
            <a className="font-semibold text-white" href={phoneHref()}>
              {siteConfig.phone}
            </a>
            {" · "}
            {siteConfig.emergencyAvailability}
          </p>
        </div>
      </div>
    </section>
  );
}
