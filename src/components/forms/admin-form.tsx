import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";

export type FormCrumb = { href?: string; label: string };

export type FormGuidance = {
  title: string;
  body: string;
  points: string[];
};

export function FormBreadcrumbs({ items }: { items: FormCrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-dash-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {item.href && !last ? (
                <Link href={item.href} className="hover:text-dash-ink">
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "font-medium text-dash-ink" : undefined} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function FormPageHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#e7f5ee] text-dash-rich">{icon}</span>
      <div>
        <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-dash-ink">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm leading-6 text-dash-muted">{description}</p> : null}
      </div>
    </div>
  );
}

export function FormSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.25rem] border border-dash-line bg-white p-5 shadow-[0_10px_30px_-24px_rgba(17,23,20,0.45)] sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e7f5ee] text-dash-rich">{icon}</span>
        <div>
          <h2 className="text-base font-semibold text-dash-ink">{title}</h2>
          {description ? <p className="mt-0.5 text-sm text-dash-muted">{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export function FormGuidancePanel({ guidance }: { guidance: FormGuidance }) {
  return (
    <aside className="h-fit rounded-[1.25rem] border border-[#d7eadf] bg-[#f3faf6] p-5 lg:sticky lg:top-6">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-dash-rich">
          <Info className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-semibold text-dash-ink">{guidance.title}</h2>
          <p className="mt-2 text-sm leading-6 text-dash-muted">{guidance.body}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold text-dash-ink">What happens next?</p>
        <ul className="mt-2 space-y-2">
          {guidance.points.map((point) => (
            <li key={point} className="flex gap-2 text-sm leading-5 text-dash-ink">
              <span className="mt-0.5 text-dash-rich" aria-hidden="true">✓</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export function AdminFormFrame({
  breadcrumbs,
  icon,
  title,
  description,
  guidance,
  children,
}: {
  breadcrumbs?: FormCrumb[];
  icon: React.ReactNode;
  title: string;
  description?: string;
  guidance?: FormGuidance;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      {breadcrumbs ? <FormBreadcrumbs items={breadcrumbs} /> : null}
      <FormPageHeader icon={icon} title={title} description={description} />
      <div className={cn("grid items-start gap-6", guidance && "xl:grid-cols-[minmax(0,1fr)_300px]")}>
        <div className="space-y-4">{children}</div>
        {guidance ? <FormGuidancePanel guidance={guidance} /> : null}
      </div>
    </div>
  );
}

export function FormActions({
  pending,
  submitLabel,
  pendingLabel,
  cancelHref,
}: {
  pending: boolean;
  submitLabel: string;
  pendingLabel: string;
  cancelHref?: string;
}) {
  return (
    <div className="mt-2 flex flex-col-reverse gap-2 rounded-2xl border border-dash-line bg-white p-3 shadow-[0_10px_30px_-20px_rgba(17,23,20,0.35)] sm:flex-row sm:justify-end">
      {cancelHref ? (
        <ButtonLink
          href={cancelHref}
          variant="secondary"
          className="border-dash-line bg-white text-dash-ink hover:border-dash-rich hover:bg-dash-bg"
        >
          Cancel
        </ButtonLink>
      ) : null}
      <Button type="submit" disabled={pending} className="bg-dash-green text-white hover:bg-dash-forest">
        {pending ? pendingLabel : submitLabel}
        {pending ? null : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
      </Button>
    </div>
  );
}
