import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  tone = "dark",
  compact = false,
}: {
  href?: string;
  tone?: "dark" | "light" | "public";
  compact?: boolean;
}) {
  const mark =
    tone === "light" ? "bg-cream text-forest" : tone === "public" ? "bg-brand text-white" : "bg-forest text-cream";
  const name = tone === "light" ? "text-cream" : tone === "public" ? "text-charcoal" : "text-ink";
  const sub = tone === "light" ? "text-cream/70" : tone === "public" ? "text-steel" : "text-muted";

  return (
    <Link href={href} className="flex items-center gap-2.5">
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center text-[11px] font-bold",
          tone === "public" ? "tracking-[0.08em]" : "tracking-[0.14em]",
          mark,
        )}
      >
        KLS
      </span>
      {compact ? null : (
        <span className="leading-tight">
          <span className={cn("block text-sm", tone === "public" ? "font-bold" : "font-semibold", name)}>
            {siteConfig.displayName}
          </span>
          <span
            className={cn(
              "block text-[11px] uppercase",
              tone === "public" ? "font-bold tracking-[0.12em]" : "tracking-[0.16em]",
              sub,
            )}
          >
            LLC
          </span>
        </span>
      )}
    </Link>
  );
}
