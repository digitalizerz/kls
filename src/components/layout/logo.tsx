import Image from "next/image";
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
  const onDark = tone === "light";

  return (
    <Link href={href} className={cn("inline-flex shrink-0 items-center", onDark && "rounded-lg bg-white px-1.5 py-1")}>
      <Image
        src={compact ? "/images/kls-mark.png" : "/images/kls-logo.png"}
        alt={siteConfig.displayName}
        width={compact ? 261 : 863}
        height={288}
        priority
        className={compact ? "h-8 w-8 object-contain" : "h-10 w-auto"}
      />
    </Link>
  );
}
