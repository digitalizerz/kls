import Image from "next/image";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  body,
  actions,
  compact = false,
  imageAlt = "KLS vacuum truck and technician pumping a grease interceptor.",
}: {
  eyebrow: string;
  title: string;
  body: string;
  actions?: React.ReactNode;
  compact?: boolean;
  imageAlt?: string;
}) {
  if (compact) {
    return (
      <section className="bg-sand">
        <div className="mx-auto max-w-[90rem] px-4 py-16 lg:px-8 lg:py-24">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-pine">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] text-inkwell sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-steel sm:text-lg">{body}</p>
          {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden bg-pine text-white">
      <div className="absolute inset-0">
        <Image
          src="/images/home-hero.jpg"
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pine via-pine/80 to-pine/55 sm:bg-gradient-to-r sm:from-pine sm:from-[8%] sm:via-pine/88 sm:via-[46%] sm:to-pine/20" />
      </div>
      <div className="relative mx-auto flex min-h-[560px] max-w-[90rem] items-center px-4 py-20 lg:min-h-[640px] lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-lime">{eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] text-lime sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-base font-normal leading-7 text-white/85 sm:text-lg sm:leading-8">{body}</p>
          {actions ? <div className={cn("mt-8 flex flex-col gap-3 sm:flex-row")}>{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}
