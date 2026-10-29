import { serviceArea } from "@/config/service-area";
import { Eyebrow } from "@/components/marketing/eyebrow";

export function ServiceArea() {
  return (
    <section className="bg-ivory" aria-labelledby="service-area-heading">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center lg:px-6 lg:py-20">
        <Eyebrow>Service area</Eyebrow>
        <h2 id="service-area-heading" className="mt-3 text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-charcoal">
          Service across Texas, based on the request.
        </h2>
        <p className="mt-4 text-base leading-7 text-steel">
          KLS takes grease interceptor and non-hazardous waste requests from commercial and institutional facilities in {serviceArea.state}. Availability depends on the facility, the interceptor, and KLS acceptance of the work.
        </p>
      </div>
    </section>
  );
}
