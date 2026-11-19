import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-xl border border-dash-line bg-white px-3 py-3 text-sm text-dash-ink outline-none transition-colors placeholder:text-dash-muted focus:border-dash-rich focus:ring-2 focus:ring-dash-rich/20 disabled:bg-dash-bg disabled:text-dash-muted",
        className,
      )}
      {...props}
    />
  );
}
