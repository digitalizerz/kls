import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-forest",
        className,
      )}
      {...props}
    />
  );
}
