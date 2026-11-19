import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function DashboardPanel({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.25rem] border border-dash-line bg-white p-5 shadow-[0_12px_30px_-24px_rgba(17,23,20,0.45)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold tracking-[-0.02em] text-dash-ink">{title}</h2>
        <Link
          href={href}
          aria-label={`Open ${title}`}
          className="grid h-8 w-8 place-items-center rounded-full text-dash-muted transition-colors hover:bg-dash-bg hover:text-dash-ink"
        >
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      {children}
    </section>
  );
}
