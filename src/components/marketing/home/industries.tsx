import { Building2, GraduationCap, Hospital, Landmark, Utensils } from "lucide-react";

const industries = [
  { title: "Restaurants & Food Service", icon: Utensils },
  { title: "Commercial Facilities", icon: Building2 },
  { title: "Educational Institutions", icon: GraduationCap },
  { title: "Healthcare Facilities", icon: Hospital },
  { title: "Government & Institutional", icon: Landmark },
];

export function HomeIndustries() {
  return (
    <section className="bg-sand" aria-labelledby="industries-heading">
      <div className="mx-auto max-w-[90rem] px-4 py-20 lg:px-8 lg:py-28">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-pine">Built for your operation</p>
        <h2 id="industries-heading" className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-inkwell sm:text-5xl">
          Supporting Kitchens Across Industries.
        </h2>
        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {industries.map((industry) => (
            <li key={industry.title} className="flex flex-col items-start gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-black/8 bg-white text-pine">
                <industry.icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <p className="max-w-[10rem] text-sm font-semibold leading-5 text-inkwell">{industry.title}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
