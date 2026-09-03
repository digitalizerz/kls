import { Droplets, FileText, PhoneCall, Wrench } from "lucide-react";

const services = [
  {
    icon: Droplets,
    title: "Grease trap pumping & cleaning",
    body: "Scheduled pump-outs for under-sink traps and outdoor interceptors, planned around your kitchen’s hours.",
  },
  {
    icon: FileText,
    title: "Service records & manifests",
    body: "Cleaning reports, photos, and compliance documents live on the location and trap they belong to.",
  },
  {
    icon: PhoneCall,
    title: "Emergency service",
    body: "Slow drains, odors, and backups cannot wait for the next route day. Request priority service from the portal or by phone.",
  },
  {
    icon: Wrench,
    title: "Repair coordination",
    body: "When a trap needs more than a cleaning, we help coordinate the next step so you are not left guessing.",
  },
];

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 border-b border-line bg-panel">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">Services</p>
        <h2 className="mt-3 max-w-2xl font-serif text-3xl text-ink">
          Grease trap work for commercial kitchens — not a software pitch.
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.title} className="border border-line p-6">
              <service.icon className="h-5 w-5 text-clay" />
              <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{service.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
