import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  href,
  icon: Icon,
  featured = false,
  attention = false,
}: {
  label: string;
  value: number;
  href: string;
  icon: LucideIcon;
  featured?: boolean;
  attention?: boolean;
}) {
  const waiting = attention && value > 0;

  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-[1.25rem] p-5 transition duration-200 motion-reduce:transition-none motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dash-rich",
        featured
          ? "relative overflow-hidden bg-dash-green text-white shadow-[0_18px_40px_-28px_rgba(0,47,37,0.8)]"
          : "border border-dash-line bg-white text-dash-ink shadow-[0_12px_30px_-24px_rgba(17,23,20,0.5)] hover:border-dash-rich/30",
      )}
    >
      {featured ? (
        <span className="pointer-events-none absolute -top-12 -right-8 h-36 w-36 rounded-full bg-dash-rich/70 blur-2xl" aria-hidden="true" />
      ) : null}
      <span className="relative flex items-start justify-between gap-3">
        <span
          className={cn(
            "grid h-10 w-10 place-items-center rounded-xl",
            featured ? "bg-white/10 text-dash-lime" : "bg-dash-bg text-dash-rich",
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <ArrowUpRight
          className={cn("h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5", featured ? "text-white/70" : "text-dash-muted")}
          aria-hidden="true"
        />
      </span>
      <p className={cn("relative mt-6 text-[11px] font-bold uppercase tracking-[0.14em]", featured ? "text-white/70" : "text-dash-muted")}>
        {label}
      </p>
      <p className="relative mt-1 text-4xl font-extrabold tracking-[-0.04em]">{value}</p>
      {waiting ? <p className="relative mt-3 text-xs font-semibold text-warn">Needs review</p> : null}
    </Link>
  );
}
