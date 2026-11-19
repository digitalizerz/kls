import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-xl border border-dash-line bg-white px-3 text-sm text-dash-ink outline-none transition-colors placeholder:text-dash-muted focus:border-dash-rich focus:ring-2 focus:ring-dash-rich/20 disabled:bg-dash-bg disabled:text-dash-muted read-only:bg-dash-bg read-only:text-dash-muted",
        className,
      )}
      {...props}
    />
  );
}
