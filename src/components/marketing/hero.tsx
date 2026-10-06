import Image from "next/image";
import Link from "next/link";
import { phoneHref, siteConfig } from "@/config/site";
import { EmergencyLink } from "@/components/marketing/emergency-link";
import { Eyebrow } from "@/components/marketing/eyebrow";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand text-white lg:min-h-[700px]">
      <div className="relative h-72 sm:h-96 lg:absolute lg:inset-0 lg:h-auto">
        <Image
          src={siteConfig.heroImage}
          alt="KLS vacuum truck and technician pumping a grease interceptor at a commercial facility."
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/15 to-transparent lg:bg-gradient-to-r lg:from-brand lg:from-10% lg:via-brand/82 lg:via-46% lg:to-transparent" />
      </div>
      <div className="relative mx-auto flex max-w-7xl items-center px-4 py-10 lg:min-h-[700px] lg:px-6 lg:py-20">
        <div className="max-w-4xl">
          <Eyebrow light>Grease interceptor & non-hazardous waste services</Eyebrow>
          <h1 className="mt-4 text-[2.15rem] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[2.75rem] lg:text-[3.15rem]">
            Grease Interceptor Cleaning.
            <br />
            Non-Hazardous Waste Hauling.
            <br />
            Compliance Ready.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
            Professional grease interceptor cleaning and non-hazardous waste hauling for commercial and institutional facilities with high-volume kitchen operations.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/contact"
              className="inline-flex h-11 w-full items-center justify-center bg-charcoal px-5 text-sm font-bold text-white transition-colors hover:bg-black sm:w-auto"
            >
              Request service
            </Link>
            <EmergencyLink className="w-full sm:w-auto" />
            <Link
              href="/register"
              className="inline-flex h-11 w-full items-center justify-center border border-white/80 bg-white px-5 text-sm font-bold text-charcoal transition-colors hover:bg-ivory sm:w-auto"
            >
              Open an account
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/80">
            <a className="font-semibold text-white" href={phoneHref()}>
              {siteConfig.phone}
            </a>
            {" · "}
            {siteConfig.emergencyAvailability}
            {" · "}
            Office {siteConfig.officeHours}
          </p>
        </div>
      </div>
    </section>
  );
}
