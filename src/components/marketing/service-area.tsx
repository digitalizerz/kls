import { serviceArea } from "@/config/service-area";
import { Eyebrow } from "@/components/marketing/eyebrow";

export function ServiceArea() {
  return (
    <section className="bg-ivory" aria-labelledby="service-area-heading">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center lg:px-6 lg:py-20">
        <Eyebrow>Service area</Eyebrow>
        <h2 id="service-area-heading" className="mt-3 text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-charcoal">
          Service across {serviceArea.state}.
        </h2>
      </div>
    </section>
  );
}
