import { phoneHref, siteConfig } from "@/config/site";

export function EmergencyCta() {
  return (
    <section className="bg-brand text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-center sm:justify-between lg:px-6 lg:py-14">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-white/70">Need service now?</p>
          <h2 className="mt-2 max-w-xl text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-4xl">
            Spill, backup, overflow, or interceptor issue?
          </h2>
          <p className="mt-3 text-base text-white/80">Call KLS for 24/7 emergency service.</p>
        </div>
        <div className="shrink-0">
          <a
            href={phoneHref()}
            className="is-emergency inline-flex h-14 items-center justify-center bg-emergency px-6 text-base font-bold text-white transition-colors hover:bg-emergency-hover"
          >
            Call KLS now
          </a>
          <p className="mt-2 text-sm text-white/75">
            <a href={phoneHref()} className="font-semibold text-white">
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
