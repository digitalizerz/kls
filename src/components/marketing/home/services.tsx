import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Layers, Leaf } from "lucide-react";
import { siteConfig } from "@/config/site";

const cards = [
  {
    href: "/services#grease-interceptor-cleaning",
    title: "Grease Interceptor Cleaning",
    image: "/images/home-interceptor.jpg",
    alt: "Vacuum hose entering a grease interceptor opening.",
    icon: Layers,
  },
  {
    href: "/services#non-hazardous-waste-hauling",
    title: "Non-Hazardous Waste Hauling",
    image: "/images/home-hauling.jpg",
    alt: "Vacuum truck used for non-hazardous waste hauling.",
    icon: Leaf,
  },
];

export function HomeServices() {
  return (
    <section className="bg-sand" aria-labelledby="home-services-heading">
      <div className="mx-auto grid max-w-[90rem] items-center gap-10 px-4 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:px-8 lg:py-28">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-pine">Our services</p>
          <h2 id="home-services-heading" className="mt-4 max-w-md text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-inkwell sm:text-5xl">
            Environmental Services for Commercial Operations.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-steel">{siteConfig.tagline}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative block min-h-[420px] overflow-hidden rounded-[1.75rem] bg-inkwell shadow-[0_18px_40px_-28px_rgba(16,28,25,0.7)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pine lg:min-h-[480px]"
            >
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
                className="object-cover transition duration-700 motion-reduce:transition-none motion-safe:group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inkwell via-inkwell/25 to-inkwell/5" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                <div>
                  <card.icon className="h-6 w-6 text-lime" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-3 text-[1.65rem] font-bold leading-[1.12] tracking-[-0.03em] text-white">
                    {card.title}
                  </h3>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/50 text-white transition duration-300 group-hover:border-lime group-hover:bg-lime group-hover:text-inkwell motion-reduce:transition-none">
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
