import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  tone = "dark",
  compact = false,
}: {
  href?: string;
  tone?: "dark" | "light";
  compact?: boolean;
}) {
  return (
    <Link href={href} className="flex items-center gap-2.5">
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center text-[11px] font-bold tracking-[0.14em]",
          tone === "light" ? "bg-cream text-forest" : "bg-forest text-cream",
        )}
      >
        KLS
      </span>
      {compact ? null : (
        <span className="leading-tight">
          <span className={cn("block text-sm font-semibold", tone === "light" ? "text-cream" : "text-ink")}>
            KLS Environmental
          </span>
          <span
            className={cn(
              "block text-[11px] uppercase tracking-[0.16em]",
              tone === "light" ? "text-cream/70" : "text-muted",
            )}
          >
            LLC
          </span>
        </span>
      )}
    </Link>
  );
}
