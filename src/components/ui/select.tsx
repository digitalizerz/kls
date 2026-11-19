import { cn } from "@/lib/utils";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "select-caret h-12 w-full rounded-xl border border-dash-line bg-white px-3 text-sm text-dash-ink outline-none transition-colors focus:border-dash-rich focus:ring-2 focus:ring-dash-rich/20 disabled:bg-dash-bg disabled:text-dash-muted",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
