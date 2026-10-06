import { serviceArea } from "@/config/service-area";
import { Eyebrow } from "@/components/marketing/eyebrow";

export function ServiceArea() {
  return (
    <section className="bg-ivory" aria-labelledby="service-area-heading">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-20">
        <Eyebrow>Service area</Eyebrow>
        <h2 id="service-area-heading" className="mt-3 max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-charcoal">
          Grease interceptor service for Houston and Greater Houston.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-steel">
          KLS works with commercial and institutional kitchens in Houston and nearby Texas communities, including{" "}
          {serviceArea.counties.slice(0, -1).join(", ")} and {serviceArea.counties.at(-1)} counties.
        </p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {serviceArea.cities.map((city) => (
            <li key={city} className="border border-rule bg-white px-3 py-2 text-sm font-semibold text-charcoal">
              {city}, TX
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-sm leading-6 text-steel">
          Service depends on the facility, the interceptor, and KLS acceptance of the work. If your location is outside these communities, call and ask.
        </p>
      </div>
    </section>
  );
}
