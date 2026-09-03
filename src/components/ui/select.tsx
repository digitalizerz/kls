import { cn } from "@/lib/utils";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full border border-line bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-forest",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
