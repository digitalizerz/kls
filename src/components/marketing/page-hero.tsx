import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Eyebrow } from "@/components/marketing/eyebrow";
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
      <section className="border-b border-rule bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6 lg:py-16">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-charcoal sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-steel sm:text-lg">{body}</p>
          {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden bg-brand text-white lg:min-h-[520px]">
      <div className="relative h-56 sm:h-72 lg:absolute lg:inset-0 lg:h-auto">
        <Image
          src={siteConfig.heroImage}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/20 to-transparent lg:bg-gradient-to-r lg:from-brand lg:from-8% lg:via-brand/84 lg:via-48% lg:to-transparent" />
      </div>
      <div className="relative mx-auto flex max-w-7xl items-center px-4 py-12 lg:min-h-[520px] lg:px-6 lg:py-16">
        <div className="max-w-3xl">
          <Eyebrow light>{eyebrow}</Eyebrow>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg">{body}</p>
          {actions ? <div className={cn("mt-8 flex flex-col gap-3 sm:flex-row")}>{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}
