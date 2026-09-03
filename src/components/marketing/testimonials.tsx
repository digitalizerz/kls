const reviews = [
  {
    quote:
      "We run three kitchens. Having each location’s traps and last service date in one place is the difference between scrambling and being ready.",
    name: "Maria Alvarez",
    role: "Director of Operations, Harbor & Oak Restaurant Group",
  },
  {
    quote:
      "Inspectors want records, not stories. After a cleaning we can pull the report without calling three people.",
    name: "James Whitaker",
    role: "Food & Beverage Manager, Cedar Ridge Hotel",
  },
  {
    quote:
      "They work around receiving hours and actually show up when they say they will. That matters more than a fancy website.",
    name: "Priya Shah",
    role: "Owner, Midtown Market Kitchen",
  },
];

export function Testimonials() {
  return (
    <section id="reviews" className="scroll-mt-20 border-b border-line bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">Customer notes</p>
        <h2 className="mt-3 font-serif text-3xl text-ink">What kitchen managers care about</h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {reviews.map((review) => (
            <blockquote key={review.name} className="border border-line bg-panel p-6">
              <p className="text-sm leading-7 text-ink">“{review.quote}”</p>
              <footer className="mt-5">
                <p className="text-sm font-semibold">{review.name}</p>
                <p className="text-xs text-muted">{review.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
