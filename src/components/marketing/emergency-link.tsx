import { Phone } from "lucide-react";
import { phoneHref } from "@/config/site";
import { cn } from "@/lib/utils";

export function EmergencyLink({
  className,
  label = "24/7 Emergency Service",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={phoneHref()}
      aria-label={label}
      className={cn(
        "is-emergency inline-flex h-11 items-center justify-center gap-2 bg-emergency px-4 text-sm font-bold uppercase tracking-[0.04em] text-white transition-colors hover:bg-emergency-hover",
        className,
      )}
    >
      <Phone className="h-4 w-4" aria-hidden="true" />
      <span className="sm:hidden">24/7</span>
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
