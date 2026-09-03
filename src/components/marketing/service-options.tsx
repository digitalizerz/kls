const options = [
  {
    name: "Recurring cleaning",
    detail: "Monthly, quarterly, or a custom interval matched to kitchen volume and local requirements.",
  },
  {
    name: "On-demand / emergency",
    detail: "Submit a service request with preferred dates. KLS confirms the job — this is not a self-serve calendar.",
  },
  {
    name: "Multi-location programs",
    detail: "One business account. Separate locations, traps, due dates, and documents for each site.",
  },
  {
    name: "Compliance record keeping",
    detail: "Cleaning reports, photos, and future manifests stored against the service that produced them.",
  },
];

export function ServiceOptions() {
  return (
    <section id="service-options" className="scroll-mt-20 border-b border-line bg-panel">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">Service options</p>
        <h2 className="mt-3 font-serif text-3xl text-ink">How operators typically work with us</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Pricing depends on trap size, access, frequency, and location. We quote the work — we do not sell software seats.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {options.map((option) => (
            <article key={option.name} className="flex gap-4 border border-line p-5">
              <span className="mt-1 h-2 w-2 shrink-0 bg-clay" />
              <div>
                <h3 className="font-semibold">{option.name}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{option.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
