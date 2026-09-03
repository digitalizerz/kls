const points = [
  {
    title: "Built for food-service operators",
    body: "Accounts belong to the business. Locations and traps sit under the company — not under whoever happened to create a login.",
  },
  {
    title: "Records stay with the asset",
    body: "A downtown interceptor’s history does not get mixed with the airport kitchen. Documents follow the location and trap.",
  },
  {
    title: "Ready for compliance paperwork",
    body: "When the official manifest template is in hand, the data already in the system is what fills it. We will not invent a legal form.",
  },
  {
    title: "A portal your managers can use on a phone",
    body: "Kitchen managers are not sitting at a desk. Service history, upcoming cleanings, and documents have to work on a mobile browser.",
  },
];

export function WhyKls() {
  return (
    <section id="why-kls" className="scroll-mt-20 border-b border-line bg-forest text-cream">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Why KLS</p>
        <h2 className="mt-3 max-w-2xl font-serif text-3xl">
          Dependable field service, with an account structure that matches how restaurants actually operate.
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {points.map((point) => (
            <article key={point.title} className="border-t border-white/15 pt-5">
              <h3 className="text-lg font-semibold">{point.title}</h3>
              <p className="mt-2 text-sm leading-6 text-cream/75">{point.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
