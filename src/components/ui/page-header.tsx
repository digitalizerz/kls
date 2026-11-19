import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  icon,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="flex items-center gap-3">
        {icon ? (
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#e7f5ee] text-dash-rich">
            {icon}
          </span>
        ) : null}
        <div>
          {eyebrow ? (
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-moss">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-dash-ink">{title}</h1>
          {description ? <p className="mt-1 max-w-2xl text-sm leading-6 text-dash-muted">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
