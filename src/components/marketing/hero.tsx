import { ButtonLink } from "@/components/ui/button-link";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="border-b border-line bg-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-6 lg:py-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">
            Commercial grease trap service
          </p>
          <h1 className="mt-4 max-w-xl font-serif text-4xl leading-tight text-ink sm:text-5xl">
            Keep the kitchen running. Keep the inspector satisfied.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted">
            {siteConfig.name} pumps and cleans grease traps for restaurants,
            hotels, and food-service facilities — then stores the service history
            and documents your team needs when compliance comes calling.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/#contact" variant="clay" size="lg">
              Request service
            </ButtonLink>
            <ButtonLink href="/register" variant="secondary" size="lg">
              Register / get started
            </ButtonLink>
          </div>
          <p className="mt-6 text-sm text-muted">
            Multi-location accounts welcome. Call{" "}
            <a className="font-medium text-forest" href={`tel:${siteConfig.phone}`}>
              {siteConfig.phone}
            </a>
          </p>
        </div>
        <HeroSchematic />
      </div>
    </section>
  );
}

function HeroSchematic() {
  return (
    <div className="border border-line bg-panel p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Exterior interceptor — typical layout
      </p>
      <svg viewBox="0 0 420 280" className="mt-4 h-auto w-full text-forest" aria-hidden="true">
        <rect x="1" y="1" width="418" height="278" fill="#f7f5ef" stroke="currentColor" strokeOpacity="0.15" />
        <path d="M40 210 H380" stroke="#c5d1c8" strokeWidth="8" />
        <rect x="90" y="92" width="240" height="118" fill="#16382b" />
        <rect x="104" y="106" width="100" height="90" fill="#1f4d3a" />
        <rect x="216" y="106" width="100" height="90" fill="#3d6b54" />
        <circle cx="154" cy="128" r="10" fill="#f3efe4" />
        <circle cx="266" cy="128" r="10" fill="#f3efe4" />
        <rect x="70" y="70" width="28" height="40" fill="#9a4a24" />
        <rect x="322" y="70" width="28" height="40" fill="#a4844a" />
        <path d="M84 70 V48 H40" fill="none" stroke="#1c1b17" strokeWidth="3" />
        <path d="M336 70 V48 H380" fill="none" stroke="#1c1b17" strokeWidth="3" />
        <text x="40" y="40" fill="#5c5a52" fontSize="11" fontFamily="ui-sans-serif">
          From kitchen
        </text>
        <text x="318" y="40" fill="#5c5a52" fontSize="11" fontFamily="ui-sans-serif">
          To sewer
        </text>
        <text x="118" y="158" fill="#f3efe4" fontSize="12" fontFamily="ui-sans-serif">
          Solids
        </text>
        <text x="232" y="158" fill="#f3efe4" fontSize="12" fontFamily="ui-sans-serif">
          Grease
        </text>
      </svg>
      <p className="mt-3 text-sm leading-6 text-muted">
        We service under-sink traps and outdoor interceptors, document what was
        removed, and keep those records attached to the right location — not
        buried in a shared inbox.
      </p>
    </div>
  );
}
