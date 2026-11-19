import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("field", className)}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-dash-ink">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-dash-muted">{hint}</p> : null}
    </div>
  );
}
