const steps = [
  {
    n: "01",
    title: "Tell us about the operation",
    body: "Register the business, add each location, and identify every grease trap — capacity, on-site location, and cleaning frequency.",
  },
  {
    n: "02",
    title: "Put service on a calendar",
    body: "Request a cleaning from the portal or call. KLS confirms the job and schedules the actual service date.",
  },
  {
    n: "03",
    title: "We clean and document",
    body: "The trap is serviced. Photos, notes, and reports are attached to that location so the next inspection is not a scavenger hunt.",
  },
  {
    n: "04",
    title: "Stay ahead of the next due date",
    body: "Recommended service dates follow the trap’s frequency. Reminders are built in so overdue interceptors do not sneak up on you.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-b border-line bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">How it works</p>
        <h2 className="mt-3 font-serif text-3xl text-ink">From first location to a service record you can hand over.</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-2">
          {steps.map((step) => (
            <li key={step.n} className="border border-line bg-panel p-6">
              <p className="font-serif text-2xl text-clay">{step.n}</p>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
